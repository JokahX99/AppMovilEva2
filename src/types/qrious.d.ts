declare module 'qrious' {
    export default class QRious {
      constructor(options?: {
        element?: HTMLCanvasElement | HTMLImageElement;
        value?: string;
        size?: number;
        level?: 'L' | 'M' | 'Q' | 'H';
      });
  
      element: HTMLCanvasElement | HTMLImageElement;
      value: string;
      size: number;
      level: 'L' | 'M' | 'Q' | 'H';
    }
  }
  