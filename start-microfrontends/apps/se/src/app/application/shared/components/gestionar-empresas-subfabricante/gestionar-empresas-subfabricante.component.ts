import {
  Catalogo,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  TablaSeleccion,
  doDeepCopy,
  esValidArray,
  esValidObject,
  TablaDinamicaComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, OnDestroy, SimpleChanges } from '@angular/core';

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
import { Subject, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../services/complimentos.service';
import { ContenedorComplementarPlantasComponent } from '../../../tramites/80101/component/contenedor-complementar-plantas/contenedor-complementar-plantas.component';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
@Component({
  selector: 'app-gestionar-empresas-subfabricante',
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    ContenedorComplementarPlantasComponent,
    NotificacionesComponent
  ],
  templateUrl: './gestionar-empresas-subfabricante.component.html',
  styleUrl: './gestionar-empresas-subfabricante.component.scss',
})
/**
 * Componente para gestionar las empresas subfabricantes.
 * Este componente permite gestionar los datos de las empresas subfabricantes,
 * incluyendo la selección de plantas, la configuración de la tabla y el cambio de estados.
 */
export class GestionarEmpresasSubfabricantesComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Lista de estados del catálogo. Esta propiedad almacena los diferentes estados disponibles para ser seleccionados.
   * @property {Catalogo[]} _estadoCatalogo
   * @private
   * @description Esta propiedad privada contiene un array de objetos `Catalogo`, que representan los diferentes estados disponibles.
   */
  private _estadoCatalogo: Catalogo[] = [];

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

  @Input() tabIndex: number = 0;

    /**
     * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
     */
    private destroyNotifier$: Subject<void> = new Subject();

  
  /**
   * Recibe un arreglo de objetos de tipo Catalogo que representa el estado actual del catálogo.
   * Este input se utiliza para mostrar o manipular la información relacionada con el catálogo en el componente.
   *
   * @type {Catalogo[]}
   */
  estadoCatalogo!:Catalogo[];

  /**
   * Indica si se debe mostrar la tabla inicial.
   * Esta propiedad se utiliza para controlar la visibilidad de la tabla de subfabricantes.
   *
   * @type {boolean}
   * @default false
   */
  
  // @Input() showTablaInicial: boolean = false;

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

  @Input()
  /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
  set formularioDatosSubcontratista(valor: FormGroup | null) {
    if (valor) {
      this._formularioDatosSubcontratista = valor;
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
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Mensaje de error que se mostrará en la notificación
   */
  @Input() errorMessage: string = '';

  /**
   * Bandera para mostrar la notificación de error
   */
  @Input() showError: boolean = false;

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
   * Evento emitido cuando se cierra la notificación de error
   */
  @Output() errorNotificationClosed = new EventEmitter<void>();

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

  /**
   * Lista de plantas subfabricantes.
   */
  plantasSubmanufactureras: PlantasSubfabricante[] = [];

/**  
 * Indica si el modal complementario debe mostrarse.  
 * Valor booleano utilizado para controlar la visibilidad del modal.
 */
  public showComplementarModal = false;

/**
 * Referencia a la instancia del modal actualmente abierto.
 * Se utiliza para controlar el estado del modal y realizar acciones como cerrar o actualizar su contenido.
 * 
 * @private
 * @type {Modal | null}
 */
private modalRef: Modal | null = null;

/** Notificación para mostrar mensajes al usuario.
 */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description
   * Objeto que representa notificaciones generales del componente.
   * Se utiliza para mostrar diferentes tipos de mensajes al usuario.
   */
  public ComponentNotificacion!: Notificacion;

  /**
   * @description
   * Indica si la notificación actual requiere confirmación.
   */
  public isConfirmationNotification: boolean = false;
  /**
   * Constructor para inicializar el formulario de datos del subcontratista.
   * @param fb - FormBuilder para la creación del formulario reactivo.
   */
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private complimentosService: ComplimentosService,
    private servicioDeFormularioService: ServicioDeFormularioService, 
    private validacionesService: ValidacionesFormularioService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Si el formulario está deshabilitado (`formularioDeshabilitado` es verdadero),
   * desactiva el formulario de datos del subcontratista para evitar modificaciones.
   */
  ngOnInit(): void {
    // Solo inicializar formulario propio si no se proporciona formulario padre
    if (!this._formularioDatosSubcontratista) {
      this.inicializarFormularioDatosSubcontratista();
    }
    
    if (this.formularioDeshabilitado && this._formularioDatosSubcontratista) {
      this._formularioDatosSubcontratista.disable();
    }
    this.obtenerEstados();
  }

  /** Sincroniza los datos de las tablas de Anexo Dos y Tres con el servicio de formularios al detectar cambios. */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.datosTablaSubfabricantesSeleccionadas.length === 0) {
      this.servicioDeFormularioService.registerArray('datosTablaSubfabricantesSeleccionadas', this.datosTablaSubfabricantesSeleccionadas);
    } else {
      this.servicioDeFormularioService.setArray('datosTablaSubfabricantesSeleccionadas', this.datosTablaSubfabricantesSeleccionadas);
    }
    
    // Verificar si los valores del formulario cambiaron y si fueron limpiados
    if (this._formularioDatosSubcontratista) {
      const formValue = this._formularioDatosSubcontratista.value;
      if (formValue && formValue.rfc === '' && formValue.estado === '') {
        this.resetFormValidation();
      }
    }
  }

  /**
   * Inicializa el formulario de datos del subcontratista con los campos `rfc` y `estado`, ambos requeridos.
   * @method inicializarFormularioDatosSubcontratista
   * @description Este método configura el formulario de datos del subcontratista con los campos `rfc` y `estado`, ambos con validación requerida.
   */
  inicializarFormularioDatosSubcontratista(): void {
    this._formularioDatosSubcontratista = this.fb.group({
      rfc: ['', Validators.required],
      estado: ['', Validators.required],
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
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(formgroup: FormGroup, campo: string): boolean | null {
    return this.validacionesService.isValid(formgroup, campo);
  }

  /**
   * Emite el evento de búsqueda.
   * @method onBuscar
   * @description Este método valida los campos y emite el evento `buscar` solo si la validación pasa.
   */
  onBuscar(): void {
    const RFC_VALUE = this.formularioDatosSubcontratista.get('rfc')?.value;
    const ESTADO_VALUE = this.formularioDatosSubcontratista.get('estado')?.value;

    // Verificar si tanto RFC como Estado están vacíos (condición AND)
    if ((!RFC_VALUE || RFC_VALUE.trim() === '') && !ESTADO_VALUE) {
      this.showValidationNotification('Debe introducir el RFC.');
      return;
    }

    // Verificar si Estado está presente y RFC está vacío
    if (ESTADO_VALUE && (!RFC_VALUE || RFC_VALUE.trim() === '')) {
      this.showValidationNotification('Debe introducir el RFC.');
      return;
    }

    // Verificar si RFC está presente y Estado está vacío
    if ((RFC_VALUE && RFC_VALUE.trim() !== '') && !ESTADO_VALUE) {
      this.showValidationNotification('Selecciona la Entidad Federativa.');
      return;
    }

    // Si ambos campos están llenos, proceder con la búsqueda
    if (this.formularioDatosSubcontratista.valid) {
      this.buscar.emit();
    }
  }

  /**
   * Hides the modal dialog associated with the 'complementarPlanta' element.
   * Initializes the modal reference if the element exists and then hides the modal.
   */
  setGuardar(): void {
   const modalElement = document.getElementById('complementarPlanta');
    if (modalElement) {
      this.modalRef = new Modal(modalElement);
      this.modalRef.hide();
    }
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
   * @description Este método valida la selección y emite el evento `plantasPorAgrupar` con las plantas disponibles seleccionadas.
   */
  agregarPlantas(): void {
    // Validar que haya al menos una planta seleccionada
    if (this.plantasDisponiblesSeleccionadas.length === 0) {
      this.showValidationNotification('Selecciona al menos una planta donde se realizarán las operaciones IMMEX.');
      return;
    }

    // Emitir el evento con las plantas seleccionadas
    this.plantasPorAgrupar.emit(this.plantasDisponiblesSeleccionadas);
    // Remover las plantas seleccionadas de la lista de disponibles
    this._datosTablaSubfabricantesDisponibles = this._datosTablaSubfabricantesDisponibles.filter(
      planta => !this.plantasDisponiblesSeleccionadas.some(
        plantaSeleccionada => planta.rfc === plantaSeleccionada.rfc && 
                             planta.razonSocial === plantaSeleccionada.razonSocial &&
                             planta.calle === plantaSeleccionada.calle &&
                             planta.numExterior === plantaSeleccionada.numExterior
      )
    );
    // Limpiar la selección
    this.plantasDisponiblesSeleccionadas = [];
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
      this.plantasSubmanufactureras = plantasSeleccionadas;
    }
  }

  /**
   * Emite el evento para eliminar las plantas seleccionadas.
   * @method eliminarPlantas
   * @description Este método emite el evento `plantasPorEliminar` con las plantas seleccionadas para ser eliminadas.
   */
  eliminarPlantas(): void {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: this.plantasSeleccionadas.length === 0
          ? 'Selecciona la planta que desea eliminar.'
          : 'Debe seleccionar un tipo de figura para continuar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: this.plantasSeleccionadas.length === 0 ? '' : 'Cancelar',
      };
  }
/**
 * 
 * @param confirmacion - booleano que indica si se confirmó la eliminación.
 * Si se confirma, se restauran las plantas seleccionadas a la lista de disponibles,
 * se emite el evento `plantasPorEliminar` y se limpia la selección.
 */
  eliminarPedimentoDatos(confirmacion: boolean): void {
    if (confirmacion) {
     if (this.plantasSeleccionadas.length > 0) {
      // Agregar las plantas de vuelta a la lista de disponibles
      const PLANTAS_A_RESTAURAR = this.plantasSeleccionadas.filter(plantaSeleccionada => {
        // Verificar que la planta no esté ya en la lista de disponibles
        return !this._datosTablaSubfabricantesDisponibles.some(
          planta => planta.rfc === plantaSeleccionada.rfc && 
                   planta.razonSocial === plantaSeleccionada.razonSocial &&
                   planta.calle === plantaSeleccionada.calle &&
                   planta.numExterior === plantaSeleccionada.numExterior
        );
      });
      
      // Crear nueva array de disponibles con las plantas restauradas
      this._datosTablaSubfabricantesDisponibles = [
        ...this._datosTablaSubfabricantesDisponibles,
        ...PLANTAS_A_RESTAURAR
      ];
      
      // Emitir el evento para eliminar
      this.plantasPorEliminar.emit(this.plantasSeleccionadas);
      
      // Limpiar la selección
      this.plantasSeleccionadas = [];
    }
    }
  }
   /**
   * Emite el evento para complementar las plantas seleccionadas.
   * @returns {void}
   */
  complementarPlantas(): void {
    if (this.plantasSeleccionadas.length === 0) {
      this.showValidationNotification('Seleccione una planta.');
      return;
    }

    this.plantasPorComplementar.emit(this.plantasSeleccionadas);
    this.showComplementarModal = true;
    // Reiniciar array plantasSeleccionadas para prevenir problemas de selección en tabla
    this.plantasSeleccionadas = [];
  }

/**
 * Cierra el modal complementario.
 * Establece la variable de visibilidad del modal en false.
 */
  cerrarComplementarModal(): void {
    this.showComplementarModal = false;
    // Reiniciar array plantasSeleccionadas para prevenir problemas de selección en tabla
    this.plantasSeleccionadas = [];
  }
    /**
  /**
   * Obtiene la lista de estados llamando al servicio `complimentosService`.
   * Se suscribe al observable retornado por `getEstado()` y muestra la respuesta en la consola.
   * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
   */
  obtenerEstados():void {
      this.complimentosService.getEstado().pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
        if(esValidObject(res)) {
          const RESPONSE = doDeepCopy(res);
          if(esValidArray(RESPONSE.datos)) {
            this.estadoCatalogo = RESPONSE.datos;
          }
        }
      },error => {
        
      });
      
    }

  /**
   * Muestra una notificación de validación con el mensaje proporcionado.
   * @param mensaje - Mensaje a mostrar en la notificación
   */
  showValidationNotification(mensaje: string): void {
    this.isConfirmationNotification = false;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la confirmación del modal de notificaciones.
   * @param confirmacion - true si el usuario acepta, false si cancela
   */
  onNotificationConfirmacion(confirmacion: boolean): void {
    if (this.isConfirmationNotification) {
      // Manejar lógica de confirmación aquí si es necesario
      // Por ahora, solo limpiar la notificación
      this.ComponentNotificacion = undefined as unknown as Notificacion;
      this.isConfirmationNotification = false;
    } else {
      // Para notificaciones sin confirmación, solo limpiar la notificación
      this.ComponentNotificacion = undefined as unknown as Notificacion;
    }
  }

  /**
   * Resetea el estado de validación del formulario cuando se limpia
   */
  private resetFormValidation(): void {
    if (this._formularioDatosSubcontratista) {
      // Reiniciar formulario y todos los controles a estado pristino y no tocado
      this._formularioDatosSubcontratista.markAsUntouched();
      this._formularioDatosSubcontratista.markAsPristine();
      
      // Reiniciar cada control individualmente
      Object.keys(this._formularioDatosSubcontratista.controls).forEach(key => {
        const control = this._formularioDatosSubcontratista.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
          control.setErrors(null); // Limpiar cualquier error existente
        }
      });
    }
  }

  /**
   * Maneja la confirmación de la notificación de error
   * @param confirmacion - true si el usuario confirma, false en caso contrario
   */
  onErrorNotificationConfirmacion(confirmacion: boolean): void {
    if (confirmacion) {
      // Limpiar la notificación y emitir evento al componente padre
      this.errorNotificationClosed.emit();
    }
  }

  /**
   * Limpia recursos y suscripciones cuando el componente se destruye
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
