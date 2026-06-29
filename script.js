class Example extends Phaser.Scene {
    backgroundImg
    backgroundImgBak
    
    pipes
    bird
    scoreText
    loseText
    score 
    playing
    loseSound
    highestScoreText

    preload(){
        this.load.image("backgroundImg", "assets/background.png")
        this.load.image("pipeUp", "assets/pipeUp.png")
        this.load.image("pipeDown", "assets/pipeDown.png")
        this.load.image("bird", "assets/bird.png")
        this.load.audio("jumpSound", "assets/jump_sound.mp3")
        this.load.audio("lostSound", "assets/lost_sound.mp3")
    }
    create(){
        this.backgroundImg = this.add.sprite(0, 0, "backgroundImg")
        this.backgroundImgBak = this.add.sprite(480,0, "backgroundImg")
        this.score =0 
        this.playing = true
        this.loseSound = this.sound.add("lostSound");
        
        this.backgroundImg.setOrigin(0,0)
        this.backgroundImgBak.setOrigin(0,0)
        
        this.backgroundImg.setDisplaySize(480, 320)
        this.backgroundImgBak.setDisplaySize(480, 320)

        this.pipes = this.add.group();
        this.generatePipe()

        this.bird = this.add.sprite(100, 70, "bird")
        this.physics.add.existing(this.bird) // add physics to the bird
        this.bird.setDisplaySize(40, 30)

        this.scoreText = this.add.text(this.scale.width/2, 20, "score = 0", {
            font: "18px Arial",
            color: "#ff2a2a"
        })
        this.loseText = this.add.text(this.scale.width/2, this.scale.height/2, "you lost, press enter to restart.", {
            font: "18px Arial",
            color: "#ff2a2a"
        })
        this.highestScoreText = this.add.text(this.scale.width/2, this.scale.height/2 + 20, `heighest score: ${localStorage.getItem("highest score")}`, {
            font: "20px Arial",
            color: "#326800"
        })
        this.loseText.visible = false;
        this.highestScoreText.visible = false;
        this.scoreText.setOrigin(0.5, 0)
        this.loseText.setOrigin(0.5, 0.5)
        this.highestScoreText.setOrigin(0.5, 0.5)
        this.scoreText.depth = 10
        this.loseText.depth = 10
        this.highestScoreText.depth = 10
        
    }
    update(){
        if (this.playing) {
            
            this.backgroundImg.x -= 1
            this.backgroundImgBak.x -= 1
            if (this.backgroundImg.x <= -480){this.backgroundImg.x = 0}
            if (this.backgroundImgBak.x <= 0){this.backgroundImgBak.x = 480}

            this.movePipes()
            if (this.pipes.getChildren()[this.pipes.getLength() -1].x == 310) {this.generatePipe()}
    
    this.birdFallingAnimation();
    this.jump();
}


/// increase score when passing a pipe
if (this.bird.x == this.pipes.getChildren()[0].x + 60) {
    this.score++
    this.scoreText.setText(`score = ${this.score}`)
}

if (this.bird.y > this.scale.height){
    this.loseLogic();
        }
        this.physics.collide(this.bird, this.pipes, () => {
            this.loseLogic();
        })
        if (!this.playing) {
            var enterKey = this.input.keyboard.addKey("ENTER", false, true);
            if (enterKey.isDown){
                location.reload()
            } 
        }
    }
    
    
    
    generatePipe(){
        const pipeX = 480 // constant
        const pipeUpH = 0 // constant
        const pipeDownH = 320 // constant
        const pipeWidth = 60 // constant
        const minHeight = 20 // constant
        const maxHeight = 180 // constant
        const minGap = 60 // constant
        var pipeUpHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight
        var pipeDownHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight

        while (this.scale.height - (pipeUpHeight + pipeDownHeight) <= minGap){
            pipeUpHeight -= minGap/2
            pipeDownHeight -+ minGap/2
            }
            
            
            
            
            const pipeUp = this.add.sprite(pipeX, pipeUpH, "pipeUp")
            pipeUp.setOrigin(0,0)
            pipeUp.setDisplaySize(pipeWidth, pipeUpHeight)
            
            const pipeDown = this.add.sprite(pipeX, pipeDownH - pipeDownHeight , "pipeDown")
            pipeDown.setOrigin(0,0)
            pipeDown.setDisplaySize(pipeWidth, pipeDownHeight)
            
            this.physics.add.existing(pipeUp)
            this.physics.add.existing(pipeDown)
            
            this.pipes.addMultiple([pipeUp, pipeDown])
            
    }
    movePipes(){
        const pipeSpeed = 2;
        this.pipes.getChildren().forEach((pipe) => {
            pipe.x -= pipeSpeed
            if (pipe.x < 0 - 60){
                pipe.destroy()
            }
        })
    }
    birdFallingAnimation(){
        this.bird.body.velocity.y += 20
        this.bird.angle += 1
    }
    jump(){
        var spaceKey = this.input.keyboard.addKey("SPACE", false, true);
        var isDown = false;
        if (spaceKey.isDown){
            if (this.bird.y <= 15) (this.bird.y = 15)
                else {
            this.bird.body.velocity.y = -150
            this.bird.angle = 0;
            this.sound.play("jumpSound")
        }
        spaceKey.isDown = false
    }
    
}
loseLogic(){
    if (this.score > localStorage.getItem("highest score"))   {
        localStorage.setItem("highest score", `${this.score}`)
        this.highestScoreText.setText(`highest score: ${this.score}`)
    }
    if (this.playing) {
        
        this.loseSound.play()
    }
    this.playing = false;
    this.loseText.visible = true;
    this.highestScoreText.visible = true;
        
        
    }
} 


const config ={
    type: Phaser.CANVAS,
    width: 480,
    height: 320,
    scene: Example,
    
    scale: {
        mode:Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
     },
    backgroundColor: "#000",

    physics: {
        default: "arcade"
    },
}

const game = new Phaser.Game(config);
if (!localStorage.getItem("highest score")){

    localStorage.setItem("highest score", `0`)
}