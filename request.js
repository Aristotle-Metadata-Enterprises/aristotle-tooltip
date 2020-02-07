import axios from 'axios';

export default function request(aristotle_id, base_url) {
    let url = `${base_url}/api/v4/item/${aristotle_id}`;
    axios.get(url)
        .then((response) => {
            this.content = response.data['short_definition'];
            this.permanent_failure = false;
        }).catch((error) => {
            if (error.response) {
                //  The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let status_code = error.response.status;

                if (status_code === 401 || status_code === 403) {
                    this.content = 'This item is not publicly viewable';
                    this.permanent_failure = true;
                } else if (String(status_code).startsWith('5')) {
                    // It's a 500 failure
                    this.content = 'The server is currently experiencing errors. Please try again later.';
                    this.permanent_failure = false;
                } else {
                    // Any other failure
                    this.content = 'The server cannot process your request. Please try again later.';
                    this.permanent_failure = false;
                }
            } else if (error.request) {
                // The request was made but no response was received
                this.content = 'No response was received from the server. Please try again later';
                this.permanent_failure = false;
            } else {
                // The request could not be made.
                this.content = "The request could not be sent. Please refresh the page and try again";
                this.permanent_failure = false;
            }
        });
    return this;
}