import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  DatosDomicilioLegalState,
  DatosDomicilioLegalStore,
} from '../../estados/stores/datos-domicilio-legal.store';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Notificacion,
  REGEX_CORREO_ELECTRONICO,
  REGEX_RFC_FISICA,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  NotificacionesComponent,
  Pedimento,
} from '@libs/shared/data-access-user/src';
import { OnChanges, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfiguracionVisibilidad } from '../../models/datos-domicilio-legal.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DEFAULT_CONFIGURACION_VISIBILIDAD } from '../../constantes/datos-domicilio-legal.enum';
import { DatosDelEstablecimientoRFCComponent } from '../datos-del-establecimiento-rfc/datos-del-establecimiento-rfc.component';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalService } from '../../services/datos-domicilio-legal.service';
import { DomicilioComponent } from '../domicilio-establecimiento/domicilio-establecimiento.component';
import { ManifiestosComponent } from '../manifiestos-declaraciones/manifiestos-declaraciones.component';
import { RepresentanteLegalRfcComponent } from '../representante-legal-rfc/representante-legal-rfc.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/**
 * Componente responsable de gestionar y mostrar los datos principales del formulario,
 * incluyendo domicilio, manifiestos y representante legal.
 */
@Component({
  selector: 'app-datos-de-la',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    DomicilioComponent,
    ManifiestosComponent,
    NotificacionesComponent,
    RepresentanteLegalRfcComponent,
    TooltipModule,
    DatosDelEstablecimientoRFCComponent
  ],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.css',
})
export class DatosDeLaComponent implements OnInit, OnDestroy, OnChanges {
  @Output() establecimientoFormValidity = new EventEmitter<boolean>();
  @Output() domicilioFormValidity = new EventEmitter<boolean>();
  @Output() manifiestosFormValidity = new EventEmitter<boolean>();
  @Output() representanteLegalFormValidity = new EventEmitter<boolean>();

  @ViewChild(DatosDelEstablecimientoRFCComponent) datosDelEstablecimientoRfcComp!: DatosDelEstablecimientoRFCComponent;
  @ViewChild(DomicilioComponent) domicilioComp!: DomicilioComponent;
  @ViewChild(ManifiestosComponent) manifiestosComp!: ManifiestosComponent;
  @ViewChild(RepresentanteLegalRfcComponent) representanteLegalRfcComp!: RepresentanteLegalRfcComponent;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  @Input() idProcedimiento!: number;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Bandera que indica si el RFC ingresado es válido. Se utiliza para controlar la validación del campo en el formulario. */
  rfcValido = false;

  /**
 * Bandera que indica si se debe mostrar u operar con datos de identificación en el formulario.
 * Se recibe como entrada desde el componente padre y su valor por defecto es falso.
 */
  @Input() identificacion: boolean = false;
  /**
   * Indica si el campo GarantiasOfrecidasVisible es visible.
   */
  @Input() isGarantiasOfrecidasVisible: boolean = false;
  /**
   * Indica si el campo AvisoLicenciaVisible es visible.
   */
  @Input() isAvisoLicenciaVisible: boolean = true;

  /**
   * Indica si el campo AduanasEntradaVisible es visible.
   */
  @Input() isAduanasEntradaVisible: boolean = false;

  /**
   * Indica si el campo de domicilio debe estar habilitado.
   * Este input controla el estado habilitado/deshabilitado de la sección de domicilio en el componente.
   */
  @Input() tieneDomicilioHabilitar: boolean = false;

  /**
 * Bandera que indica si se debe validar el estado dentro del formulario.
 * Se recibe como entrada desde el componente padre y su valor por defecto es falso.
 */
  @Input() estadoValidte: boolean = false;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: DatosDomicilioLegalState;

  /**
   * Indica si el campo esPaginacionVisible es visible.
   */
  @Input() esPaginacionVisible: boolean = false;

  /** Controla la visibilidad y habilitación del campo `número de registro`.  
  * Si es `true`, se agrega el control al formulario con validaciones. */
  @Input() mostrarNumeroRegistro: boolean = true;

  /**
   * Indica si el solicitante tiene uso específico.
   * Este input se utiliza para determinar si se debe mostrar información adicional relacionada con el uso específico del solicitante.
   */
  @Input() tieneUsoEspecifico: boolean = true;

  /**
   * Método que se llama cuando se elimina un pedimento.
   * @param {boolean} borrar - Indica si se debe eliminar el pedimento.
   * Si es verdadero, se elimina el pedimento en la posición `elementoParaEliminar` del arreglo `pedimentos`.
   */
  eliminarPedimento(borrar: boolean): void {
    this.alternarControlesDeFormulario();
    if (borrar) {
      this.tieneDomicilioHabilitar = false;
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      this.service.emitEvent(this.tieneDomicilioHabilitar);
    }
  }

  /**
   * @description
   * Arreglo que almacena los pedimentos asociados al establecimiento.
   * Cada pedimento contiene información relevante para el trámite.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * @description
   * Variable que almacena el índice del elemento que se desea eliminar de la lista de pedimentos.
   * Utilizada para realizar operaciones de eliminación en el arreglo `pedimentos`.
   */
  elementoParaEliminar!: number;

   /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

   /**
   * Configuración de visibilidad de los campos.
   */
   @Input() configuracionVisibilidad: ConfiguracionVisibilidad = DEFAULT_CONFIGURACION_VISIBILIDAD

  /**
   * Constructor del componente.
   * @param fb
   * @param datosDomicilioLegalStore
   * @param datosDomicilioLegalQuery
   */
  constructor(
    public readonly fb: FormBuilder,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore,
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private consultaioQuery: ConsultaioQuery,
    private service: DatosDomicilioLegalService,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private validacionesService: ValidacionesFormularioService
  ) {
    // Inicializa el formulario.
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
      })
    )
    .subscribe()
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
    // this.getEstadoCatalogo();
  }
    /**
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
     this.forma = this.fb.group({
      rfcDel: [{ value: this.solicitudState?.rfcDel, disabled: true },Validators.pattern(REGEX_RFC_FISICA)],
      denominacion: [
        { value: this.solicitudState?.denominacion, disabled: true },
        Validators.required,
      ],
      correo: [
        { value: this.solicitudState?.correo, disabled: true },
        [Validators.required,Validators.pattern(REGEX_CORREO_ELECTRONICO)]
      ],
    });
  }

  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
    inicializarFormulario(): void {
      this.datosDomicilioLegalQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe();
        
    }

  /**
   * Grupo de formularios principal.
   * @property {FormGroup} forma
   */
  forma!: FormGroup;

  /**
   * Método que se llama cuando se inicializa el componente
   * */
  ngOnInit(): void {
  this.datosDomicilioLegalQuery.selectSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    )
    .subscribe();
  this.forma = this.fb.group({
    rfcDel: [{ value: this.solicitudState?.rfcDel, disabled: true },Validators.pattern(REGEX_RFC_FISICA)],
    denominacion: [{ value: this.solicitudState?.denominacion, disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,\-&]+$/)]],
    correo: [
      { value: this.solicitudState?.correo, disabled: true },
      [Validators.required,Validators.pattern(REGEX_CORREO_ELECTRONICO)]
    ],
  });
  this.servicioDeFormularioService.registerForm('datosSolicitudForm', this.forma);
  this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
    if (formName === 'datosSolicitudForm') {
      this.forma.markAllAsTouched();
    }
  })
  this.inicializarEstadoFormulario();
  }

  /**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.validarClickDeBoton();
      });
    }
  }

  /**
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param campo El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.forma, campo);
  }

  /**
   * Método que se llama cuando se envía el formulario.
   * Se utiliza para establecer los valores en el store de DatosDomicilioLegal.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Método que se llama cuando se envía el formulario.
   */
  alternarControlesDeFormulario(): void {
    Object.keys(this.forma.controls).forEach((controlName) => {
      const CONTROL = this.forma.get(controlName);
      if (CONTROL?.disabled) {
        CONTROL.enable();
      }
    });
  }
  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof DatosDomicilioLegalStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.datosDomicilioLegalStore[metodoNombre] as (
        value: string | number | boolean
      ) => void
    )(VALOR);
    this.servicioDeFormularioService.setFormValue('datosSolicitudForm', { [campo]: VALOR });
  }
  onRfcValidoChange(valor: boolean):void {
    this.rfcValido = valor;
  }

  /** Emite la validez del formulario de establecimiento al componente padre. */
  establecimientoFormValidityChange(event: boolean):void {
    this.establecimientoFormValidity.emit(event);
  }

  /** Emite la validez del formulario de domicilio al componente padre. */
  domicilioFormValidityChange(event: boolean):void {
    this.domicilioFormValidity.emit(event);
  }

  /** Emite la validez del formulario de manifiestos al componente padre. */
  manifiestosFormValidityChange(event: boolean):void {
    this.manifiestosFormValidity.emit(event);
  }

  /** Emite la validez del formulario de representanteLegal al componente padre. */
  representanteLegalFormValidityChange(event: boolean):void {
    this.representanteLegalFormValidity.emit(event);
  }

  validarClickDeBoton(): boolean {
    let ISVALID = true;
    if(!this.datosDelEstablecimientoRfcComp.validatorButtonClick() ){
      ISVALID = false;
    }
    if(!this.domicilioComp.validatorButtonClick()){
      ISVALID = false;
    }
    if(!this.manifiestosComp.validarClickDeBoton()){
      ISVALID = false;
    }
    if(!this.representanteLegalRfcComp.validarClickDeBoton()){
      ISVALID = false;
    }
    return ISVALID;
  }
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene el valor del checkbox de aviso desde el componente de domicilio.      
   */
  obtenerValorCheckboxAviso(): boolean {
  return this.domicilioComp?.domicilio?.get('avisoCheckbox')?.value ?? false;
}
}
