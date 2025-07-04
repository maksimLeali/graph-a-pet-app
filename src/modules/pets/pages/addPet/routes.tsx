import { Route } from "@router-components";
import { IntroPage, Step1, Step2, Step3 } from ".";
import React from "react";

type props = {
	path: string;
};
export const AddPetRoutes: React.FC<props> = React.memo(({ path }) => {
	return (
		<>
		
			<Route exact path={`${path}`}>
				<IntroPage />
			</Route>
			
			<Route path={`${path}/step1`}>
				<Step1 />
			</Route>
			
			<Route path={`${path}/step2`}>
				<Step2 />
			</Route>
			
			<Route path={`${path}/step3`}>
				<Step3 />
			</Route>
		</>
	);
});
