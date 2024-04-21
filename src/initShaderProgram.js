function initShaderProgram(webgl, vertexSource, fragmentSource)
{
    const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER,vertexSource);
    const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fragmentSource);

    const shaderProgram = webgl.createProgram();
    webgl.attachShader(shaderProgram, vertexShader);
    webgl.attachShader(shaderProgram, fragmentShader);

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

export { initShaderProgram };


