var Q = Quintus()
    .include("Sprites")
    .setup({maximize = true});

Q.load(["basic-background.png"], function(){
    var background = new Q.Sprite({ asset: "basic-background.png", x: Q.el.width/2, y: Q.el.height/2, type: Q.SPRITE_NONE});
    Q.gameLoop(function(dt){
        Q.clear();
    
    });
});