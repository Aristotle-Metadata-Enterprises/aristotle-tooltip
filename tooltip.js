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

        }).catch((error) => {
        if (error.response) {
            //  The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            let status_code = error.response.status;

            if (status_code === 401 || status_code === 403) {
                item.shortDefinition("ERROR: This item is not publicly viewable");
                item._permanent_failure = true;
            } else if (String(status_code).startsWith('5')) {
                // It's a 500 failure
                item.shortDefinition("ERROR: The server is currently experiencing errors. Please try again later.");
                item._permanent_failure = false;
            } else {
                // Any other failure
                item.shortDefinition("ERROR: The server cannot process your request. Please try again later.");
                item._permanent_failure = false;
            }
        } else if (error.request) {
            // The request was made but no response was received
            item.shortDefinition("ERROR: No response was received from the server. Please try again later");
            item._permanent_failure = false;
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
                instance._permanent_failure = null;
            },
            onShow(instance) {
                if (instance._isFetching || instance._permanent_failure) {
                    return;
                }
                instance._isFetching = true;
                let content = makeRequest(aristotleId, baseURL);
                instance._isFetching = false

                if (content._permanent_failure === true) {
                    instance.setContent(content.shortDefinition);
                    instance._permanent_failure = true;
                }
                else { // The request was a success
                    // TODO: francisco -- call html generation code here

                }
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
document.addEventListener('click',function(e) {
    if(e.target && e.target.id == 'my-test') {
        let instance = e.target.parentElement.parentElement.parentElement.parentElement._tippy
        instance.setContent("Hello world")
        //do something
    }
});

createTippyElements('https://registry.aristotlemetadata.com');
