import React, {Component} from 'react';
import Snackbar from 'material-ui/Snackbar';

class InfoSnackbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: "",
        };
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={2000}
                    />
            </div>
        );
    }
}

export default InfoSnackbar;