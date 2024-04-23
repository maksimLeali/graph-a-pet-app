import styled from "styled-components";
import { Chip, Icon, Image2x } from ".";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { custodyLevelColors } from "../utils";
import { PetMinSubOwnerFragment } from "./operations/__generated__/petMinSubOwner.generated";
import { $cssTRBL, $uw } from "../utils/theme/functions";

type props = {
	ownership: PetMinSubOwnerFragment;
	onSelected: (v: string) => void;
};

export const SubOwnerListItem: React.FC<props> = ({
	ownership,
	onSelected,
}) => {
	const { t } = useTranslation();
	return (
		<Item onClick={() => onSelected("pippo")}>
			<UserImageBox>
				{ownership?.user?.profile_picture && (
					<Image2x
						lazy
                        rounded
						id={ownership.user.profile_picture.id}
						alt={`${ownership.user.first_name} ${ownership.user.last_name} picture`}
					/>
				)}
			</UserImageBox>
			<DescBox>
				<h5>
					{ownership?.user.first_name} {ownership?.user.last_name}
				</h5>
				<span>{ownership?.user.email}</span>
			</DescBox>
			<ActionsOpener>
				<Chip
					color={custodyLevelColors[ownership.custody_level]}
					label={t(
						`pets.${ownership.custody_level.toLowerCase()}_short`
					)}
				/>
			</ActionsOpener>
		</Item>
	);
};

const Item = styled.div`
	width: 100%;
	border-bottom: 1px solid var(--ion-color-medium);
	height: ${$uw(5)};
	padding: ${$cssTRBL(0, 2)};
	display: flex;
	justify-content: flex-start;
`;
const UserImageBox = styled.div`
	width: ${$uw(5)};
	margin-right: 10px;
	padding: ${$uw(0.5)};
	> .img2x {
		width: 100%;
		height: 100%;
	}
`;

const DescBox = styled.div`
	display: flex;
	max-width: ${$uw(16)};
	flex-direction: column;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const ActionsOpener = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: auto;
`;
