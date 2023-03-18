import {Player} from "./player.js";
import {Projectile} from "./projectile.js";

const canvas = document.querySelector('canvas')
// сохраняем контекст для рисования в канвас
const context = canvas.getContext('2d')
// рисунок на всю ширину экрана
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

let player
// массив всех снарядов
let projectiles = []
let enemies = []
startGame()
function startGame(){
    init()
    animate()
    spawnEnemies()
}
function init(){
    // ограничение поля игрока
    const movementLimits = {
        minX: 0,
        maxX: canvas.width,
        minY: 0,
        maxY: canvas.height,
    }
// создание персонажа в середине экрана
    player = new Player(canvas.width/2, canvas.height/2, context, movementLimits)
    addEventListener('click', createProjectile)
}

// добавление снаряда в массив
function createProjectile(event){
    projectiles.push(
        // для экземпляра класса необходимы координаты выстрела и цели
        new Projectile(
            player.x,
            player.y,
            event.clientX,
            event.clientY,
            // контекст необходим для отрисовки снаряда
            context,
        )
    )
}

function spawnEnemies(){
    enemies.push(new Enemy(canvas.width, canvas.height, context, player))
}
// цикл отрисовки анимации
function animate(){
    // перерисовка на следующем кадре
    requestAnimationFrame(animate)
    // очистка прошлой картинки персонажа
    context.clearRect(0, 0, canvas.width, canvas.height)

    // после выхода из экрана снаряд не отрисовывается
    projectiles = projectiles.filter(projectileInsideWindow)

    // отрисовка снарядов
    projectiles.forEach(projectile => projectile.update())
    // вызов отрисовки персонажа
    player.update()
}
function projectileInsideWindow(projectile){
    return projectile.x + projectile.radius > 0 &&
        projectile.x - projectile.radius < canvas.width &&
        projectile.y - projectile.radius < canvas.height
}
