import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import StoryboardViewer from './components/StoryboardViewer';
import { AssetUploader } from './components/AssetUploader'; // Helper unused directly but logic moved to sidebar
import { 
  AspectRatio, 
  GenerationSettings, 
  GridSize, 
  ImageResolution, 
  StoryboardResult, 
  UploadedAsset 
} from './types';
import { analyzeAssets, generateStoryboardImage } from './services/geminiService';
import { sliceImageGrid } from './utils/imageSlicer';

const App: React.FC = () => {
  // State
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    gridSize: GridSize.Grid2x2,
    aspectRatio: AspectRatio.Landscape,
    resolution: ImageResolution.Res1K,
    prompt: '',
  });
  const [storyboardResult, setStoryboardResult] = useState<StoryboardResult | null>(null);
  
  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAssets: UploadedAsset[] = Array.from(e.target.files).map(file => ({
        id: `asset-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: 'character', // Default, could be selectable
      }));
      setAssets(prev => [...prev, ...newAssets]);
    }
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleSettingsChange = (newSettings: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleGenerate = async () => {
    setError(null);
    try {
      // 1. Analyze Assets (if any)
      let contextDescription = "";
      if (assets.length > 0) {
        setIsAnalyzing(true);
        contextDescription = await analyzeAssets(assets);
        setIsAnalyzing(false);
      }

      // 2. Generate Image
      setIsGenerating(true);
      const generatedImageBase64 = await generateStoryboardImage(
        settings.prompt,
        contextDescription,
        {
          gridSize: settings.gridSize,
          aspectRatio: settings.aspectRatio,
          resolution: settings.resolution
        }
      );

      // 3. Slice Image
      const frames = await sliceImageGrid(generatedImageBase64, settings.gridSize);

      setStoryboardResult({
        originalImage: generatedImageBase64,
        frames: frames,
        promptUsed: settings.prompt
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-zinc-200 font-sans">
      {/* Left Sidebar: Assets */}
      <Sidebar 
        assets={assets} 
        onUpload={handleFileUpload} 
        onRemoveAsset={handleRemoveAsset} 
      />

      {/* Center: Viewer */}
      <div className="flex-1 flex flex-col relative">
        {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-md z-50 text-sm shadow-lg backdrop-blur">
                Error: {error}
            </div>
        )}
        <StoryboardViewer 
            result={storyboardResult} 
            isGenerating={isGenerating || isAnalyzing} 
        />
      </div>

      {/* Right Sidebar: Controls */}
      <ControlPanel 
        settings={settings} 
        isGenerating={isGenerating}
        isAnalyzing={isAnalyzing}
        onSettingsChange={handleSettingsChange}
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default App;