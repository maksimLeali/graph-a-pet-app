import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { Shelters } from ".";

export const SheltersRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}`}>
				<Shelters />
			</Route>
		</>
	);
};
