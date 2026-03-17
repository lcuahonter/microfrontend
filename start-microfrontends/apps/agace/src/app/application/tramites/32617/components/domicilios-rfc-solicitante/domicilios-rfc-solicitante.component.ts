import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_POSTAL,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import { DOMICILIOS_RFC_SOLICITANTE_TABLA_DATOS, NOTA, OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/oea-tercerizacion-logistica-registro.enum';
import { DomiciliosRfcSolicitanteTabla, InstalacionesInterface } from '../../modelos/oea-tercerizacion-logistica-registro.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, forkJoin, map, takeUntil} from 'rxjs';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { Tramite32617Query } from '../../estados/tramites32617.query';


/**
 * Componente para la gestión de domicilios del RFC solicitante en el trámite OEA textil.
 * 
 * Este componente independiente (`standalone`) permite registrar, editar y administrar
 * los domicilios asociados al RFC del solicitante del trámite OEA textil. Incluye
 * funcionalidad para agregar enlaces operativos, validar domicilios y gestionar
 * instalaciones con tabla dinámica interactiva.
 * 
 * @component
 * @selector app-domicilios-rfc-solicitante
 * @standalone true
 * @implements {OnInit, OnDestroy, AfterViewInit}
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```html
 * <app-domicilios-rfc-solicitante></app-domicilios-rfc-solicitante>
 * ```
 */
@Component({
  selector: 'app-domicilios-rfc-solicitante',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    AgregarEnlaceOperativoComponent,
    InputRadioComponent,
    AlertComponent,
  ],
  templateUrl: './domicilios-rfc-solicitante.component.html',
  styleUrl: './domicilios-rfc-solicitante.component.scss',
})
export class DomiciliosRfcSolicitanteComponent implements OnInit, OnDestroy, AfterViewInit {
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Define si el diálogo exitoso está habilitado.
   *
   * @property esHabilitarElDialogo
   * @type {boolean}
   * @default false
   */
  esHabilitarElDialogo: boolean = false;

  /**
   * Formulario reactivo para el registro de vehículos.
   */
  registroDomiciliosRfcSolicitanteForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Formulario para capturar el RFC.
   *
   * Este formulario es utilizado para validar y capturar el RFC del usuario.
   */
  forma!: FormGroup;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de vehículos registrados.
   */
  DomiciliosRfcSolicitanteList: DomiciliosRfcSolicitanteTabla[] = [] as DomiciliosRfcSolicitanteTabla[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Referencia al elemento modal para el registro de vehículos.
   */
  @ViewChild('registroDeDomiciliosRfcSolicitante') registroDeDomiciliosRfcSolicitanteElemento!: ElementRef;

  /**
   * Referencia al elemento modal para modificar el registro de vehículos.
   */
  @ViewChild('modificartRegistroDeDomiciliosRfc') modificartRegistroDeDomiciliosRfcElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
   * Constante para la nota de confirmación del vehículo.
   */
  CONFIRMACION_NUMEROEMPLEADOS = NOTA.CONFIRMACION_NUMEROEMPLEADOS;


  /**
   * Indicates whether the user is required to capture information.
   * The value is assigned from the `NOTA.DEBE_CAPTURAR` property.
   */
  DEBE_CAPTURAR = NOTA.DEBE_CAPTURAR;

 /**
   * Configuración para las columnas de la tabla de vehículos.
   */
  ParqueVehicular = DOMICILIOS_RFC_SOLICITANTE_TABLA_DATOS;

  /**
   * Subject utilizado para rastrear la destrucción del componente.
   * Ayuda a cancelar la suscripción de observables para evitar fugas de memoria.
   */
  destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada en la tabla de mercancías.
   */
  filaSeleccionadaDomiciliosRfcSolicitante!: DomiciliosRfcSolicitanteTabla;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   */
  listaFilaSeleccionadaEmpleado: DomiciliosRfcSolicitanteTabla[] = [] as DomiciliosRfcSolicitanteTabla[];

  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si un archivo está seleccionado.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se debe mostrar el modal de datos de mercancía.
   */
  mostrarModalDatosEmpleado: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Tramites32617State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites32617State;

  /**
   * Lista de domicilios para el catálogo.
   */
  domiciliosRegistradosList: Catalogo[] = [] as Catalogo[];
  /**
   * Lista de bimestres para el catálogo.
   */
  tipoInstalacionList: Catalogo[] = [] as Catalogo[];

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Constante que contiene la nota de domicilios registrados.
   * Se utiliza para mostrar información adicional al usuario.
   */
  DOMICILIO_REGISTRADOS = NOTA.DOMICILIO_REGISTRADOS

  /**
   * Array que almacena los datos seleccionados en el modal.
   * Se utiliza para capturar la información de las instalaciones seleccionadas.
   */
  datosTablaModalSeleccionados: DomiciliosRfcSolicitanteTabla[] = [] as DomiciliosRfcSolicitanteTabla[];

  /**
   * Propiedad para controlar el reseteo de la tabla del componente hijo.
   * Cuando se establece en true, resetea la selección de la tabla en el componente agregar-enlace-operativo.
   */
  resetChildTableSelection: boolean = false;

  /**
   * Evento emitido cuando cambia el valor de reconocimientoMutuoCTPAT.
   * Permite notificar a componentes padres sobre cambios en este campo.
   */
  @Output() reconocimientoMutuoCTPATChange = new EventEmitter<[string, string]>();

  
  public mostrarErroresValidacion: boolean = false;
  /**
   * Constructor para DomiciliosRfcSolicitanteBimestreComponent.
   * Inicializa el formulario e inyecta los servicios necesarios.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite32617Store - Store para gestionar el estado relacionado con el Trámite 32617.
   */
  constructor(
    public fb: FormBuilder,
    private tramite32617Store: Tramite32617Store,
    private tramite32617Query: Tramite32617Query,
    private consultaioQuery: ConsultaioQuery,
    private servicio: OeaTercerizacionLogisticaRegistroService
  ) {
      this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite32617$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `DomiciliosRfcSolicitanteTablaDatos` a `DomiciliosRfcSolicitanteList`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.getDomiciliosRegistradosList();
    this.tramite32617Query.selectTramite32617$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites32617State) => {
        this.seccionState = datos;
        

        if (!this.forma) {
          this.crearFormulario();
        }
        
        this.DomiciliosRfcSolicitanteList = this.seccionState.DomiciliosRfcSolicitante || [];
      });
  }

  /**
   * @method crearFormulario
   * Crea el formulario reactivo para el registro de domicilios RFC solicitante.
   * 
   * Inicializa el FormGroup con los controles necesarios para gestionar
   * la información de domicilios registrados del solicitante.
   * 
   * @returns {void}
   */
  crearFormulario(): void {
    this.forma = this.fb.group({
      domiciliosRegistrados: [this.seccionState?.domiciliosRegistrados || null],
      domiciliosRFCTabla: ['']
    });

    this.registroDomiciliosRfcSolicitanteForm = this.fb.group({
      id: [null],
      InstalacionesPrincipales: ['', Validators.required],
      tipoInstalacion: ['', Validators.required],
      coloniaCalleNumero: ['', Validators.required],
      procesoProductivo: ['', Validators.required],
      realizaActividadComercioExterior: ['', Validators.required],
      entidadFederativa: ['', Validators.required],
      municipioAlcaldia: ['', Validators.required],
      registroSESAT: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(REGEX_POSTAL)]],
      acreditaUsoGoceInmueble: ['', Validators.required],
      perfilEmpresa: ['', Validators.required],
      reconocimientoMutuoCTPAT: ['', Validators.required],
    });
  }

  /**
   * @method getDomiciliosRegistradosList
   * Método para obtener los catálogos necesarios del formulario.
   * 
   * Utiliza forkJoin para ejecutar ambas llamadas API en paralelo
   * y cargar los datos necesarios para el componente.
   * 
   * @returns {void}
   */
  getDomiciliosRegistradosList(): void {
    forkJoin({
      domiciliosRegistrados: this.servicio.getDomiciliosRegistrados(),
      tipoInstalacion: this.servicio.getTipoInstalacion()
    })
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (responses) => {
        this.domiciliosRegistradosList = responses.domiciliosRegistrados.data;
        this.tipoInstalacionList = responses.tipoInstalacion.data;
      },
      error: (error) => {
        console.error('Error al obtener los catálogos:', error);
      }
    });
  }

  /**
   * Abre el cuadro de diálogo modal para el registro de vehículos.
   */
  modificarDialogoDatos(): void {
    if (this.modificartRegistroDeDomiciliosRfcElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.modificartRegistroDeDomiciliosRfcElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }

 /**
   * Abre el cuadro de diálogo modal para el registro de vehículos.
   */
  agregarDialogoDatos(): void {
    if (this.registroDeDomiciliosRfcSolicitanteElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeDomiciliosRfcSolicitanteElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
      
      // Limpiar formulario después de que el modal se haya mostrado y los ViewChild estén disponibles
      setTimeout(() => {
        this.limpiarFormulario();
      }, 200);
    }
  } 


  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    // Verificar si hay datos seleccionados del modal o si el formulario es válido
    const HAS_MODAL_SELECTION = this.datosTablaModalSeleccionados.length > 0;
    if (HAS_MODAL_SELECTION) {
      this.abrirMultipleSeleccionPopup('', this.CONFIRMACION_NUMEROEMPLEADOS, 'Aceptar', '');
      this.esHabilitarElDialogo = true;
      this.DomiciliosRfcSolicitanteInfoDatos();
      this.cambiarEstadoModal();
      this.mostrarErroresValidacion = false;
    } else {
      this.abrirMultipleSeleccionPopup('', 'Seleccione un registro.', 'Aceptar', '');
      this.esHabilitarElDialogo = true;
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarActualizarDialogData(): void {
    if(this.registroDomiciliosRfcSolicitanteForm.valid) {
      this.abrirMultipleSeleccionPopup('', this.CONFIRMACION_NUMEROEMPLEADOS, 'Aceptar', '');
      this.modificarDomiciliosRfcSolicitanteInfoDatos();
      this.cambiarEstadoModal('modificar');
    } else {
      this.abrirMultipleSeleccionPopup('', this.DEBE_CAPTURAR, 'Aceptar', '');
    }

    this.esHabilitarElDialogo = true;
  }


  /**
   * Limpia el formulario y restablece los valores a los predeterminados.
   */
  instalacionesSeleccionadas(event:InstalacionesInterface[]): void {
    this.datosTablaModalSeleccionados = event.map((elemento) => {
      return {
        InstalacionesPrincipales: '',
        tipoInstalacion: '',
        entidadFederativa: elemento.entidadFederativa,
        municipioAlcaldia: elemento.municipio,
        coloniaCalleNumero: elemento.direccion,
        codigoPostal: elemento.codigoPostal,
        registroSESAT: elemento.registro,
        procesoProductivo: '',
        acreditaUsoGoceInmueble: '',
        realizaActividadComercioExterior: '',
        reconocimientoMutuoCTPAT: '',
        perfilEmpresa: '',
      } as DomiciliosRfcSolicitanteTabla;
    });
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro.
   * Este método oculta el modal y restablece el formulario.
   */
  modalCancelar(typo?: 'add' | 'modificar'): void {
    this.cambiarEstadoModal(typo);
    this.limpiarFormulario();
  }


  /**
   * Alterna la visibilidad del cuadro de diálogo modal especificado.
   * Si el modal está visible actualmente, se ocultará.
   * @param modalType - Tipo de modal a cerrar ('add' | 'modify'). Si no se proporciona, usa el modal de registro por defecto.
   */
  cambiarEstadoModal(modalType: 'add' | 'modificar' = 'add'): void {
    let ELEMENTO_MODAL: ElementRef;
    
    switch(modalType) {
      case 'modificar':
        ELEMENTO_MODAL = this.modificartRegistroDeDomiciliosRfcElemento;
        break;
      case 'add':
      default:
        ELEMENTO_MODAL = this.registroDeDomiciliosRfcSolicitanteElemento;
        break;
    }
    
    if (!ELEMENTO_MODAL) {
      console.warn(`No se encontró el elemento modal del tipo: ${modalType}`);
      return;
    }
    const MODAL_INSTANCIA = Modal.getInstance(ELEMENTO_MODAL.nativeElement);
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Map of modal ElementRefs for dynamic access
   */
  private modalElementsMap: { [key: string]: ElementRef } = {};

  /**
   * Initialize modal elements map after view initialization
   */
  ngAfterViewInit(): void {
    this.modalElementsMap = {
      'add': this.registroDeDomiciliosRfcSolicitanteElemento,
      'modify': this.modificartRegistroDeDomiciliosRfcElemento,
      'confirmation': this.confirmacionElemento
    };
  }

  /**
   * Alternative method using modal elements map
   * @param modalKey - Key to identify the modal ('add' | 'modify' | 'confirmation')
   */
  cambiarEstadoModalPorKey(modalKey: string): void {
    const ELEMENTO_MODAL = this.modalElementsMap[modalKey];
    
    if (!ELEMENTO_MODAL) {
      console.warn(`No se encontró el elemento modal con key: ${modalKey}`);
      return;
    }

    const MODAL_INSTANCIA = Modal.getInstance(ELEMENTO_MODAL.nativeElement);
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Agrega los datos del array datosTablaModalSeleccionados a la lista de domicilios registrados.
   * Cada objeto del array se procesa y se le asigna un ID único.
   */
  DomiciliosRfcSolicitanteInfoDatos(): void {
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string =>
      array[index - 1]?.descripcion || '';

    // Obtener el último ID para generar IDs únicos consecutivos
    let ULTIMO_ID = this.DomiciliosRfcSolicitanteList.length
      ? (this.DomiciliosRfcSolicitanteList[this.DomiciliosRfcSolicitanteList.length - 1]?.id ?? 0)
      : 0;

    // Procesar cada objeto del array datosTablaModalSeleccionados
    const NUEVOS_OBJETOS: DomiciliosRfcSolicitanteTabla[] = this.datosTablaModalSeleccionados.map((item) => {
      ULTIMO_ID += 1; // Incrementar ID para cada objeto

      const SELECTEDTIPO_INSTALACION = OBTENER_DESCRIPCION(
        this.tipoInstalacionList,
        Number(item.tipoInstalacion)
      );

      return {
        id: ULTIMO_ID,
        InstalacionesPrincipales: item.InstalacionesPrincipales ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.InstalacionesPrincipales) : '',
        tipoInstalacion: SELECTEDTIPO_INSTALACION || '',
        coloniaCalleNumero: item.coloniaCalleNumero,
        procesoProductivo: item.procesoProductivo ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.procesoProductivo) : '',
        realizaActividadComercioExterior: item.realizaActividadComercioExterior ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.realizaActividadComercioExterior) : '',
        entidadFederativa: item.entidadFederativa,
        municipioAlcaldia: item.municipioAlcaldia,
        registroSESAT: item.registroSESAT,
        codigoPostal: item.codigoPostal,
        acreditaUsoGoceInmueble: item.acreditaUsoGoceInmueble ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.acreditaUsoGoceInmueble) : '',
        perfilEmpresa: item.perfilEmpresa ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.perfilEmpresa) : '',
        reconocimientoMutuoCTPAT: item.reconocimientoMutuoCTPAT ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(item.reconocimientoMutuoCTPAT) : ''
      } as DomiciliosRfcSolicitanteTabla;
    });

    // Agregar los nuevos objetos a la lista existente
    this.DomiciliosRfcSolicitanteList = [...this.DomiciliosRfcSolicitanteList, ...NUEVOS_OBJETOS];
    
    // Actualizar el store con los nuevos datos
    this.tramite32617Store.establecerDatos({DomiciliosRfcSolicitante: this.DomiciliosRfcSolicitanteList});
    // Limpiar campos de validación cuando se agregan datos válidos
    this.limpiarValidacionesSegunDatos();
    // Limpiar el array de datos seleccionados después de procesarlos
    this.datosTablaModalSeleccionados = [];
  }

  /**
   * Modifica un registro existente usando los datos del formulario registroDomiciliosRfcSolicitanteForm.
   * Actualiza la lista de domicilios y el store con los nuevos datos.
   */
  modificarDomiciliosRfcSolicitanteInfoDatos(): void {
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string =>
      array[index - 1]?.descripcion || '';

    const FORM_DATA = this.registroDomiciliosRfcSolicitanteForm.value;
    
    if (!FORM_DATA.id) {
      console.error('No se encontró el ID del registro a modificar');
      return;
    }

    const SELECTEDTIPO_INSTALACION = OBTENER_DESCRIPCION(
      this.tipoInstalacionList,
      Number(FORM_DATA.tipoInstalacion)
    );

    const OBJETO_MODIFICADO: DomiciliosRfcSolicitanteTabla = {
      id: FORM_DATA.id,
      InstalacionesPrincipales: FORM_DATA.InstalacionesPrincipales ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.InstalacionesPrincipales) : '',
      tipoInstalacion: SELECTEDTIPO_INSTALACION || FORM_DATA.tipoInstalacion,
      coloniaCalleNumero: FORM_DATA.coloniaCalleNumero,
      procesoProductivo: FORM_DATA.procesoProductivo ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.procesoProductivo) : '',
      realizaActividadComercioExterior: FORM_DATA.realizaActividadComercioExterior ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.realizaActividadComercioExterior) : '',
      entidadFederativa: FORM_DATA.entidadFederativa,
      municipioAlcaldia: FORM_DATA.municipioAlcaldia,
      registroSESAT: FORM_DATA.registroSESAT,
      codigoPostal: FORM_DATA.codigoPostal,
      acreditaUsoGoceInmueble: FORM_DATA.acreditaUsoGoceInmueble ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.acreditaUsoGoceInmueble) : '',
      perfilEmpresa: FORM_DATA.perfilEmpresa ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.perfilEmpresa) : '',
      reconocimientoMutuoCTPAT: FORM_DATA.reconocimientoMutuoCTPAT ? DomiciliosRfcSolicitanteComponent.convertirValorRadioATexto(FORM_DATA.reconocimientoMutuoCTPAT) : ''
    };

    // Buscar el índice del objeto a modificar
    const INDICE = this.DomiciliosRfcSolicitanteList.findIndex(
      (item) => item.id === FORM_DATA.id
    );

    if (INDICE !== -1) {
      // Crear una nueva lista con el objeto modificado
      this.DomiciliosRfcSolicitanteList = [
        ...this.DomiciliosRfcSolicitanteList.slice(0, INDICE),
        OBJETO_MODIFICADO,
        ...this.DomiciliosRfcSolicitanteList.slice(INDICE + 1)
      ];

      // Actualizar el store con los nuevos datos
      this.tramite32617Store.establecerDatos({DomiciliosRfcSolicitante: this.DomiciliosRfcSolicitanteList});
      
      // Limpiar la fila seleccionada después de la modificación
      this.filaSeleccionadaDomiciliosRfcSolicitante = {} as DomiciliosRfcSolicitanteTabla;
      this.listaFilaSeleccionadaEmpleado = [];
      this.reconocimientoMutuoCTPATChange.emit([this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.value, this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.value]);
      // Limpiar formulario después de modificar datos exitosamente
      this.limpiarFormulario();
    } else {
      console.error('No se encontró el registro a modificar');
    }
  }
  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: DomiciliosRfcSolicitanteTabla[]): void {
    this.listaFilaSeleccionadaEmpleado = fila;
      if (fila.length === 0) {
      this.filaSeleccionadaDomiciliosRfcSolicitante = {} as DomiciliosRfcSolicitanteTabla;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
     // Habilitar botones cuando hay selección
  this.enableModficarBoton = true;
  this.enableEliminarBoton = true;

  this.filaSeleccionadaDomiciliosRfcSolicitante = fila[fila.length - 1];
  }
  

  /**
   * Actualiza la fila seleccionada with los datos más recientes de la tabla.
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.DomiciliosRfcSolicitanteList.find(
      (item) => item.id === this.filaSeleccionadaDomiciliosRfcSolicitante.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaDomiciliosRfcSolicitante = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   */
  eliminarEmpleadoItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaEmpleado.map(
        (item) => item.id
      );

      this.DomiciliosRfcSolicitanteList = this.DomiciliosRfcSolicitanteList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaEmpleado = [];
      this.filaSeleccionadaDomiciliosRfcSolicitante = {} as DomiciliosRfcSolicitanteTabla;
      this.tramite32617Store.establecerDatos({DomiciliosRfcSolicitante:this.DomiciliosRfcSolicitanteList});
      this.resetearValidaciones();
      this.cerrarEliminarConfirmationPopup();
    }
  }

  /**
  Método que se ejecuta cuando cambia el valor del campo 'reconocimientoMutuoCTPAT'.
  */
  onReconocimientoMutuoChange(): void {
    setTimeout(()=>{
      const RECONOCIMIENTO_MUTUO_CTPAT = this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.value;
      if(RECONOCIMIENTO_MUTUO_CTPAT === '0') {
        this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.enable();
      }else{
        this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.patchValue('0');
        this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.disable();
      }
    },300);
  }

  /**
   * Método que se ejecuta cuando cambia el valor del campo 'perfilEmpresa'.
   */
  onPerfilEmpresaChange(): void {
    setTimeout(()=>{
      const PERFIL_EMPRESA = this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.value;
      if(PERFIL_EMPRESA === '0') {
        this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.enable();
      }else{
        this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.patchValue('0');
        this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.disable();
      }
    },300);
  }

  /**
   * Cierra el popup de confirmación de eliminación.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos.
   */
  modificarItemEmpleado(): void {
    const SELECCIONADAS = this.listaFilaSeleccionadaEmpleado;
    if (this.DomiciliosRfcSolicitanteList.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'No se encontró información');
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
 
    if (!SELECCIONADAS || SELECCIONADAS.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'Selecciona un registro');
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
  
    if (SELECCIONADAS.length > 1) {
      this.abrirMultipleSeleccionPopup('', 'Selecciona sólo un registro para modificar.');
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    this.actualizarFilaSeleccionada();
    this.modificarDialogoDatos();
    this.patchModifyiedData();
  }
  
  /**
   * @method patchModifyiedData
   * Rellena el formulario con los datos de la fila seleccionada para su modificación.
   * Este método utiliza `patchValue` para actualizar los valores del formulario.
   */
  patchModifyiedData(): void {
     const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
      array.findIndex((item) => item.descripcion === value) + 1;
    const TIPO_INSTALACION = OBTENER_INDICE(this.tipoInstalacionList, this.filaSeleccionadaDomiciliosRfcSolicitante?.tipoInstalacion);
    this.registroDomiciliosRfcSolicitanteForm.patchValue({
      id: this.filaSeleccionadaDomiciliosRfcSolicitante?.id,
      InstalacionesPrincipales: this.filaSeleccionadaDomiciliosRfcSolicitante?.InstalacionesPrincipales ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.InstalacionesPrincipales) : '',
      tipoInstalacion: TIPO_INSTALACION ? TIPO_INSTALACION : '',
      coloniaCalleNumero: this.filaSeleccionadaDomiciliosRfcSolicitante?.coloniaCalleNumero,
      procesoProductivo: this.filaSeleccionadaDomiciliosRfcSolicitante?.procesoProductivo ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.procesoProductivo) : '',
      realizaActividadComercioExterior: this.filaSeleccionadaDomiciliosRfcSolicitante?.realizaActividadComercioExterior ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.realizaActividadComercioExterior) : '',
      entidadFederativa: this.filaSeleccionadaDomiciliosRfcSolicitante?.entidadFederativa,
      municipioAlcaldia: this.filaSeleccionadaDomiciliosRfcSolicitante?.municipioAlcaldia,
      registroSESAT: this.filaSeleccionadaDomiciliosRfcSolicitante?.registroSESAT,
      codigoPostal: this.filaSeleccionadaDomiciliosRfcSolicitante?.codigoPostal,
      acreditaUsoGoceInmueble: this.filaSeleccionadaDomiciliosRfcSolicitante?.acreditaUsoGoceInmueble ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.acreditaUsoGoceInmueble) : '',
      perfilEmpresa: this.filaSeleccionadaDomiciliosRfcSolicitante?.perfilEmpresa ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.perfilEmpresa) : '',
      reconocimientoMutuoCTPAT: this.filaSeleccionadaDomiciliosRfcSolicitante?.reconocimientoMutuoCTPAT ? DomiciliosRfcSolicitanteComponent.convertirTextoAValorRadio(this.filaSeleccionadaDomiciliosRfcSolicitante.reconocimientoMutuoCTPAT) : '',
    });
  }


  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de notificación con contenido dinámico.
   * Este método permite personalizar el título, mensaje y etiquetas de los botones del popup.
   * @param titulo - Título del popup
   * @param mensaje - Mensaje a mostrar en el popup
   * @param txtBtnAceptar - Texto del botón de aceptar (opcional, por defecto 'Cerrar')
   * @param txtBtnCancelar - Texto del botón de cancelar (opcional, por defecto '')
   */
  abrirMultipleSeleccionPopup(
    titulo: string,
    mensaje: string,
    txtBtnAceptar: string = 'Cerrar',
    txtBtnCancelar: string = ''
  ): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar,
    };
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
confirmEliminarEmpleadoItem(): void {
    if (this.DomiciliosRfcSolicitanteList.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'No se encontró información');
      this.confirmEliminarPopupAbierto = true;
      return;
    }
    if (this.listaFilaSeleccionadaEmpleado.length === 0) {
      this.abrirMultipleSeleccionPopup('','Seleccione un registro.');
      this.confirmEliminarPopupAbierto = true;
      return;
    }
    this.abrirElimninarConfirmationopup();
  }
  /**
   * @method abrirElimninarConfirmationopup
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   * Si no hay registros seleccionados, no realiza ninguna acción.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * Verifica si un control de formulario es inválido, está tocado o ha sido modificado.
   * @param nombreControl - El nombre del control de formulario a verificar.
   * @returns Verdadero si el control es inválido, de lo contrario, falso.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.registroDomiciliosRfcSolicitanteForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Restablece el formulario de registro a su estado inicial.
   * Limpia todos los campos del formulario y resetea los estados de validación.
   */
  limpiarFormulario(): void {
    // Resetear el formulario principal
    this.registroDomiciliosRfcSolicitanteForm.reset();
    
    // Resetear el formulario de domicilios registrados
    this.forma.reset();
    
    // Limpiar datos de la tabla modal seleccionados
    this.datosTablaModalSeleccionados = [];
    
    // Resetear la selección de la tabla del componente hijo
    this.resetChildTableSelection = true;
    // Inmediatamente después, volver a false para permitir futuros resets
    setTimeout(() => {
      this.resetChildTableSelection = false;
    }, 0);
    
    // Reinicializar el formulario con valores por defecto
    this.registroDomiciliosRfcSolicitanteForm.patchValue({
      id: null,
      InstalacionesPrincipales: '',
      tipoInstalacion: '',
      coloniaCalleNumero: '',
      procesoProductivo: '',
      realizaActividadComercioExterior: '',
      entidadFederativa: '',
      municipioAlcaldia: '',
      registroSESAT: '',
      codigoPostal: '',
      acreditaUsoGoceInmueble: '',
      perfilEmpresa: '',
      reconocimientoMutuoCTPAT: ''
    });
    this.registroDomiciliosRfcSolicitanteForm.get('perfilEmpresa')?.enable();
    this.registroDomiciliosRfcSolicitanteForm.get('reconocimientoMutuoCTPAT')?.enable();
    
    // Limpiar estados de validación
    this.registroDomiciliosRfcSolicitanteForm.markAsUntouched();
    this.registroDomiciliosRfcSolicitanteForm.markAsPristine();
    
    // Resetear el formulario de domicilios registrados
    this.forma.patchValue({
      domiciliosRegistrados: null
    });
    
    this.forma.markAsUntouched();
    this.forma.markAsPristine();
  }

  /**
   * Convierte el valor del radio button (0/1) a su representación de texto (No/Sí)
   * @param value - El valor del radio button ('0' o '1')
   * @returns La representación de texto correspondiente
   */
  private static convertirValorRadioATexto(value: string): string {
    if (!value || value === '') {
      return '';
    }
    return value === '1' ? 'Sí' : 'No';
  }

  /**
   * Convierte el texto (No/Sí) a valor del radio button (0/1)
   * @param texto - El texto a convertir ('No' o 'Sí')
   * @returns El valor del radio button correspondiente
   */
  private static convertirTextoAValorRadio(texto: string): string {
    if (!texto || texto === '') {
      return '';
    }
    return texto === 'Sí' ? '1' : '0';
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
      this.tramite32617Store.establecerDatos({ [campo]: CONTROL.value });
      
      // Clear validation errors if the field now has a valid value
      if (CONTROL.valid && CONTROL.touched) {
        CONTROL.markAsPristine();
      }
    }
  }

    /**
   * @method ngOnDestroy
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  /**
 * Valida que exista al menos un domicilio registrado en la lista.
 * boolean indicating if there are domicilios registrados
 */
public validarDomiciliosRfcSolicitante(): boolean {
  this.mostrarErroresValidacion = true;

  let isValid = true;

  if (this.DomiciliosRfcSolicitanteList.length === 0) {
    // Mark the control as touched so the error shows
    this.forma.get('domiciliosRFCTabla')?.markAsTouched();
    isValid = false;
  } else {
    if (!this.tieneInstalacionPrincipal()) {
      isValid = false;
    }
    if (!this.tieneOperacionesComercioExterior()) {
      isValid = false;
    }
  }

  return isValid;
}
/**
 * Verifica si existe al menos una instalación principal con valor "Sí"
 * @returns boolean indicating if there's at least one main installation
 */
public tieneInstalacionPrincipal(): boolean {
  return this.DomiciliosRfcSolicitanteList.some(
    item => item.InstalacionesPrincipales === 'Sí'
  );
}
/**
 * Verifica si existe al menos una instalación que realice operaciones de comercio exterior
 * @returns boolean indicating if there's at least one installation doing foreign trade operations
 */
public tieneOperacionesComercioExterior(): boolean {
  return this.DomiciliosRfcSolicitanteList.some(
    item => item.realizaActividadComercioExterior === 'Sí'
  );
}

  /**
   * Limpia las validaciones según los datos disponibles
   */
  limpiarValidacionesSegunDatos(): void {
    // Limpiar validación de domicilios si hay al menos uno
    if (this.DomiciliosRfcSolicitanteList.length > 0) {
      this.forma.get('domiciliosRFCTabla')?.markAsUntouched();
      
      // Solo limpiar las validaciones específicas si se cumplen las condiciones
      if (this.tieneInstalacionPrincipal()) {
        this.forma.get('instalacionPrincipalTabla')?.markAsUntouched();
      }
      
      if (this.tieneOperacionesComercioExterior()) {
        this.forma.get('operacionesComercioExteriorTabla')?.markAsUntouched();
      }
    } else {
      // Si no hay datos, asegurar que las validaciones específicas no se muestren
      this.forma.get('instalacionPrincipalTabla')?.markAsUntouched();
      this.forma.get('operacionesComercioExteriorTabla')?.markAsUntouched();
    }
  }
  /**
   * Resetea todas las validaciones a su estado inicial
   */
  resetearValidaciones(): void {
    this.forma.get('domiciliosRFCTabla')?.markAsUntouched();
    this.forma.get('instalacionPrincipalTabla')?.markAsUntouched();
    this.forma.get('operacionesComercioExteriorTabla')?.markAsUntouched();
  }
}