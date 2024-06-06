import React, { useEffect } from "react";
import styled from "styled-components";
import { LanguageSelector } from "../components";
import { useUserContext } from "@contexts";
import { $cssTRBL } from "../../../utils/theme/functions";

export const Generals = React.memo(() => {
	const { setPage } = useUserContext();

	useEffect(() => {
		setPage({ name: "settings" });
	}, []);

	return (
		<Container>
			<LanguageSelector />
		</Container>
	);
});

const Container = styled.div`
	padding: ${$cssTRBL(8, 1)};
`;
