const table = document.getElementById('table__library')!;
const tbodyRef = table.querySelector('tbody');
const tr = table.getElementsByTagName('tr');
const totalBooks = document.querySelector('.log__books_total')!;
const totalReadBooks = document.querySelector('.log__books_read')!;

// ------ lib ------ //

const changeFormatDate = (date: string) => {
  if (date) {
    const splitDate = date.split('-');
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
  } else {
    return 'unknown';
  }
};

const defaultFormatInputDate = (date: string) => {
  if (date && date !== 'unknown') {
    const splitDate = date.split('/');
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
  } else {
    return '';
  }
};

const createNewBook = (
  id: string,
  title: string,
  author: string,
  pages: string,
  published: string,
  isRead: string
) => {
  const book = new Book(id, title, author, pages, published, isRead);
  book.createBook();
};

// ------ TYPES ------ //

type BookType = {
  id: string;
  title: string;
  author: string;
  pages: string;
  published: string;
  isRead: string;
};

// ------ MODAL ------ //
const modal = document.getElementById('my_modal')!;
const spanClose = document.querySelectorAll('.close_modal')!;
const btnModal = document.getElementById('btn_add_book')!;
const modalEdit = document.getElementById('my_modal-edit')!;

btnModal.addEventListener('click', () => {
  modal.style.display = 'block';
});

spanClose.forEach(span =>
  span.addEventListener('click', () => {
    modal.style.display = 'none';
    modalEdit.style.display = 'none';
  })
);

window.addEventListener('click', e => {
  if (e.target == modal || e.target == modalEdit) {
    modal.style.display = 'none';
    modalEdit.style.display = 'none';
  }
});

// ------ ADD BOOK ------ //
//? Book object
class Book {
  constructor(
    private id: string,
    private title: string,
    private author: string,
    private pages: string,
    private published: string,
    private isRead: string
  ) {}
  createBook(this: Book) {
    var newRow = tbodyRef!.insertRow();
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
    newCell.innerHTML = `<input type="checkbox" name="read" class="check_read" ${
      this.isRead === 'true' ? 'checked' : ''
    } />  `;
    newCell = newRow.insertCell();
    newCell.innerHTML = `<div><button class="btn_edit">🖊</button><span>/</span><button class="btn_delete">❌</button></div>`;
  }
}

//? BOOKS API
const DUMMY_BOOKS: BookType[] = [
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

const setLocalStorage = (arr: BookType[]) =>
  localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(arr));

const getLocalStorage = JSON.parse(localStorage.getItem('DUMMY_LIST_BOOKS')!);

const mapBooksList = (arr: BookType[]) => {
  arr.map((item: BookType) => {
    createNewBook(
      item.id,
      item.title,
      item.author,
      item.pages,
      item.published,
      item.isRead
    );
  });
};

if (getLocalStorage) {
  mapBooksList(getLocalStorage);
  sumTotalReadBooks(getLocalStorage);
} else {
  setLocalStorage(DUMMY_BOOKS);
  mapBooksList(DUMMY_BOOKS);
  sumTotalReadBooks(DUMMY_BOOKS);
  location.reload();
}

//? FORM INPUT
const form: HTMLFormElement = document.querySelector('#my_form')!;
const submitBtn = document.querySelector('.submit_btn')!;
const inputTitle: HTMLInputElement = document.querySelector('.input_title')!;
const inputAuthor: HTMLInputElement = document.querySelector('.input_author')!;
const inputPages: HTMLInputElement = document.querySelector('.input_pages')!;
const inputPublished: HTMLInputElement = document.querySelector('.input_published')!;
const inputRead: HTMLInputElement = document.querySelector('.input_isRead')!;

const inputsForm: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[data-input="input-form"]'
);

const onSubmitHandler = (e: any) => {
  e.preventDefault();

  const titleValue = inputTitle.value;
  const authorValue = inputAuthor.value;
  const pagesValue = inputPages.value;
  const publishedValue = changeFormatDate(inputPublished.value);
  const readValue = inputRead.checked.toString();
  const id = Date.now().toString();

  const checkInput =
    titleValue.length > 0 &&
    authorValue.length > 0 &&
    pagesValue.length > 0 &&
    publishedValue !== 'unknown';

  // Check validity
  inputsForm.forEach(input => {
    const errorMessage = document.querySelector(
      `p[data-input-error="input_${input.name}"]`
    ) as HTMLParagraphElement;

    if (input.validity.valueMissing) {
      errorMessage.ariaHidden = 'false';
      if (input.name === 'published') {
        errorMessage.innerHTML = `Please, enter a correct date`;
        return;
      }

      errorMessage.innerHTML = `Please, enter a ${input.name}`;
    }

    if (input.validity.rangeUnderflow) {
      errorMessage.ariaHidden = 'false';
      errorMessage.innerHTML = `Please, put a number of ${input.name} greater than 0`;
    }

    if (!input.validity.valueMissing && !input.validity.rangeUnderflow) {
      errorMessage.ariaHidden = 'true';
      errorMessage.innerHTML = '';
    }
  });

  const bookInput: BookType = {
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
    } else {
      setLocalStorage([...DUMMY_BOOKS, bookInput]);
      createNewBook(id, titleValue, authorValue, pagesValue, publishedValue, readValue);
    }
    form.reset();
    modal.style.display = 'none';
    location.reload();
  }
};

submitBtn.addEventListener('click', onSubmitHandler);

// ------ SEARCH BOOK ------ //
const searchFunction = () => {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const filter = searchInput.value.toUpperCase();
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      const txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
};

// ------ LIBRARY LOG ------ //
function sumTotalReadBooks(arr: any[]) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    arr[i].isRead === 'true' && (sum += 1);
  }
  totalBooks.innerHTML = `${arr.length}`;
  totalReadBooks.innerHTML = `${sum}`;
}

// ------ UPDATE CHECKBOX READ ------ //
const checkboxGet = document.querySelectorAll(
  '.check_read'
) as NodeListOf<HTMLInputElement>;

checkboxGet.forEach((checkbox, index) => {
  checkbox.addEventListener('change', () => {
    const checkboxStatus = checkboxGet[index].checked;
    !checkboxStatus
      ? checkboxGet[index].removeAttribute('checked')
      : checkboxGet[index].setAttribute('checked', '');
    const id = tr[index + 1].id;
    const bookRead = getLocalStorage.filter((book: BookType) => book.id === id)[0];
    bookRead.isRead = checkboxStatus.toString();
    localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(getLocalStorage));
    totalReadBooks.innerHTML = `${
      checkboxStatus ? +totalReadBooks.innerHTML + 1 : +totalReadBooks.innerHTML - 1
    } `;
  });
});

// ------ DELETE BOOK ------ //
const deleteBtn = document.getElementsByClassName('btn_delete');

for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i]?.addEventListener('click', () => {
    const id = tr[i + 1].id;
    const updatedList = getLocalStorage.filter((book: BookType) => book.id !== id);
    localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(updatedList));
    location.reload();
  });
}

// ------ EDIT BOOK ------ //
const editBtn = document.getElementsByClassName('btn_edit')!;
const editSubmitBtn = document.querySelector('.submit_btn-edit')!;
const inputEditTitle: HTMLInputElement = document.querySelector('.input_title-edit')!;
const inputEditAuthor: HTMLInputElement = document.querySelector('.input_author-edit')!;
const inputEditPages: HTMLInputElement = document.querySelector('.input_pages-edit')!;
const inputEditPublished: HTMLInputElement = document.querySelector(
  '.input_published-edit'
)!;
const inputEditRead: HTMLInputElement = document.querySelector('.input_isRead-edit')!;

const inputsFormEdit: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[data-input="input-edit"]'
);

for (let i = 0; i < editBtn.length; i++) {
  editBtn[i].addEventListener('click', () => {
    modalEdit.style.display = 'block';
    const id = tr[i + 1].id;
    const bookEdit = getLocalStorage.filter((book: BookType) => book.id === id)[0];

    inputEditTitle.value = bookEdit.title;
    inputEditAuthor.value = bookEdit.author;
    inputEditPages.value = bookEdit.pages;
    inputEditPublished.value = defaultFormatInputDate(bookEdit.published);
    bookEdit.isRead === 'true'
      ? inputEditRead.setAttribute('checked', '')
      : inputEditRead.removeAttribute('checked');

    editSubmitBtn.addEventListener('click', (e: any) => {
      e.preventDefault();
      bookEdit.title = inputEditTitle.value;
      bookEdit.author = inputEditAuthor.value;
      bookEdit.pages = inputEditPages.value;
      bookEdit.published = changeFormatDate(inputEditPublished.value);
      bookEdit.isRead = inputEditRead.checkValidity;

      const checkInput =
        bookEdit.title.length > 0 &&
        bookEdit.author.length > 0 &&
        bookEdit.pages.length > 0 &&
        bookEdit.published.length > 0;

      // Check validity
      inputsFormEdit.forEach(input => {
        const errorMessage = document.querySelector(
          `p[data-input-error="${input.name}"]`
        ) as HTMLParagraphElement;

        if (input.validity.valueMissing) {
          errorMessage.ariaHidden = 'false';
          if (input.name === 'published') {
            errorMessage.innerHTML = `Please, enter a correct date`;
            return;
          }

          errorMessage.innerHTML = `Please, enter a ${input.name.slice(
            0,
            input.name.length - 5
          )}`;
        }

        if (input.validity.rangeUnderflow) {
          errorMessage.ariaHidden = 'false';
          errorMessage.innerHTML = `Please, put a number of ${input.name} greater than 0`;
        }

        if (!input.validity.valueMissing && !input.validity.rangeUnderflow) {
          errorMessage.ariaHidden = 'true';
          errorMessage.innerHTML = '';
        }
      });

      if (!checkInput) return;

      localStorage.setItem('DUMMY_LIST_BOOKS', JSON.stringify(getLocalStorage));
      form.reset();
      modal.style.display = 'none';
      location.reload();
    });
  });
}
