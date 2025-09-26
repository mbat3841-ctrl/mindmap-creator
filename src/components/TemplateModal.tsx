import React from 'react';
import { X } from 'lucide-react';
import { Template } from '../types';
import { templates } from '../utils/templates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] lg:max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Choose a Template
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Start with a pre-designed template to quickly create your mind map or roadmap
          </p>
        </div>

        <div className="p-4 lg:p-6 overflow-y-auto max-h-[70vh] lg:max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="p-3 lg:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg"
              >
                <div className="text-center mb-3 lg:mb-4">
                  <div className="text-3xl lg:text-4xl mb-2">{template.preview}</div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-left">
                    {template.nodes.length} nodes, {template.edges.length} connections
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center lg:justify-start">
                    {template.nodes.slice(0, 3).map((node, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: node.data.backgroundColor,
                          color: node.data.color,
                          fontSize: '9px',
                        }}
                      >
                        {node.data.label.length > 8 
                          ? node.data.label.substring(0, 8) + '...' 
                          : node.data.label
                        }
                      </span>
                    ))}
                    {template.nodes.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300" style={{ fontSize: '9px' }}>
                        +{template.nodes.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 lg:px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};