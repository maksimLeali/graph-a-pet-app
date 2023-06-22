import { useEffect, useState } from "react";
import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useParams } from "react-router";
import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";
import { FullTreatmentFragment } from "../../../components/operations/__generated__/fullTreatment.generated";
import { IonContent } from "@ionic/react";
import { Icon } from "../../../components";
import { useTranslation } from "react-i18next";

type props = {

}

export const EventDetails: React.FC<props> = ()=> {
    const { id } = useParams<{ id: string }>();
    const [actionsOpen, setActionsOpen] = useState(false)
    const { setPage } = useUserContext();
    const [event,setEvent] = useState<FullTreatmentFragment>();
    const {t} = useTranslation()
    const [getEvent, {loading}] = useGetTreatmentLazyQuery({
        onCompleted:({getTreatment})=> {
            if(!getTreatment?.treatment || getTreatment.error){
                return
            }
            setEvent(getTreatment.treatment)
            console.log(getTreatment.treatment)
        }
    })
    useEffect(() => {
        console.log(id)
        setPage({ visible: false, name: "" });
        getEvent({variables:{id}})
    }, []);


    return <IonContent>
        <Header >

        </Header>
        <Logs>
            <h2>Note:</h2>
            { event?.logs?.length 
                ? event?.logs?.map( (log, i) => <p key={i}> { log } </p> ) 
                : <h4>{t('events.general.no_events')}</h4>
            }
        </Logs>
        <Actions>
            
            <IconsWrapper className={`${actionsOpen ? 'open' : ''}`}>
                <Icon name="ellipsisVerticalOutline" size="24px" onMouseUp={()=> {setActionsOpen(!actionsOpen)}} />
                <Icon name="createOutline" size="24px" onMouseUp={()=> {setActionsOpen(!actionsOpen)}} />
                <Icon name="copyOutline" size="24px" onMouseUp={()=> {setActionsOpen(!actionsOpen)}} />
                <Icon name="trash" color="danger" size="24px" onMouseUp={()=> {setActionsOpen(!actionsOpen)}} />
            </IconsWrapper>
        </Actions>
    </IonContent>
}

const Header = styled.div`
    width: 100%;
    height: 50px;
    background-color:var(--ion-color-light-shade) ;

`

const Logs = styled.div`
    width: 100%;
    > p {
        padding: 24px 12px;
        border-bottom: 1px solid var(--ion-color-dark) ;
        margin-bottom: 16px;
    }
    
    > * {
        padding-left :12px;
        padding-right :12px;
    }
    

`

const Actions = styled.div`
    width: 100%;
    position:absolute;
    bottom: 40px;
    right: 24px;
    
    
`

const IconsWrapper = styled.div`
    width:38px;
    max-height: 38px;
    height: 300px;
    margin-left: auto;
    border: 2px solid var(--ion-color-medium);
    background-color: var(--ion-color-light-tint);
    padding: 2px;
    border-radius: 30px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center ;
    justify-content: space-between ;
    overflow-y: hidden;
    box-shadow: var(--ion-color-light-shade) 0px 1px 4px, var(--ion-color-light-shade) 0px 0px 0px 3px;
    
    box-sizing: border-box;
    transition: max-height .5s ease-in;
    &.open{
        max-height: calc(45px * 4);
    }

`