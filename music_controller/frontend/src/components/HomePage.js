import React, {Component} from "react";
import CreateRoomPage from "./CreateRoom";
import RoomJoinPage from "./RoomJoin"
import {Grid, Button, ButtonGroup, Typography} from '@material-ui/core'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Switch, Redirect} from 'react-router';
import Room from "./Room";
export default class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null
        }
        this.clearRoomCode = this.clearRoomCode.bind(this)
    }

    async componentDidMount() {
        fetch('/api/user-in-room').then((response) => response.json())
            .then((data) => {
                this.setState({roomCode: data.code});
            });
    }

    renderHomePage(){
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align = "center" >
                    <Typography variant="h3" component = "h3">House Party</Typography>
                </Grid>
                <Grid item xs={12} align = "center" >
                    <ButtonGroup disableElevation value="contained" color="primary">
                        <Button color="primary" variant="contained" to={'/create'} component = {Link}>Create a ROom</Button>
                        <Button color="secondary" variant="contained" to={'/join'} component = {Link}>Join a ROom</Button>
                    </ButtonGroup>
                </Grid>

            </Grid>
        );

    }

    clearRoomCode(){
        this.setState({roomCode: null})
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path = "/" render={() => {
                        return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : this.renderHomePage()
                    }}/>
                    <Route exact path = "/join" component={RoomJoinPage} />
                    <Route exact path = "/room/:roomCode" render={(props) => {
                        return <Room {...props} leaveRoomCallback={this.clearRoomCode}
                    />}}/>
                    <Route exact path = "/create" component={CreateRoomPage} />
                </Switch>
            </Router>
        );
    }
}