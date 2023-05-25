"use strict";
var _a;
const table = document.getElementById('table__library');
const tbodyRef = table.querySelector('tbody');
const tr = table.getElementsByTagName('tr');
const totalBooks = document.querySelector('.log__books_total');
const totalReadBooks = document.querySelector('.log__books_read');
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
const createNewBook = (id, title, author, pages, published, isRead) => {
    const book = new Book(id, title, author, pages, published, isRead);
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
    constructor(id, title, author, pages, published, isRead) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.published = published;
        this.isRead = isRead;
    }
    createBook() {
        var newRow = tbodyRef.insertRow();
        newRow.id = this.id;
        var newCell = newRow.insertCell();
        newCell.innerHTML = this.title;
        newCell = newRow.insertCell();
        newCell.innerHTML = this.author;
        newCell = newRow.insertCell();
        newCell.innerHTML = this.pages;
        newCell = newRow.insertCell();
        newCell.innerHTML = this.published;
        newCell = newRow.insertCell();
        newCell.innerHTML = `<input type="checkbox" name="read" class="check_read" ${this.isRead === 'true' ? 'checked' : ''} />  `;
        newCell = newRow.insertCell();
        newCell.innerHTML = `<div><button class="btn_edit">🖊</button><span>/</span><button class="btn_delete">❌</button></div>`;
    }
}
const DUMMY_BOOKS = [
    {
        id: '1',
        title: 'Lord of the Ring: The Fellowship of the Ring',
        author: 'J.R.R. Tolkien',
        pages: '423',
        published: '29/07/1954',
        isRead: 'true'
    },
    {
        id: '2',
        title: 'Lord of the Ring: The Two Towers',
        author: 'J.R.R. Tolkien',
        pages: '352',
        published: '29/07/1954',
        isRead: 'true'
    },
    {
        id: '3',
        title: 'Lord of the Ring: The Return of the King',
        author: 'J.R.R. Tolkien',
        pages: '416',
        published: '20/10/1955',
        isRead: 'false'
    }
];
const setLocalStorage = (arr) => localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(arr));
const getLocalStorage = JSON.parse(localStorage.getItem('DUMMY_LIST_BOOKS'));
const mapBooksList = (arr) => {
    arr.map((item) => {
        createNewBook(item.id, item.title, item.author, item.pages, item.published, item.isRead);
    });
};
if (getLocalStorage) {
    mapBooksList(getLocalStorage);
    sumTotalReadBooks(getLocalStorage);
}
else {
    setLocalStorage(DUMMY_BOOKS);
    mapBooksList(DUMMY_BOOKS);
    sumTotalReadBooks(DUMMY_BOOKS);
    location.reload();
}
const form = document.querySelector('#my_form');
const submitBtn = document.querySelector('.submit_btn');
const inputTitle = document.querySelector('.input_title');
const inputAuthor = document.querySelector('.input_author');
const inputPages = document.querySelector('.input_pages');
const inputPublished = document.querySelector('.input_published');
const inputRead = document.querySelector('.input_isRead');
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
        isRead: readValue
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
        modal.style.display = 'none';
        location.reload();
    }
};
submitBtn.addEventListener('click', onSubmitHandler);
const searchFunction = () => {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toUpperCase();
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
function sumTotalReadBooks(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        arr[i].isRead === 'true' && (sum += 1);
    }
    totalBooks.innerHTML = `${arr.length}`;
    totalReadBooks.innerHTML = `${sum}`;
}
const checkboxGet = document.querySelectorAll('.check_read');
checkboxGet.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
        const checkboxStatus = checkboxGet[index].checked;
        !checkboxStatus
            ? checkboxGet[index].removeAttribute('checked')
            : checkboxGet[index].setAttribute('checked', '');
        const id = tr[index + 1].id;
        const bookRead = getLocalStorage.filter((book) => book.id === id)[0];
        bookRead.isRead = checkboxStatus.toString();
        localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(getLocalStorage));
        totalReadBooks.innerHTML = `${checkboxStatus ? +totalReadBooks.innerHTML + 1 : +totalReadBooks.innerHTML - 1} `;
    });
});
const deleteBtn = document.getElementsByClassName('btn_delete');
for (let i = 0; i < deleteBtn.length; i++) {
    (_a = deleteBtn[i]) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const id = tr[i + 1].id;
        const updatedList = getLocalStorage.filter((book) => book.id !== id);
        localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(updatedList));
        location.reload();
    });
}
const editBtn = document.getElementsByClassName('btn_edit');
const editSubmitBtn = document.querySelector('.submit_btn-edit');
const inputEditTitle = document.querySelector('.input_title-edit');
const inputEditAuthor = document.querySelector('.input_author-edit');
const inputEditPages = document.querySelector('.input_pages-edit');
const inputEditPublished = document.querySelector('.input_published-edit');
const inputEditRead = document.querySelector('.input_isRead-edit');
for (let i = 0; i < editBtn.length; i++) {
    editBtn[i].addEventListener('click', () => {
        modalEdit.style.display = 'block';
        const id = tr[i + 1].id;
        console.log(getLocalStorage);
        const bookEdit = getLocalStorage.filter((book) => book.id === id)[0];
        inputEditTitle.value = bookEdit.title;
        inputEditAuthor.value = bookEdit.author;
        inputEditPages.value = bookEdit.pages;
        inputEditPublished.value = defaultFormatInputDate(bookEdit.published);
        bookEdit.isRead === 'true'
            ? inputEditRead.setAttribute('checked', '')
            : inputEditRead.removeAttribute('checked');
        console.log(inputEditRead);
        editSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookEdit.title = inputEditTitle.value;
            bookEdit.author = inputEditAuthor.value;
            bookEdit.pages = inputEditPages.value;
            bookEdit.published = changeFormatDate(inputEditPublished.value);
            bookEdit.isRead = inputEditRead.checkValidity;
            const checkInput = bookEdit.title.length > 0 &&
                bookEdit.author.length > 0 &&
                bookEdit.pages.length > 0 &&
                bookEdit.published.length > 0;
            if (!checkInput)
                return;
            localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(getLocalStorage));
            form.reset();
            modal.style.display = 'none';
            location.reload();
        });
    });
}
//# sourceMappingURL=index.js.map