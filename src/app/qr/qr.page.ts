import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import QRious from 'qrious';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef;

  // URL para el entorno local
  qrCodeData: string = 'http://localhost:8100/login';  // URL fija a la página de login

  constructor(private router: Router) { } // Inyecta Router

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    const qr = new QRious({
      element: this.qrCanvas.nativeElement,
      value: this.qrCodeData,
      size: 200,
      level: 'H',
    });
  }

  // Método para redirigir al usuario
  goToUsers() {
    this.router.navigate(['/usuario']); // Redirige a la página de usuarios
  }
}
