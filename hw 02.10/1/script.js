/*
* Задача 2:
* Реализовать слайдер*
* Меняющий каждые 3 секунды изображение (массив из 5 изображений)
* Реализовать переключение по стрелкам.
* Слайдер должна работать циклически: по достижении последнего изображения и при клике на кнопку Next - показывать первое изображение
*/


let slides = [
    'https://images.unsplash.com/photo-1600709449985-6cb6aac6b977?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80',
    'https://images.unsplash.com/photo-1599622991867-55de316fccef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80',
    'https://images.unsplash.com/photo-1599847429047-5d59ef230c96?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=518&q=80',
    'https://images.unsplash.com/photo-1588368717114-049af0b04679?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1584468104753-e8879ebfcc1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
]

let container = document.querySelector('.img-container')
let btnNext = document.getElementById('btn-next')
let btnPrev = document.getElementById('btn-prev')
let slide = document.getElementsByClassName('img')
let index = 0
let numberInterval = 0
let timeOut = 3000

container.innerHTML = slides.map(imgLink => `<img src="${imgLink}" class="img" alt="">`).join("")

let isFirst = idx => idx <= 0
let isLast = idx => idx >= slide.length - 1

let moveSlide = idx => container.style.transform = `translateX(${-idx * 500}px)`

let resetInterval = (fun, timeout) => {
    if (numberInterval !== 0)
        clearInterval(numberInterval)

    numberInterval = setInterval(fun, timeout)
}

let changeSlide = () => {
    isLast(index)
        ? clearInterval(numberInterval)
        : index++

    moveSlide(index)
}
resetInterval(changeSlide, timeOut)


btnNext.onclick = () => {
    index++
    if (isLast(index)) {
        index = 0        
    }
    resetInterval(changeSlide, timeOut)
    moveSlide(index)
}

btnPrev.onclick = () => {
    index = isFirst(index)
        ? slide.length - 1
        : --index

    resetInterval(changeSlide, timeOut)
    moveSlide(index)
}
