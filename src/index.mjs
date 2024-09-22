import readline from 'readline';
import TradingSystem from './services/TradingSystem.mjs';
import InMemoryStore from './stores/InMemoryStore.mjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dataStore = new InMemoryStore();
const tradingSystem = new TradingSystem(dataStore);

function promptUser() {
    rl.question('\nEnter command (place (p), cancel (c), status (s), order-book (ob), exit (e)): ', async (command) => {
        switch (command.toLowerCase()) {
            case 'place': case 'p':
                await placeOrder();
                break;
            case 'cancel': case 'c':
                await cancelOrder();
                break;
            case 'status': case 's':
                await checkOrderStatus();
                break;
            case 'order-book': case 'ob':
                await checkOrderBook();
                break;
            case 'exit': case 'e':
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
                    symbol = symbol.toUpperCase();
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
                            resolve();
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
                await tradingSystem.cancelOrder('RELIANCE', orderId);
                console.log('Order canceled.');
            } catch (error) {
                console.error('Error canceling order:', error.message);
            }
            resolve();
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
            resolve();
        });
    });
}

async function checkOrderBook() {
    return new Promise((resolve) => {
        rl.question('Enter stock symbol: ', async (symbol) => {
            const orderBook = await dataStore.getOrderBook(symbol);
            console.log("Order Book = ", orderBook);
            resolve();
        });
    });
}

async function isValidUser(userId) {
    const user = await dataStore.getUser(userId);
    return user !== undefined;
}

console.log('Trading System CLI');
promptUser();
