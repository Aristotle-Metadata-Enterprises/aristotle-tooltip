import chai from 'chai'

const assert = chai.assert;

import {getItemLink, stripHtmlTags, truncateText} from "../src/utils.js"

describe('getItemLink', function () {

    it('should return a item link when attrs defined', function () {
        let baseUrl = 'https://registry.aristotlemetadata.com';
        let aristotleId = 123123;

        let result = getItemLink(baseUrl, aristotleId);
        assert.equal('https://registry.aristotlemetadata.com/item/123123/', result);
    });
});

describe('stripHtmlTags', function () {
    it('should strip simple html tags', function () {
        let htmlString = '<p>This is a very interesting paragraph</p>';
        let strippedHtml = stripHtmlTags(htmlString);

        assert.equal('This is a very interesting paragraph', strippedHtml);
    });

    it('should return stripped html before a table', function () {
        let complexHtmlString = '<p>This is a very interesting paragraph <table><td><th></th></td></table></p>';
        let strippedHtml = stripHtmlTags(complexHtmlString);

        assert.equal('This is a very interesting paragraph', strippedHtml);
    })
});

describe('truncateText', function () {
    it('should return unmodified string if string shorter than desired words', function () {
        let shortString = 'This is a short string';
        let truncatedString = truncateText(shortString, 200);

        assert.equal(shortString, truncatedString);
    });
    it('should return truncated string with dots if string longer than desired words', function () {
        let longString = 'This is a very long string';
        let truncatedString = truncateText(longString, 2);

        assert.equal('This is...', truncatedString);
    });
});