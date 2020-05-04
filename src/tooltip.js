import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import axios from 'axios';

import './tooltip.css';
import {
    getItemLink,
    getTextUpToStringPattern,
    objectAttributeToggler,
    stripHtmlTags,
    truncateText,
    mergeObjects,
} from './utils.js';
import aristotleLogo from './aris_logo_small.png';
import externalLinkSvg from './external-link-alt.svg';


function makeRequest(baseUrl, aristotleId) {
    /** Make an axios request to concept API
     * @param {String} baseUrl - the Aristotle Metadata Registry to request
     * @param {Integer} aristotleId - the id of the concept to request
     */
    const url = baseUrl + '/api/v4/item/' + aristotleId + '/';
    return axios.get(url);
}

function handleError(error) {
    let errorMsg = '';
    if (error.response) {
        //  The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = error.response.status;

        if (statusCode === 401 || statusCode === 403) {
            errorMsg = ('ERROR: This item is not publicly viewable');
        } else if (statusCode >= 500 && statusCode < 600) {
            // It's a 500 failure
            errorMsg = ('ERROR: The server is currently experiencing errors. Please try again later.');
        } else {
            // Any other failure
            errorMsg = ('ERROR: The server cannot process your request. Please try again later.');
        }
    } else if (error.request) {
        // The request was made but no response was received
        errorMsg = ('ERROR: No response was received from the server. Please try again later');
    }
    return errorMsg;
}

/**
 * Get plain text version of an items html definition
 * @param htmlDefinition String html definition as returned by api
 * @return String plain text defintion
 */
function getPlainTextDefinition(htmlDefinition) {
    let definition = getTextUpToStringPattern(htmlDefinition, '<table>');
    definition = getTextUpToStringPattern(definition, '<ul>');
    definition = getTextUpToStringPattern(definition, '<ol>');
    definition = stripHtmlTags(definition);
    return definition;
}

// Get start node from selection
// where selection can be a css selector string or a html element
function getStartNode(selection) {
    const type = typeof selection;
    if (type === 'string') {
        return document.querySelector(selection);
    }
    if (type === 'object' && selection instanceof Element) {
        return selection;
    }
    console.log(`${selection} is not a valid selector`);
    return document.body;
}

function createTippyElements(options) {
    // Select all elements that contain an aristotle id
    const root = getStartNode(options.selector);
    const elements = root.querySelectorAll('[data-aristotle-concept-id]');

    // Create a Tippy object for each element that has an attached aristotle id:
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const aristotleId = element.getAttribute('data-aristotle-concept-id');
        tippy(element, {
            theme: 'light-border',
            placement: options.placement,
            trigger: options.trigger,
            allowHTML: false, // For better security
            content: 'Loading...',
            duration: [275, 1250],
            flipOnUpdate: true, // Because the tooltip changes sizes when the definition successfully loads
            interactive: options.interactive,
            onCreate: function(instance) {
                // Keep track of state
                instance._isFetching = false;
                instance._hasSucceeded = false;
            },
            onShow: function(instance) {
                if (instance._hasSucceeded && instance._see_more) {
                    // Reset back to minified when you leave
                    instance._see_more = false;
                    setHTMLContent(instance);
                }

                if (instance._isFetching || instance._hasSucceeded) {
                    return;
                }
                instance._isFetching = true;
                makeRequest(options.url, aristotleId).then(function(response) {
                    // The response was successful
                    instance.name = response.data['name'];
                    const definition = getPlainTextDefinition(response.data['definition']);
                    instance.definition = truncateText(definition, options.longDefinitionWords);
                    instance.shortDefinition = truncateText(definition, options.definitionWords);
                    instance.itemLink = getItemLink(options.url, aristotleId);
                    instance._see_more = false;
                    instance._hasSucceeded = true;
                    setHTMLContent(instance, options);
                }).catch(function(error) {
                    // The response failed
                    const errorMsg = handleError(error);
                    instance._hasSucceeded = false;
                    instance.setContent(errorMsg);
                });
                instance._isFetching = false;
            },
        });
    }
}

function setHTMLContent(instance, options) {
    // Build and set the HTML content for the tooltip
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(createTooltipHeader(instance.name, instance.itemLink, options));
    wrapperDiv.appendChild(createTooltipBody(instance, options));
    wrapperDiv.appendChild(createTooltipFooter(instance.itemLink, options));
    instance.setContent(wrapperDiv);
}

function createTooltipHeader(itemName, url, options) {
    const wrapperDiv = document.createElement('div');
    const strongTag = document.createElement('strong');
    strongTag.appendChild(document.createTextNode(itemName + ' '));
    wrapperDiv.appendChild(strongTag);
    if (options.externalLinkVisible && options.interactive) {
        const externalItemLink = createExternalItemLink(url);
        wrapperDiv.appendChild(externalItemLink);
    }
    return wrapperDiv;
}

function createTooltipBody(instance, options) {
    const wrapperDiv = document.createElement('div');
    const contentElementDiv = document.createElement('div');

    // Whether to show a see more link
    const displaySeeMore = (
        options.interactive && instance.definition.length > instance.shortDefinition.length
    );

    // Setup see more link
    const seeMoreDiv = document.createElement('div');
    if (displaySeeMore) {
        const seeMoreLessLink = document.createElement('a');
        seeMoreLessLink.classList.add('see-more-link');
        seeMoreLessLink.addEventListener('click', function(e) {
            e.preventDefault();
            _toggleAristotleTooltipContent(instance, options);
        });
        seeMoreLessLink.href = '#';
        seeMoreLessLink.appendChild(document.createTextNode('...see more'));
        seeMoreDiv.appendChild(seeMoreLessLink);
        seeMoreDiv.classList.add('see-more-link');
    }

    // If see more has been clicked
    if (instance._see_more) {
        let definitionText;

        if (instance.definition === '') {
            definitionText = 'This item does not have a definition.';
        } else {
            definitionText = instance.definition;
        }
        contentElementDiv.appendChild(document.createTextNode(definitionText));
    } else {
        contentElementDiv.appendChild(document.createTextNode(instance.shortDefinition));
    }

    // Add content
    wrapperDiv.appendChild(contentElementDiv);
    // Add see more if we are displaying it and it hasnt already been clicked
    if (displaySeeMore && !instance._see_more) {
        wrapperDiv.appendChild(seeMoreDiv);
    }

    return wrapperDiv;
}

function createTooltipFooter(url, options) {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(document.createElement('hr'));

    if (options.interactive) {
        const footerTop = createFooterTop(url, options);
        wrapperDiv.appendChild(footerTop);
    }

    const footerBottom = createFooterBottom();
    wrapperDiv.appendChild(footerBottom);
    return wrapperDiv;
}

function createFooterTop(url) {
    const wrapperDiv = document.createElement('div');
    const smallTag = document.createElement('small');
    const link = document.createElement('a');
    smallTag.appendChild(document.createTextNode('Source: '));
    link.href = url;
    link.textContent = url;
    smallTag.appendChild(link);
    wrapperDiv.appendChild(smallTag);
    return wrapperDiv;
}

function createFooterBottom() {
    const wrapperDiv = document.createElement('div');
    const smallTag = document.createElement('small');
    const aristotleLogo = createAristotleLogoHTMl();
    smallTag.appendChild(document.createTextNode('Powered by the Aristotle Metadata Registry '));
    wrapperDiv.appendChild(smallTag);
    wrapperDiv.appendChild(aristotleLogo);
    return wrapperDiv;
}

function createExternalItemLink(itemUrl) {
    const externalLink = document.createElement('a');
    const externalLinkIcon = document.createElement('span');
    const supTag = document.createElement('sup');
    externalLinkIcon.innerHTML = externalLinkSvg;
    externalLinkIcon.classList.add('external-link');
    externalLink.href = itemUrl;
    externalLink.appendChild(externalLinkIcon);
    externalLink.setAttribute('target', '_blank'); // Open item in a new tab.
    supTag.title = 'View item in a new window';
    supTag.appendChild(externalLink);
    return supTag;
}

function createAristotleLogoHTMl() {
    const img = document.createElement('img');
    img.classList.add('aristotle-logo');
    img.src = aristotleLogo;
    return img;
}


/**
 * This internal function toggles the content of an Aristotle Tooltip and calls a function to generate its HTML content.
 * @param instance Aristotle Tooltip object instance.
 * @private
 */
function _toggleAristotleTooltipContent(instance, options) {
    objectAttributeToggler(instance, '_see_more');
    setHTMLContent(instance, options);
}

/**
 * This is the main route through which users will interact with Aristotle Tooltip.
 * @param options Object containing the options available to configure the Aristotle tooltip.
 *
 *       selector - Element or css selector for element to use as root when searching for tooltip elements
 *                  Only element under this node with the data attribute will have tooltips enabled
 *                  Defaults to the document body
 *
 *       url - URL address used to fetch definitions from. If this option is omitted, it is assumed that we are
 *             referencing a concept retrieved from the current domain url.
 *
 *       definitionWords - Number of words included in the tooltip. Defaults to 50 words.
 *
 *       longDefinitionWords - Number of words included in the long definition version of the tooltip.
 *             The "See more..." option will not be visible if this option is not included.
 *
 *       placement - positioning of the tooltip. Defaults to 'bottom'.
 *
 *       trigger - Event used to trigger the tooltip. Defaults to 'mouseenter focus'.
 *
 *       externalLinkVisible - Whether or not to display the external item link page at the top of the tooltip.
 *             Defaults to 'true'.
 *
 *       interactive - Whether interactive content such as links should be displayed
 *
 */
export default function addAristotle(options) {
    const defaultOptions = {
        'selector': document.body,
        'url': 'https://registry.aristotlemetadata.com',
        'definitionWords': 50,
        'longDefinitionWords': 75,
        'placement': 'bottom',
        'trigger': 'mouseenter focus',
        'externalLinkVisible': true,
        'interactive': true,
    };

    let finalOptions;
    if (options) {
        finalOptions = mergeObjects(defaultOptions, options);
    } else {
        finalOptions = defaultOptions;
    }
    createTippyElements(finalOptions);
}
