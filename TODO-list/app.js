/*
* Создать приложение TODO-list для хранения списка задач:
* Выводить список задач
* Создавать, редактировать и удалять созданные задачи
* Менять задачам статус (Open (default), In progress, Done)
* Менять приоритет задач (Low, Minor, Major, High)
* Данные по всем задачам хранить в localStorage
*/

let uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11)
    .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

class Task {

    id

    message

    priority

    status

    constructor(id, message, priority, status) {
        this.id       = id
        this.message  = message
        this.priority = priority
        this.status   = status
    }

}

class Status {

    id

    name

    slug

    isDefault

    constructor(id, name, slug, isDefault) {
        this.id = id
        this.name = name
        this.slug = slug
        this.isDefault = isDefault
    }

}

class TaskRepository {

    tasks = JSON.parse(localStorage.getItem('tasks')) || [
        new Task(
            uuidv4(),
            'create something',
            'Low',
            'open'
        ),
        new Task(
            uuidv4(),
            'read something',
            'Low',
            'open'
        ),
        new Task(
            uuidv4(),
            'update something',
            'Minor',
            'open'
        ),
        new Task(
            uuidv4(),
            'remove something',
            'High',
            'open'
        ),
    ]

    findTaskIndexByIdOrNull(id) {
        let taskIndex = this.tasks.findIndex(it => it.id === id)
        if (taskIndex === -1) {
            console.warn('not found task with id: ' + id)
            taskIndex = null
        }

        return taskIndex
    }

    findTaskByIdOrNull(id) {
        let task = this.tasks.find(it => it.id === id)
        if (task === undefined) {
            console.warn('not found task with id: ' + id)
            task = null
        }

        return task
    }

    addOrUpdateTask(task) {
        let taskIndex = this.findTaskIndexByIdOrNull(task.id)
        if (taskIndex !== null) {
            this.tasks[taskIndex] = task
        } else {
            this.tasks.push(task)
        }
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    removeTaskById(id) {
        let taskIndex = this.findTaskIndexByIdOrNull(id)
        if (taskIndex !== null) {
            this.tasks.splice(taskIndex, 1)
        } else {
            console.warn('not found task with id: ' + id)
        }
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

}

class StatusRepository {

    statuses = JSON.parse(localStorage.getItem('statuses')) || [
        new Status(
            uuidv4(),
            'Open',
            'open',
            true
        ),
        new Status(
            uuidv4(),
            'In Progress',
            'in-progress',
            false
        ),
        new Status(
            uuidv4(),
            'Done',
            'done',
            false
        ),
    ]

    findStatusIndexByIdOrNull(Id) {
        let statusIndex = this.statuses.findIndex(it => it.id === Id)
        if (statusIndex === -1) {
            console.warn('not found status with id: ' + id)
            statusIndex = null
        }

        return statusIndex
    }

    findStatusByIdOrNull(id) {
        let status = this.statuses.find(it => it.id === id)
        if (status === undefined) {
            console.warn('not found status with id: ' + id)
            status = null
        }

        return status
    }

    addOrUpdateStatus(status) {
        let statusIndex = this.findStatusIndexByIdOrNull(status.id)
        if (statusIndex !== null) {
            this.statuses[statusIndex] = status
        } else {
            this.statuses.push(status)
        }
        localStorage.setItem('statuses', JSON.stringify(this.statuses))
    }

    removeStatusById(id) {
        let statusIndex = this.findStatusIndexByIdOrNull(id)
        if (statusIndex !== null) {
            this.statuses.splice(statusIndex, 1)
        } else {
            console.warn('not found status with id: ' + id)
        }
        localStorage.setItem('statuses', JSON.stringify(this.statuses))
    }

}

let taskRepo = new TaskRepository()
let statusRepo = new StatusRepository()

let formContainer = document.querySelector('#form-container > .container > .row > form')
let boxContainer = document.querySelector('#box-container > .container > .row')

let renderBoxesHTML = statuses => statuses.map(it => `
    <div class="box col">
        <h4 class="status">${it.name}</h4>
        <div id="${it.slug}" class="tasks">

        </div>
    </div>
`).join('')

let getFormData = form => [...form.elements]
    .filter(it => it.type !== 'radio' && it.type !== 'checkbox' && it.type !== 'submit')
    .reduce((map, it) => {map[it.name] = it.value; return map}, {})

let renderTasksHTML = tasks => tasks.map(it => `
    <div class="card" draggable="true" data-id="${it.id}">
        <div class="card-body">
            <p class="card-text">
                ${it.message}
            </p>
            <h6 class="card-subtitle mb-2 text-muted">
                ${it.priority}
            </h6>
            <a href="#" class="card-link" data-action="edit"><i class="far fa-edit"></i>Edit</a>
            <a href="#" class="card-link" data-action="remove" ><i class="far fa-trash-alt"></i>Remove</a>
        </div>
    </div>
`).join('')

let editTaskInForm = task => [...formContainer.elements]
    .filter(it => it.type !== 'radio' && it.type !== 'checkbox' && it.type !== 'submit')
    .forEach(it => formContainer[it.name].value = task[it.name])

let updateBoxes = () => {
    boxContainer.innerHTML = renderBoxesHTML(statusRepo.statuses)

    for (let status of statusRepo.statuses) {
        let box = document.getElementById(status.slug)

        let orderTasks = taskRepo.tasks
            .filter(it => it.status === status.slug)
            .sort((it1, it2) => it1.slug > it2.slug ? 1: -1)

        box.innerHTML = renderTasksHTML(orderTasks)
    }
}

boxContainer.onclick = event => {
    let button = event.target.closest('a')
    if (!button) {
        return;
    }

    let taskId = event.target.closest('div.card').dataset.id
    if (!taskId) {
        return;
    }

    let task = taskRepo.findTaskByIdOrNull(taskId)
    if (!task) {
        return;
    }

    switch (button.dataset.action) {
        case 'edit':
            editTaskInForm(task)
            break
        case 'remove':
            confirm('Are you sure ?')
                ? taskRepo.removeTaskById(task.id)
                : null
            break
    }

    updateBoxes()
}

formContainer.onsubmit = event => {
    event.preventDefault();

    let formData = getFormData(formContainer)
    formData.id = formData.id || uuidv4()
    formData.status = statusRepo.statuses.find(it => it.isDefault === true).slug
    taskRepo.addOrUpdateTask(formData)

    updateBoxes()

    formContainer.reset()
}

boxContainer.ondragstart = event =>
    event.dataTransfer.setData('text/plain', event.target.dataset.id);

boxContainer.ondragover = event =>
    event.preventDefault()

boxContainer.ondragenter = event =>
    event.preventDefault()

boxContainer.ondrop = event => {
    event.preventDefault()

    let id = event.dataTransfer.getData('text')
    if (id == null) {
        return;
    }

    let taskIndex = taskRepo.findTaskIndexByIdOrNull(id)
    if (taskIndex == null) {
        return;
    }

    let task = taskRepo.tasks[taskIndex]

    task.status = event.target.querySelector('.tasks')
        ? event.target.querySelector('.tasks').attributes['id'].value
        : event.target.closest('.tasks').attributes['id'].value

    taskRepo.addOrUpdateTask(task)

    updateBoxes()
}

updateBoxes()
