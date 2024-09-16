import { nanoid } from 'nanoid'

class Trade {
    constructor(buyOrderId, sellOrderId, symbol, quantity, price) {
        this.tradeId = nanoid(6);
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.timestamp = new Date();
    }
}

export default Trade;
