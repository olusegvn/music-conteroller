
import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import {Link} from 'react-router-dom';
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel";


export default class RoomJoinPage extends Component{
    defaultVotes = 2;
    constructor(props) {
        super(props);
        this.state = {
            guest_can_pause: true,
            votes_to_skip: this.defaultVotes,
        };
        this.handleRoomButtonPress = this.handleRoomButtonPress.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);

    }

    handleVotesChange(e){
        this.setState({votes_to_skip:e.target.value})
    }

    handleGuestCanPauseChange(e){
        this.setState({guest_can_pause: e.target.value === 'true'})
    }

    handleRoomButtonPress(){
        const requestOptions = {
            method: 'POST',
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip : this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause
            }),
        };
        fetch('/api/create-room', requestOptions).then((response)=> response.json()).then((data)=> this.props.history.push('/room/'+data.code));
    }

    render() {
        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} align = "center">
                        <Typography component="h4" variant="h4">
                            Create a Room
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align = "center">
                        <FormControl component = "fieldset" >
                            <FormHelperText>
                                <div >
                                    Guest control of playback state
                                </div>
                            </FormHelperText>
                            <RadioGroup row defaultValue="true" onClick = {this.handleGuestCanPauseChange}>
                                <FormControlLabel value="true" control={<Radio color="primary" />} label="play/pause" labelPlacement="bottom"/>
                                <FormControlLabel value="false" control={<Radio color="secondary" />} label="No control" labelPlacement="bottom"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} align = "center">
                        <FormControl>
                            <TextField required={true} onChange={this.handleVotesChange} type={"number"} defaultValue={this.defaultVotes} inputProps={{min: 1, style: {textAlign: "center"}}} />
                            <FormHelperText>
                                <div >
                                    Votes Required to skip song
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align = "center">
                        <Button color="secondary" onClick={this.handleRoomButtonPress} variant="contained"> Create a Room</Button>
                    </Grid>
                    <Grid item xs={12} align = "center">
                        <Button color="secondary" variant="outlined" to="/" component={Link}> Back</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
