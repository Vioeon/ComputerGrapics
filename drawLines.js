// JavaScript source code
var gl;
var points, colors;

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if( !gl ){
		alert("WebGL isn't available!");
	}

	points = [];
    colors = [];
    var redraw = false;
    var colorArray = [
        vec4(0.0, 0.0, 0.0, 1.0), // black
        vec4(1.0, 0.0, 0.0, 1.0), // red
        vec4(1.0, 1.0, 0.0, 1.0), // yellow
        vec4(0.0, 1.0, 0.0, 1.0), // green
        vec4(0.0, 0.0, 1.0, 1.0), // blue
        vec4(1.0, 0.0, 1.0, 1.0), // magenta  
        vec4(0.0, 1.0, 1.0, 1.0), // cyan
        
    ];
    var cIndex = 0;

    document.getElementById("colors").onclick = function(event){
        cIndex = event.target.value;
    }

    canvas.addEventListener("mousedown", function(event){
        if(!redraw){
            var p = vec2(2*event.clientX/canvas.width - 1,
                2*(canvas.height-event.clientY)/canvas.height - 1);
            points.push(p);
            points.push(p);
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

            var c = colorArray[cIndex];
            colors.push(c);
            colors.push(c);
            gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        }
        redraw = true;
    });

    canvas.addEventListener("mouseup", function(event){
        redraw = false;
    });

    canvas.addEventListener("mousemove", function(event){
        if(redraw){
            var p = vec2(2*event.clientX/canvas.width - 1,
                2*(canvas.height-event.clientY)/canvas.height - 1);
            points.pop();
            points.push(p);
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

            render();
        }
    });


	//Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.9, 0.9, 0.9, 1.0);

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

    //var fColor = gl.getUniformLocation(program, "fColor");
    //gl.uniform4f(fColor, 1.0, 0.0, 0.0, 1.0);

    var cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0); // vec 2
	gl.enableVertexAttribArray(vColor);

    var locPointSize = gl.getUniformLocation(program, "pointSize");
    gl.uniform1f(locPointSize, 5.0);

    document.getElementById("pointSize").onchange = function(){
        var size = this.value;
        gl.uniform1f(locPointSize, size);
        render();
    }

    render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.LINES, 0, points.length);
};
