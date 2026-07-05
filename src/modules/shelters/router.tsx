import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { Shelters, ShelterDetail } from ".";

export const SheltersRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}/detail/:id`}>
				<ShelterDetail />
			</Route>
			<Route exact path={`${path}`}>
				<Shelters />
			</Route>
		</>
	);
};
