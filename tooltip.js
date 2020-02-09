import tippy from 'tippy.js';
import request from 'request.js'


let baseUrl = null;

// Select all elements that contain an aristotle id
let elements = document.querySelectorAll('[data-aristotle-id]');

// Add an tippy for each element that has an attached aristotle id
for (let element of elements) {
    let aristotleId = element.dataset.aristotleId;
    tippy(element, {
        content: 'Loading...',
        flipOnUpdate: true, // Because the tooltip changes sizes when the definition successfully loads
        onCreate(instance) {
            // Keep track of state
            instance._isFetching = false;
            instance._permanent_failure = null;
            instance._content = null;
        },
        onShow(instance) {
            if (instance._isFetching || instance._permanent_failure) {
                return;
            }
            instance._isFetching = true;

            let response = request(aristotleId, base_url)

            instance.setContent(response.content);
            instance._permanent_failure = response.permanent_failure;
            instance._isFetching = false;
        }
    });
}

