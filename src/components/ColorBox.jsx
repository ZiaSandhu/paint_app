const colors = [
  "#000000", // Black
  "#808080", // Dark Gray
  "#800000", // Dark Red
  "#808000", // Pea Green
  "#008000", // Dark Green
  "#008080", // Slate
  "#000080", // Dark Blue
  "#800080", // Lavender
  "#808040",
  "#004040",
  "#0080FF",
  "#004080",
  "#4000FF",
  "#804000",

  "#FFFFFF", // White
  "#C0C0C0", // Light Gray
  "#FF0000", // Bright Red
  "#FFFF00", // Yellow
  "#00FF00", // Bright Green
  "#00FFFF", // Cyan
  "#0000FF", // Bright Blue
  "#FF00FF", // Magenta
  "#FFFF80",
  "#00FF80",
  "#80FFFF",
  "#8080FF",
  "#FF0080",
  "#FF8040",
];

  
  const ColorBox = ({handleChange, color}) => {

    const selectedColor = {
      backgroundColor: color
    }

    return (
      <div className=" paint_colorbox_main">
        <div style={selectedColor} className={`paint_colorbox_selectedcolor `}> </div>
        <div className="paint_colorbox">
          {colors.map((colorCode, index) => (
            <div
              key={index}
              style={{ backgroundColor: colorCode}}
              onClick={() => handleChange(colorCode)}
              className={`paint_colorbox_color`}
            />
          ))}
        </div>
      </div>
    );
  }
  
  export default ColorBox