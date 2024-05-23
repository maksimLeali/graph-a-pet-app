import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams } from "react-router";

import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";
import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useUserContext } from "@contexts";
import { SpecialIconName, SpecialIcon } from "@components";
import { treatmentsColors } from "@utils";
import { $color } from "@theme";

type props = {};

export const EventDetails: React.FC<props> = () => {
	const { id } = useParams<{ id: string }>();

	const { setPage } = useUserContext();
	const [event, setEvent] = useState<FullTreatmentFragment>();
	const { t } = useTranslation();
	const [getEvent, { loading }] = useGetTreatmentLazyQuery({
		onCompleted: ({ getTreatment }) => {
			if (!getTreatment?.treatment || getTreatment.error) {
				return;
			}
			setEvent(getTreatment.treatment);
		},
	});
	useEffect(() => {
		setPage({ visible: false, name: "" });
		getEvent({ variables: { id } });
	}, []);

	return (
		<IonContent>
			<Header>
				<Top>
					<IconWrapper className={`${loading ? "skeleton" : ""}`}>
						{event && (
							<SpecialIcon
								name={
									event.type.toLocaleLowerCase() as SpecialIconName
								}
								color={treatmentsColors[event.type]}
							/>
						)}
					</IconWrapper>
					<h2 className={`${loading ? "skeleton" : ""}`}>
						{event && t(`events.${event.type.toLocaleLowerCase()}`)}
					</h2>
				</Top>
				{loading ? (
					<SkeletonP className="skeleton" />
				) : (
					<p>{event ? event.name : ""} </p>
				)}
			</Header>
			<Logs>
				<h2>Note:</h2>
				{event?.logs?.length ? (
					event?.logs?.map((log, i) => <p key={i}> {log} </p>)
				) : (
					<h4>{t("events.general.no_events")}</h4>
				)}
			</Logs>
		</IonContent>
	);
};

const Header = styled.div`
	width: calc(100% - 2px);
	border: 2px solid ${$color('light-shade')};
	border-top: 0;
	border-left: 0;
	border-radius: 0 0 8px 0;
	box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	padding: 10px 12px;
	gap: 15px;
	padding-left: 12px;
	> p {
		margin: 0;
	}
`;
const Top = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 15px;
	box-sizing: border-box;
	align-items: center;
	min-height: 50px;
	> h2 {
		margin-bottom: 0;
		margin-top: 0;
		min-width: 200px;
		min-height: 30px;
	}
`;

const IconWrapper = styled.div`
	width: 46px;
	aspect-ratio: 1;
	border-radius: 80px;
	height: fit-content;
	z-index: 1;
	padding: 10px;
	background-color: ${$color('light-tint')};
	background-color: ${$color('light-shade')};
	box-sizing: border-box;
	align-items: center;
	justify-content: center;
	> * {
		width: 100%;
	}
`;

const Logs = styled.div`
	width: 100%;
	> p {
		padding: 24px 12px;
		border-bottom: 1px solid ${$color('dark')};
		margin-bottom: 16px;
	}

	> * {
		padding-left: 12px;
		padding-right: 12px;
	}
`;

const SkeletonP = styled.div`
	width: 100px;
	height: 19px;
`;
