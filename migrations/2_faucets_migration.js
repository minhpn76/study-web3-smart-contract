const Faucets = artifacts.require("Faucets");

module.exports = function (deployer) {
  deployer.deploy(Faucets);
};