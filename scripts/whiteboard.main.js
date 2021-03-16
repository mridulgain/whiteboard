//globals
let mycanvas, ctx, dragging = false, dragStartLoc, snapshot, drawingtool;

function init(){
    mycanvas = document.querySelector("canvas");
    mouse_location_viewer = document.querySelector("span");
    //canvas properties
    ctx = mycanvas.getContext("2d");
    resize_canvas();

    //add selecting tools here
        //line
    document.querySelector("#line").addEventListener('click', () => {
        drawingtool = "line";
    }, false)
        //rectangle
    document.querySelector("#rect").addEventListener('click', () => {
        drawingtool = "rect";
    }, false)

    //events
    mycanvas.addEventListener('mousedown', dragStart, false);
    mycanvas.addEventListener('mousemove', drag, false);
    mycanvas.addEventListener('mouseup', dragStop, false);

    //show real-time mouse co-ordinates
    mycanvas.addEventListener("mousemove", (evnt) => {
        const mouse_coordinates = getMousePositionOnCanvas(evnt);
        mouse_location_viewer.innerText = `x: ${mouse_coordinates .x}, y: ${mouse_coordinates .y}`;
    }, false);
}

function getMousePositionOnCanvas(evnt){
    return {x: evnt.clientX, y: evnt.clientY};  
}

function resize_canvas(){
    takeSnapshot();
    mycanvas.height = window.innerHeight - 50;
    mycanvas.width = window.innerWidth - 35;          
    restoreSnapshot();  
}

function takeSnapshot() {
    snapshot = ctx.getImageData(0, 0, mycanvas.width, mycanvas.height);
}

function restoreSnapshot() {
    ctx.putImageData(snapshot, 0, 0);
}

function dragStart(evnt) {
    dragging = true;
    dragStartLocation = getMousePositionOnCanvas(evnt);
    takeSnapshot();
}

function drag(evnt) {
    if (dragging == true) {
        restoreSnapshot();
        position = getMousePositionOnCanvas(evnt);
        draw(position);
    }
}

function dragStop(evnt) {
    dragging = false;
    restoreSnapshot();
    var position = getMousePositionOnCanvas(evnt);
    draw(position);
}

function draw(position){
    ctx.beginPath();
    //what to draw
    switch(drawingtool){
        case "rect":
            rectangle(position);
            break;
        case "line":
            line(position);
            break;
        default:
            rectangle(position);
                break;
    }
    ctx.stroke();
}

//draw shapes
function rectangle(p){
    var rectWidth = p.x - dragStartLocation.x;
    var rectHeight = p.y - dragStartLocation.y;
    ctx.rect(dragStartLocation.x, dragStartLocation.y, rectWidth, rectHeight);
}

function line(position) {
    ctx.moveTo(dragStartLocation.x, dragStartLocation.y);
    ctx.lineTo(position.x, position.y);
}

window.addEventListener('load', init, false);
window.addEventListener('resize', resize_canvas, false);