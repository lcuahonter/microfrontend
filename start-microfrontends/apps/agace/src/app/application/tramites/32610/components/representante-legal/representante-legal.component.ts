import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  REG_X,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32610State,
  Solicitud32610Store,
} from '../../estados/solicitud32610.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';

@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.scss'],
})
export class RepresentanteLegalComponent implements OnInit, OnDestroy {
  /** Formulario reactivo que contiene los campos del representante legal */
  representante!: FormGroup;

  /** Indica si el formulario está en modo solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Sujeto para manejar la destrucción y cancelar suscripciones */
  private destroyed$ = new Subject<void>();

  /** Estado actual del trámite cargado desde el store */
  solicitudState!: Solicitud32610State;

  /**
   * Indicates whether the entity is consolidated in ET.
   *
   * @type {boolean}
   * @default false
   */
  esConsolidatedET: boolean = false;

  /**
   * Indica si el campo RFC tiene un valor asignado.
   */
  tieneValorRfc: boolean = false;

  /**
   * Configuración de notificación actual para mostrar al usuario.
   *
   * @description
   * Almacena la configuración de la notificación que se mostrará
   * en modales de confirmación, error o información.
   *
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();
  /**
   * Bandera que controla la visualización de errores en el formulario.
   * Se activa cuando hay errores de validación que deben mostrarse.
   */
  mostrarError: boolean = false;

  /**
   * Constructor del componente
   *
   * @param fb FormBuilder para crear formularios reactivos
   * @param tramite32610Store Store para actualizar el estado del trámite
   * @param tramite32610Query Query para obtener el estado actual del trámite
   * @param consultaioQuery Query para obtener el estado general del formulario (lectura/edición)
   */
  constructor(
    private fb: FormBuilder,
    private tramite32610Store: Solicitud32610Store,
    private tramite32610Query: Solicitud32610Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Se suscribe al estado del formulario para saber si está en modo solo lectura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida OnInit.
   *
   * Se ejecuta después de que Angular inicializa las propiedades
   * vinculadas a datos del componente. Se suscribe al estado de la solicitud
   * y crea/inicializa el formulario con los datos correspondientes.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Crea el formulario reactivo con los valores iniciales del estado de la solicitud.
   * Algunos campos se crean en modo solo lectura (deshabilitados).
 
   */
  crearFormulario(): void {
    this.subscription.add(
      this.tramite32610Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe()
    );
    this.representante = this.fb.group({
      representanteRegistro: [
        this.solicitudState.representanteRegistro,
        [Validators.required, Validators.pattern(REG_X.RFC_13_ALFANUM)],
      ],
      representanteRfc: [
        { value: this.solicitudState.representanteRfc, disabled: true },
      ],
      representanteNombre: [
        { value: this.solicitudState.representanteNombre, disabled: true },
      ],
      representanteApellidoPaterno: [
        {
          value: this.solicitudState.representanteApellidoPaterno,
          disabled: true,
        },
      ],
      representanteApellidoMaterno: [
        {
          value: this.solicitudState.representanteApellidoMaterno,
          disabled: true,
        },
      ],
      representanteTelefono: [this.solicitudState.representanteTelefono],
      representanteCorreo: [
        this.solicitudState.representanteCorreo,
        [Validators.email],
      ],
    });
  }

  /**
   * Inicializa el estado del formulario dependiendo si está en modo solo lectura.
   * Si es solo lectura, deshabilita el formulario.
   *
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  /**
   * Habilita o deshabilita el formulario dependiendo del modo de solo lectura.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.representante.disable();
    } else {
      this.representante.enable();
    }
  }

  /**
   * Actualiza el formulario con datos obtenidos desde la tienda.
   */
  public enPatchStoredFormData(): void {
    this.tramite32610Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Solicitud32610State) => {
        this.solicitudState = datos;
      });
  }

  /**
   * Simula una búsqueda de datos basándose en el valor del campo 'representanteRegistro'.
   * Si existe valor, parchea el formulario con datos simulados (MOCK_DATA).
   *
   * @returns {void}
   */
  botonBuscar(): void {
    const REGISTRO_VALUE = this.representante.get('representanteRegistro')?.value;
    const REGISTRO_CONTROL = this.representante.get('representanteRegistro');
    if(!REGISTRO_VALUE) {
    this.mostrarNotificacionDeBusqueda('', 'No se ha proporcionado información que es requerida');
    this.tieneValorRfc = true;
    return;
    }

    if (!REGISTRO_CONTROL?.valid) {
      this.mostrarNotificacionDeBusqueda('', 'Ha proporcionado información con un formato incorrecto');
      this.tieneValorRfc = true;
      return;
    }
    if (REGISTRO_VALUE) {
      this.tieneValorRfc = true;
      this.mostrarNotificacionDeBusqueda('', 'Datos guardados correctamente');
      const MOCK_DATA = {
        representanteRfc: REGISTRO_VALUE,
        representanteNombre: 'EUROFOODS DE MEXICO',
        representanteApellidoPaterno: 'GONZALEZ',
        representanteApellidoMaterno: 'PINAL',
        representanteTelefono: '618-256-2532',
        representanteCorreo: 'vucem2.5@hotmail.com',
      };
      this.representante.patchValue(MOCK_DATA);
    }
  }

  /**
   * Muestra una notificación de búsqueda exitosa.
   * Este mensaje indica que los datos se guardaron correctamente.
   */
  mostrarNotificacionDeBusqueda(titulo: string,
    mensaje: string,
    txtBtnAceptar: string = 'Aceptar',
    txtBtnCancelar: string = ''): void {
    this.nuevaNotificacion = {
       tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar
    };
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32610Store.actualizarEstado({
        [campo]: CONTROL.value,
      });
    }
  }

  /**
   * Validates the representante form and sets the mostrarError flag if validation fails
   * @returns boolean indicating if the form is valid
   */
  public validarFormulario(): boolean {
  if (!this.representante) {
    this.mostrarError = true;
    return false;
  }
  const VALUES = this.representante.value;
  const ALL_FIELDS_EMPTY = Object.values(VALUES).every(val => val === null || val === '');

  if (ALL_FIELDS_EMPTY) {
    this.mostrarError = true;
    return false;
  }
  if (this.representante.invalid) {
    this.representante.markAllAsTouched();
    return false;
  }
  this.mostrarError = false;
  return true;
}


  /**
   * Método del ciclo de vida OnDestroy.
   *
   * Se ejecuta justo antes de que Angular destruya el componente.
   * Libera recursos cancelando las suscripciones para evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
