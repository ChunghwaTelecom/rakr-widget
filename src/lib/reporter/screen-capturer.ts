import * as html2canvas from 'html2canvas';

export class ScreenCapturer {

  capture(element?: HTMLElement): Promise<HTMLCanvasElement> {
    if (element) {
      return html2canvas(element);
    } else {
      return html2canvas(window.document.body);
    }
  }
}
