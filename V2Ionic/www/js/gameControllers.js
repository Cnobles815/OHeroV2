angular.module('game.controllers', [])

.controller('GameCtrl', function($scope) {

var canvas = document.getElementById('gameSpace');
var context = canvas.getContext('2d');
console.log("Hellow World.");

  $scope.runGame = function(){
      console.log("Hello again.")
    var Q = Quintus()
    .include("Sprites, Scenes, Anim, Input, 2D, Touch, UI")
    .setup(canvas);

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
            speed: 10
        });
    }
});


// Q.Sprite.extend("Projectile", {
//     init:function(p) {
//         this._super(p, {
//             asset:"",
//             type: Q.SPRITE_FRIENDLY,
//             speed: 300
//         })
//     }
// })

// Q.Projectile.extend("Beam", {
//     init:function(p) {
//         this._super(p, {
//             asset:"",
//             type: Q.SPRITE_FRIENDLY
//         })
//     }
// })


//TODO -- NEVERMIND. Remember to spell function correctly FFR
// Q.scene("level1",function(stage){
//     Q.stageTMX("level1.tmx",stage);
//     stage.add("viewport").follow(Q("Player").first());
// });

// Q.scene('endGame',function(stage){
//     var container = stage.insert(new Q.UI.Container({
//         x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
//     }));

//     var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
//                                                     label: "Play Again"}))
//     var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
//                                                 label: stage.options.label }));
//     button.on("click",function(){
//         Q.clearStages();
//         Q.stageScene('level1');
//     })
// })

Q.scene("level1",function(stage){

    stage.insert(new Q.Repeater({ asset: "/Images/basic-background.png", speedX: 0.5, speedY: 0.5, type: 0}));

    var player = stage.inser(new Q.Player());

    stage.insert(new Q.Block({ x: 50, y: -30, h: 30, w: 50}));
    
    stage.insert(new Q.Block({ x: 0, y: 0, h:50, w: 150 }));

    stage.insert(new Q.Block({
        x: 140, y: 0, h: 50, w: 100,
        points: [ [0, -15], [25,-40], [50, 0], [0,50], [-100,0] ]
    }));

    stage.insert(new Q.Block({ x: 500, y: 40, h: 50, w: 50}));

    stage.add("viewport").follow(player);

    stage.insert(new Q.Tower({ x: 500, y: 0}));
});

Q.load(["/Images/basic-background.png"], function(){
    var background = new Q.Sprite({ asset: "/Images/basic-background.png", x: Q.el.width / 2, y: Q.el.height / 2, type: Q.SPRITE_NONE});
    var player = new Q.Player();
    Q.gameLoop(function(dt){
        console.log("Hello Again.")
        Q.clear();  
        background.render(Q.ctx);
        });
	
});
};
});