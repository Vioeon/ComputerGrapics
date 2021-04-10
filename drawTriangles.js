// JavaScript source code
var gl;
var points, colors;

window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");
    var colorcan = document.getElementById("colorview");//

	gl = WebGLUtils.setupWebGL(canvas);
    cgl = WebGLUtils.setupWebGL(colorcan);//

	if( !gl ){
		alert("WebGL isn't available!");
	}

	points = [];
    colors = [];

    var red = 0;
    var green = 0;
    var blue = 0;

    document.getElementById("r").onchange = function(event){
        red = parseFloat(event.target.value);
        cgl.clearColor(red, green, blue, 1.0);
        render();
    }
    document.getElementById("g").onchange = function(event){
        green = parseFloat(event.target.value);
        cgl.clearColor(red, green, blue, 1.0);
        render();
    }
    document.getElementById("b").onchange = function(event){
        blue = parseFloat(event.target.value);
        cgl.clearColor(red, green, blue, 1.0);
        render();
    }

    function colorset(R, G, B){
        return vec4(R, G, B, 1.0);
    }

    canvas.addEventListener("mousedown", function(event){

            var p = vec2(2*event.clientX/canvas.width - 1,
                2*(canvas.height-event.clientY)/canvas.height - 1);
            
            points.push(p);
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

            var c = colorset(red, green, blue);
            
            colors.push(c);
            gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

            render();
    });

	//Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    cgl.clearColor(0, 0, 0, 1.0);

	//Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

    var cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	//Associate out shader variables with our data buffer 
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

    render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length);

    cgl.clear(cgl.COLOR_BUFFER_BIT);
};
