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

export const AddEventForm = () => {
    const { t } = useTranslation();
    const options: Option[] = Object.values(TreatmentType).map((key) => ({
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
            <TextInput name="data.name" textLabel="events.name" bgColor="light" />
            <TextAreaInput name="data.description" textLabel="events.notes" bgColor="light" />
            <DateTimePicker name="test" ntTextLabel="test" type="dateTime" bgColor="light" />
            <SelectInput name="data.type" options={options} bgColor="light" textLabel="events.type" />
        </Form>
    );
};

const Form = styled.div`
    width: 100%;
    padding: 20px;
`;
