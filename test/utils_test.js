import chai from 'chai'
const assert = chai.assert;

import {getItemLink, stripHtmlTags} from "../src/utils.js"

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
});