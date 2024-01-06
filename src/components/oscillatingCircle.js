import React, { useRef, useEffect } from 'react';

function OscillatingCircle() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let one = 1;

        function cycles(num) {
            return num;
        }

        function increment(previousState, steps) {
            return (previousState + 1 / steps) % 1;
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            one = increment(one, 2000);

            const baseSize = 50;
            const amplitude = 15;
            const frequency = Math.sin(cycles(one) * Math.PI * 2);
            const size = baseSize + amplitude * frequency;

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, size, 0, 2 * Math.PI);
            ctx.fill();

            requestAnimationFrame(draw);
        }

        draw();
    }, []);

    return <canvas ref={canvasRef}></canvas>;
}

export default OscillatingCircle;
