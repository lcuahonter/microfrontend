import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";
import { RegistroUsuarioSinFielService } from '../../core/service/registro-usuario-sinfiel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ng-mf-registro-usuario-sinfiel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './registro-usuario-sinfiel.component.html',
  styleUrl: './registro-usuario-sinfiel.component.scss',
})
export class RegistroUsuarioSinfielComponent implements OnDestroy{  
  /**
   * Formulario reactivo para capturar usuario y contraseña.
   * @type {FormGroup}
   */
  public loginForm: FormGroup;

  /**
     * Mensaje de error para mostrar en notificaciones
     * @type {string | null}
     * @description Almacena el mensaje de error actual que se mostrará al usuario
     */
  public mensajeError: string | null = null;

  /**
     * Notificación para mostrar estados y errores al usuario
     * @type {Notificacion | null}
     * @description Controla la visualización de alertas y mensajes en la interfaz
     */  
    public nuevaAlertaNotificacion: Notificacion | null = null;

  /**
     * Modo de autenticación seleccionado
     * @type {string}
     * @description Define el modo de autenticación ('conFiel' o 'sinFiel')
     * @default 'sinFiel'
     */
  public modo: string = 'sinFiel';
  /**
     * Subject para control de suscripciones
     * @type {Subject<void>}
     * @description Utilizado para cancelar suscripciones al destruir el componente
     */
    public unsubscribe$ = new Subject<void>();

  /**
     * Constructor del componente
     * @param {FormBuilder} fb - Servicio para construir formularios reactivos
     * @param {Router} router - Servicio para navegación entre rutas
     * @param {RegistroUsuarioSinFielService} authServiceSinFiel - Servicio de autenticación sin FIEL
     */
  constructor(private fb: FormBuilder, private router: Router,
    private authServiceSinFiel: RegistroUsuarioSinFielService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }  

  /**
     * Procesa el ingreso del usuario
     * @description Valida el formulario y realiza la autenticación del usuario
     * @returns {void}
     * @throws {Error} Cuando hay errores de comunicación con el servidor
     */
  ingresar(): void {
    if (this.loginForm.invalid) {
      if (!this.loginForm.get('usuario')?.value) {
        this.mensajeError = '1.- (Usuario) es un campo requerido.';
      } else if (!this.loginForm.get('contrasena')?.value) {
        this.mensajeError = '1.- (Contraseña) es un campo requerido.';
      } else {
        this.mensajeError = '1.- Debe ingresar los datos usuario y contraseña.';
      }
      this.nuevaAlertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: this.mensajeError,
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
      return;
    }

    // Simulación de consumo de API
    const USUARIO = this.loginForm.get('usuario')?.value;
    const CONTRASENA = this.loginForm.get('contrasena')?.value;
    
    this.authServiceSinFiel.autenticarUsuario_sinFiel(USUARIO, CONTRASENA)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/pantalla-principal']);
        } else {
          this.mensajeError = response.message;          
          this.nuevaAlertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: this.mensajeError,
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
        }
      },
      error: () => {
        this.mensajeError = 'Ocurrió un error al comunicarse con el servidor. Por favor, intente nuevamente.';
        this.nuevaAlertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: this.mensajeError,
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
      },
    });
  }

  /**
   * Redirige al componente de registro.
   * @returns {void}
   */
  registrarse(): void { 
      this.router.navigate(['/login/registrarse']);
  }
  /**
     * Limpia recursos al destruir el componente
     * @description Completa el subject de desuscripción para evitar memory leaks
     * @returns {void}
     * @override
     */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
