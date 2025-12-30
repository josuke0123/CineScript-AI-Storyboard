import React, { useState } from 'react';
import { StoryboardResult, GridSize } from '../types';
import { Download, ZoomIn } from 'lucide-react';

interface StoryboardViewerProps {
  result: StoryboardResult | null;
  isGenerating: boolean;
}

const StoryboardViewer: React.FC<StoryboardViewerProps> = ({ result, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'frames'>('grid');

  if (isGenerating) {
    return (
      <div className="flex-1 h-full bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-light text-white animate-pulse">Generating Cinematic Sequence</h3>
        <p className="text-sm text-zinc-500 mt-2">Gemini 3 Pro is directing your shot...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 h-full bg-background flex flex-col items-center justify-center p-12 text-zinc-600">
        <div className="w-32 h-32 border-2 border-dashed border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-4xl opacity-20">🎬</span>
        </div>
        <p className="text-lg">Ready to visualize.</p>
        <p className="text-sm opacity-60">Upload assets and enter a prompt to begin.</p>
      </div>
    );
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 h-full bg-background flex flex-col overflow-hidden relative">
      {/* Viewer Header / Tabs */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between bg-background/50 backdrop-blur-sm z-10">
        <div className="flex gap-4">
            <button 
                onClick={() => setActiveTab('grid')}
                className={`text-sm font-medium pb-4 border-b-2 transition-colors ${activeTab === 'grid' ? 'text-white border-primary' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
            >
                Master Sheet
            </button>
            <button 
                onClick={() => setActiveTab('frames')}
                className={`text-sm font-medium pb-4 border-b-2 transition-colors ${activeTab === 'frames' ? 'text-white border-primary' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
            >
                Individual Frames
            </button>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => handleDownload(result.originalImage, `storyboard-master-${Date.now()}.png`)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
            >
                <Download size={14} /> Download Master
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        
        {activeTab === 'grid' && (
             <div className="relative group shadow-2xl shadow-black/50 max-w-full max-h-full">
                <img 
                    src={result.originalImage} 
                    alt="Master Storyboard" 
                    className="max-h-[80vh] object-contain rounded-sm border-4 border-white/10"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-xs flex items-center gap-2">
                        <ZoomIn size={14} /> Full Resolution
                    </span>
                </div>
             </div>
        )}

        {activeTab === 'frames' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {result.frames.map((frame, i) => (
                    <div key={frame.id} className="bg-surface rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all group">
                        <div className="aspect-video bg-black relative">
                            <img src={frame.imageUrl} alt={`Frame ${i+1}`} className="w-full h-full object-cover" />
                             <button 
                                onClick={() => handleDownload(frame.imageUrl, `frame-${i+1}.png`)}
                                className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                            >
                                <Download size={14} />
                            </button>
                            <span className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                                SHOT 0{i+1}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default StoryboardViewer;