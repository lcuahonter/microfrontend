import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { CancelacionesService } from '../../services/cancelaciones.service';
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DireccionDeNotificacionesComponent } from '../direccion-de-notificaciones/direccion-de-notificaciones.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente DatosDelLasComponent
 * 
 * Este componente es responsable de manejar el formulario de notificación de personas
 * para el trámite 140201. Permite la actualización de los datos de nombre, apellido paterno
 * y correo electrónico, y carga la información adicional desde el servicio.
 */
@Component({
  selector: 'app-datos-notification-recipients',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    DireccionDeNotificacionesComponent,
  ],
  templateUrl: './datos-notification-recipients.component.html',
  styleUrl: './datos-notification-recipients.component.scss',
})
/** DatosDelLasComponent */
export class DatosNotificationRecipientsComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para la notificación de personas */
  formularioDeNotificacionesForm!: FormGroup;
  /** Subject para manejar la destrucción de las suscripciones */
  private destroy$ = new Subject<void>();
  /**
   * Observable para la entidad federativa.
   * Se inicializa como un observable vacío.
   */
  entidadFederativa$!: Observable<unknown>;
  /**
   * Suscripción a los cambios en el formulario react
   */
  private subscription: Subscription = new Subscription();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /** Constructor */
  constructor(
    private fb: FormBuilder,
    private cancelacionService: CancelacionesService,
    private cancelacionesStore: CancelacionesStore,
    private cancelacionesQuery: CancelacionesQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()

  }

  /** Observable para el nombre */
  nombre$ = this.cancelacionesQuery.nombre$;
  /** Observable para el apellido paterno */
  apellidoPaterno$ = this.cancelacionesQuery.apellidoPaterno$;
  /** Observable para el correo electrónico */
  correoElectronico$ = this.cancelacionesQuery.correoElectronico$;

  /**
   * Método ngOnInit
   * 
   * Inicializa el formulario y carga el estado y la información.
   */
  ngOnInit(): void {
    this.formularioDeNotificacionesForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: [{ value: '', disabled: true }],
      correoElectronico: ['', [Validators.email]],
    });

    this.infoDeCarga();
    this.inicializarEstadoFormulario();
  }


  /**
  * Evalúa si se debe inicializar o cargar datos en el formulario.  
  * Además, obtiene la información del catálogo de mercancía.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.estadoActualizacion();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.estadoActualizacion();
    if (this.formularioDeNotificacionesForm && this.esFormularioSoloLectura) {
      this.formularioDeNotificacionesForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formularioDeNotificacionesForm.enable();
    } 
  }


  /**
   * Método estadoActualizacion
   * 
   * Actualiza el estado del formulario suscribiéndose a los observables de nombre,
   * apellido paterno y correo electrónico.
   */
  estadoActualizacion(): void {
    this.nombre$.pipe(takeUntil(this.destroy$)).subscribe((nombre) => {
      if (nombre) {
        this.formularioDeNotificacionesForm?.get('nombre')?.setValue(nombre);
      }
    });

    this.apellidoPaterno$.pipe(takeUntil(this.destroy$)).subscribe((apellidoPaterno) => {
      if (apellidoPaterno) {
        this.formularioDeNotificacionesForm?.get('apellidoPaterno')?.setValue(apellidoPaterno);
      }
    });

    this.correoElectronico$.pipe(takeUntil(this.destroy$)).subscribe((correoElectronico) => {
      if (correoElectronico) {
        this.formularioDeNotificacionesForm?.get('correoElectronico')?.setValue(correoElectronico);
      }
    });
  }

  /**
   * Método updateNombre
   * 
   * Actualiza el nombre en el store.
   */
  updateNombre(): void {
    const NOMBRE = this.formularioDeNotificacionesForm.get('nombre')?.value;
    this.cancelacionesStore.setNombre(NOMBRE);
  }

  /**
   * Método updateApellidoPaterno
   * 
   * Actualiza el apellido paterno en el store.
   */
  updateApellidoPaterno(): void {
    const APELLIDO_PATERNO = this.formularioDeNotificacionesForm.get('apellidoPaterno')?.value;
    this.cancelacionesStore.setApellidoPaterno(APELLIDO_PATERNO);
  }

  /**
   * Método updateCorreoElectronico
   * 
   * Actualiza el correo electrónico en el store.
   */
  updateCorreoElectronico(): void {
    const CORREO_ELECTRONICO = this.formularioDeNotificacionesForm.get('correoElectronico')?.value;
    this.cancelacionesStore.setCorreoElectronico(CORREO_ELECTRONICO);
  }

  /**
   * Método infoDeCarga
   * 
   * Carga la información adicional desde el servicio y actualiza el formulario.
   */
  infoDeCarga(): void {
    this.cancelacionService
      .getInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.formularioDeNotificacionesForm.patchValue({
          apellidoMaterno: data.apellidoMaterno
        });
      });
  }

  /**
   * Método ngOnDestroy
   * 
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}