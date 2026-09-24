const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        users.push({
            username: username,
            password: password
        });

        return res.status(200).json({
            message: "User successfully registered. Now you can login"
        });
    }

    return res.status(400).json({
        message: "Username and password are required"
    });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Books not found"));
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const result = await new Promise((resolve, reject) => {
            const book = books[isbn];

            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = await new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(
                book => book.author.toLowerCase() === author
            );

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("Books by author not found"));
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: "Books by this author not found"
        });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const result = await new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(
                book => book.title.toLowerCase() === title
            );

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("Book by title not found"));
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: "Book with this title not found"
        });
    }
});


// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


module.exports.general = public_users;
