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
import {Collapse} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


export default class CreateRoomPage extends Component {
    static defaultProps = {
        votes_to_skip: 2,
        guest_can_pause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            guest_can_pause: this.props.guest_can_pause,
            votes_to_skip: this.props.votes_to_skip,
            errorMsg: "",
            successMsg: "",
        };
        this.handleRoomButtonPress = this.handleRoomButtonPress.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e) {
        this.setState({votes_to_skip: e.target.value})
    }

    handleGuestCanPauseChange(e) {
        this.setState({guest_can_pause: e.target.value === 'true'})
    }

    handleRoomButtonPress() {
        const requestOptions = {
            method: 'POST',
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause
            }),
        };
        fetch('/api/create-room', requestOptions).then((response) => response.json()).then((data) => this.props.history.push('/room/' + data.code));
    }

    handleUpdateButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg: "Room updated successfully!",
                });
            } else {
                this.setState({
                    errorMsg: "Error updating room...",
                });
            }
            this.props.updateCallback();
        });
    }


    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" onClick={this.handleRoomButtonPress} variant="contained"> Create
                        Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="outlined" to="/" component={Link}> Back</Button>
                </Grid>
            </Grid>
        )
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="secondary" onClick={this.handleUpdateButtonPressed} variant="contained"> Update
                    Room</Button>
            </Grid>
        );
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create a Room";

        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Collapse in={this.state.errorMsg !== "" || this.state.successMsg !== ""}>
                            {this.state.successMsg !== "" ?
                                (<Alert severity={"success"} onClose={() => {
                                    this.setState({successMsg: ""})
                                }}>{this.state.successMsg}</Alert>) :
                                (<Alert severity={"error"} onClose={() => {
                                    this.setState({errorMsg: ""})
                                }}>{this.state.errorMsg}</Alert>)}
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h4">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl component="fieldset">
                            <FormHelperText>
                                <div>
                                    Guest control of playback state
                                </div>
                            </FormHelperText>
                            <RadioGroup row defaultValue={this.props.guest_can_pause.toString()}
                                        onClick={this.handleGuestCanPauseChange}>
                                <FormControlLabel value="true" control={<Radio color="primary"/>} label="play/pause"
                                                  labelPlacement="bottom"/>
                                <FormControlLabel value="false" control={<Radio color="secondary"/>} label="No control"
                                                  labelPlacement="bottom"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} align="center">
                        <FormControl>
                            <TextField required={true} onChange={this.handleVotesChange} type={"number"}
                                       defaultValue={this.state.votes_to_skip}
                                       inputProps={{min: 1, style: {textAlign: "center"}}}/>
                            <FormHelperText>
                                <div>
                                    Votes Required to skip song
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
                </Grid>
            </div>
        );
    }
}
