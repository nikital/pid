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

    var history = [];
    var historyTick = 0;

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

        if (++historyTick == 5) {
            historyTick = 0;

            if (history.length >= 50) {
                history.shift();
            }
            history.push([x, y])
        }

        ctx.fillStyle = "#E7D492";
        ctx.fillRect(0, 0, c.width, c.height);

        for (var i = 0; i < history.length; ++i) {
            ctx.fillStyle = "rgba(96,185,154,"+(i/history.length)+")";
            ctx.beginPath();
            ctx.arc(history[i][0], history[i][1], 5, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }

        ctx.strokeStyle = "#60B99A";
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 14]);
        ctx.beginPath()
        ctx.moveTo(setpointX, setpointY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#7B5747";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#F77825"
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath()
        ctx.moveTo(x, y);
        ctx.lineTo(x - ax * 300, y);
        ctx.stroke();
        ctx.beginPath()
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - ay * 300);
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
