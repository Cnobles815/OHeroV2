angular.module('game.controllers', [])

.controller('GameCtrl', function($scope) {

var canvas = document.getElementById('gameSpace');
var context = canvas.getContext('2d');
console.log("Hellow World.");

  $scope.runGame = function(){
      console.log("Hello again.")


    var Q = Quintus()
    .include("Sprites, Scenes, Anim, 2D, UI, Input, Touch, Audio")
    .setup(canvas)
    .enableSound()
    .controls();

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

var SPRITE_NONE = 0;
var SPRITE_FRIENDLY = 1;
var SPRITE_FLOOR = 2;

Q.Sprite.extend("Floor") , {
    init:function(p) {
        this._super(p, {
            sprite:"floor",
            x: Q.el.width / 2,
            y: Q.el.height / 2,
            type: Q.SPRITE_FRIENDLY,
            collisionMask: SPRITE_FLOOR
        })
    }
}

Q.Sprite.extend("Player", {
    init:function(p) {
        this._super(p, {
            sprite:"player",
            x: Q.el.width / 2,
            y: Q.el.height - 60,
            type: Q.SPRITE_FRIENDLY,
            collisionMask: SPRITE_FRIENDLY,
            speed: 15
        });
        this.add("animation");
        this.play("default");
        this.add("2d");
    },
    step: function(dt) {
        if(Q.inputs['left'])
            this.p.x -= this.p.speed;
        if(Q.inputs['right'])
            this.p.x += this.p.speed;
        if(Q.inputs['up'])
            this.p.y -= this.p.speed;
        if(Q.inputs['down'])
            this.p.y += this.p.speed;
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
Q.scene("level1",function(stage){
    console.log("Stage check.");
    var player = stage.insert(new Q.Player());

    //var background = new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex: 0, sheet: 'tiles', tileW: 70, tileH: 70, type: Q.SPRITE_NONE});

    //Q.gravity = 1;

    //stage.insert(background);

    //stage.collisionLayer(new Q.TileLayer({ dataAsset: '/Images/level1T.tmx', layerIndex:1, sheet: 'tiles', tileW: 70, tileH: 70, type: Q.SPRITE_FLOOR}));

    stage.insert(new Q.Sprite({ asset: "/Images/basic-background.png", x: Q.el.width / 2, y: Q.el.height / 2, type: Q.SPRITE_NONE}));

    stage.insert(new Q.Player({ asset: "/Images/playerSpriteTest.png"}));

    stage.collisionLayer(new Q.Floor({ asset: '/Images/level1T.tmx', layerIndex:1, sheet: 'tiles', tileW:70, tileH: 70, type: Q.SPRITE_FLOOR }));
    stage.add("viewport").follow(player);
});

Q.load(["/Images/basic-background.png", "/Images/tiles_map.png", "/Images/playerSpriteTest.png", "/Images/level1T.tmx"], function(){
    Q.animations("player", {default: {frames: [0, 1, 2, 3], rate: 1/4} });
    Q.sheet("tiles", "/Images/tiles_map.png", {tilew: 70, tileh: 70});
    Q.stageScene("level1");
	
});
};
});