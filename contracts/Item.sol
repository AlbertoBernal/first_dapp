
import "./ItemManager.sol";

contract Item {
    uint  public priceInWei;
    uint public paidWei;
    uint public index;

    ItemManager parentContract;

    constructor (ItemManager _parentContract, uint _priceInWei, uint _index){
        priceInWei = _priceInWei;
        paidWei = 0;
        index = _index;
        parentContract = _parentContract;
    }


    fallback() external {}

    
    receive() external payable {
        require(msg.value == priceInWei, "Not eoigh founds");
        require(paidWei == 0, "Item sold out");

        paidWei += msg.value;
        (bool success, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment", index));
        
        require(success, "Delivery did not work");
    }
    
}