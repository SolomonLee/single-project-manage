import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { routes, RouteType } from "./route";
import Loading from "../../elements/Loading";

const RouteWithSubRoutes = (route: RouteType): JSX.Element => {
    const { path } = route;

    return (
        <Route
            path={path}
            render={(props) => (
                <route.component {...props} routes={route.routes} />
            )}
        />
    );
};

export const RoutePages = (): JSX.Element => (
    <Router>
        <Suspense fallback={<Loading loading content="loading" type="" />}>
            <Switch>
                {routes.map((route) => (
                    <RouteWithSubRoutes
                        key={route.path}
                        path={route.path}
                        routes={route.routes}
                        component={route.component}
                    />
                ))}
            </Switch>
        </Suspense>
    </Router>
);

export default RoutePages;
