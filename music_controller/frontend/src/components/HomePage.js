import React, {Component} from "react";
import CreateRoomPage from "./CreateRoom";
import RoomJoinPage from "./RoomJoin"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
export default class HomePage extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path = "/" element={<p>This is my Home page</p>} />
                    <Route exact path = "/join" element={<RoomJoinPage/>} />
                    <Route exact path = "/create" element={<CreateRoomPage/>} />
                </Routes>
            </Router>
        );
    }
}