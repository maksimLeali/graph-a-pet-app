import { Toggle } from "@components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useUserContext } from "../../../contexts/UserContext";
import { $uw } from "@theme";

export const PetsColor: React.FC = () => {
	const {useCustomColors, setUseCustomColorHandler} = useUserContext()

    const {t} = useTranslation()

	return (
		<Container>
            <h4>{t('settings.general.pets_color')}</h4>
			<Toggle value={useCustomColors} onChange={(v) => {setUseCustomColorHandler(v)}} confirmColor="primary" />
		</Container>
	);
};

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    .toggle{
        margin-top: auto;
        margin-bottom: ${$uw(1)};
    }
`;
