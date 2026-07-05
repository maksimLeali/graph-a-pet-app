import styled from "styled-components";
import dayjs from "dayjs";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

import { DashboardPetFragment } from "@graphql_generated/dashboardPet.generated";

import { useUserContext } from "@contexts";
import { treatmentsColors } from "@utils";
import {
	DateTimePicker,
	NumberInput,
	Option,
	SelectInput,
	StarRating,
	TextAreaInput,
	TextInput,
	SpecialIconName,
} from "@components";
import { FrequencyUnit, TreatmentType, WalkRatingType } from "@types";
import { EventOption } from "./EventOption";
import { $cssTRBL, $uw } from "@theme";

export const AddEventFormStep1 = () => {
	const { pets } = useUserContext();
	const { t } = useTranslation();

	const petsOptions: Option[] = pets
		.sort((a, b) => {
			if (a.owner && !b.owner) return -1;
			if (!a.owner && b.owner) return 1;
			return 0;
		})
		.map((pet: DashboardPetFragment) => ({
			value: pet.health_card!.id,
			label: pet.name,
			render: <PetName>{pet.name}</PetName>,
		}));

	const typeOptions: Option[] = Object.values(TreatmentType).map((key) => ({
		value: key,
		label: t(`events.${key.toLowerCase()}`),
		render: (
			<EventOption
				iconName={key.toLowerCase() as SpecialIconName}
				color={treatmentsColors[key.toUpperCase() as TreatmentType]}
				label={t(`events.${key.toLowerCase()}`)}
			/>
		),
	}));

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<SelectInput
				name="data.health_card_id"
				options={petsOptions}
				bgColor="light"
				required
				textLabel="events.pet"
			/>
			<SelectInput
				name="data.type"
				options={typeOptions}
				bgColor="light"
				required
				textLabel="events.type"
			/>
			<TextInput
				name="data.name"
				textLabel="events.name"
				bgColor="light"
				required
			/>
			<DateTimePicker
				name="date_date"
				textLabel="events.date_from"
				type="date"
				className="main_date"
				bgColor="light"
				required
			/>
			<DateTimePicker
				name="date_time"
				textLabel="events.time"
				type="time"
				className="main_time"
				bgColor="light"
				required
			/>
		</Form>
	);
};

const walkRatingLabels: Record<WalkRatingType, string> = {
	[WalkRatingType.Overall]: "Generale",
	[WalkRatingType.Behavior]: "Comportamento",
	[WalkRatingType.Calm]: "Calma",
	[WalkRatingType.Aggression]: "Aggressività",
	[WalkRatingType.LeashPulling]: "Tiro al guinzaglio",
};

export const AddEventFormStep2 = () => {
	const { t } = useTranslation();
	const { watch } = useFormContext();
	const type = watch("data.type") as TreatmentType | undefined;

	const frequencyUnitOptions: Option[] = Object.values(FrequencyUnit).map(
		(unit) => {
			const label = t(
				`events.frequency.${unit.toLowerCase()}` as any
			);
			return {
				value: unit,
				label,
				render: <PetName>{label}</PetName>,
			};
		}
	);

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{type === TreatmentType.Walk && (
				<>
					<NumberInput
						name="walk.distance_km"
						ntTextLabel="Distanza (km)"
						bgColor="light"
					/>
					{Object.values(WalkRatingType).map((rt) => (
						<StarRating
							key={rt}
							name={`walk.ratings.${rt}`}
							ntTextLabel={walkRatingLabels[rt]}
							size={$uw(2)}
						/>
					))}
				</>
			)}

			{type === TreatmentType.Cure && (
				<>
					<NumberInput
						name="cure.frequency_times"
						ntTextLabel="Numero di richiami"
						bgColor="light"
					/>
					<Row>
						<Half>
							<NumberInput
								name="cure.frequency_value"
								ntTextLabel="Ogni (valore)"
								bgColor="light"
							/>
						</Half>
						<Half>
							<SelectInput
								name="cure.frequency_unit"
								options={frequencyUnitOptions}
								bgColor="light"
								ntTextLabel="Unità di richiamo"
							/>
						</Half>
					</Row>
				</>
			)}

			<TextAreaInput
				name="notes"
				textLabel="events.notes"
				bgColor="light"
			/>
		</Form>
	);
};

const Form = styled.div`
	width: 100%;
	overflow-y: scroll;
	max-height: ${$uw(40)};
	display: flex;
	padding: ${$cssTRBL(2, 2)};
	flex-wrap: wrap;
	justify-content: space-between;
	.main_date {
		width: 55%;
	}
	.main_time {
		width: 40%;
	}
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const Half = styled.div`
	width: 48%;
`;

const PetName = styled.span`
	padding-left: ${$uw(1)};
`