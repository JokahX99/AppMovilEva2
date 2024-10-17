import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage {
  username: string | null = '';
  rol: string | null = '';
  clases: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.username = localStorage.getItem('username');
    this.rol = localStorage.getItem('rol');
    
    // Si no hay username o rol, redirige al login
    if (!this.username || !this.rol) {
      this.router.navigate(['/login']);
    } else {
      this.cargarClases(); // Si los datos están, carga las clases
    }
  }

  // Método para redirigir a la página de QR
  goToQrPage() {
    this.router.navigate(['/qr']); // Cambia la ruta al QR
  }

  // Cargar las clases del usuario
  cargarClases() {
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol');

    if (userId && rol) {
      this.authService.getClasesPorUsuario(userId, rol).subscribe(
        (data) => {
          this.clases = data;
        },
        (error) => {
          console.error('Error al cargar clases:', error);
        }
      );
    }
  }

  // Método para mostrar alerta de confirmación al cerrar sesión
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.logout(); // Llama al método logout si el usuario confirma
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para cerrar sesión
  async logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');  // Elimina el userId también

    // Mostrar alerta de despedida
    await this.showFarewellAlert();

    // Redirigir al usuario a la página de login
    this.router.navigate(['/login']);
  }

  // Método para mostrar alerta de despedida
  async showFarewellAlert() {
    const alert = await this.alertController.create({
      header: '¡Gracias por usar RegistrApp!',
      message: 'Se ha cerrado tu sesión.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Método para redirigir a la página de cambio de contraseña
  goToCambiarContrasena() {
    this.router.navigate(['/cambiar-contra']);  // Redirige a la página de cambio de contraseña
  }
}
