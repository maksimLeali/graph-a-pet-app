import { useForm } from "react-hook-form";
import styled from "styled-components"
import { MutationCreateTreatmentArgs } from "../../../types";
import { SubmitInput, TextInput } from "../../../components";
import { useTranslation } from "react-i18next";



export const AddEventForm = ()=> {

    const methods = useForm<MutationCreateTreatmentArgs>({ mode: "onSubmit" });
    const {t} = useTranslation() 
    return <Form>
        <TextInput name="name" textLabel="events.name"/>
        <SubmitInput color="primary" >{t('events.addEvent')}</SubmitInput>
    </Form>
}

const Form = styled.form`
    
`