import React from 'react';
import { AspectRatio, GenerationSettings, GridSize, ImageResolution } from '../types';
import { Sparkles, Loader2, LayoutGrid, Monitor, Maximize } from 'lucide-react';

interface ControlPanelProps {
  settings: GenerationSettings;
  isGenerating: boolean;
  isAnalyzing: boolean;
  onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  isGenerating,
  isAnalyzing,
  onSettingsChange,
  onGenerate
}) => {
  return (
    <div className="w-80 h-full border-l border-zinc-800 bg-surface flex flex-col p-5 overflow-y-auto">
      <h2 className="text-sm font-semibold text-zinc-200 mb-6 uppercase tracking-wide">Configuration</h2>

      {/* Grid Size */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 mb-2 block font-medium flex items-center gap-2">
            <LayoutGrid size={12} /> Layout
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSettingsChange({ gridSize: GridSize.Grid2x2 })}
            className={`p-3 text-sm rounded-md border transition-all ${
              settings.gridSize === GridSize.Grid2x2
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            2x2 Grid
          </button>
          <button
            onClick={() => onSettingsChange({ gridSize: GridSize.Grid3x3 })}
            className={`p-3 text-sm rounded-md border transition-all ${
              settings.gridSize === GridSize.Grid3x3
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            3x3 Grid
          </button>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 mb-2 block font-medium flex items-center gap-2">
            <Monitor size={12} /> Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(AspectRatio).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onSettingsChange({ aspectRatio: ratio })}
              className={`p-2 text-xs rounded-md border transition-all ${
                settings.aspectRatio === ratio
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 mb-2 block font-medium flex items-center gap-2">
            <Maximize size={12} /> Quality
        </label>
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {Object.values(ImageResolution).map((res) => (
            <button
              key={res}
              onClick={() => onSettingsChange({ resolution: res })}
              className={`flex-1 py-1.5 text-xs rounded-md transition-all ${
                settings.resolution === res
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="mb-6 flex-1 flex flex-col">
        <label className="text-xs text-zinc-500 mb-2 block font-medium">Scenario Directive</label>
        <textarea
          value={settings.prompt}
          onChange={(e) => onSettingsChange({ prompt: e.target.value })}
          placeholder="Describe the action sequence... e.g., 'The hero walks into a dark alley, hears a noise, turns around, and draws their laser sword.'"
          className="w-full h-full min-h-[150px] bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm text-zinc-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Action */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || isAnalyzing || !settings.prompt.trim()}
        className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg ${
          isGenerating || isAnalyzing || !settings.prompt.trim()
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primaryHover hover:to-indigo-500 shadow-primary/25'
        }`}
      >
        {isGenerating || isAnalyzing ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            {isAnalyzing ? "Analyzing Assets..." : "Rendering..."}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Board
          </>
        )}
      </button>

      {/* API Key Hint */}
      {!process.env.API_KEY && (
         <p className="mt-4 text-xs text-red-500 text-center">API Key missing in env.</p>
      )}
    </div>
  );
};

export default ControlPanel;