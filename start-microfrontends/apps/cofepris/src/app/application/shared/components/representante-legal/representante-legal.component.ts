import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatosSolicitudService, RepresentanteData, RfcSearchPayload } from '../../../shared/services/datos-solicitud.service';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { DomicilioState } from '../../estados/stores/domicilio.store';

import { DomicilioStore } from '../../estados/stores/domicilio.store';

import { DomicilioQuery } from '../../../shared/estados/queries/domicilio.query';

import { Subject, map, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


import { ConsultaioQuery,Notificacion,NotificacionesComponent } from '@ng-mf/data-access-user';
import { DatosSolicitudFormState } from '../../models/datos-solicitud.model';

/**
 * @description
 * Componente que gestiona los datos del representante legal.
 * Permite inicializar un formulario reactivo con los datos de la solicitud
 * y realizar operaciones relacionadas con el estado del trámite.
 */
@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, NotificacionesComponent],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnInit, OnChanges {

   /**
   * Tipo de trámite asociado al componente.
   * Este valor se recibe como entrada y determina el tipo de trámite que se está gestionando.
   */
  @Input() tipoTramite: string = '';

    /** Indica si se debe mostrar la alerta del RFC. */
    mostrarRfcAlerta: boolean = false;
  
    /** Nueva notificación relacionada con el RFC. */
    public nuevaRfcNotificacion!: Notificacion;

    /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;
 /**
   * @event datasolicituActualizar
   * Emite el estado actualizado del formulario cada vez que cambia su valor.
   */
  @Output() datasolicituActualizar: EventEmitter<DatosSolicitudFormState> =
    new EventEmitter<DatosSolicitudFormState>();

      /**
       * @property {DatosSolicitudFormState} datosSolicitudFormState
       * Estado inicial del formulario de solicitud, recibido como input.
       */
      @Input() public datosSolicitudFormState!: DatosSolicitudFormState;

   /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  botonOcultar: boolean = false;

    /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;

  public nuevaNotificacion!: Notificacion;

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;
  /**
   * @description
   * Formulario reactivo para capturar los datos del representante legal.
   */
  representanteLegalForm!: FormGroup;

   /**
   * Obtiene el valor de un campo en el store de Tramite31601.
   */
  obtenerValor(): void {
    if(this.representanteLegalForm.get('rfc')?.value===''){
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Debe ingresar el RFC.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };}
      else{

    this.representanteLegalForm.patchValue({
      nombreRazonSocial: 47875,
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
    });
  }
  }
  eliminarPedimento(): void {
    this.representanteLegalForm.reset();
  }
 /**
   * Abre el modal de RFC y muestra una notificación de alerta.
   */
  abrirRfcModal(): void {
    this.mostrarRfcAlerta = true;
    this.nuevaRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar el RFC.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  buscarRepresentanteRfc(): void {
    const RFC_VALUE = this.representanteLegalForm.get('rfc')?.value?.trim();
      if (!RFC_VALUE || RFC_VALUE === '') {
      this.abrirRfcModal();
      return;
    }
    this.buscarDatosRepresentante(RFC_VALUE);
  }

  private buscarDatosRepresentante(rfc: string): void {
     const PAYLOAD: RfcSearchPayload = {
          rfcRepresentanteLegal: rfc
        };
        this.datosSolicitudService
          .buscarRepresentantePorRfc(this.idProcedimiento.toString(), PAYLOAD)
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe({
            next: (response) => {
              if (response?.codigo === '00' && Array.isArray(response.datos) && response.datos.length > 0) {
                this.procesarDatosRepresentante(response.datos[0]);
              } else {
                console.warn('Respuesta no válida del servidor:', response);
                this.toastr.warning('No se encontraron datos para el RFC proporcionado', 'Búsqueda de RFC');
                this.mostrarDatosPredeterminados();
              }
            },
            error: (error) => {
              console.error('Error en la búsqueda de RFC:', error);
              this.toastr.error('Error al buscar los datos del representante', 'Error de Búsqueda');
              this.mostrarErrorRfc('Error al conectar con el servidor. Por favor, intente nuevamente.');
            }
          });
  }
 /**
   * Muestra notificación de error para RFC inválido
   */
  private mostrarErrorRfc(mensaje: string): void {
    this.toastr.error(mensaje, 'Error de Validación');
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarAlerta = true;
  }
    actualizarStore(): void {
    const VALORES_COMPLETOS = this.representanteLegalForm.getRawValue();
    this.domicilioStore.setNombreRazonSocial(VALORES_COMPLETOS.nombreRazonSocial);
    this.domicilioStore.setApellidoPaterno(VALORES_COMPLETOS.apellidoPaterno);
    this.domicilioStore.setApellidoMaterno(VALORES_COMPLETOS.apellidoMaterno);
    this.datasolicituActualizar.emit(VALORES_COMPLETOS); 
  }
 /**
   * Procesa los datos del representante obtenidos de la API
   */
  private procesarDatosRepresentante(data: RepresentanteData): void {
    // Usar el mismo campo de nombre para todos los procedimientos
    const NOMBRE_FIELD = data.nombre;
    
    // Usar datos de la API si están disponibles, de lo contrario usar predeterminados
    const DATOS_FORMULARIO = {
      nombreRazonSocial: NOMBRE_FIELD,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,

    };

  this.representanteLegalForm.patchValue(DATOS_FORMULARIO);
  this.actualizarStore();
  const NOMBRE_CONTROL = this.representanteLegalForm.get('nombreRazonSocial');
  const PATERNO_CONTROL = this.representanteLegalForm.get('apellidoPaterno');
  const MATERNO_CONTROL = this.representanteLegalForm.get('apellidoMaterno');
  if (NOMBRE_CONTROL && NOMBRE_CONTROL.enabled) { NOMBRE_CONTROL.disable(); }
  if (PATERNO_CONTROL && PATERNO_CONTROL.enabled) { PATERNO_CONTROL.disable(); }
  if (MATERNO_CONTROL && MATERNO_CONTROL.enabled) { MATERNO_CONTROL.disable(); }

  // Mostrar solo el toast de éxito, no el modal
  this.toastr.success('Datos del representante cargados exitosamente', 'Búsqueda de RFC');
  // No llamar a mostrarNotificacionExito, así no aparece el modal
  }

  private mostrarDatosPredeterminados(): void {
    this.representanteLegalForm.patchValue({
      nombreRazonSocial: '',
      apellidoPaterno: '',
      apellidoMaterno: ''
    });
  }

  /**
   * @description
   * Estado actual de la solicitud.
   */
  public solicitudState!: DomicilioState;

  /**
   * @description
   * Notificador para destruir observables y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param domicilioStore Store para gestionar el estado del trámite.
   * @param domicilioquery Query para obtener datos del estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private domicilioStore: DomicilioStore,
    private domicilioquery: DomicilioQuery,
    private consultaioQuery: ConsultaioQuery,
    private toastr: ToastrService,
    private datosSolicitudService: DatosSolicitudService
  ) {
    // Constructor
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y sus valores iniciales basados en el estado de la solicitud.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    
    this.domicilioquery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
        this.representanteLegalForm?.patchValue({
          rfc: this.solicitudState?.rfc,
          nombreRazonSocial: this.solicitudState?.nombreRazonSocial,
          apellidoPaterno: this.solicitudState?.apellidoPaterno,
          apellidoMaterno: this.solicitudState?.apellidoMaterno
        });
      })
    ).subscribe();

    this.inicializarEstadoFormulario();
    setTimeout(() => {
      this.handleTipoTramiteChange(this.tipoTramite);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoTramite'] && !changes['tipoTramite'].firstChange) {
      this.handleTipoTramiteChange(changes['tipoTramite'].currentValue);
    }
  }

  handleTipoTramiteChange(value: string): void {
    const RFC_CONTROL = this.representanteLegalForm.get('rfc');
    if (RFC_CONTROL) {
      if (value && value !== '') {
        RFC_CONTROL.enable();
        this.botonOcultar = true;
      } else {
        RFC_CONTROL.disable();
        this.botonOcultar = false;
      }
    } else {
      console.warn('[handleTipoTramiteChange] RFC control not found');
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }

  }
  /**
  * Inicializa el formulario reactivo para capturar el valor de 'registro'.
  * Suscribe al estado almacenado en el store mediante el query `domicilioquery.selectSolicitud$`
  * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
  * con el valor inicial obtenido del store.
  */

  inicializarFormulario(): void {
    this.representanteLegalForm = this.fb.group({
      rfc: [{ value: this.solicitudState?.rfc, disabled: true }, [Validators.required, Validators.maxLength(13)]],
      nombreRazonSocial: [{ value: this.solicitudState?.nombreRazonSocial, disabled: true }, Validators.required],
      apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno, disabled: true }, Validators.required],
      apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno, disabled: true }],
    });
    // RFC stays disabled by default, will be enabled only after radio selection
    // RFC stays disabled by default, will be enabled when radio is selected
  }


  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.representanteLegalForm.disable();
    } else {
      this.representanteLegalForm.enable();
    } 
  }

  /**
     * @description
     * Método que actualiza el estado del store con los valores del formulario.
     * @param form Formulario reactivo.
     * @param campo Campo del formulario que se desea actualizar.
     * @param metodoNombre Nombre del método del store que se invocará.
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DomicilioStore): void {
    const VALOR = form.get(campo)?.value;
    (this.domicilioStore[metodoNombre] as (value: string | number) => void)(VALOR);
  }

  public getStoreState(): any {
    return this.domicilioquery.getValue();
  }

  validarClickDeBoton(): boolean {
    let ISVALID = true;
    if(this.representanteLegalForm .invalid){
     this.representanteLegalForm .markAllAsTouched();
     ISVALID = false;
    }
    return ISVALID;
}
}
