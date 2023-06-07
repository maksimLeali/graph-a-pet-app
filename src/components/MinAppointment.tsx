import dayjs from "dayjs";
import styled from "styled-components";
import { Maybe } from "../types";
import { Image2x } from "./Image2x";
import { AppointmentFragment } from "./operations/__generated__/appointment.generated";
import { SpecialIcon } from "./SpecialIcons";

type props = {
  appointment: AppointmentFragment | Maybe<AppointmentFragment>;
};

export const MinAppointment: React.FC<props> = ({ appointment }) => {
  return (
    <Container>
      <ImageWrapper>
        <Image2x id={appointment!.health_card!.pet.main_picture!.id} />
      </ImageWrapper>
        <Content>

        <Heading>
            <span>{appointment?.name}</span>
        </Heading>
      { <Body >
          

      </Body>}
      <Footer >
        <span>
            {dayjs(appointment!.date).format('HH:mm')}
        </span>
      </Footer>
        </Content>
      <IconWrapper>
        <SpecialIcon name="antiparasitic" color="var(--ion-color-primary)" />
      </IconWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border-radius: 10px 40px 40px 10px;
  position: relative;
  padding-top: 1px;
  margin-top: 20px;
  background-color: var(--ion-color-primary);
  margin-bottom: 20px;
  padding: 1px;
  box-sizing: border-box;
  display: flex;
  align-items:center ;
  justify-content: space-between ;
`;
const Heading = styled.div`
  width: 100%;
  height: 22px;
  position: relative;
  padding-left: 45px;
  margin-top: -1px;
  font-weight: 600 ;
  display: flex ;
  align-items:center ;
`;

const Footer = styled.div`
  width: 100%;
  height: 17px;
    display:flex ;
    justify-content: flex-end ;
    align-items:center ;
    > span {
        font-size: .7rem;
    }
`;

const ImageWrapper = styled.div`
  position: absolute;
  width: 40px;
  top: -20px;
  aspect-ratio: 1;
  border-radius: 40px;
  left: 0;
  border: 2px solid;
  border-color: var(--ion-color-primary);
`;

const Body = styled.div`
  background-color: var(--ion-background-color);
  border-radius: 10px;
  
`;

const IconWrapper = styled.div`
  height: 35px;
  aspect-ratio: 1;
  border-radius: 30px;
  bottom: -15px;
  right: -5px;
  border: 2px solid var(--ion-color-primary);
  background-color: var(--ion-background-color);
  padding: 1px;
  display: flex;
  align-items: center;
  > * {
    width: 100%;
  }
  `

const Content = styled.div`
    width: calc(100% - 40px);
    display:flex;
    flex-direction:column ;
`