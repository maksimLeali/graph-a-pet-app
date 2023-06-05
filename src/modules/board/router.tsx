import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Board } from ".";

export const BoardRouter = () => {
    const { path } = useRouteMatch();
    console.log(path);
    return (
        <>
            <Route exact path={`${path}`} >
                <Board />
            </Route>
        </>
    );
};
