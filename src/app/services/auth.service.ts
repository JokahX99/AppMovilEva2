import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlUsuarios = 'https://6705d36b031fd46a83110cfe.mockapi.io/Usuarios';
  private apiUrlClases = 'https://6705d36b031fd46a83110cfe.mockapi.io/Clases'; // URL de Clases

  constructor(private http: HttpClient) {}

  // Obtener usuarios desde la API
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsuarios);
  }

  // Validar credenciales de usuario
  login(username: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlUsuarios}?Username=${username}&Password=${password}`);
  }

  // Registrar un nuevo usuario
  register(username: string, password: string, rol: string): Observable<any> {
    const newUser = {
      Username: username,
      Password: password,
      rol: rol
    };
    return this.http.post<any>(this.apiUrlUsuarios, newUser);
  }

  // **Nuevo Método para verificar si el nombre de usuario ya existe**
  usernameExists(username: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrlUsuarios}?Username=${username}`).pipe(
      map((users) => users && users.length > 0),  // Si hay usuarios con el mismo nombre, devuelve true
      catchError(() => of(false))  // En caso de error, devuelve false
    );
  }

  // Obtener las clases dependiendo del rol (docente o alumno)
  getClasesPorUsuario(userId: string, rol: string): Observable<any> {
    if (rol === 'Docente') {
      // Obtener clases donde el docente sea el encargado
      return this.http.get<any>(`${this.apiUrlClases}?docenteId=${userId}`);
    } else if (rol === 'Alumno') {
      // Obtener clases donde el alumno esté inscrito (verificar si está en alumnosIds)
      return this.http.get<any>(`${this.apiUrlClases}?alumnosIds=${userId}`);
    } else {
      return new Observable(); // En caso de un rol desconocido
    }
  }

  // METODOS PARA CAMBIAR CONTRASEÑA DEL USUARIO CON VALIDACIONES

  // Validar credenciales de usuario (contraseña actual)
  validarPasswordActual(userId: string, currentPassword: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrlUsuarios}/${userId}`).pipe(
      map((user) => user.Password === currentPassword),  // Verificar si la contraseña actual coincide
      catchError(() => of(false))  // En caso de error, devuelve false
    );
  }

  // Cambiar contraseña del usuario
  cambiarPassword(userId: string, newPassword: string): Observable<any> {
    const body = { Password: newPassword };
    return this.http.put<any>(`${this.apiUrlUsuarios}/${userId}`, body);
  }

  // Método para cambiar contraseña con validación de la contraseña actual
  cambiarPasswordConValidacion(userId: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.validarPasswordActual(userId, currentPassword).pipe(
      switchMap((isValidPassword) => {
        if (isValidPassword) {
          return this.cambiarPassword(userId, newPassword).pipe(
            map(() => ({ success: true })),  // Si se cambia la contraseña, devuelve éxito
            catchError(() => of({ success: false, message: 'No se pudo cambiar la contraseña.' }))
          );
        } else {
          return of({ success: false, message: 'La contraseña actual no es correcta.' });  // Si la validación falla
        }
      }),
      catchError((error) => of({ success: false, message: error.message }))
    );
  }
  
}
