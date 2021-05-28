import React from "react";

import RootHeader from "./components/elements/RootHeader";
import RootBody from "./components/elements/RootBody";
import RootFooter from "./components/elements/RootFooter";
import MessageBox from "./components/combo/message/MessageBox";
import ModalBox from "./components/combo/modal/ModalBox";
import Header from "./components/elements/Header";

import RoutePages from "./components/pages/route/RoutePages";

function App(): JSX.Element {
    return (
        <div className="App">
            <ModalBox />
            <MessageBox />
            <RootHeader>
                <Header />
            </RootHeader>
            <RootBody>
                <RoutePages />
            </RootBody>
            <RootFooter>2021 by Solomon</RootFooter>
        </div>
    );
}

export default App;
