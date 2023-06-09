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
       
        <CustomSpan>{dayjs(appointment!.date).format("HH:mm")}</CustomSpan>
      </Heading>
      <Footer className="footer">
        <CustomSpan>{appointment?.name}</CustomSpan>
      </Footer>
      <ImageWrapper className="image-wrapper">
        <Image2x id={appointment!.health_card!.pet.main_picture!.id} />
      </ImageWrapper>
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
  .heading {
    background-color: var(--ion-color-medium-tint);
    color: var(--ion-color-light);
    .dark & {
      background-color: var(--ion-color-light-tint);
      color: var(--ion-color-dark);
    }
    ::after {
      border-color: ${({ appointmentColor }) => appointmentColor};
      background-color: ${({ appointmentColor }) => appointmentColor};
    }
  }
  .footer {
    background-color: var(--ion-background-color);
    border-color: var(--ion-color-medium-tint);
    .dark & {
      border-color: var(--ion-color-light-tint);
    }
    ::after {
      border-color: ${({ appointmentColor }) => appointmentColor};
      background-color: ${({ appointmentColor }) => appointmentColor};
      border-color: var(--ion-color-medium-tint);
      .dark & {
        border-color: var(--ion-color-light-tint);
      }
      /* background-color: var(--ion-background-color); */
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
  padding-left: 90px;
  padding-right: 20px;
  padding-bottom: 5px;
  border-radius: 40px 40px 0 0;
  justify-content: space-between;
  align-items: flex-end;
  ::after {
    content: "";
    width: 78px;
    height: 38px;
    left: 2px;
    top: 2px;
    border-radius: 40px 0 0 0;
    position: absolute;
  }
`;

const Footer = styled.div`
  width: 100%;
  /* width: calc(100% - 40px); */
  height: 40px;
  border-radius: 0 0 40px 40px;
  border: 2px solid;
  /* border-radius: 0 0 5px 5px; */
  font-weight: 400;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 90px;
  justify-content: flex-start;
  ::after {
    content: "";
    width: 78px;
    height: 38px;
    left: 0px;
    top: -2px;
    border-right: 2px solid;
    border-radius: 0 0 0 40px;
    position: absolute;
  }
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
  display: none;
  left:44px;
  position: absolute;
  top: 44px;
  border: 2px solid ${({ borderColor }) => borderColor};

  z-index: 1;
  background-color: #0008;

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
  margin: 0;
`;
