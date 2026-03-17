import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CondicionesUsoService, CondicionesUsoState } from '../../../estados/condiciones-uso.store';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CondicionesUsoQuery } from '../../../queries/condiciones-uso.query';
import { Router } from '@angular/router';

@Component({
  selector: 'app-condiciones-uso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './condiciones-uso.component.html',
  styleUrl: './condiciones-uso.component.scss',
})
export class CondicionesUsoComponent implements OnInit, OnDestroy {
  /** Estado actual de aceptación de condiciones */
  public aceptaCondicion!: CondicionesUsoState;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Notificador para destruir suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Indica si el usuario ha aceptado las condiciones */
  public aceptaCondiciones: boolean = false;

  /**
   * Constructor con inyección de dependencias.
   * @param condiciones Consulta el estado de condiciones de uso.
   * @param regitroCondicion Servicio para registrar la aceptación.
   */
  constructor(
    private condiciones: CondicionesUsoQuery,
    private regitroCondicion: CondicionesUsoService,
  ) { }

  /**
   * Inicializa el componente, suscribe al estado de condiciones y actualiza la variable local.
   */
  ngOnInit(): void {
    this.condiciones.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.aceptaCondicion = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.aceptaCondiciones = this.aceptaCondicion.aceptaCondiciones;
  }

   /**
   * Libera recursos y cancela suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /** Formulario reactivo para aceptar condiciones */
  form: FormGroup = inject(FormBuilder).group({
    aceptado: [false]
  });

  /** Router para navegación */
  private router = inject(Router);

  /**
   * Acción al intentar aceptar las condiciones.
   * Si el usuario acepta, navega a la ruta correspondiente.
   * Si no, muestra una notificación de alerta.
   */
  aceptar(): void {
    if (this.form.value.aceptado) {
      this.router.navigate(['login/acepta-condiciones']);
    } else {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'Debe aceptar las condiciones para continuar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Acción para continuar sin aceptar condiciones.
   * Registra la no aceptación y redirige a la bandeja de tareas.
   */
  continuar(): void {
    this.regitroCondicion.registroCondicionesUso(this.aceptaCondiciones = false);
    window.location.href = '/bandeja-de-tareas-pendientes';
  }

  /**
   * Acción al no aceptar las condiciones.
   * Redirige al usuario al logout o a la pantalla de login.
   */
  noAceptar(): void {
    this.router.navigateByUrl('/logout'); // o a login, o cerrar sesión
  }

}