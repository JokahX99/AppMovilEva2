import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.page.html',
  styleUrls: ['./cambiar-contra.page.scss'],
})
export class CambiarContraPage {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController, // Añade AlertController
    private router: Router // Añade Router
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async cambiarPassword() {
    const userId = localStorage.getItem('userId'); // Obtiene el userId del localStorage

    if (!userId) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener el ID del usuario.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return; // Detiene la ejecución si no hay userId
    }

    this.authService.cambiarPasswordConValidacion(userId, this.currentPassword, this.newPassword).subscribe(
      async (response) => {
        if (response.success) {
          // Si el cambio fue exitoso, muestra una alerta
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Contraseña cambiada con éxito.',
            buttons: [{
              text: 'Aceptar',
              handler: () => {
                this.dismiss(); // Simplemente cierra el modal
              }
            }],
          });
          await alert.present();
        } else {
          // Si la contraseña actual es inválida, muestra una alerta
          const alert = await this.alertController.create({
            header: 'Error',
            message: response.message,
            buttons: ['Aceptar'],
          });
          await alert.present();
        }
      },
      async (error) => {
        // Manejo del error
        console.error('Error al cambiar contraseña', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error al cambiar la contraseña.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    );
  }

  // Modificar el método dismiss para volver atrás en lugar de redirigir al login
  async close() {
    await this.dismiss();
    this.router.navigate(['/usuario']); // Navega a la página de usuario
  }  
}
