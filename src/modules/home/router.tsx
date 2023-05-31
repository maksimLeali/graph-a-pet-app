import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Home} from ".";

export const HomeRouter = () => {
    const { path } = useRouteMatch();
    console.log(path);
    return (
        <>
            <Route exact path={`${path}`} >
                <Home />
            </Route>
            <Route exact path={`${path}/sharing`} >
                <Redirect to={`${path}`} />
            </Route>
        </>
    );
};
