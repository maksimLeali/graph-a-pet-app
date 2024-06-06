import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { $uw } from "@theme";
import { SelectInput } from "@components";
import { changeLanguageSideEffects } from "@i18n";


export const LanguageSelector = () => {

    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'it', name: 'Italiano', emoji: '🇮🇹' },
        { code: 'en', name: 'English', emoji: '🇬🇧' },
        { code: 'de', name: 'Deutsch', emoji: '🇩🇪' },
        { code: 'fr', name: 'Français', emoji: '🇫🇷' },
        { code: 'es', name: 'Español', emoji: '🇪🇸' },
        { code: 'ru', name: 'Русский', emoji: '🇷🇺' },
      ];      

    return (
	<LanguageSelectorContainer>
		<h4>{t('settings.general.select_language')}</h4>
		<SelectInput
			currentValue={i18n.language}
			onSelected={(v) => {
                localStorage.setItem('lang', v)
				i18n.changeLanguage(v)
                changeLanguageSideEffects(v)
			}}
			hideIcon
			options={languages.map((lang) => ({
				label: `${lang.emoji} ${lang.name}`,
				value: lang.code,
				render: (
					<LanguageItem>
						<span>{lang.emoji}</span> {lang.name}
					</LanguageItem>
				),
			}))}
		/>
	</LanguageSelectorContainer>
);}

const LanguageSelectorContainer = styled.div`
	display: flex;
	> * {
		&:first-child {
			flex: 0 0 ${$uw(14)};
			margin-right: ${$uw(4)};
		}
		&:last-child {
			flex: 0 0 ${$uw(12)};
			width: ${$uw(12)};
		}
	}
	.label-container,
	.focusBox,
	.inputWrapper,
	.select-input {
		border-radius: 99px;
	}
	.label-container {
		top: 1px;
        width: calc(100% - 1px);
	}
`;

const LanguageItem = styled.div`
	display: flex;
    align-items: center;
    padding: ${$uw(1)};
	span {
		margin-right: ${$uw(1)};
	}
`;
