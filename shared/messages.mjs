const MESSAGES = {
  BAD_REQUEST_ERROR: "Bad request",
  CONFLICT_ERROR: "Conflict",
  FORBIDDEN_ERROR: "Forbidden",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND_ERROR: "Not found",
  RESPONSE_OK: "Success",
  UNAUTHORIZED_ERROR: "Unauthorized",
  UNPROCESSABLE_ENTITY_ERROR: "Unprocessable entity",

  INVALID_ID: "Invalid id",

  ISBN_UNIQUE: "ISBN already exists",
  BOOK_ADDED_SUCCESSFULLY: "Book added successfully",
  BOOK_EDITED_SUCCESSFULLY: "Book updated successfully",
  BOOK_DELETED_SUCCESSFULLY: "Book deleted successfully",
  BOOK_NOT_FOUND: "Book not found",
  INVALID_BOOK_ID: "Invalid book id",

  EMAIL_UNIQUE: "Email already exists",
  BORROWER_ADDED_SUCCESSFULLY: "Borrower added successfully",
  BORROWER_EDITED_SUCCESSFULLY: "Borrower updated successfully",
  BORROWER_DELETED_SUCCESSFULLY: "Borrower deleted successfully",
  BORROWER_NOT_FOUND: "Borrower not found",
  INVALID_BORROWER_ID: "Invalid borrower id",

  BOOKS_BORROWED_SUCCESSFULLY: "Books borrowed successfully",
  BOOK_NOT_AVAILABLE: "Book not available",
  BOOKS_RETURNED_SUCCESSFULLY: "Books returned successfully",

  BOOK_ALREADY_RETURNED: "Book already returned before",

  BORROWING_NOT_FOUND: "Borrowing not found",
  BORROWING_DUE_DATE_VALIDATION: "Due date should be in the future",

  DATES_VALIDATION: "Start date should be earlier than end date",
  MONTH_VALIDATION: "Month should be between 1 and 12",
};

export default MESSAGES;
