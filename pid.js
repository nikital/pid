"use strict";

(function() {

    ////////// DISPLAY RELATED //////////
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    ////////// PID //////////
    var x = 20;
    var y = 20;
    var vx = 0;
    var vy = 0;

    var setpointX = x;
    var setpointY = y;
    var prevErrorX = 0;
    var prevErrorY = 0;
    var integralX = 0;
    var integralY = 0;

    var kp = 1.0;
    var ki = 0.0;
    var kd = 60.0;

    function pid() {
        var errorX = setpointX - x;
        integralX += errorX;
        var derivativeX = errorX - prevErrorX;
        prevErrorX = errorX;

        var errorY = setpointY - y;
        integralY += errorY;
        var derivativeY = errorY - prevErrorY;
        prevErrorY = errorY;

        return [0.001 * (kp * errorX + ki * integralX + kd * derivativeX),
            0.001 * (kp * errorY + ki * integralY + kd * derivativeY)];
    }

    function update(time) {
        var a = pid();
        var ax = a[0];
        var ay = a[1];
        var maxA = 0.2;
        ax = Math.max(Math.min(ax, maxA), -maxA);
        ay = Math.max(Math.min(ay, maxA), -maxA);
        vx += ax;
        vy += ay;
        x += vx;
        y += vy;

        ctx.fillStyle = "#E7D492";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#7B5747";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#F77825"
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath()
        ctx.lineTo(x, y);
        ctx.lineTo(x - ax * 200, y);
        ctx.stroke();
        ctx.beginPath()
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - ay * 200);
        ctx.stroke();

        requestAnimationFrame(update);
    }

    update(0);

    ////////// CLICKS //////////
    function canvasClick(e) {
        setpointX = e.clientX;
        setpointY = e.clientY;
    }
    c.addEventListener("click", canvasClick);

})();
