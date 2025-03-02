// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import Palette from './components/Pallete';
import Grid from './components/Grid';

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
const GRID_SIZE = 32;
const PIXEL_SIZE = 30

function App() {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [gridSize, setGridSize] = useState(16);
  const [grid, setGrid] = useState(Array(gridSize).fill().map(() => Array(gridSize).fill('#FFFFFF')));
  const [history, setHistory] = useState([grid]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pixelSize, setPixelSize] = useState(20);

  const updatePixel = (rowIndex, colIndex) => {
    if (rowIndex < 0 || rowIndex >= gridSize || colIndex < 0 || colIndex >= gridSize) {
      return;
    }
    
    const newGrid = grid.map(row => [...row]);
    newGrid[rowIndex][colIndex] = selectedColor;
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newGrid);
    setHistory(newHistory);
    setCurrentIndex(currentIndex + 1);
    setGrid(newGrid);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setGrid(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGrid(history[currentIndex + 1]);
    }
  };

  const handleClear = () => {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill('#FFFFFF'));
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newGrid);
    setHistory(newHistory);
    setCurrentIndex(currentIndex + 1);
    setGrid(newGrid);
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement('canvas');
      const nonEmptyPixels = grid.some(row => row.some(pixel => pixel !== '#FFFFFF'));
      
      if (!nonEmptyPixels) {
        alert('empty');
        return;
      }

      // Находим границы рисунка
      let minX = gridSize - 1;
      let maxX = 0;
      let minY = gridSize - 1;
      let maxY = 0;

      grid.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel !== '#FFFFFF') {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        });
      });

      const padding = 10;
      const width = (maxX - minX + 1) * pixelSize + (padding * 2);
      const height = (maxY - minY + 1) * pixelSize + (padding * 2);

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      grid.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color !== '#FFFFFF') {
            ctx.fillStyle = color;
            ctx.fillRect(
              (x - minX) * pixelSize + padding,
              (y - minY) * pixelSize + padding,
              pixelSize,
              pixelSize
            );
          }
        });
      });

      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);

      alert('copied!');
    } catch (error) {
      console.error('err', error);
      alert('err');
    }
  };

  const handleGridSizeChange = (e) => {
    const newGridSize = parseInt(e.target.value);
    const newGrid = Array(newGridSize).fill().map(() => Array(newGridSize).fill('#FFFFFF'));
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newGrid);
    setHistory(newHistory);
    setCurrentIndex(currentIndex + 1);
    setGrid(newGrid);
    setGridSize(newGridSize);
  };

  const handlePixelSizeChange = (e) => {
    setPixelSize(parseInt(e.target.value));
  };

  return (
    <div className="container">
      <div className="controls">
        <button onClick={handleUndo} disabled={currentIndex <= 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={currentIndex >= history.length - 1}>
          Redo
        </button>
        <button onClick={handleClear}>
          Clear
        </button>
        <button onClick={handleDownload}>
          Copy
        </button>
      </div>

      <div className="settings">
        <div className="setting-item">
          <label>grid: {gridSize}x{gridSize}</label>
          <input 
            type="range" 
            min="10" 
            max="15" 
            value={gridSize}
            onChange={handleGridSizeChange}
          />
          <label> pixel: {pixelSize}px</label>
          <input 
            type="range" 
            min="20" 
            max="40" 
            value={pixelSize}
            onChange={handlePixelSizeChange}
          />
        </div>
      </div>

      <Palette 
        selectedColor={selectedColor} 
        setSelectedColor={setSelectedColor} 
      />
      
      <Grid 
        grid={grid} 
        setGrid={setGrid} 
        selectedColor={selectedColor}
        updatePixel={updatePixel}
        pixelSize={pixelSize}
      />


    </div>
  );
}

export default App;