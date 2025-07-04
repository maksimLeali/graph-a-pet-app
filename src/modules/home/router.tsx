import { Route } from "@router-components";
import {  useRouteMatch } from "react-router-dom";
import { Home} from ".";

export const HomeRouter = () => {
    const { path } = useRouteMatch();
    
    return (
        <>
            <Route exact path={`${path}`} >
                <Home />
            </Route>
        </>
    );
};
