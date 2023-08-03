
import styled from "styled-components";
import { SelectInput, TextAreaInput, TextInput } from "../../../components";



export const AddEventForm = ()=> {

    return (
        <Form onSubmit={(e)=> {e.preventDefault(); e.stopPropagation()} }>
            <TextInput name="data.name" textLabel="events.name"/>
            <TextAreaInput name="data.description" textLabel="events.notes" />
            {/* <SelectInput name="data.type" options={[{label: 'test', value: 'pippo'}]} onSelected={}/> */}
        </Form>

    )
}


const Form = styled.div`
    width: 100%;
    padding: 20px;
`