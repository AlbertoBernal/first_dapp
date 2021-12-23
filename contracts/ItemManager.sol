
import "./Item.sol";

contract ItemManager {
    enum SupplyChainSteps {Created, Paid, Delivered}

    struct S_Item{
        Item _item;
        SupplyChainSteps _step;
        string _identifier;
    }

    mapping (uint => S_Item) public items;

    uint index=0;

    event SupplyChainStep (uint _itemIndex, SupplyChainSteps _step, address _address);

    function createItem(string memory _identifier, uint _priceInWei) public {
        Item item = new Item(this, _priceInWei, index);
        items[index] = S_Item(
            {
                _item: item,
                _step: SupplyChainSteps.Created,
                _identifier: _identifier
            });
    
        emit SupplyChainStep(index, SupplyChainSteps.Created, address(item));
        index+=1;
    }

    function triggerPayment(uint _index) public payable {
        Item item = items[_index]._item;
        require(address(item) == msg.sender, "Only item could update itself no external agent allowed");
        require(item.priceInWei() == msg.value, "Not enough founds");
        require(items[_index]._step == SupplyChainSteps.Created, "Item already sold");

        items[index]._step = SupplyChainSteps.Paid;
        emit SupplyChainStep(index, SupplyChainSteps.Paid, address(item));
    }

    function triggerDelivery(uint _index) public {
        require(items[_index]._step == SupplyChainSteps.Paid, "Item has not been paid yet");
        items[_index]._step = SupplyChainSteps.Delivered;
        emit SupplyChainStep(index, SupplyChainSteps.Delivered, address(items[_index]._item));
    }



}