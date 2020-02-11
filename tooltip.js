import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/translucent.css';

import axios from 'axios';

function makeRequest(aristotleId, baseUrl) {
    let url = `${baseUrl}/api/v4/item/${aristotleId}/`;
    return axios.get(url);
}

function handleError(error) {
    let errorMsg = '';

    if (error.response) {
        //  The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let status_code = error.response.status;

        if (status_code === 401 || status_code === 403) {
            errorMsg = ("ERROR: This item is not publicly viewable");
        } else if (String(status_code).startsWith('5')) {
            // It's a 500 failure
            errorMsg = ("ERROR: The server is currently experiencing errors. Please try again later.");
        } else {
            // Any other failure
            errorMsg = ("ERROR: The server cannot process your request. Please try again later.");
        }
    } else if (error.request) {
        // The request was made but no response was received
        errorMsg = ("ERROR: No response was received from the server. Please try again later");
    }
    return errorMsg;
}

function createTippyElements(baseURL) {
    // Select all elements that contain an aristotle id
    let elements = document.querySelectorAll('[data-aristotle-id]');

    // Create a Tippy object for each element that has an attached aristotle id:
    for (let element of elements) {
        let aristotleId = element.dataset.aristotleId;
        tippy(element, {
            content: 'Loading...',
            flipOnUpdate: true, // Because the tooltip changes sizes when the definition successfully loads
            interactive: true,
            theme: 'light-border',
            onCreate(instance) {
                // Keep track of state
                instance._isFetching = false;
                instance._hasFailed = null;
                instance._hasSuceeded = null;
            },
            onShow(instance) {
                if (instance._isFetching || instance._hasFailed || instance._hasSuceeded) {
                    return;
                }
                instance._isFetching = true;

                makeRequest(aristotleId, baseURL).then((response) => {
                    // The response was successful
                    let name = response.data['name'];
                    let shortDefinition = response.data['short_definition'];
                    let requestFailed = false;

                }).catch((error) => {
                    // The response failed
                    let requestFailed = true;
                    let errorMsg = handleError(error);

                });
                instance._isFetching = false;
            }
        });
    }
}

function addHtmlComponents(itemName, definition, aristotleId) {
    // let strongElement = document.createElement("strong");
    // strongElement.innerHTML = tippyInstance.name
    // let fontawesomeElement = document.createElement('a')
    // fontawesomeElement.href = "http://localhost:8000/item/" + tippyInstance.aristotleId + "/"
    // fontawesomeElement.classList.add("fa", "fa-external-link-square")
    // let br = document.createElement('br')

    let myItemName = "<strong>" + itemName + "</strong>"
    let title = myItemName + " <a href='http://localhost:8000/item/" + aristotleId + "/' title='Open reference in a new window' target='_blank' class='fa fa-external-link-square'></a><br>"  // TODO: CHANGE THIS LATER
    return title.concat(definition.concat("<br><div style='display: flex; justify-content: flex-end'><a id='my-test' href=#>...see more</a></div>"))
}

// Event listener to
document.addEventListener('click', function (e) {
    if (e.target && e.target.id == 'my-test') {
        let instance = e.target.parentElement.parentElement.parentElement.parentElement._tippy
        instance.setContent("Hello world")
        //do something
    }
});

createTippyElements('https://registry.aristotlemetadata.com');
