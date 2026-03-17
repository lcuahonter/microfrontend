/**
 * Componente Angular para gestionar la información relacionada al trámite 80104.
 * Importa módulos y dependencias necesarias para formularios reactivos, gestión de estado y suscripciones.
 */
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy,OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud80104State, Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Subject,map,takeUntil } from 'rxjs';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../services/complimentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DisponsibleFiscal } from '../../models/empresas.model';
import { Tramite80104Query } from '../../../estados/queries/tramite80104.query';
/**
 * Componente que maneja la visualización y gestión de empresas dentro del flujo de solicitud.
 * 
 * Este componente permite gestionar las empresas disponibles y seleccionadas, así como la búsqueda de controladoras fiscales.
 * Además, utiliza formularios reactivos para capturar la información necesaria y realizar la interacción con el store.
 */
@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    NotificacionesComponent
  ],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
/**
 * Componente encargado de gestionar la sección de empresas dentro del trámite.
 * Implementa OnInit y OnDestroy para inicializar datos y limpiar suscripciones.
 */
export class EmpresasComponent implements OnInit, OnDestroy {

  @Output() seleccionadasDatos: EventEmitter<DisponsibleFiscal[]> = new EventEmitter();

  @Output() estadosOpciones: EventEmitter<Catalogo[]> = new EventEmitter();

  /**
   * Evento que se emite para solicitar la búsqueda de empresas controladoras.
   * 
   * Se dispara sin argumentos cuando se requiere actualizar o consultar la lista de controladoras.
   */
  @Output() buscarControladorasEmit: EventEmitter<{ rfc: string; estado: string }> = new EventEmitter<{ rfc: string; estado: string }>();

  /**
   * Título para la sección de empresas.
   */
  @Input() tituloEmpresas: string = '';

  /**
   * Título para la sección de disponibles.
   */
  @Input() tituloDisponibles: string = '';

  /**
   * Título para la sección de seleccionadas.
   */
  @Input() tituloSeleccionadas: string = '';

  /**
   * Lista de estados del catálogo para seleccionar en el formulario.
   */
  @Input() estadosCatalogo: Catalogo[] = [];

  /**
   * Configuración de la tabla de datos para la visualización de empresas.
   */
  @Input() configuracionTablaDatos: ConfiguracionColumna<DisponsibleFiscal>[] = [];

  /**
   * Formulario reactivo utilizado para la captura de la información de empresas.
   */
  empresasForm!: FormGroup;

  /**
   * Input para recibir datos de empresas disponibles desde el componente padre.
   * Al cambiar, actualiza la lista de disponibles y sincroniza con el store.
   */
  @Input() set disponiblesDatos(value: DisponsibleFiscal[]) {
    this.disponibles = value || [];
    this.tramite80104Store.setDisponibles(this.disponibles);
  }


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
* @description
* Objeto que representa una nueva notificación.
* Se utiliza para mostrar mensajes de alerta o información al usuario.
*/
  public NotValidRfcNotificacion!: Notificacion;

  /**
   * @description
   * Objeto que representa notificaciones generales del componente.
   * Se utiliza para mostrar diferentes tipos de mensajes al usuario.
   */
  public ComponentNotificacion!: Notificacion;

  /**
   * @description
   * Indica si la notificación actual requiere confirmación (para eliminar plantas).
   */
  public isConfirmationNotification: boolean = false;

  /**
   * Lista de empresas disponibles para ser seleccionadas.
   */
  disponibles: DisponsibleFiscal[] = [];

  /**
   * Lista de empresas seleccionadas en la tabla disponibles.
   */
  plantasSeleccionadasDisponibles: DisponsibleFiscal[] = [];

  /**
   * Lista de empresas seleccionadas en la tabla seleccionadas para eliminar.
   */
  plantasSeleccionadasParaEliminar: DisponsibleFiscal[] = [];

  /**
   * Lista de empresas seleccionadas.
   */
  seleccionadas: DisponsibleFiscal[] = [];

  /**
   * Checkbox para la tabla de selección de empresas.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Estado actual de la solicitud, gestionado por el store.
   */
  public solicitudState!: Solicitud80104State;

  /**
   * Notificador para destruir el observable de la suscripción.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor que inyecta los servicios necesarios para la creación del componente.
   *
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param tramite80104Store Store utilizado para gestionar el estado de la solicitud.
   * @param tramite80104Query Query utilizado para obtener el estado actual de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite80104Store: Tramite80104Store,
    private tramite80104Query: Tramite80104Query,
     private consultaioQuery: ConsultaioQuery,
    private complimentosService: ComplimentosService,
    private validacionesService: ValidacionesFormularioService,
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
    if (this.estadosCatalogo.length === 0) {
      this.obtenerEstados();
    }
  }

  /**
   * Obtiene la lista de estados llamando al servicio `complimentosService`.
   * Se suscribe al observable retornado por `getEstado()` y muestra la respuesta en la consola.
   * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
   */
  obtenerEstados():void {
    this.complimentosService.getEstado()
    .pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((res) => {
      this.estadosCatalogo = res.datos;
      this.estadosOpciones.emit(this.estadosCatalogo);
    }); 
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
     this.inicializarFormulario();
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
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.empresasForm.disable();
   
      } else {
        this.empresasForm.enable();
      
      }
  }
 
  /**
   * Inicializa el formulario reactivo para capturar los datos de las empresas.
   * También obtiene el estado actual de la solicitud y la lista de empresas disponibles y seleccionadas.
   */
  private inicializarFormulario(): void {
    this.tramite80104Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud80104State;
        })
      )
      .subscribe();

    this.empresasForm = this.fb.group({
      rfc: [this.solicitudState.rfc, Validators.required],
      estado: [this.solicitudState.estado, Validators.required],
    });

    // Obtiene las empresas disponibles y seleccionadas del store
    this.disponibles = this.tramite80104Query.getValue().disponibles;
    this.seleccionadas = this.tramite80104Query.getValue().seleccionadas;
  }

  /**
   * Establece los valores del store a partir de los datos del formulario.
   * 
   * @param form Formulario del cual se extrae el valor.
   * @param campo Campo del formulario que se va a extraer.
   * @param metodoNombre Nombre del método del store que se va a utilizar para guardar el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80104Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80104Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método que simula la búsqueda de controladoras fiscales basándose en los valores del formulario.
   * Valida que los campos RFC y Estado estén llenos antes de proceder.
   * 
   * Asigna un valor ficticio a las empresas disponibles y lo guarda en el store.
   */
  buscarControladoras(): void {
    const RFC_VALUE = this.empresasForm.get('rfc')?.value;
    const ESTADO_VALUE = this.empresasForm.get('estado')?.value;

    // Validar que el RFC esté lleno
    if (!RFC_VALUE || RFC_VALUE.trim() === '') {
      this.showRfcRequiredNotification();
      return;
    }

    // Validar que el Estado esté seleccionado
    if (!ESTADO_VALUE) {
      this.showEstadoRequiredNotification();
      return;
    }

    // Si ambos campos están llenos, proceder con la búsqueda
    if (this.empresasForm.valid) {
      this.buscarControladorasEmit.emit(this.empresasForm.value);
    }
  }

  /**
   * Método que agrega las empresas seleccionadas de la lista de disponibles a la lista de seleccionadas.
   * Valida que haya al menos una empresa seleccionada antes de proceder.
   * Luego, actualiza el store con los cambios realizados.
   */
  agregarPlantas(): void {
    // Validar que haya al menos una planta seleccionada
    if (this.plantasSeleccionadasDisponibles.length === 0) {
      this.showNoSelectionNotification();
      return;
    }

    // Agregar las plantas seleccionadas a la lista de seleccionadas
    this.seleccionadas = [...this.seleccionadas, ...this.plantasSeleccionadasDisponibles];
    
    // Remover las plantas seleccionadas de la lista de disponibles
    this.disponibles = this.disponibles.filter(disponible => 
      !this.plantasSeleccionadasDisponibles.some(seleccionada => 
        seleccionada.calle === disponible.calle && 
        seleccionada.codigoPostal === disponible.codigoPostal
      )
    );
    
    // Limpiar la selección
    this.plantasSeleccionadasDisponibles = [];
    
    // Actualizar el store
    this.tramite80104Store.setDisponibles(this.disponibles);
    this.tramite80104Store.setSeleccionadas(this.seleccionadas);
    this.seleccionadasDatos.emit(this.seleccionadas);
  }

  /**
   * Método que maneja la selección de filas en la tabla de plantas disponibles.
   * @param plantas - Lista de plantas seleccionadas en la tabla
   */
  onDisponiblesRowSelected(plantas: DisponsibleFiscal[]): void {
    this.plantasSeleccionadasDisponibles = plantas;
  }

  /**
   * Método que maneja la selección de filas en la tabla de plantas seleccionadas.
   * @param plantas - Lista de plantas seleccionadas en la tabla para eliminar
   */
  onSeleccionadasRowSelected(plantas: DisponsibleFiscal[]): void {
    this.plantasSeleccionadasParaEliminar = plantas;
  }

  /**
   * Elimina las plantas seleccionadas después de validar que haya plantas seleccionadas
   * y solicitar confirmación del usuario.
   * 
   * @remarks
   * Esta función valida la selección y muestra mensajes de confirmación apropiados.
   */
  eliminarPlantas(): void {
    // Validar que haya plantas seleccionadas para eliminar
    if (this.plantasSeleccionadasParaEliminar.length === 0) {
      this.showEliminarSelectionNotification();
      return;
    }

    // Mostrar confirmación para eliminar
    this.showEliminarConfirmationNotification();
  }

  /**
   * Confirma y ejecuta la eliminación de las plantas seleccionadas.
   */
  confirmarEliminarPlantas(): void {
    // Eliminar las plantas seleccionadas de la lista
    this.seleccionadas = this.seleccionadas.filter(item => 
      !this.plantasSeleccionadasParaEliminar.some(selectedItem =>
        selectedItem.calle === item.calle &&
        selectedItem.codigoPostal === item.codigoPostal
      )
    );
    
    // Limpiar la selección
    this.plantasSeleccionadasParaEliminar = [];
    
    // Actualizar el store
    this.tramite80104Store.setSeleccionadas(this.seleccionadas);
    this.seleccionadasDatos.emit(this.seleccionadas);
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
        'El RFC no se encontró, favor de verificarlo',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando no se han seleccionado plantas para agregar.
   */
  showNoSelectionNotification(): void {
    this.isConfirmationNotification = false;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Selecciona al menos una planta donde se realizarán las operaciones IMMEX.',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando el campo RFC no ha sido llenado.
   */
  showRfcRequiredNotification(): void {
    this.isConfirmationNotification = false;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe introducir el RFC.',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando el campo Estado no ha sido seleccionado.
   */
  showEstadoRequiredNotification(): void {
    this.isConfirmationNotification = false;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Selecciona la Entidad Federativa.',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando no se han seleccionado plantas para eliminar.
   */
  showEliminarSelectionNotification(): void {
    this.isConfirmationNotification = false;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Selecciona la planta que desea eliminar.',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación de confirmación para eliminar plantas.
   */
  showEliminarConfirmationNotification(): void {
    this.isConfirmationNotification = true;
    this.ComponentNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'confirm',
      titulo: '',
      mensaje: '¿Estás seguro de eliminar la(s) planta(s)?',
      cerrar: true,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
   * Maneja la respuesta del modal de confirmación para eliminar plantas.
   * @param confirmacion - true si el usuario acepta, false si cancela
   */
  onEliminarConfirmacion(confirmacion: boolean): void {
    if (confirmacion) {
      this.confirmarEliminarPlantas();
    }
    // Limpiar la notificación
    this.ComponentNotificacion = undefined as unknown as Notificacion;
    this.isConfirmationNotification = false;
  }

  /**
   * Maneja la confirmación del modal de notificaciones.
   * @param confirmacion - true si el usuario acepta, false si cancela
   */
  onNotificationConfirmacion(confirmacion: boolean): void {
    if (this.isConfirmationNotification) {
      this.onEliminarConfirmacion(confirmacion);
    }
  }

  /**
   * @method isValid
   * @description Valida un campo del formulario.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Libera los recursos y completa la notificación de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
