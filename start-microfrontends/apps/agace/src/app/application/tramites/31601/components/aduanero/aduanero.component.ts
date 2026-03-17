import { Catalogo, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { ControlInventariosItem, Tabla } from '../../models/models31601.model';

import { AfterViewInit } from '@angular/core';
import { AgregarMiembroDeLaEmpresaComponent } from '../agregar-miembro-de-la-empresa/agregar-miembro-de-la-empresa.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CONTROL_INVENTARIOS_TABLA_CONFIGURACION } from '../../constantes/antecesor.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import Instalaciones from '@libs/shared/theme/assets/json/31601/Instalaciones.json';

import { CONFIGURATION_TABLA_MODIFICAR, MENCIONE_TABLA_CONFIGURACION, ModificarFormState } from '../../enum/mencione-tabla.enum';
import { MencioneConfiguracionItem } from '../../enum/mencione-tabla.enum';
import { Modal } from 'bootstrap';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { REGEX_RFC } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud31601State } from '../../../../estados/tramites/tramite31601.store';
import { Solocitud31601Service } from '../../services/service31601.service';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TableBody } from '../../models/models31601.model';
import { TableComponent } from '@ng-mf/data-access-user';
import { TablePaginationComponent } from '@ng-mf/data-access-user';
import { TemplateRef } from '@angular/core';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

import applicantRegistrados from '@libs/shared/theme/assets/json/31601/applicantRegistrados.json';
import comboBimestres from '@libs/shared/theme/assets/json/31601/comboBimestres.json';
import comboIMMEXJson from '@libs/shared/theme/assets/json/31601/comboIMMEX.json';
import controlInventarios from '@libs/shared/theme/assets/json/31601/controlInventarios.json';
import destinatarioTable from '@libs/shared/theme/assets/json/220401/destinatario-table.json';
import empleadosSubcontratacion from '@libs/shared/theme/assets/json/31601/empleadosSubcontratacion.json';
import entidadFederativa from '@libs/shared/theme/assets/json/31601/entidadFederative.json';
import establecimientoTable from '@libs/shared/theme/assets/json/220401/establecimiento-table.json';
import preOperativo from '@libs/shared/theme/assets/json/31601/preOperativo.json';
import prejson from '@libs/shared/theme/assets/json/31601/prejson.json';
import productivo from '@libs/shared/theme/assets/json/31601/productivo.json';
import serviciosAgace from '@libs/shared/theme/assets/json/31601/serviciosAgace.json';

/**
 * Componente para manejar el formulario reactivo y la paginación de una tabla relacionada con trámites aduaneros.
 *
 * Este componente implementa:
 * - Formularios reactivos con validación
 * - Modales para interacciones adicionales
 * - Tablas con paginación
 * - Integración con un estado global (NGXS)
 * - Carga de datos desde archivos JSON estáticos
 *
 * @implements {OnInit, AfterViewInit, OnDestroy}
 */
@Component({
  selector: 'app-aduanero',
  templateUrl: './aduanero.component.html',
  styleUrl: './aduanero.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
    TableComponent,
    TablePaginationComponent,
    TituloComponent,
    AgregarMiembroDeLaEmpresaComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  providers: [BsModalService],
})
export class AduaneroComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Almacena los datos de descripción en un formato predefinido cargado desde JSON
   */
/** 
 * Datos de entrada cargados desde un archivo JSON previo.
 */
descriptionData = prejson;

/**
 * Formulario reactivo que gestiona los datos del formulario principal de modificación.
 */
modificarForm!: FormGroup;

/**
 * Formulario reactivo que gestiona los datos relacionados con la entidad seleccionada.
 */
entidadForm!: FormGroup;

/**
 * Filas seleccionadas actualmente en la tabla de modificación.
 */
selectedIndiqueDatos: ModificarFormState[] = [];

/**
 * Indica si hay al menos una fila seleccionada en la tabla.
 */
hayFilasSeleccionadas = false;

/**
 * Índice de la fila seleccionada actualmente en el arreglo de datos.
 * Es null cuando no hay una fila seleccionada.
 */
selectedFilaIndex: number | null = null;

/**
 * Fila actualmente seleccionada. Es null si no hay selección activa.
 */
selectedFila: ModificarFormState | null = null;

/**
 * Índice de la fila que se encuentra en modo de edición.
 * Es null si no se está editando ninguna fila.
 */
indiceEditando: number | null = null;


  /**
   * Descripción en texto plano del componente
   */
  description: string = '';

  /**
   * Referencia al modal de modificación en la plantilla HTML
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;
  /**
   * Referencia al elemento de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;
  /**
   * Referencia al modal de instalaciones en la plantilla HTML
   */
  @ViewChild('instalacionesModal', { static: false })
  instalacionesModal!: ElementRef;
  /**
   * Variable que controla la visibilidad del modal.
   */
  public modal: string = 'modal';
/**
 * Abre el modal y, si hay una fila seleccionada, carga sus datos
 * en el formulario de modificación para permitir la edición.
 * 
 * - Establece `modal = 'show'` para mostrar el modal.
 * - Si hay una fila seleccionada y su índice no es nulo:
 *   - Guarda el índice en `indiceEditando`.
 *   - Rellena el formulario `modificarForm` con los datos de la fila seleccionada.
 */
  public abrirModal(): void {
    this.modal = 'show'; 
     if (this.selectedFila && this.selectedFilaIndex !== null) {
    this.indiceEditando = this.selectedFilaIndex;

    this.modificarForm.patchValue({
      principales: this.selectedFila.principales,
      instalacion: this.selectedFila.instalacion,
      federativa: this.selectedFila.federativa,
      municipio: this.selectedFila.municipio,
      colonia: this.selectedFila.colonia,
    });
  }
  
  }
  /**
   * Instancia del modal de modificación (Bootstrap)
   */
  modalInstance!: Modal;

  /**
   * Instancia del modal de instalaciones (Bootstrap)
   */
  modalInstanceInstalaciones!: Modal;

  /**
   * Formulario reactivo para datos preoperativos
   */
  preOperativeForm!: FormGroup;

  /**
   * Opciones para los radio buttons, cargadas desde archivo JSON
   */
  radioOptions = preOperativo;

  /**
   * Datos del cuerpo de la tabla de establecimientos
   */
  public establecimientoBodyData: unknown = [];

  /**
   * Lista de sectores productivos obtenidos desde JSON
   */
  sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Lista de servicios Agace obtenidos desde JSON
   */
  serviciosAgace: Catalogo[] = serviciosAgace;

  /**
   * Lista de bimestres para selección
   */
  comboBimestresIDC: Catalogo[] = comboBimestres;

  /**
   * Lista de entidades federativas cargadas desde JSON
   */
  entidadFederativa: Catalogo[] = entidadFederativa;

  /**
   * Indica si todos los elementos de una tabla están seleccionados
   */
  selectAll: boolean = false;

  /**
   * Datos de control de inventarios obtenidos desde JSON
   */
  controlInventarios: Tabla = controlInventarios;
  /**
 * Índice de la fila seleccionada para edición. 
 * Es null cuando no hay ninguna fila seleccionada.
 */
  filaSeleccionadaIndex: number | null = null;
  /**
   * Lista de opciones IMMEX cargadas desde JSON
   */
  comboIMMEX: Catalogo[] = comboIMMEXJson;
/**
 * Valor utilizado para definir el tipo de selección por checkbox en la tabla.
 */
public checkboxValor = TablaSeleccion.CHECKBOX;

/**
 * Arreglo que contiene los datos del formulario en forma de lista para ser mostrados y modificados.
 */
modificarDatos: ModificarFormState[] = [];

/**
 * Configuración de columnas para la tabla de modificación,
 * definida por la constante `CONFIGURATION_TABLA_MODIFICAR`.
 */
configuracionindiqueDatos: ConfiguracionColumna<ModificarFormState>[] = CONFIGURATION_TABLA_MODIFICAR;

  /**
   * Encabezados de la tabla de establecimientos
   */
  public establecimientoHeaderData: string[] = [];

  /**
   * Datos completos de los establecimientos
   */
  public fullEstablecimientoBodyData: unknown[] = [];

  /**
   * Datos de la tabla de establecimientos obtenidos desde JSON
   */
  public getEstablecimientoTableData = establecimientoTable;

  /**
   * Datos de la tabla de destinatarios obtenidos desde JSON
   */
  public getDestinatarioTableData = destinatarioTable;

  /**
   * Datos de empleados bajo subcontratación
   */
  public empleadosSubcontratacion = empleadosSubcontratacion;

  /**
   * Lista de aplicantes registrados
   */
  public applicantRegistrados = applicantRegistrados;

  /**
   * Información sobre instalaciones obtenidas desde JSON
   */
  public Instalaciones = Instalaciones;

  /**
   * Datos paginados de los establecimientos
   */
  public paginatedEstablecimientoBodyData: unknown[] = [];

  /**
   * Ruta base para peticiones al servidor
   */
  contextPath: string = '';

  /**
   * Número total de elementos en la tabla
   */
  totalItems: number = 0;

  /**
   * Página actual de la paginación
   */
  currentPage: number = 1;

  /**
   * Cantidad de elementos por página en la paginación
   */
  itemsPerPage: number = 5;

  /**
   * Encabezados de la tabla de empleados
   */
  public empleadosHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de empleados
   */
  public empleadosBodyData: TableBody[] = [];

  /**
   * Encabezados de la tabla de domicilios
   */
  public domiciliosHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de domicilios
   */
  public domiciliosBodyData: TableBody[] = [];

/**
 * Indica si se está en modo edición. 
 * true para modificar una fila existente, false para agregar una nueva.
 */
  modoEdicion: boolean = false;
  /**
   * Encabezados de la tabla de instalaciones
   */
  public InstalacionesHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de instalaciones
   */
  public InstalacionesBodyData: TableBody[] = [];

  /**
   * Estado de la solicitud
   */
  public solicitudState!: Solicitud31601State;

  /**
   * Subject para manejar la destrucción de observables
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Bandera que indica si no se ha subido ningún archivo
   */
  public noSeHaSubidoNingunArchivo: boolean = false;

  /**
   * Referencia al modal de ngx-bootstrap
   */
  modalRef?: BsModalRef;

  /**
   * Indica si el formulario está en modo solo lectura
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Configuración de las columnas para la tabla de mencione.
   */
  configuracionTablaMencione: ConfiguracionColumna<MencioneConfiguracionItem>[] =
    MENCIONE_TABLA_CONFIGURACION;

  /**
   * Tipo de selección para la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Datos de la tabla de mencione.
   */
  datosTablaMencione!: MencioneConfiguracionItem[];

  /**
   * Indica si el botón de eliminar debe estar habilitado o no en la interfaz de usuario.
   */
  enableEliminarBoton: boolean = false;
  /**
   * Indica si el botón de modificar debe estar habilitado o no en la interfaz de usuario.
   */
  enableModficarBoton: boolean = false;
  /**
   * Lista de filas seleccionadas en la tabla de mencione.
   */
  listaFilaSeleccionadaMencione: MencioneConfiguracionItem[] = [];
  /**
   * Fila seleccionada actualmente en la tabla de mencione.
   */
  filaSeleccionadaMencione: MencioneConfiguracionItem | null = null;
  /**
   * Indica si se debe mostrar la tabla de menciones.
   */
  showMencioneTabla: boolean = false;
  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Configuración de las columnas para la tabla de control de inventarios.
   */
  configuracionTablaControlInventarios: ConfiguracionColumna<ControlInventariosItem>[] =
    CONTROL_INVENTARIOS_TABLA_CONFIGURACION;

  /**
   * Datos de la tabla de control de inventarios.
   */
  datosTablaControlInventarios: ControlInventariosItem[] = [];

  /**
   * Indica si el botón de eliminar debe estar habilitado para control inventarios.
   */
  enableEliminarBotonControlInventarios: boolean = false;

  /**
   * Indica si el botón de modificar debe estar habilitado para control inventarios.
   */
  enableModificarBotonControlInventarios: boolean = false;

  /**
   * Lista de filas seleccionadas en la tabla de control inventarios.
   */
  listaFilaSeleccionadaControlInventarios: ControlInventariosItem[] = [];

  /**
   * Fila seleccionada actualmente en la tabla de control inventarios.
   */
  filaSeleccionadaControlInventarios: ControlInventariosItem | null = null;

  /**
   * Indica si el popup de confirmación de eliminación está abierto para control inventarios.
   */
  confirmEliminarPopupAbiertoControlInventarios: boolean = false;

  /**
   * Referencia al modal de control inventarios en la plantilla HTML
   */
  @ViewChild('controlInventariosModal', { static: false })
  controlInventariosModal!: ElementRef;

  /**
   * Instancia del modal de control inventarios (Bootstrap)
   */
  modalInstanceControlInventarios!: Modal;

  /**
   * Indica si los campos obligatorios de control inventarios han sido respondidos.
   */
  camposObligatoriosRespondidosControlInventarios: boolean = false;

  /**
   * Configuración para mostrar notificación de éxito
   */
  public notificacionExito: Notificacion | null = null;

  /**
   * Indica si los campos obligatorios han sido respondidos.
   * 
   * @type {boolean}
   * @memberof AduaneroComponent
   */
  mandatoryFieldsAnswered: boolean = false;

  /** Indica si el formulario de Control Inventarios ha sido enviado. 
 * Se utiliza para mostrar validaciones y controlar el estado de envío del formulario. */
  public formSubmittedControlInventarios = false;

  /**
 * Almacena temporalmente el índice y el elemento de Control Inventarios que está pendiente de actualización.
 * Es útil para manejar la confirmación antes de modificar los datos en la tabla.
 */
  private pendingControlInventariosUpdate: { index: number, item: ControlInventariosItem } | null = null;

  /**
 * Formulario reactivo utilizado exclusivamente para el modal de Control Inventarios.
 * Permite gestionar y validar los datos cuando se agrega o modifica un elemento desde el modal.
 */
  public controlInventariosModalForm!: FormGroup;


  /**
   * Constructor del componente
   * @param fb - FormBuilder para crear formularios reactivos
   * @param tramite31601Store - Store para manejar el estado del trámite
   * @param tramite31601Query - Query para obtener datos del trámite
   * @param modalService - Servicio para manejar modales
   * @param consultaioQuery - Query para consultar el estado
   */
  constructor(
    private fb: FormBuilder,
    private tramite31601Store: Tramite31601Store,
    private tramite31601Query: Tramite31601Query,
    private modalService: BsModalService,
    private consultaioQuery: ConsultaioQuery,
    private solicitudService: Solocitud31601Service
  ) {
    // Suscripción al estado de Consultaio para manejar el modo de solo lectura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente:
   * - Configura el estado inicial del formulario
   * - Carga datos de establecimientos, empleados, domicilios e instalaciones
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getEstablecimiento();
    this.getEmpleadosData();
    this.getDomiciliosData();
    this.getInstalaciones();

    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
      )
      .subscribe((seccionState) => {
          this.datosTablaMencione = seccionState.mencioneDatos || [];
               });

    this.showMencioneTabla = this.preOperativeForm.get('senaleSi')?.value === 'Si';
    this.preOperativeForm.get('senaleSi')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((value) => {
        this.showMencioneTabla = value === 'Si';
      });

    
    this.solicitudService.getMencioneDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.datosTablaMencione = datos;
        this.tramite31601Store.setMencioneTablaDatos(this.datosTablaMencione);
      });
  }

  /**
   * Inicializa el estado del formulario:
   * - Suscribe al estado de la solicitud
   * - Crea el formulario reactivo con validaciones
   * - Configura el modo de solo lectura si es necesario
   */
  inicializarEstadoFormulario(): void {
    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    /**
 * Inicializa el formulario `entidadForm` con un control llamado `federativaSeleccionada`.
 * Este formulario se utiliza para manejar la selección de la entidad federativa.
 */
    this.entidadForm = this.fb.group({
  federativaSeleccionada: ['']
});
/**
 * Formulario reactivo para capturar datos de instalaciones.
 * Incluye validaciones requeridas en campos clave como principales, instalación, proceso e inmueble.
 * Otros campos capturan datos como municipio, federativa, colonia y código postal.
 */
    this.modificarForm = this.fb.group({
      principales: [null, Validators.required],
      municipio: [null],
      instalacion:  [null, Validators.required],
      federativa: [null],
      registro: [null],
      colonia: [null],
      postal: [null],
      proceso: [null, Validators.required],
      inmueble: [null, Validators.required],
    });
    this.preOperativeForm = this.fb.group({
      autorizacionIVAIEPS: [
        this.solicitudState?.autorizacionIVAIEPS,
        Validators.required,
      ],
      regimen_0: [this.solicitudState?.regimen_0],
      regimen_1: [this.solicitudState?.regimen_1],
      regimen_2: [this.solicitudState?.regimen_2],
      regimen_3: [this.solicitudState?.regimen_3],
      sectorProductivo: [this.solicitudState?.sectorProductivo],
      servicio: [this.solicitudState?.servicio],
      preOperativo: [this.solicitudState?.preOperativo, Validators.required],
      indiqueSi: [this.solicitudState?.indiqueSi, Validators.required],
      senale: [this.solicitudState?.senale, Validators.required],
      empPropios: [
        this.solicitudState?.empPropios,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(99999999),
          Validators.maxLength(8),
        ],
      ],
      bimestre: [this.solicitudState?.bimestre],
      senaleSi: [this.solicitudState?.senaleSi, Validators.required],
      acredite: [this.solicitudState?.acredite, Validators.required],
      seMomento: [this.solicitudState?.seMomento, Validators.required],
      cumplir: [this.solicitudState?.cumplir, Validators.required],
      indique: [this.solicitudState?.indique, Validators.required],
      encuentra: [this.solicitudState?.encuentra, Validators.required],
      delMismo: [this.solicitudState?.delMismo, Validators.required],
      senaleMomento: [this.solicitudState?.senaleMomento, Validators.required],
      enCaso: [this.solicitudState?.enCaso, Validators.required],
      comboBimestresIDCSeleccione: [
        this.solicitudState?.comboBimestresIDCSeleccione,
      ],
      ingresar: [this.solicitudState?.ingresar, Validators.required],
      encuentraSus: [this.solicitudState?.encuentraSus, Validators.required],
      registrosQue: [this.solicitudState?.registrosQue],
      registrosQue2: [this.solicitudState?.registrosQue2],
      momentoIngresar: [
        this.solicitudState?.momentoIngresar,
        Validators.required,
      ],
      indiqueCuenta: [this.solicitudState?.indiqueCuenta, Validators.required],
      indiqueCheck: [this.solicitudState?.indiqueCheck],
      nombreDel: [
        this.solicitudState?.nombreDel,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
      lugarDeRadicacion: [
        this.solicitudState?.lugarDeRadicacion,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
      contabilidad: [this.solicitudState?.contabilidad, Validators.required],
      rmfRadio: [this.solicitudState?.rmfRadio, Validators.required],
      vinculacionRegistroCancelado: [
        this.solicitudState?.vinculacionRegistroCancelado,
        Validators.required,
      ],
      proveedoresListadoSAT: [
        this.solicitudState?.proveedoresListadoSAT,
        Validators.required,
      ],
      numeroAutorizacionCITES: [
        '',
        [Validators.required, Validators.pattern(REGEX_RFC)],
      ],
      rfc: ['', [Validators.required, Validators.pattern(REGEX_RFC)]],
      razonSocial: ['', [Validators.required, Validators.minLength(3)]],
      numeroEmpleados: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      empleadosPropios: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(99999999),
          Validators.maxLength(8),
        ],
      ],
      archivoNacionales: [''],
      bimestreValor:['']
    });

  this.controlInventariosModalForm = this.fb.group({
  nombreDel: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
  lugarDeRadicacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
  indiqueCheck: [false]
});

    // Configuración del modo de solo lectura
    if (this.esFormularioSoloLectura) {
      Object.keys(this.preOperativeForm.controls).forEach((key) => {
        this.preOperativeForm.get(key)?.disable();
      });
    } else {
      Object.keys(this.preOperativeForm.controls).forEach((key) => {
        this.preOperativeForm.get(key)?.enable();
      });
    }
      this.preOperativeForm.get('nombreDel')?.disable();
      this.preOperativeForm.get('lugarDeRadicacion')?.disable();
      this.preOperativeForm.get('indiqueCheck')?.disable();
   
    this.preOperativeForm.get('indiqueCuenta')?.valueChanges.subscribe((value) => {
    if (value === 'Si') {
      this.preOperativeForm.get('nombreDel')?.enable();
      this.preOperativeForm.get('lugarDeRadicacion')?.enable(); 
       this.preOperativeForm.get('indiqueCheck')?.enable();
    } else {
     this.preOperativeForm.get('nombreDel')?.disable();
      this.preOperativeForm.get('lugarDeRadicacion')?.disable();
       this.preOperativeForm.get('indiqueCheck')?.disable();
    }
  });
  }

  /**
   * Método ejecutado después de inicializada la vista:
   * - Inicializa los modales de modificación e instalaciones
   */
  ngAfterViewInit(): void {
    // Inicializa el modal de modificación
    if (this.modifyModal) {
      this.modalInstance = new Modal(this.modifyModal.nativeElement);
    }

    // Inicializa el modal de instalaciones
    if (this.instalacionesModal) {
      this.modalInstanceInstalaciones = new Modal(
        this.instalacionesModal.nativeElement
      );
    }

    if (this.controlInventariosModal) {
      this.modalInstanceControlInventarios = new Modal(
        this.controlInventariosModal.nativeElement
      );
    }
  }

  /**
   * Maneja la selección de filas en la tabla de control inventarios.
   */
  manejarFilaSeleccionadaControlInventarios(fila: ControlInventariosItem[]): void {
    if (fila.length === 0) {
      this.enableModificarBotonControlInventarios = false;
      this.enableEliminarBotonControlInventarios = false;
      return;
    }
    this.listaFilaSeleccionadaControlInventarios = fila;
    this.filaSeleccionadaControlInventarios = fila[fila.length - 1];
    this.enableModificarBotonControlInventarios = true;
    this.enableEliminarBotonControlInventarios = true;
  }

  /**
   * Abre el modal de control inventarios para agregar nuevo elemento.
   */
  openControlInventariosModal(): void {
  if (this.modalInstanceControlInventarios) {
    this.controlInventariosModalForm.reset({
      nombreDel: '',
      lugarDeRadicacion: '',
      indiqueCheck: false
    });
    this.controlInventariosModalForm.markAsUntouched();
    this.modalInstanceControlInventarios.show();
  }
}

  /**
   * Abre el modal de control inventarios para modificar elemento existente.
   */
  openModifyControlInventariosModal(): void {
  if (this.modalInstanceControlInventarios && this.filaSeleccionadaControlInventarios) {
    this.controlInventariosModalForm.patchValue({
      nombreDel: this.filaSeleccionadaControlInventarios.nombreSistema,
      lugarDeRadicacion: this.filaSeleccionadaControlInventarios.lugarRadicacion,
      indiqueCheck: this.filaSeleccionadaControlInventarios.anexo24
    });
    this.controlInventariosModalForm.markAsUntouched();
    this.modalInstanceControlInventarios.show();
  }
}

  /**
   * Cierra el modal de control inventarios.
   */
  closeControlInventariosModal(): void {
    if (this.modalInstanceControlInventarios) {
      this.modalInstanceControlInventarios.hide();
    }
  }


  /**
   * Agrega un nuevo elemento a la tabla de control de inventarios directamente.
   */
  agregarNuevoElementoControlInventarios(): void {
    this.formSubmittedControlInventarios = true;

  if (
    !this.preOperativeForm.get('nombreDel')?.valid ||
    !this.preOperativeForm.get('lugarDeRadicacion')?.valid
  ) {
    this.preOperativeForm.get('nombreDel')?.markAsTouched();
    this.preOperativeForm.get('lugarDeRadicacion')?.markAsTouched();
    return;
  }

    this.camposObligatoriosRespondidosControlInventarios =
      Boolean(this.preOperativeForm.get('nombreDel')?.valid) &&
      Boolean(this.preOperativeForm.get('lugarDeRadicacion')?.valid);

    if (this.camposObligatoriosRespondidosControlInventarios) {
      const NEW_ITEM: ControlInventariosItem = {
        id: (this.datosTablaControlInventarios.length + 1).toString(),
        nombreSistema: this.preOperativeForm.get('nombreDel')?.value,
        lugarRadicacion: this.preOperativeForm.get('lugarDeRadicacion')?.value,
        anexo24: this.preOperativeForm.get('indiqueCheck')?.value || false
      };

      this.datosTablaControlInventarios.push(NEW_ITEM);
      this.tramite31601Store.setControlInventariosTablaDatos(this.datosTablaControlInventarios);

      this.preOperativeForm.get('nombreDel')?.reset();
      this.preOperativeForm.get('lugarDeRadicacion')?.reset();
      this.preOperativeForm.get('indiqueCheck')?.reset();
      this.preOperativeForm.updateValueAndValidity();

      this.preOperativeForm.get('nombreDel')?.markAsUntouched();
      this.preOperativeForm.get('lugarDeRadicacion')?.markAsUntouched();

      this.camposObligatoriosRespondidosControlInventarios = false;
      this.formSubmittedControlInventarios = false;
      this.mostrarNotificacionExito();
    }
  }

  /**
   * Muestra la notificación de éxito después de agregar un elemento
   */
  private mostrarNotificacionExito(): void {
    this.notificacionExito = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: '',
      titulo: '',
      mensaje: 'Datos guardados correctamente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-sm'
    };
  }

  /**
   * Maneja la confirmación de la notificación
   */
  onConfirmacionNotificacion(confirmado: boolean): void {
  if (confirmado) {
    if (this.pendingControlInventariosUpdate) {
      this.datosTablaControlInventarios[this.pendingControlInventariosUpdate.index] =
        this.pendingControlInventariosUpdate.item;
      this.tramite31601Store.setControlInventariosTablaDatos(this.datosTablaControlInventarios);
      this.pendingControlInventariosUpdate = null;
    }
    this.notificacionExito = null;
  }
}

  /**
   * Modifica un elemento existente en la tabla de control inventarios usando modal.
   */
modificaControlInventariosItem(): void {
  this.formSubmittedControlInventarios = true;
  if (
    !this.controlInventariosModalForm.get('nombreDel')?.valid ||
    !this.controlInventariosModalForm.get('lugarDeRadicacion')?.valid
  ) {
    this.controlInventariosModalForm.get('nombreDel')?.markAsTouched();
    this.controlInventariosModalForm.get('lugarDeRadicacion')?.markAsTouched();
    return;
  }

  const INDEX = this.datosTablaControlInventarios.findIndex(
    item => item.id === this.filaSeleccionadaControlInventarios?.id
  );

  if (INDEX !== -1) {
    this.datosTablaControlInventarios[INDEX] = {
      id: this.filaSeleccionadaControlInventarios?.id ?? (INDEX + 1).toString(),
      nombreSistema: this.controlInventariosModalForm.get('nombreDel')?.value,
      lugarRadicacion: this.controlInventariosModalForm.get('lugarDeRadicacion')?.value,
      anexo24: this.controlInventariosModalForm.get('indiqueCheck')?.value || false
    };

    this.tramite31601Store.setControlInventariosTablaDatos(this.datosTablaControlInventarios);

    this.notificacionExito = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: '',
      titulo: '',
      mensaje: 'Datos guardados correctamente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-sm'
    };

    this.controlInventariosModalForm.reset({
      nombreDel: '',
      lugarDeRadicacion: '',
      indiqueCheck: false
    });
    this.controlInventariosModalForm.markAsUntouched();
    this.formSubmittedControlInventarios = false;
    this.closeControlInventariosModal();
    this.camposObligatoriosRespondidosControlInventarios = false;
  }
}

  /**
   * Confirma la eliminación de los elementos seleccionados.
   */
  confirmEliminarControlInventariosItem(): void {
    if (this.listaFilaSeleccionadaControlInventarios.length === 0) {
      return;
    }
    this.abrirEliminarConfirmationPopupControlInventarios();
  }

  /**
   * Abre el popup de confirmación de eliminación para control inventarios.
   */
  abrirEliminarConfirmationPopupControlInventarios(): void {
    this.confirmEliminarPopupAbiertoControlInventarios = true;
  }

  /**
   * Cierra el popup de confirmación de eliminación para control inventarios.
   */
  cerrarEliminarConfirmationPopupControlInventarios(): void {
    this.confirmEliminarPopupAbiertoControlInventarios = false;
  }

  /**
   * Elimina los elementos seleccionados de la tabla de control inventarios.
   */
  eliminarControlInventariosItem(): void {
    const IDS_ELIMINAR = this.listaFilaSeleccionadaControlInventarios.map(
      (item) => item.id
    );

    this.datosTablaControlInventarios = this.datosTablaControlInventarios.filter(
      (item) => !IDS_ELIMINAR.includes(item.id)
    );

    this.listaFilaSeleccionadaControlInventarios = [];
    this.filaSeleccionadaControlInventarios = null;
    this.enableModificarBotonControlInventarios = false;
    this.enableEliminarBotonControlInventarios = false;
    this.tramite31601Store.setControlInventariosTablaDatos(this.datosTablaControlInventarios);
    this.cerrarEliminarConfirmationPopupControlInventarios();
  }

    /**
   * Indica si se debe mostrar la tabla de subcontratación.
   * 
   * Retorna true si la opción seleccionada en el radio 'senaleSi' es 'Si'.
   * Esto permite mostrar u ocultar dinámicamente la sección relacionada
   * con trabajadores subcontratados en el formulario.
   */
  get showSubcontratacionTable(): boolean {
    return this.preOperativeForm?.get('senaleSi')?.value === 'Si';
  }
  
  /**
   * Nombre del archivo seleccionado por el usuario.
   * Se actualiza cada vez que el usuario selecciona un archivo en el input correspondiente.
   */
  public selectedFileName: string = '';

  /**
   * Maneja el evento de selección de archivo.
   * 
   * Este método se ejecuta cuando el usuario selecciona un archivo en el input de tipo file.
   * Actualiza la propiedad `selectedFileName` con el nombre del archivo seleccionado.
   * Si no se selecciona ningún archivo, la propiedad se establece como una cadena vacía.
   * 
   *  event Evento de cambio generado por el input de tipo file.
   */
  onFileSelected(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.selectedFileName = INPUT.files[0].name;
    } else {
      this.selectedFileName = '';
    }
  }
  /**
   * Indica si se debe mostrar la sección relacionada con el campo 'senale'.
   * 
   * Retorna true si la opción seleccionada en el radio 'senale' es 'Si'.
   * Esto permite mostrar u ocultar dinámicamente la sección correspondiente
   * en el formulario.
   */
  get showsenale(): boolean {
    return this.preOperativeForm?.get('senale')?.value === 'Si';
  }
  /**
 * Abre el modal para modificar una fila existente de la tabla.
 * Establece el modo edición y carga los datos seleccionados en el formulario.
 */
openModifyModal(): void {
  if (this.filaSeleccionadaMencione) {
    this.modoEdicion = true;

      const INDEX = this.datosTablaMencione.findIndex(
      item => item.id === this.filaSeleccionadaMencione?.id
    );

    if (INDEX !== -1) {
      this.filaSeleccionadaIndex = INDEX; 
    }

    this.preOperativeForm.patchValue({      
      rfc: this.filaSeleccionadaMencione.rfc,
      razonSocial: this.filaSeleccionadaMencione.social,
      numeroEmpleados: this.filaSeleccionadaMencione.noumero,
      empleadosPropios: this.filaSeleccionadaMencione.bimestre,     
    });

    this.modalInstance?.show();
  }
}
/**
 * Abre el modal para agregar un nuevo elemento.
 * Limpia el formulario y desactiva el modo edición.
 */
  openAgregarModal(): void {
    if (this.modalInstance) {
       this.modoEdicion = false;
    this.filaSeleccionadaIndex = null;
      this.preOperativeForm.patchValue({
        rfc: '',
        razonSocial: '',
        numeroEmpleados:'',
        empleadosPropios:'',
        bimestreValor:'',
        numeroAutorizacionCITES: '',
      })
      this.modalInstance.show();
    }
  }

  /**
   * Cierra el modal de modificación
   */
  closeModifyModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
   * Abre el modal de instalaciones
   */
  openInstalacionesModal(): void {
    if (this.modalInstanceInstalaciones) {
      this.modalInstanceInstalaciones.show();
    }
  }

  /**
   * Obtiene y asigna los datos de empleados desde JSON
   */
  public getEmpleadosData(): void {
    this.empleadosHeaderData = this.empleadosSubcontratacion.tableHeader;
    this.empleadosBodyData = this.empleadosSubcontratacion.tableBody;
  }

  /**
   * Obtiene y asigna los datos de domicilios desde JSON
   */
  public getDomiciliosData(): void {
    this.domiciliosHeaderData = this.applicantRegistrados.tableHeader;
    this.domiciliosBodyData = this.applicantRegistrados.tableBody;
  }

  /**
   * Obtiene y asigna los datos de instalaciones desde JSON
   */
  public getInstalaciones(): void {
    this.InstalacionesHeaderData = this.Instalaciones.tableHeader;
    this.InstalacionesBodyData = this.Instalaciones.tableBody;
  }

  /**
   * Obtiene y asigna los datos de establecimientos desde JSON
   */
  public getEstablecimiento(): void {
    this.establecimientoHeaderData =
      this.getEstablecimientoTableData.tableHeader;
    this.establecimientoBodyData = this.getEstablecimientoTableData.tableBody;
  }

  /**
   * Actualiza la paginación de la tabla de establecimientos
   */
  updatePagination(): void {
    const START_INDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.establecimientoBodyData = this.fullEstablecimientoBodyData.slice(
      START_INDEX,
      START_INDEX + this.itemsPerPage
    );
  }

  /**
   * Maneja el cambio de página en la paginación
   * @param page - Número de página seleccionada
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
      /**
   * Maneja el cambio en el número de elementos por página
   * @param itemsPerPage - Número de elementos por página
   */
  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }
  /**
 * Maneja la selección de filas en la tabla.
 * Guarda la fila seleccionada si solo hay una y obtiene su índice.
 * Limpia la selección si hay cero o múltiples filas seleccionadas.
 */
onFilasSeleccionadas(filas: ModificarFormState[]): void {
   this.selectedIndiqueDatos = filas;
  this.hayFilasSeleccionadas = filas.length > 0;
  if (filas.length === 1) {   
    this.selectedFila = filas[0];   
    this.selectedFilaIndex = this.modificarDatos.indexOf(this.selectedFila);    
    if (this.selectedFilaIndex === -1) {
      this.selectedFilaIndex = null;
    }
  } else {    
    this.selectedFila = null;
    this.selectedFilaIndex = null;
  }
}
  /**
   * Establece valores en el store del trámite
   * @param form - FormGroup que contiene los datos
   * @param campo - Nombre del campo a guardar
   * @param metodoNombre - Nombre del método en el store
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31601Store
  ): void {
    const VALOR = form.get(campo)?.value;
   if(campo === 'senaleSi' && VALOR === 'Si') {
    this.showMencioneTabla = true;
   }
    (this.tramite31601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Abre el modal para subir archivos
   * @param template - TemplateRef del modal a mostrar
   */
  subirArchivo(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template);
    if (this.preOperativeForm.get('archivoNacionales')?.value === '') {
      this.noSeHaSubidoNingunArchivo = true;
    }
  }

  /**
   * Cierra el modal de subir archivos
   */
  cerrar(): void {
    this.modalRef?.hide();
    this.noSeHaSubidoNingunArchivo = false;
  }

  /**
   * Maneja la selección de filas en la tabla de mencione.
   * 
   * Habilita o deshabilita los botones de modificar y eliminar según si hay filas seleccionadas.
   * Actualiza la lista de filas seleccionadas y la última fila seleccionada.
   * 
   * @param fila - Arreglo de elementos seleccionados de tipo MencioneConfiguracionItem.
   */
  manejarFilaSeleccionada(fila: MencioneConfiguracionItem[]): void {
    if (fila.length === 0) {
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.listaFilaSeleccionadaMencione = fila;
    this.filaSeleccionadaMencione = fila[fila.length - 1];
    this.enableModficarBoton = true;
    this.enableEliminarBoton = true;
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mencione.
   * 
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
  confirmEliminarMencioneItem(): void {
      // Verifica si hay elementos seleccionados
    if (this.listaFilaSeleccionadaMencione.length === 0) {
      return;
    }
    this.abrirElimninarConfirmationopup();
  }

  /**
 * Abre el popup de selección múltiple si el botón de modificar está habilitado.
 */
  abrirMultipleSeleccionPopup(): void {
    if (this.enableModficarBoton) {
      this.multipleSeleccionPopupAbierto = true;
    }
  }

  /**
 * Cierra el popup de selección múltiple.
 */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
 * Abre el popup de confirmación de eliminación.
 */
  abrirElimninarConfirmationopup(): void {
    this.confirmEliminarPopupAbierto = true;
  }

  /**
 * Cierra el popup de confirmación de eliminación.
 */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
 * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
 * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
 */
  eliminarMercanciaItem(): void {
    const IDS_TO_DELETE = this.listaFilaSeleccionadaMencione.map(
      (item) => item.id
    );

    this.datosTablaMencione = this.datosTablaMencione.filter(
      (item) => !IDS_TO_DELETE.includes(item.id)
    );

    this.listaFilaSeleccionadaMencione = [];
    this.tramite31601Store.setMencioneTablaDatos(this.datosTablaMencione);
    this.cerrarEliminarConfirmationPopup();
  }

  /**
   * Agrega un nuevo elemento a la tabla de mencione si los campos obligatorios están completos y válidos.
   *
   * Valida que los campos RFC, razón social, número de empleados, empleados propios y número de autorización CITES sean válidos.
   * Si la validación es exitosa, crea un nuevo objeto MencioneConfiguracionItem y lo agrega a la tabla,
   * actualizando el estado correspondiente en el store.
   */
addNewMencioneItem(): void {
  this.mandatoryFieldsAnswered =
    Boolean(this.preOperativeForm.get('rfc')?.valid) &&
    Boolean(this.preOperativeForm.get('razonSocial')?.valid) &&
    Boolean(this.preOperativeForm.get('numeroEmpleados')?.valid) &&
    Boolean(this.preOperativeForm.get('numeroAutorizacionCITES')?.valid) &&
    Boolean(this.preOperativeForm.get('bimestreValor')?.valid);

  if (this.mandatoryFieldsAnswered) {
    const ESDICION = this.modoEdicion && this.filaSeleccionadaIndex !== null; 

    const NEWITEMS: MencioneConfiguracionItem = {
      id: ESDICION
        ? this.datosTablaMencione[this.filaSeleccionadaIndex as number].id
        : (this.datosTablaMencione.length + 1).toString(),
      rfc: this.preOperativeForm.get('rfc')?.value,
      social: this.preOperativeForm.get('razonSocial')?.value,
      noumero: this.preOperativeForm.get('numeroEmpleados')?.value,     
      bimestre: this.comboBimestresIDC.find(item => item.id === Number(this.preOperativeForm.value.bimestreValor))?.descripcion ?? '',
    };

    if (ESDICION && this.filaSeleccionadaIndex !== null) {
      const INDEX = this.filaSeleccionadaIndex;
      this.datosTablaMencione[INDEX] = NEWITEMS;
    } else {
      this.datosTablaMencione.push(NEWITEMS);
    }   
    this.tramite31601Store.setMencioneTablaDatos(this.datosTablaMencione);
    this.mandatoryFieldsAnswered = false;
    this.modoEdicion = false;
    this.filaSeleccionadaIndex = null;
    this.filaSeleccionadaMencione = null;

    this.modalInstance?.hide();
       this.preOperativeForm.patchValue({
      rfc: '',
      razonSocial: '',
      numeroEmpleados: '',
      empleadosPropios: '',
      bimestreValor: '',
      numeroAutorizacionCITES: '',
    });

    ['rfc', 'razonSocial', 'numeroEmpleados', 'empleadosPropios', 'bimestreValor', 'numeroAutorizacionCITES'].forEach(field => {
      const CONTROL = this.preOperativeForm.get(field);
      CONTROL?.markAsUntouched();
      CONTROL?.setErrors(null);
    });
  }
}
/**
 * Guarda los datos del formulario en la lista `modificarDatos`.
 * Si se está editando, actualiza la fila; si no, agrega una nueva.
 * Reinicia el formulario y cierra el modal al finalizar.
 */
guardarModificarDatos(): void {
  if (this.modificarForm.invalid) {
    this.modificarForm.markAllAsTouched();
    return;
  }
  const NUEVODATO: ModificarFormState = {
    principales: this.modificarForm.value.principales,
    instalacion: this.modificarForm.value.instalacion,
    federativa: this.modificarForm.value.federativa,
    municipio: this.modificarForm.value.municipio,
    colonia: this.modificarForm.value.colonia,
  };

  if (this.indiceEditando !== null) {
       this.modificarDatos[this.indiceEditando] = NUEVODATO;
    this.indiceEditando = null;
  } else {    
    this.modificarDatos.push(NUEVODATO);
  }

  this.modificarForm.reset();
  this.closeModal.nativeElement.click();
}
/**
 * Elimina la fila actualmente seleccionada de la lista `modificarDatos`.
 * Limpia la selección y actualiza el estado.
 * Solo se ejecuta si hay una fila seleccionada.
 */
eliminarFilaSeleccionada(): void {
  if (this.selectedFilaIndex !== null) {
    this.modificarDatos.splice(this.selectedFilaIndex, 1);
    this.modificarDatos = [...this.modificarDatos];    
    this.selectedFila = null;
    this.selectedFilaIndex = null;
    this.hayFilasSeleccionadas = false;
  }
}
/**
 * Agrega una nueva fila a `modificarDatos` usando datos del formulario y de la tabla `Instalaciones`.
 * Extrae valores por posición desde `tableBody`.
 * Asegura valores por defecto vacíos si algún dato falta.
 * */
acceptarValor(): void {
  const DATOSINSTALACION = this.Instalaciones?.tableBody?.[0]?.tbodyData ?? []; 
  this.modificarDatos.push({
    principales: this.modificarForm.value.principales || '',
    municipio: DATOSINSTALACION[1] || '',
    instalacion: this.modificarForm.value.instalacion || '',
    federativa: DATOSINSTALACION[0] || '',    
    colonia: DATOSINSTALACION[2] || '',   
  });
}
  /**
   * Método ejecutado al destruir el componente:
   * - Cancela suscripciones activas
   * - Limpia observables
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
