import { Route, Switch } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { Board, NewReport, ReportDetails } from ".";


export const BoardRouter = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
        
            <Route exact path={`${path}`} >
                <Board />
            </Route>
            <Route exact path={`${path}/new`} >
                <NewReport />
            </Route>
            <Route exact path={`${path}/:id`} >
                <ReportDetails />
            </Route>
        </Switch>
    );
};
