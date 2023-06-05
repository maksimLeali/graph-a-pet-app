import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { CalendarEvents } from ".";

export const EventsRouter = () => {
    const { path } = useRouteMatch();
    console.log(path);
    return (
        <>
            <Route exact path={`${path}`} >
                <CalendarEvents />
            </Route>
        </>
    );
};
