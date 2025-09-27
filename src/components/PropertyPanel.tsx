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

  // Close color picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeColorPicker && !(event.target as Element).closest('.color-picker-container')) {
        setActiveColorPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeColorPicker]);

  if (!selectedNode && !selectedEdge) return null;

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
          className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setActiveColorPicker(activeColorPicker === pickerId ? null : pickerId)}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {activeColorPicker === pickerId && (
        <div className="mt-2 relative color-picker-container">
          <div className="absolute z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 lg:fixed lg:right-0 lg:top-0 lg:inset-x-auto h-1/2 lg:h-full w-full lg:w-80 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 shadow-lg z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {selectedNode ? 'Node Properties' : 'Edge Properties'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded lg:block"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {selectedNode && (
          <>
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Type size={16} className="inline mr-1" />
                Label
              </label>
              <textarea
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                onBlur={() => {
                  // Save to history when done editing
                  setTimeout(() => {
                    const event = new CustomEvent('saveToHistory');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Palette size={16} className="mr-1" />
                Colors
              </h4>
              
              <ColorPickerSection
                title="Text Color"
                color={selectedNode.data.color}
                onChange={(color) => onUpdateNode(selectedNode.id, { color })}
                pickerId="text-color"
              />
              
              <ColorPickerSection
                title="Background Color"
                color={selectedNode.data.backgroundColor}
                onChange={(color) => onUpdateNode(selectedNode.id, { backgroundColor: color })}
                pickerId="bg-color"
              />
              
              <ColorPickerSection
                title="Border Color"
                color={selectedNode.data.borderColor}
                onChange={(color) => onUpdateNode(selectedNode.id, { borderColor: color })}
                pickerId="border-color"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Type size={16} className="mr-1" />
                Typography
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={selectedNode.data.fontSize}
                  onChange={(e) => onUpdateNode(selectedNode.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedNode.data.fontSize}px
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Weight
                </label>
                <select
                  value={selectedNode.data.fontWeight}
                  onChange={(e) => onUpdateNode(selectedNode.id, { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="600">Semi Bold</option>
                  <option value="300">Light</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <BorderAll size={16} className="mr-1" />
                Border
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Width
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={selectedNode.data.borderWidth}
                  onChange={(e) => onUpdateNode(selectedNode.id, { borderWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedNode.data.borderWidth}px
                </div>
              </div>
            </div>
          </>
        )}

        {selectedEdge && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Edge Properties
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Edge Type
                </label>
                <select
                  value={selectedEdge.type}
                  onChange={(e) => onUpdateEdge(selectedEdge.id, { type: e.target.value as 'straight' | 'curved' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="straight">Straight</option>
                  <option value="curved">Curved</option>
                </select>
              </div>

              <ColorPickerSection
                title="Edge Color"
                color={selectedEdge.style?.stroke || '#6B7280'}
                onChange={(color) => onUpdateEdge(selectedEdge.id, { 
                  style: { ...selectedEdge.style, stroke: color },
                  markerEnd: { ...selectedEdge.markerEnd, color }
                })}
                pickerId="edge-color"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stroke Width
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={selectedEdge.style?.strokeWidth || 2}
                  onChange={(e) => onUpdateEdge(selectedEdge.id, {
                    style: { ...selectedEdge.style, strokeWidth: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedEdge.style?.strokeWidth || 2}px
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Line Style
                </label>
                <select
                  value={selectedEdge.style?.strokeDasharray ? 'dashed' : 'solid'}
                  onChange={(e) => onUpdateEdge(selectedEdge.id, {
                    style: { 
                      ...selectedEdge.style, 
                      strokeDasharray: e.target.value === 'dashed' ? '5,5' : undefined 
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};