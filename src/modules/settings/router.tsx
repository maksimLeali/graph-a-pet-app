import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Generals, Profile } from ".";

export const SettingsRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}`}>
				<Generals />
			</Route>
			<Route exact path={`${path}/profile`}>
				<Profile />
			</Route>
		</>
	);
};
