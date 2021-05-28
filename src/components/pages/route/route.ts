import React, { lazy } from "react";

export interface RouteType {
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
        component: lazy(() => import("../PageHome")),
        routes: null,
    },
    {
        path: "/",
        component: lazy(() => import("../PageHome")),
        routes: null,
    },
];
