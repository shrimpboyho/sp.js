(function(){
    // Vector Object constructor
    window.spVector = function(mag, angle){
        this.magnitude = 0;
        this.angle = 0;
        this.acceleration = 0;
        if(mag)
            this.magnitude = mag;
        if(angle)
            this.angle = angle;
    };
    
    /* entity object */
    
    window.spEntity = function(x, y){
        this.topLeftX = 0;
        this.topLeftY = 0;
        this.topRightX = 0;
        this.topRightY = 0;
        this.bottomLeftX = 0;
        this.bottomLeftY = 0;
        this.bottomRightX = 0;
        this.bottomRightY = 0;
        this.posX = 0;
        this.posY = 0;
        this.forces = [];
        if(x)
            this.posX = x;
        if(y)
            this.posY = y;
    };
    spEntity.prototype.move = function(xoffset, yoffset){
        this.topLeftX += xoffset;
        this.topLeftY += yoffset;
        this.topRightX += xoffset;
        this.topRightY += yoffset;
        this.bottomLeftX += xoffset;
        this.bottomLeftY += yoffset;
        this.bottomRightX += xoffset;
        this.bottomRightY += yoffset;
        this.posX += xoffset;
        this.posY += yoffset;
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
            // have the natural forces act upon the objects
            var i, j, k;
            for(i = 0; i < this.naturalForces.length; i++){
                var currentForce = this.naturalForces[i];
                for(j = 0; j < this.entities.length; j++){
                    var currentEntity = this.entities[j];
                    
                    // Determine the x and y components of the vector
                    if(currentForce.acceleration)
                        currentForce.magnitude += currentForce.acceleration;
                    var mag = currentForce.magnitude;
                    var angle = currentForce.angle;
                    var xcomp = Math.cos(angle) * mag;
                    var ycomp = Math.sin(angle) * mag;
                    
                    console.log("Y COMP OF GRAVITY");
                    console.log(ycomp);
                    
                    // Move the object depending on the force vector
                    currentEntity.move(xcomp, 0);
                    currentEntity.move(0, ycomp);
                    
                    // Apply the internal forces
                    for(k = 0; k < currentEntity.forces.length; k++){
                        var currentForceInner = currentEntity.forces[k]; 
                        
                        // Determine the x and y components of the vector
                        var mag = currentForceInner.magnitude;
                        var angle = currentForceInner.angle;
                        var xcomp = Math.cos(angle) * mag;
                        var ycomp = Math.sin(angle) * mag;
                    
                        // Move the object dependinding on the force vector
                        currentEntity.move(xcomp, ycomp);
                            
                    };                    
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
var gravity = new spVector(2,3 * Math.PI / 2);
gravity.acceleration = .30;
var thrust = new spVector(5, Math.PI / 3);

// load the natural forces into the engine
engine.naturalForces.push(gravity);

// create some entities and put them in the engine
var junk = new spEntity(40,200);
junk.bottomLeftX = 30;
junk.bottomLeftY = 190;
junk.forces.push(thrust);
engine.entities.push(junk);
var junk2 = new spEntity(150,200);
junk2.bottomLeftX = 140;
junk2.bottomLeftY = 190;
engine.entities.push(junk2);
var ground = new spEntity(150,10)
ground.bottomLeftX = 0;
ground.bottomLeftY = 0;
ground.bottomRightX = 300;
ground.bottomRightY = 0;
ground.topLeftX = 0;
ground.topLeftY = 20;
ground.topLeftX = 300;
ground.topLeftY = 20;
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
        ctx.fillRect (junk.posX, junk.posY, 50, 50);
        ctx.fillStyle = "rgb(0,200,0)";
        ctx.fillRect (ground.bottomLeftX, ground.bottomLeftY, 300, 20);
    }
});

// start the world at 30 frames per second
engine.startWorld(30, function(){
    engine.draw();    
});
