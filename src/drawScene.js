function drawScene(webgl, programInfo, buffers, cubeRotation)
{
    webgl.clearColor(0.0,0.0,0.0,1.0);
    webgl.clearDepth(1.0);
    webgl.enable(gl.DEPTH_TEST);
    webgl.depthFunc(webgl.LEQUAL);

    //cls
    webgl.clear(gl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

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
    globalThis.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
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
    globalThis.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export {drawScene};