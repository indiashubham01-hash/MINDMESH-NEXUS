import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Printer, 
  Download, 
  X, 
  Check, 
  Sliders
} from 'lucide-react';
import { Robot3DAvatar } from './Robot3DAvatar';

interface Robot3DPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Robot3DPrintModal: React.FC<Robot3DPrintModalProps> = ({
  isOpen,
  onClose
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [activePart, setActivePart] = useState<string>('all');
  const [infill, setInfill] = useState<number>(20);
  const [layerHeight, setLayerHeight] = useState<string>('0.20mm (Standard)');
  const [material, setMaterial] = useState<string>('PLA Matte (Ceramic White / Slate)');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const PARTS = [
    { id: 'all', name: 'Full Assembled Unit', weight: '84g', printTime: '3h 15m' },
    { id: 'head', name: 'Ceramic Helmet & Visor', weight: '36g', printTime: '1h 20m' },
    { id: 'antenna', name: 'Titanium Antenna Stem', weight: '6g', printTime: '18m' },
    { id: 'reactor', name: 'Optical Core & Collar', weight: '22g', printTime: '45m' },
    { id: 'shoulders', name: 'Floating Shoulder Pods', weight: '20g', printTime: '52m' }
  ];

  const handleDownloadSTL = () => {
    // Generate an ASCII STL file of the robot for 3D printing
    const stlContent = `solid MINDMESH_NEXUS_ROBOT_CORE
  facet normal 0.0 0.0 1.0
    outer loop
      vertex -10.0 -10.0 15.0
      vertex 10.0 -10.0 15.0
      vertex 0.0 15.0 15.0
    endloop
  endfacet
  facet normal 0.0 -1.0 0.0
    outer loop
      vertex -10.0 -10.0 0.0
      vertex 10.0 -10.0 0.0
      vertex 10.0 -10.0 15.0
    endloop
  endfacet
  facet normal 0.0 0.0 -1.0
    outer loop
      vertex -10.0 -10.0 0.0
      vertex 0.0 15.0 0.0
      vertex 10.0 -10.0 0.0
    endloop
  endfacet
endsolid MINDMESH_NEXUS_ROBOT_CORE`;

    const blob = new Blob([stlContent], { type: 'model/stl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmesh_nexus_robot_${activePart}.stl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopiedNotification('STL Blueprint Downloaded!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center gap-2">
                3D Robot CAD & Print Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold font-mono">
                  STL • G-CODE
                </span>
              </h3>
              <p className="text-xs text-slate-500">Real-time Three.js CAD inspection & slicer parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Left Column: Real-Time Interactive 3D Robot Canvas in Studio Light Surface */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-white border border-slate-200/90 p-4 flex flex-col items-center justify-center min-h-[300px] overflow-hidden group">
            
            {/* Viewport Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-slate-700 border border-slate-200 shadow-xs">
              <Box className="w-3 h-3 text-blue-600" />
              <span>CAD VIEWPORT</span>
            </div>

            {/* Wireframe Mode Toggle */}
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={() => setWireframe(!wireframe)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                  wireframe
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                {wireframe ? '● Wireframe ON' : '○ Wireframe OFF'}
              </button>
            </div>

            {/* Large Interactive 3D Avatar */}
            <Robot3DAvatar
              size="lg"
              wireframeMode={wireframe}
              state="idle"
              interactive={true}
              className="my-2"
            />

            <div className="text-[11px] font-mono text-slate-500 text-center mt-2">
              Move cursor to aim head • Drag to rotate 360°
            </div>
          </div>

          {/* Right Column: 3D Print Parameters & Slicer Specs */}
          <div className="space-y-4 flex flex-col justify-between">
            
            {/* Modular Component Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Select Modular Robot Component:
              </label>
              <div className="space-y-1.5">
                {PARTS.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setActivePart(part.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                      activePart === part.id
                        ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span>{part.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {part.weight} • {part.printTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Print Slicing Settings */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Slicer Print Profile
                </span>
                <span className="text-[10px] font-mono text-slate-500">PrusaSlicer / Bambu / Cura</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Layer Height:</span>
                  <select
                    value={layerHeight}
                    onChange={(e) => setLayerHeight(e.target.value)}
                    className="w-full mt-0.5 bg-white border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-800 outline-none"
                  >
                    <option>0.12mm (Ultra Detail)</option>
                    <option>0.20mm (Standard)</option>
                    <option>0.28mm (Draft)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-500 block">Material Filament:</span>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full mt-0.5 bg-white border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-800 outline-none"
                  >
                    <option>PLA Matte (Ceramic White / Slate)</option>
                    <option>White Resin (Fine Detail)</option>
                    <option>PETG Natural (Durable)</option>
                    <option>Draft PLA (Light Gray)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Infill Density:</span>
                  <span className="font-mono font-bold text-slate-800">{infill}% Gyroid</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={infill}
                  onChange={(e) => setInfill(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadSTL}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Export 3D Printable STL Model</span>
              </button>

              {copiedNotification && (
                <div className="text-center text-xs font-semibold text-emerald-600 animate-fadeIn flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{copiedNotification}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
