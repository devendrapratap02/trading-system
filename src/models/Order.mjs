import { nanoid } from 'nanoid'

class Order {
    constructor(userId, type, symbol, quantity, price) {
        this.orderId = nanoid(6);
        this.userId = userId;
        this.type = type;  // 'buy' or 'sell'
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.status = 'ACCEPTED';
        this.timestamp = new Date();
    }

    modifyOrder(quantity, price) {
        this.quantity = quantity;
        this.price = price;
        this.timestamp = new Date();  // Update timestamp on modification
    }

    cancelOrder() {
        this.status = 'CANCELED';
    }
}

export default Order;
