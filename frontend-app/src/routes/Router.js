import React from "react";
import { BrowserRouter as Routerr, Route, Routes } from "react-router-dom";
import Form from '../components/Form';

const Router = () => {
    return (
        <Routerr>
            {/* <Header /> */}
            <div style={{ margin: '0 20px' }}>
                <Routes>
                    <Route exact path="/react_task/" element={<Form />} />
                </Routes>
            </div>
        </Routerr>
    )
}


export default Router;