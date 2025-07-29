import styled from "styled-components";
import { useEffect } from "react";

import { ModalContextProvider, useUserContext } from "@contexts";
import { BottomMenu } from "./components";
import { $uw } from '@theme' 
import { DebugGrid } from "@lemaks/grid_system";
import { css } from "../theme";
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
	children: nodes,
}) => {
	const { useCustomColors, gridVisible, handleGridVisibility } = useUserContext();


	return (
		<ModalContextProvider>
			<Main id="mainWrapper" className={`${!useCustomColors ? 'force-primary' : ''}`}>
				{/* @ts-ignore */}
				<DebugGrid visible={gridVisible} setVisible={handleGridVisibility}/>
				{nodes}
				<BottomMenu />
			</Main>
		</ModalContextProvider>
	);
};

const Main = styled.div`
	width: 100%;
	height: 100%;
	/* overflow-y: hidden; */
	padding-top: ${$uw(5)};
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
