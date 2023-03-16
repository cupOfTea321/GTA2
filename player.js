export class Player{
    constructor(x, y, context) {
        this.x = x
        this.y = y
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

        this.image = new Image()
        this.image.src = "./img/player.png"
        this.imageWidth = 50
        this.imageHeight = 60
    }

    // начальная отрисовка персонажа
    drawImg(){
        // персонаж неподвижен
        this.context.drawImage(
            this.image,
            // начальные координаты
            0,
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
}
