import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
@Injectable({
  providedIn: 'root'
})
export class PdfDownloadService {

  constructor() { }

  downloadPDF(pdfData: any){
    let doc = new jsPDF();
    doc.addHTML(pdfData, function() {
       doc.save("download.pdf");
    });
  }
}
