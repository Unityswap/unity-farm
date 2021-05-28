const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const UnsToken = artifacts.require('UnsToken');
const UnityPlatinum = artifacts.require('UnityPlatinum');

contract('UnityPlatinum', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.uns = await UnsToken.new({ from: minter });
    this.unity = await UnityPlatinum.new(this.uns.address, { from: minter });
  });

  it('mint', async () => {
    await this.unity.mint(alice, 1000, { from: minter });
    assert.equal((await this.unity.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.unity.mint(alice, 1000, { from: minter });
    await this.unity.mint(bob, 1000, { from: minter });
    assert.equal((await this.unity.totalSupply()).toString(), '2000');
    await this.unity.burn(alice, 200, { from: minter });

    assert.equal((await this.unity.balanceOf(alice)).toString(), '800');
    assert.equal((await this.unity.totalSupply()).toString(), '1800');
  });

  it('safeUnsTransfer', async () => {
    assert.equal(
      (await this.uns.balanceOf(this.unity.address)).toString(),
      '0'
    );
    await this.uns.mint(this.unity.address, 1000, { from: minter });
    await this.unity.safeUnsTransfer(bob, 200, { from: minter });
    assert.equal((await this.uns.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.uns.balanceOf(this.unity.address)).toString(),
      '800'
    );
    await this.unity.safeUnsTransfer(bob, 2000, { from: minter });
    assert.equal((await this.uns.balanceOf(bob)).toString(), '1000');
  });
});
