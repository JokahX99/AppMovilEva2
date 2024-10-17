import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Método para iniciar sesión
  async login() {
    if (!this.username || !this.password) {
      await this.showAlert('Error', 'Por favor ingresa tanto el nombre de usuario como la contraseña.');
      return;
    }

    this.authService.login(this.username, this.password).subscribe(async (users) => {
      if (users.length > 0) {
        // Almacenar el nombre de usuario, el rol y el id en localStorage
        localStorage.setItem('username', this.username);
        localStorage.setItem('rol', users[0].rol);
        localStorage.setItem('userId', users[0].id);

        // Redirigir al usuario a la página de "Usuarios"
        this.router.navigate(['/usuario']);
      } else {
        await this.showAlert('Error', 'El usuario no existe. Por favor verifica tus credenciales.');
      }
    }, async (error) => {
      console.error('Error en la solicitud de login:', error);
      await this.showAlert('Error', 'Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    });
  }

  // Método para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
