/**
 * Componente para la gestión de terceros relacionados en el trámite 32604.
 *
 * Este archivo contiene el componente que maneja la información de terceros relacionados
 * que pueden recibir notificaciones, incluyendo enlaces operativos, representantes legales
 * y configuración de notificaciones. Utiliza tablas dinámicas para mostrar y gestionar
 * los datos obtenidos de servicios especializados.
 */

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionColumna, Notificacion, NotificacionesComponent, Pedimento, REGEX_RFC_ALPHANUMERICO, REGEX_SOLO_DIGITOS, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { ENLACE_OPERATIVO_CONFIGURACION, RECIBIR_NOTIFICACIONES_CONFIGURACION } from '../../constants/empresas-comercializadoras.enum';
import { EnlaceOperativo, RecibirNotificaciones, RepresentanteLegal } from '../../models/empresas-comercializadoras.model';
import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';

/**
 * Componente para la gestión de terceros relacionados que pueden recibir notificaciones.
 * 
 * Maneja la visualización y administración de enlaces operativos, representantes legales
 * y configuraciones de notificaciones mediante tablas dinámicas y formularios reactivos.
 * Incluye funcionalidades para búsqueda, agregado, modificación y eliminación de terceros.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    HttpClientModule,
    AgregarEnlaceOperativoComponent,
    NotificacionesComponent
  ],
  providers: [EmpresasComercializadorasService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
/**
 * Componente encargado de mostrar la lista de terceros relacionados
 * que pueden recibir notificaciones. Utiliza una tabla dinámica para
 * mostrar los datos obtenidos del servicio `empresasComercializadorasService`.
 */
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {
  /**
   * Notificación que se mostrará al usuario.
   * 
   * Contiene la configuración y contenido de las notificaciones
   * que se despliegan en la interfaz de usuario.
   * 
   * @public
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Notificación de alerta para mostrar mensajes de éxito.
   * 
   * @public
   * @property {Notificacion} alertaNotificacion
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Flag para mostrar o ocultar la notificación de éxito.
   * 
   * @public
   * @property {boolean} mostrarNotificacion
   */
  public mostrarNotificacion = false;

  /**
   * Elemento para eliminar de la tabla de pedimentos.
   * 
   * Almacena el índice del elemento seleccionado
   * para operaciones de eliminación.
   * 
   * @property {number} elementoParaEliminar
   */
  elementoParaEliminar!: number;

  /**
   * Handler function for modal shown event to prevent event listener conflicts.
   * 
   * @property {() => void} handleModalShown
   */
  private handleModalShown: (() => void) | null = null;

  /**
   * Formulario reactivo para gestionar la información de los terceros relacionados.
   * 
   * Contiene campos para RFC, datos personales, teléfono y correo electrónico
   * con validaciones específicas para cada campo.
   * 
   * @property {FormGroup} tercerosRelacionadosForm
   */
  tercerosRelacionadosForm!: FormGroup;

  /**
   * Tipo de selección para la tabla principal (por defecto: UNDEFINED).
   * 
   * Define el comportamiento de selección de la tabla principal
   * sin permitir selecciones múltiples o individuales.
   * 
   * @property {TablaSeleccion} tipoSeleccionTabla
   */
  tipoSeleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Tipo de selección para la tabla de enlace operativo (por defecto: CHECKBOX).
   * 
   * Define el comportamiento de selección de la tabla como tipo checkbox
   * para permitir selecciones múltiples de enlaces operativos.
   * 
   * @property {TablaSeleccion} enlaceOperativoTabla
   */
  enlaceOperativoTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de pedimentos asociados al componente.
   * 
   * Array que contiene todos los pedimentos registrados
   * relacionados con los terceros.
   * 
   * @property {Array<Pedimento>} pedimentos
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Datos seleccionados para el enlace operativo.
   * 
   * Almacena los enlaces operativos que el usuario ha seleccionado
   * en la tabla para operaciones posteriores.
   * 
   * @property {EnlaceOperativo[]} seleccionEnlaceOperativoDatos
   */
  seleccionEnlaceOperativoDatos: EnlaceOperativo[] = [] as EnlaceOperativo[];

  /**
   * Configuración de las columnas de la tabla de enlace operativo.
   * 
   * Define la estructura, formato y comportamiento de las columnas
   * que se mostrarán en la tabla de enlaces operativos.
   * 
   * @property {ConfiguracionColumna<EnlaceOperativo>[]} enlaceOperativoConfiguracionColumnas
   */
  enlaceOperativoConfiguracionColumnas: ConfiguracionColumna<EnlaceOperativo>[] =
    ENLACE_OPERATIVO_CONFIGURACION;

  /**
   * Lista de enlaces operativos registrados.
   * 
   * Contiene todos los enlaces operativos disponibles
   * para mostrar en la tabla correspondiente.
   * 
   * @property {EnlaceOperativo[]} enlaceOperativosLista
   */
  enlaceOperativosLista: EnlaceOperativo[] = [];

  /**
   * Referencia al componente de enlace operativo para abrir el modal.
   * 
   * ViewChild que permite acceder al elemento DOM del modal
   * utilizado para agregar o modificar enlaces operativos.
   * 
   * @property {ElementRef} modificacionEnlaceOperativoElement
   */
  @ViewChild('modalAgregarEnlaceOperativo', { static: false })
  modificacionEnlaceOperativoElement!: ElementRef;


  /**
   * Referencia al componente hijo AgregarEnlaceOperativoComponent.
   * 
   * @property {AgregarEnlaceOperativoComponent} agregarEnlaceOperativoComponent
   */
  @ViewChild('agregarEnlaceOperativoCmp', { static: false })
  agregarEnlaceOperativoComponent!: AgregarEnlaceOperativoComponent;

  /**
   * Configuración de las columnas para la tabla de notificaciones.
   * 
   * Define la estructura de las columnas para mostrar
   * información de notificaciones que pueden recibir los terceros.
   * 
   * @property {ConfiguracionColumna<RecibirNotificaciones>[]} configuracionColumnas
   */
  configuracionColumnas: ConfiguracionColumna<RecibirNotificaciones>[] =
    RECIBIR_NOTIFICACIONES_CONFIGURACION;

  /**
   * Lista de notificaciones que el tercero puede recibir.
   * 
   * Contiene todos los tipos de notificaciones disponibles
   * que pueden ser configuradas para los terceros relacionados.
   * 
   * @property {RecibirNotificaciones[]} orecibirNotificacionesLista
   */
  orecibirNotificacionesLista: RecibirNotificaciones[] =
    [] as RecibirNotificaciones[];

  /**
   * Subject que controla la destrucción de las suscripciones.
   * 
   * Utilizado con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente se destruye.
   * 
   * @private
   * @property {Subject<void>} destroy$
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Tracks whether we are in modification mode or adding mode
   * 
   * @private
   * @property {boolean} esModoModificacion
   */
  private esModoModificacion: boolean = false;

  /**
   * Stores the original RFC of the item being modified to handle RFC changes
   * 
   * @private
   * @property {string | null} rfcOriginalModificacion
   */
  private rfcOriginalModificacion: string | null = null;

  /**
   * Tracks the type of notification to differentiate between error messages and confirmations
   * 
   * @private
   * @property {string} tipoNotificacionActual
   */
  public tipoNotificacionActual: string = '';

  /**
   * Estado de la solicitud 32604 actual.
   * 
   * Contiene toda la información del estado actual del formulario
   * y datos relacionados con los terceros relacionados.
   * 
   * @property {Solicitud32604State} solicitud32604State
   */
  solicitud32604State: Solicitud32604State = {} as Solicitud32604State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * 
   * Cuando es `true`, los campos del formulario no se pueden editar
   * y se muestran únicamente para consulta.
   * 
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;


  /**
   * Constructor del componente que inicializa las dependencias y carga los datos iniciales.
   *
   * Configura las dependencias del componente, establece suscripción al estado de consulta
   * para manejar el modo de solo lectura y realiza la carga inicial de datos de enlaces
   * operativos y notificaciones.
   *
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {EmpresasComercializadorasService} empresasComercializadorasService - Servicio para gestión de datos de empresas comercializadoras
   * @param {Solicitud32604Store} solicitud32604Store - Store para manejo del estado de la solicitud 32604
   * @param {Solicitud32604Query} solicitud32604Query - Query para consultas del estado de la solicitud 32604
   * @param {ConsultaioQuery} consultaioQuery - Query para el estado de consulta de la aplicación
   */
  constructor(
    private fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Configura el estado inicial del formulario llamando al método
   * de inicialización correspondiente según el modo de operación.
   * 
   * @memberof TercerosRelacionadosComponent
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * 
   * Determina el modo de operación del formulario basado en el estado
   * de solo lectura y ejecuta la acción correspondiente.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos del estado y configura el formulario según el modo de operación.
   * 
   * Inicializa el formulario y luego aplica el estado de solo lectura
   * habilitando o deshabilitando los controles según corresponda.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.tercerosRelacionadosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.tercerosRelacionadosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
 * Método que elimina un pedimento de la lista de pedimentos.
 *
 * Verifica si debe proceder con la eliminación y remueve el elemento
 * de la lista utilizando el índice almacenado en elementoParaEliminar.
 *
 * @param {boolean} borrar - Indica si se debe proceder con la eliminación del pedimento.
 *                          Si es `true`, se elimina el pedimento en el índice especificado
 * @memberof TercerosRelacionadosComponent
 */
eliminarPedimento(borrar: boolean): void {
  if (borrar) {
    this.pedimentos.splice(this.elementoParaEliminar, 1);
    if (this.pedimentos.length < this.elementoParaEliminar + 1) {
      setTimeout(() => {
        const MENSAJE_ELIMINADO = 'Se han eliminado los datos correctamente.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'success',
          mensaje: MENSAJE_ELIMINADO,
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
          titulo: '',
          modo: ''
        };
        this.mostrarNotificacion = true;
      }, 0);
    }
  }
}

  /**
   * Inicializa el formulario `tercerosRelacionadosForm` con los datos del estado actual.
   *
   * Configura un formulario reactivo que recopila información detallada sobre terceros
   * relacionados, incluyendo RFC, datos personales, teléfono y correo electrónico.
   * Algunos campos están deshabilitados para mostrar información de solo lectura
   * obtenida del servicio. También establece suscripción al estado para mantener
   * sincronización automática.
   *
   * @memberof TercerosRelacionadosComponent
   */
  inicializarFormulario(): void {
    this.tercerosRelacionadosForm = this.fb.group({
      idPersonaSolicitud: [this.solicitud32604State.idPersonaSolicitud],
      rfcTercero: [
        this.solicitud32604State.rfcTercero,
        [
          Validators.required,
          Validators.pattern(REGEX_RFC_ALPHANUMERICO),
          Validators.maxLength(15)
        ]
      ],
      rfc: [{ value: this.solicitud32604State.rfc, disabled: true }],
      nombre: [{ value: this.solicitud32604State.nombre, disabled: true }],
      apellidoPaterno: [
        { value: this.solicitud32604State.apellidoPaterno, disabled: true },
      ],
      apellidoMaterno: [
        { value: this.solicitud32604State.apellidoMaterno, disabled: true },
      ],
      telefono: [
        this.solicitud32604State.telefono,
        [
          Validators.pattern(REGEX_SOLO_DIGITOS),
          Validators.maxLength(30)
        ]
      ],
      correoElectronico: [
        this.solicitud32604State.correoElectronico,
        [
          Validators.email,
          Validators.maxLength(320)
        ]
      ],
    });

    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32604State) => {
          this.solicitud32604State = respuesta;
          this.tercerosRelacionadosForm.patchValue({
            idPersonaSolicitud: this.solicitud32604State.idPersonaSolicitud,
            rfcTercero: this.solicitud32604State.rfcTercero,
            rfc: this.solicitud32604State.rfc,
            nombre: this.solicitud32604State.nombre,
            apellidoPaterno: this.solicitud32604State.apellidoPaterno,
            apellidoMaterno: this.solicitud32604State.apellidoMaterno,
            telefono: this.solicitud32604State.telefono,
            correoElectronico: this.solicitud32604State.correoElectronico,
          });
        })
      )
      .subscribe();
  }

  /**
   * Getter para acceder al control de teléfono del formulario.
   * @returns {AbstractControl} Control del formulario para teléfono
   */
  get telefono(): AbstractControl | null {
    return this.tercerosRelacionadosForm.get('telefono');
  }

  /**
   * Getter para acceder al control de correo electrónico del formulario.
   * @returns {AbstractControl} Control del formulario para correo electrónico
   */
  get correoElectronico(): AbstractControl | null {
    return this.tercerosRelacionadosForm.get('correoElectronico');
  }

  /**
   * Método que busca los datos de un tercero por su RFC.
   * 
   * Realiza una consulta al servicio para obtener información del representante legal
   * utilizando el RFC ingresado y actualiza el estado con los datos recibidos.
   * Muestra un modal informativo al finalizar la operación.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  buscarTerceroNacionalIDC(): void {
    const RFC_TERCERO = this.tercerosRelacionadosForm.get('rfcTercero')?.value;
    // Validar que el campo RFC del tercero esté lleno
    if (RFC_TERCERO === undefined || RFC_TERCERO === null || RFC_TERCERO === '') {
      this.abrirModal('No se ha proporcionado información que es requerida.');
      return;
    }
    if (!RFC_TERCERO?.trim()) {
      this.abrirModal('Debe capturar el RFC del tercero para realizar la búsqueda.');
      return;
    }
    // Validar que el RFC del tercero sea válido
    if (this.tercerosRelacionadosForm.get('rfcTercero')?.invalid) {
      this.abrirModal('El RFC del tercero tiene un formato inválido.');
      return;
    }
    // Buscar en el JSON de terceros
    this.empresasComercializadorasService.conseguirRepresentanteLegalDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: RepresentanteLegal[] | RepresentanteLegal) => {
          // Si el JSON es un array, buscar el RFC
          let registro: RepresentanteLegal | null = null;
          if (Array.isArray(respuesta)) {
            const REGISTRO_ENCONTRADO = respuesta.find((item) => item.rfc?.trim().toUpperCase() === RFC_TERCERO.trim().toUpperCase());
            registro = REGISTRO_ENCONTRADO ? REGISTRO_ENCONTRADO : null;
          } else if (respuesta && respuesta.rfc) {
            registro = respuesta.rfc?.trim().toUpperCase() === RFC_TERCERO.trim().toUpperCase() ? respuesta : null;
          }
          if (registro) {
            this.solicitud32604Store.actualizarRfc(registro.rfc);
            this.solicitud32604Store.actualizarNombre(registro.nombre);
            this.solicitud32604Store.actualizarApellidoPaterno(registro.apellidoPaterno);
            this.solicitud32604Store.actualizarApellidoMaterno(registro.apellidoMaterno);
            this.solicitud32604Store.actualizarTelefono(registro.telefono);
            this.solicitud32604Store.actualizarCorreoElectronico(registro.correoElectronico);
            this.tercerosRelacionadosForm.patchValue({
              rfc: registro.rfc,
              nombre: registro.nombre,
              apellidoPaterno: registro.apellidoPaterno,
              apellidoMaterno: registro.apellidoMaterno,
              telefono: registro.telefono,
              correoElectronico: registro.correoElectronico
            });
            this.alertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'INFORMACION',
              modo: 'action',
              titulo: '',
              mensaje: 'Datos obtenidos correctamente.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            setTimeout(() => {
              this.mostrarNotificacion = true;
            }, 300);
          } else {
            this.abrirModal('Ha proporcionado información con un formato incorrecto.');
          }
        },
        error: (error) => {
          console.error('Error al buscar representante legal:', error);
          this.abrirModal('No se encontró información para el RFC especificado o ocurrió un error en la consulta.');
        }
      });
  }

  /**
   * Actualiza el RFC del tercero en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo RFC del tercero.
   * 
   * @param {Event} evento - Evento de cambio del input con el RFC del tercero
   * @memberof TercerosRelacionadosComponent
   */
  actualizarRfcTercero(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarRfcTercero(VALOR);
  }

  /**
   * Actualiza el teléfono en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de teléfono.
   * 
   * @param {Event} evento - Evento de cambio del input con el teléfono
   * @memberof TercerosRelacionadosComponent
   */
  actualizarTelefono(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTelefono(VALOR);
  }

  /**
   * Actualiza el correo electrónico en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de correo electrónico.
   * 
   * @param {Event} evento - Evento de cambio del input con el correo electrónico
   * @memberof TercerosRelacionadosComponent
   */
  actualizarCorreoElectronico(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarCorreoElectronico(VALOR);
  }

  /**
   * Valida y procesa los datos del enlace operativo para agregar nuevos registros.
   * 
   * Este método se ejecuta cuando se hace clic en el botón "Agregar" y debe
   * abrir el modal para capturar los datos del nuevo enlace operativo.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  guardarDatosEnlaceOperativo(): void {
    // Restablecer el modo de modificación al agregar un nuevo elemento
    this.esModoModificacion = false;
    this.rfcOriginalModificacion = null;
    
    // Abrir el modal
    if (this.modificacionEnlaceOperativoElement) {
      const EL = this.modificacionEnlaceOperativoElement.nativeElement;
      EL.classList.remove('show');
      EL.removeAttribute('aria-modal');
      EL.setAttribute('aria-hidden', 'true');
      EL.style.display = '';
      interface BootstrapModalStatic {
        Modal: {
          getInstance: (element: HTMLElement) => Modal | null;
        };
      }
      const WIN = window as Window & { bootstrap?: BootstrapModalStatic };
      if (WIN.bootstrap?.Modal?.getInstance(EL)) {
        WIN.bootstrap.Modal.getInstance(EL)?.dispose();
      }
      Object.keys(EL.dataset).forEach((key) => {
        if (key.startsWith('bs')) {
          delete EL.dataset[key];
        }
      });
      EL.removeEventListener('shown.bs.modal', this.handleModalShown);
      const MODAL_INSTANCIA = new Modal(EL);
      MODAL_INSTANCIA.show();
      // Configurar el detector de eventos para el modo agregar
      this.handleModalShown = (): void => {
        if (!this.esModoModificacion) {
          this.limpiarFormularioParaNuevoElemento();
        }
      };
      EL.addEventListener('shown.bs.modal', this.handleModalShown, { once: true });
    }
  }

  /**
   * Limpia el formulario para la entrada de nuevos elementos, evitando el comportamiento de relleno automático
   * 
   * @private
   * @memberof TercerosRelacionadosComponent
   */
  private limpiarFormularioParaNuevoElemento(): void {
    setTimeout(() => {
      if (this.agregarEnlaceOperativoComponent && this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm) {
        // Sólo está claro si no estamos en modo de modificación.
        if (!this.esModoModificacion) {
          // Resetear el formulario completamente
          this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm.reset();
          
          // Establecer todos los campos a valores vacíos con emitEvent: false para evitar el relleno automático
          this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm.patchValue({
            agregarEnlaceRfc: '',
            agregarEnlaceNombre: '',
            agregarEnlaceApellidoPaterno: '',
            agregarEnlaceApellidoMaterno: '',
            agregarEnlaceCiudadEstado: '',
            agregarEnlaceCargo: '',
            agregarEnlaceTelefono: '',
            agregarEnlaceCorreoElectronico: '',
            agregarEnlaceSuplente: false
          }, { emitEvent: false });
          
          // Restablecer el estado de la tienda para nuevas entradas
          this.solicitud32604Store.actualizarEnlaceSuplente(false);
        }
        
        // Marcar formulario como pristine y untouched para resetear estados de validación
        this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm.markAsPristine();
        this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm.markAsUntouched();
      }
    }, 300);
  }

  /**
   * Abre el modal para modificar un enlace operativo seleccionado.
   * 
   * Valida que hay un enlace operativo seleccionado y abre el modal
   * para permitir la edición de los datos.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  guardarModificacionEnlaceOperativo(): void {
    // Validar que hay un enlace operativo seleccionado para modificar
    if (this.seleccionEnlaceOperativoDatos.length === 0) {
      this.abrirModal('Debe seleccionar un enlace operativo para modificar.');
      return;
    }
    
    if (this.seleccionEnlaceOperativoDatos.length > 1) {
      this.abrirModal('Solo puede modificar un enlace operativo a la vez. Seleccione únicamente el enlace operativo que desea modificar.');
      return;
    }

    const SELECCIONADO = this.seleccionEnlaceOperativoDatos[0];
    this.esModoModificacion = true;
    this.rfcOriginalModificacion = SELECCIONADO.rfc;
    
    // Abrir el modal para modificar enlace operativo
    if (this.modificacionEnlaceOperativoElement) {
      const EL = this.modificacionEnlaceOperativoElement.nativeElement;
      EL.classList.remove('show');
      EL.removeAttribute('aria-modal');
      EL.setAttribute('aria-hidden', 'true');
      EL.style.display = '';
      interface BootstrapModalStatic {
        Modal: {
          getInstance: (element: HTMLElement) => Modal | null;
        };
      }
      const WIN = window as Window & { bootstrap?: BootstrapModalStatic };
      if (WIN.bootstrap?.Modal?.getInstance(EL)) {
        WIN.bootstrap.Modal.getInstance(EL)?.dispose();
      }
      Object.keys(EL.dataset).forEach((key) => {
        if (key.startsWith('bs')) {
          delete EL.dataset[key];
        }
      });
      EL.removeEventListener('shown.bs.modal', this.handleModalShown);
      const MODAL_INSTANCIA = new Modal(EL);
      MODAL_INSTANCIA.show();
      this.handleModalShown = (): void => {
        if (this.esModoModificacion) {
          this.patchFormWithSelectedData();
        }
      };
      EL.addEventListener('shown.bs.modal', this.handleModalShown, { once: true });
    }
  }

  /**
   * Patch the form with selected data for modification
   * 
   * @private
   * @memberof TercerosRelacionadosComponent
   */
  private patchFormWithSelectedData(): void {
    if (this.seleccionEnlaceOperativoDatos.length === 1 && this.esModoModificacion && this.rfcOriginalModificacion) {
      const SELECCIONADO = this.seleccionEnlaceOperativoDatos[0];
  
      setTimeout(() => {
        if (this.agregarEnlaceOperativoComponent && this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm) {
          const FORM = this.agregarEnlaceOperativoComponent.agregarEnlaceOperativoForm;
          FORM.patchValue({
            agregarEnlaceRfc: SELECCIONADO.rfc || '',
            agregarEnlaceNombre: SELECCIONADO.nombre || '',
            agregarEnlaceApellidoPaterno: SELECCIONADO.apellidoPaterno || '',
            agregarEnlaceApellidoMaterno: SELECCIONADO.apellidoMaterno || '',
            agregarEnlaceCiudadEstado: SELECCIONADO.ciudad || '',
            agregarEnlaceCargo: SELECCIONADO.cargo || '',
            agregarEnlaceTelefono: SELECCIONADO.telefono || '',
            agregarEnlaceCorreoElectronico: SELECCIONADO.correo || '',
            agregarEnlaceSuplente: TercerosRelacionadosComponent.determinarValorSuplente(SELECCIONADO.suplente)
          }, { emitEvent: false });
          
          FORM.markAsDirty();
          
          this.solicitud32604Store.actualizarEnlaceSuplente(
            TercerosRelacionadosComponent.determinarValorSuplente(SELECCIONADO.suplente)
          );
        }
      }, 400);
    }
  }

  /**
   * Método auxiliar para determinar el valor booleano del campo suplente
   * 
   * @private
   * @param {any} suplenteValue - El valor de suplente de los datos seleccionados
   * @returns {boolean} - True si suplente está activo, false en caso contrario
   * @memberof TercerosRelacionadosComponent
   */
  private static determinarValorSuplente(suplenteValue: string | boolean | null | undefined): boolean {
    if (typeof suplenteValue === 'boolean') {
      return suplenteValue;
    }
    if (typeof suplenteValue === 'string') {
      return suplenteValue === 'Sí' || suplenteValue === 'true' || suplenteValue === '1';
    }
    return false;
  }

  /**
   * Selecciona un enlace operativo para su modificación.
   * 
   * Almacena los enlaces operativos seleccionados desde la tabla
   * en la propiedad correspondiente para operaciones posteriores.
   * 
   * @param {EnlaceOperativo[]} evento - Array de enlaces operativos seleccionados
   * @memberof TercerosRelacionadosComponent
   */
  seleccionEnlaceOperativo(evento: EnlaceOperativo[]): void {
    this.seleccionEnlaceOperativoDatos = evento;
  }

  /**
   * Elimina el enlace operativo seleccionado de la lista.
   * 
   * Filtra la lista de enlaces operativos para remover el elemento
   * seleccionado utilizando el RFC como identificador único.
   * Actualiza el store y limpia la selección.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  cerrarDialogoEnlaceOperativo(): void {
    if (this.seleccionEnlaceOperativoDatos.length > 0) {
      this.enlaceOperativosLista = this.enlaceOperativosLista.filter(
        (element) => element.rfc !== this.seleccionEnlaceOperativoDatos[0].rfc
      );
      
      // Actualizar la tienda con la lista modificada
      this.solicitud32604Store.actualizarEnlaceOperativosLista(this.enlaceOperativosLista);
      
      // Limpiar la selección para que los botones vuelvan a estar deshabilitados
      this.seleccionEnlaceOperativoDatos = [];
    }
  }

  /**
   * Agrega un enlace operativo recibido desde el modal.
   * 
   * Recibe los datos de enlace operativo del componente modal,
   * valida que no exista duplicado por RFC y lo agrega a la lista.
   * Actualiza el store y muestra notificación de éxito.
   *
   * @param {EnlaceOperativo} evento - El objeto de tipo EnlaceOperativo que se va a agregar a la lista
   * @memberof TercerosRelacionadosComponent
   */
  agregarEnlaceOperativo(evento: EnlaceOperativo): void {
    if (this.esModoModificacion && this.rfcOriginalModificacion) {
      // Actualizar registro existente usando el RFC original
      const INDICE_EXISTENTE = this.enlaceOperativosLista.findIndex(enlace => enlace.rfc === this.rfcOriginalModificacion);
      if (INDICE_EXISTENTE !== -1) {
        // Verificar si el nuevo RFC ya existe en otro registro (solo si el RFC cambió)
        if (evento.rfc !== this.rfcOriginalModificacion) {
          const RFC_DUPLICADO = this.enlaceOperativosLista.find((enlace, index) => enlace.rfc === evento.rfc && index !== INDICE_EXISTENTE);
          if (RFC_DUPLICADO) {
            this.abrirModal('Ya existe un enlace operativo con el RFC especificado.');
            setTimeout(() => {
              document.querySelectorAll('.modal-backdrop').forEach((el) => {
                el.parentNode?.removeChild(el);
              });
              const MODAL_CONTENEDOR = document.getElementById('agregarEnlaceOperativo');
              if (MODAL_CONTENEDOR) {
                MODAL_CONTENEDOR.style.display = 'none';
              }
            }, 300);
            return;
          }
        }
        
        // Asegurar que todos los campos, incluido suplente, se actualicen correctamente
        const EVENTO_COMPLETO = {
          ...evento
        };
        
        this.enlaceOperativosLista[INDICE_EXISTENTE] = EVENTO_COMPLETO;
        this.enlaceOperativosLista = [...this.enlaceOperativosLista]; // Crear nueva referencia de array para detección de cambios
      }
    } else {
      // Verifique duplicados solo en modo agregar
      const RFC_EXISTENTE = this.enlaceOperativosLista.find(enlace => enlace.rfc === evento.rfc);
      if (RFC_EXISTENTE) {
        this.abrirModal('Ya existe un enlace operativo con el RFC especificado.');
        setTimeout(() => {
          document.querySelectorAll('.modal-backdrop').forEach((el) => {
            el.parentNode?.removeChild(el);
          });
          const MODAL_CONTENEDOR = document.getElementById('agregarEnlaceOperativo');
          if (MODAL_CONTENEDOR) {
            MODAL_CONTENEDOR.style.display = 'none';
          }
        }, 300);
        return;
      }
      
      // Agregar nuevo registro
      this.enlaceOperativosLista = [...this.enlaceOperativosLista, evento];
    }
    
    // Actualizar la tienda con la lista modificada
    this.solicitud32604Store.actualizarEnlaceOperativosLista(this.enlaceOperativosLista);
    
    // Restablecer indicadores del modo de modificación
    this.esModoModificacion = false;
    this.rfcOriginalModificacion = null;
    
    // Cerrar el modal correctamente para evitar problemas de fondo
    if (this.modificacionEnlaceOperativoElement) {
      const EL = this.modificacionEnlaceOperativoElement.nativeElement;
      const MODAL_INSTANCIA = Modal.getInstance(EL);
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }

    // Mostrar notificación de éxito (agregar/modificar)
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'INFORMACION',
      modo: 'action',
      titulo: '',
      mensaje: 'Datos guardados correctamente.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    
    // Mostrar notificación primero, luego limpiar modal después
    setTimeout(() => {
      this.mostrarNotificacion = true;
      
      // Limpiar modal después de que la notificación se haya mostrado completamente
      setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        });
        // Restablezca los estilos del cuerpo para restaurar el desplazamiento.
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Borrar la selección solo después de que se haya completado toda la limpieza del cuadro de diálogo modal.
        this.seleccionEnlaceOperativoDatos = [];
      }, 500);
    }, 300);
  }

  /**
   * Método que abre un modal para mostrar una notificación con el mensaje proporcionado.
   *
   * Configura y muestra un modal de notificación de alerta con el mensaje especificado.
   * También almacena el índice del elemento para operaciones posteriores de eliminación.
   *
   * @param {string} mensaje - El mensaje que se mostrará en la notificación
   * @param {number} [i=0] - Índice opcional para indicar qué elemento se eliminará (por defecto 0)
   * @memberof TercerosRelacionadosComponent
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.tipoNotificacionActual = 'error';
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    // Sólo establecer elementoParaEliminar si esto es realmente para eliminación
    if (i > 0) {
      this.elementoParaEliminar = i;
    }
  }

  /**
   * Cierra la notificación de éxito y limpia la alerta.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  cerrarNotificacionExito(): void {
    this.mostrarNotificacion = false;
    this.alertaNotificacion = {} as Notificacion;
  }

  /**
   * Muestra un modal de confirmación para eliminar enlace operativo usando lib-notificaciones.
   * 
   * Valida que haya un enlace operativo seleccionado antes de mostrar la confirmación.
   * 
   * @memberof TercerosRelacionadosComponent
   */
  confirmarEliminarEnlaceOperativo(): void {
    // Validar que hay un enlace operativo seleccionado
    if (this.seleccionEnlaceOperativoDatos.length === 0) {
      this.abrirModal('Debe seleccionar un enlace operativo para eliminar.');
      return;
    }
    
    this.tipoNotificacionActual = 'confirmacion';
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar'
    };
  }

  /**
   * Maneja la respuesta de confirmación para la eliminación de enlace operativo.
   * 
   * @param confirmar - True si el usuario confirma, false si cancela
   * @memberof TercerosRelacionadosComponent
   */
  manejarConfirmacionEliminacion(confirmar: boolean): void {
    if (this.tipoNotificacionActual === 'confirmacion' && confirmar) {
      const ANTES_CONTEO = this.enlaceOperativosLista.length;
      this.cerrarDialogoEnlaceOperativo();
      const DESPUES_CONTEO = this.enlaceOperativosLista.length;
      if (DESPUES_CONTEO < ANTES_CONTEO) {
        setTimeout(() => {
          document.querySelectorAll('.modal-backdrop').forEach((el) => {
            el.parentNode?.removeChild(el);
          });
          const MODAL_CONTENEDOR = document.getElementById('agregarEnlaceOperativo');
          if (MODAL_CONTENEDOR) {
            MODAL_CONTENEDOR.style.display = 'none';
          }

        const MENSAJE_ELIMINADO = 'Se han eliminado los datos correctamente.';
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'success',
          mensaje: MENSAJE_ELIMINADO,
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
          titulo: '',
          modo: ''
        };
        this.mostrarNotificacion = true;
      }, 300);
    }
    }
    
    // Borrar notificación y restablecer tipo
    this.nuevaNotificacion = {} as Notificacion;
    this.tipoNotificacionActual = '';
  }

  /**
   * Cierra el modal de agregar/modificar enlace operativo y elimina el backdrop
   */
  cancelarEnlaceOperativoModal(): void {
    if (this.modificacionEnlaceOperativoElement) {
      const EL = this.modificacionEnlaceOperativoElement.nativeElement;
      
      // Forzar la limpieza inmediata
      TercerosRelacionadosComponent.limpiarModalCompletamente(EL);
    }
  }

  /**
   * Limpia completamente el modal y todos sus elementos asociados
   * @param modalElement Elemento del modal a limpiar
   */
  private static limpiarModalCompletamente(modalElement: HTMLElement): void {
    try {
      interface BootstrapModalStatic {
        Modal: {
          getInstance: (element: HTMLElement) => Modal | null;
        };
      }
      const WIN = window as Window & { bootstrap?: BootstrapModalStatic };
      const MODAL_INSTANCIA = WIN.bootstrap?.Modal?.getInstance(modalElement) || Modal.getInstance(modalElement);
      
      // Elimine la instancia del modal si existe.
      if (MODAL_INSTANCIA) {
        try {
          MODAL_INSTANCIA.hide();
          if (typeof MODAL_INSTANCIA.dispose === 'function') {
            MODAL_INSTANCIA.dispose();
          }
        } catch (e) {
          // La instancia podría ya estar eliminada
        }
      }
    } catch (e) {
      // Error al acceder a la instancia del modal
    }

    // Forzar la limpieza inmediata del DOM
    setTimeout(() => {
      // Eliminar todas las clases y atributos relacionados con el modal
      modalElement.classList.remove('show', 'fade', 'd-block');
      modalElement.removeAttribute('aria-modal');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.style.display = 'none';
      modalElement.style.paddingRight = '';
      
      // Limpiar el conjunto de datos de Bootstrap
      Object.keys(modalElement.dataset).forEach((key) => {
        if (key.startsWith('bs')) {
          delete modalElement.dataset[key];
        }
      });

      // Elimina todos los fondos.
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });

      // Restablecer el estado del body
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Eliminar cualquier elemento modal residual que pueda estar interfiriendo
      document.querySelectorAll('.modal.show').forEach((modal) => {
        if (modal !== modalElement) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          (modal as HTMLElement).style.display = 'none';
        }
      });
    }, 0);
  }

    /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Limpia y completa la señal de destrucción para evitar fugas de memoria.
   * Emite un valor en el Subject destroy$ y lo completa para cancelar
   * automáticamente todas las suscripciones activas.
   * 
   * @memberof TercerosRelacionadosComponent
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    // Limpiar detectores de eventos del modal
    if (this.modificacionEnlaceOperativoElement && this.handleModalShown) {
      this.modificacionEnlaceOperativoElement.nativeElement.removeEventListener('shown.bs.modal', this.handleModalShown);
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
