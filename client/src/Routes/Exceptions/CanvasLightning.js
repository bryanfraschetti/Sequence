// CanvasLightning.js

/*
Copyright (c) 2024 by Jack Rugile (https://codepen.io/jackrugile/pen/kQwPRO)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React, { useEffect, useRef } from "react";

const CanvasLightning = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasLightning = (c, cw, ch) => {
      let ctx = c.getContext("2d");
      let lightning = [];
      let lightTimeCurrent = 0;
      let lightTimeTotal = 50;

      const rand = (rMi, rMa) =>
        Math.floor(Math.random() * (rMa - rMi + 1) + rMi);

      const createL = (x, y, canSpawn) => {
        lightning.push({
          x,
          y,
          xRange: rand(5, 30),
          yRange: rand(5, 25),
          path: [{ x, y }],
          pathLimit: rand(10, 35),
          canSpawn,
          hasFired: false,
        });
      };

      const updateL = () => {
        let i = lightning.length;
        while (i--) {
          let light = lightning[i];

          light.path.push({
            x:
              light.path[light.path.length - 1].x +
              (rand(0, light.xRange) - light.xRange / 2),
            y: light.path[light.path.length - 1].y + rand(0, light.yRange),
          });

          if (light.path.length > light.pathLimit) {
            lightning.splice(i, 1);
          }
          light.hasFired = true;
        }
      };

      const renderL = () => {
        ctx.clearRect(0, 0, cw, ch);

        let i = lightning.length;
        while (i--) {
          let light = lightning[i];

          ctx.strokeStyle = `rgba(255, 165, 0, ${rand(10, 100) / 100})`;
          ctx.lineWidth = 2;
          if (rand(0, 30) == 0) {
            ctx.lineWidth = 3;
          }
          if (rand(0, 60) == 0) {
            ctx.lineWidth = 4;
          }
          if (rand(0, 90) == 0) {
            ctx.lineWidth = 5;
          }
          if (rand(0, 120) == 0) {
            ctx.lineWidth = 6;
          }
          if (rand(0, 150) == 0) {
            ctx.lineWidth = 7;
          }

          ctx.beginPath();

          let pathCount = light.path.length;
          ctx.moveTo(light.x, light.y);
          for (let pc = 0; pc < pathCount; pc++) {
            ctx.lineTo(light.path[pc].x, light.path[pc].y);

            if (light.canSpawn && rand(0, 100) == 0) {
              light.canSpawn = false;
              createL(light.path[pc].x, light.path[pc].y, false);
            }
          }

          if (!light.hasFired) {
            ctx.fillStyle = `rgba(255, 68, 99, ${rand(4, 12) / 100})`;
            ctx.fillRect(0, 0, cw, ch);
          }

          if (rand(0, 30) == 0) {
            ctx.fillStyle = `rgba(255, 145, 0, ${rand(1, 3) / 100})`;
            ctx.fillRect(0, 0, cw, ch);
          }

          ctx.stroke();
        }
      };

      const lightningTimer = () => {
        lightTimeCurrent++;
        if (lightTimeCurrent >= lightTimeTotal) {
          let newX = rand(100, cw - 100);
          let newY = rand(0, ch / 2);
          let createCount = rand(1, 3);
          while (createCount--) {
            createL(newX, newY, true);
          }
          lightTimeCurrent = 0;
          lightTimeTotal = rand(30, 100);
        }
      };

      const clearCanvas = () => {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${rand(1, 30) / 100})`;
        ctx.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = "source-over";
      };

      const loop = () => {
        requestAnimationFrame(loop);
        clearCanvas();
        updateL();
        lightningTimer();
        renderL();
      };

      loop();
    };

    const canvas = canvasRef.current;
    const cw = (canvas.width = window.innerWidth);
    const ch = (canvas.height = window.innerHeight);

    if (canvas) {
      canvasLightning(canvas, cw, ch);
    }

    // Clean up function
    return () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, cw, ch);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas"></canvas>;
};

export default CanvasLightning;
