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
    <div className=" paint_toolbox_action_main">
      {actionsList.map((tool, index) => (
        <div
          key={index}
          className={`paint_toolbox_action`}
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
        className={`paint_toolbox_clear`}
        onClick={clearCanvas}
      >
        <img
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