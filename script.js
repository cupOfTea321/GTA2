import {Player} from "./player.js";

const canvas = document.querySelector('canvas')
// сохраняем контекст для рисования в канвас
const context = canvas.getContext('2d')
// рисунок на всю ширину экрана
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

let player
startGame()
function startGame(){
    init()
    animate()
}
function init(){
    const movementLimits = {
        minX: 0,
        maxX: canvas.width,
        minY: 0,
        maxY: canvas.height,
    }
// создание персонажа в середине экрана
    player = new Player(canvas.width/2, canvas.height/2, context, movementLimits)
}
// ограничение поля игрока



// цикл отрисовки анимации
function animate(){
    // перерисовка на следующем кадре
    requestAnimationFrame(animate)
    // очистка прошлой картинки персонажа
    context.clearRect(0, 0, canvas.width, canvas.height)
    // вызов отрисовки персонажа
    player.update()
}
