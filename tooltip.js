import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/themes/material.css'
import 'tippy.js/themes/translucent.css'
import axios from 'axios'

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

import './tooltip.css'
import {getItemLink, stripHtmlTags, getTextUpToTag} from './util.js'


function makeRequest(aristotleId, baseUrl) {
    let url = `${baseUrl}/api/v4/item/${aristotleId}/`;
    return axios.get(url)
}

function handleError(error) {
    let errorMsg = '';

    if (error.response) {
        //  The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let status_code = error.response.status;

        if (status_code === 401 || status_code === 403) {
            errorMsg = ("ERROR: This item is not publicly viewable")
        } else if (String(status_code).startsWith('5')) {
            // It's a 500 failure
            errorMsg = ("ERROR: The server is currently experiencing errors. Please try again later.")
        } else {
            // Any other failure
            errorMsg = ("ERROR: The server cannot process your request. Please try again later.")
        }
    } else if (error.request) {
        // The request was made but no response was received
        errorMsg = ("ERROR: No response was received from the server. Please try again later")
    }
    return errorMsg
}

function createTippyElements(baseURL, theme, longDefinitionLength) {
    // Select all elements that contain an aristotle id
    let elements = document.querySelectorAll('[data-aristotle-id]');

    // Create a Tippy object for each element that has an attached aristotle id:
    for (let element of elements) {
        let aristotleId = element.dataset.aristotleId;
        tippy(element, {
            content: 'Loading...',
            flipOnUpdate: true, // Because the tooltip changes sizes when the definition successfully loads
            interactive: true,
            trigger: "click",
            theme: theme,
            onCreate(instance) {
                // Keep track of state
                instance._isFetching = false;
                instance._hasFailed = null;
                instance._hasSuceeded = null;
            },
            onShow(instance) {
                if (instance._isFetching || instance._hasFailed || instance._hasSuceeded) {
                    return
                }
                instance._isFetching = true;

                makeRequest(aristotleId, baseURL).then((response) => {
                    // The response was successful

                    let definition = response.data['definition'];
                    instance.name = response.data['name'];
                    definition = getTextUpToTag(definition, "<table>");
                    definition = getTextUpToTag(definition, "<ul>");
                    definition = getTextUpToTag(definition, "<ol>");
                    definition = stripHtmlTags(definition);
                    instance.definition = truncateText(definition, longDefinitionLength);
                    instance.shortDefinition = response.data['short_definition'];
                    instance.itemLink = getItemLink(baseURL, aristotleId);
                    instance._see_more = false;

                    setHTMLContent(instance);
                    instance._hasSuceeded = true

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

function setHTMLContent(instance) {
    // Build and set the HTML content for the tooltip

    let parentDiv = document.createElement('div');
    let titleElement = document.createElement("strong");
    let fontawesomeElement = document.createElement('a');
    let titleElementDiv = document.createElement('div');
    let contentElementDiv = document.createElement('div');
    let seeMoreLessLink = document.createElement('a');
    let seeMoreDiv = document.createElement('div');
    let hr = document.createElement('hr');
    let footerTopDiv = document.createElement('div');
    let footerBottomDiv = document.createElement('div');
    let smallTagTop = document.createElement('small');
    let sourceLink = document.createElement('a');
    sourceLink.href = instance.itemLink;
    sourceLink.textContent = instance.itemLink;
    let smallTagBottom = document.createElement('small');
    let img = document.createElement("img");
    img.classList.add('aristotle-logo');
    img.src = 'aris_logo_small.png';
    smallTagTop.appendChild(document.createTextNode("Source: "));
    smallTagTop.appendChild(sourceLink);
    smallTagBottom.appendChild(document.createTextNode("Powered by the Aristotle Metadata Registry "));
    footerTopDiv.appendChild(smallTagTop);
    footerBottomDiv.appendChild(smallTagBottom);
    footerBottomDiv.appendChild(img);
    footerBottomDiv.classList.add('tooltip-footer');

    seeMoreLessLink.href = "#";
    if (instance._see_more) {
        seeMoreLessLink.appendChild(document.createTextNode("...see less"))
    } else {
        seeMoreLessLink.appendChild(document.createTextNode("...see more"))
    }

    seeMoreLessLink.classList.add("see-more-link");
    titleElement.appendChild(document.createTextNode(instance.name));

    seeMoreLessLink.addEventListener("click", changeContent.bind(event, instance));

    titleElementDiv.appendChild(titleElement);

    fontawesomeElement.href = instance.itemLink;
    fontawesomeElement.classList.add("fas", "fa-external-link-alt");

    parentDiv.append(titleElementDiv);
    parentDiv.appendChild(fontawesomeElement);

    if (instance._see_more) {
        contentElementDiv.appendChild(document.createTextNode(instance.definition))
    } else {
        contentElementDiv.appendChild(document.createTextNode(instance.shortDefinition))
    }

    parentDiv.appendChild(contentElementDiv);
    seeMoreDiv.appendChild(seeMoreLessLink);
    seeMoreDiv.classList.add("see-more-link");

    if (instance.definition.length !== instance.shortDefinition.length) {
        parentDiv.appendChild(seeMoreDiv)
    }

    hr.classList.add('hr-class');
    parentDiv.appendChild(document.createElement('hr'));
    parentDiv.appendChild(footerTopDiv);
    parentDiv.appendChild(footerBottomDiv);

    instance.setContent(parentDiv)
}

function changeContent(instance) {
    instance._see_more = !instance._see_more;
    setHTMLContent(instance)
}

function truncateText(text, numberOfWords) {
    return text.split(" ").splice(0,numberOfWords).join(" ");
}

export function addAristotle(options) {
    // This the main route through which users will interact with Aristotle Tooltip.
    let theme = Object.is(options.theme, undefined) ? 'light-border': options.theme;
    let longDefinitionLength = Object.is(options.longDefinitionLength, undefined) ? 75: options.longDefinitionLength;
    let url = Object.is(options.url, undefined) ? 'registry.aristotlemetadata.com': options.url

    createTippyElements(url, theme, longDefinitionLength);

}
