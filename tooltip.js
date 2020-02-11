import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/translucent.css';

import axios from 'axios';

function makeRequest(aristotleId, baseUrl) {
    let url = `${baseUrl}/api/v4/item/${aristotleId}/`;
    let item = {};

    axios.get(url)
        .then((response) => {
            item.name = response.data['name']
            item.shortDefinition = response.data['short_definition']
            this.failure = false;

        }).catch((error) => {
        if (error.response) {
            //  The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            let status_code = error.response.status;
            this.failure = true;

            if (status_code === 401 || status_code === 403) {
                item.shortDefinition("ERROR: This item is not publicly viewable");
                item._permanent_failure = true;
            } else if (String(status_code).startsWith('5')) {
                // It's a 500 failure
                item.shortDefinition("ERROR: The server is currently experiencing errors. Please try again later.");
            } else {
                // Any other failure
                item.shortDefinition("ERROR: The server cannot process your request. Please try again later.");
            }
        } else if (error.request) {
            // The request was made but no response was received
            item.shortDefinition("ERROR: No response was received from the server. Please try again later");
        }
    });
    return item;
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
                if (instance._isFetching || instance._hasFailed  || instance._hasSuceeded) {
                    return;
                }
                instance._isFetching = true;
                let content = makeRequest(aristotleId, baseURL);
                instance._isFetching = false

                if (content.failure === true) {
                    instance.setContent(content.shortDefinition);
                    instance._hasFailed = true;
                }
                else { // The request was a success

                    let htmlContent = addHtmlComponents(content, aristotleId)

                    instance.setContent(htmlContent)
                    instance._hasSuceeded = true;

                }
            }
        });
    }
}

function addHtmlComponents(content, definition, aristotleId) {

    // Remove these when Dylan is finished with the request:
    content = {}
    content.name = "MY TESTING TITLE"
    content.definition = "My Testing Definition. My Testing Definition. My Testing Definition."

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
    let footerDiv = document.createElement('div')
    let footerMessage = document.createTextNode("Powered by the Aristotle Metadata Registry")
    let smallTag = document.createElement('small')
    smallTag.appendChild(footerMessage)
    footerDiv.style.cssText = "background-color : #D0D1D5; display : flex; justify-content : center;";

    footerDiv.appendChild(smallTag)
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
    div.appendChild(footerDiv)

    return div.innerHTML
}

document.addEventListener('click',function(e) {
    if(e.target && e.target.id == 'my-test') {
        let instance = e.target.parentElement.parentElement.parentElement.parentElement._tippy
        instance.setContent("Hello world")
        //do something
    }
});

createTippyElements('https://registry.aristotlemetadata.com');
