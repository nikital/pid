"use strict";

(function() {

    ////////// DISPLAY RELATED //////////
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    function resizeCanvas() {
        c.width = window.innerWidth;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    ////////// PID //////////
    var prevTime = -16;
    var x = 20;
    var vx = 0;

    var setpoint = x;
    var prevError = 0;
    var integral = 0;

    var kp = 1.0;
    var ki = 0.0;
    var kd = 80.0;

    function pid() {
        var error = setpoint - x;
        integral += error;
        var derivative = error - prevError;
        prevError = error;
        return 0.001 * (kp * error + ki * integral + kd * derivative);
    }

    function update(time) {
        var dt = time - prevTime;
        prevTime = time;

        var ax = pid(dt);
        // console.log(ax);
        ax = Math.max(Math.min(ax, 1.0), -1.0);
        vx += ax;
        // vx *= 0.99;
        x += vx;

        ctx.fillStyle = "#E7D492";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#7B5747";
        ctx.beginPath();
        ctx.arc(x, c.height / 2, 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        requestAnimationFrame(update);
    }

    update(0);

    ////////// CLICKS //////////
    function canvasClick(e) {
        setpoint = e.clientX;
        prevError = setpoint - x;
    }
    c.addEventListener("click", canvasClick);

})();
