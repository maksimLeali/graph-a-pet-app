import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe } from "../types";
import { Image2x } from "./Image2x";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";
import { SpecialIconName } from "./SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../utils";

type props = {
    appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {
    return (
        <Container
            color={
                appointment?.health_card?.pet.main_picture?.main_color?.color
            }
            appointmentColor={'var(--ion-color-light-shade)'}
            // appointmentColor={appointment?.health_card?.pet.main_picture?.main_color?.color}
            // appointmentColor={treatmentsColors[appointment!.type]}
        >
            <Heading className="heading">
                <ImageWrapper className="image-wrapper">
                    <Image2x
                        id={appointment!.health_card!.pet.main_picture!.id}
                    />
                </ImageWrapper>

                <Title>
                    {dayjs(appointment!.date).format("HH:mm")}
                </Title>

                <IconWrapper className="icon-wrapper">
                    <SpecialIcon
                        name={appointment?.type.toLocaleLowerCase() as SpecialIconName}
                        // color={'var(--ion-color-primary)'}
                        color={treatmentsColors[appointment!.type]}
                    />
                </IconWrapper>
            </Heading>
            <Footer className="footer">
              <CustomSpan>
                {appointment?.name}
              </CustomSpan>
            </Footer>
        </Container>
    );
};

const Container = styled.div<{ color?: string, appointmentColor?:string }>`
    width: 100%;

    position: relative;

    margin-bottom: 20px;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .heading {
        background-color: ${({ appointmentColor }) =>
            appointmentColor ? appointmentColor : "var(--ion-color-primary)"};
          color: var(--ion-color-dark);
          
    }
    .footer {
      background-color: var(--ion-background-color);
      border-color: ${({ appointmentColor }) =>
          appointmentColor ? appointmentColor : "var(--ion-color-primary)"};
      
    }
    .image-wrapper{

        border-color: ${({ color }) =>
            color ? color : "var(--ion-color-primary)"};
    }
    .icon-wrapper {
        border-color: ${({ appointmentColor }) =>
          appointmentColor ? appointmentColor : "var(--ion-color-primary)"};
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
    border-radius: 40px;
    justify-content: space-between;
`;

const Footer = styled.div`
    width: calc(100% - 40px);
    margin: 0 20px;
    height:40px;
    border: 2px solid;
    border-radius: 0 0 5px 5px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CustomSpan = styled.span`
  font-size: 1rem;
`

const ImageWrapper = styled.div`
    width: 40px;
    aspect-ratio: 1;
    border-radius: 40px;
    left: 0;
    border: 2px solid;
`;

const IconWrapper = styled.div`
    width: 40px;
    aspect-ratio: 1;
    border-radius: 80px;
    display: flex;
    border: 2px solid;
    background-color: var(--ion-background-color);
    padding: 8px;
    box-sizing: border-box;
    align-items: center;
    > * {
        width: 100%;
    }
`;

