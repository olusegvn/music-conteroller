import React, {Component} from "react";
import CreateRoomPage from "./CreateRoom";
import RoomJoinPage from "./RoomJoin"
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Switch} from 'react-router';
import Room from "./Room";
export default class HomePage extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path = "/" element={<p>This is my Home page</p>} />
                    <Route exact path = "/join" component={RoomJoinPage} />
                    <Route exact path = "/room/:roomCode" component={Room}/>
                    <Route exact path = "/create" component={CreateRoomPage} />
                </Switch>
            </Router>
        );
    }
}