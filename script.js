import {Player} from "./player.js";
import {Projectile} from "./projectile.js";
import {Enemy} from "./enemy.js";
import {distanceBetweenTwoPoints} from "./utilities.js";

const canvas = document.querySelector('canvas')
// сохраняем контекст для рисования в канвас
const context = canvas.getContext('2d')
// рисунок на всю ширину экрана
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
const wastedElement = document.querySelector('.wasted')
const scoreElement = document.querySelector('#score')
let player
let score = 0
// массив всех снарядов
let projectiles = []
let enemies = []
let particles = []
let spawnIntervalId, countIntervalId, animationId
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
    let countOfSpawnEnemies = 1
    countIntervalId = setInterval(() => countOfSpawnEnemies++, 30000)
    spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemies), 1000)
    spawnCountEnemies(countOfSpawnEnemies)
}
function spawnCountEnemies(count){
    for (let i = 0; i < count; i++){
        enemies.push(new Enemy(canvas.width, canvas.height, context, player))
    }
}
// цикл отрисовки анимации
function animate(){
    // перерисовка на следующем кадре
    animationId = requestAnimationFrame(animate)
    // очистка прошлой картинки персонажа
    context.clearRect(0, 0, canvas.width, canvas.height)
    // проверка на окончание игры
    const isGameOver = enemies.some(checkHittingPlayer)
    if (isGameOver){
        cancelAnimationFrame(animationId)
        wastedElement.style.display = 'block'
        clearInterval(spawnIntervalId)
        clearInterval(countIntervalId)
    }
    // удаление прозрачных частиц из массива
    particles = particles.filter(particle => particle.alpha > 0)
    // после выхода из экрана снаряд не отрисовывается
    projectiles = projectiles.filter(projectileInsideWindow)
    // отрисовка частей взрыва
    particles.forEach(particle => particle.update())
    // отрисовка снарядов
    projectiles.forEach(projectile => projectile.update())
    // логика поподания снаряда во врага
    enemies.forEach(enemy => checkHittingEnemy(enemy))
    // удаление подбитого врага
    enemies = enemies.filter(enemy => enemy.health > 0)

    // вызов отрисовки персонажа
    player.update()
    enemies.forEach(enemy => enemy.update())
}
function projectileInsideWindow(projectile){
    return projectile.x + projectile.radius > 0 &&
        projectile.x - projectile.radius < canvas.width &&
        projectile.y - projectile.radius < canvas.height
}
// проверка на касание врагом
function checkHittingPlayer(enemy){
    const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y)
    return distance - enemy.radius - player.radius < 0
}
function checkHittingEnemy(enemy){
    // ищим любой попавший снаряд во врага
    projectiles.some((projectile, index) => {
        const distance = distanceBetweenTwoPoints(projectile.x, projectile.y, enemy.x, enemy.y)
        if (distance - enemy.radius - projectile.radius > 0) return false
        // удаление снаряда при попадании во врага
        removeProjectilesByIndex(index)
        enemy.health--

        // анимация смерти врага
        if (enemy.health < 1){
            increaseScore()
            enemy.createExplosion(particles)
        }
        return true
    })
}
function removeProjectilesByIndex(index){
    projectiles.splice(index, 1)
}
// увеличение очков за убийство врага
function increaseScore(){
    score += 250
    scoreElement.innerHTML = score
}
