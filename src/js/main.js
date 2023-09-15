"use strict";
let mode = "add";
let editingTask;
const text = document.getElementById('task-text');
const storage = localStorage.getItem('tasks');
const priority = document.querySelectorAll('.priority');
const container = document.querySelector('.container');
const submitBtn = document.getElementById('submitBtn');
let tasks = storage ? JSON.parse(storage) : [];
let selectedPriority = 1;
// render tasks into container element
const renderList = (tasks) => {
    container.innerHTML = tasks.map(task => {
        return `<article id="${task.id}" class="flex text-justify mb-2 border border-solid mx-1 rounded-sm p-2 ${task.color}">
        <div class="px-2 w-full flex ${task.isDone ? 'done' : null}">
            ${task.text}
        </div>
        <div class="ml-auto flex gap-1 flex-col sm:flex-row sm:items-center">
            <button onClick="done(${task.id})" class="${task.isDone ? 'done-bg' : 'bg-teal-600'} rounded-full w-[30px] h-[30px] text-white ${task.isDone ? 'done-bg' : 'hover:bg-teal-500'}">${!task.isDone ? '<span class="fa fa-check fa-xs"></span>' : '<span class="fa fa-check-double fa-xs"></span>'}</button>
            <button onClick="edit(${task.id})" class="bg-amber-500 rounded-full w-[30px] h-[30px] text-white hover:bg-amber-400"><span class="fa fa-pen fa-xs"></span></button>
            <button onClick="remove(${task.id})" class="bg-rose-600 rounded-full w-[30px] h-[30px] text-white hover:bg-rose-500"><span class="fa fa-times fa-xs"></span></button>
        </div>
        </article>`;
    }).join('');
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
// get priority on click each circle down input
priority.forEach((input) => {
    input.addEventListener('click', (event) => {
        const eventTarget = event.target;
        selectedPriority = Number(eventTarget.getAttribute('data-id'));
        priority.forEach((inp) => {
            const item = inp;
            item.innerHTML = "";
        });
        eventTarget.innerHTML = `<span class="fa fa-check"></span>`;
    });
});
const setTask = () => {
    if (mode === 'add') {
        tasks = [...tasks, { id: Date.now(), text: text.value, isDone: false, priority: selectedPriority, color: 'priority-border-' + selectedPriority }];
    }
    else {
        tasks = tasks.map((task) => {
            if (task.id === editingTask.id) {
                return Object.assign(Object.assign({}, task), { text: text.value, priority: selectedPriority, isDone: false, color: 'priority-border-' + selectedPriority });
            }
            else {
                return task;
            }
        });
    }
    submitBtn.textContent = 'Submit';
    mode = "add";
    text.value = "";
    priority.forEach((inp) => {
        const item = inp;
        const inpDataId = Number(item.getAttribute('data-id'));
        if (inpDataId === selectedPriority) {
            item.innerHTML = `<span class="fa fa-check"></span>`;
        }
        else {
            item.innerHTML = "";
        }
    });
    renderList(tasks.sort((a, b) => { return a.priority - b.priority; }));
};
const remove = (taskId) => {
    const filteredTasks = tasks.filter((task) => {
        return task.id !== taskId;
    });
    tasks = filteredTasks;
    renderList(filteredTasks);
};
const edit = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    text.value = task.text;
    selectedPriority = task.priority;
    priority.forEach((inp) => {
        const item = inp;
        const inpDataId = Number(item.getAttribute('data-id'));
        if (inpDataId === selectedPriority) {
            item.innerHTML = `<span class="fa fa-check"></span>`;
        }
        else {
            item.innerHTML = "";
        }
    });
    submitBtn.textContent = 'Edit Task';
    editingTask = task;
    mode = 'edit';
};
const done = (taskId) => {
    tasks = tasks.map((task) => {
        if (task.id === taskId) {
            return Object.assign(Object.assign({}, task), { isDone: !task.isDone });
        }
        else {
            return task;
        }
    });
    renderList(tasks);
};
renderList(tasks);
