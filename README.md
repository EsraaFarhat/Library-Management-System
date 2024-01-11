# Library Management System

## Objective

The Library Management System is designed and implemented to manage books and borrowers efficiently. This system provides functionality for adding, updating, deleting, and listing books, as well as registering, updating, deleting, and listing borrowers. Additionally, it supports the borrowing process, allowing borrowers to check out and return books, view their current books, and track due dates.

## Functional Requirements
### 1. Auth

- **Basic Authentication:**
    - Implement basic authentication with JWT for the API.

### 2. Books

- **Add a Book:**
  - Add a book with details such as title, author, ISBN, available quantity, and shelf location.

- **Update a Book:**
  - Modify the details of a book.

- **Delete a Book:**
  - Remove a book from the system.

- **List all Books:**
  - Retrieve a list of all books with pagination and sorting.
  
- **Get one Book:**
  - Retrieve a book.

- **Search for a Book:**
  - Search for a book by title (partially), author, or ISBN with pagination and sorting.

### 3. Borrowers

- **Register a Borrower:**
  - Register a borrower with basic details: name, email, and password.

- **Update Borrower's Details:**
  - Modify the details of a borrower.

- **Delete a Borrower:**
  - Remove a borrower from the system.

- **List all Borrowers:**
  - Retrieve a list of all registered borrowers with pagination and sorting.

- **Get one Borrower:**
  - Retrieve a borrower.

- **Search for a Borrower:**
  - Search for a borrower by name (partially), or email with pagination and sorting.

### 4. Borrowing Process

- **Check Out Books:**
  - Allow a borrower to check out books.

- **Return Books:**
  - Enable borrowers to return books.

- **View Currently Borrowed Books:**
  - Provide borrowers with a list of books they currently have with pagination and sorting.

- **Overdue Books:**
  - Keep track of due dates for books and list overdue books with pagination and sorting.

### 5. analytics
- **Analytical Reports:**
   - Generate analytical reports of the borrowing process within a specific period.
   - Export borrowing process data in Xlsx sheet format.

- **Export Overdue Borrows:**
   - Generate analytical reports of the overdue borrows of the last month.
   - Export all overdue borrows of the last month.

- **Export All Borrowing Processes:**
   - Generate analytical reports of all borrowing processes of the last month.
   - Export all borrowing processes of the last month.

## Other Features

1. **Rate Limiting:**
   - Implement rate limiting for get all books and create borrower routes to prevent abuse.

2. **Dockerization:**
   - Dockerize the application using docker-compose.

3. **Unit Tests:**
   - Add unit tests for books to ensure the functionality.

## Setup Instructions
### Prerequisites
*  Docker and Docker Compose installed on your machine.

### Steps
1. Clone the repository:
```
git clone https://github.com/EsraaFarhat/Library-Management-System
cd Library-Management-System
```
2. Build and run the containers:
```
docker-compose up
```
3. Access the API at http://localhost:3000.

## Alternative Setup using Node.js
### Prerequisites
* Node.js installed on your machine.
* PostgreSQL database running.

### Steps
1. Clone the repository:
```
git clone https://github.com/EsraaFarhat/Library-Management-System
cd Library-Management-System
```
2. Create a .env file:
   *  Copy the contents of .env.example into a new file named .env.
   *  Update the variables in the .env file according to your PostgreSQL database configuration.
3. Install dependencies:
```
npm install
```
4. Create tables for the Database:
```
npm run create-db
```
5. Start the Server:
```
npm start
```
6. Access the API at http://localhost:3000.


## Documentation

Swagger documentation can be accessed at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).

Postman collection can be accessed [here](https://api.postman.com/collections/14403585-6b6b4454-24a2-4f50-a6c9-80264ac58bf1?access_key=PMAT-01HKW1X665GXV3FKTACATQD3F5)

- **Notes:**
   - Please ensure that your server is running before testing the API in Postman or Swagger.
   - Add environment variable `url`: [http://localhost:3000](http://localhost:3000) in your postman environment
