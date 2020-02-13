/**
 * Util function to return the link for an aristotle item.
 * @param baseUrl String
 * @param aristotleId String
 * @returns {string}
 */
export function getItemLink(baseUrl, aristotleId) {
    return baseUrl + '/item/' + aristotleId + '/';
}

/**
 * The purpose of this function is to remove html tags from a string using the browser inbuilt parser system.
 * @param text: String object with html tags to be stripped.
 * @returns {string} Stripped version of the string object.
 */
export function stripHtmlTags(text) {
    let div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || div.innerText || "";
}

/**
 * THe purpose of this function is to extract a section of a string.
 * The extracted section contains the text before a particular text pattern is found.
 * @param text
 * @param pattern String pattern used to limit the text to be returned.
 * @returns {string|*} A string containing the extracted section of the string.
 */
export function getTextUpToStringPattern(text, pattern) {

    let index = text.search(pattern);

    if (index !== -1) {
        return text.substring(0, index);
    } else {
        return text;
    }
}

/**
 * The purpose of this function is to toggle a boolean attribute of an object.
 * @param instance Object containing the boolean attribute.
 * @param attribute String representation of the object's attribute to be toggled.
 */
export function objectAttributeToggler(instance, attribute) {
    instance[attribute] = !instance[attribute];
}

/**
 * Util function to get a truncated version of a String.
 * @param text
 * @param numberOfWords
 * @returns {*}
 */
export function truncateText(text, numberOfWords) {
    return text.split(" ").splice(0, numberOfWords).join(" ");
}