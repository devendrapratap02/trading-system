# In-Memory Trading System

Design and implement an efficient in-memory trading system similar to a stock exchange, where registered users can place, execute, and cancel orders. The system demonstrates synchronization and concurrency in a multi-threaded environment.

## Functional Requirements:

Your system should support the following functionalities:

1. **Order Placement and Management:**
   - A registered user can place, modify, and cancel their orders.
   - A user should be able to query the status of their order.
   
2. **Trade Execution:**
   - The system should execute trades based on matching buy and sell orders.
   - A trade is executed when the buy and sell prices of two different orders match or are equal.
   - If multiple eligible orders match at the same price, the oldest orders should be matched first.
   
3. **Concurrency:**
   - Handle concurrent order placement, modification, cancellation, and execution appropriately.
   
4. **Order Book Management:**
   - The system should maintain an order book per stock symbol, which holds all current unexecuted orders.

## System Entities:

### **User Details:**
- `User ID`
- `User Name`
- `Phone Number`
- `Email ID`

### **Orders:**
- `Order ID`
- `User ID`
- `Order Type (Buy/Sell)`
- `Stock Symbol` (e.g., RELIANCE, WIPRO, etc.)
- `Quantity`
- `Price`
- `Order Accepted Timestamp`
- `Status` (ACCEPTED, REJECTED, CANCELED, etc.)

### **Trades:**
- `Trade ID`
- `Buyer Order ID`
- `Seller Order ID`
- `Stock Symbol`
- `Quantity`
- `Price`
- `Trade Timestamp`

## Additional Functionality (Optional):

- **Order Expiry:** Implement order expiry where an order is automatically canceled if not executed within a specific time.

## Expectation:

1. **Executable Code:**
   - The code should be functional and at least partially executable.

2. **Clean and Refactored Code:**
   - Ensure the code is clean, refactored, and that exceptions are handled gracefully.

3. **Full Coverage of Functional Requirements:**
   - Your code should cover all the functionality in the "Functional Requirements" section.

4. **Optional Features for Extra Credit:**
   - If time permits, implement the "Additional Functionality" section.

## Guidelines:

1. **Dummy Users:**
   - You don't need to build the user registration system. Assume some dummy users are registered and use them throughout the system.

2. **In-Memory Data Structure:**
   - Use an in-memory data structure to store data. The design should allow for other persistent stores (like databases) to be plugged in later.

## Evaluation Criteria:

- **Executable Code:** Ensure the code can be run and tested.
- **Readable and Testable Code:** Write code that is easy to read and test.
- **Separation of Concerns:** Follow the single responsibility and segregation of concerns principles.
- **Abstraction:** Use abstraction where appropriate.
- **Object-Oriented Concepts:** Follow object-oriented design principles.
- **SOLID Principles:** Ensure the code adheres to SOLID principles.
