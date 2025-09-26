import React from 'react';
import { FileText, FolderOpen, Save, Download, Image, FileImage, Upload, Sun, Moon, Grid2x2 as Grid, Zap } from 'lucide-react';

interface TopMenuProps {
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onShowTemplates: () => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({
  onNew,
  onSave,
  onLoad,
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onExportJSON,
  onImportJSON,
  theme,
  onToggleTheme,
  onShowTemplates,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const exportMenuRef = React.useRef<HTMLDivElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
    e.target.value = '';
  };

  // Close export menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportClick = (exportFn: () => void) => {
    exportFn();
    setShowExportMenu(false);
  };
  return (
    <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center space-x-1 overflow-x-auto">
        <div className="flex items-center space-x-2 mr-2 sm:mr-6 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Grid className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
            MindMap Creator
          </h1>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:hidden">
            MindMap
          </h1>
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={onNew}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1 flex-shrink-0"
          >
            <FileText size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={onShowTemplates}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1 flex-shrink-0"
          >
            <Zap size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            onClick={onSave}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1 flex-shrink-0"
          >
            <Save size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={handleImportClick}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1 flex-shrink-0"
          >
            <FolderOpen size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Open</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-1 sm:mx-2 hidden sm:block"></div>

          <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-1 flex-shrink-0"
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => handleExportClick(onExportPNG)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Image size={16} />
                  <span>Export as PNG</span>
                </button>
                <button
                  onClick={() => handleExportClick(onExportSVG)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FileImage size={16} />
                  <span>Export as SVG</span>
                </button>
                <button
                  onClick={() => handleExportClick(onExportPDF)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Export as PDF</span>
                </button>
                <div className="h-px bg-gray-200 dark:bg-gray-600 my-1"></div>
                <button
                  onClick={() => handleExportClick(onExportJSON)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Save as JSON</span>
                </button>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onToggleTheme}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} className="sm:w-5 sm:h-5" /> : <Sun size={16} className="sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  );
};