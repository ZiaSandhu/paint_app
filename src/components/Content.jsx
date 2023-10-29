import React, { useState, useRef, useEffect } from "react";

import Toolbox from "./Toolbox";
import Actions from "./Actions";
import ColorBox from "./ColorBox";

import './style.css'

function Content({ width = 400, height = 400 }) {

  const pattern = /^[a-zA-Z0-9!@#$%^&*()_+,\-./:;'"<>\[\]{}?|\\ ]$/;

  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);

  const [activeItem, setActiveItem] = useState("Pencil");
  const [color, setColor] = useState("black");
  const [brushWidth, setBrushWidth] = useState(1);
  const [density, setDensity] = useState(20);
  const [brushShape, setBrushShape] = useState("butt");
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [mouseMoved, setMouseMoved] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [offSetX, setOffSetX] = useState(0);
  const [offSetY, setOffSetY] = useState(0);

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [snapShot, setSnapShot] = useState(null);

  const [curve, setCurve] = useState({
    isCurve: false,
    clickCount: 0,
    start: { x: 0, y: 0 },
    mid1: { x: 0, y: 0 },
    mid2: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  });

const [curvePoints, setCurvePoints] = useState([])
  const [prevCanvas, setPrevCanvas] = useState(null);

  const [text, setText] = useState(false);
  const [textCursor, setTextCursor] = useState(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    const canvasRect = canvas.getBoundingClientRect();
    // ctx.current.fillStyle = "#fff";
    // ctx.current.fillRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );
    setOffSetX(canvasRect.left);
    setOffSetY(canvasRect.top);
    // document.addEventListener("keydown", handleKeyPress);
  }, []);

  function handleMouseDown(e) {
    setIsDrawing(true);
    ctx.current.beginPath();

    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = brushWidth;

    if (activeItem === "Brush") {
      ctx.current.lineCap = brushShape;
    }

    setStartX(e.clientX - offSetX);
    setStartY(e.clientY - offSetY);

    if (activeItem === "Curve" && !curve.isCurve) {
      setCurvePoints(prev => [...prev,{x:startX,y:startY}])
      setCurve((prev) => {
        return {
          ...prev,
          isCurve: true,
          start: { x: e.clientX - offSetX, y: e.clientY - offSetY },
        };
      });
      setPrevCanvas(
        ctx.current.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
      );
    }

    setSnapShot(
      ctx.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    );
  }
  function handleMouseMove(e) {
    if (!isDrawing) return;

    setMouseMoved(true);
    if (activeItem !== "Airbrush") ctx.current.putImageData(snapShot, 0, 0);

    if (
      activeItem === "Pencil" ||
      activeItem === "Brush" ||
      activeItem === "Erase"
    ) {
      ctx.current.strokeStyle = activeItem === "Erase" ? "#fff" : color;
      ctx.current.lineTo(e.clientX - offSetX, e.clientY - offSetY);
      ctx.current.stroke();
    }

    if (activeItem === "Line") {
      drawLine(e);
    }

    if (activeItem === "Curve") {
      const [endX, endY] = [e.clientX - offSetX, e.clientY - offSetY];
      setCurve((prev) => {
        return {
          ...prev,
          mid1: { x: endX, y: endY },
          mid2: { x: endX, y: endY },
          end: { x: endX, y: endY },
        };
      });
      drawCurve(startX, startY, endX, endY, endX, endY, endX, endY);
    }

    if (activeItem === "Rectangle") {
      drawRect(e);
    }
    if (activeItem === "Round Rectangle") {
      drawRoundedRect(e);
    }

    if (activeItem === "Circle") {
      drawCircle(e);
    }

    if (activeItem === "Airbrush") {
      spray(e);
    }
  }
  function handleMouseUp(e) {
    if (!isDrawing) return;

    if(activeItem === 'Curve'){
      setCurvePoints(prev => [...prev, {x:e.clientX, y:e.clientY}])
    }

    setIsDrawing(false);
    const canvas = ctx.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    if (index + 1 === history.length) {
      setHistory((prev) => [...prev, canvas]);
      setIndex((prev) => prev + 1);
    } else {
      let prevHistory = history;
      let startIndex = index + 1;
      let endIndex = history.length;

      prevHistory.splice(startIndex, endIndex - startIndex + 1);
      setHistory([...prevHistory, canvas]);
      setIndex((prev) => prev + 1);
    }
  }

  function handleMouseOut() {
    setIsDrawing(false);
  }

  function handleClick(e) {
    if (activeItem === "Picker") {
      pickColor(e);
    }
    if (activeItem === "Curve" && curve.clickCount >= 0) {
      const [x, y] = [e.clientX - offSetX, e.clientY - offSetY];
      setCurve((prev) => {
        return {
          ...prev,
          clickCount: 1,
        };
      });
      if (curve.clickCount === 1) {
        setCurve((prev) => {
          return {
            ...prev,
            mid1: { x, y },
          };
        });

        ctx.current.putImageData(prevCanvas, 0, 0);

        drawCurve(
          curve.start.x,
          curve.start.y,
          x,
          y,
          curve.mid2.x,
          curve.mid2.y,
          curve.end.x,
          curve.end.y
        );
        setCurve((prev) => {
          return {
            ...prev,
            clickCount: 2,
          };
        });
      } else if (curve.clickCount === 2) {
        setCurve((prev) => {
          return {
            ...prev,
            mid1: { x, y },
          };
        });

        ctx.current.putImageData(prevCanvas, 0, 0);

        drawCurve(
          curve.start.x,
          curve.start.y,
          curve.mid1.x,
          curve.mid1.y,
          x,
          y,
          curve.end.x,
          curve.end.y
        );
        setCurve((prev) => {
          return {
            ...prev,
            isCurve: false,
            clickCount: 0,
            start: { x: 0, y: 0 },
            mid1: { x: 0, y: 0 },
            mid2: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
          };
        });
        setPrevCanvas(null);
      }
    }
    if (activeItem === "Fill") {
      console.log("fill bucket");
      let x = startX,
        y = startY;
      let { r, b, g } = hexToRgb(color);

      draw_fill_without_pattern_support(
        canvasRef.current,
        ctx.current,
        x,
        y,
        r,
        g,
        b,
        255
      );
    }
    if (activeItem === "Text") {
      setText(true);
      setTextCursor(startX);
    }
  }

  function handleKeyDown(e) {

    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      undo()
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
      redo()
    }

    if(e.key === ' '){
      e.preventDefault()
    }

    if (text && activeItem === "Text") {
      if (e.key === "Enter") {
        setTextCursor(startX);
        setStartY(prev => prev + 20)
      } else if(pattern.test(e.key)) {
        ctx.current.fillStyle = color
        ctx.current.font = "16px Arial";
        ctx.current.fillText(e.key, textCursor, startY);
        setTextCursor((prev) => prev + ctx.current.measureText(e.key).width);
      }
    }
  }
  function drawCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
    ctx.current.beginPath();
    ctx.current.moveTo(x0, y0);
    // Set both control points to the same position as the end point
    ctx.current.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    ctx.current.stroke();
    // console.log()
    ctx.current.closePath();
  }

  function drawLine(e) {
    ctx.current.beginPath();
    ctx.current.moveTo(startX, startY);
    ctx.current.lineTo(e.clientX - offSetX, e.clientY - offSetY);
    ctx.current.stroke();
    ctx.current.closePath();
  }

  function spray(event) {
    const radius = brushWidth; // Adjust the radius as needed
    // const density = 40; // Adjust the density as needed

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;

      const x = event.clientX - offSetX + Math.cos(angle) * distance;
      const y = event.clientY - offSetY + Math.sin(angle) * distance;

      // const x = event.clientX - offSetX + (Math.random() * 2 - 1) * radius;
      // const y = event.clientY - offSetY + (Math.random() * 2 - 1) * radius;
      ctx.current.fillStyle = color;
      ctx.current.fillRect(x, y, 1, 1);
      ctx.current.stroke();
    }
  }

  function drawRect(e) {
    const width = e.clientX - offSetX - startX;
    const height = e.clientY - offSetY - startY;
    ctx.current.strokeRect(startX, startY, width, height);
  }
  function drawRoundedRect(e, radius = 10) {
    const width = e.clientX - offSetX - startX;
    const height = e.clientY - offSetY - startY;
    ctx.current.beginPath();
    ctx.current.moveTo(startX + radius, startY);
    ctx.current.lineTo(startX + width - radius, startY);
    ctx.current.quadraticCurveTo(
      startX + width,
      startY,
      startX + width,
      startY + radius
    );
    ctx.current.lineTo(startX + width, startY + height - radius);
    ctx.current.quadraticCurveTo(
      startX + width,
      startY + height,
      startX + width - radius,
      startY + height
    );
    ctx.current.lineTo(startX + radius, startY + height);
    ctx.current.quadraticCurveTo(
      startX,
      startY + height,
      startX,
      startY + height - radius
    );
    ctx.current.lineTo(startX, startY + radius);
    ctx.current.quadraticCurveTo(startX, startY, startX + radius, startY);
    ctx.current.closePath();
    ctx.current.stroke();
  }

  function drawCircle(e) {
    const currentX = e.clientX - offSetX;
    const currentY = e.clientY - offSetY;

    ctx.current.beginPath();
    // const radius = Math.sqrt(
    //   Math.pow( currentX - startX, 2) + Math.pow( currentY - startY, 2)
    // );
    // ctx.current.arc(startX, startY, radius, 0, 2 * Math.PI);

    const width = currentX - startX;
    const height = currentY - startY;

    ctx.current.ellipse(
      startX,
      startY,
      Math.abs(width),
      Math.abs(height),
      0,
      0,
      2 * Math.PI
    );

    ctx.current.closePath();
    ctx.current.stroke();
  }

  function clearCanvas() {
    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setStartX(0);
    setStartY(0);
    setSnapShot(null);
  }

  function undo() {
    if (index === -1) return;

    if (index === 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setIndex((prev) => prev - 1);
    } else {
      let prevIndex = index - 1;
      setIndex((prev) => prev - 1);
      ctx.current.putImageData(history[prevIndex], 0, 0);
    }
  }
  function redo() {
    if (index + 1 === history.length) return;

    let nextIndex = index + 1;
    setIndex((prev) => prev + 1);
    ctx.current.putImageData(history[nextIndex], 0, 0);
  }

  function pickColor(e) {
    setIsDrawing(false);
    if (activeItem === "Picker") {
      const x = e.clientX - offSetX;
      const y = e.clientY - offSetY;
      const pixel = ctx.current.getImageData(x, y, 1, 1);
      const data = pixel.data;

      let hexColor = rgbaToHex(data[0], data[1], data[2], data[3]);
      setColor(hexColor);
      setActiveItem("Brush");
    }
  }
  function hexToRgb(hex) {
    // Remove the hash character if it exists
    hex = hex.replace(/^#/, "");

    // Parse the hex color into its RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  }
  function rgbaToHex(r, g, b, a) {
    // Ensure that the values are within the valid range
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    a = Math.min(1, Math.max(0, a));

    // Convert the RGB components to hexadecimal format
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");
    const aHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");

    // Combine the components to form the hex color
    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  function handleToolChange(tool) {
    setActiveItem(tool);
  }

  function handleSizeChange(size) {
    setBrushWidth(size);
  }

  function changeForegroundColor(color) {
    setColor(color);
  }

  return (
    <div className="paint_main">
      <div className="paint_top">
        <div className="paint_toolbox_container">
          <Toolbox
            brushWidth={brushWidth}
            setBrushWidth={setBrushWidth}
            activeItem={activeItem}
            changeTool={handleToolChange}
            density={density}
            setDensity={setDensity}
            brushShape={brushShape}
            setBrushShape={setBrushShape}
          />
          <Actions
            clearCanvas={clearCanvas}
            handleRedo={redo}
            handleUndo={undo}
          />
        </div>
        <div
          className="shadow-inset paint_canvas_container"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <canvas
            className="paint_canvas"
            width={`${width}px`}
            height={`${height}px`}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onMouseOut={handleMouseOut}
          />
        </div>
      </div>
      <div className="paint_colorbox_container">
        <ColorBox handleChange={changeForegroundColor} color={color} />
      </div>
    </div>
  );
}

export default Content;

function draw_fill_without_pattern_support(
  canvas,
  ctx,
  start_x,
  start_y,
  fill_r,
  fill_g,
  fill_b,
  fill_a
) {
  const fill_threshold = 1;
  const c_width = canvas.width;
  const c_height = canvas.height;
  start_x = Math.max(0, Math.min(Math.floor(start_x), c_width));
  start_y = Math.max(0, Math.min(Math.floor(start_y), c_height));
  const stack = [[start_x, start_y]];
  const id = ctx.getImageData(0, 0, c_width, c_height);
  let pixel_pos = (start_y * c_width + start_x) * 4;
  const start_r = id.data[pixel_pos + 0];
  const start_g = id.data[pixel_pos + 1];
  const start_b = id.data[pixel_pos + 2];
  const start_a = id.data[pixel_pos + 3];

  if (
    Math.abs(fill_r - start_r) <= fill_threshold &&
    Math.abs(fill_g - start_g) <= fill_threshold &&
    Math.abs(fill_b - start_b) <= fill_threshold &&
    Math.abs(fill_a - start_a) <= fill_threshold
  ) {
    return;
  }

  while (stack.length) {
    let new_pos;
    let x;
    let y;
    let reach_left;
    let reach_right;
    new_pos = stack.pop();
    x = new_pos[0];
    y = new_pos[1];

    pixel_pos = (y * c_width + x) * 4;
    while (should_fill_at(pixel_pos)) {
      y--;
      pixel_pos = (y * c_width + x) * 4;
    }
    reach_left = false;
    reach_right = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      y++;
      pixel_pos = (y * c_width + x) * 4;

      if (!(y < c_height && should_fill_at(pixel_pos))) {
        break;
      }

      do_fill_at(pixel_pos);

      if (x > 0) {
        if (should_fill_at(pixel_pos - 4)) {
          if (!reach_left) {
            stack.push([x - 1, y]);
            reach_left = true;
          }
        } else if (reach_left) {
          reach_left = false;
        }
      }

      if (x < c_width - 1) {
        if (should_fill_at(pixel_pos + 4)) {
          if (!reach_right) {
            stack.push([x + 1, y]);
            reach_right = true;
          }
        } else if (reach_right) {
          reach_right = false;
        }
      }

      pixel_pos += c_width * 4;
    }
  }
  ctx.putImageData(id, 0, 0);

  function should_fill_at(pixel_pos) {
    return (
      // matches start color (i.e. region to fill)
      Math.abs(id.data[pixel_pos + 0] - start_r) <= fill_threshold &&
      Math.abs(id.data[pixel_pos + 1] - start_g) <= fill_threshold &&
      Math.abs(id.data[pixel_pos + 2] - start_b) <= fill_threshold &&
      Math.abs(id.data[pixel_pos + 3] - start_a) <= fill_threshold
    );
  }

  function do_fill_at(pixel_pos) {
    id.data[pixel_pos + 0] = fill_r;
    id.data[pixel_pos + 1] = fill_g;
    id.data[pixel_pos + 2] = fill_b;
    id.data[pixel_pos + 3] = fill_a;
  }
}
