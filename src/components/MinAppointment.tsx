import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe } from "../types";
import { Image2x } from "./Image2x";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";
import { SpecialIconName } from "./SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../utils";
import { useTranslation } from "react-i18next";

type props = {
    appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {

    const {t} = useTranslation()

    return (
        <Container
            color={
                appointment?.health_card?.pet.main_picture?.main_color?.color
            }
            // appointmentColor={'var(--ion-color-light-tint)'}
            // appointmentColor={appointment?.health_card?.pet.main_picture?.main_color?.color}
            // appointmentColor={treatmentsColors[appointment!.type]}
        >
            <Heading className="heading">
                {/* <ImageWrapper className="image-wrapper">
                    <Image2x
                        id={appointment!.health_card!.pet.main_picture!.id}
                    />
                </ImageWrapper> */}
                
                
                <PetName>
                    {appointment?.health_card?.pet.name+ ": "}
                    {t(`events.${appointment?.type.toLocaleLowerCase()}`)}
                    
                    
                </PetName>
                <CustomSpan>
                    {dayjs(appointment!.date).format("HH:mm")}
            </CustomSpan>
                
            </Heading>
            <Footer className="footer">
              <CustomSpan>
              {appointment?.name}
              </CustomSpan>
              
                
            </Footer>
            <IconWrapper className="icon-wrapper" borderColor={treatmentsColors[appointment!.type]}>
                    <SpecialIcon
                        name={appointment?.type.toLocaleLowerCase() as SpecialIconName}
                        // color={'var(--ion-color-primary)'}
                        color={treatmentsColors[appointment!.type]}
                        />
                </IconWrapper>
        </Container>
    );
};

const Container = styled.div<{ color?: string,  }>`
    width: 100%;

    position: relative;

    margin-bottom: 20px;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .heading {
        background-color: var(--ion-color-medium-tint);
        color: var(--ion-color-light);
        .dark &{
            background-color: var(--ion-color-light-tint);
            color: var(--ion-color-dark);
        }
    }
    .footer {
      background-color: var(--ion-background-color);
      border-color: var(--ion-color-medium-tint);
      .dark &{
            border-color: var(--ion-color-light-tint);

        }

      
    }
    .image-wrapper{

        border-color: ${({ color }) =>
            color ? color : "var(--ion-color-primary)"};
    }

`;
const Title = styled.span`
    position: relative;
    margin-top: -1px;
    text-align: center;
    font-weight: 600;
    display: flex;
    line-height: 2rem;
    font-size: 2rem;
    align-items: center;
`;

const Heading = styled.div`
    height: 40px;
    width: 100%;
    display: flex;
    padding-left: 60px;
    padding-right: 20px;
    padding-bottom: 5px;
    border-radius: 40px 40px 0 0;
    justify-content: space-between;
    align-items: flex-end;
`;

const Footer = styled.div`
    width: 100% ;
    /* width: calc(100% - 40px); */
    margin: 0 20px;
    height:40px;
    border-radius: 0 0 40px 40px;
    border: 2px solid;
    /* border-radius: 0 0 5px 5px; */
    font-weight: 400;
    display: flex;
    align-items: center;
    padding-left: 60px;
    justify-content: flex-start;
`;

const CustomSpan = styled.span`
  font-size: 1rem;
`

const ImageWrapper = styled.div`
    width: 40px;
    position:relative;
    aspect-ratio: 1;
    z-index:2;
    border-radius: 40px;
    left: 0;
    border: 2px solid;
`;

const IconWrapper = styled.div<{borderColor: string}>`
    width: 40px;
    aspect-ratio: 1;
    border-radius: 80px;
    display: flex;
    left: 10px;
    top:20px;
    position: absolute;
    border: 2px solid ${({borderColor})=> borderColor};
    z-index:1;
    background-color: var(--ion-background-color);
    padding: 6px;
    box-sizing: border-box;
    align-items: center;
    > * {
        width: 100%;
    }
`;

const PetName = styled.p`
    font-size: 1.5rem;
    margin-right: 10px;
    margin: 0;
    
`