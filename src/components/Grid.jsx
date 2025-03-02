import React from 'react';

const Grid = ({ grid, updatePixel, pixelSize = 30 }) => {
  const [isDrawing, setIsDrawing] = React.useState(false);

  const handleMouseDown = (rowIndex, colIndex) => {
    updatePixel(rowIndex, colIndex);
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const gridElement = e.currentTarget;
    const rect = gridElement.getBoundingClientRect();
    
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    if (x >= 0 && x < grid.length && y >= 0 && y < grid.length) {
      updatePixel(y, x);
    }
  };

  return (
    <div 
      className="grid"
      style={{ width: grid.length * pixelSize, height: grid.length * pixelSize }}
      onMouseDown={(e) => handleMouseDown(
        Math.floor(e.nativeEvent.clientY / pixelSize),
        Math.floor(e.nativeEvent.clientX / pixelSize)
      )}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((color, colIndex) => (
            <div
              key={colIndex}
              className="grid-pixel"
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color,
                border: '1px solid #ccc'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;