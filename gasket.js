// JavaScript source code
var gl;
var points;
var numPoints = 5000;

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if( !gl ){
		alert("WebGL isn't available!");
    }

    generatePoints();

	//Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // vec 2
	gl.enableVertexAttribArray(vPosition);

    render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, points.length);
};

function generatePoints(){
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v));

    points = [p];

    for(var i = 0; points.length < numPoints; i++){
        var j = Math.floor(Math.random() * 3);
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        points.push(p);
    }
}

function drawGasket(){
    numPoints = parseInt(document.getElementById("numPoints").value);

    generatePoints();

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    render();
}
