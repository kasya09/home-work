/**
 * Создать скрипт, который:
 * Выводит список пользователей с кнопками “Edit”, “Remove”, “View” возле каждого пользователя (use data-id attributes).
 * При клике на кнопку “View” открываются данные пользователя в блоке под списком.
 * При клике на кнопку “Edit” появляется возможность редактировать его данные в блоке под списком.
 * Данные сохраняются при клике на кнопку “Save” и обновляют данные в списке. При клике на кнопку “Remove” пользователь удаляется из списка.
 * Обязательно подтверждение удаления. Реализовать возможность добавления новых пользователей.
 * Желательно переиспользовать форму редактирования.
 * При добавлении пользователь появляется в списке
 */

let tableData = document.getElementById('table-data')
let form = document.registration

let users = JSON.parse(localStorage.getItem('data')) || []

form.onsubmit = ev => {
    ev.preventDefault()

    let data = formToData(ev.target)
    console.log(data)

    data.userId
        ? users[data.userId] = data
        : users.push(data)

    updateTable()
}

let isElement = element =>
    element.name
let isElementWithValue = element =>
    isElement(element) && element.value

let isCheckbox = element =>
    element.type === 'checkbox'
let isCheckboxWithValue = element =>
    element.checked || !['checkbox', 'radio'].includes(element.type)

let isCurrentUser = (id, form) =>
    id === form.userId.value

let resetForm = form => {
    form.reset();

    form.userId.value = null;

    [...form.elements].forEach(element => {
        element.readOnly = false
        element.disabled = false
    })
}


let formToData = elements => [...elements].reduce((data, element) => {

    if (isElementWithValue(element) && isCheckboxWithValue(element))
        isCheckbox(element)
            ? data[element.name] = (data[element.name] || []).concat(element.value)
            : data[element.name] = element.value

    return data;

}, {})


let updateTable = () => {
    localStorage.setItem('data', JSON.stringify(users))
    users = JSON.parse(localStorage.getItem('data'))

    console.log(users)

    let userHtml = ''
    for (let [i, user] of users.entries()) {
        userHtml += `
            <tr data-id="${i}">
                <td>${i}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.password}</td>
                <td>${user.age}</td>
                <td>${user.address}</td>
                <td>${user.skills}</td>
                <td>
                    <button class="view-btn btn" onclick="viewUser(event)">View</button>
                    <button class="edit-btn btn" onclick="editUser(event)">Edit</button>
                    <button class="remove-btn btn" onclick="deleteUser(event)">Remove</button>
                </td>
             </tr>
        `
    }
    tableData.innerHTML = userHtml
}

let viewUser = event => {
    let targetUserId = event.target.parentNode.parentNode.dataset.id
    let targetUser = users[targetUserId]

    if (isCurrentUser(targetUserId, form)) {
        resetForm(form)
        return
    }

    form.reset()

    for (let element of form.elements) {

        if (isElement(element)) {

            if (element.name === 'userId')
                element.value = targetUserId

            if (isCheckbox(element) && targetUser[element.name].includes(element.value)) {
                element.checked = true
                element.disabled = true
            } else if (isCheckbox(element)) {
                element.disabled = true
            }

            if (!isCheckbox(element) && targetUser[element.name]) {
                element.value = targetUser[element.name]
                element.readOnly = true
            } else if (!isCheckbox(element)) {
                element.readOnly = true
            }
        }
    }

    updateTable()
}


let editUser = event => {
    let targetUserId = event.target.parentNode.parentNode.dataset.id
    let targetUser = users[targetUserId]

    if (isCurrentUser(targetUserId, form)) {
        resetForm(form)
        return
    }

    form.reset()

    for (let element of form.elements) {

        if (isElement(element)) {

            if (element.name === 'userId')
                element.value = targetUserId

            if (isCheckbox(element) && targetUser[element.name].includes(element.value)) {
                element.checked = true
            }

            if (!isCheckbox(element) && targetUser[element.name]) {
                element.value = targetUser[element.name]
            }
        }
    }

    updateTable()
}

let deleteUser = event => {
    let targetUserId = event.target.parentNode.parentNode.dataset.id

    if (confirm('Are you sure?')) {
        users.splice(targetUserId, 1)
    }

    updateTable()
}

updateTable()