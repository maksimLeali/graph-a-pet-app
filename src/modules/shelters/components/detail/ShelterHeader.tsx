import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Image2x, Icon } from "@components";
import { ShelterVerificationStatus } from "@types";
import { $color, $uw } from "@theme";

type Props = {
	name?: string;
	address?: string;
	verificationStatus?: ShelterVerificationStatus;
	logoMediaId?: string | null;
	loading?: boolean;
	onSettings?: () => void;
};

export const ShelterHeader: React.FC<Props> = ({
	name,
	address,
	verificationStatus,
	logoMediaId,
	loading,
	onSettings,
}) => {
	const { t } = useTranslation();

	if (loading) {
		return (
			<Bar>
				<Logo className="skeleton" />
				<Titles>
					<NameRow>
						<SkeletonLine className="skeleton" style={{ width: "60%" }} />
					</NameRow>
					<SkeletonLine className="skeleton" style={{ width: "40%" }} />
				</Titles>
			</Bar>
		);
	}

	return (
		<Bar>
			<Logo>
				{logoMediaId ? (
					<Image2x id={logoMediaId} />
				) : (
					<Icon name="paw" color="primary" size="22px" />
				)}
			</Logo>
			<Titles>
				<NameRow>
					<h2>{name}</h2>
					{verificationStatus === ShelterVerificationStatus.Verified && (
						<Verified>
							<Icon
								name="checkmarkCircle"
								color="primary"
								size="13px"
							/>
							<span>{t("shelters.badges.verified")}</span>
						</Verified>
					)}
				</NameRow>
				{address && <Address>{address}</Address>}
			</Titles>
			{onSettings && (
				<SettingsButton
					type="button"
					aria-label={t("shelters.overview.settings") ?? ""}
					onClick={onSettings}
				>
					<Icon name="settingsOutline" color="medium" size="20px" />
				</SettingsButton>
			)}
		</Bar>
	);
};

const Bar = styled.div`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: ${$uw(1)};
	padding: ${$uw(1)} 12px;
	border-bottom: 1px solid rgba(var(--ion-color-primary-rgb), 0.2);
`;

const Logo = styled.div`
	flex: 0 0 auto;
	width: ${$uw(3)};
	height: ${$uw(3)};
	border-radius: 12px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--ion-color-primary-rgb), 0.12);
	> .img2x {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const Titles = styled.div`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const NameRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${$uw(0.5)};
	min-width: 0;
	> h2 {
		margin: 0;
		font-size: 1.85rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const Verified = styled.span`
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.25)};
	> span {
		font-size: 1.2rem;
		font-weight: 700;
		color: ${$color("primary")};
	}
`;

const Address = styled.span`
	font-size: 1.3rem;
	color: ${$color("medium")};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const SettingsButton = styled.button`
	flex: 0 0 auto;
	width: ${$uw(3)};
	height: ${$uw(3)};
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 12px;
	background: transparent;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
`;

const SkeletonLine = styled.span`
	display: block;
	height: ${$uw(1)};
	border-radius: 6px;
`;
