const { idText } = require("typescript")

describe('It should load a config', () => {

    it('should load config', () => {
        const test = require('../profile/web-app')
        expect(test.overrides).toBeDefined()
    })
})