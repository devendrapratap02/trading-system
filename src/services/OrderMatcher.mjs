import { nanoid } from 'nanoid'

export default class OrderMatcher {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    async matchOrders(symbol) {
        const orderBook = await this.dataStore.getOrderBook(symbol);

        const buyOrders = orderBook.buyOrders.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
        const sellOrders = orderBook.sellOrders.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);

        let trades = [];
        
        while (buyOrders.length > 0 && sellOrders.length > 0) {
            const buyOrder = buyOrders[0];
            const sellOrder = sellOrders[0];

            if (buyOrder.price >= sellOrder.price) {
                const quantityToTrade = Math.min(buyOrder.quantity, sellOrder.quantity);
                const trade = this.executeTrade(buyOrder, sellOrder, quantityToTrade);

                trades.push(trade);

                buyOrder.quantity -= quantityToTrade;
                sellOrder.quantity -= quantityToTrade;

                if (buyOrder.quantity === 0) {
                    buyOrders.shift();
                }
                if (sellOrder.quantity === 0) {
                    sellOrders.shift();
                }
            } else {
                break;
            }
        }

        this.dataStore.updateOrderBook(symbol, buyOrders, sellOrders);

        return trades;
    }

    executeTrade(buyOrder, sellOrder, quantity) {
        const trade = {
            tradeId: nanoid(6),
            buyerOrderId: buyOrder.orderId,
            sellerOrderId: sellOrder.orderId,
            symbol: buyOrder.symbol,
            quantity,
            price: sellOrder.price,
            timestamp: new Date(),
        };

        this.dataStore.saveTrade(trade);

        buyOrder.status = 'EXECUTED';
        sellOrder.status = 'EXECUTED';

        return trade;
    }
}
