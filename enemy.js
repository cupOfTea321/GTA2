export class Enemy{
    constructor(canvasWidth, canvasHeight, context, player) {
        this.context = context
        this.player = player

        this.radius = 15
        // рандомный спаун рандом
        if (Math.random() < 0.5){
            this.x = Math.random() < 0.5 ? 0 - this.radius : canvasWidth + this.radius
            this.y = Math.random() * canvasHeight
        } else{
            this.x = Math.random() * canvasWidth
            this.y = Math.random() < 0.5 ? 0 - this.radius : canvasHeight + this.radius
        }
        this.image = new Image()
        this.image.src = './img/enemy_1.png'
        this.imageWidth = 50
        this.imageHeight = 60
        this.imageTick = 0
    }
    drawImg(){
        const imageTickLimit = 10
        const subX = this.imageTick > imageTickLimit ? this.imageWidth : 0
        this.imageTick++
        if (this.imageTick > imageTickLimit * 2) this.imageTick = 0
        this.context.drawImage(
            this.image,
            subX,
            0,
            this.imageWidth,
            this.imageHeight,
            this.x - this.imageWidth/2,
            this.y - this.imageHeight/2,
            this.imageWidth,
            this.imageHeight
        )
    }
    draw(){
        this.context.save()
        let angle = Math.atan2(this.y - this.player.y, this.x - this.player.x)
        this.context.translate(this.x, this.y)
        this.context.rotate(angle, Math.PI/2)
        this.context.translate(-this.x, -this.y)
        this.drawImg()
        this.context.restore()
    }
}
