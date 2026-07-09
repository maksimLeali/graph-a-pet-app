import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { Notifications } from ".";

export const NotificationsRouter = () => {
	const { path } = useRouteMatch();

	return (
		<>
			<Route exact path={`${path}`}>
				<Notifications />
			</Route>
		</>
	);
};
