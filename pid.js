"use strict";

(function() {

    var prevTime = -16;

    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function update(time) {
        var dt = time - prevTime;
        prevTime = time;

        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, c.width, c.height);

        requestAnimationFrame(update);
    }

    update(0);

})();
