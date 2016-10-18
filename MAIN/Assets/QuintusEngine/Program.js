var Q = Quintus()
    .include("Sprites, Scenes")
    .setup({maximize : true})

Q.Sprite.extend("Enemy", {
    init: function(p) {
        this._super(p, {sheet: 'enemy', vx: 100, visibleOnly: true});

        this.add('2d, aiBounce');
        //TODO -- Need to add projectile collision (Firearm/Focus etc)
        //TODO -- Figure out how the hell shield/barrier are going to work. Stick sprite to Player?
        //TODO -- Refactor collision to reduce health rather than instantly kill.
        this.on("bump.left,bump.right,bump.bottom", function(collision){
            if(collision.obj.isA("Player")) {
                Q.stageScene("endGame",1,{ label: "You Died"});
                collision.obj.destroy();
            }
            if(collision.obj.isA("Projectile")) {
                this.destroy();
                collision.obj.p.vy = -300;
            }
        });

        this.on("bump.top",function(collision) {
            if(collision.obj.isA("Player")) {
                this.destroy();
                collision.obj.p.vy = -300;
            }
        });

    }
});

Q.Sprite.extend("Player", {
    init:function(p) {
        this._super(p, {
            asset:"",
            x: Q.el.width / 2,
            y: Q.el.height - 60,
            type: Q.SPRITE_FRIENDLY,
            //speed: 10
        });
    }
});

Q.Sprite.extend("Projectile", {
    init:function(p) {
        this._super(p, {
            asset:"",
            type: Q.SPRITE_FRIENDLY,
            speed: 300
        })
    }
})

Q.Projectile.extend("Beam", {
    init:function(p) {
        this._super(p, {
            asset:"",
            type: Q.SPRITE_FRIENDLY,
            speed: 300
        })
    }
})

//TODO -- NEVERMIND. Remember to spell function correctly FFR
Q.scene("level1",function(stage){
    Q.stageTMX("level1.tmx",stage);
    stage.add("viewport").follow(Q("Player").first());
});

Q.scene('endGame',function(stage){
    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));

    var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                    label: "Play Again"}))
    var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
                                                label: stage.options.label }));
    button.on("click",function(){
        Q.clearStages();
        Q.stageScene('level1');
    })
})

Q.load(["/Users/christophernobles/Dev/OHeroV2/MAIN/Assets/Images/basic-background.png"], function(){
    var background = new Q.Sprite({ asset: "/Users/christophernobles/Dev/OHeroV2/MAIN/Assets/Images/basic-background.png", x: Q.el.width / 2, y: Q.el.height / 2, type: Q.SPRITE_NONE});
    var player = new Q.Player();
    Q.gameLoop(function(dt){
        Q.clear();  
        background.render(Q.ctx);
        //player.render(Q.ctx);

    });
});