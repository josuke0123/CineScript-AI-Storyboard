import { GridSize, StoryboardFrame } from '../types';

export const sliceImageGrid = (
  imageBase64: string,
  gridSize: GridSize
): Promise<StoryboardFrame[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageBase64;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const frames: StoryboardFrame[] = [];
      const totalRows = gridSize;
      const totalCols = gridSize;
      
      const cellWidth = img.width / totalCols;
      const cellHeight = img.height / totalRows;

      // Create a canvas to do the slicing
      const canvas = document.createElement('canvas');
      canvas.width = cellWidth;
      canvas.height = cellHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Could not get 2D context"));
        return;
      }

      let frameIndex = 0;
      for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
          // Clear canvas
          ctx.clearRect(0, 0, cellWidth, cellHeight);
          
          // Draw the specific section
          ctx.drawImage(
            img,
            col * cellWidth, // source x
            row * cellHeight, // source y
            cellWidth, // source width
            cellHeight, // source height
            0, // dest x
            0, // dest y
            cellWidth, // dest width
            cellHeight // dest height
          );

          const frameUrl = canvas.toDataURL('image/png');
          frames.push({
            id: `frame-${Date.now()}-${frameIndex}`,
            imageUrl: frameUrl,
            index: frameIndex,
          });
          frameIndex++;
        }
      }
      resolve(frames);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};