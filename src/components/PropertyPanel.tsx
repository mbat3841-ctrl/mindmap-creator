import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { CustomNode, CustomEdge } from '../types';
import { X, Palette, Type, ListOrdered as BorderAll } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: CustomNode | null;
  selectedEdge: CustomEdge | null;
  onUpdateNode: (id: string, updates: Partial<CustomNode['data']>) => void;
  onUpdateEdge: (id: string, updates: Partial<CustomEdge>) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onClose,
}) => {
  const [activeColorPicker, setActiveColorPicker] = React.useState<string | null>(null);
  const colorPickerRef = React.useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setActiveColorPicker(null);
      }
    };

    if (activeColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeColorPicker]);

  if (!selectedNode && !selectedEdge) return null;

  const handleNodeUpdate = (updates: Partial<CustomNode['data']>) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, updates);
      // Save to history after a short delay
      setTimeout(() => {
        const event = new CustomEvent('saveToHistory');
        window.dispatchEvent(event);
      }, 300);
    }
  };

  const handleEdgeUpdate = (updates: Partial<CustomEdge>) => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, updates);
      // Save to history after a short delay
      setTimeout(() => {
        const event = new CustomEvent('saveToHistory');
        window.dispatchEvent(event);
      }, 300);
    }
  };

  const ColorPickerSection = ({ 
    title, 
    color, 
    onChange, 
    pickerId 
  }: { 
    title: string; 
    color: string; 
    onChange: (color: string) => void; 
    pickerId: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </label>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: color }}
          onClick={() => setActiveColorPicker(activeColorPicker === pickerId ? null : pickerId)}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="#000000"
        />
      </div>
      {activeColorPicker === pickerId && (
        <div className="mt-3 relative" ref={colorPickerRef}>
          <div className="absolute z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setActiveColorPicker(null)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 lg:fixed lg:right-0 lg:top-0 lg:inset-x-auto h-1/2 lg:h-full w-full lg:w-80 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 shadow-lg z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedNode ? 'Node Properties' : 'Edge Properties'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {selectedNode && (
          <>
            {/* Label Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Type size={16} className="mr-2" />
                Label
              </label>
              <textarea
                value={selectedNode.data.label}
                onChange={(e) => handleNodeUpdate({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter node label..."
              />
            </div>

            {/* Colors Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <Palette size={16} className="mr-2" />
                Colors
              </h4>
              
              <div className="space-y-4">
                <ColorPickerSection
                  title="Text Color"
                  color={selectedNode.data.color}
                  onChange={(color) => handleNodeUpdate({ color })}
                  pickerId="text-color"
                />
                
                <ColorPickerSection
                  title="Background Color"
                  color={selectedNode.data.backgroundColor}
                  onChange={(color) => handleNodeUpdate({ backgroundColor: color })}
                  pickerId="bg-color"
                />
                
                <ColorPickerSection
                  title="Border Color"
                  color={selectedNode.data.borderColor}
                  onChange={(color) => handleNodeUpdate({ borderColor: color })}
                  pickerId="border-color"
                />
              </div>
            </div>

            {/* Typography Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <Type size={16} className="mr-2" />
                Typography
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {selectedNode.data.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="32"
                    value={selectedNode.data.fontSize}
                    onChange={(e) => handleNodeUpdate({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>10px</span>
                    <span>32px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Weight
                  </label>
                  <select
                    value={selectedNode.data.fontWeight}
                    onChange={(e) => handleNodeUpdate({ fontWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="300">Light</option>
                    <option value="normal">Normal</option>
                    <option value="600">Semi Bold</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Border Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <BorderAll size={16} className="mr-2" />
                Border
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Width: {selectedNode.data.borderWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={selectedNode.data.borderWidth}
                  onChange={(e) => handleNodeUpdate({ borderWidth: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0px</span>
                  <span>8px</span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedEdge && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Edge Properties
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Edge Type
                  </label>
                  <select
                    value={selectedEdge.type || 'default'}
                    onChange={(e) => handleEdgeUpdate({ type: e.target.value as 'straight' | 'curved' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="straight">Straight</option>
                    <option value="smoothstep">Smooth Step</option>
                    <option value="step">Step</option>
                  </select>
                </div>

                <ColorPickerSection
                  title="Edge Color"
                  color={selectedEdge.style?.stroke || '#6B7280'}
                  onChange={(color) => handleEdgeUpdate({ 
                    style: { ...selectedEdge.style, stroke: color },
                    markerEnd: { ...selectedEdge.markerEnd, color }
                  })}
                  pickerId="edge-color"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stroke Width: {selectedEdge.style?.strokeWidth || 2}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={selectedEdge.style?.strokeWidth || 2}
                    onChange={(e) => handleEdgeUpdate({
                      style: { ...selectedEdge.style, strokeWidth: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1px</span>
                    <span>8px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Line Style
                  </label>
                  <select
                    value={selectedEdge.style?.strokeDasharray ? 'dashed' : 'solid'}
                    onChange={(e) => handleEdgeUpdate({
                      style: { 
                        ...selectedEdge.style, 
                        strokeDasharray: e.target.value === 'dashed' ? '8,8' : undefined 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};