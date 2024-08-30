import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import useAuthFetch from "../../utils/useAuthFetch.js";
import BookDialog from "./BookDialog.js";
import DeleteDialog from "./DeleteDialog.js";
import classes from "./Inventory.module.css";

const BooksTab = () => {
  const [books, setBooks] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogBook, setDialogBook] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { requestWithAuth } = useAuthFetch();
  const { isAdmin } = useContext(AuthContext);

  const fetchBooks = async (query = "") => {
    try {
      const response = await requestWithAuth(
        `http://localhost:8000/items?query=${encodeURIComponent(query)}`,
        "GET"
      );
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books: ", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    fetchBooks(searchQuery);
  };

  const handleCreate = async (newBook) => {
    try {
      const response = await requestWithAuth(
        "http://localhost:8000/items/create",
        "POST",
        newBook
      );
      fetchBooks(); // Refresh the book list
      return response;
    } catch (error) {
      console.error("Error creating book: ", error);
    }
  };

  const handleUpdate = async (updatedBook) => {
    try {
      const response = await requestWithAuth(
        `http://localhost:8000/items/${updatedBook._id}`,
        "PATCH",
        updatedBook
      );
      fetchBooks(); // Refresh the book list
      return response;
    } catch (error) {
      console.error("Error updating book: ", error);
    }
  };

  const handleEdit = (book) => {
    setDialogBook(book);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await requestWithAuth(`http://localhost:8000/items/${id}`, "DELETE");
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.erro("Error deleting item: ", error);
    }
  };

  const openDeleteDialog = (id) => {
    setBookIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className={classes.bookListWrapper}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or author"
          className={classes.searchInput}
        />
        <button onClick={handleSearch} className={classes.searchButton}>
          Search
        </button>
        {isAdmin && (
          <button
            className={classes.createButton}
            onClick={() => {
              setDialogBook(null);
              setDialogOpen(true);
            }}
          >
            Add New Book
          </button>
        )}
      </div>
      <div className={classes.bookList}>
        {books.map((book) => (
          <div key={book._id} className={classes.bookItem}>
            <img
              src={book.cover}
              alt={book.title}
              className={classes.bookCover}
            />
            <div className={classes.bookDetails}>
              <h3 className={classes.bookTitle}>{book.title}</h3>
              <p className={classes.bookAuthor}>
                <em>{book.author}</em>
              </p>
              <br />
              <p className={classes.bookPrice}>
                Price: ${book.price.toFixed(2)}
              </p>
              <p className={classes.bookQty}>Quantity: {book.qty}</p>
            </div>
            {isAdmin && (
              <div className={classes.bookActions}>
                <button
                  className={classes.editButton}
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className={classes.deleteButton}
                  onClick={() => openDeleteDialog(book._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isDialogOpen && (
        <BookDialog
          onClose={() => setDialogOpen(false)}
          onSubmit={dialogBook ? handleUpdate : handleCreate}
          book={dialogBook}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteDialog
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDelete}
          bookId={bookIdToDelete}
        />
      )}
    </div>
  );
};

export default BooksTab;
