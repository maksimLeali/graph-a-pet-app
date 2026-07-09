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
import { useMyShelterRole } from "../hooks/useMyShelterRole";

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
