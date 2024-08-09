import { IonContent } from "@ionic/react";
import styled from "styled-components";
import { Pets, SkeletonBox } from "../components";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { AppointmentFragment } from "@graphql_generated/appointment.generated";

import { useUserContext } from "@contexts";
import { ReportsPreview, WeeksView } from "@components";
import { $uw } from "@theme";

export const Home: React.FC = () => {
	const [activePet, setActivePet] = useState(0);
	const { setPage, ownedPets: pets, loading, reports } = useUserContext();
	const [appointments, setAppointments] = useState<AppointmentFragment[]>();
	useEffect(() => {
		setPage({ name: "Home" });
	}, []);

	useEffect(() => {
		if (pets.length) {
			searchAppointments();
		}
	}, [activePet, pets]);

	useEffect(() => {
		console.log("loafing: ", loading);
	}, [loading]);

	const searchAppointments = useCallback(() => {
		setAppointments(
			pets.length
				? pets
						.map(
							(pet) =>
								pet.health_card?.treatments.items?.map(
									(treatment) => ({
										date: treatment!.date,
										type: treatment!.type,
										id: treatment!.id,
										name: treatment!.name,
										health_card: {
											pet: {
												id: pet.id,
												name: pet.name,
												main_picture: {
													id: pet.main_picture?.id,
													main_color: {
														color: pet.main_picture
															?.main_color?.color,
													},
												},
											},
										},
									})
								) as unknown as AppointmentFragment[]
						)
						.flat()
				: []
		);
	}, [pets, activePet]);

	return (
		<IonContent fullscreen>
			{loading && <SkeletonBox />}
			{pets && pets.length > 0 && (
				<Pets pets={pets} onActiveChange={(v) => setActivePet(v)} />
			)}
			{!loading &&  !pets?.length && (
				<EmptyContainer>
					<h4> Nessun cucciolo</h4>
				</EmptyContainer>
			)}
			

			<WeeksView
				appointments={appointments}
				loading={loading}
				fromDate={dayjs().startOf("w").toDate()}
			/>

			<ReportsPreview 
				loading={loading}
				reports={reports}
				
			/>
		</IonContent>
	);
};

const EmptyContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${$uw(32)};
`;
