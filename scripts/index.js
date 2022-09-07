"use strict";
var _a;
const table = document.getElementById('table__library');
const tbodyRef = table.querySelector('tbody');
const tr = table.getElementsByTagName('tr');
const changeFormatDate = (date) => {
    if (date) {
        const splitDate = date.split('-');
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    }
    else {
        return 'unknown';
    }
};
const defaultFormatInputDate = (date) => {
    if (date && date !== 'unknown') {
        const splitDate = date.split('/');
        return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    }
    else {
        return '';
    }
};
const createNewBook = (id, title, author, pages, published, read) => {
    const book = new Book(id, title, author, pages, published, read);
    book.createBook();
};
const modal = document.getElementById('my_modal');
const spanClose = document.querySelectorAll('.close_modal');
const btnModal = document.getElementById('btn_add_book');
const modalEdit = document.getElementById('my_modal-edit');
btnModal.addEventListener('click', () => {
    modal.style.display = 'block';
});
spanClose.forEach(span => span.addEventListener('click', () => {
    console.log('click');
    modal.style.display = 'none';
    modalEdit.style.display = 'none';
}));
window.addEventListener('click', e => {
    if (e.target == modal || e.target == modalEdit) {
        modal.style.display = 'none';
        modalEdit.style.display = 'none';
    }
});
class Book {
    constructor(id, title, author, pages, published, read) {
        id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.published = published;
        this.read = read;
        this.createBook = () => {
            var newRow = tbodyRef.insertRow();
            newRow.id = id;
            var newCell = newRow.insertCell();
            newCell.innerHTML = title;
            newCell = newRow.insertCell();
            newCell.innerHTML = author;
            newCell = newRow.insertCell();
            newCell.innerHTML = pages;
            newCell = newRow.insertCell();
            newCell.innerHTML = published;
            newCell = newRow.insertCell();
            newCell.innerHTML = `<input type="checkbox" name="read" class="check_read" ${read === 'true' ? 'checked' : ''} />  `;
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
        read: 'true'
    },
    {
        id: '2',
        title: 'Lord of the Ring: The Two Towers',
        author: 'J.R.R. Tolkien',
        pages: '352',
        published: '29/07/1954',
        read: 'true'
    },
    {
        id: '3',
        title: 'Lord of the Ring: The Return of the King',
        author: 'J.R.R. Tolkien',
        pages: '416',
        published: '20/10/1955',
        read: 'false'
    }
];
const setLocalStorage = (arr) => localStorage.setItem('DUMMY_LIST', JSON.stringify(arr));
const getLocalStorage = JSON.parse(localStorage.getItem('DUMMY_LIST'));
const mapBooksList = (arr) => {
    arr.map((item) => {
        createNewBook(item.id, item.title, item.author, item.pages, item.published, item.read);
    });
};
if (getLocalStorage) {
    mapBooksList(getLocalStorage);
}
else {
    mapBooksList(DUMMY_BOOKS);
}
const form = document.querySelector('#my_form');
const submitBtn = document.querySelector('.submit_btn');
const inputTitle = document.querySelector('.input_title');
const inputAuthor = document.querySelector('.input_author');
const inputPages = document.querySelector('.input_pages');
const inputPublished = document.querySelector('.input_published');
const inputRead = document.querySelector('.input_read');
const onSubmitHandler = (e) => {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const authorValue = inputAuthor.value;
    const pagesValue = inputPages.value;
    const publishedValue = changeFormatDate(inputPublished.value);
    const readValue = inputRead.checked.toString();
    const id = Date.now().toString();
    const checkInput = titleValue.length > 0 &&
        authorValue.length > 0 &&
        pagesValue.length > 0 &&
        publishedValue.length > 0;
    const bookInput = {
        id: Date.now().toString(),
        title: titleValue,
        author: authorValue,
        pages: pagesValue,
        published: publishedValue,
        read: readValue
    };
    if (checkInput) {
        if (getLocalStorage !== null) {
            getLocalStorage.push(bookInput);
            setLocalStorage(getLocalStorage);
            createNewBook(id, titleValue, authorValue, pagesValue, publishedValue, readValue);
        }
        else {
            setLocalStorage([...DUMMY_BOOKS, bookInput]);
            createNewBook(id, titleValue, authorValue, pagesValue, publishedValue, readValue);
        }
        form.reset();
    }
    modal.style.display = 'none';
    location.reload();
};
submitBtn.addEventListener('click', onSubmitHandler);
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
    if (getLocalStorage) {
        for (let i = 0; i < getLocalStorage.length; i++) {
            getLocalStorage[i].read === 'true' && (sum += 1);
        }
        totalBooks.innerHTML = getLocalStorage.length;
        totalReadBooks.innerHTML = `${sum}`;
    }
    else {
        totalBooks.innerHTML = DUMMY_BOOKS.length.toString();
        totalReadBooks.innerHTML = '2';
    }
};
sumTotalReadBooks();
const checkboxGet = document.getElementsByClassName('check_read');
for (let i = 0; i < checkboxGet.length; i++) {
    checkboxGet[i].addEventListener('change', () => {
        const checkboxStatus = checkboxGet[i].checked;
        !checkboxStatus
            ? checkboxGet[i].removeAttribute('checked')
            : checkboxGet[i].setAttribute('checked', '');
        const id = tr[i + 1].id;
        const bookRead = getLocalStorage.filter((book) => book.id === id)[0];
        bookRead.read = checkboxStatus.toString();
        localStorage.setItem('DUMMY_LIST', JSON.stringify(getLocalStorage));
        location.reload();
    });
}
const deleteBtn = document.getElementsByClassName('btn_delete');
for (let i = 0; i < deleteBtn.length; i++) {
    (_a = deleteBtn[i]) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const id = tr[i + 1].id;
        const updatedList = getLocalStorage.filter((book) => book.id !== id);
        localStorage.setItem('DUMMY_LIST', JSON.stringify(updatedList));
        location.reload();
    });
}
const editBtn = document.getElementsByClassName('btn_edit');
const editSubmitBtn = document.querySelector('.submit_btn-edit');
const inputEditTitle = document.querySelector('.input_title-edit');
const inputEditAuthor = document.querySelector('.input_author-edit');
const inputEditPages = document.querySelector('.input_pages-edit');
const inputEditPublished = document.querySelector('.input_published-edit');
const inputEditRead = document.querySelector('.input_read-edit');
for (let i = 0; i < editBtn.length; i++) {
    editBtn[i].addEventListener('click', () => {
        modalEdit.style.display = 'block';
        const id = tr[i + 1].id;
        const bookEdit = getLocalStorage.filter((book) => book.id === id)[0];
        inputEditTitle.value = bookEdit.title;
        inputEditAuthor.value = bookEdit.author;
        inputEditPages.value = bookEdit.pages;
        inputEditPublished.value = defaultFormatInputDate(bookEdit.published);
        bookEdit.read === 'true'
            ? inputEditRead.setAttribute('checked', '')
            : inputEditRead.removeAttribute('checked');
        editSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookEdit.title = inputEditTitle.value;
            bookEdit.author = inputEditAuthor.value;
            bookEdit.pages = inputEditPages.value;
            bookEdit.published = changeFormatDate(inputEditPublished.value);
            localStorage.setItem('DUMMY_LIST', JSON.stringify(getLocalStorage));
            form.reset();
            modal.style.display = 'none';
            location.reload();
        });
    });
}
//# sourceMappingURL=index.js.map