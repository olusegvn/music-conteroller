import React, {Component} from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom"

export default class CreateRoomPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }

    handleTextFieldChange(e){
        this.setState({roomCode: e.target.value});
    }

    render() {
        return (
            <Grid container spacing={1} alignItems="center">
                < Grid item xs={12} align = "center">
                    <Typography variant="h4" component = "h4">Join a Room</Typography>
                </Grid>
                < Grid item xs={12} align = "center">
                    <TextField error={this.state.error} label="code" onchange={this.handleTextFieldChange} placeholder="Enter a Room code" value={this.state.roomCode}
                               helperText={this.state.error} variant="outlined" />
                </Grid>
                < Grid item xs={12} align = "center">
                    <Button color="secondary" variant="contained" onClick={this.handleTextFieldChange}>Enter Room</Button>
                </Grid>
                < Grid item xs={12} align = "center">
                    <Button color="secondary" variant="contained" to="/" component = {Link}>Back to Home</Button>
                </Grid>


            </ Grid >
        );
    }
}
