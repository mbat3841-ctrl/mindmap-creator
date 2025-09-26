import React from 'react';
import { Circle, Square, Diamond, Trash2, Undo, Redo, Grid3x3 as Grid3X3, MousePointer } from 'lucide-react';

interface ToolbarProps {
  onAddNode: (type: 'circle' | 'rectangle' | 'diamond') => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  selectedTool: string;
  onSelectTool: (tool: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  snapToGrid,
  onToggleSnap,
  selectedTool,
  onSelectTool,
}) => {
  return (
    <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
      <div className="space-y-2">
        <button
          onClick={() => onSelectTool('select')}
          className={`p-3 rounded-lg transition-colors duration-200 ${
            selectedTool === 'select'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Select Tool"
        >
          <MousePointer size={18} />
        </button>

        <button
          onClick={() => onAddNode('circle')}
          className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title="Add Circle Node"
        >
          <Circle size={18} />
        </button>

        <button
          onClick={() => onAddNode('rectangle')}
          className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title="Add Rectangle Node"
        >
          <Square size={18} />
        </button>

        <button
          onClick={() => onAddNode('diamond')}
          className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title="Add Diamond Node"
        >
          <Diamond size={18} />
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-600 w-10"></div>

      <div className="space-y-2">
        <button
          onClick={onDelete}
          className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
          title="Delete Selected"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-600 w-10"></div>

      <div className="space-y-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-3 rounded-lg transition-colors duration-200 ${
            canUndo
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-3 rounded-lg transition-colors duration-200 ${
            canRedo
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-600 w-10"></div>

      <button
        onClick={onToggleSnap}
        className={`p-3 rounded-lg transition-colors duration-200 ${
          snapToGrid
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Toggle Snap to Grid"
      >
        <Grid3X3 size={18} />
      </button>
    </div>
  );
};