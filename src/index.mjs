// src/cli.mjs

import readline from 'readline';
import TradingSystem from './services/TradingSystem.mjs';
import InMemoryStore from './stores/InMemoryStore.mjs';
import User from './models/User.mjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dataStore = new InMemoryStore();
const tradingSystem = new TradingSystem(dataStore);

// Preload some users
const user1 = new User('user1', 'Alice', '123-456-7890', 'alice@example.com');
const user2 = new User('user2', 'Bob', '987-654-3210', 'bob@example.com');
await tradingSystem.registerUser(user1);
await tradingSystem.registerUser(user2);

function promptUser() {
    rl.question('\nEnter command (place, cancel, status, exit): ', async (command) => {
        switch (command.toLowerCase()) {
            case 'place':
                await placeOrder();
                break;
            case 'cancel':
                await cancelOrder();
                break;
            case 'status':
                await checkOrderStatus();
                break;
            case 'exit':
                rl.close();
                return;
            default:
                console.log('Invalid command.');
                break;
        }
        promptUser(); // Wait for new command
    });
}

async function placeOrder() {
    return new Promise((resolve) => {
        rl.question('Enter user ID: ', async (userId) => {
            if (!await isValidUser(userId)) {
                console.log('Invalid user ID.');
                return resolve();
            }

            rl.question('Enter order type (buy/sell): ', async (type) => {
                if (!['buy', 'sell'].includes(type.toLowerCase())) {
                    console.log('Invalid order type.');
                    return resolve();
                }

                rl.question('Enter stock symbol: ', async (symbol) => {
                    if (!await isValidSymbol(symbol)) {
                        console.log('Invalid stock symbol.');
                        return resolve();
                    }

                    rl.question('Enter quantity: ', async (quantity) => {
                        if (isNaN(quantity) || quantity <= 0) {
                            console.log('Invalid quantity.');
                            return resolve();
                        }

                        rl.question('Enter price: ', async (price) => {
                            if (isNaN(price) || price <= 0) {
                                console.log('Invalid price.');
                                return resolve();
                            }

                            try {
                                const order = await tradingSystem.placeOrder(userId, type, symbol, parseInt(quantity), parseFloat(price));
                                console.log('Order placed:', order);
                            } catch (error) {
                                console.error('Error placing order:', error.message);
                            }
                            resolve(); // Resolve promise to continue
                        });
                    });
                });
            });
        });
    });
}

async function cancelOrder() {
    return new Promise((resolve) => {
        rl.question('Enter order ID to cancel: ', async (orderId) => {
            if (!await dataStore.getOrder(orderId)) {
                console.log('Invalid order ID.');
                return resolve();
            }

            try {
                await tradingSystem.cancelOrder('RELIANCE', orderId); // Assuming symbol is required and known
                console.log('Order canceled.');
            } catch (error) {
                console.error('Error canceling order:', error.message);
            }
            resolve(); // Resolve promise to continue
        });
    });
}

async function checkOrderStatus() {
    return new Promise((resolve) => {
        rl.question('Enter order ID to check status: ', async (orderId) => {
            const order = await dataStore.getOrder(orderId);
            if (!order) {
                console.log('Order not found.');
            } else {
                console.log('Order status:', order);
            }
            resolve(); // Resolve promise to continue
        });
    });
}

// Validation Helpers
async function isValidUser(userId) {
    const user = await dataStore.getUser(userId);
    return user !== undefined;
}

async function isValidSymbol(symbol) {
    const orderBook = await dataStore.getOrderBook(symbol);
    return orderBook.buyOrders.length > 0 || orderBook.sellOrders.length > 0;
}

console.log('Trading System CLI');
promptUser();
