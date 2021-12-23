var ItemManager = artifacts.require("./ItemManager.sol");
//var Item = artifacts.require("./Item.sol");
module.exports = function(deployer) {
  deployer.deploy(ItemManager);
  //deployer.deploy(Item); Item lo despliega ItemManager
};
