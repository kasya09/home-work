/*
* Реализовать электронные часы.
 */


let hour = document.getElementById('hour')
let second = document.getElementById('second')
let min = document.getElementById('min')

setInterval(() => {
    let currentDate = new Date()

    second.innerHTML = currentDate.getSeconds()
    min.innerHTML = currentDate.getMinutes()
    hour.innerHTML = currentDate.getHours()

}, 1000)