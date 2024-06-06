import { SelectInput } from "@components";
import { $uw } from "@theme";
import React from "react";
import styled from "styled-components";

const languages = [
	{ code: "it", name: "Italian", emoji: "🇮🇹" },
	{ code: "en", name: "English", emoji: "🇬🇧" },
	{ code: "de", name: "German", emoji: "🇩🇪" },
	{ code: "fr", name: "French", emoji: "🇫🇷" },
	{ code: "es", name: "Spanish", emoji: "🇪🇸" },
	{ code: "ru", name: "Russian", emoji: "🇷🇺" },
];

export const LanguageSelector = () => (
	<LanguageSelectorContainer>
		<h4>Select Language</h4>
		<SelectInput
			currentValue={"it"}
			onSelected={(v) => {
				console.log(v);
			}}
			options={languages.map((lang) => ({
				label: `${lang.emoji} ${lang.name}`,
				value: lang.code,
			}))}
		/>
	</LanguageSelectorContainer>
);

const LanguageSelectorContainer = styled.div`
	margin-bottom: ${$uw(2)};
	display: flex;
	> * {
		&:first-child {
			flex: 0 0 ${$uw(18)};
			margin-right: ${$uw(2)};
		}
		&:last-child {
			flex: 0 0 ${$uw(10)};
			width: ${$uw(10)};
		}
	}
`;
