import React, { useRef, useEffect } from 'react';

function OscillatingCircle() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 700; // Set canvas width to 700 pixels
        canvas.height = 200; // Set canvas height to a fixed value, adjust as needed

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

            const baseSize = 20; // Adjust the base size to make it smaller
            const amplitude = 5; // Adjust the amplitude to control oscillation
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
