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
      allowTaint: true,
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    alert('Failed to export PNG. Please try again.');
  }
};

export const exportToSVG = async (elementId: string, filename: string = 'mindmap') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Use html2canvas to create a canvas, then convert to SVG
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Create SVG with embedded image
    const imgData = canvas.toDataURL('image/png');
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${imgData}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>
    `;
    
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = URL.createObjectURL(svgBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    alert('Failed to export SVG. Please try again.');
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
      allowTaint: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit on page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let pdfWidth, pdfHeight;
    if (ratio > 1) {
      // Landscape
      pdfWidth = 297; // A4 width in mm
      pdfHeight = pdfWidth / ratio;
    } else {
      // Portrait
      pdfHeight = 210; // A4 height in mm
      pdfWidth = pdfHeight * ratio;
    }
    
    const pdf = new jsPDF({
      orientation: ratio > 1 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    alert('Failed to export PDF. Please try again.');
  }
};

export const exportToJSON = (nodes: CustomNode[], edges: CustomEdge[], filename: string = 'mindmap') => {
  try {
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
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export JSON:', error);
    alert('Failed to export JSON. Please try again.');
  }
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