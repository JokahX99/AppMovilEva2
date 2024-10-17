import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage {
  username: string = '';
  password: string = '';
  rol: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Método para registrar un nuevo usuario
  async registrar() {
    if (!this.username || !this.password || !this.rol) {
      await this.showAlert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Verifica si el nombre de usuario ya está en uso
    this.authService.usernameExists(this.username).subscribe(async (exists) => {
      if (exists) {
        // Si el nombre de usuario ya existe, muestra una alerta
        await this.showAlert('Error', 'Ese nombre de usuario ya se encuentra en uso.');
      } else {
        // Si el nombre de usuario no existe, procede con el registro
        this.authService.register(this.username, this.password, this.rol).subscribe(
          async () => {
            await this.showAlert('Éxito', 'Usuario creado exitosamente.');
            this.router.navigate(['/login']);  // Redirige al login después de registrar
          },
          async (error) => {
            console.error('Error al crear usuario:', error);
            await this.showAlert('Error', 'Hubo un error al crear el usuario.');
          }
        );
      }
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
