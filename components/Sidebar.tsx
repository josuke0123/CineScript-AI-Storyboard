import React from 'react';
import { Upload, X, Image as ImageIcon, Film, Box } from 'lucide-react';
import { UploadedAsset } from '../types';

interface SidebarProps {
  assets: UploadedAsset[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAsset: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ assets, onUpload, onRemoveAsset }) => {
  return (
    <div className="w-80 h-full border-r border-zinc-800 bg-surface flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-primary" />
          CineScript AI
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Professional Storyboard Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-primary hover:bg-zinc-800/50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-zinc-500 group-hover:text-primary" />
              <p className="text-sm text-zinc-400 group-hover:text-white">Upload Assets</p>
              <p className="text-xs text-zinc-600">(Char, Scene, Elements)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept="image/*" 
              onChange={onUpload}
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset Library</h3>
          
          {assets.length === 0 && (
            <div className="text-center text-zinc-600 py-8 text-sm">
              No assets uploaded. <br/> Upload references to maintain style.
            </div>
          )}

          {assets.map((asset) => (
            <div key={asset.id} className="relative group bg-zinc-900 rounded-md overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors">
              <div className="aspect-video w-full overflow-hidden">
                <img src={asset.previewUrl} alt="Asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <button 
                onClick={() => onRemoveAsset(asset.id)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <X size={14} />
              </button>
              <div className="p-2 flex items-center gap-2">
                {asset.type === 'character' && <ImageIcon size={12} className="text-indigo-400"/>}
                {asset.type === 'scene' && <Box size={12} className="text-emerald-400"/>}
                <span className="text-xs text-zinc-300 truncate font-medium capitalize">{asset.type} Reference</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600">
         v1.0.0 • Powered by Gemini 3 Pro
      </div>
    </div>
  );
};

export default Sidebar;