

let cubeRotation =0;
let deltaTime = 0;
let canMove = true;
function toggle()
{
    canMove  = !canMove;
};

mainTest();
function mainTest()
{
    

    const vertexSource =`
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
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
    //webgl.clearColor(0.0,0.0,0.0,1.0);
    //webgl.clear(webgl.COLOR_BUFFER_BIT);

    canvas.addEventListener('click', ()=>{
        toggle();
    });

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

        drawScene(webgl, programInfo, buffers,cubeRotation);
        if(canMove) cubeRotation += deltaTime;
        

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


function initShaderProgram(webgl, vertexSource, fragmentSource)
{
    const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fragmentSource);

    const shaderProgram = webgl.createProgram();
    webgl.attachShader(shaderProgram, vertexShader);
    webgl.attachShader(shaderProgram, fragmentShader);
    webgl.linkProgram(shaderProgram);

    if(!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS))
    {
        console.log("error initializing shader program: "+webgl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(webgl, type, source)
{
    const shader = webgl.createShader(type);

    webgl.shaderSource(shader, source);

    webgl.compileShader(shader);

    if(!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS))
    {
        console.log("Error compiling shader: "+webgl.getShaderInfoLog(shader));
        webgl.deleteShader(shader);
        return null;
    }

    return shader;
}

function drawScene(webgl, programInfo, buffers, cubeRotation)
{
    webgl.clearColor(0.0,0.0,0.0,1.0);
    webgl.clearDepth(1.0);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.depthFunc(webgl.LEQUAL);

    //cls
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180; //ew radians
    const aspect = webgl.canvas.clientWidth / webgl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glMatrix.mat4.create();

    glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    //drawing point is screen center
    const modelViewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );

    glMatrix.mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation,
        [0,0,1]
    ); //axis rotate Z

    glMatrix.mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.7,
        [0,1,0]
    ); //axis rotate Y
    
    glMatrix.mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.3,
        [1,0,0]
    ); //axis rotate X

    setPositionAttribute(webgl, buffers, programInfo);

    setColorAttribute(webgl, buffers, programInfo);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    webgl.useProgram(programInfo.program);

    webgl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );

    webgl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    {
        const vertexCount =36;
        const type = webgl.UNSIGNED_SHORT;
        const offset = 0;
        webgl.drawElements(webgl.TRIANGLES, 
            vertexCount, 
            type, 
            offset
        );
    }

}

function setPositionAttribute(webgl, buffers, programInfo)
{
    const numComponents = 3;
    const type = webgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.position);
    webgl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    webgl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(webgl, buffers, programInfo)
{
    const numComponents = 4;
    const type = webgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset =0;
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.color);
    webgl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    webgl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}


function initBuffers(webgl)
{
    const positionBuffer = initPositionBuffer(webgl);
    const colorBuffer = initColorBuffer(webgl);
    const indexBuffer = initIndexBuffer(webgl);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

function initPositionBuffer(webgl)
{
    const positionBuffer = webgl.createBuffer();

    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        //Front face
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
        
        //Back face
        -1.0, -1.0,
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
        -1.0, -1.0,
        
        //Top face
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0, 
        1.0, 1.0, 
        1.0, 1.0,
        1.0, -1.0,
        
        //Bottom face
        -1.0, -1.0,
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        
        //Right face
        1.0, -1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
        1.0, 1.0,
        -1.0, 1.0,
        
        //Left face
        -1.0, -1.0,
        -1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, -1.0,
      ];

      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);

      return positionBuffer;
}

function initColorBuffer(webgl)
{
    const faceColors=[
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red 
        [0.0, 1.0, 0.0, 1.0], // Top face: green 
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    var colors = [];

    for(var i=0; i<faceColors.length; ++i)
    {
        const c = faceColors[i];
        colors = colors.concat(c,c,c,c);
    }

    const colorBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW);
    return colorBuffer;
}

function initIndexBuffer(webgl)
{
    const indexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, //front
        4,
        5,
        6,
        4,
        6,
        7, //back
        8,
        9,
        10,
        8,
        10,
        11,  //top
        12,
        13,
        14,
        12,
        14,
        15, //bottom
        16,
        17,
        18,
        16,
        18,
        19, //right
        20,
        21,
        22,
        20,
        22,
        23, //left
    ];

    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), webgl.STATIC_DRAW);
    return indexBuffer;
};


