import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import {
	Shelters,
	ShelterDetail,
	AddShelterPet,
	ShelterTasksList,
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
} from ".";

export const SheltersRouter = () => {
	const { path } = useRouteMatch();
	return (
		<>
			<Route exact path={`${path}/add-pet/:id`}>
				<AddShelterPet />
			</Route>
			<Route exact path={`${path}/detail/:id/tasks/new`}>
				<AddShelterTask />
			</Route>
			<Route exact path={`${path}/detail/:id/tasks`}>
				<ShelterTasksList />
			</Route>
			<Route exact path={`${path}/detail/:id/walks`}>
				<ShelterWalksList />
			</Route>
			<Route exact path={`${path}/detail/:id/inventory/new`}>
				<AddInventoryItem />
			</Route>
			<Route exact path={`${path}/detail/:id/inventory`}>
				<ShelterInventory />
			</Route>
			<Route exact path={`${path}/detail/:id/map`}>
				<ShelterMapEditor />
			</Route>
			<Route exact path={`${path}/detail/:id/boxes`}>
				<ShelterBoxes />
			</Route>
			<Route exact path={`${path}/detail/:id/animals`}>
				<ShelterAnimals />
			</Route>
			<Route exact path={`${path}/detail/:id/photos`}>
				<ShelterPhotos />
			</Route>
			<Route exact path={`${path}/detail/:id/box/:boxId`}>
				<ShelterBoxDetail />
			</Route>
			<Route exact path={`${path}/detail/:id/pet/:petId`}>
				<ShelterPetDetail />
			</Route>
			<Route exact path={`${path}/detail/:id`}>
				<ShelterDetail />
			</Route>
			<Route exact path={`${path}`}>
				<Shelters />
			</Route>
		</>
	);
};
