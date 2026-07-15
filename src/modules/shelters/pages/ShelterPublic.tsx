import { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import toast from "react-hot-toast";
import { IonContent } from "@ionic/react";

import { useUserContext } from "@contexts";
import { Chip, Icon, Image2x } from "@components";
import { $color, $uw } from "@theme";

import { useGetPublicShelterQuery } from "../operations/__generated__/getPublicShelter.generated";
import { useListPublicShelterPetsQuery } from "../operations/__generated__/listPublicShelterPets.generated";
import { useListShelterMediasQuery } from "../operations/__generated__/listShelterMedias.generated";
import { useMyShelterRole } from "../hooks/useMyShelterRole";
import { DonateCard } from "../../donations/components/DonateCard";

export const ShelterPublic: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const { setPage } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		setPage({ name: t("shelters.discover.title") });
	}, []);

	const { data, loading, error } = useGetPublicShelterQuery({
		skip: !id,
		fetchPolicy: "cache-and-network",
		variables: { id },
	});
	const shelter = data?.getPublicShelter ?? undefined;
	const fetchError = error?.message;

	const { isMember } = useMyShelterRole(id);

	const onApplyVolunteer = () => {
		if (!shelter) return;
		if (shelter.public_contact_email) {
			window.location.href = `mailto:${shelter.public_contact_email}`;
			return;
		}
		toast(t("shelters.discover.volunteer_no_contact") ?? "");
	};

	return (
		<IonContent>
			{!loading && (fetchError || !shelter) && (
				<Message>{fetchError ?? t("shelters.discover.not_found")}</Message>
			)}

			{(loading || shelter) && (
				<>
					<Header>
						<Logo className={loading ? "skeleton" : ""}>
							{shelter?.logo_media_id ? (
								<Image2x id={shelter.logo_media_id} />
							) : (
								<Icon name="paw" color="light" />
							)}
						</Logo>
						<h2 className={loading ? "skeleton" : ""}>{shelter?.name ?? ""}</h2>
						{shelter && (shelter.city || shelter.region) && (
							<SubText>
								{[shelter.city, shelter.region].filter(Boolean).join(", ")}
							</SubText>
						)}
						{shelter?.public_location_label && (
							<SubText>
								<Icon name="locationOutline" color="medium" size="14px" />{" "}
								{shelter.public_location_label}
							</SubText>
						)}
						{shelter?.accepts_volunteers && (
							<Badges>
								<Chip
									label={t("shelters.discover.accepts_volunteers_badge")}
									color="success"
								/>
							</Badges>
						)}
						{shelter && (shelter.public_contact_email || shelter.public_contact_phone) && (
							<Contacts>
								{shelter.public_contact_email && (
									<Chip color="primary" label={shelter.public_contact_email} />
								)}
								{shelter.public_contact_phone && (
									<Chip color="primary" label={shelter.public_contact_phone} />
								)}
							</Contacts>
						)}
					</Header>

					{shelter?.public_description && (
						<Section>
							<Description>{shelter.public_description}</Description>
						</Section>
					)}

					{shelter?.public_story_html && (
						<Section>
							{/* HTML già sanitizzato lato backend su write
							    (utils/html_sanitize.py) → sicuro da renderizzare */}
							<Story
								dangerouslySetInnerHTML={{
									__html: shelter.public_story_html,
								}}
							/>
						</Section>
					)}

					{shelter && <PublicPets shelterId={shelter.id} />}

					{shelter && <PublicGallery shelterId={shelter.id} />}

					{shelter && (
						<Section>
							<DonateCard shelterId={shelter.id} />
						</Section>
					)}

					{shelter?.accepts_volunteers && !isMember && (
						<Section>
							<VolunteerBtn type="button" onClick={onApplyVolunteer}>
								{t("shelters.discover.apply_volunteer")}
							</VolunteerBtn>
						</Section>
					)}

					{isMember && shelter && (
						<Section>
							<JoinBtn
								type="button"
								onClick={() => history.push(`/shelters/detail/${shelter.id}`)}
							>
								{t("shelters.discover.open")}
							</JoinBtn>
						</Section>
					)}
				</>
			)}
		</IonContent>
	);
};

type publicSectionProps = {
	shelterId: string;
};

const PublicPets: React.FC<publicSectionProps> = ({ shelterId }) => {
	const { t } = useTranslation();
	const { data } = useListPublicShelterPetsQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: { shelter_id: shelterId },
	});

	const pets = (data?.listPublicShelterPets?.items ?? []).filter(
		(p): p is NonNullable<typeof p> => !!p
	);

	if (pets.length === 0) return null;

	return (
		<Section>
			<SectionTitle>{t("shelters.pets")}</SectionTitle>
			<PetGrid>
				{pets.map((p) => (
					<PetCard key={p.id}>
						<PetPic>
							{p.main_picture?.id ? (
								<Image2x id={p.main_picture.id} />
							) : (
								<Icon name="paw" color="medium" />
							)}
						</PetPic>
						<PetName>{p.name}</PetName>
						{p.breed && <PetBreed>{p.breed}</PetBreed>}
					</PetCard>
				))}
			</PetGrid>
		</Section>
	);
};

const PublicGallery: React.FC<publicSectionProps> = ({ shelterId }) => {
	const { t } = useTranslation();
	const { data } = useListShelterMediasQuery({
		skip: !shelterId,
		fetchPolicy: "cache-and-network",
		variables: {
			commonSearch: {
				page: 0,
				page_size: 12,
				order_by: "created_at",
				order_direction: "desc",
				filters: {
					fixed: [
						{ key: "scope", value: "shelter_images" },
						{ key: "ref_id", value: shelterId },
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
		<Section>
			<SectionTitle>{t("shelters.photos.title")}</SectionTitle>
			<PhotoStrip>
				{medias.map((m) => (
					<PhotoThumb key={m.id}>
						<Image2x id={m.id} />
					</PhotoThumb>
				))}
			</PhotoStrip>
		</Section>
	);
};

const SectionTitle = styled.h3`
	margin: 0 0 ${$uw(1)};
	font-size: 1.5rem;
	color: ${$color("primary")};
	text-transform: uppercase;
	letter-spacing: 0.6px;
`;

const PetGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${$uw(1)};
`;

const PetCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${$uw(0.5)};
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
`;

const PetBreed = styled.span`
	font-size: 1.1rem;
	color: ${$color("medium")};
	text-align: center;
`;

const PhotoStrip = styled.div`
	display: flex;
	gap: ${$uw(0.75)};
	overflow-x: auto;
	padding-bottom: ${$uw(0.5)};
`;

const PhotoThumb = styled.div`
	flex: 0 0 auto;
	width: 96px;
	height: 96px;
	border-radius: 16px;
	overflow: hidden;
	background: rgba(var(--ion-color-primary-rgb), 0.08);
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

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

const Logo = styled.div`
	width: ${$uw(6)};
	height: ${$uw(6)};
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border-radius: 50%;
	overflow: hidden;
	background: ${$color("primary")};
	> .icon {
		width: ${$uw(2.5)};
		height: ${$uw(2.5)};
	}
	> .img2x {
		width: 100%;
		height: 100%;
	}
`;

const SubText = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
	text-align: center;
	word-break: break-word;
`;

const Badges = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: ${$uw(0.5)};
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

const Description = styled.p`
	margin: 0;
	font-size: 1.5rem;
	line-height: 1.5;
	color: ${$color("dark")};
`;

// racconto pubblico ricco (WYSIWYG): stessa allowlist del sanitizer backend
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
	blockquote {
		margin: ${$uw(1)} 0;
		padding-left: ${$uw(1.25)};
		border-left: 3px solid ${$color("primary")};
		color: ${$color("medium")};
		font-style: italic;
	}
	a {
		color: ${$color("primary")};
		text-decoration: underline;
		word-break: break-all;
	}
`;

const VolunteerBtn = styled.button`
	width: 100%;
	border: none;
	border-radius: 999px;
	padding: ${$uw(1.25)};
	background: ${$color("success")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const JoinBtn = styled.button`
	width: 100%;
	border: none;
	border-radius: 999px;
	padding: ${$uw(1.25)};
	background: ${$color("primary")};
	color: ${$color("light")};
	font-weight: 700;
	font-size: 1.4rem;
	cursor: pointer;
`;

const Message = styled.p`
	width: 100%;
	text-align: center;
	padding: ${$uw(4)} 12px;
	opacity: 0.6;
`;
