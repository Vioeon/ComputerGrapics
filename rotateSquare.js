// JavaScript source code
var gl;
var theta = 0;
var thetaLoc;
var direction = true;
var Stop = false;
var delay = 100;

var length = 1.0;
var lengthLoc;

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if( !gl ){
		alert("WebGL isn't available!");
	}

	document.getElementById("DirectionButton").onclick = function(){
		direction = !direction;
	}

	document.getElementById("StopButton").onclick = function(){
		Stop = !Stop;
	}

	document.getElementById("MyMenu").onclick = function(event){
		switch(event.target.value){
			case '0':
				direction = !direction;
				break;
			case '1':
				delay *= 0.5;
				break;
			case '2':
				delay *= 2.0;
				break;
			case '3':
				length *= 1.1
				break;
			case '4':
				length *= 0.9;
				break;

		};
	}

	document.getElementById("Slider").onchange = function(event){
		delay = event.target.value;
	}

	var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
        //vec2(1, -1)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // vec 2
	gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
	lengthLoc = gl.getUniformLocation(program, "length");

    render();
};

function render(){
	
    setTimeout(function(){
        gl.clear(gl.COLOR_BUFFER_BIT);

		if(Stop){
       		 theta += 0.0;
		}
		else if(!Stop){
			theta += (direction ? 0.1 : -0.1);
		}

        gl.uniform1f(thetaLoc, theta);
		gl.uniform1f(lengthLoc, length);

	    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        window.requestAnimationFrame(render);
    }, delay);
};
