import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CustomNode, CustomEdge } from '../types';

export const exportToPNG = async (elementId: string, filename: string = 'mindmap') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
};

export const exportToSVG = async (elementId: string, filename: string = 'mindmap') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Create SVG representation
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = element.getBoundingClientRect();
    
    svg.setAttribute('width', rect.width.toString());
    svg.setAttribute('height', rect.height.toString());
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    
    // Convert HTML to SVG (simplified approach)
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(element.cloneNode(true));
    svg.appendChild(foreignObject);
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = URL.createObjectURL(svgBlob);
    link.click();
  } catch (error) {
    console.error('Failed to export SVG:', error);
  }
};

export const exportToPDF = async (elementId: string, filename: string = 'mindmap') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
};

export const exportToJSON = (nodes: CustomNode[], edges: CustomEdge[], filename: string = 'mindmap') => {
  const data = {
    version: '1.0',
    created: new Date().toISOString(),
    nodes,
    edges,
  };
  
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = `${filename}.json`;
  link.href = URL.createObjectURL(jsonBlob);
  link.click();
};

export const importFromJSON = (file: File): Promise<{ nodes: CustomNode[]; edges: CustomEdge[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({ nodes: data.nodes || [], edges: data.edges || [] });
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};