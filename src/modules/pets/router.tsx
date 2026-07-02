import { Redirect, Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { AddPetRoutes, PetsList, PetProfile, Sharing } from ".";

export const PetsRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route path={`${path}/sharing/:code`}>
				<Sharing />
			</Route>

			<Route exact path={`${path}/detail/:id`}>
				<PetProfile />
			</Route>

      <Route exact path={`${path}`}>
				<PetsList />
			</Route>
			<AddPetRoutes path={`${path}/new`} />
			
      <Route exact path={`${path}/sharing`} strict>
				
        <Redirect to={`${path}`} />
			</Route>
		</>
	);
};
