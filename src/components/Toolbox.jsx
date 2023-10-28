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
    <div className=" bg-gray-400 w-28 grid h-fit grid-cols-2 gap-2 py-2 px-2 shadow-lg">
      {toolbarItems.map((tool, index) => (
        <div
          key={index}
          className={`w-8 h-8 col-span-1 border rounded-md border-gray-600 p-1 hover:bg-gray-500 ${
            activeItem === tool.name && "bg-gray-500"
          }`}
          onClick={() => changeTool(tool.name)}
        >
          <img
            className="w-6 h-6"
            src={tool.image}
            alt={tool.name}
            title={tool.name}
          />
        </div>
      ))}

      {drawTools.includes(activeItem) && (
        <div className="w-full space-y-2 col-span-2 h-auto border-gray-500 border-2 p-2">
          <label
            htmlFor="size"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Size
          </label>
          <input
            id="size"
            type="range"
            value={brushWidth}
            min="1"
            max="50"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            onChange={(e) => {
              setBrushWidth(e.target.value);
              console.log(e.target.value);
            }}
          />

          {activeItem === "Brush" && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 p-1 hover:bg-gray-500 " onClick={()=>setBrushShape('round')}>
                <img  src={fillCircle} alt="" />
              </div>
              <div onClick={()=>setBrushShape('square')} className="w-6 h-6 p-1 hover:bg-gray-500 ">
                <img  src={fillSquare} alt="" />
              </div>
            </div>
          )}

          {activeItem === "Airbrush" && (
            <>
              <label
                htmlFor="density"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Density
              </label>
              <input
                id="density"
                type="range"
                value={density}
                min="20"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
