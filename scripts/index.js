"use strict";
const table = document.getElementById('table__library');
const tbodyRef = table.querySelector('tbody');
const tr = table.getElementsByTagName('tr');
const changeFormatDate = (date) => {
    const splitDate = date.split('-');
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
};
const modal = document.getElementById('my_modal');
const spanClose = document.querySelector('.close_modal');
const btnModal = document.getElementById('btn_add_book');
btnModal.addEventListener('click', () => {
    modal.style.display = 'block';
});
spanClose.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', e => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});
class Book {
    constructor(title, author, pages, published, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.published = published;
        this.read = read;
        this.createBook = () => {
            var newRow = tbodyRef.insertRow();
            var newCell = newRow.insertCell();
            newCell.innerHTML = title;
            newCell = newRow.insertCell();
            newCell.innerHTML = author;
            newCell = newRow.insertCell();
            newCell.innerHTML = pages;
            newCell = newRow.insertCell();
            newCell.innerHTML = published;
            newCell = newRow.insertCell();
            newCell.innerHTML = `<input type="checkbox" name="read" class="read" ${read ? 'checked' : ''} />  `;
            newCell = newRow.insertCell();
            newCell.innerHTML = `<div><button class="btn_edit">🖊</button><span>/</span><button class="btn_delete">❌</button></div>`;
        };
    }
}
const DUMMY_BOOKS = [
    {
        id: '1',
        title: 'Lord of the Ring: The Fellowship of the Ring',
        author: 'J.R.R. Tolkien',
        pages: '423',
        published: '29/07/1954',
        read: true
    },
    {
        id: '2',
        title: 'Lord of the Ring: The Two Towers',
        author: 'J.R.R. Tolkien',
        pages: '352',
        published: '29/07/1954',
        read: true
    },
    {
        id: '3',
        title: 'Lord of the Ring: The Return of the King',
        author: 'J.R.R. Tolkien',
        pages: '416',
        published: '20/10/1955',
        read: false
    }
];
const setLocalStorage = (arr) => localStorage.setItem('DUMMY_LIST', JSON.stringify(arr));
const getLocalStorage = JSON.parse(localStorage.getItem('DUMMY_LIST'));
if (getLocalStorage) {
    getLocalStorage.map((item) => {
        const book = new Book(item.title, item.author, item.pages, item.published, item.read);
        book.createBook();
    });
}
else {
    setLocalStorage(DUMMY_BOOKS);
    DUMMY_BOOKS.map(item => {
        const book = new Book(item.title, item.author, item.pages, item.published, item.read);
        book.createBook();
    });
}
const form = document.querySelector('#my_form');
const submitBtn = document.querySelector('.submit_btn');
const enteredTitle = document.querySelector('.input_title');
const enteredAuthor = document.querySelector('.input_author');
const enteredPages = document.querySelector('.input_pages');
const enteredPublished = document.querySelector('.input_published');
const enteredRead = document.querySelector('.input_read');
const inputs = document.querySelectorAll('.input_title, .input_author, .input_pages, .input_published');
const onSubmitHandler = (e) => {
    e.preventDefault();
    const titleValue = enteredTitle.value;
    const authorValue = enteredAuthor.value;
    const pagesValue = enteredPages.value;
    const publishedValue = changeFormatDate(enteredPublished.value) || 'unknown';
    const readValue = enteredRead.checked;
    const checkInput = titleValue.length > 0 &&
        authorValue.length > 0 &&
        pagesValue.length > 0 &&
        publishedValue.length > 0;
    if (checkInput) {
        getLocalStorage.push({
            id: Date.now().toString(),
            title: titleValue,
            author: authorValue,
            pages: pagesValue,
            published: publishedValue,
            read: readValue
        });
        setLocalStorage(getLocalStorage);
        totalBooks.innerHTML = getLocalStorage.length;
        sumTotalReadBooks();
        const book = new Book(titleValue, authorValue, pagesValue, publishedValue, readValue);
        book.createBook();
        form.reset();
    }
};
submitBtn.addEventListener('click', onSubmitHandler);
const deleteBtn = document.getElementsByClassName('btn_delete');
const searchFunction = () => {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            }
            else {
                tr[i].style.display = 'none';
            }
        }
    }
};
const totalBooks = document.querySelector('.log__books_total');
const totalReadBooks = document.querySelector('.log__books_read');
const sumTotalReadBooks = () => {
    let sum = 0;
    for (let i = 0; i < getLocalStorage.length; i++) {
        getLocalStorage[i].read && (sum += 1);
    }
    totalBooks.innerHTML = getLocalStorage.length;
    totalReadBooks.innerHTML = `${sum}`;
};
sumTotalReadBooks();
//# sourceMappingURL=index.js.map