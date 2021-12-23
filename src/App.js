import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";
//import { networks } from "../truffle-config";

class App extends Component {
  state = { cost: 0,  itemName: "", loaded:false };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address,
      );
      
      this.listenToPaymentEvent();
      this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ storageValue: response });
  };

  handleSubmit = async () => {
    const {cost, itemName} = this.state;
    console.log("Item Name => " + itemName + "\n" + "Cost [Wei] => " + cost);
    let result = await this.itemManager.methods.createItem(itemName,cost).send(
      {from: this.accounts[0]}
      );
      
    console.log("El Resultado es =>" +  result);
    alert("Send " + cost + "[Wei] to " + result.events.SupplyChainStep.returnValues._address);
  }

  handleImputChange = async (event) => {
    const target = event.target;
    const value = event.type == 'checkbox'? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  listenToPaymentEvent = async () => {
    let self =this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt){
      if(evt.returnValues._step == 1){
        let item = 
          await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
        console.log(item);
        alert ("Item " + item._identifier + " was paid, now is going to be delivered");
      }
      console.log(evt);
      
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Simple Payment/Supply chain example</h1>
        <h2>Items</h2>

        <h2>Add Element</h2>
        Cost: <input type="text" name="cost" value={this.state.cost} onChange={this.handleImputChange}/>
        Name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleImputChange}/>
        <button type="button" onClick={this.handleSubmit}>Create New Item</button>
      </div>
    );
  }
}

export default App;
