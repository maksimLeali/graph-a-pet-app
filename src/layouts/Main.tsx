import styled from "styled-components";
import { ModalContextProvider } from "../contexts";
import { BottomMenu, DebugGrid } from "./components";
import { useCallback, useEffect, useState } from "react";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
	children: nodes,
}) => {
	return (
		<ModalContextProvider>
			<Main id="mainWrapper">
				<DebugGrid/>
				{nodes}
				<BottomMenu />
			</Main>
		</ModalContextProvider>
	);
};

const Main = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	padding-top: 64px;
	max-width: var(--max-width);
	margin-left: auto;
	margin-right: auto;
	position: relative;
	scroll-behavior: smooth;
	padding-bottom: 80px;
	&::-webkit-scrollbar {
		display: none; /* for Chrome, Safari, and Opera */
	}
`;
