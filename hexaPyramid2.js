// JavaScript source code
var gl;
var points = [];
var colors = [];

var axis = 0;
var theta = [0, 0, 0];
var theta1 = [0, 0, 0];
var thetaLoc;
var dist = [0, 0, 0];
var distLoc;
var trMatrixLoc;

var rotation = false;

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);

	if( !gl ){
		alert("WebGL isn't available!");
	}

    generateColorCube();
    generateHexaPyramid();

    var trball = trackball(canvas.width, canvas.height);
    var mouseDown = false;

    canvas.addEventListener("mousedown", function(event){
        trball.start(event.clientX, event.clientY);

        mouseDown = true;
    });
    canvas.addEventListener("mouseup", function(event){
        mouseDown = false;
    });
    canvas.addEventListener("mousemove", function(event){
        if(mouseDown){
            trball.end(event.clientX, event.clientY);

            gl.uniformMatrix4fv(trMatrixLoc, false, trball.rotationMatrix);
        }
    });

	//Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    
    gl.enable(gl.DEPTH_TEST);

	//Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

    var cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");
    //gl.uniform3fv(thetaLoc, theta);
    distLoc = gl.getUniformLocation(program, "dist");
    //gl.uniform3fv(distLoc, dist);
    trMatrixLoc = gl.getUniformLocation(program, "trMatrix");
    gl.uniformMatrix4fv(trMatrixLoc, false, trball.rotationMatrix);
    

    document.getElementById("xButton").onclick = function(){
        axis = 0;
    };
    document.getElementById("yButton").onclick = function(){
        axis = 1;
    };
    document.getElementById("zButton").onclick = function(){
        axis = 2;
    };
    document.getElementById("buttonT").onclick = function(){
        rotation = !rotation;
    };

    render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(rotation){
        theta[axis] += 2.0;
        theta1[axis] -= 2.0;
        
    }
    //gl.uniform3fv(thetaLoc, theta);


	//gl.drawArrays(gl.TRIANGLES, 0, points.length);

    dist[0] = -0.5;
    dist[1] = -0.5;
    gl.uniform3fv(distLoc, dist);

    
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, 36); // 큐브 그림

    dist[0] = -0.5;
    dist[1] = 0.5;
    gl.uniform3fv(distLoc, dist);

    
    gl.uniform3fv(thetaLoc, theta1);
    gl.drawArrays(gl.TRIANGLES, 36, 36);

    dist[0] = 0.5;
    dist[1] = -0.5;
    gl.uniform3fv(distLoc, dist);

    
    gl.uniform3fv(thetaLoc, theta1);
    gl.drawArrays(gl.TRIANGLES, 0, 36); // 큐브 그림

    dist[0] = 0.5;
    dist[1] = 0.5;
    gl.uniform3fv(distLoc, dist);

    
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 36, 36);

    window.requestAnimationFrame(render);
};


function generateHexaPyramid(){
    vertexPos = [
        vec4( 0.0, 0.5,    0.0, 1.0),
        vec4( 1.0, 0.5,    0.0, 1.0),
        vec4( 0.5, 0.5, -0.866, 1.0),
        vec4(-0.5, 0.5, -0.866, 1.0),
        vec4(-1.0, 0.5,    0.0, 1.0),
        vec4(-0.5, 0.5,  0.866, 1.0),
        vec4( 0.5, 0.5,  0.866, 1.0),
        vec4( 0.0,-1.0,    0.0, 1.0)
    ];

    vertexColor = [
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(1.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    ];

    for(var i = 1; i <6; i++){
        points.push(vertexPos[0]);
        colors.push(vertexColor[0]);
        points.push(vertexPos[i]);
        colors.push(vertexColor[i]);
        points.push(vertexPos[i+1]);
        colors.push(vertexColor[i+1]);
    }
    points.push(vertexPos[0]);
    colors.push(vertexColor[0]);
    points.push(vertexPos[6]);
    colors.push(vertexColor[6]);
    points.push(vertexPos[1]);
    colors.push(vertexColor[1]);

    for(var i = 1; i < 6; i++){
        points.push(vertexPos[7]);
        colors.push(vertexColor[7]);
        points.push(vertexPos[i]);
        colors.push(vertexColor[i]);
        points.push(vertexPos[i+1]);
        colors.push(vertexColor[i+1]);
    }
    points.push(vertexPos[7]);
    colors.push(vertexColor[7]);
    points.push(vertexPos[6]);
    colors.push(vertexColor[6]);
    points.push(vertexPos[1]);
    colors.push(vertexColor[1]);

}

function generateColorCube(){
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1 ,2);
}

function quad(a, b, c, d){
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0)
    ];

    vertexColor = [
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(1.0, 0.0, 1.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(0.0, 1.0, 1.0, 1.0),
    ];

    var index = [a, b, c, a, c, d];
    for(var i = 0; i<index.length; i++){
        points.push(vertexPos[index[i]]);
        colors.push(vertexColor[index[i]]);

        //colors.push(vertexColor[a]);
    }
}