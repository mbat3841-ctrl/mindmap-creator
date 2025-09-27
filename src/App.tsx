import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
  EdgeTypes,
  MarkerType,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

import '@xyflow/react/dist/style.css';

import { CircleNode, RectangleNode, DiamondNode } from './components/CustomNode';
import { Toolbar } from './components/Toolbar';
import { PropertyPanel } from './components/PropertyPanel';
import { TopMenu } from './components/TopMenu';
import { TemplateModal } from './components/TemplateModal';
import { CustomNode, CustomEdge, AppState, Template } from './types';
import { exportToPNG, exportToSVG, exportToPDF, exportToJSON, importFromJSON } from './utils/exportUtils';

const nodeTypes: NodeTypes = {
  circle: CircleNode,
  rectangle: RectangleNode,
  diamond: DiamondNode,
};

const edgeTypes: EdgeTypes = {};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#6B7280' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<CustomEdge | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedTool, setSelectedTool] = useState('select');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // History management
  const [history, setHistory] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Initialize with empty history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes: [], edges: [] }]);
      setHistoryIndex(0);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Listen for save to history events
  useEffect(() => {
    const handleSaveToHistory = () => {
      saveToHistory();
    };

    window.addEventListener('saveToHistory', handleSaveToHistory);
    return () => window.removeEventListener('saveToHistory', handleSaveToHistory);
  }, [saveToHistory]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const newEdge: Edge = {
        ...params,
        id: uuidv4(),
        type: 'default',
        ...defaultEdgeOptions,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const addNode = useCallback((type: 'circle' | 'rectangle' | 'diamond') => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      position: { x: Math.random() * 300 + 200, y: Math.random() * 300 + 200 },
      data: {
        label: `New ${type}`,
        color: '#1F2937',
        backgroundColor: type === 'circle' ? '#DBEAFE' : type === 'rectangle' ? '#E5E7EB' : '#FEF3C7',
        borderColor: type === 'circle' ? '#3B82F6' : type === 'rectangle' ? '#9CA3AF' : '#F59E0B',
        fontSize: 14,
        fontWeight: 'normal',
        borderWidth: 1,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    saveToHistory();
  }, [setNodes, saveToHistory]);

  const deleteSelected = useCallback(() => {
    let hasDeleted = false;
    
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      hasDeleted = true;
    }
    
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
      hasDeleted = true;
    }
    
    // If nothing is specifically selected, delete all selected nodes/edges from ReactFlow
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      setNodes((nds) => nds.filter((node) => !node.selected));
      setEdges((eds) => eds.filter((edge) => !edge.selected));
      hasDeleted = true;
    }
    
    if (hasDeleted) {
      saveToHistory();
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges, saveToHistory]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as CustomNode);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as CustomEdge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const updateNode = useCallback((id: string, updates: Partial<CustomNode['data']>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
      )
    );
    // Don't save to history for every keystroke, only on blur/enter
  }, [setNodes, saveToHistory]);

  const updateEdge = useCallback((id: string, updates: Partial<CustomEdge>) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      )
    );
    // Don't save to history for every change, only when done editing
  }, [setEdges, saveToHistory]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const handleExportPNG = () => exportToPNG('react-flow-container');
  const handleExportSVG = () => exportToSVG('react-flow-container');
  const handleExportPDF = () => exportToPDF('react-flow-container');
  const handleExportJSON = () => exportToJSON(nodes as CustomNode[], edges as CustomEdge[]);

  const handleImportJSON = async (file: File) => {
    try {
      const { nodes: importedNodes, edges: importedEdges } = await importFromJSON(file);
      setNodes(importedNodes);
      setEdges(importedEdges);
      saveToHistory();
    } catch (error) {
      alert('Failed to import file. Please check the file format.');
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    saveToHistory();
  };

  const handleSave = () => {
    handleExportJSON();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <TopMenu
        onNew={clearCanvas}
        onSave={handleSave}
        onLoad={() => {}}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onExportPDF={handleExportPDF}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onShowTemplates={() => setShowTemplateModal(true)}
      />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <Toolbar
          onAddNode={addNode}
          onDelete={deleteSelected}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          snapToGrid={snapToGrid}
          onToggleSnap={() => setSnapToGrid(!snapToGrid)}
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          hasSelection={selectedNode !== null || selectedEdge !== null || nodes.some(n => n.selected) || edges.some(e => e.selected)}
        />

        <div className="flex-1 relative order-first lg:order-none">
          <div id="react-flow-container" className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionMode={ConnectionMode.Loose}
              snapToGrid={snapToGrid}
              snapGrid={[15, 15]}
              className="bg-white dark:bg-gray-900"
            >
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={15} 
                size={1}
                className="bg-white dark:bg-gray-900"
              />
              <Controls 
                position="bottom-right"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 !bottom-4 !right-4"
              />
            </ReactFlow>
          </div>
        </div>

        <PropertyPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={updateNode}
          onUpdateEdge={updateEdge}
          onClose={() => {
            setSelectedNode(null);
            setSelectedEdge(null);
          }}
        />
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default App;