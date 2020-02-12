export function getItemLink(baseUrl, aristotleId) {
    // Util function to return the link for an aristotle item
    return baseUrl + '/item/' + aristotleId + '/';

}

export function stripHtmlTags(text) {
    let div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || div.innerText || "";
}

export function getTextUpToTag(text, tag) {
    let index = text.search(tag);

    if (index !== -1) {
        return text.substring(0, index);
    } else {
        return text;
    }
}