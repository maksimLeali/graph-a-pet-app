import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Chip, Icon, PullToRefresh } from "@components";
import { ShelterVerificationStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterQuery } from "../operations/__generated__/getShelter.generated";
import { useListShelterClaimRequestsQuery } from "../operations/__generated__/listShelterClaimRequests.generated";
import {
	useRequestShelterClaimMutation,
	useCancelShelterClaimMutation,
	useUpdateShelterClaimDocumentsMutation,
} from "../operations/__generated__/shelterClaimRequest.generated";
import { useCreateMediaMutation } from "../../../components/operations/__generated__/createMedia.generated";
import { useShelterAuthorization } from "../hooks/useShelterAuthorization";

const DOCUMENT_SCOPE = "shelter_claim_document";

type DraftDocument = {
	id?: string;
	media_id: string | null;
	url: string | null;
	file_name: string | null;
	description: string;
	uploading: boolean;
	status?: string;
	reviewer_note?: string | null;
};

const emptyDocument = (): DraftDocument => ({
	media_id: null,
	url: null,
	file_name: null,
	description: "",
	uploading: false,
});

const isImage = (url: string | null) =>
	!!url && /\.(png|jpe?g|gif|webp|avif)($|\?)/i.test(url);

export const ShelterVerification: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();

	useEffect(() => {
		setPage({ name: t("shelters.tabs.verification") });
	}, []);

	const { data, loading } = useGetShelterQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { id },
	});
	const shelter = data?.getShelter?.shelter ?? undefined;
	const isVerified =
		!!shelter && shelter.verification_status === ShelterVerificationStatus.Verified;

	const { can } = useShelterAuthorization(id);
	const canRequest = can("shelters.claim.create");

	const {
		data: claimsData,
		loading: loadingClaims,
		refetch: refetchClaims,
	} = useListShelterClaimRequestsQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: {
			shelter_id: id,
			search: {
				page: 0,
				page_size: 5,
				filters: { fixed: [{ key: "status", value: "PENDING" }] },
			},
		},
	});
	const pendingClaim = (claimsData?.listShelterClaimRequests?.items ?? []).filter(
		(c): c is NonNullable<typeof c> => !!c
	)[0];
	const fetchError = claimsData?.listShelterClaimRequests?.error?.message;
	const pendingDocuments: DraftDocument[] = (
		(pendingClaim?.proof_data as { documents?: DraftDocument[] } | null)?.documents ?? []
	).map((d) => ({ ...d, uploading: false, description: d.description ?? "" }));
	const changeRequested = pendingDocuments.some(
		(d) => d.status === "CHANGE_REQUESTED"
	);

	const [requestClaim, { loading: requestingClaim }] = useRequestShelterClaimMutation();
	const [cancelClaim] = useCancelShelterClaimMutation();
	const [updateDocuments, { loading: updatingDocuments }] =
		useUpdateShelterClaimDocumentsMutation();
	const [createMedia] = useCreateMediaMutation();

	const [showForm, setShowForm] = useState(false);
	const [message, setMessage] = useState("");
	const [documents, setDocuments] = useState<DraftDocument[]>([emptyDocument()]);
	// sostituzione documenti su una richiesta già in revisione
	const [replacements, setReplacements] = useState<DraftDocument[] | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const pickTarget = useRef<{ list: "form" | "pending"; index: number } | null>(null);

	const setDoc = (
		list: "form" | "pending",
		index: number,
		patch: Partial<DraftDocument>
	) => {
		const apply = (docs: DraftDocument[]) =>
			docs.map((d, i) => (i === index ? { ...d, ...patch } : d));
		if (list === "form") setDocuments(apply);
		else setReplacements((docs) => (docs ? apply(docs) : docs));
	};

	const pickFile = (list: "form" | "pending", index: number) => {
		pickTarget.current = { list, index };
		fileInputRef.current?.click();
	};

	const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		const target = pickTarget.current;
		if (!file || !target) return;
		const { list, index } = target;
		setDoc(list, index, { uploading: true, file_name: file.name });
		try {
			const formData = new FormData();
			formData.append("file", file, file.name);
			formData.append("disable_colors", "true");
			const upload = await axios.post(
				`${import.meta.env.VITE_MEDIA_URL}/upload`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			const url: string = upload.data.public_url;
			const type = (file.name.split(".").pop() || "file").toLowerCase();
			const res = await createMedia({
				variables: {
					data: { url, type, scope: DOCUMENT_SCOPE, ref_id: id },
				},
			});
			const mediaId = res.data?.createMedia?.media?.id;
			if (!mediaId) throw new Error("createMedia failed");
			setDoc(list, index, { media_id: mediaId, url, uploading: false });
		} catch (err) {
			console.error(err);
			toast.error(t("messages.errors.fetch"));
			setDoc(list, index, { uploading: false, file_name: null });
		}
	};

	const documentsValid = (docs: DraftDocument[]) =>
		docs.length > 0 &&
		docs.every((d) => d.media_id && d.description.trim().length > 0);

	const onRequest = async () => {
		if (!documentsValid(documents)) {
			toast.error(t("shelters.claim.missing_document"));
			return;
		}
		const res = await requestClaim({
			variables: {
				shelter_id: id,
				data: {
					message: message || undefined,
					proof_data: {
						documents: documents.map((d) => ({
							media_id: d.media_id,
							url: d.url,
							description: d.description.trim(),
						})),
					},
				},
			},
		});
		const result = res.data?.requestShelterClaim;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.claim.requested_ok"));
		setShowForm(false);
		setMessage("");
		setDocuments([emptyDocument()]);
		refetchClaims();
	};

	const onResendDocuments = async () => {
		if (!pendingClaim || !replacements) return;
		if (!documentsValid(replacements)) {
			toast.error(t("shelters.claim.missing_document"));
			return;
		}
		const res = await updateDocuments({
			variables: {
				id: pendingClaim.id,
				documents: replacements.map((d) => ({
					id: d.id,
					media_id: d.media_id,
					url: d.url,
					description: d.description.trim(),
				})),
			},
		});
		const result = res.data?.updateShelterClaimDocuments;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.claim.documents_updated_ok"));
		setReplacements(null);
		refetchClaims();
	};

	const onCancel = async () => {
		if (!pendingClaim) return;
		const res = await cancelClaim({ variables: { id: pendingClaim.id } });
		const result = res.data?.cancelShelterClaim;
		if (!result?.success) {
			toast.error(result?.error?.message ?? t("messages.errors.fetch"));
			return;
		}
		toast.success(t("shelters.claim.cancelled_ok"));
		setReplacements(null);
		refetchClaims();
	};

	const renderDocumentRow = (
		list: "form" | "pending",
		doc: DraftDocument,
		index: number,
		removable: boolean,
		onRemove?: () => void
	) => (
		<DocumentRow
			key={doc.id ?? index}
			$flagged={doc.status === "CHANGE_REQUESTED"}
		>
			<UploadArea
				type="button"
				onClick={() => !doc.uploading && pickFile(list, index)}
			>
				{doc.uploading ? (
					<span>{t("shelters.claim.uploading")}</span>
				) : doc.media_id && isImage(doc.url) ? (
					<Thumb src={doc.url ?? undefined} alt="" />
				) : doc.media_id ? (
					<>
						<Icon name="documentOutline" color="primary" size="28px" />
						<span>{doc.file_name ?? doc.description}</span>
					</>
				) : (
					<>
						<Icon name="cloudUploadOutline" color="medium" size="28px" />
						<span>{t("shelters.claim.upload_hint")}</span>
					</>
				)}
			</UploadArea>
			{doc.status === "CHANGE_REQUESTED" && (
				<FlagNote>
					<Icon name="alertCircleOutline" color="warning" size="16px" />
					<span>
						{t("shelters.claim.reviewer_note")}:{" "}
						{doc.reviewer_note || t("shelters.claim.change_requested")}
					</span>
				</FlagNote>
			)}
			<DescriptionRow>
				<DescriptionInput
					value={doc.description}
					placeholder={t("shelters.claim.document_description_placeholder") ?? ""}
					onChange={(e) =>
						setDoc(list, index, { description: e.target.value })
					}
				/>
				{removable && (
					<Icon
						name="trashOutline"
						color="danger"
						size="20px"
						onClick={onRemove}
					/>
				)}
			</DescriptionRow>
		</DocumentRow>
	);

	return (
		<IonContent>
			<PullToRefresh />
			<Header>
				<h2 className={loading ? "skeleton" : ""}>
					{shelter ? t("shelters.claim.title") : ""}
				</h2>
				{shelter && (
					<Chip
						label={t(
							isVerified
								? "shelters.badges.verified"
								: "shelters.badges.unverified"
						)}
						color={isVerified ? "success" : "warning"}
					/>
				)}
			</Header>

			{!loadingClaims && fetchError && <Message>{fetchError}</Message>}

			{shelter && isVerified && (
				<Message>{t("shelters.claim.already_verified")}</Message>
			)}

			{shelter && !isVerified && (
				<Section>
					{pendingClaim ? (
						<Card>
							<CardHead>
								<Icon
									name={changeRequested ? "alertCircleOutline" : "timeOutline"}
									color={changeRequested ? "warning" : "primary"}
									size="34px"
								/>
								<div>
									<h3>
										{changeRequested
											? t("shelters.claim.change_requested")
											: t("shelters.claim.pending_title")}
									</h3>
									<p>
										{changeRequested
											? t("shelters.claim.change_requested_hint")
											: t("shelters.claim.pending_subtitle")}
									</p>
								</div>
							</CardHead>

							{replacements ? (
								<>
									<Documents>
										<DocumentsHead>
											<h4>{t("shelters.claim.documents")}</h4>
											<span>{replacements.length}</span>
										</DocumentsHead>
										{replacements.map((doc, i) =>
											renderDocumentRow("pending", doc, i, false)
										)}
									</Documents>
									<Actions>
										<PrimaryBtn
											type="button"
											disabled={updatingDocuments}
											onClick={onResendDocuments}
										>
											{t("shelters.claim.resend_documents")}
										</PrimaryBtn>
										<GhostBtn
											type="button"
											onClick={() => setReplacements(null)}
										>
											{t("actions.cancel")}
										</GhostBtn>
									</Actions>
								</>
							) : (
								<>
									{pendingDocuments.length > 0 && (
										<Documents>
											<DocumentsHead>
												<h4>{t("shelters.claim.documents")}</h4>
												<span>{pendingDocuments.length}</span>
											</DocumentsHead>
											{pendingDocuments.map((doc) => (
												<PendingDoc
													key={doc.id}
													$flagged={doc.status === "CHANGE_REQUESTED"}
												>
													{isImage(doc.url) ? (
														<Thumb src={doc.url ?? undefined} alt="" />
													) : (
														<Icon
															name="documentOutline"
															color="primary"
															size="24px"
														/>
													)}
													<div>
														<span>{doc.description}</span>
														{doc.status === "CHANGE_REQUESTED" && (
															<em>
																{t("shelters.claim.reviewer_note")}:{" "}
																{doc.reviewer_note ||
																	t("shelters.claim.change_requested")}
															</em>
														)}
													</div>
												</PendingDoc>
											))}
										</Documents>
									)}
									<Actions>
										{changeRequested && (
											<PrimaryBtn
												type="button"
												onClick={() =>
													setReplacements(pendingDocuments.map((d) => ({ ...d })))
												}
											>
												{t("shelters.claim.replace_document")}
											</PrimaryBtn>
										)}
										<GhostBtn type="button" onClick={onCancel}>
											{t("shelters.claim.cancel")}
										</GhostBtn>
									</Actions>
								</>
							)}
						</Card>
					) : showForm ? (
						<Card>
							<Field>
								<label>{t("shelters.claim.motivation_label")}</label>
								<Textarea
									rows={4}
									value={message}
									placeholder={t("shelters.claim.message_placeholder") ?? ""}
									onChange={(e) => setMessage(e.target.value)}
								/>
							</Field>

							<Documents>
								<DocumentsHead>
									<h4>{t("shelters.claim.documents")}</h4>
									<span>{documents.length}</span>
								</DocumentsHead>
								{documents.map((doc, i) =>
									renderDocumentRow("form", doc, i, documents.length > 1, () =>
										setDocuments((docs) => docs.filter((_, j) => j !== i))
									)
								)}
								<AddDocBtn
									type="button"
									onClick={() =>
										setDocuments((docs) => [...docs, emptyDocument()])
									}
								>
									<Icon name="addOutline" color="primary" size="18px" />
									{t("shelters.claim.add_document")}
								</AddDocBtn>
							</Documents>

							<Actions>
								<PrimaryBtn
									type="button"
									disabled={requestingClaim}
									onClick={onRequest}
								>
									{t("shelters.claim.send_request")}
								</PrimaryBtn>
								<GhostBtn type="button" onClick={() => setShowForm(false)}>
									{t("actions.cancel")}
								</GhostBtn>
							</Actions>
						</Card>
					) : canRequest ? (
						<Card>
							<CardHead>
								<Icon name="checkmarkCircleOutline" color="primary" size="34px" />
								<div>
									<h3>{t("shelters.claim.headline")}</h3>
									<p>{t("shelters.claim.subtitle")}</p>
								</div>
							</CardHead>
							<Actions>
								<PrimaryBtn type="button" onClick={() => setShowForm(true)}>
									{t("shelters.claim.request_verification")}
								</PrimaryBtn>
							</Actions>
						</Card>
					) : null}
				</Section>
			)}

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,.pdf"
				style={{ display: "none" }}
				onChange={onFilePicked}
			/>
		</IonContent>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(2)} 12px ${$uw(1)};
	> h2 {
		margin: 0;
		color: ${$color("primary")};
		min-height: 28px;
	}
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px ${$uw(2)};
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(2)} 12px;
	color: ${$color("medium")};
`;

const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
	padding: ${$uw(1.5)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const CardHead = styled.div`
	display: flex;
	align-items: flex-start;
	gap: ${$uw(1)};
	> div {
		flex: 1;
		> h3 {
			margin: 0 0 ${$uw(0.25)};
			font-size: 1.6rem;
			color: ${$color("dark")};
		}
		> p {
			margin: 0;
			font-size: 1.3rem;
			color: ${$color("medium")};
		}
	}
`;

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.5)};
	> label {
		font-size: 1.3rem;
		font-weight: 700;
		color: ${$color("dark")};
	}
`;

const Textarea = styled.textarea`
	width: 100%;
	box-sizing: border-box;
	resize: vertical;
	padding: ${$uw(1)};
	border-radius: 10px;
	border: 1px solid ${$color("medium")};
	background: transparent;
	color: ${$color("dark")};
	font-size: 1.4rem;
	font-family: inherit;
	&::placeholder {
		color: ${$color("medium")};
	}
	&:focus {
		outline: none;
		border-color: ${$color("primary")};
	}
`;

const Documents = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(1)};
`;

const DocumentsHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	> h4 {
		margin: 0;
		font-size: 1.4rem;
		color: ${$color("dark")};
	}
	> span {
		font-size: 1.2rem;
		font-weight: 700;
		color: ${$color("primary")};
	}
`;

const DocumentRow = styled.div<{ $flagged?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	padding: ${$uw(1)};
	border-radius: 10px;
	border: 1px solid
		${({ $flagged }) =>
			$flagged ? $color("warning") : "rgba(var(--ion-color-medium-rgb), 0.35)"};
`;

const UploadArea = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.5)};
	min-height: ${$uw(6)};
	padding: ${$uw(1)};
	border-radius: 10px;
	border: 1px dashed ${$color("medium")};
	background: transparent;
	cursor: pointer;
	> span {
		font-size: 1.2rem;
		color: ${$color("medium")};
		word-break: break-all;
	}
`;

const Thumb = styled.img`
	max-width: 100%;
	max-height: ${$uw(12)};
	border-radius: 8px;
	object-fit: cover;
`;

const FlagNote = styled.div`
	display: flex;
	align-items: flex-start;
	gap: ${$uw(0.5)};
	> span {
		font-size: 1.2rem;
		color: ${$color("warning")};
	}
`;

const DescriptionRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
`;

const DescriptionInput = styled.input`
	flex: 1;
	box-sizing: border-box;
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 10px;
	border: 1px solid ${$color("medium")};
	background: transparent;
	color: ${$color("dark")};
	font-size: 1.3rem;
	&::placeholder {
		color: ${$color("medium")};
	}
	&:focus {
		outline: none;
		border-color: ${$color("primary")};
	}
`;

const AddDocBtn = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.75)};
	border-radius: 10px;
	border: 1px dashed ${$color("primary")};
	background: transparent;
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
`;

const PendingDoc = styled.div<{ $flagged?: boolean }>`
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} ${$uw(1)};
	border-radius: 10px;
	border: 1px solid
		${({ $flagged }) =>
			$flagged ? $color("warning") : "rgba(var(--ion-color-medium-rgb), 0.35)"};
	> img {
		max-height: ${$uw(4)};
		max-width: ${$uw(6)};
	}
	> div {
		display: flex;
		flex-direction: column;
		> span {
			font-size: 1.3rem;
			color: ${$color("dark")};
		}
		> em {
			font-size: 1.2rem;
			font-style: normal;
			color: ${$color("warning")};
		}
	}
`;

const Actions = styled.div`
	display: flex;
	gap: ${$uw(1)};
`;

const PrimaryBtn = styled.button`
	border: none;
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
	&:disabled {
		opacity: 0.6;
	}
`;

const GhostBtn = styled.button`
	border: 1px solid ${$color("medium")};
	border-radius: 999px;
	padding: ${$uw(1)} ${$uw(2)};
	background: transparent;
	color: ${$color("medium")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;
