import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Generals, Profile } from ".";

export const SettingsRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route path={`${path}/profile`}>
				<Profile />
			</Route>
			<Route path={`${path}`}>
				<Generals />
			</Route>
		</>
	);
};
