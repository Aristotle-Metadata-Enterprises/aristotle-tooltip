import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/translucent.css';

import axios from 'axios';

import './tooltip.css';


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

                    let itemLink = getItemLink(baseURL, aristotleId);
                    instance.setContent(makeHTMLContent(name, shortDefinition, itemLink));
                    instance._hasSuceeded = true;

                }).catch((error) => {
                    // The response failed
                    let errorMsg = handleError(error);
                    instance.setContent(errorMsg);
                    instance._hasFailed = true;
                });
                instance._isFetching = false;
            }
        });
    }
}

function getItemLink(baseUrl, aristotleId) {
    return baseUrl + '/item/' + aristotleId + '/';

}

function makeHTMLContent(name, shortDefinition, itemLink) {
    let parentDiv = document.createElement('div');
    let titleElement = document.createElement("strong");
    let fontawesomeElement = document.createElement('a');
    let seeMoreLink = document.createElement('a');

    seeMoreLink.href = itemLink;
    seeMoreLink.appendChild(document.createTextNode("...see more"));
    seeMoreLink.classList.add("see-more-link");

    titleElement.appendChild(document.createTextNode(name + ": "));

    fontawesomeElement.href = itemLink;
    fontawesomeElement.classList.add("fa", "fa-external-link-square");

    parentDiv.append(titleElement);
    parentDiv.appendChild(fontawesomeElement);
    parentDiv.appendChild(document.createTextNode(shortDefinition));
    parentDiv.appendChild(seeMoreLink);

    return parentDiv.innerHTML;

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
