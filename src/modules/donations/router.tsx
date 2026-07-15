import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { DonationPendingPage } from "./pages/DonationPendingPage";

export const DonationsRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}/pending`}>
				<DonationPendingPage />
			</Route>
		</>
	);
};
