/* eslint-disable react/jsx-props-no-spreading */
import React, { lazy } from "react";

import { Route } from "react-router-dom";

interface RouteType {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    routes:
        | {
              path: string;
              component: React.LazyExoticComponent<() => JSX.Element>;
          }[]
        | null;
}

export const routes: RouteType[] = [
    {
        path: "/Home",
        component: lazy(() => import("../components/pages/PageHome")),
        routes: null,
    },
    {
        path: "/",
        component: lazy(() => import("../components/pages/PageHome")),
        routes: null,
    },
];

export const RouteWithSubRoutes = (route: RouteType): JSX.Element => {
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

export default routes;
