import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { Calendar } from ".";

export const EventsRouter = () => {
    const { path } = useRouteMatch();
    console.log(path);
    return (
        <>
            <Route exact path={`${path}`} >
                <Calendar />
            </Route>
        </>
    );
};
