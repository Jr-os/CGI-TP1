import * as UTILS from '../../libs/utils.js';
import * as MV from '../../libs/MV.js'
import { flatten } from "../../libs/MV.js";

/** @type {WebGLRenderingContext} */
let gl, program;
const table_width = 3.0;
const grid_spacing = 0.05;
let table_height;
let N_VERTICES;
function animate(time) {
    window.requestAnimationFrame(animate);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const width = gl.getUniformLocation(program, "width");
    const height = gl.getUniformLocation(program, "height");

    gl.uniform1f(width, table_width);
    gl.uniform1f(height, table_height);

    gl.drawArrays(gl.POINTS, 0, N_VERTICES);

}

function setup(shaders) {
    const canvas = document.getElementById("gl-canvas");

    gl = UTILS.setupWebGL(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    table_height = (table_width * canvas.height) / canvas.width;

    // resize canvas
    window.addEventListener("resize", function (event) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        table_height = canvas.height;
        table_height = (table_width * canvas.height) / canvas.width;
    });

    program = UTILS.buildProgramFromSources(gl, shaders["shader1.vert"], shaders["shader1.frag"]);


    var vertices = [];

    for (let x = -(table_width / 2); x <= (table_width / 2); x += grid_spacing) {
        for (let y = -(table_height / 2); y <= (table_height / 2); y += grid_spacing) {
            vertices.push(MV.vec2(x, y));
        }

    }

    N_VERTICES = vertices.length;

    const aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


    const vPosition = gl.getAttribLocation(program, "vPosition");


    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);




    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    window.requestAnimationFrame(animate);

    canvas.addEventListener("click", function (event) {
        // Start by getting x and y coordinates inside the canvas element
        const x = ((event.offsetX / canvas.height) * table_height) - (table_width / 2);
        const y = -((table_width * event.offsetY) / canvas.width) + (table_height / 2);

        N_VERTICES = N_VERTICES + 1;
        vertices.push(MV.vec2(x, y));
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        //console.log("Click at (" + (x*table_height)/canvas.height + ", " +(table_width*y)/canvas.width + ")");
        console.log("Click at (" + x + ", " + y + ")");
        console.log(vertices);
        window.requestAnimationFrame(animate);
    });

}






UTILS.loadShadersFromURLS(["shader1.vert", "shader1.frag"]).then(s => setup(s));
