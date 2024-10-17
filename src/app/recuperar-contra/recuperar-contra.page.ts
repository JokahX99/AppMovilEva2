import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Usuario {
  id: string;
  Username: string;
  Password: string;
  rol: string;
  email?: string; // si también tiene el campo email
}

@Component({
  selector: 'app-recuperar-contra',
  templateUrl: './recuperar-contra.page.html',
  styleUrls: ['./recuperar-contra.page.scss'],
})
export class RecuperarContraPage {
  username: string = '';
  email: string = '';
  usuarioValido: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  // Método para validar si el usuario existe
  validarUsuario() {
    this.authService.getUsers().subscribe((users: Usuario[]) => {
      const user = users.find((u: Usuario) => u.Username === this.username);
      if (user) {
        this.usuarioValido = true;
      } else {
        this.mostrarAlertaUsuarioInvalido();  // Mostrar alerta si el usuario no es correcto
      }
    });
  }

  // Método para simular el envío del correo de recuperación
  recuperarContrasena() {
    if (this.usuarioValido) {
      this.mostrarAlertaExito(); // Mostrar alerta de éxito si el usuario es válido
    }
  }

  // Alerta de éxito para la recuperación de la contraseña
  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Se ha enviado la recuperación de contraseña con éxito.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);  // Redirige al login
          }
        }
      ]
    });
    await alert.present();
  }

  // Alerta para cuando el usuario no es correcto
  async mostrarAlertaUsuarioInvalido() {
    const alert = await this.alertController.create({
      header: 'Usuario no encontrado',
      message: 'El usuario no existe o está mal escrito.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.username = ''; // Limpiar el campo de usuario
          }
        }
      ]
    });
    await alert.present();
  }
}
