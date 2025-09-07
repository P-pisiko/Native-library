const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const mongoURI = "mongodb://localhost:27017/bookstore";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
});

const Book = mongoose.model('Book', bookSchema);
const authorSchema = new mongoose.Schema({
    authorName: String,
    bio: String,
    authorId: { type: String, unique: true }
});
const Author = mongoose.model('Author', authorSchema);

const orderSchema = new mongoose.Schema({
    customerId: String,
    quantity: Number
});
const Order = mongoose.model('Order', orderSchema);

const app = express();
const port=3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let books=[];
let authors=[];
let orders=[];

//Get all books
app.get('/books', (req, res) => {
    Book.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/books/getnumber', (req,res) => {
    Book.countDocuments()
        .then(NumberOfBooks => {
            res.status(200).json({ key: NumberOfBooks });
        })
        .catch(err =>{
            console.log(err);
        })
})


//add a new book
app.post('/books', (req, res) => {
    const input = req.body;
    const book = new Book(input);
    book.save()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

//update a book by using the bookID(_id)

app.put('/books/:title', (req, res) => {
    const input = req.body;
    const key = { _id: input._id };
    const updateFields = input;

    Book.updateOne(key, { $set: updateFields })
        .then(result => {
            res.send( result );
        })
        .catch(err => {
            console.log(err);
        });
});

//Delete a book by title
app.delete('/books/:Title', (req, res) => {
    const input = req.params.Title;
    Book.deleteOne({title: input})
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(port,()=>
{
    console.log(`Server is running on port ${port}`);
});




