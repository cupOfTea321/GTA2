const MOVE_UP_KEY_CODES = ['ArrowUp', 'KeyW']
const MOVE_DOWN_KEY_CODES = ['ArrowDown', 'KeyS']
const MOVE_LEFT_KEY_CODES = ['ArrowLeft', 'KeyA']
const MOVE_RIGHT_KEY_CODES = ['ArrowRight', 'KeyD']
const ALL_MOVE_KEY_CODES = [...MOVE_UP_KEY_CODES, ...MOVE_DOWN_KEY_CODES, ...MOVE_LEFT_KEY_CODES, ...MOVE_RIGHT_KEY_CODES]
export class Player{
    constructor(x, y, context, movementLimits) {
        this.x = x
        this.y = y
        // скорость персонажа
        this.velocity = 3
        this.radius = 15
        this.movementLimits = {
            minX: movementLimits.minX + this.radius,
            maxX: movementLimits.maxX - this.radius,
            minY: movementLimits.minY + this.radius,
            maxY: movementLimits.maxY - this.radius,
        }
        this.context = context
        // хранение позиции курсора
        this.cursorPosition = {
            x: 0,
            y: 0
        }
        document.addEventListener('mousemove', event => {
            this.cursorPosition.x = event.clientX
            this.cursorPosition.y = event.clientY
        })

        // хранение нажатых клавиш, чтобы персонаж мог перемещаться одновременно в 2 стороны
        this.keyMap = new Map()
        document.addEventListener('keydown', event => this.keyMap.set(event.code, true))
        document.addEventListener('keyup', event => this.keyMap.delete(event.code))
        this.image = new Image()
        this.image.src = "./img/player.png"
        this.imageWidth = 50
        this.imageHeight = 60
        // для анимации движения
        this.isMoving = false
        this.imageTick = 0
    }

    // начальная отрисовка персонажа
    drawImg(){
        // каждые 18 кадров меняется положение ног
        const imageTickLimit = 18
        let subX = 0
        if (!this.isMoving){
            subX = 0
            this.imageTick = 0
        } else{
            // при превышении лимита кадров будет показан второй спрайт
            subX = this.imageTick > imageTickLimit ? this.imageWidth * 2 : this.imageWidth
            this.imageTick++
        }
        // во время движения будет рисоваться то 2, то 3 картинка спрайта
        if (this.imageTick > imageTickLimit*2) this.imageTick = 0

        // персонаж неподвижен
        this.context.drawImage(
            this.image,
            // начальные координаты
            subX,
            0,
            this.imageWidth,
            this.imageHeight,
            // координаты канвас
            this.x - this.imageWidth/2,
            this.y - this.imageHeight/2,
            this.imageWidth,
            this.imageHeight,
        )
    }
    // картинка под нужным углом, чтобы персонаж всегда смотрел на курсор
    // переворачиваем весь канвас, а затем возвращаем в первоначальное состояние
    draw(){
        this.context.save()
        // угл поворота
        let angle = Math.atan2(this.cursorPosition.y - this.y, this.cursorPosition.x - this.x)
        this.context.translate(this.x, this.y)
        this.context.rotate(angle + Math.PI/2)
        this.context.translate(-this.x, -this.y)

        // отрисовка картинки и возвращение канвас в прежнее состояние
        this.drawImg()
        this.context.restore()
    }

    // логика перемещения персонажа
    update(){
        this.draw()
        this.isMoving = this.shouldMove(ALL_MOVE_KEY_CODES)
        this.updatePosition()
        this.checkPositionLimitAndUpdate()
    }
    // препятствие выхода за экран
    checkPositionLimitAndUpdate(){
        if (this.y < this.movementLimits.minY) this.y = this.movementLimits.minY
        if (this.y > this.movementLimits.maxY) this.y = this.movementLimits.maxY
        if (this.x < this.movementLimits.minX) this.x = this.movementLimits.minX
        if (this.x > this.movementLimits.maxX) this.x = this.movementLimits.maxX
    }
    updatePosition(){
        if (this.shouldMove(MOVE_UP_KEY_CODES)) this.y -= this.velocity
        if (this.shouldMove(MOVE_DOWN_KEY_CODES)) this.y += this.velocity
        if (this.shouldMove(MOVE_LEFT_KEY_CODES)) this.x -= this.velocity
        if (this.shouldMove(MOVE_RIGHT_KEY_CODES)) this.x += this.velocity
    }
    shouldMove(keys){
        return keys.some(key => this.keyMap.get(key))
    }
}
