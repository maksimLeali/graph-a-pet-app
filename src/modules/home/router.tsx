import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Home, SharingPet } from ".";

export const HomeRouter = () => {
    const { path } = useRouteMatch();
    console.log(path);
    return (
        <>
            <Route exact path={`${path}`} strict>
                <Home />
            </Route>
            <Route path={`${path}/sharing/:id`} >
                <SharingPet />
            </Route>
            <Route exact path={`${path}/sharing`} strict>
                <Redirect to={`${path}`} />
            </Route>
        </>
    );
};
