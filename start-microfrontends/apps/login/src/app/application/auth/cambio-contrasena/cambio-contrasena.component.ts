import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notificacion, NotificacionesComponent, REGEX_CONRASENIA, TITULO_MODAL_AVISO } from '@libs/shared/data-access-user/src';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { CambioContrasena } from '../../core/models/cambio-contrasena.model';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../../core/service/password.service';

/**
 * Componente para el cambio de contraseña de usuario.
 * Permite validar la contraseña anterior, establecer una nueva contraseña cumpliendo requisitos de seguridad,
 * y confirmar la nueva contraseña. Utiliza validadores síncronos y asíncronos para asegurar la integridad de los datos.
 */
@Component({
  selector: 'app-cambio-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './cambio-contrasena.component.html',
  styleUrl: './cambio-contrasena.component.scss',
})
export class CambioContrasenaComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para el cambio de contraseña */
  public FormCambioContrasena!: FormGroup;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Subject para controlar la destrucción de suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param passwordService Servicio para operaciones relacionadas con contraseñas.
   * @param router Router de Angular para navegación.
   */
  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
  ) { }

  /**
   * Inicializa el formulario al cargar el componente.
   */
  ngOnInit(): void {
    this.inicializaFormCambioContrasena();
  }

  /**
   * Inicializa el formulario de cambio de contraseña con sus validadores.
   */
  inicializaFormCambioContrasena(): void {
    this.FormCambioContrasena = this.fb.group({
      contrasenaAnterior: ['',
        {
          validators: [Validators.required],
          asyncValidators: [this.validadorContrasenaAnterior()],
          updateOn: 'blur'
        }
      ],
      contrasenaNueva: ['', [Validators.required, CambioContrasenaComponent.validadorContrasenaSegura]],
      confirmacionContrasena: ['', [Validators.required]],
    }, {
      validators: CambioContrasenaComponent.validadorCoincidenciaContrasenas
    });
  }

  /**
   * Envía el formulario para cambiar la contraseña.
   * Si el formulario es válido, llama al servicio para realizar el cambio y muestra la notificación correspondiente.
   */
  onSubmit(): void {
    if (this.FormCambioContrasena.invalid) {
      this.FormCambioContrasena.markAllAsTouched();
      return;
    }
    const MODELO_CAMBIO: CambioContrasena = {
      contrasenaAnterior: this.FormCambioContrasena.get('contrasenaAnterior')?.value,
      contrasenaNueva: this.FormCambioContrasena.get('contrasenaNueva')?.value,
      confirmacionContrasena: this.FormCambioContrasena.get('confirmacionContrasena')?.value
    };
    this.passwordService.cambioContrasena(MODELO_CAMBIO)
      .pipe(
        map((data) => {
          if (data) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'success',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: 'Contraseña cambiada correctamente.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        }),
        catchError((_error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'error',
            modo: 'action',
            titulo: 'Error',
            mensaje: 'No se pudo cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.',
            cerrar: true,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          return of(null);
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Libera recursos y cancela suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Validador estático para comprobar que la contraseña cumple con el patrón de seguridad.
   * @param control Control de formulario a validar.
   * @returns ValidationErrors si la contraseña no es válida, null en caso contrario.
   */
  static validadorContrasenaSegura(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const ES_VALIDA = REGEX_CONRASENIA.test(VALUE);
    return ES_VALIDA ? null : { contrasenaInvalida: true };
  }

  /**
   * Validador estático para comprobar que la nueva contraseña y su confirmación coinciden.
   * @param group Grupo de controles del formulario.
   * @returns ValidationErrors si no coinciden, null en caso contrario.
   */
  static validadorCoincidenciaContrasenas(group: AbstractControl): ValidationErrors | null {
    const NUEVA = group.get('contrasenaNueva')?.value;
    const CONFIRMACION = group.get('confirmacionContrasena')?.value;
    return NUEVA === CONFIRMACION ? null : { noCoinciden: true };
  }

  /**
   * Validador asíncrono para comprobar que la contraseña anterior es correcta.
   * @returns Función que recibe un control y retorna un Observable con ValidationErrors o null.
   */
  validadorContrasenaAnterior(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const PASSWORD = control.value;
      if (!PASSWORD) {
        return of(null); // No valida si está vacío (se valida con required)
      }
      return this.passwordService.verificarContrasenaAnterior(PASSWORD).pipe(
        map(esValida => (esValida ? null : { contrasenaAnteriorInvalida: true }))
      );
    };
  }
}