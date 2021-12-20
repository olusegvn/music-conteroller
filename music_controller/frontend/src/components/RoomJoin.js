import React, {Component} from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom"

export default class RoomJoinPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this)
    }

    handleTextFieldChange(e){
        this.setState({roomCode: e.target.value});
    }

    handleSubmitButtonClick(e){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type" :"application/json"},
            body: JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/join-room', requestOptions).then((response) => {
            if (response.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            }else{
                return response.json();
            }
        }).then((response) => {
            this.setState({error: response.error});
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <Grid container spacing={1} alignItems="center">
                < Grid item xs={12} align = "center">
                    <Typography variant="h4" component = "h4">Join a Room</Typography>
                </Grid>
                < Grid item xs={12} align = "center">
                    <TextField error={this.state.error} label="code" onChange={this.handleTextFieldChange} placeholder="Enter a Room code" value={this.state.roomCode}
                               helperText={this.state.error} variant="outlined" />
                </Grid>
                < Grid item xs={12} align = "center">
                    <Button color="secondary" variant="contained" onClick={this.handleSubmitButtonClick} >Enter Room</Button>
                </Grid>
                < Grid item xs={12} align = "center">
                    <Button color="secondary" variant="outlined" to="/" component = {Link}>Back to Home</Button>
                </Grid>
            </ Grid >
        );
    }
}


