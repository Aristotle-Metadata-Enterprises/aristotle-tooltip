import chai from 'chai'
const assert = chai.assert;

import {getItemLink} from "/src/utils.js"

describe('getItemLink', function () {

    it('Returns a item link when attrs defined', function () {
        let baseUrl = 'https://aristotlemetadata.com/';
        let aristotleId = 123123;

        let result = getItemLink(baseUrl, aristotleId);
        assert.equal('https://aristotlemetadata.com/item/123123', result);
    });
});