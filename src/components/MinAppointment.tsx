import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe } from "../types";
import { Image2x } from "./Image2x";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";
import { SpecialIconName } from "./SpecialIcons/SpecialIcons";
import { treatmentsColors } from "../utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type props = {
  appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {
  const { t } = useTranslation();

  return (
    <Container
      color={appointment?.health_card?.pet.main_picture?.main_color?.color}
      // appointmentColor={'var(--ion-color-light-tint)'}
      appointmentColor={
        appointment?.health_card?.pet.main_picture?.main_color?.color ??
        "var(--ion-color-primary)"
      }
      //appointmentColor={treatmentsColors[appointment!.type]}
    >
      <Heading className="heading">
        <PetName>
          {appointment?.health_card?.pet.name + ": "}
          {t(`events.${appointment?.type.toLocaleLowerCase()}`)}
        </PetName>
       
        
      </Heading>
      <Footer className="footer">
        <CustomSpan>{appointment?.name}</CustomSpan>
      </Footer>
      {/* <ImageWrapper className="image-wrapper">
        <Image2x id={appointment!.health_card!.pet.main_picture!.id} />
    </ImageWrapper> */}
      <IconWrapper
        className="icon-wrapper"
        borderColor={treatmentsColors[appointment!.type]}
        //borderColor={treatmentsColors[appointment!.type]}
        //borderColor={"var(--ion-color-primary-tint)"}
        //borderColor={'var(--ion-color-light-tint)'}
      >
        <SpecialIcon
          name={appointment?.type.toLocaleLowerCase() as SpecialIconName}
          // color={'var(--ion-color-primary)'}
          color={treatmentsColors[appointment!.type]}
          //color={appointment?.health_card?.pet.main_picture?.main_color?.color ?? 'var(--ion-color-primary)'}
          // color={"var(--ion-color-primary-tint)"}
          //color={'var(--ion-color-light-tint)'}
        />
      </IconWrapper>
      <AppointmentTime>{dayjs(appointment!.date).format("HH:mm")}</AppointmentTime>
    </Container>
  );
};

const Container = styled.div<{ color?: string; appointmentColor: string }>`
  width: 100%;

  position: relative;

  margin-bottom: 20px;

  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 3px 16px 0px;
  .heading {
    
    color: var(--ion-color-light);
    background-color: var(--ion-color-light-shade);
    .dark & {
        background-color: var(--ion-color-light-tint);
        
      color: var(--ion-color-dark);
    }
  }
  .footer {
    background-color: var(--ion-background-color);
    border-color: var(--ion-color-light-shade);
    .dark & {
      border-color: var(--ion-color-light-tint);
    }
  }
  .image-wrapper {
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
  padding-left: 70px;
  padding-right: 20px;
  padding-bottom: 5px;
  border-radius: 2px 2px 0 0;
  justify-content: space-between;
  align-items: flex-end;

`;

const Footer = styled.div`
  width: 100%;
  /* width: calc(100% - 40px); */
  height: 40px;
  border-radius: 0 0 2px 2px;
  border: 1px solid;
  /* border-radius: 0 0 5px 5px; */
  font-weight: 400;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 70px;
  justify-content: flex-start;
`;

const CustomSpan = styled.span`
  font-size: 1rem;
`;

const ImageWrapper = styled.div`
  width: 70px;
  position: relative;
  aspect-ratio: 1;
  z-index: 1;
  border-radius: 40px;
  top: 5px;
  position: absolute;
  left: 5px;
  border: 2px solid;
`;

const IconWrapper = styled.div<{ borderColor: string }>`
  width: 28px;
  aspect-ratio: 1;
  border-radius: 80px;
  display: flex;
  left:15px;
  position: absolute;
  bottom: 5px;
  // border: 2px solid ${({ borderColor }) => borderColor};

  z-index: 1;


  padding: 4px;
  box-sizing: border-box;
  align-items: center;
  > * {
    width: 100%;
  }
`;

const PetName = styled.p`
  font-size: 1.2rem;
  margin-right: 10px;
  font-weight: 600;
  color: var(--ion-color-primary);
  margin: 0;
`;

const AppointmentTime = styled.div`
  position: absolute;
  top:18px;
  left:14px;
  font-weight: 600;
  font-size:.8rem;
  color: var(--ion-color-primary);
`