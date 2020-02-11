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

function addHtmlComponents(content, definition, aristotleId) {

    // Remove these when Dylan is finished with the request:
    content = {}
    content.name = "MY TESTING TITLE"
    content.definition = "My Testing Definition."

    let div = document.createElement('div');
    let div2 = document.createElement('div')
    let strongElement = document.createElement("strong");
    let titleTextNode = document.createTextNode(content.name)
    let definitionTextNode = document.createTextNode(content.definition)
    let fontawesomeElement = document.createElement('a')
    let br = document.createElement('br')
    let br2 = document.createElement('br')
    let a = document.createElement('a')
    let seeMoreTextNode = document.createTextNode("...see more")
    a.href = "http://localhost:8000/item/" + aristotleId + "/"
    a.appendChild(seeMoreTextNode)

    strongElement.appendChild(titleTextNode)

    fontawesomeElement.href = "http://localhost:8000/item/" + "1" + "/"
    fontawesomeElement.classList.add("fa", "fa-external-link-square")

    div2.style.cssText = "display : flex; justify-content : flex-end;";
    div2.appendChild(a)

    div.appendChild(strongElement)
    div.appendChild(fontawesomeElement)
    div.appendChild(br)
    div.appendChild(definitionTextNode)
    div.appendChild(br2)
    div.appendChild(div2)
    return div.innerHTML
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
