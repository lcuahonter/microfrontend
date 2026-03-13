/**
 * Componente para la gestión de comercializadoras importadoras en el trámite 32604.
 *
 * Este archivo contiene el componente que maneja la información de empresas comercializadoras
 * importadoras, incluyendo configuración de fechas de pago, montos, operaciones bancarias,
 * gestión de transportistas y configuración de programas IMMEX. Utiliza formularios reactivos
 * y tablas dinámicas para la gestión completa de datos relacionados.
 */

import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import {
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_NUMEROS,
  REGEX_SOLO_DIGITOS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';


import { FECHA_DE_PAGO, TRANSPORTISTAS_CONFIGURACION } from '../../constants/empresas-comercializadoras.enum';

import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';

import { InputRadio, SolicitudRadioLista, TransportistasTable } from '../../models/empresas-comercializadoras.model';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';

import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';

/**
 * Componente para la gestión de modalidades de comercializadoras importadoras.
 * 
 * Maneja la configuración de fechas de pago, montos, operaciones bancarias,
 * gestión de transportistas y programas IMMEX. Incluye funcionalidades para
 * agregar, modificar y eliminar transportistas mediante tablas dinámicas
 * y formularios reactivos con validaciones específicas.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-comercializadora-importadora',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFechaComponent,
    TituloComponent,
    TablaDinamicaComponent,
    AgregarTransportistasComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './comercializadora-importadora.component.html',
  styleUrl: './comercializadora-importadora.component.scss',
})
export class ComercializadoraImportadoraComponent implements OnInit, OnDestroy {
  /**
   * Contexto de acción para confirmar eliminación (usado en manejarConfirmacionEliminacion)
   */
  accionConfirmarEliminar: string = '';

  /**
   * Formulario reactivo para el componente modalidad.
   * 
   * Gestiona campos como fecha de pago, monto, operaciones bancarias,
   * llave de pago y configuraciones de programas IMMEX con validaciones específicas.
   * 
   * @property {FormGroup} modalidadForm
   */
  modalidadForm!: FormGroup;

  /**
   * Fecha de pago asociada a la solicitud.
   * 
   * Se inicializa con el valor constante `FECHA_DE_PAGO` que contiene
   * la configuración predeterminada de fecha para el componente.
   * 
   * @property {InputFecha} fechaDePago
   */
  fechaDePago: InputFecha = FECHA_DE_PAGO;

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
   * Estado actual de la consulta.
   * 
   * Contiene información relacionada con el trámite y el solicitante,
   * incluyendo configuraciones de modo de solo lectura y otros datos contextuales.
   * 
   * @property {ConsultaioState} consultaDatos
   */
  consultaDatos!: ConsultaioState;

  /**
   * Subject para manejar la destrucción de suscripciones.
   * 
   * Utilizado con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente se destruye.
   * 
   * @private
   * @property {Subject<void>} destroy$
   */
  private destroy$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud 32604.
   * 
   * Contiene toda la información del estado actual del formulario
   * y datos relacionados con la comercializadora importadora.
   * 
   * @public
   * @property {Solicitud32604State} solicitudState
   */
  public solicitudState!: Solicitud32604State;

  /**
   * Tipo de selección para la tabla de transportistas (checkbox).
   * 
   * Define el comportamiento de selección de la tabla como tipo checkbox
   * para permitir selecciones múltiples de transportistas.
   * 
   * @property {TablaSeleccion} transportistasTabla
   */
  transportistasTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas para la tabla de transportistas.
   * 
   * Define la estructura, formato y comportamiento de las columnas
   * que se mostrarán en la tabla de transportistas. Se inicializa con
   * la configuración predeterminada.
   * 
   * @property {ConfiguracionColumna<TransportistasTable>[]} transportistasConfiguracionColumnas
   */
  transportistasConfiguracionColumnas: ConfiguracionColumna<TransportistasTable>[] =
    TRANSPORTISTAS_CONFIGURACION;

  /**
   * Lista de transportistas disponibles para ser seleccionados.
   * 
   * Se llena dinámicamente con los datos de transportistas obtenidos
   * desde el servicio y el estado de la solicitud.
   * 
   * @property {TransportistasTable[]} transportistasLista
   */
  transportistasLista: TransportistasTable[] = [];

  /**
   * Notificación utilizada para mostrar mensajes al usuario.
   * 
   * Objeto que contiene la configuración y contenido
   * de las notificaciones que se muestran en la interfaz.
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
   * Referencia a la vista del modal de transportistas.
   * 
   * ViewChild que permite acceder al elemento DOM del modal
   * utilizado para agregar nuevos transportistas.
   * 
   * @property {ElementRef} transportistaElement
   */
  @ViewChild('transportistas', { static: false })
  transportistaElement!: ElementRef;

  /**
   * Referencia al componente de agregar transportistas.
   * 
   * Utiliza ViewChild para obtener una referencia al componente hijo
   * AgregarTransportistasComponent para poder acceder a sus métodos como limpiar().
   * 
   * @property {AgregarTransportistasComponent} agregarTransportistasComponent
   */
  @ViewChild(AgregarTransportistasComponent, { static: false })
  agregarTransportistasComponent!: AgregarTransportistasComponent;

  /**
   * Transportistas seleccionados por el usuario.
   * 
   * Almacena los transportistas que el usuario ha seleccionado
   * en la tabla para operaciones posteriores como eliminación.
   * 
   * @property {TransportistasTable[]} seleccionDatos
   */
  seleccionDatos: TransportistasTable[] = [] as TransportistasTable[];

  /**
   * Transportista seleccionado para modificación.
   * 
   * Almacena el transportista que se va a modificar cuando se abre
   * el modal de edición.
   * 
   * @property {TransportistasTable | null} transportistaAModificar
   */
  transportistaAModificar: TransportistasTable | null = null;

  /**
   * Modelo para la opción de tipo sí/no representado como radio button.
   * 
   * Contiene las opciones disponibles para campos de selección binaria
   * utilizados en diferentes secciones del formulario.
   * 
   * @property {InputRadio} sinoOpcion
   */
  sinoOpcion: InputRadio = {} as InputRadio;

  /**
   * Constructor del componente donde se inicializan servicios y dependencias.
   * 
   * Configura todas las dependencias necesarias para el funcionamiento del componente,
   * incluyendo servicios para gestión de empresas comercializadoras, manejo de estado
   * y consultas de datos.
   * 
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {EmpresasComercializadorasService} empresasComercializadorasService - Servicio para gestión de empresas comercializadoras
   * @param {Solicitud32604Store} solicitud32604Store - Store para manejo del estado de la solicitud 32604
   * @param {Solicitud32604Query} solicitud32604Query - Query para consultas del estado de la solicitud 32604
   * @param {ConsultaioQuery} consultaioQuery - Query para el estado de consulta de la aplicación
   */
  constructor(
    public fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Configura las suscripciones necesarias para el manejo de estados,
   * inicializa el formulario y carga los datos iniciales requeridos
   * para el funcionamiento del componente.
   * 
   * @memberof ComercializadoraImportadoraComponent
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
    this.inicializarFormulario();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario `modalidadForm` con los valores del estado actual.
   * 
   * Configura un formulario reactivo con campos para fecha de pago, monto,
   * operaciones bancarias, llave de pago y configuraciones de programas.
   * Incluye validaciones específicas de longitud máxima para campos de texto.
   * También inicializa la lista de transportistas desde el estado.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  inicializarFormulario(): void {
    this.modalidadForm = this.fb.group({
      fechaPago: [this.solicitudState.fechaPago],
      monto: [this.solicitudState.monto, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(10)]],
      operacionesBancarias: [
        this.solicitudState.operacionesBancarias,
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(25)],
      ],
      llavePago: [
        this.solicitudState.llavePago,
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(25)],
      ],
      programaImmex: [this.solicitudState.programaImmex, Validators.required],
      importsRadio: [this.solicitudState.importsRadio, Validators.required],
    });
  }


  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * Evalúa la propiedad `esFormularioSoloLectura` y habilita o deshabilita
   * todos los controles del formulario según corresponda. Si está en modo
   * de solo lectura, deshabilita todos los controles; de lo contrario, los habilita.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.modalidadForm?.disable();
    } else {
      this.modalidadForm?.enable();
    }
  }

  /**
   * Muestra el modal para agregar un nuevo transportista.
   * 
   * Crea una instancia de modal de Bootstrap utilizando el elemento
   * referenciado y lo muestra para permitir agregar un nuevo transportista.
   * También resetea el formulario del componente hijo para asegurar
   * un estado limpio para nuevos datos.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  agregarTransportistaModal(): void {
    this.transportistaAModificar = null; // Limpiar cualquier selección anterior
    
    // Resetear el formulario del componente hijo para un estado limpio
    if (this.agregarTransportistasComponent) {
      this.agregarTransportistasComponent.limpiar();
    }
    
    if (this.transportistaElement) {
      const EL = this.transportistaElement.nativeElement;
      EL.classList.remove('show');
      EL.removeAttribute('aria-modal');
      EL.setAttribute('aria-hidden', 'true');
      EL.style.display = '';
      interface BootstrapWindow extends Window {
        bootstrap?: {
          Modal?: {
            getInstance: (element: HTMLElement) => { dispose: () => void } | null;
          };
        };
      }
      const WIN = window as BootstrapWindow;
      if (WIN.bootstrap?.Modal?.getInstance(EL)) {
        WIN.bootstrap.Modal.getInstance(EL)?.dispose();
      }
      Object.keys(EL.dataset).forEach((key) => {
        if (key.startsWith('bs')) {
          delete EL.dataset[key];
        }
      });
      const INSTANCIA_MODAL = new Modal(EL);
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Abre el modal para modificar el transportista seleccionado.
   * 
   * Verifica que solo haya un transportista seleccionado, lo asigna como
   * transportista a modificar y abre el modal correspondiente.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  modificarTransportistaModal(): void {
    if (this.seleccionDatos.length === 0) {
      this.abrirModal('Debe seleccionar un transportista para modificar.');
      return;
    }
    if (this.seleccionDatos.length > 1) {
      this.abrirModal('Seleccione sólo un registro a modificar.');
      return;
    }
    if (this.seleccionDatos.length === 1) {
      this.transportistaAModificar = this.seleccionDatos[0];
      if (this.agregarTransportistasComponent) {
        this.agregarTransportistasComponent.patchForm(this.transportistaAModificar);
      }
      if (this.transportistaElement) {
        const INSTANCIA_MODAL = new Modal(this.transportistaElement.nativeElement);
        INSTANCIA_MODAL.show();
      }
    }
  }

  /**
   * Elimina los transportistas seleccionados de la lista.
   * 
   * Busca cada transportista seleccionado en la lista principal utilizando
   * el RFC como identificador y los elimina usando splice. Permite remover
   * múltiples transportistas de forma segura del array principal.
   * Después de la eliminación, actualiza el store y limpia la selección.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  eliminarDato(): void {
    if (this.seleccionDatos.length > 0) {
      // Eliminar transportistas seleccionados por RFC
  const RFC_TO_DELETE_LIST = this.seleccionDatos.map(t => t.transportistaRFCModifTrans);
  this.transportistasLista = this.transportistasLista.filter(t => !RFC_TO_DELETE_LIST.includes(t.transportistaRFCModifTrans));
      // Actualiza la lista de transportistas en el estado global
      this.solicitud32604Store.actualizarTransportistasLista(this.transportistasLista);
      this.seleccionDatos = [];
      // Mostrar modal de éxito después de la eliminación
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        mensaje: 'Datos eliminados correctamente',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        titulo: '',
        modo: ''
      };
      setTimeout(() => {
        this.mostrarNotificacion = true;
        this.cdr.detectChanges();
      }, 300);
    }
  }

  /**
   * Obtiene las opciones de radio button (sí/no) desde el servicio.
   * 
   * Realiza una suscripción al observable del servicio para obtener la lista
   * de opciones de radio button que se utilizan en el formulario.
   * Asigna la respuesta a la propiedad `sinoOpcion` para su uso en el template.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  conseguirOpcionDeRadio(): void {
    this.empresasComercializadorasService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Actualiza la fecha de pago en el estado global de la solicitud.
   * 
   * Recibe un valor de fecha como string, valida que no sea una fecha futura
   * y actualiza el campo correspondiente en el store global utilizando el servicio de actualización.
   * Esta fecha se utiliza para el registro de pagos de importación.
   * Si la fecha es futura, muestra una notificación de error.
   * 
   * @param {string} evento - Fecha de pago en formato string
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  actualizarFechaPago(evento: string): void {
    if (evento && evento.trim()) {
      // Parsear fecha
      let fechaSeleccionada: Date;
      
      if (evento.includes('/')) {
        fechaSeleccionada = ComercializadoraImportadoraComponent.parsearFecha(evento);
      } else if (evento.includes('-')) {
        fechaSeleccionada = new Date(evento);
      } else {
        fechaSeleccionada = new Date(evento);
      }
      
      // Verificar si la fecha es válida
      if (isNaN(fechaSeleccionada.getTime())) {
        return;
      }
      
      const FECHA_ACTUAL = new Date();
      FECHA_ACTUAL.setHours(0, 0, 0, 0);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      
      const ES_FECHA_FUTURA = fechaSeleccionada > FECHA_ACTUAL;
      
      if (ES_FECHA_FUTURA) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'Fecha Inválida. La Fecha actual no puede ser más grande que el día de hoy.',
          cerrar: false,
          tiempoDeEspera: 4000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: ''
        };
        
        this.modalidadForm.get('fechaPago')?.setValue('');
        this.modalidadForm.get('fechaPago')?.markAsTouched();
        return;
      }
    }
    
    this.solicitud32604Store.actualizarFechaPago(evento);
    
    // Forzar detección de cambios para que se actualice la validación de campos de pago
    this.cdr.detectChanges();
  }

  /**
   * Parsea una fecha en formato dd/MM/yyyy a objeto Date.
   * 
   * Convierte una cadena de fecha en formato europeo (día/mes/año)
   * a un objeto Date válido para comparaciones.
   * 
   * @param {string} fechaStr - Fecha en formato dd/MM/yyyy
   * @returns {Date} Objeto Date parseado
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  private static parsearFecha(fechaStr: string): Date {
    const PARTES = fechaStr.split('/');
    if (PARTES.length !== 3) {
      return new Date(''); // Fecha inválida
    }
    
    const DIA = parseInt(PARTES[0], 10);
    const MES = parseInt(PARTES[1], 10) - 1; // Los meses en Date son 0-indexados
    const ANIO = parseInt(PARTES[2], 10);
    
    return new Date(ANIO, MES, DIA);
  }

  /**
   * Actualiza el campo 'ProgramaImmex' en el estado global de la solicitud.
   * 
   * Permite modificar el valor del programa IMMEX (Industria Manufacturera,
   * Maquiladora y de Servicios de Exportación) en el estado compartido.
   * Acepta valores tanto string como numéricos para mayor flexibilidad.
   * Verifica si el valor es "Sí" para mostrar modal de restricción.
   * 
   * @param {string | number} valor - Valor del programa IMMEX a establecer
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  actualizarProgramaImmex(valor: string | number): void {
    // Verificar condición para mostrar modal si selecciona "Sí"
    if (valor === 1 || valor === '1' || valor === 'Si' || valor === 'Sí') {
      this.abrirModal(
        'Es Requisito obligatorio no contar con registro IMMEX, deberá de seleccionar la opción NO, de lo contrario no podrá continuar.',
        0,
        'danger',
        'alert'
      );
    }
    this.solicitud32604Store.actualizarProgramaImmex(valor);
  }

  /**
   * Actualiza el campo 'ImportsRadio' en el estado global de la solicitud.
   * 
   * Permite modificar el valor del radio button de importaciones en el
   * estado compartido. Este campo determina el tipo de importación
   * que se está gestionando en el formulario.
   * Verifica si el valor es "No" para mostrar modal de información.
   * 
   * @param {string | number} valor - Valor del radio de importaciones a establecer
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  actualizarImportsRadio(valor: string | number): void {
    // Verificar condición para mostrar modal si selecciona "No"
    if (valor === 2 || valor === '2' || valor === 'No') {
      this.abrirModal(
        'Se debe efectuar en el semestre inmediato a la fecha en que ingresa su solicitud, importaciones por un valor en aduana no menor a $300,000,000.00',
        0,
        'danger',
        'alert'
      );
    }
    this.solicitud32604Store.actualizarImportsRadio(valor);
  }
  
  /**
   * Actualiza la lista de transportistas en el estado global.
   * 
   * Maneja tanto la adición de nuevos transportistas como la modificación de existentes.
   * Si hay un transportista marcado para modificar, reemplaza el existente en la lista.
   * De lo contrario, agrega el nuevo transportista al final de la lista.
   * 
   * @param {TransportistasTable} evento - Transportista a agregar o modificar
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  seccionTransportistasLista(evento: TransportistasTable & { originalRFC?: string }): void {
    let registroModificado = false;
    if (this.transportistaAModificar || evento.originalRFC) {
      // Modificar transportista existente usando originalRFC for robust matching
      const MATCH_RFC = evento.originalRFC || (this.transportistaAModificar && this.transportistaAModificar.transportistaRFCModifTrans);
      const INDICE = this.transportistasLista.findIndex(
        transportista => transportista.transportistaRFCModifTrans === MATCH_RFC
      );
      if (INDICE !== -1) {
        const CLEAN_EVENTO = { ...evento };
        delete CLEAN_EVENTO.originalRFC;
        this.transportistasLista = [
          ...this.transportistasLista.slice(0, INDICE),
          CLEAN_EVENTO,
          ...this.transportistasLista.slice(INDICE + 1)
        ];
        registroModificado = true;
        if (this.agregarTransportistasComponent) {
          this.agregarTransportistasComponent.patchForm(CLEAN_EVENTO);
        }
      }
      this.transportistaAModificar = null;
    } else {
      // Agregar nuevo transportista solo si el RFC no existe ya
      const EXISTE = this.transportistasLista.some(
        t => t.transportistaRFCModifTrans === evento.transportistaRFCModifTrans
      );
      if (!EXISTE) {
        this.transportistasLista = [...this.transportistasLista, evento];
        registroModificado = true;
      }
    }

    if (registroModificado) {
      this.solicitud32604Store.actualizarTransportistasLista(this.transportistasLista);
      if (this.agregarTransportistasComponent) {
        this.agregarTransportistasComponent.limpiar();
      }
      
      // Cierre el modal correctamente para evitar problemas de fondo.
      if (this.transportistaElement) {
        const MODAL_INSTANCIA = Modal.getInstance(this.transportistaElement.nativeElement);
        if (MODAL_INSTANCIA) {
          MODAL_INSTANCIA.hide();
        }
      }
      
      // Mostrar notificación de éxito (agregar/modificar)
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        mensaje: 'Datos guardados correctamente.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        titulo: '',
        modo: ''
      };
      
      // Mostrar notificación primero, luego limpiar modal después
      setTimeout(() => {
        this.mostrarNotificacion = true;
        this.cdr.detectChanges();
        
        // Limpiar modal después de que la notificación se haya mostrado completamente
        setTimeout(() => {
          document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
            if (backdrop.parentNode) {
              backdrop.parentNode.removeChild(backdrop);
            }
          });
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 500);
      }, 300);
    }
  }

  /**
   * Guarda la selección de transportistas hecha por el usuario.
   * 
   * Almacena el array de transportistas seleccionados desde la tabla
   * para su posterior procesamiento o eliminación. Esta selección
   * se utiliza para operaciones como eliminar múltiples registros.
   * 
   * @param {TransportistasTable[]} evento - Array de transportistas seleccionados
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  seleccionarDato(evento: TransportistasTable[]): void {
  this.seleccionDatos = evento;
  }

  /**
   * Cierra el modal de notificación.
   * 
   * Resetea la notificación actual para cerrar el modal.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  cerrarModal(): void {
  // Siempre cerrar cualquier notificación y ocultar el modal de éxito
  this.nuevaNotificacion = {} as Notificacion;
  this.mostrarNotificacion = false;
  this.alertaNotificacion = {} as Notificacion;
  }

    /**
   * Índice o identificador del elemento que se desea eliminar de la tabla de pedimentos.
   * 
   * Almacena la referencia del elemento seleccionado
   * para operaciones de eliminación.
   * 
   * @property {number} elementoParaEliminar
   */
  elementoParaEliminar!: number;

  /**
   * Muestra una notificación en forma de modal con el mensaje proporcionado.
   * 
   * Configura y muestra un modal de notificación con características específicas
   * como tipo de alerta, categoría de peligro y tiempo de espera. También
   * almacena el índice del elemento que se desea eliminar para uso posterior.
   * 
   * @param {string} mensaje - El mensaje a mostrar en el modal de notificación
   * @param {number} [i=0] - El índice del elemento a eliminar (opcional, por defecto 0)
   * @param {string} [categoria='danger'] - La categoría del modal (danger, warning, etc.)
   * @param {string} [tipoNotificacion='alert'] - El tipo de notificación
   * @memberof ComercializadoraImportadoraComponent
   */
  abrirModal(
    mensaje: string,
    i: number = 0,
    categoria: string = 'danger',
    tipoNotificacion: string = 'alert'
  ): void {
    this.nuevaNotificacion = {
      tipoNotificacion: tipoNotificacion,
      categoria: categoria,
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Cierra la notificación de éxito y limpia la alerta.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  cerrarNotificacionExito(): void {
  this.alertaNotificacion = {} as Notificacion;
  this.mostrarNotificacion = false;
  }

  /**
   * Muestra un modal de confirmación para eliminar transportista usando lib-notificaciones.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  confirmarEliminarTransportista(): void {
  this.accionConfirmarEliminar = 'transportistas';
  if (this.seleccionDatos.length === 0) {
    // Mostrar notificación informando que debe seleccionar al menos un elemento
    this.alertaNotificacion = {
      tipoNotificacion: 'INFORMACION',
      categoria: 'INFORMACION',
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: 'Debe seleccionar al menos un transportista para eliminar.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnCancelar: '',
      txtBtnAceptar: 'Aceptar',
    };

    this.nuevaNotificacion = {
      tipoNotificacion: 'info',
      categoria: 'info',
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: 'Debe seleccionar al menos un transportista para eliminar.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnCancelar: '',
      txtBtnAceptar: 'Aceptar',
    };
    setTimeout(() => {
      this.mostrarNotificacion = true;
    }, 100);
    return;
  }

  this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'El registro se ha eliminado correctamente',
    cerrar: false,
    tiempoDeEspera: 0,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar'
  };
}

  /**
   * Maneja la respuesta de confirmación para la eliminación de transportista.
   * 
   * @param confirmar - True si el usuario confirma, false si cancela
   * @memberof ComercializadoraImportadoraComponent
   */
  manejarConfirmacionEliminacion(confirmar: boolean): void {
    if (confirmar) {
      // Solo mostrar éxito si la acción es eliminar
      if (this.accionConfirmarEliminar === 'transportistas') {
        this.eliminarDato();
        setTimeout(() => {
          // Cerrar el modal de Bootstrap correctamente usando la instancia Modal
          if (this.transportistaElement) {
            try {
              const MODAL_INSTANCIA = Modal.getOrCreateInstance(this.transportistaElement.nativeElement);
              MODAL_INSTANCIA.hide();
            } catch (e) {
              document.querySelectorAll('.modal-backdrop').forEach((el) => {
                el.parentNode?.removeChild(el);
              });
              const MODAL_CONTENEDOR = document.getElementById('transportistas');
              if (MODAL_CONTENEDOR) {
                MODAL_CONTENEDOR.classList.remove('show');
                MODAL_CONTENEDOR.setAttribute('aria-hidden', 'true');
                MODAL_CONTENEDOR.setAttribute('style', 'display: none;');
              }
            }
          }
          // Limpiar la notificación de confirmación para evitar superposición
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'success',
            mensaje: 'Datos eliminados correctamente',
            cerrar: true,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
            titulo: '',
            modo: ''
          };
          setTimeout(() => {
            this.mostrarNotificacion = true;
            this.cdr.detectChanges();
          }, 300);
        }, 300);
      } else {
        this.nuevaNotificacion = {} as Notificacion;
      }
      this.accionConfirmarEliminar = '';
    } else {
      this.nuevaNotificacion = {} as Notificacion;
      this.accionConfirmarEliminar = '';
    }
  }

  /**
   * Verifica si alguno de los campos de pago tiene errores de validación.
   * 
   * Comprueba los campos monto, operacionesBancarias y llavePago para determinar
   * si alguno tiene errores de validación y ha sido interactuado por el usuario
   * (touched o dirty). También verifica si hay una fecha seleccionada pero los
   * campos de pago están vacíos. Retorna true si se debe mostrar el mensaje de error.
   * 
   * @returns {boolean} true si algún campo de pago tiene errores y ha sido interactuado
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  tieneErroresCamposPago(): boolean {
    // Verificar que el formulario esté inicializado
    if (!this.modalidadForm) {
      return false;
    }
    
    const CAMPOS_PAGO = ['monto', 'operacionesBancarias', 'llavePago'];
    const FECHA_PAGO = this.modalidadForm.get('fechaPago')?.value;
    
    // Si hay fecha seleccionada, verificar que todos los campos de pago estén llenos
    if (FECHA_PAGO && FECHA_PAGO.trim()) {
      return CAMPOS_PAGO.some(campo => {
        const CONTROL = this.modalidadForm.get(campo);
        const VALOR = CONTROL?.value;
        // Mostrar error si el campo está vacío o solo tiene espacios en blanco
        return !VALOR || !VALOR.toString().trim();
      });
    }
    
    // Validación original: mostrar error si los campos han sido tocados y son inválidos
    return CAMPOS_PAGO.some(campo => {
      const CONTROL = this.modalidadForm.get(campo);
      return CONTROL?.invalid && (CONTROL?.touched || CONTROL?.dirty);
    });
  }

  /**
   * Permite solo la entrada de números en los campos de entrada.
   * 
   * Bloquea cualquier tecla que no sea un número (0-9), retroceso, borrar,
   * tab, escape, enter, o teclas de navegación (flechas, inicio, fin).
   * 
   * @param {KeyboardEvent} event - Evento del teclado
   * @returns {boolean} true si se permite la tecla, false si se bloquea
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  soloNumeros(event: KeyboardEvent): boolean {
    // Comprobar si existe el formulario (usando esto para satisfacer al linter)
    if (!this.modalidadForm) {
      return true;
    }
    const CODIGO_CARACTER = event.which ? event.which : event.keyCode;
    // Permitir: retroceso, eliminar, tabulador, escape, entrar
    if ([8, 9, 27, 13, 46].indexOf(CODIGO_CARACTER) !== -1 ||
      // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (CODIGO_CARACTER === 65 && event.ctrlKey === true) ||
      (CODIGO_CARACTER === 67 && event.ctrlKey === true) ||
      (CODIGO_CARACTER === 86 && event.ctrlKey === true) ||
      (CODIGO_CARACTER === 88 && event.ctrlKey === true) ||
      // Permitir: inicio, fin, izquierda, derecha
      (CODIGO_CARACTER >= 35 && CODIGO_CARACTER <= 39)) {
      return true;
    }
    // Asegurar que solo se permitan números (0-9)
    if ((CODIGO_CARACTER < 48 || CODIGO_CARACTER > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /**
   * Filtra caracteres no numéricos del valor pegado.
   * 
   * Elimina cualquier carácter que no sea un dígito del contenido
   * pegado en los campos de entrada numéricos.
   * 
   * @param {ClipboardEvent} event - Evento del portapapeles
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  filtrarPegado(event: ClipboardEvent): void {
    if (!this.modalidadForm) {
      return;
    }
    event.preventDefault();
    const DATOS_PORTAPAPELES = event.clipboardData?.getData('text') || '';
    const DATOS_FILTRADOS = DATOS_PORTAPAPELES.replace(REGEX_NUMEROS, '');
    const OBJETIVO = event.target as HTMLInputElement;
    if (OBJETIVO) {
      const CURRENT_VALUE = OBJETIVO.value;
      const VALOR_INICIAL = OBJETIVO.selectionStart || 0;
      const VALOR_FINAL = OBJETIVO.selectionEnd || 0;
      const NUEVO_VALOR = CURRENT_VALUE.substring(0, VALOR_INICIAL) + DATOS_FILTRADOS + CURRENT_VALUE.substring(VALOR_FINAL);
      OBJETIVO.value = NUEVO_VALOR;
      // Disparar evento de input para actualizar el modelo
      const EVENTO_DE_ENTRADA = new Event('input', { bubbles: true });
      OBJETIVO.dispatchEvent(EVENTO_DE_ENTRADA);
    }
  }

  /**
   * Filtra caracteres no numéricos en tiempo real del campo de entrada.
   * 
   * Este método maneja el evento 'input' para filtrar cualquier contenido
   * no numérico que pueda ser insertado a través de sugerencias del navegador,
   * autocompletado, o cualquier otro método que no sea typing directo.
   * 
   * @param {Event} event - Evento de entrada del campo
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  filtrarEntrada(event: Event): void {
    if (!this.modalidadForm) {
      return;
    }
    const OBJETIVO = event.target as HTMLInputElement;
    if (OBJETIVO) {
      const VALOR_ORIGINAL = OBJETIVO.value;
      const VALOR_FILTRADO = VALOR_ORIGINAL.replace(REGEX_NUMEROS, '');
      
      if (VALOR_ORIGINAL !== VALOR_FILTRADO) {
        const POSICION_CURSOR = OBJETIVO.selectionStart || 0;
        OBJETIVO.value = VALOR_FILTRADO;
        
        // Ajustar la posición del cursor
        const NUEVA_POSICION_DEL_CURSOR = Math.min(POSICION_CURSOR, VALOR_FILTRADO.length);
        OBJETIVO.setSelectionRange(NUEVA_POSICION_DEL_CURSOR, NUEVA_POSICION_DEL_CURSOR);
        
        // Disparar evento de input para actualizar el modelo de Angular
        const EVENTO_DE_ENTRADA = new Event('input', { bubbles: true });
        OBJETIVO.dispatchEvent(EVENTO_DE_ENTRADA);
      }
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente es destruido.
   * 
   * Completa y finaliza el Subject `destroy$` para cancelar todas las
   * suscripciones activas y prevenir fugas de memoria. Es una práctica
   * esencial en Angular para la gestión adecuada de recursos.
   * 
   * @memberof ComercializadoraImportadoraComponent
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handler for Cancelar button to close modal and remove backdrop
   */
  cancelarTransportistaModal(): void {
    if (this.transportistaElement) {
      const EL = this.transportistaElement.nativeElement;
      const MODAL_INSTANCIA = Modal.getInstance(EL);
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
        setTimeout(() => {
          const CURRENT_INSTANCIA = Modal.getInstance(EL);
          if (CURRENT_INSTANCIA === MODAL_INSTANCIA && typeof (MODAL_INSTANCIA as { dispose?: () => void }).dispose === 'function') {
            (MODAL_INSTANCIA as { dispose: () => void }).dispose();
          }
          EL.classList.remove('show');
          EL.removeAttribute('aria-modal');
          EL.setAttribute('aria-hidden', 'true');
          EL.style.display = '';
          Object.keys(EL.dataset).forEach((key) => {
            if (key.startsWith('bs')) {
              delete EL.dataset[key];
            }
          });
        }, 200);
      }
    }
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => {
        el.parentNode?.removeChild(el);
      });
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 150);
  }
}
