//DOM elements
const form = document.querySelector('.input_layer');
const taskInput = document.getElementById('task');
const taskList = document.querySelector('.task-wrapper');


let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasks)
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList()

// Event listeners
form.addEventListener('submit', addTask)
taskList.addEventListener('click', deleteTask)
taskList.addEventListener('click', doneTask)


//Functions
function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;
    const newTask = {
        id: Date.now(),
        text: taskText,
        status: false,
    };

    if(taskInput.value === "") {
        taskInput.focus();
        return
    } 

    tasks.push(newTask)
    saveToStorage()
    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();

    checkEmptyList()
}

function deleteTask(e) {
    if(e.target.dataset.action !== 'delete') return;

    const parentNode = e.target.closest('.task');

    const id = Number(parentNode.id);
    const index = tasks.findIndex((task) => task.id === id);
    tasks.splice(index, 1);
    saveToStorage()
    parentNode.remove();

    checkEmptyList()
}

function doneTask(e) {
    if(e.target.dataset.action !== 'done') return;

    const parentNode = e.target.closest('.task');

    const id = Number(parentNode.id);
    const doneTask = tasks.find((task) => task.id === id);
    doneTask.status = !doneTask.status;

    const task = parentNode.querySelector('.text');
    task.classList.toggle('task-done');

    saveToStorage()
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const empty = `<div class="empty">Empty list, please create task!</div>`;
        taskList.insertAdjacentHTML('afterbegin', empty);
    }

    if(tasks.length > 0) {
        const emptyEl = document.querySelector('.empty');
        emptyEl ? emptyEl.remove() : null;
    }
}

function saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.status ? 'text task-done' : 'text';

    const taskHTML = `<div id="${task.id}" class="task">
                        <p class="${cssClass}">${task.text}</p>
                        <div class="btns">
                            <button id="check" data-action="done" class="check"><i class="fa-solid fa-check"></i></button>
                            <button id="delete" data-action="delete" class="delete"><i class="fa-solid fa-x"></i></button>
                        </div>
                </div>`

    taskList.insertAdjacentHTML('beforeend', taskHTML);
}