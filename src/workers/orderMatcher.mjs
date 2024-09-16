import { workerData, parentPort } from 'worker_threads';
import OrderBook from './OrderBook';

// Simulate the matching process
const orderBook = new OrderBook(workerData.symbol);

setInterval(() => {
    const matched = orderBook.matchOrders();
    if (matched) {
        parentPort.postMessage(matched);
    }
}, 1000);
