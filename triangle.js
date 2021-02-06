window.onload = function () {

  var canvas=document.getElementById("canvas");
  var clearButton = document.getElementById("clear");
var context=canvas.getContext("2d");

var cw=canvas.width;
var ch=canvas.height;
    var isBeingDragged = false;
    var startCoords ;
    var endCoords ;
    var context = canvas.getContext("2d");
    var coordinates = [];
    var flag = false;
    var TriIndex = 0;
    var randomColor ;
    var changeDistance = {
        x: 0,
        y: 0
    };
    //coordinates wrt to the canvas
        function getCoordinates(canvas, event) {

            var bounds = canvas.getBoundingClientRect();
            return {

                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top

            };

        }

    function drawTriangle(mode, x1, y1, x2, y2) {

        var distance = calculateLineDistance(x1, y1, x2, y2);

        var height = 1.414 * (distance) * mode;

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1 + distance / 2, y1 + height);
        context.lineTo(x1 - distance / 2, y1 + height);
        context.moveTo(x1, y1);
        context.fillStyle = randomColor;
        context.fill();
        context.stroke();
        // coordinates.push([[start.x, start.y], [start.x + distance / 2, start.y + height * 1.25], [start.x - distance / 2, start.y + height * 1.25]]);
        coordinates.push([[x1, y1], [x1 + distance / 2, y1 + height * 1.25], [x1 - distance / 2, y1 + height * 1.25], [context.fillStyle], [distance]]);
    console.log(coordinates);
    }

//select a random fill color
    function selectColor() {
      var r = Math.round(Math.random( )*256);
 var g = Math.round(Math.random( )*256);
 var b = Math.round(Math.random( )*256);


 return 'rgb( ' + r + ',' + g + ',' + b + ')';
    }


    function calculateLineDistance(x1, y1, x2, y2) {

        return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

    }

    function findArea(x1, y1, x2, y2, x3, y3) {

        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);

    }

    function insideTriangle(pos) {

        flag = true;
        coordinates.forEach(function (position) {
            var Area = findArea(position[0][0], position[0][1], position[1][0], position[1][1], position[2][0], position[2][1]);
            var Area1 = findArea(position[0][0], position[0][1], pos.x, pos.y, position[2][0], position[2][1]);
            var Area2 = findArea(position[0][0], position[0][1], position[1][0], position[1][1], pos.x, pos.y);
            var Area3 = findArea(pos.x, pos.y, position[1][0], position[1][1], position[2][0], position[2][1]);
            if (Math.round(Area) === Math.round(Area1 + Area2 + Area3)) {
                TriIndex = coordinates.indexOf(position);
                flag = false;
                return true;
            }
        });
        return flag;

    }
    function reDrawTriangles(x1, y1, distance, color) {
        var height = 1.414 * (distance);

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1 + distance / 2, y1 + height);
        context.lineTo(x1 - distance / 2, y1 + height);
        context.moveTo(x1, y1);
        context.fillStyle = color;
        context.fill();
        context.stroke();

    }

    function doDragTranslation(newx, newy) {

        var newPos = coordinates[TriIndex];
        var differenceX = newx - newPos[0][0] + changeDistance.x;
        var differenceY = newy - newPos[0][1] + changeDistance.y;
        newPos[0][0] += differenceX;
        newPos[0][1] += differenceY;
        newPos[1][0] += differenceX;
        newPos[1][1] += differenceY;
        newPos[2][0] += differenceX;
        newPos[2][1] += differenceY;
        coordinates.splice(TriIndex, 0, newPos);
        clearCanvas();
        coordinates.forEach(function (position) {
            reDrawTriangles(position[0][0], position[0][1], position[4], position[3]);
        });

    }

//delete on double click
    canvas.addEventListener('dblclick', function (event) {

        var pos = getCoordinates(canvas, event);
        coordinates.forEach(function (position) {
            var Area = findArea(position[0][0], position[0][1], position[1][0], position[1][1], position[2][0], position[2][1]);
            var Area1 = findArea(position[0][0], position[0][1], pos.x, pos.y, position[2][0], position[2][1]);
            var Area2 = findArea(position[0][0], position[0][1], position[1][0], position[1][1], pos.x, pos.y);
            var Area3 = findArea(pos.x, pos.y, position[1][0], position[1][1], position[2][0], position[2][1]);
            if (Math.round(Area) === Math.round(Area1 + Area2 + Area3)) {
                var newList = [];
                var newPos = coordinates[coordinates.indexOf(position)];
                coordinates.forEach(function (position2) {
                    if (position2 !== newPos) {
                        newList.push(position2);
                    }
                });
                coordinates = newList;
                clearCanvas();
                coordinates.forEach(function (position2) {
                    reDrawTriangles(position2[0][0], position2[0][1], position2[4], position2[3]);
                });
                return true;
            }
        });
        isBeingDragged = false;

    });

//one mousedown listener
    canvas.addEventListener('mousedown', function (event) {
        canvas.style.cursor = 'move';
        event.preventDefault();
        var mousePos = getCoordinates(canvas, event);
        startCoords = mousePos;
        endCoords = mousePos;
        isBeingDragged = true;
        flag = insideTriangle(mousePos);
        startCoords = mousePos;
        endCoords = mousePos;
        randomColor = selectColor();
        if (coordinates.length > 0) {
            changeDistance.x = coordinates[TriIndex][0][0] - mousePos.x;
            changeDistance.y = coordinates[TriIndex][0][1] - mousePos.y
        }
        console.log(changeDistance);
    });

//movement listener
    canvas.addEventListener('mousemove', function (event) {

        endCoords = getCoordinates(canvas, event);

        if (isBeingDragged && flag) {
            clearCanvas();
            canvas.style.cursor = 'ne-resize';
            reDrawTriangles(startCoords.x, startCoords.y, calculateLineDistance(startCoords.x, startCoords.y, endCoords.x, endCoords.y), randomColor);
            coordinates.forEach(function (position) {
                reDrawTriangles(position[0][0], position[0][1], position[4], position[3]);
            });
        } else if (isBeingDragged) {
            canvas.style.cursor = 'crosshair';
            clearCanvas();
            // doDragTranslationAtMove(endCoords.x, endCoords.y);
            var newPos = coordinates[TriIndex];
            var differenceX = endCoords.x - newPos[0][0] + changeDistance.x;
            var differenceY = endCoords.y - newPos[0][1] + changeDistance.y;
            newPos[0][0] += differenceX;
            newPos[0][1] += differenceY;
            newPos[1][0] += differenceX;
            newPos[1][1] += differenceY;
            newPos[2][0] += differenceX;
            newPos[2][1] += differenceY;
            reDrawTriangles(newPos[0][0], newPos[0][1], newPos[4], newPos[3]);
            coordinates.forEach(function (position) {
                if (position[0][0] !== startCoords.x && position[0][1] !== startCoords.y) {
                    reDrawTriangles(position[0][0], position[0][1], position[4], position[3]);
                }
            });
        }

    }, true);

//event-listener for mouseUp
    canvas.addEventListener('mouseup', function (event) {
        canvas.style.cursor = 'pointer';
        var mousePos = getCoordinates(canvas, event);
        if (!flag) {
            isBeingDragged = false;
            flag = false;
            doDragTranslation(mousePos.x, mousePos.y);
        } else if (isBeingDragged && calculateLineDistance(startCoords.x, startCoords.y, endCoords.x, endCoords.y) > 2) {
            isBeingDragged = false;
            flag = false;

            endCoords = mousePos;
            drawTriangle(1, startCoords.x, startCoords.y, endCoords.x, endCoords.y);
        }

    });


clearButton.addEventListener('click', function () {

    coordinates = [];
    clearCanvas();

});
    function clearCanvas( ){
    context.clearRect(0,0,canvas.width, canvas.height);
    }

};
