//COMO HE DICHO EN EL LABORATORIO, ESTA PARTE ESTA BASADO EN EL SOURCE CODE DE WEBGL TUTORIAL EN YOUTUBE: 
//TUTORIAL: https://www.youtube.com/watch?v=3yLL9ADo-ko
//SOURCE CODE: https://github.com/sessamekesh/IndigoCS-webgl-tutorials/tree/master/02%20-%20Rotating%20Cube
//Lo he transformado en prisma hexagonal.

var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var gl;

var InitDemo = function () {

	var canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	var boxVertices = 
	[ // X, Y, Z           R, G, B
		
		// Front
		0.866, 0.5, 1.0,    1.0, 1.0, 0.15, 	//0
		0.0, 1.0, 1.0,    1.0, 1.0, 0.15,		//1
		-0.866, 0.5, 1.0,    1.0, 1.0, 0.15, 	//2
		-0.866, -0.5, 1.0,    1.0, 1.0, 0.15, 	//3
		0.0, -1.0, 1.0,    1.0, 1.0, 0.15, 		//4
		0.866, -0.5, 1.0,    1.0, 1.0, 0.15, 	//5

		// Back
		0.866, 0.5, -1.0,    1.0, 0.0, 0.15,	 //6
		0.0, 1.0, -1.0,    1.0, 0.0, 0.15,		//7
		-0.866, 0.5, -1.0,    1.0, 0.0, 0.15,	//8
		-0.866, -0.5, -1.0,    1.0, 0.0, 0.15,	//9
		0.0, -1.0, -1.0,    1.0, 0.0, 0.15,		//10
		0.866, -0.5, -1.0,    1.0, 0.0, 0.15,	//11

		// 0 6 7 1
		0.866, 0.5, 1.0,    0.0, 0.0, 0.0, 	//0
		0.866, 0.5, -1.0,    0.0, 0.0, 0.0,	 //6
		0.0, 1.0, -1.0,    0.0, 0.0, 0.0,		//7
		0.0, 1.0, 1.0,    0.0, 0.0, 0.0,		//1

		// 1 7 8 2
		0.0, 1.0, 1.0,    1.0, 1.0, 1.0,		//1
		0.0, 1.0, -1.0,    1.0, 1.0, 1.0,		//7
		-0.866, 0.5, -1.0,    1.0, 1.0, 1.0,	//8
		-0.866, 0.5, 1.0,    1.0, 1.0, 1.0, 	//2

		// 2 8 9 3
		-0.866, 0.5, 1.0,    0.5, 0.5, 0.5, 	//2
		-0.866, 0.5, -1.0,    0.5, 0.5, 0.5,	//8
		-0.866, -0.5, -1.0,    0.5, 0.5, 0.5,	//9
		-0.866, -0.5, 1.0,    0.5, 0.5, 0.5, 	//3

		// 3 9 10 4
		-0.866, -0.5, 1.0,    0.0, 0.5, 0.0, 	//3
		-0.866, -0.5, -1.0,    0.0, 0.5, 0.0,	//9
		0.0, -1.0, -1.0,    0.0, 0.5, 0.0,		//10
		0.0, -1.0, 1.0,    0.0, 0.5, 0.0, 		//4

		// 4 10 11 5
		0.0, -1.0, 1.0,    0.5, 0.0, 0.15, 		//4
		0.0, -1.0, -1.0,    0.5, 0.0, 0.15,		//10
		0.866, -0.5, -1.0,    0.5, 0.0, 0.15,	//11
		0.866, -0.5, 1.0,    0.5, 0.0, 0.15, 	//5

		// 5 11 6 0
		0.866, -0.5, 1.0,    0.5, 0.5, 0.15, 	//5
		0.866, -0.5, -1.0,    0.5, 0.5, 0.15,	//11
		0.866, 0.5, -1.0,    0.5, 0.5, 0.15,	 //6
		0.866, 0.5, 1.0,    0.5, 0.5, 0.15	//0	
	];

	var boxIndices =
	[

		// Front
		0, 1, 2,
		0, 2, 3,
		0, 3, 4,
		0, 4, 5,

		// Back
		6, 7, 8,
		6, 8, 9,
		6, 9, 10,
		6, 10, 11,

		// 0 6 7 1
		12, 15, 14,
		12, 14, 13,

		// 1 7 8 2
		16, 19, 18,
		16, 18, 17,

		// 2 8 9 3
		20, 23, 22,
		20, 22, 21,

		//24 3 9 10 4
		24, 27, 26,
		24, 26, 25,

		//28 4 10 11 5
		28, 31, 30,
		28, 30, 29,

		//32 5 11 6 0
		32, 35, 34,
		32, 34, 33
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);

	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0); //(out, fovy, aspect, near, far)

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


//LA PARTE DE ROTATION ESTA BASADO EN EL TUTORIAL DE https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm
	 /*================= Mouse events ======================*/

         var drag = false;
         var old_x, old_y;
         var dX = 0, dY = 0;
         var THETA=0;
         var PHI=0;

         var mouseDown = function(e) {	//e is the short var reference for event object which will be passed to event handlers.
            drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
            return false;
         };

         var mouseUp = function(e){
            drag = false;
         };

         var mouseMove = function(e) {
            if (!drag) return false;
            dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
            dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
            THETA+= dX;
            PHI+=dY;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
         };

         canvas.addEventListener("mousedown", mouseDown, false);
         canvas.addEventListener("mouseup", mouseUp, false);
         canvas.addEventListener("mouseout", mouseUp, false);
         canvas.addEventListener("mousemove", mouseMove, false);
/////////////////////////////////////////////////////////////////////////

//AQUI OTRA VEZ BASADO EN EL SOURCE CODE:
// https://github.com/sessamekesh/IndigoCS-webgl-tutorials/tree/master/02%20-%20Rotating%20Cube
//HE CAMBIADO PARA QUE EL MOVIMIENTO DE LA PRISMA NO SE PARE.

	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angleX = 0;
	var angleY=0;
	var loop = function () {
		 if (!drag) {
           THETA+=dX, PHI+=dY;
        }

		angleX = THETA;
		angleY = PHI;
		var xRotationMatrix = new Float32Array(16);
		var yRotationMatrix = new Float32Array(16);
		mat4.rotateX(yRotationMatrix, identityMatrix, -angleY);
		mat4.rotateY(xRotationMatrix, identityMatrix, angleX);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};