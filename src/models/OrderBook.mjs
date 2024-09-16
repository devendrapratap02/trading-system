class OrderBook {
    constructor(symbol) {
        this.symbol = symbol;
        this.buyOrders = [];  // Buy orders sorted by price desc, timestamp asc
        this.sellOrders = [];  // Sell orders sorted by price asc, timestamp asc
    }

    placeOrder(order) {
        if (order.type === 'buy') {
            this.buyOrders.push(order);
            this.buyOrders.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
        } else {
            this.sellOrders.push(order);
            this.sellOrders.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
        }
    }

    removeOrder(orderId) {
        this.buyOrders = this.buyOrders.filter(order => order.orderId !== orderId);
        this.sellOrders = this.sellOrders.filter(order => order.orderId !== orderId);
    }

    matchOrders() {
        while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
            const bestBuy = this.buyOrders[0];
            const bestSell = this.sellOrders[0];

            if (bestBuy.price >= bestSell.price) {
                const quantityToTrade = Math.min(bestBuy.quantity, bestSell.quantity);
                const tradePrice = bestSell.price;

                bestBuy.quantity -= quantityToTrade;
                bestSell.quantity -= quantityToTrade;

                // Remove completed orders
                if (bestBuy.quantity === 0) this.buyOrders.shift();
                if (bestSell.quantity === 0) this.sellOrders.shift();

                return { buyOrder: bestBuy, sellOrder: bestSell, quantity: quantityToTrade, price: tradePrice };
            } else {
                break;
            }
        }
        return null;
    }
}

export default OrderBook;
