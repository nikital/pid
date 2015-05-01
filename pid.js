"use strict";

(function() {

    ////////// DISPLAY RELATED //////////
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    function resizeCanvas() {
        c.width = window.innerWidth;
        // c.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    ////////// PID //////////
    var prevTime = -16;
    var x = 20;
    var setpoint = x;

    function pid(dt) {
        x += (setpoint - x) * 0.1;
    }

    function update(time) {
        var dt = time - prevTime;
        prevTime = time;

        pid(dt);

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
    }
    c.addEventListener("click", canvasClick);

})();
