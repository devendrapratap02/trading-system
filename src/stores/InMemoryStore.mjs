import DataStore from '../services/DataStore.mjs';
import fs from 'fs';
import path from 'path';
import User from '../models/User.mjs';
import Order from '../models/Order.mjs';
import OrderBook from '../models/OrderBook.mjs';
import Trade from '../models/Trade.mjs';

export default class InMemoryStore extends DataStore {
    constructor() {
        super();
        this.users = new Map();
        this.orders = new Map();
        this.orderBooks = new Map();
        this.trades = [];
        this.loadInitialData();
    }

    loadInitialData() {
        try {
            const dataFile = path.resolve('src/stores/data.json');
            const rawData = fs.readFileSync(dataFile, 'utf-8');
            const data = JSON.parse(rawData);

            // Load users
            for (const userData of data.users) {
                const user = new User(userData.id, userData.name, userData.phoneNumber, userData.email);
                this.users.set(user.id, user);
            }

            // Load orders
            for (const orderData of data.orders) {
                const order = new Order(orderData.userId, orderData.type, orderData.symbol, orderData.quantity, orderData.price);
                order.orderId = orderData.orderId;
                order.status = orderData.status;
                order.timestamp = new Date(orderData.timestamp);
                this.orders.set(order.orderId, order);
            }

            // Load order books
            for (const [symbol, orderBookData] of Object.entries(data.orderBooks)) {
                const orderBook = new OrderBook(symbol);
                for (const orderData of orderBookData.buyOrders) {
                    const order = new Order(orderData.userId, orderData.type, orderData.symbol, orderData.quantity, orderData.price);
                    order.orderId = orderData.orderId;
                    order.status = orderData.status;
                    order.timestamp = new Date(orderData.timestamp);
                    orderBook.buyOrders.push(order);
                }
                for (const orderData of orderBookData.sellOrders) {
                    const order = new Order(orderData.userId, orderData.type, orderData.symbol, orderData.quantity, orderData.price);
                    order.orderId = orderData.orderId;
                    order.status = orderData.status;
                    order.timestamp = new Date(orderData.timestamp);
                    orderBook.sellOrders.push(order);
                }
                this.orderBooks.set(symbol, orderBook);
            }

            // Load trades
            for (const tradeData of data.trades) {
                const trade = new Trade(tradeData.buyOrderId, tradeData.sellOrderId, tradeData.symbol, tradeData.quantity, tradeData.price);
                trade.tradeId = tradeData.tradeId;
                trade.timestamp = new Date(tradeData.timestamp);
                this.trades.push(trade);
            }
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }

    async getUser(id) {
        return this.users.get(id);
    }

    async saveUser(user) {
        this.users.set(user.id, user);
    }

    async getOrder(orderId) {
        return this.orders.get(orderId);
    }

    async saveOrder(order) {
        this.orders.set(order.orderId, order);
    }

    async getOrderBook(symbol) {
        return this.orderBooks.get(symbol) || { buyOrders: [], sellOrders: [] };
    }

    async saveOrderBook(orderBook) {
        this.orderBooks.set(orderBook.symbol, orderBook);
    }

    async updateOrderBook(order, buyOrders, sellOrders) {
        await this.saveOrderBook(order, { buyOrders, sellOrders });
    }

    async getAllSymbols() {
        return Array.from(this.orderBooks.keys());
    }

    async getTrades() {
        return this.trades;
    }

    async saveTrade(trade) {
        this.trades.push(trade);
    }
}
