import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Sharing } from ".";

export const PetsRouter = () => {
    const { path } = useRouteMatch();
    return (
        <>
            <Route path={`${path}/sharing/:code`} >
                <Sharing />
            </Route>
            <Route exact path={`${path}/sharing`} strict>
                <Redirect to={`${path}`} />
            </Route>
        </>
    );
};
