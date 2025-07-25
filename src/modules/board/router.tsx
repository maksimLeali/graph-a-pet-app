import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { Board, NewReport } from ".";


export const BoardRouter = () => {
    const { path } = useRouteMatch();
    return (
        <>
        
            <Route exact path={`${path}`} >
                <Board />
            </Route>
            <Route exact path={`${path}/new`} >
                <NewReport />
            </Route>
        </>
    );
};
