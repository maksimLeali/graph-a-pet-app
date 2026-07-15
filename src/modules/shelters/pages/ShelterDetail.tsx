import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useLocation } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Image2x, Chip, Icon } from "@components";
import { I18NKey } from "@i18n";
import { RoleLevel, UserRole, ShelterType, ShelterVerificationStatus } from "@types";
import { $color, $uw } from "@theme";

import { useGetShelterLazyQuery } from "../operations/__generated__/getShelter.generated";
import { useGetPublicShelterQuery } from "../operations/__generated__/getPublicShelter.generated";
import { useGetShelterOperationalDashboardQuery } from "../operations/__generated__/getShelterOperationalDashboard.generated";
import { FullShelterFragment } from "../operations/__generated__/FullShelter.generated";
import { useListShelterMediasQuery } from "../operations/__generated__/listShelterMedias.generated";
import { useListShelterPetsMinQuery } from "../operations/__generated__/listShelterPetsMin.generated";
import { DonateCard } from "../../donations/components/DonateCard";

const PET_IMAGE_SCOPES = ["pet_main_picture", "pet_picture"];

type Role = NonNullable<
	NonNullable<FullShelterFragment["roles"]>["items"][number]
>;
type ShelterPet = NonNullable<
	NonNullable<FullShelterFragment["pets"]>["items"][number]
>;

const roleColors: Record<RoleLevel, string> = {
	[RoleLevel.Owner]: "primary",
	[RoleLevel.Manager]: "warning",
	[RoleLevel.Staff]: "success",
	[RoleLevel.Volunteer]: "medium",
};

export const ShelterDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const location = useLocation();

	const [getShelter, { data, loading }] = useGetShelterLazyQuery({
		fetchPolicy: "no-cache",
	});

	const shelter = data?.getShelter?.shelter ?? undefined;

	useEffect(() => {
		setPage({ name: t("pages.shelters") });
	}, [id]);

	// refetch a ogni ingresso nella pagina (es. ritorno da add-pet)
	useEffect(() => {
		if (location.pathname === `/shelters/detail/${id}`) {
			getShelter({ variables: { id } });
		}
	}, [id, location.key]);

	return (
		<IonContent>
			{shelter ? (
				<Detail shelter={shelter} />
			) : (
				<Header>
					<h2 className={loading ? "skeleton" : ""} />
				</Header>
			)}
		</IonContent>
	);
};

type detailProps = {
	shelter: FullShelterFragment;
};

const Detail: React.FC<detailProps> = ({ shelter }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const { user } = useUserContext();

	const { data: dashData } = useGetShelterOperationalDashboardQuery({
		variables: { shelter_id: shelter.id },
		fetchPolicy: "cache-and-network",
	});
	const dash = dashData?.getShelterOperationalDashboard?.dashboard;

	// profilo pubblico (logo/descrizione/story) — non presente su FullShelter
	const { data: pubData } = useGetPublicShelterQuery({
		variables: { id: shelter.id },
		fetchPolicy: "cache-and-network",
	});
	const pub = pubData?.getPublicShelter ?? undefined;

	const roles = (shelter.roles?.items ?? []).filter(
		(r): r is Role => !!r
	);
	const pets = (shelter.pets?.items ?? []).filter(
		(p): p is ShelterPet => !!p
	);

	// aggregazione persone per ruolo (solo ruolo + quanti lo ricoprono)
	const roleCounts = Object.entries(
		roles.reduce<Record<string, number>>((acc, r) => {
			acc[r.role] = (acc[r.role] ?? 0) + 1;
			return acc;
		}, {})
	).map(([role, count]) => ({ role: role as Role["role"], count }));

	const address = [
		[shelter.street, shelter.street_number].filter(Boolean).join(" "),
		shelter.postal_code,
		[shelter.city, shelter.province_code].filter(Boolean).join(" "),
		shelter.region,
	]
		.filter(Boolean)
		.join(", ");

	const contacts = (shelter.contacts ?? []).filter(
		(c): c is NonNullable<typeof c> => !!c?.value
	);

	const myRole = roles.find((r) => r.user.id === user.id)?.role;
	const canManage =
		user.role === UserRole.Admin ||
		myRole === RoleLevel.Owner ||
		myRole === RoleLevel.Manager;
	const isOwner = user.role === UserRole.Admin || myRole === RoleLevel.Owner;
	const isClaimable =
		shelter.type === ShelterType.PersonalWorkspace ||
		shelter.verification_status !== ShelterVerificationStatus.Verified;

	return (
		<>
			<Header>
				<House>
					<Icon name="paw" color="light" />
				</House>
				<h2>{shelter.name}</h2>
				{address && <SubText>{address}</SubText>}
				{(shelter.type === ShelterType.PersonalWorkspace ||
					shelter.verification_status !== ShelterVerificationStatus.Verified) && (
					<Contacts>
						{shelter.type === ShelterType.PersonalWorkspace && (
							<Chip label={t("shelters.badges.personal_workspace")} color="medium" />
						)}
						{shelter.verification_status !== ShelterVerificationStatus.Verified && (
							<Chip label={t("shelters.badges.unverified")} color="warning" />
						)}
					</Contacts>
				)}
				{contacts.length > 0 && (
					<Contacts>
						{contacts.map((c, i) => (
							<Chip
								key={i}
								color="primary"
								label={c.value!}
							/>
						))}
					</Contacts>
				)}
			</Header>

			<TabNav>
				<Tab
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${shelter.id}/tasks`)
					}
				>
					<Icon name="checkboxOutline" color="primary" size="15px" />
					<span>{t("shelters.tabs.tasks")}</span>
				</Tab>
				<Tab
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${shelter.id}/walks`)
					}
				>
					<Icon name="walkOutline" color="primary" size="15px" />
					<span>{t("shelters.tabs.walks")}</span>
				</Tab>
				<Tab
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${shelter.id}/inventory`)
					}
				>
					<Icon name="cubeOutline" color="primary" size="15px" />
					<span>{t("shelters.tabs.inventory")}</span>
				</Tab>
				<Tab
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${shelter.id}/map`)
					}
				>
					<Icon name="mapOutline" color="primary" size="15px" />
					<span>{t("shelters.tabs.map")}</span>
				</Tab>
				<Tab
					type="button"
					onClick={() =>
						history.push(`/shelters/detail/${shelter.id}/people`)
					}
				>
					<Icon name="peopleOutline" color="primary" size="15px" />
					<span>{t("shelters.tabs.people")}</span>
				</Tab>
				{isOwner && (
					<Tab
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${shelter.id}/ownership`)
						}
					>
						<Icon name="swapHorizontal" color="primary" size="15px" />
						<span>{t("shelters.tabs.ownership")}</span>
					</Tab>
				)}
				{canManage && isClaimable && (
					<Tab
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${shelter.id}/verification`)
						}
					>
						<Icon name="ribbonOutline" color="primary" size="15px" />
						<span>{t("shelters.tabs.verification")}</span>
					</Tab>
				)}
				{canManage && (
					<Tab
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${shelter.id}/public-profile`)
						}
					>
						<Icon name="globeOutline" color="primary" size="15px" />
						<span>{t("shelters.tabs.public_profile")}</span>
					</Tab>
				)}
			</TabNav>

			{pub?.public_description && (
				<Section>
					<Description>{pub.public_description}</Description>
				</Section>
			)}

			{pub?.public_story_html && (
				<Section>
					{/* HTML sanitizzato lato backend su write → sicuro */}
					<Story
						dangerouslySetInnerHTML={{ __html: pub.public_story_html }}
					/>
				</Section>
			)}

			<Section>
				<SectionTitle>
					{t("shelters.pets")}
					<Count>{pets.length}</Count>
					<AddPetButton
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${shelter.id}/animals`)
						}
					>
						<Icon name="albumsOutline" color="light" size="16px" />
						<span>{t("shelters.animals.title")}</span>
					</AddPetButton>
				</SectionTitle>
				{pets.length === 0 ? (
					<Empty>{t("shelters.no_pets")}</Empty>
				) : (
					<PetGrid>
						{pets.map((sp) => (
							<PetCard
								key={sp.id}
								type="button"
								onClick={() =>
									history.push(
										`/shelters/detail/${shelter.id}/pet/${sp.id}`
									)
								}
							>
								<PetPic>
									{sp.pet.main_picture?.id ? (
										<Image2x id={sp.pet.main_picture.id} />
									) : (
										<Icon name="paw" color="medium" />
									)}
								</PetPic>
								<PetName>{sp.pet.name}</PetName>
							</PetCard>
						))}
					</PetGrid>
				)}
			</Section>

			<Section>
				<SectionTitle>
					{t("shelters.photos.title")}
					<AddPetButton
						type="button"
						onClick={() =>
							history.push(`/shelters/detail/${shelter.id}/photos`)
						}
					>
						<Icon name="imagesOutline" color="light" size="16px" />
						<span>{t("shelters.photos.manage")}</span>
					</AddPetButton>
				</SectionTitle>
				<GalleryPreview
					shelterId={shelter.id}
					onManage={() =>
						history.push(`/shelters/detail/${shelter.id}/photos`)
					}
				/>
			</Section>

			<Section>
				<DonateCard shelterId={shelter.id} />
			</Section>

			{dash && (
				<Dashboard>
					<Tile $accent={dash.low_stock_count > 0 ? "warning" : undefined}>
						<b>{dash.low_stock_count}</b>
						<span>{t("shelters.dash.low_stock")}</span>
					</Tile>
					<Tile $accent={dash.pets_needing_walk > 0 ? "warning" : undefined}>
						<b>{dash.pets_needing_walk}</b>
						<span>{t("shelters.dash.pets_needing_walk")}</span>
					</Tile>
					<Tile $accent={dash.tasks_overdue > 0 ? "danger" : undefined}>
						<b>{dash.tasks_overdue}</b>
						<span>{t("shelters.dash.tasks_overdue")}</span>
					</Tile>
				</Dashboard>
			)}

			{dash && (
				<Section>
					<SectionTitle>
						{t("shelters.structure")}
						<AddPetButton
							type="button"
							onClick={() =>
								history.push(`/shelters/detail/${shelter.id}/boxes`)
							}
						>
							<Icon name="albumsOutline" color="light" size="16px" />
							<span>{t("shelters.boxes.title")}</span>
						</AddPetButton>
					</SectionTitle>
					<Dashboard>
						<Tile>
							<b>{dash.boxes_free}</b>
							<span>{t("shelters.dash.boxes_free")}</span>
						</Tile>
						<Tile
							$accent={
								dash.boxes_out_of_service > 0 ? "danger" : undefined
							}
						>
							<b>{dash.boxes_out_of_service}</b>
							<span>{t("shelters.dash.boxes_oos")}</span>
						</Tile>
						<Tile
							$accent={dash.low_stock_count > 0 ? "warning" : undefined}
						>
							<b>{dash.low_stock_count}</b>
							<span>{t("shelters.dash.low_stock")}</span>
						</Tile>
					</Dashboard>
				</Section>
			)}

			{dash && (
				<Section>
					<SectionTitle>{t("shelters.organization")}</SectionTitle>
					<Dashboard>
						<Tile>
							<b>{dash.tasks_total}</b>
							<span>{t("shelters.dash.tasks_total")}</span>
						</Tile>
						<Tile>
							<b>{dash.tasks_recurring}</b>
							<span>{t("shelters.dash.tasks_recurring")}</span>
						</Tile>
						<Tile>
							<b>{dash.tasks_due_this_week}</b>
							<span>{t("shelters.dash.tasks_due_this_week")}</span>
						</Tile>
						<Tile
							$accent={dash.tasks_overdue > 0 ? "danger" : undefined}
						>
							<b>{dash.tasks_overdue}</b>
							<span>{t("shelters.dash.tasks_overdue")}</span>
						</Tile>
					</Dashboard>
				</Section>
			)}

			<Section>
				<SectionTitle>
					{t("shelters.people")}
					<Count>{roles.length}</Count>
				</SectionTitle>
				{roles.length === 0 ? (
					<Empty>{t("shelters.no_people")}</Empty>
				) : (
					<RoleSummary>
						{roleCounts.map(({ role, count }) => (
							<RoleStat key={role}>
								<Chip
									color={roleColors[role]}
									label={t(
										`shelters.roles.${role.toLowerCase()}` as I18NKey
									)}
								/>
								<b>{count}</b>
							</RoleStat>
						))}
					</RoleSummary>
				)}
			</Section>

		</>
	);
};

type galleryPreviewProps = {
	shelterId: string;
	onManage: () => void;
};

const GalleryPreview: React.FC<galleryPreviewProps> = ({ shelterId }) => {
	const { data: petsData } = useListShelterPetsMinQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 200,
				filters: { fixed: [{ key: "shelter_id", value: shelterId }] },
			},
		},
	});
	const petIds = (petsData?.listShelterPets?.items ?? [])
		.filter((p): p is NonNullable<typeof p> => !!p)
		.map((sp) => sp.pet.id);

	// 1 sola chiamata: immagini shelter + immagini pet (ultime 5).
	const { data } = useListShelterMediasQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 5,
				order_by: "created_at",
				order_direction: "desc",
				filters: {
					lists: [
						{ key: "scope", value: ["shelter_images", ...PET_IMAGE_SCOPES] },
						{ key: "ref_id", value: [shelterId, ...petIds] },
					],
				},
			},
		},
	});

	const medias = (data?.listMedias?.items ?? []).filter(
		(m): m is NonNullable<typeof m> => !!m
	);

	if (medias.length === 0) return null;

	return (
		<PhotoStrip>
			{medias.map((m) => (
				<PhotoThumb key={m.id}>
					<Image2x id={m.id} />
				</PhotoThumb>
			))}
		</PhotoStrip>
	);
};

const Header = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(1.5)} 12px;
	border-bottom: 2px solid ${$color("primary")};
	> h2 {
		margin: 0;
		text-align: center;
		min-height: 28px;
	}
`;

const House = styled.div`
	width: ${$uw(6)};
	height: ${$uw(6)};
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding-bottom: ${$uw(1)};
	box-sizing: border-box;
	clip-path: polygon(50% 0%, 100% 35%, 100% 100%, 0% 100%, 0% 35%);
	background: ${$color("primary")};
	> .icon {
		width: ${$uw(2.5)};
		height: ${$uw(2.5)};
	}
`;

const SubText = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
	text-align: center;
	word-break: break-word;
`;

const Contacts = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: ${$uw(0.75)};
	margin-top: ${$uw(0.5)};
`;

const Section = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: ${$uw(1.5)} 12px 0;
`;

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1.5)};
	font-size: 1.5rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	&::after {
		content: "";
		flex: 1;
		height: 2px;
		background: rgba(var(--ion-color-primary-rgb), 0.25);
	}
`;

const Count = styled.span`
	order: 3;
	flex: 0 0 auto;
	min-width: ${$uw(2.5)};
	height: ${$uw(2.5)};
	padding: 0 ${$uw(0.75)};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.15);
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
`;

const Empty = styled.p`
	margin: 0;
	padding: ${$uw(2)} 0;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.5rem;
`;

const RoleSummary = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(1)};
`;

const RoleStat = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.75)};
	padding: ${$uw(0.75)} ${$uw(1.25)};
	border-radius: 14px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	> b {
		font-size: 1.8rem;
		color: ${$color("primary")};
	}
`;

const TabNav = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
	padding: ${$uw(1)} 12px 0;
	overflow-x: auto;
`;

const Tab = styled.button`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.6)} ${$uw(1.25)};
	border: none;
	border-radius: 999px;
	background: rgba(var(--ion-color-primary-rgb), 0.1);
	color: ${$color("primary")};
	font-size: 1.3rem;
	font-weight: 700;
	white-space: nowrap;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const Dashboard = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1)};
	padding: ${$uw(0.75)} 12px 0;
`;

const Tile = styled.div<{ $accent?: string }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.25)};
	padding: ${$uw(0.625)} ${$uw(0.5)};
	border-radius: 12px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
	> b {
		font-size: 2.2rem;
		font-weight: 800;
		color: ${({ $accent }) => $color($accent || "primary")};
	}
	> span {
		font-size: 1.1rem;
		text-align: center;
		color: ${$color("medium")};
		line-height: 1.2;
	}
`;

const AddPetButton = styled.button`
	order: 4;
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: ${$uw(0.5)} ${$uw(1.25)};
	border: none;
	border-radius: 999px;
	background: ${$color("primary")};
	color: ${$color("light")};
	font-size: 1.3rem;
	font-weight: 700;
	cursor: pointer;
	> .icon {
		width: ${$uw(1.6)};
		height: ${$uw(1.6)};
	}
	&:active {
		opacity: 0.7;
	}
`;

const Description = styled.p`
	margin: 0;
	font-size: 1.5rem;
	line-height: 1.5;
	color: ${$color("dark")};
`;

const Story = styled.div`
	font-size: 1.5rem;
	line-height: 1.55;
	color: ${$color("dark")};
	word-break: break-word;

	h2 {
		font-size: 2rem;
		margin: ${$uw(1)} 0 ${$uw(0.5)};
	}
	h3,
	h4 {
		font-size: 1.7rem;
		margin: ${$uw(0.75)} 0 ${$uw(0.5)};
	}
	p {
		margin: 0 0 ${$uw(1)};
	}
	ul,
	ol {
		margin: 0 0 ${$uw(1)};
		padding-left: ${$uw(2.5)};
	}
	li {
		margin-bottom: ${$uw(0.25)};
	}
	a {
		color: ${$color("primary")};
		text-decoration: underline;
		word-break: break-all;
	}
`;

const PetGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1)};
`;

const PetCard = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.5)};
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const PetPic = styled.div`
	width: 100%;
	aspect-ratio: 1;
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-primary-rgb), 0.08);
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	> .icon {
		width: ${$uw(2.5)};
		height: ${$uw(2.5)};
	}
`;

const PetName = styled.span`
	font-size: 1.3rem;
	font-weight: 700;
	color: ${$color("dark")};
	text-align: center;
	word-break: break-word;
`;

const PhotoStrip = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
	overflow-x: auto;
	padding-bottom: ${$uw(0.5)};
`;

const PhotoThumb = styled.div`
	flex: 0 0 auto;
	width: 64px;
	height: 64px;
	border-radius: 14px;
	overflow: hidden;
	background: rgba(var(--ion-color-primary-rgb), 0.08);
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

