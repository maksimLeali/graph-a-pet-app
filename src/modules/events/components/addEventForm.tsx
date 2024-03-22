import styled from "styled-components";
import {
  DateTimePicker,
  Option,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../../../components";
import { TreatmentType } from "../../../types";
import { useTranslation } from "react-i18next";
import { EventOption } from "./EventOption";
import { SpecialIconName } from "../../../components/SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../../../utils";
import dayjs from "dayjs";
import { useUserContext } from "../../../contexts";
import { useEffect } from "react";

import _ from "lodash";
import { DashboardPetFragment } from "../../../components/operations/__generated__/dashboardPet.generated";

export const AddEventForm = () => {
  const { pets } = useUserContext();
  const { t } = useTranslation();

  const petsOptions: Option[] = pets
    .sort((a, b) => {
      if (a.owner && !b.owner) return -1;
      if (!a.owner && b.owner) return 1;
      return 0;
    })
    .map((pet: DashboardPetFragment) => {
      return {
        value: pet.health_card!.id,
        label: pet.name,
        render: <span>{pet.name}</span>,
      };
    });

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
      <TextInput
        name="data.name"
        textLabel="events.name"
        bgColor="light"
        required
      />
      <SelectInput
        name="data.type"
        options={typeOptions}
        bgColor="light"
        required
        textLabel="events.type"
      />
      <DateTimePicker
        name="data.date"
        textLabel="events.date_time_from"
        type="dateTime"
        bgColor="light"
        required
        minDate={dayjs().toISOString()}
        
      />
      <DateTimePicker
        name="data.booster_date"
        textLabel="events.booster_date_time_from"
        type="dateTime"
        bgColor="light"
        minDate={dayjs().toISOString()}
      />
      <TextAreaInput name="notes" textLabel="events.notes" bgColor="light" />
    </Form>
  );
};

const Form = styled.div`
  width: 100%;
  padding: 20px;
  overflow-y: scroll;
  max-height: 600px;
`;
