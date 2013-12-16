(function(){
    // Vector Object constructor
    window.spVector = function(mag, angle){
        this.magnitude = 0;
        this.angle = 0;
        if(mag)
            this.magnitude = mag;
        if(angle)
            this.angle = angle;
    };
    
    /* entity object */
    
    window.spEntity = function(x, y){
        this.posX = 0;
        this.posY = 0;
        if(x)
            this.posX = x;
        if(y)
            this.posY = y;
    };
    
    /* engine object */
    
    // constructor
    window.spCore = function(){
        // important data variables
        this.worldWidth;
        this.worldHeight;
        this.entities = [];
        this.naturalForces = [];
    };
    
    //setWorld
    spCore.prototype.setWorld = function(width,height){
        this.worldWidth = width;
        this.worldHeight = height;
    };
    
    // engine loop begin
    spCore.prototype.startWorld = function(frames, cb){
        var that = this;
        setInterval(function(){
            return that.calc(cb);
        }, frames);
    };
    
    //math shit here
    spCore.prototype.calc = function(cb){
            // have the forces act upon the objects
            var i, j;
            for(i = 0; i < this.naturalForces.length; i++){
                var currentForce = this.naturalForces[i];
                for(j = 0; j < this.entities.length; j++){
                    var currentEntity = this.entities[j];
                    // Move the object dependinding on the force vector
                    var mag = currentForce.magnitude;
                    // Convert the angle   
                    var angle = currentForce.angle;
                    currentEntity.posY = currentEntity.posY - mag;
                }
            }
            console.log("calc cycle");
            cb();
            
    };
    
    //custom drawing function
    spCore.prototype.setDrawFunction = function(cb){
        this.drawFunction = cb;
    };
    spCore.prototype.draw = function(){
        this.drawFunction();
    };
    
})();

/* DEMO */

// Set up our HTML5 coordinate system so that it is cartesian
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.translate(0, c.height);
ctx.scale(1, -1);

// create the engine
var engine = new spCore();

// set world size
engine.setWorld(300,300);

// create gravity force vector
var gravity = new spVector(1,-90);

// load it into the engine
engine.naturalForces.push(gravity);

// create some entities and put them in the engine
var junk = new spEntity(40,200);
engine.entities.push(junk);
var junk2 = new spEntity(150,200);
engine.entities.push(junk2);

// Create a draw function
engine.setDrawFunction(function(){
    // Clear the canvas
    ctx.fillStyle="#C0C0C0";
    ctx.fillRect(0,0,300,300);
    
    // draw all the entities
    var i;
    for(i = 0; i < engine.entities.length; i++){
        var junk = engine.entities[i];  
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (junk.posX, junk.posY, 55, 50);
    }
});

// start the world at 30 frames per second
engine.startWorld(30, function(){
    engine.draw();    
});
