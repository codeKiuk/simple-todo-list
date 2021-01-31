'use strict';

const modal = document.querySelector('.modal'),
    modalVisible = modal.style.visibility,
    mainCreateBtn = document.querySelector('.main--create-todo'),
    ul = document.querySelector('.todos'),
    searchForm = document.querySelector('.search'),
    search = searchForm.querySelector('.todo-search'),

    viewModal = document.querySelector('.view-modal'),
    viewModalClear = document.querySelector('.view-modal--clear'),
    viewModalCreateBtn = document.querySelector('.view-modal--create-todo'),
    viewModalTitleForm = document.querySelector('.view-modal--title-form'),
    viewModalContentForm = document.querySelector('.view-modal--content-form'),
    viewModalTitleInput = viewModalTitleForm.querySelector('.view-modal--title-input'),
    viewModalContentInput = viewModalContentForm.querySelector('.view-modal--content-input'),
    viewModalTitle = document.querySelector('.view-modal--title-input'),
    viewModalContent = document.querySelector('.view-modal--content-input'),

    modalCreateBtn = document.querySelector('.modal--create-todo'),
    modalClear = document.querySelector('.modal--clear'),

    titleForm = document.querySelector('.title-form'),
    titleInput = titleForm.querySelector('.modal--title-input'),
    contentForm = document.querySelector('.content-form'),
    contentInput = contentForm.querySelector('.modal--content-input'),

    clearCompletedBtn = document.querySelector('.clear-completed'),
    showAllBtn = document.querySelector('.show-all'),
    showActiveBtn = document.querySelector('.show-active'),
    showCompletedBtn = document.querySelector('.show-completed');
    
let titleValue;
let contentValue;
let viewModalTitleValue;
let viewModalContentValue;
let todos = [];
let completed = [];

titleForm.addEventListener('submit', event => event.preventDefault());
viewModalTitleForm.addEventListener('submit', event => event.preventDefault());
contentForm.addEventListener('submit', event => event.preventDefault());
viewModalContentForm.addEventListener('submit', event => event.preventDefault());
searchForm.addEventListener('submit', event => event.preventDefault());

mainCreateBtn.addEventListener('click', () => {

    titleInput.value = '';
    contentInput.value = '';
    modal.style.visibility = 'visible';
})

ul.addEventListener('click', (event) => {
    if (ul.childElementCount === 0) {
        return;
    }
    
    if (event.target.className === 'fas fa-times delete') {
        deleteToDo(event);
    }
    else if (event.target.className === 'far fa-circle active') {
        completeToDo(event);
    }
    else if (event.target.className === 'todos--todo') {
        showViewModal(event);
    }
})

search.addEventListener('input', (event) => {
    
    const value = event.target.value;
    searchHandler(value);
})

search.addEventListener('keydown', key => {
    
    if (key.key === 'Backspace') {
        for (let i=0; i<ul.children.length; i++) {
            ul.children[i].style.display = '';
        }
        searchHandler(search.value.substring(0, search.value.length - 1));
    }
})

modalCreateBtn.addEventListener('click', () => {

    modal.style.visibility = 'hidden';
    titleValue = titleInput.value;
    contentValue = contentInput.value;
    paintToDo(titleValue, contentValue);
})

modalClear.addEventListener('click', () => {

    modal.style.visibility = 'hidden';
})

viewModalClear.addEventListener('click', () => {

    viewModal.style.visibility = 'hidden';
})

clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
})

showAllBtn.addEventListener('click', () => {
    showAll();
})

showActiveBtn.addEventListener('click', () => {
    showActive();
})

showCompletedBtn.addEventListener('click', () => {
    showCompleted();
})

function saveToDo() {

    localStorage.setItem('todo', JSON.stringify(todos));
}

function paintToDo(titleValue, contentValue) {

    const newId = todos.length;

    const li = document.createElement('li');
    li.setAttribute('class', 'todos--todo');
    li.innerHTML = `<div class="todo-left">
                        <i class="far fa-circle active"></i>
                        <span class="todo-title">${titleValue}</span>
                    </div>
                    <i class="fas fa-times delete"></i>`;
    li.id = newId;

    ul.appendChild(li);
    li.scrollIntoView({behavior: 'smooth', block: 'end'});
    
    let todo = {
        title: titleValue,
        content: contentValue,
        id: newId
    }

    todos.push(todo);
    saveToDo();
}

function loadToDo() {
    const loadedToDos = localStorage.getItem('todo');
    if (loadedToDos === null) {
        return;
    }
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach((todo) => {
        paintToDo(todo.title, todo.content);
    });
}

function deleteToDo(event) {
    const willBeRemoved = event.target.parentNode;
    ul.removeChild(willBeRemoved);
    todos = todos.filter((todo) => {
        return todo.id !== parseInt(willBeRemoved.id);
    });
    saveToDo();
}

function completeToDo(event) {

    if (event.target.style.backgroundColor === 'black') {
        event.target.style.backgroundColor = '';
        completed = completed.filter((li) => {
            return parseInt(li.id) !== parseInt(event.target.parentNode.parentNode.id);
        });
        console.log(completed);
        return;
    }

    event.target.style.backgroundColor = 'black';
    
    const tmpArr = todos.filter((todo) => {
        return parseInt(todo.id) === parseInt(event.target.parentNode.parentNode.id);
    })
    completed.push(tmpArr[0]);
}

function showViewModal(event) {
    showViewModalContent(event);
    viewModal.style.visibility = 'visible';
}
function showViewModalContent(event) {

    todos.forEach((todo) => {
        if (parseInt(todo.id) === parseInt(event.target.id)) {
            viewModalTitleInput.value = todo.title;
            viewModalContentInput.value = todo.content;
        }
    })

    const target = event.target;

    viewModalCreateBtn.addEventListener('click', () => {

        viewModal.style.visibility = 'hidden';
        viewModalContentUpdate(target);        
    })
}

function viewModalContentUpdate(target) {

    viewModalTitleValue = viewModalTitleInput.value;
    viewModalContentValue = viewModalContentInput.value;

    todos.forEach((todo) => {
        if (parseInt(target.id) === parseInt(todo.id)) {

            todo.title = viewModalTitleValue;
            todo.content = viewModalContentValue;
            saveToDo();
            ul.innerHTML = '';
        } 
    })
    location.reload();
}

function clearCompleted() {

    completed.forEach((item) => {
        if (todos.includes(item)) {
            const idx = todos.indexOf(item);
            todos.splice(idx, 1);
            saveToDo();
        }
    })

    ul.innerHTML = '';
    location.reload();
}

function showAll() {
    todos.forEach((todo) => {
        let tmpId = todo.id;
        let thisLi = document.querySelector("#" + CSS.escape(tmpId));
        thisLi.style.display = '';
    })
}

function showActive() {
    showAll();

    completed.forEach((item) => {
        let tmpId = item.id;
        let thisLi = document.querySelector("#" + CSS.escape(tmpId));
        thisLi.style.display = 'none';
    })
}

function showCompleted() {

    showAll();

    const active = [];

    todos.forEach((todo) => {
        if (!completed.includes(todo)) {
            active.push(todo);
        }
    })

    active.forEach((item) => {
        let tmpId = item.id;
        let thisLi = document.querySelector("#" + CSS.escape(tmpId));
        thisLi.style.display = 'none';
    })
}

function searchHandler(value) {

    const searched = [];

    todos.forEach((todo) => {
        const title = todo.title.toLowerCase();
        if (title.search(value.toLowerCase()) !== -1) {
            searched.push(todo.id);
        }
    });

    for (let i=0; i<ul.children.length; i++) {
        if (!searched.includes(parseInt(ul.children[i].id))) {
            ul.children[i].style.display = 'none';
        }
    }
}

function init() {
    loadToDo();
}

init();