class Book {
    constructor(title, author, count, price, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
        this.price = price
        this.count = count
    }
}

function checkisbn(c) {
    let books = Store.getBooks()
    let comparewise = false;


    books.forEach((book) => {
        if (book.isbn === c) {
            comparewise = true;
        }
    })

    return comparewise;
}

class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.count}</td>
        <td>${book.price}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X<a/></td>
        `;

        list.appendChild(row);
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.classList = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#price').value = '';
        document.querySelector('#count').value = '';
    }
}


class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks()

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks)

document.querySelector("#book-form").addEventListener('submit', (e) => {

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const price = document.getElementById('price').value;
    const count = document.getElementById('count').value;

    let compare = checkisbn(isbn);

    if (title === '' || author === '' || isbn === '' || price === '' || count === '') {
        UI.showAlert("Please fill in all fields", 'danger');
    } else if (compare) {
        UI.showAlert("Similar ISBNs book not added", 'danger');
    } else {
        const book = new Book(title, author, count, price, isbn);
        UI.addBookToList(book);

        Store.addBook(book);
        UI.showAlert("Book Added", 'success');
        UI.clearFields();
    }
});


document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert("Book Removed", 'info');
    UI.clearFields();
});