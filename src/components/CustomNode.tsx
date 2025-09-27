import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNode as CustomNodeType } from '../types';

export const CircleNode = ({ data, selected, id }: NodeProps<CustomNodeType['data']>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Update local state when data changes
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the node data properly
    if (data.label !== label) {
      data.label = label;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      if (data.label !== label) {
        data.label = label;
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setLabel(data.label);
    }
  };

  return (
    <div
      className={`relative w-20 sm:w-24 h-20 sm:h-24 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
        selected ? 'ring-2 ring-blue-500 ring-opacity-75 shadow-lg' : ''
      }`}
      style={{
        backgroundColor: data.backgroundColor,
        borderColor: data.borderColor,
        borderWidth: data.borderWidth,
        color: data.color,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400" />
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
      
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          className="w-16 sm:w-20 h-6 sm:h-8 text-center bg-transparent border-none outline-none text-xs"
          style={{ color: data.color, fontSize: data.fontSize }}
          autoFocus
        />
      ) : (
        <div className="text-center text-xs px-1 sm:px-2 break-words max-w-16 sm:max-w-20">
          {data.label}
        </div>
      )}
    </div>
  );
};

export const RectangleNode = ({ data, selected }: NodeProps<CustomNodeType['data']>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Update local state when data changes
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.label !== label) {
      data.label = label;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      if (data.label !== label) {
        data.label = label;
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setLabel(data.label);
    }
  };

  return (
    <div
      className={`relative w-28 sm:w-32 h-14 sm:h-16 border-2 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
        selected ? 'ring-2 ring-blue-500 ring-opacity-75 shadow-lg' : ''
      }`}
      style={{
        backgroundColor: data.backgroundColor,
        borderColor: data.borderColor,
        borderWidth: data.borderWidth,
        color: data.color,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400" />
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
      
      {isEditing ? (
        <textarea
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
         className="w-24 sm:w-28 h-10 sm:h-12 text-center bg-transparent border-none outline-none resize-none text-xs"
          style={{ color: data.color, fontSize: data.fontSize }}
          autoFocus
        />
      ) : (
       <div className="text-center text-xs px-1 sm:px-2 break-words max-w-24 sm:max-w-28 whitespace-pre-line">
          {data.label}
        </div>
      )}
    </div>
  );
};

export const DiamondNode = ({ data, selected }: NodeProps<CustomNodeType['data']>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Update local state when data changes
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.label !== label) {
      data.label = label;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      if (data.label !== label) {
        data.label = label;
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setLabel(data.label);
    }
  };

  return (
    <div
      className={`relative w-20 sm:w-24 h-20 sm:h-24 border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
        selected ? 'ring-2 ring-blue-500 ring-opacity-75 shadow-lg' : ''
      }`}
      style={{
        backgroundColor: data.backgroundColor,
        borderColor: data.borderColor,
        borderWidth: data.borderWidth,
        color: data.color,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        transform: 'rotate(45deg)',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400" />
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
      
      <div style={{ transform: 'rotate(-45deg)' }}>
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            className="w-14 sm:w-16 h-5 sm:h-6 text-center bg-transparent border-none outline-none text-xs"
            style={{ color: data.color, fontSize: data.fontSize }}
            autoFocus
          />
        ) : (
          <div className="text-center text-xs px-1 break-words max-w-14 sm:max-w-16">
            {data.label}
          </div>
        )}
      </div>
    </div>
  );
};