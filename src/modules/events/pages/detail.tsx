import { useEffect, useState } from "react";
import styled from "styled-components"
import { useUserContext } from "../../../contexts";
import { useParams } from "react-router";
import { useGetTreatmentLazyQuery } from "../operations/__generated__/getAppointment.generated";
import { FullTreatmentFragment } from "../../../components/operations/__generated__/fullTreatment.generated";
import { IonContent } from "@ionic/react";
import { Icon, SpecialIcon } from "../../../components";
import { useTranslation } from "react-i18next";
import { SpecialIconName } from "../../../components/SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../../../utils";

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
            <Top > 
                
                
                <IconWrapper className={`${loading? 'skeleton' : ''}`}>
                    {event && <SpecialIcon name={event.type.toLocaleLowerCase() as SpecialIconName} color={treatmentsColors[event.type]} />}
                </IconWrapper>
                 <h2 className={`${loading? 'skeleton' : ''}`} >{event && t(`events.${event.type.toLocaleLowerCase()}`)}</h2>
    
            
            </Top>
            {loading 
                ? <SkeletonP className="skeleton" /> 
                : <p>{event ? event.name : ''} </p>
            } 
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
    width: calc(100% - 2px);
    border: 2px solid var(--ion-color-light-shade) ;
    border-top: 0;
    border-left: 0 ;
    border-radius: 0 0 8px 0;
    box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
    display: flex; 
    justify-content: flex-start;
    flex-direction: column;
    padding: 10px 12px;
    gap :15px;
    padding-left:12px;
    > p {
        margin: 0;
    }   
`
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
        min-height:30px;
    }
`

const IconWrapper =styled.div`
    width: 46px;
    aspect-ratio: 1;
    border-radius: 80px;
    height:fit-content;
    z-index: 1;
    padding: 10px;
    background-color: var(--ion-color-light-tint);
    background-color: var(--ion-color-light-shade);
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    > * {
        width: 100%;
    }
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

const SkeletonP = styled.div`
    width: 100px;
    height: 19px;
`