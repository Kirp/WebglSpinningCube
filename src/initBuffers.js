
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

    webgl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

      webgl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);

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
    webgl.bindBuffer(webl.ARRAY_BUFFER, colorBuffer);
    webgl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW);
    return colorBuffer;
}

function initIndexBuffer(webgl)
{
    const indexBuffer = webgl.createBuffer();
    webgl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

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


export {initBuffers};