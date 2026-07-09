import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { RequireShelterMember } from "./components";
import {
	Shelters,
	ShelterDetail,
	AddShelterPet,
	ShelterTasksList,
	ShelterPeople,
	AddShelterTask,
	ShelterWalksList,
	ShelterInventory,
	AddInventoryItem,
	ShelterMapEditor,
	ShelterBoxes,
	ShelterAnimals,
	ShelterBoxDetail,
	ShelterPetDetail,
	ShelterPhotos,
	ShelterOwnership,
	ShelterVerification,
	ShelterInvites,
	ShelterDiscover,
	ShelterPublic,
	ShelterPublicProfile,
} from ".";

export const SheltersRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}/discover`}>
				<ShelterDiscover />
			</Route>
			<Route exact path={`${path}/public/:id`}>
				<ShelterPublic />
			</Route>
			<Route exact path={`${path}/add-pet/:id`}>
				<RequireShelterMember>
					<AddShelterPet />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/tasks/new`}>
				<RequireShelterMember>
					<AddShelterTask />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/tasks/:taskId/edit`}>
				<RequireShelterMember>
					<AddShelterTask />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/tasks`}>
				<RequireShelterMember>
					<ShelterTasksList />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/people`}>
				<RequireShelterMember>
					<ShelterPeople />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/invites`}>
				<RequireShelterMember>
					<ShelterInvites />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/ownership`}>
				<RequireShelterMember>
					<ShelterOwnership />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/verification`}>
				<RequireShelterMember>
					<ShelterVerification />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/public-profile`}>
				<RequireShelterMember>
					<ShelterPublicProfile />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/walks`}>
				<RequireShelterMember>
					<ShelterWalksList />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/inventory/new`}>
				<RequireShelterMember>
					<AddInventoryItem />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/inventory/:itemId/edit`}>
				<RequireShelterMember>
					<AddInventoryItem />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/inventory`}>
				<RequireShelterMember>
					<ShelterInventory />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/map`}>
				<RequireShelterMember>
					<ShelterMapEditor />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/boxes`}>
				<RequireShelterMember>
					<ShelterBoxes />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/animals`}>
				<RequireShelterMember>
					<ShelterAnimals />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/photos`}>
				<RequireShelterMember>
					<ShelterPhotos />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/box/:boxId`}>
				<RequireShelterMember>
					<ShelterBoxDetail />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id/pet/:petId`}>
				<RequireShelterMember>
					<ShelterPetDetail />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}/detail/:id`}>
				<RequireShelterMember>
					<ShelterDetail />
				</RequireShelterMember>
			</Route>
			<Route exact path={`${path}`}>
				<Shelters />
			</Route>
		</>
	);
};
