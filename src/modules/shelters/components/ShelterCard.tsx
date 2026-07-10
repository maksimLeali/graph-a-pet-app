import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Icon, Chip } from "@components";
import { $color, $uw } from "@theme";
import { ShelterType, ShelterVerificationStatus, ShelterVisibility } from "@types";
import { Shelter } from "../types";

type Props = {
	shelter: Shelter;
	onClick?: () => void;
};

export const ShelterCard: React.FC<Props> = ({ shelter, onClick }) => {
	const { t } = useTranslation();
	const address = [shelter.city, shelter.region]
		.filter(Boolean)
		.join(", ");
	const isPersonal = shelter.type === ShelterType.PersonalWorkspace;
	const isPrivate = shelter.visibility === ShelterVisibility.Private;
	const isVerified = shelter.verification_status === ShelterVerificationStatus.Verified;
	return (
		<Card role="button" tabIndex={0} onClick={onClick}>
			<Info>
				<Name>{shelter.name}</Name>
				{address && <Address>{address}</Address>}
				<Badges>
					{isPersonal && (
						<Chip className="chip" label={t("shelters.badges.personal_workspace")} color="medium" />
					)}
					<VisibilityBadge aria-label={isPrivate ? "private" : "public"} $private={isPrivate}>
						<Icon
							name={isPrivate ? "eyeOffOutline" : "eyeOutline"}
							color={isPrivate ? "danger" : "white"}
							size="16px"
						/>
					</VisibilityBadge>
					<VerifiedBadge aria-label={isVerified ? "verified" : "unverified"} $verified={isVerified}>
						<Icon
							name={isVerified ? "checkmarkDoneCircle" : "checkmarkDoneCircleOutline"}
							color={isVerified ? "success" : "medium"}
							size="16px"
						/>
					</VerifiedBadge>
				</Badges>
			</Info>
			<House>
				<Paw name="paw" color="light" />
			</House>
		</Card>
	);
};

const Card = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1.5)};
	padding: ${$uw(1.25)} ${$uw(1.5)};
	border-radius: 16px;
	background: ${$color("background")};
	border: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
	cursor: pointer;
	transition: border-color 0.15s ease, transform 0.15s ease;
	&:active {
		transform: scale(0.99);
		border-color: ${$color("primary")};
	}
	@media (hover: hover) {
		&:hover {
			border-color: ${$color("primary")};
		}
	}
`;

const Info = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.25)};
`;

const Name = styled.span`
	font-size: 1.8rem;
	font-weight: 700;
	word-break: break-word;
`;

const Address = styled.span`
	font-size: 1.4rem;
	color: ${$color("medium")};
	word-break: break-word;
`;

const Badges = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${$uw(0.5)};
	margin-top: ${$uw(0.25)};
	> .chip {
		padding: 2px 12px;
	}
	> .chip span {
		font-size: 1.1rem;
	}
`;

const House = styled.div`
	flex: 0 0 auto;
	width: ${$uw(4.5)};
	height: ${$uw(4.5)};
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding-bottom: ${$uw(0.7)};
	box-sizing: border-box;
	clip-path: polygon(50% 0%, 100% 35%, 100% 100%, 0% 100%, 0% 35%);
	background: ${$color("primary")};
`;

const Paw = styled(Icon)`
	width: ${$uw(1.9)};
	height: ${$uw(1.9)};
`;

const VisibilityBadge = styled.div<{ $private: boolean }>`
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	border-radius: 50%;
	background: ${({ $private }) => ($private ? $color("dark") : $color("primary"))};
`;

const VerifiedBadge = styled.div<{ $verified: boolean }>`
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	border-radius: 50%;
	background: ${({ $verified }) => ($verified ? $color("success-tint") : $color("step-100"))};
`;
