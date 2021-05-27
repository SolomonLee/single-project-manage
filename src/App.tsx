import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { routes, RouteWithSubRoutes } from "./route/route";

import RootHeader from "./components/elements/RootHeader";
import RootBody from "./components/elements/RootBody";
import RootFooter from "./components/elements/RootFooter";
import MessageBox from "./components/combo/message/MessageBox";
import ModalBox from "./components/combo/modal/ModalBox";
import Header from "./components/elements/Header";
import Loading from "./components/elements/Loading";

function App(): JSX.Element {
    return (
        <div className="App">
            <MessageBox />
            <ModalBox />
            <RootHeader>
                <Header />
            </RootHeader>
            <RootBody>
                <Suspense
                    fallback={<Loading loading content="loading" type="" />}
                >
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
            </RootBody>
            <RootFooter>2021 by Solomon</RootFooter>
        </div>
    );
}

export default App;
