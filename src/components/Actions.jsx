import React from 'react'

import undo from '../assets/tools/undo.svg'
import redo from '../assets/tools/redo.svg'
import clear from '../assets/tools/clear.svg'


const Actions = ({clearCanvas, handleUndo,handleRedo}) => {
  const actionsList = [
    { name: "Undo", image: undo, onclick: handleUndo },
    { name: "Redo", image: redo, onclick: handleRedo },
  ];

  return (
    <div className=" bg-gray-400  w-28 flex h-fit flex-wrap gap-5 py-2 px-2 shadow-lg">
      {actionsList.map((tool, index) => (
        <div
          key={index}
          className={`w-8h-8 p-1 border rounded-md border-gray-600 hover:bg-gray-400`}
          onClick={tool.onclick}
        >
          <img
            className="w-6 h-6 "
            src={tool.image}
            alt={tool.name}
            title={tool.name}
          />
        </div>
      ))}
      <div
        className={`w-full h-8 p-1 flex items-center justify-center gap-2 bg-red-500 text-gray-900 border  rounded-md border-gray-600 hover:bg-red-500/50`}
        onClick={clearCanvas}
      >
        <img
          className="w-6 h-6"
          src={clear}
          alt="clear"
          title="Clear Canvas"
        />
        <p>Clear</p>
      </div>
    </div>
  );
}

  export default Actions