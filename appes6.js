class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById("book-list");

        // Create tr element
        const row = document.createElement("tr");
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(row);
    }

    showAlert(message, className) {
        // Create div
        const div = document.createElement("div");
        // Add class
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector(".container");
        // Get Form
        const form = document.querySelector("#book-form");
        // Insert alert
        container.insertBefore(div, form);

        // Timeout after 3 seconds
        setTimeout(function() {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    deleteBook(target) {
        // Instantiate UI
        const ui = new UI();

        if(target.className === "delete") {
            target.parentElement.parentElement.remove();
            ui.showAlert("Book removed", "success");
        } 
    }

    clearFields() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }
}

// Local Storage class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event Listener for add
document.getElementById("book-form").addEventListener("submit", function(e){
    const title = document.getElementById("title").value,
          author = document.getElementById("author").value,
          isbn = document.getElementById("isbn").value

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if (title === "" || author === "" || isbn === "") {
        // Show error
        ui.showAlert("Please fill in all fields.", "error");
    } else {
        // Add book to list
        ui.addBookToList(book);

        // Add to local store
        Store.addBook(book);

        // Show success
        ui.showAlert("Book added!", "success");

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener for delete
document.getElementById("book-list").addEventListener("click", function(e) {
    // Instantiate UI
    const ui = new UI();
    // Remove book
    ui.deleteBook(e.target);

    // Remove from local storage
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(isbn);
    

    e.preventDefault();
})