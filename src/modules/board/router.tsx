import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Board } from ".";

export const BoardRouter = () => {
    const { path } = useRouteMatch();
    return (
        <>
            <Route exact path={`${path}`} >
                <Board />
            </Route>
        </>
    );
};
