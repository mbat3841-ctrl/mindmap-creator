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
    // Show loading indicator
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Get canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const aspectRatio = canvasWidth / canvasHeight;
    
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    let pdfWidth, pdfHeight, orientation;
    
    if (aspectRatio > 1) {
      // Landscape orientation
      orientation = 'landscape';
      pdfWidth = a4Height; // 297mm
      pdfHeight = pdfWidth / aspectRatio;
      
      if (pdfHeight > a4Width) {
        pdfHeight = a4Width; // 210mm
        pdfWidth = pdfHeight * aspectRatio;
      }
    } else {
      // Portrait orientation
      orientation = 'portrait';
      pdfHeight = a4Height; // 297mm
      pdfWidth = pdfHeight * aspectRatio;
      
      if (pdfWidth > a4Width) {
        pdfWidth = a4Width; // 210mm
        pdfHeight = pdfWidth / aspectRatio;
      }
    }
    
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Center the image on the page
    const pageWidth = orientation === 'landscape' ? a4Height : a4Width;
    const pageHeight = orientation === 'landscape' ? a4Width : a4Height;
    
    const xOffset = (pageWidth - pdfWidth) / 2;
    const yOffset = (pageHeight - pdfHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
    
    // Restore cursor
    document.body.style.cursor = originalCursor;
  } catch (error) {
    // Restore cursor on error
    document.body.style.cursor = 'auto';
    console.error('Failed to export PDF:', error);
    alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
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