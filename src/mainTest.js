import { initShaderProgram } from "./initShaderProgram";
import { initBuffers } from "./initBuffers";
import { drawScene } from "./drawScene";



function mainTest()
{

    const vertexSource =`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main()
        {
            gl_position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `;

    const fragmentSource =`
        varying lowp vec4 vColor;
        void main()
        {
            gl_FragColor = vColor;
        }
    `;

    const canvas = document.querySelector("#game");
    const webgl = canvas.getContext("webgl");

    if(webgl === null)
    {
        console.log("cannot webgl buddy");
        return;
    }
    webgl.clearColor(0.0,0.0,0.0,1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(webgl, vertexSource, fragmentSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: webgl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: webgl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations:{
            projectionMatrix: webgl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: webgl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    const buffers = initBuffers(webgl);

    let then=0;
    function render(now)
    {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        drawScene(webgl, programInfo, buffers, cubeRotation);
        cubeRotation += deltaTime;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

mainTest();