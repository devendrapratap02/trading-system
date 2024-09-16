// src/services/TradingSystem.mjs

import Order from '../models/Order.mjs';
import Trade from '../models/Trade.mjs';

export default class TradingSystem {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    async registerUser(user) {
        await this.dataStore.saveUser(user);
    }

    async placeOrder(userId, type, symbol, quantity, price) {
        const order = new Order(userId, type, symbol, quantity, price);
        await this.dataStore.saveOrder(order);

        const orderBook = await this.dataStore.getOrderBook(symbol);
        this._updateOrderBook(orderBook, order);
        await this.dataStore.saveOrderBook(orderBook);

        this._startMatching(symbol);

        return order;
    }

    async cancelOrder(symbol, orderId) {
        const orderBook = await this.dataStore.getOrderBook(symbol);
        this._removeOrderFromOrderBook(orderBook, orderId);
        await this.dataStore.saveOrderBook(orderBook);

        const order = await this.dataStore.getOrder(orderId);
        order.cancelOrder();
        await this.dataStore.saveOrder(order);
    }

    _updateOrderBook(orderBook, order) {
        if (order.type === 'buy') {
            orderBook.buyOrders.push(order);
            orderBook.buyOrders.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
        } else {
            orderBook.sellOrders.push(order);
            orderBook.sellOrders.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
        }
    }

    _removeOrderFromOrderBook(orderBook, orderId) {
        orderBook.buyOrders = orderBook.buyOrders.filter(order => order.orderId !== orderId);
        orderBook.sellOrders = orderBook.sellOrders.filter(order => order.orderId !== orderId);
    }

    _startMatching(symbol) {
        // Implementation for starting the order matching process
    }
}
