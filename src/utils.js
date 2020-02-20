/**
 * Util function to return the link for an aristotle item.
 * @param baseUrl String
 * @param aristotleId String
 * @return {string}
 */
export function getItemLink(baseUrl, aristotleId) {
    return baseUrl + '/item/' + aristotleId + '/';
}

/**
 * The purpose of this function is to remove html tags from a string using the browser inbuilt parser system.
 * @param text: String object with html tags to be stripped.
 * @return {string} Stripped version of the string object.
 */
export function stripHtmlTags(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent.trim() || div.innerText.trim() || '';
}

/**
 * THe purpose of this function is to extract a section of a string.
 * The extracted section contains the text before a particular text pattern is found.
 * @param text
 * @param pattern String pattern used to limit the text to be returned.
 * @return {string|*} A string containing the extracted section of the string.
 */
export function getTextUpToStringPattern(text, pattern) {
    const index = text.search(pattern);

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
 * @param text String that needs to be truncated.
 * @param numberOfWords Number Required for the truncated version of the text.
 * @return {String}
 */
export function truncateText(text, numberOfWords) {
    if (text.split(' ').length > numberOfWords) {
        return text.split(' ').splice(0, numberOfWords).join(' ') + '...';
    } else {
        return text;
    }
}

/**
 * The purpose of this function is to combine two JavaScript objects into a single data structure.
 * NOTE: Repeated Keys will be overridden by Object 2 in the final output.
 * @param o1 Object 1 to be merged.
 * @param o2 Object 2 to be merged.
 * @returns {Object} Object-type data structure with combined key value pairs from both dictionaries.
 */
export function mergeObjects(o1, o2) {
    return [o1, o2].reduce(function(result, current) {
        Object.keys(current).forEach(function(key) {
            result[key] = current[key];
        });
        return result;
    }, {});
}
