/**
 * Componente Angular para gestionar subcontratistas y plantas subfabricantes.
 * Importa modelos, componentes compartidos y servicios necesarios.
 */
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input,OnChanges,OnInit,Output,ViewChild} from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import {
  DatosSubcontratista,
  PlantasSubfabricante,
} from '../../models/empresas-subfabricanta.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DetallesPlantasComponent } from '../detalles-plantas/detalles-plantas.component';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

import {Subject,map,takeUntil } from 'rxjs';
import { Tramite80101State, Tramite80101Store } from '../../../tramites/80103/estados/tramite80101.store';
import { ComplimentosService } from '../../services/complimentos.service';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Tramite80101Query } from '../../../tramites/80103/estados/tramite80101.query';
/**
 * Componente para mostrar y gestionar subfabricantes y sus plantas.
 * Utiliza componentes compartidos y formularios reactivos.
 */
@Component({
  selector: 'empresass-subfabricante',
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    DetallesPlantasComponent,
    NotificacionesComponent
  ],
  templateUrl: './empresas-subfabricante.component.html',
  styleUrl: './empresas-subfabricante.component.scss',
})
/**
 * Componente para gestionar las empresas subfabricantes.
 * Este componente permite gestionar los datos de las empresas subfabricantes,
 * incluyendo la selección de plantas, la configuración de la tabla y el cambio de estados.
 */
export class EmpresasSubfabricantesComponent implements OnInit, OnChanges {
/**
 * Guarda los datos del formulario de detalles de plantas.
 * Valida el formulario y muestra notificaciones según el resultado.
 */
  @ViewChild(DetallesPlantasComponent)
detallesPlantasComponent!: DetallesPlantasComponent; 
  /**
   * Notificación para mostrar mensajes al usuario.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Referencia al elemento modal para complementar plantas.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una referencia
   * al elemento del DOM identificado por el template variable `complementarPlantas`.
   * 
   * @type {ElementRef} modalElement - Referencia al elemento modal.
   */
  @ViewChild('complementarPlantas') modalElement!: ElementRef;
  /**
   * Lista de estados del catálogo. Esta propiedad almacena los diferentes estados disponibles para ser seleccionados.
   * @property {Catalogo[]} _estadoCatalogo
   * @private
   * @description Esta propiedad privada contiene un array de objetos `Catalogo`, que representan los diferentes estados disponibles.
   */
  private _estadoCatalogo: Catalogo[] = [];
 /**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Tramite80101State;
  /**
   * Datos de las plantas subfabricantes disponibles. Esta propiedad almacena las plantas que están disponibles para el proceso.
   * @property {PlantasSubfabricante[]} _datosTablaSubfabricantesDisponibles
   * @private
   * @description Esta propiedad privada contiene un array de objetos `PlantasSubfabricante`, que representan las plantas disponibles para ser seleccionadas.
   */
  private _datosTablaSubfabricantesDisponibles: PlantasSubfabricante[] = [];

  /**
   * Configuración de la tabla para las plantas disponibles. Define cómo se deben mostrar las columnas de las plantas disponibles en la tabla.
   * @property {ConfiguracionColumna<PlantasSubfabricante>[]} _configuracionTablaDisponibles
   * @private
   * @description Esta propiedad privada contiene un array de objetos `ConfiguracionColumna`, que describen la configuración de la tabla para las plantas disponibles.
   */
  private _configuracionTablaDisponibles: ConfiguracionColumna<PlantasSubfabricante>[] =
    [];

  /**
   * Configuración de la tabla para las plantas seleccionadas. Define cómo se deben mostrar las columnas de las plantas seleccionadas en la tabla.
   * @property {ConfiguracionColumna<PlantasSubfabricante>[]} _configuracionTablaSeleccionadas
   * @private
   * @description Esta propiedad privada contiene un array de objetos `ConfiguracionColumna`, que describen la configuración de la tabla para las plantas seleccionadas.
   */
  private _configuracionTablaSeleccionadas: ConfiguracionColumna<PlantasSubfabricante>[] =
    [];
  /**
   * Datos de las plantas subfabricantes seleccionadas. Esta propiedad almacena las plantas que han sido seleccionadas por el usuario.
   * @property {PlantasSubfabricante[]} _datosTablaSubfabricantesSeleccionadas
   * @private
   * @description Esta propiedad privada contiene un array de objetos `PlantasSubfabricante`, que representan las plantas seleccionadas por el usuario.
   */
  private _datosTablaSubfabricantesSeleccionadas: PlantasSubfabricante[] = [];
  /**
   * Formulario de datos del subcontratista. Este formulario contiene los campos necesarios para registrar o editar los datos de un subcontratista.
   * @property {FormGroup} _formularioDatosSubcontratista
   * @private
   * @description Esta propiedad privada almacena el formulario de datos del subcontratista, que incluye campos como el RFC y estado del subcontratista.
   */
  private _formularioDatosSubcontratista!: FormGroup;
/**
   * Establece el estado del catálogo de las plantas subfabricantes.
   * @param valor - Lista de estados del catálogo.
   */
  @Input() tabIndex: number = 0;

 
  /**
   * Recibe un arreglo de objetos de tipo Catalogo que representa el estado actual del catálogo.
   * Este input se utiliza para mostrar o manipular la información relacionada con el catálogo en el componente.
   *
   * @type {Catalogo[]}
   */
  @Input() estadoCatalogo!:Catalogo[];

  
  /**
   * Establece los datos de las plantas subfabricantes disponibles en la tabla.
   * @param valor - Lista de plantas subfabricante disponibles.
   */
  @Input()
  set datosTablaSubfabricantesDisponibles(valor: PlantasSubfabricante[]) {
    this._datosTablaSubfabricantesDisponibles = valor;
  }

  /**
   * Obtiene los datos de las plantas subfabricantes disponibles.
   * @returns {PlantasSubfabricante[]} - Lista de plantas subfabricante disponibles.
   */
  get datosTablaSubfabricantesDisponibles(): PlantasSubfabricante[] {
    return this._datosTablaSubfabricantesDisponibles;
  }

  /**
   * Establece la configuración de la tabla de plantas subfabricantes disponibles.
   * @param valor - Configuración de columnas para las plantas disponibles.
   */
  @Input()
  set configuracionTablaDisponibles(
    valor: ConfiguracionColumna<PlantasSubfabricante>[]
  ) {
    this._configuracionTablaDisponibles = valor;
  }

  /**
   * Obtiene la configuración de la tabla de plantas subfabricantes disponibles.
   * @returns {ConfiguracionColumna<PlantasSubfabricante>[]} - Configuración de la tabla.
   */
  get configuracionTablaDisponibles(): ConfiguracionColumna<PlantasSubfabricante>[] {
    return this._configuracionTablaDisponibles;
  }

  /**
   * Establece la configuración de la tabla de plantas subfabricantes seleccionadas.
   * @param valor - Configuración de columnas para las plantas seleccionadas.
   */
  @Input()
  set configuracionTablaSeleccionadas(
    valor: ConfiguracionColumna<PlantasSubfabricante>[]
  ) {
    this._configuracionTablaSeleccionadas = valor;
  }

  /**
   * Obtiene la configuración de la tabla de plantas subfabricantes seleccionadas.
   * @returns {ConfiguracionColumna<PlantasSubfabricante>[]} - Configuración de la tabla.
   */
  get configuracionTablaSeleccionadas(): ConfiguracionColumna<PlantasSubfabricante>[] {
    return this._configuracionTablaSeleccionadas;
  }

  /**
   * Establece los datos de las plantas subfabricantes seleccionadas en la tabla.
   * @param valor - Lista de plantas subfabricante seleccionadas.
   */
  @Input()
  set datosTablaSubfabricantesSeleccionadas(valor: PlantasSubfabricante[]) {
    this._datosTablaSubfabricantesSeleccionadas = valor;
  }

  /**
   * Obtiene los datos de las plantas subfabricantes seleccionadas.
   * @returns {PlantasSubfabricante[]} - Lista de plantas subfabricante seleccionadas.
   */
  get datosTablaSubfabricantesSeleccionadas(): PlantasSubfabricante[] {
    return this._datosTablaSubfabricantesSeleccionadas;
  }

 /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
@Input()
set formularioDatosSubcontratista(valor: FormGroup) {
  if (this._formularioDatosSubcontratista && valor) {
    this._formularioDatosSubcontratista.setValue(valor.value);
  }
}

  /**
   * Obtiene el formulario de datos del subcontratista.
   * @returns {FormGroup} - El formulario de datos del subcontratista.
   */
  get formularioDatosSubcontratista(): FormGroup {
    return this._formularioDatosSubcontratista;
  }

  
   /**
* @description
* Objeto que representa una nueva notificación.
* Se utiliza para mostrar mensajes de alerta o información al usuario.
*/
  public NotValidRfcNotificacion!: Notificacion;


 /**
   * Establece el estado de error para el RFC.
   * 
   * Cuando el valor es `true`, se muestra un modal indicando que el RFC no es válido.
   * 
   * @param value Indica si existe un error en el RFC.
   */
  @Input() set rfcError(value: boolean) {
    if (value) {
      this.notValidRfcModal();
    }
  }

  /**
   * Evento emitido cuando cambia el RFC del subcontratista.
   * @event alCambiarRFC
   * @type {EventEmitter<DatosSubcontratista>}
   * @description Este evento se emite cuando se realiza un cambio en el RFC del subcontratista.
   */
  @Output() alCambiarRFC = new EventEmitter<DatosSubcontratista>();

  /**
   * Evento emitido cuando cambia el estado seleccionado.
   * @event alCambiarEstado
   * @type {EventEmitter<Catalogo>}
   * @description Este evento se emite cuando el usuario selecciona un nuevo estado para el subcontratista.
   */
  @Output() alCambiarEstado = new EventEmitter<Catalogo>();

  /**
   * Evento emitido para iniciar una búsqueda.
   * @event buscar
   * @type {EventEmitter}
   * @description Este evento se emite cuando el usuario solicita realizar una búsqueda.
   */
  @Output() buscar = new EventEmitter();

  /**
   * Evento emitido cuando se seleccionan plantas para agrupar.
   * @event plantasPorAgrupar
   * @type {EventEmitter<PlantasSubfabricante[]>}
   * @description Este evento se emite cuando el usuario selecciona plantas para agrupar.
   */
  @Output() plantasPorAgrupar = new EventEmitter<PlantasSubfabricante[]>();

  /**
   * Evento emitido cuando se seleccionan plantas para eliminar.
   * @event plantasPorEliminar
   * @type {EventEmitter<PlantasSubfabricante[]>}
   * @description Este evento se emite cuando el usuario selecciona plantas para eliminar.
   */
  @Output() plantasPorEliminar = new EventEmitter<PlantasSubfabricante[]>();
  /**
   * Evento emitido cuando se seleccionan plantas para eliminar.
   * @event plantasPorComplementar
   * @type {EventEmitter<PlantasSubfabricante[]>}
   * @description Este evento se emite cuando el usuario selecciona plantas para eliminar.
   */
  @Output() plantasPorComplementar = new EventEmitter<PlantasSubfabricante[]>();

  /**
   * Tipo de selección de la tabla.
   * @property {TablaSeleccion} tablaSeleccion
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Lista de plantas disponibles seleccionadas por el usuario.
   * @property {PlantasSubfabricante[]} plantasDisponiblesSeleccionadas
   * @description Esta propiedad almacena las plantas que el usuario ha seleccionado de la lista de plantas disponibles.
   */
  plantasDisponiblesSeleccionadas: PlantasSubfabricante[] = [];

  /**
   * Lista de plantas seleccionadas para algún proceso posterior.
   * @property {PlantasSubfabricante[]} plantasSeleccionadas
   * @description Esta propiedad almacena las plantas que han sido seleccionadas por el usuario para realizar algún proceso (como eliminación o agrupación).
   */
  plantasSeleccionadas: PlantasSubfabricante[] = [];
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

/**
 * Indica si se deben mostrar los detalles de la planta en la interfaz.
 * Valor booleano que controla la visibilidad del componente de detalles.
 */
  public showDetallesPlanta: boolean = false;
  /**
   * Constructor para inicializar el formulario de datos del subcontratista.
   * @param fb - FormBuilder para la creación del formulario reactivo.
   */
  constructor(private fb: FormBuilder, private router: Router,private consultaioQuery: ConsultaioQuery, public query: Tramite80101Query,
      private store: Tramite80101Store,private complimentosService: ComplimentosService,private servicioDeFormularioService: ServicioDeFormularioService
  ) { 
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();
    }
     /**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
    this.obtenerEstados();
  }
 /**
   * Método para inicializar el formulario reactivo con los datos de la solicitud.
   * 
   * Este método configura los campos del formulario con los valores actuales del estado de la solicitud
   * y aplica las validaciones necesarias. También deshabilita ciertos campos y establece valores predeterminados.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.inicializarFormularioDatosSubcontratista();
    }  
  }
    /**
   * @comdoc
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   * - Si no aplica ninguna de las condiciones anteriores, no realiza ninguna acción adicional.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormularioDatosSubcontratista();
      if (this.esFormularioSoloLectura) {
        this._formularioDatosSubcontratista.disable();        
      } else {
        this._formularioDatosSubcontratista.enable();       
      }
  }

  /**
   * Inicializa el formulario de datos del subcontratista con los campos `rfc` y `estado`, ambos requeridos.
   * @method inicializarFormularioDatosSubcontratista
   * @description Este método configura el formulario de datos del subcontratista con los campos `rfc` y `estado`, ambos con validación requerida.
   */
  inicializarFormularioDatosSubcontratista(): void {
      this.query.selectSolicitud$
              .pipe(
                takeUntil(this.destroyNotifier$),
                map((seccionState) => {
                  this.solicitudState = seccionState as Tramite80101State;
                  this._formularioDatosSubcontratista = this.fb.group({
                    rfc: [this.solicitudState?.empressaSubFabricantePlantas?.datosSubcontratista?.rfc || '', Validators.required],
                    estado: [this.solicitudState?.empressaSubFabricantePlantas?.datosSubcontratista?.estado || '', Validators.required],     
                  });
                })
              )
              .subscribe();
    this._formularioDatosSubcontratista = this.fb.group({
      rfc: [this.solicitudState.empressaSubFabricantePlantas.datosSubcontratista.rfc, Validators.required],
      estado: [this.solicitudState.empressaSubFabricantePlantas.datosSubcontratista.estado, Validators.required],     
    });
  }

  /**
   * Emite el evento con el RFC y el estado actual del subcontratista.
   * @method cambiarRFC
   * @description Este método emite el evento `alCambiarRFC` con los valores del RFC y estado del formulario actual.
   */
  cambiarRFC(): void {
    this.alCambiarRFC.emit({
      rfc: this.formularioDatosSubcontratista.get('rfc')?.value,
      estado: this.formularioDatosSubcontratista.get('estado')?.value,
    });
  }

  /**
   * Emite el evento con el estado seleccionado si el RFC está presente en el formulario.
   * @method cambiarEstado
   * @param {Catalogo} estadoSeleccionado - El objeto que contiene el estado seleccionado por el usuario.
   * @description Este método emite el evento `alCambiarEstado` con el estado seleccionado solo si el RFC ya está ingresado en el formulario.
   */
  cambiarEstado(estadoSeleccionado: Catalogo): void {
    if (this.formularioDatosSubcontratista.get('rfc')?.value) {
      this.alCambiarEstado.emit(estadoSeleccionado);
    }
  }

  /**
   * Emite el evento de búsqueda.
   * @method onBuscar
   * @description Este método emite el evento `buscar` para iniciar el proceso de búsqueda.
   */
  onBuscar(): void {
    this.buscar.emit();
  }

  /**
   * Asigna las plantas seleccionadas de la lista de plantas disponibles.
   * @method onPlantasDisponiblesSeleccionadas
   * @param {PlantasSubfabricante[]} plantasDisponiblesSeleccionadas - Lista de plantas seleccionadas por el usuario.
   * @description Este método asigna las plantas seleccionadas a la propiedad `plantasDisponiblesSeleccionadas` si hay elementos seleccionados.
   */
  onPlantasDisponiblesSeleccionadas(
    plantasDisponiblesSeleccionadas: PlantasSubfabricante[]
  ): void {
    if (plantasDisponiblesSeleccionadas.length > 0) {
      this.plantasDisponiblesSeleccionadas = plantasDisponiblesSeleccionadas;
    }
  }

  /**
   * Emite el evento para agrupar las plantas seleccionadas.
   * @method agregarPlantas
   * @description Este método emite el evento `plantasPorAgrupar` con las plantas disponibles seleccionadas.
   */
  agregarPlantas(): void {
    this.plantasDisponiblesSeleccionadas.forEach(planta => {
      const INDEX = this.datosTablaSubfabricantesDisponibles.findIndex(row => row === planta);
      if (INDEX !== -1) {
      this.datosTablaSubfabricantesDisponibles.splice(INDEX, 1);
      }
    });
    this.datosTablaSubfabricantesDisponibles = [...this.datosTablaSubfabricantesDisponibles];
    this.plantasPorAgrupar.emit(this.plantasDisponiblesSeleccionadas);
  }

  /**
   * Asigna las plantas seleccionadas para algún proceso posterior.
   * @method onPlantasSeleccionadas
   * @param {PlantasSubfabricante[]} plantasSeleccionadas - Lista de plantas seleccionadas por el usuario.
   * @description Este método asigna las plantas seleccionadas a la propiedad `plantasSeleccionadas`.
   */
  onPlantasSeleccionadas(plantasSeleccionadas: PlantasSubfabricante[]): void {
    if (plantasSeleccionadas.length > 0) {
      this.plantasSeleccionadas = plantasSeleccionadas;
    }
  }

  /**
   * Emite el evento para eliminar las plantas seleccionadas.
   * @method eliminarPlantas
   * @description Este método emite el evento `plantasPorEliminar` con las plantas seleccionadas para ser eliminadas.
   */
  eliminarPlantas(): void {
    if (this.plantasSeleccionadas.length > 0) {
      this.plantasPorEliminar.emit(this.plantasSeleccionadas);
    }
  }

  /**
   * Emite el evento para complementar las plantas seleccionadas.
   * @returns {void}
   */
  complementarPlantas(): void {
    if (this.plantasSeleccionadas.length > 0) {
      this.plantasPorComplementar.emit(this.plantasSeleccionadas);
    }
  }

  /**
   * Abre un diálogo modal para complementar la información de una planta.
   * 
   * Este método verifica si el elemento modal (`modalElement`) está definido.
   * Si está definido, crea una instancia de la clase `Modal` utilizando el 
   * elemento nativo del modal y muestra el modal llamando al método `show()`.
   * 
   * @returns {void} Este método no devuelve ningún valor.
   */
  abrirDialogoComplementarPlanta(): void {
    this.showDetallesPlanta = true;
  }

/**
 * Cierra el modal de detalles de la planta.
 * Establece showDetallesPlanta en false para ocultar el componente.
 */
  cerrarDetallesModal(): void { 
    this.showDetallesPlanta = false;  
  }

  /**
 * Obtiene la lista de estados llamando al servicio `complimentosService`.
 * Se suscribe al observable retornado por `getEstado()` y muestra la respuesta en la consola.
 * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
 */
obtenerEstados():void {
    this.complimentosService.getEstado().pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
      this.estadoCatalogo = res.datos;
    });
    
  }

  /**
   * Muestra una notificación de alerta cuando el RFC consultado no tiene ningún domicilio con tipo de planta válido.
   * 
   * La notificación es de tipo "alerta" y categoría "peligro", con modo de acción. 
   * El mensaje indica la ausencia de domicilios válidos y se muestra durante 2000 ms.
   * El botón de aceptar está disponible, mientras que el de cancelar no se muestra.
   */
  notValidRfcModal(): void {
    this.NotValidRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'El RFC consultado no tiene ningun domicilio con tipo de planta válido.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

    /** Sincroniza los datos de las tablas de Anexo Dos y Tres con el servicio de formularios al detectar cambios. */
  ngOnChanges(): void {
    if (this.datosTablaSubfabricantesSeleccionadas.length === 0) {
      this.servicioDeFormularioService.registerArray('datosTablaSubfabricantesSeleccionadas', this.datosTablaSubfabricantesSeleccionadas);
    } else {
      this.servicioDeFormularioService.setArray('datosTablaSubfabricantesSeleccionadas', this.datosTablaSubfabricantesSeleccionadas);
    }
  }

/**
 * Guarda los datos del formulario de detalles de plantas.
 * Valida el formulario y muestra notificaciones según el resultado.
 */
  onGuardarPlantas(): void { 
  const CHILD_FORM = this.detallesPlantasComponent.formularioDatosPlantas;

  if (CHILD_FORM && CHILD_FORM.invalid) {
    CHILD_FORM.markAllAsTouched();
    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
  }
  else {
    this.showDetallesPlanta = false;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: 'La operación se realizó exitosamente.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  }
}

