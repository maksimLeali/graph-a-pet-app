import { Route } from "@router-components";
import { useRouteMatch } from "react-router-dom";
import { CalendarEvents, EventDetails } from ".";

export const EventsRouter = () => {
    const { path } = useRouteMatch();
    return (
        <>
        
            <Route exact path={`${path}`} >
                <CalendarEvents />
            </Route>
            
            <Route exact path={`${path}/:id`} >
                <EventDetails />
            </Route>
        </>
    );
};
