

function mainTest()
{
    const canvas = document.querySelector("#game");
    const webgl = canvas.getContext("webgl");

    if(webgl === null)
    {
        console.log("cannot webgl buddy");
        return;
    }
}