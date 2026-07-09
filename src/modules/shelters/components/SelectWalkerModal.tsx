import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Icon } from "@components";
import { $color, $uw } from "@theme";

export type WalkerKind = "user" | "person";

export type PickableMember = {
	id: string;
	name: string;
	kind: WalkerKind;
};

export type WalkerSelection = { id: string; kind: WalkerKind };

type Props = {
	members: PickableMember[];
	defaultSelection?: WalkerSelection;
	onChange: (selection: WalkerSelection) => void;
};

const key = (s: { id: string; kind: WalkerKind }) => `${s.kind}:${s.id}`;

// Modale scelta walker: selezione singola tra membri dello shelter (team) e
// shelter people segnati come volontari.
export const SelectWalkerModal: React.FC<Props> = ({
	members,
	defaultSelection,
	onChange,
}) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<string | undefined>(
		defaultSelection ? key(defaultSelection) : undefined
	);

	const pick = (m: PickableMember) => {
		setSelected(key(m));
		onChange({ id: m.id, kind: m.kind });
	};

	const team = members.filter((m) => m.kind === "user");
	const volunteers = members.filter((m) => m.kind === "person");

	const renderGroup = (label: string, group: PickableMember[]) =>
		group.length > 0 && (
			<Group>
				<GroupLabel>{label}</GroupLabel>
				<Members>
					{group.map((m) => {
						const on = selected === key(m);
						return (
							<MemberChip
								key={key(m)}
								type="button"
								$on={on}
								onClick={() => pick(m)}
							>
								{on && <Icon name="checkmark" color="light" size="14px" />}
								<span>{m.name}</span>
							</MemberChip>
						);
					})}
				</Members>
			</Group>
		);

	return (
		<Wrap>
			<Head>
				<b>{t("shelters.walks.assign_to")}</b>
			</Head>

			{members.length === 0 ? (
				<Empty>{t("shelters.tasks.no_members")}</Empty>
			) : (
				<>
					{renderGroup(t("shelters.contacts.members"), team)}
					{renderGroup(t("shelters.contacts.volunteers"), volunteers)}
				</>
			)}
		</Wrap>
	);
};

const Wrap = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 ${$uw(2)} ${$uw(1)};
	display: flex;
	flex-direction: column;
	gap: ${$uw(1.5)};
`;

const Head = styled.div`
	width: 100%;
	> b {
		font-size: 1.8rem;
		color: ${$color("primary")};
	}
`;

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${$uw(0.75)};
	max-height: 30dvh;
	overflow-y: auto;
`;

const GroupLabel = styled.span`
	font-size: 1.2rem;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: ${$color("medium")};
`;

const Members = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${$uw(1)};
`;

const MemberChip = styled.button<{ $on: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${$uw(0.75)};
	border: 1px solid ${$color("primary")};
	border-radius: ${$uw(1)};
	padding: ${$uw(1)} ${$uw(1.5)};
	cursor: pointer;
	background: ${({ $on }) => ($on ? $color("primary") : $color("background"))};
	> span {
		font-size: 1.4rem;
		font-weight: 600;
		color: ${({ $on }) => ($on ? $color("light") : $color("dark"))};
	}
`;

const Empty = styled.div`
	width: 100%;
	text-align: center;
	color: ${$color("medium")};
	font-size: 1.6rem;
	padding: ${$uw(2)} 0;
`;
