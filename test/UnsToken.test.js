const { assert } = require("chai");

const UnsToken = artifacts.require('UnsToken');

contract('UnsToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.uns = await UnsToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.uns.mint(alice, 1000, { from: minter });
        assert.equal((await this.uns.balanceOf(alice)).toString(), '1000');
    })
});
