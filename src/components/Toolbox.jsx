import React from "react";

import pencil from "../assets/tools/pencil.svg";
import circle from "../assets/tools/circle.svg";
import erase from "../assets/tools/erase.svg";
import fill from "../assets/tools/fill.svg";
import line from "../assets/tools/line.svg";
import picker from "../assets/tools/picker.svg";
import rectangle from "../assets/tools/rectangle.svg";
import brush from "../assets/tools/brush.svg";
import text from "../assets/tools/text.svg";
import airbrush from "../assets/tools/airbrush.svg";
import roundRect from "../assets/tools/roundRect.svg";
import curve from "../assets/tools/curve.png";

import fillCircle from "../assets/tools/fillCircle.svg";
import fillSquare from '../assets/tools/fillSquare.png'

const toolbarItems = [
  { name: "Picker", image: picker },
  { name: "Fill", image: fill },
  { name: "Erase", image: erase },
  { name: "Text", image: text },
  { name: "Brush", image: brush },
  { name: "Airbrush", image: airbrush },
  { name: "Pencil", image: pencil },
  { name: "Circle", image: circle },
  { name: "Line", image: line },
  { name: "Curve", image: curve },
  { name: "Rectangle", image: rectangle },
  { name: "Round Rectangle", image: roundRect },
];

const Tools = ({ changeTool, activeItem, setBrushWidth, brushWidth, density, setDensity, setBrushShape }) => {
  const drawTools = [
    "Circle",
    "Rectangle",
    "Pencil",
    "Brush",
    "Line",
    "Erase",
    "Airbrush",
    "Round Rectangle",
    "Curve"
  ];

  return (
    <div className="paint_toolbox_main">
      {toolbarItems.map((tool, index) => (
        <div
          key={index}
          className={`paint_toolbox_tool ${
            activeItem === tool.name && "paint_toolbox_tool_active"
          }`}
          onClick={() => changeTool(tool.name)}
        >
          <img
            src={tool.image}
            alt={tool.name}
            title={tool.name}
          />
        </div>
      ))}

      {drawTools.includes(activeItem) && (
        <div className="paint_toolbox_tool_options">
          <label
            htmlFor="size"
            // className=""
          >
            Size
          </label>
          <input
            id="size"
            type="range"
            value={brushWidth}
            min="1"
            max="50"
            onChange={(e) => {
              setBrushWidth(e.target.value);
            }}
          />

          {activeItem === "Brush" && (
            <div className="paint_toolbox_tool_options_brush">
              <div onClick={()=>setBrushShape('round')}>
                <img  src={fillCircle} alt="" />
              </div>
              <div onClick={()=>setBrushShape('square')} >
                <img  src={fillSquare} alt="" />
              </div>
            </div>
          )}

          {activeItem === "Airbrush" && (
            <>
              <label
                htmlFor="density"
              >
                Density
              </label>
              <input
                id="density"
                type="range"
                value={density}
                min="20"
                max="100"
                onChange={(e) => {
                  setDensity(e.target.value);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tools;
