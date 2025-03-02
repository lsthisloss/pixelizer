
import React from 'react';
const colors = [
    '#FFFFFF',
    '#000000',
    '#F78CA2',
    '#4CAF50',
    '#5CD2E6',
    '#FFD700',
    '#FF69B4',
    '#8BC34A',
    '#8A2BE2',
    '#5F9EA0'
  ];
const Palette = ({ selectedColor, setSelectedColor }) => {
  return (
    <div className="palette">
      {colors.map((color) => (
        <div
          key={color}
          className={`color-box ${color === selectedColor ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => setSelectedColor(color)}
        />
      ))}
    </div>
  );
};
export default Palette;