import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useMemo } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import React from "react";
import gsap from "gsap";

import { Maybe } from "@types";
import { AppointmentFragment } from "@graphql_generated/appointment.generated";

import { MinAppointment } from "@components";
import { $color, $uw } from "@theme";


type props = {
	appointments?: AppointmentFragment[] | Maybe<AppointmentFragment>[];
	loading?: boolean;
};

const animateGroupDate = (element: any) => {
	if (!element) return;
	gsap.fromTo(
		element,
		{ opacity: 0 },
		{ opacity: 1, duration: 0.8, ease: "power2.out" }
	);
};

export const AppointmentsList: React.FC<props> = ({
	appointments = [],
	loading = false,
}) => {
	const { t } = useTranslation();

	const groupedAppointments = useMemo(() => {
		return _.groupBy(appointments, (item) => item!.date.split("T")[0]);
	}, [appointments]);

	const appointmentsDates = useMemo(() => {
		return _.sortBy(
			Object.keys(groupedAppointments),
			(date) => new Date(date)
		);
	}, [groupedAppointments]);

	return (
		<Container>
			{loading && (
				<SkeletonMinAppointment key={"twst"}>
					<SkeletonIcon className="skeleton" />
					<SkeletonTextes>
						<SkeletonP className="skeleton title" />
						<SkeletonP className="skeleton" />
					</SkeletonTextes>
					<SkeletonTag className="skeleton" />
				</SkeletonMinAppointment>
			)}
			{/* {appointments.length > 0 &&
				!loading &&
				appointments.map((appointment) => {
					return (
						<MinAppointment
							key={appointment?.id}
							appointment={appointment}
						/>
					);
				})} */}
			{appointmentsDates.length > 0 &&
				!loading &&
				appointmentsDates.map((date, i) => {
					return (
						<React.Fragment key={`${i}-${date}`}>
							<p
								className="group_date"
								ref={(el) => animateGroupDate(el)}
							>
								{dayjs(date).format("dddd D MMMM")}
							</p>

							{groupedAppointments[date].map((appointment, i) => {
								return (
									<MinAppointment
										key={`${i}-${appointment?.id}`}
										appointment={appointment}
									/>
								);
							})}
						</React.Fragment>
					);
				})}
			{!loading && !appointments.length && (
				<span
					dangerouslySetInnerHTML={{
						__html: t("events.general.no_events") ?? "",
					}}
				/>
			)}
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 20px 12px;
	align-items: center;
	.group_date {
		opacity: 0;
		width: 100%;
		border-bottom: 1px solid ${$color('medium')};
		padding-bottom: ${$uw(1)};
	}
`;

const SkeletonMinAppointment = styled.div`
	width: ${$uw(28)};
	height: ${$uw(4)};
	display: flex;
	margin-top: ${$uw(4.5)};
	padding: 14px;
	justify-content: space-between;
	align-items: center;
`;

const SkeletonIcon = styled.div`
	width: 38px;
	height: 38px;
	border-radius: 50px;
`;

const SkeletonTextes = styled.div`
	width: calc(100% - 150px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 7px;
	height: 100%;
`;

const SkeletonP = styled.div`
	height: 10px;
	width: 100%;
	&.title {
		width: 120px;
		height: 16px;
	}
`;

const SkeletonTag = styled.div`
	width: 80px;
	height: 26px;
	border-radius: 20px;
`;
