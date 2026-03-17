/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  ConsultaioState,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  SharedModule,
  TablaDinamicaComponent,
  TablaDinamicaExpandidaComponent,
  TablaSeleccion,
  TituloComponent,
  formatearFechaSolicitudSinHora,
} from '@libs/shared/data-access-user/src';
import {
  CapturarSolicitud,
  DatosDeLaSolicitud,
  DatosParaMovilizacionNacional,
  FilaSolicitud,
  PagoDeDerechos,
  SolicitudData
} from '../../models/220201/capturar-solicitud.model';
import { DatosForma, RadioOpcion } from '../../models/220201/certificado-zoosanitario.model';
import { DetallasDatos, Sensible } from '../../../../shared/models/datos-de-la-solicitue.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SELECCIONADO, TEXTOS } from '../../constantes/certificado-zoosanitario.enum';
import { Subject, debounceTime, map, takeUntil } from 'rxjs';
import { AnimalesVivoContenedoraComponent } from '../animales-vivo-contenedora/animales-vivo-contenedora.component';
import { CONFIGURACION_SENSIBLES } from '../../../../shared/constantes/datos-de-la-solicitue.enum';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service';
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { ColumnConfig } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica-expandida/tabla-dinamica-exp.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

import { PrellenadoMovilizacion, PrellenadoPagoDerechos, PrellenadoSolicitud, PrellenadoTercerosRelacionados } from '../../models/220201/prellenado-solicitud.model';

import { RegistroSolicitudService } from '../../services/220201/registro-solicitud/registro-solicitud.service';
import { SubProductosContenedoraComponent } from '../sub-productos-contenedora/sub-productos-contenedora.component';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

import { GuardaSolicitud, Mercancia } from '../../models/220201/guardar-solicitud.model';
import { TercerosrelacionadosdestinoTable } from '../../../220202/models/220202/fitosanitario.model';

import { SharedFormService } from '../../services/220201/SharedForm.service';

import { SolicitudService } from '../../services/220201/registro-solicitud/solicitud.service';

import { ConsultaSolicitudService } from '../../services/220201/consulta-solicitud/consulta-solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


/**
 * @fileoverview Componente para la gestión del formulario de datos de la solicitud.
 * Este componente maneja la lógica y la presentación del formulario de datos de la solicitud,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module datosDeLaSolicitud --220201
 */

/**
 * Componente para el formulario de datos de la solicitud.
 * @class DatosDeLaSolicitudComponent --220201
 * @implements {OnInit, OnDestroy, AfterViewInit}
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
  standalone: true,
  imports: [SharedModule,
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    AlertComponent,
    NotificacionesComponent,
    TablaDinamicaComponent,
    TablaDinamicaExpandidaComponent,
    ModalComponent, TooltipModule]
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
    * @property {ConsultaioState[]} consultaState
    * @description Consulta solicitud.
  */
  @Input() consultaState!: ConsultaioState;

  @ViewChild('modalRef') modalRef!: ModalComponent;
  /**
   * Constantes de texto.
   * @property {string} TEXTOS
   */
  TEXTOS: string = TEXTOS;
  /**
   * Constantes de texto.
   * @property {string} TEXTOS
   */
  mensajeErrorTabla: boolean = false;

  /**
   * Grupo de formularios principal.
   * @property {FormGroup} forma
   */
  forma!: FormGroup;

  /**
   * Indica si la sección es colapsable.
   * @property {boolean} colapsable
   */
  colapsable: boolean = true;

  /**
   * Grupo de formularios anidado para los datos de la solicitud.--220201
   * @property {FormGroup} datosDelaSolicitud
   */
  datosDelaSolicitud!: FormGroup;

  /**
   * Configuración para el select de aduana de ingreso. --220201
   * @property {Catalogo[]} aduanaDeIngreso
   */
  aduanaDeIngreso: Catalogo[] = [];

  /**
   * Configuración para el select de sanidad agropecuaria. --220201
   * @property {Catalogo[]} sanidadAgropecuaria
   */
  sanidadAgropecuaria: Catalogo[] = [];

  /**
   * Configuración para el select de punto de inspección.--220201
   * @property {Catalogo[]} puntoInspeccion
   */
  puntoInspeccion: Catalogo[] = [];

  /**
   * Configuración para el select de establecimiento TIF.--220201
   * @property {Catalogo[]} establecimientoTIF
   */
  establecimientoTIF: Catalogo[] = [];

  /**
   * Configuración para el select de veterinario.--220201
   * @property {Catalogo[]} veterinario
   */
  veterinario: Catalogo[] = [];
  id?: number;
  descripcion: string = '';
  tam?: string;
  dpi?: string

  /**
   * Configuración para el select de régimen.--220201
   * @property {Catalogo[]} regimen
   */
  regimen: Catalogo[] = [];

  /**
   * @property moduloEmergente
   * @description Indica si el módulo emergente está activo.
   * @type {boolean}
   * @default false
   */
  public moduloEmergente: boolean = false;
  /**
 * @property moduloEmergente
 * @description Indica si el módulo emergente está activo.
 * @type {boolean}
 * @default false
 */
  public eliminarDatosTabla: boolean = false;

  /**
   * Opciones para el botón de radio.
   * @property {RadioOpcion[]} opcionDeBotonDeRadio
   */
  opcionDeBotonDeRadio: RadioOpcion[] = [
    {
      "label": "Animales Vivos",
      "value": "yes"
    },
    {
      "label": "Productos Subproductos",
      "value": "no"
    },
  ];
  /**
   * @description Almacena los datos del formulario principal.
   * @type {DatosForma}
   */
  formulariodataStore: DatosForma = {} as DatosForma;
  /**
   * @desc Arreglo que contiene las filas de la solicitud.
   * @type {FilaSolicitud[]}
   * @remarks
   * Cada elemento representa una fila con los datos específicos de la solicitud.
   * @see FilaSolicitud
   */
  cuerpoTabla: FilaSolicitud[] = [];

  /**
   * @description
   * Arreglo que almacena los elementos del cuerpo de la mesa.
   * @type {string[]}
   */
  mesaCuerpo: string[] = [];

  /**
   * @description
   * Tipo de selección para la solicitud.
   * Utiliza la enumeración TablaSeleccion para definir el tipo de selección.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoli: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * @description
   * Tipo de selección para la solicitud de mercancías.
   * Utiliza la enumeración TablaSeleccion para definir el tipo de selección.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * @description
   * Configuración de las columnas para la tabla de solicitudes.
   * Utiliza la interfaz ConfiguracionColumna para definir las columnas.
   * @type {ConfiguracionColumna<FilaSolicitud>[]}
   */
  /**
   * @description
   * Configuración de las columnas para la tabla de solicitudes.
   * Utiliza la interfaz ConfiguracionColumna para definir las columnas.
   * @type {ConfiguracionColumna<FilaSolicitud>[]}
   */
  configuracionColumnasoli: ConfiguracionColumna<FilaSolicitud>[] = [
    { encabezado: 'No. partida', clave: (fila: FilaSolicitud): string => fila.noPartida, orden: 1 },
    { encabezado: 'Tipo de requisito', clave: (fila): string => fila.descripcionTipoRequisito ?? '', orden: 2 },
    { encabezado: 'Requisito', clave: (fila): string => fila.requisito ?? '', orden: 3 },
    { encabezado: 'Número de Certificado Internacional', clave: (fila) => fila.numeroCertificadoInternacional ?? '', orden: 4 },
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria ?? '', orden: 5 },
    { encabezado: 'Descripción de la fracción', clave: (fila) => fila.descripcionFraccion ?? '', orden: 6 },
    { encabezado: 'Nico', clave: (fila) => fila.nico ?? '', orden: 7 },
    { encabezado: 'Descripción Nico', clave: (fila) => fila.descripcionNico ?? '', orden: 8 },
    { encabezado: 'Descripción', clave: (fila) => fila.descripcion ?? '', orden: 9 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (fila) => fila.umt ?? '', orden: 10 },
    { encabezado: 'Cantidad UMT', clave: (fila) => fila.cantidadUMT ?? '', orden: 11 },
    { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (fila) => fila.umc ?? '', orden: 12 },
    { encabezado: 'Cantidad UMC', clave: (fila) => fila.cantidadUMC ?? '', orden: 13 },
    { encabezado: 'Especie', clave: (fila) => fila.especie ?? '', orden: 14 },
    { encabezado: 'Uso', clave: (fila) => fila.uso ?? '', orden: 15 },
    { encabezado: 'País de origen', clave: (fila) => fila.paisDeOrigen ?? '', orden: 16 },
    { encabezado: 'País de procedencia', clave: (fila) => fila.paisDeProcedencia ?? '', orden: 17 },
    { encabezado: 'Certificado Internacional Electrónico', clave: (fila) => fila.certificadoInternacionalElectronico ?? '', orden: 18 }
  ];

  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Notificador para destruir el componente.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Indica si el formulario es de solo lectura.
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Valor seleccionado.
   * @property {string} seleccionado
   */
  seleccionado: string = SELECCIONADO;

  /**
   * Lista de filas seleccionadas para la vista.
   * Almacena las filas (tipo FilaSolicitud) que el usuario ha seleccionado actualmente.
   * Se utiliza para mostrar/gestionar la selección en la tabla y sincronizar con el store.
   */
  listSelectedView: FilaSolicitud[] = [];

  /**
   * @description
   * Configuración de las columnas para la tabla de solicitudes de datos.
   * Utiliza la interfaz ConfiguracionColumna para definir las columnas.
   * @type {ConfiguracionColumna<SolicitudData>[]}
   */
  configuracionColumnasSolicitud: ConfiguracionColumna<SolicitudData>[] = [
    { encabezado: 'Fecha Creación', clave: (fila) => fila.fecha_creacion, orden: 1 },
    { encabezado: 'Mercancía', clave: (fila) => fila.mercancia, orden: 2 },
    { encabezado: 'Cantidad', clave: (fila) => fila.cantidad, orden: 3 },
    { encabezado: 'Proveedor', clave: (fila) => fila.proveedor, orden: 4 },
  ];

  /**
   * @description
   * Cuerpo de la tabla de solicitudes con datos de ejemplo.
   * Este arreglo contiene objetos que representan las filas de la tabla.
   * @type {SolicitudData[]}
   */
  cuerpoTablaSolicitud: SolicitudData[] = [];

  /**
   * Mensaje de error para mostrar en caso de que no se encuentre información.
   * @property {string} messageDeError
   */
  messageDeError: string = '';

  /**
   * @description Configuración de las columnas para la tabla de datos sensibles.
   * Utiliza la constante CONFIGURACION_SENSIBLES para definir las columnas.
   * @type {ConfiguracionColumna<Sensible>[]}
   */
  configuracionSensiblesTabla: ConfiguracionColumna<Sensible>[] = CONFIGURACION_SENSIBLES;

  /** Conjunto de filas seleccionadas en la tabla */
  filasSeleccionadas: Set<number> = new Set();


  /**
   * Getter para obtener el FormGroup interno llamado 'datosDelaSolicitud'.
   * Devuelve el control 'datosDelaSolicitud' del formulario principal como FormGroup.
   * Se utiliza el operador de encadenamiento opcional para evitar errores si aún no está inicializado.
   * @returns {FormGroup} Grupo de controles 'datosDelaSolicitud'
   */
  get datosServicio(): FormGroup {
    return this.datosDelaSolicitud?.get('datosDelaSolicitud') as FormGroup;
  }

  /**
   * Indica el proceso activo asociado al modal.
   * Ejemplos de valores: 'eliminar_solicitud', '' (sin proceso) u otros identificadores de flujo.
   * Se utiliza en métodos como `confirmacionModal` para determinar la acción a ejecutar
   * cuando el usuario confirma o cancela en el modal.
   */
  public procesoModal!: string;

  /**
   * Referencia ViewChild al componente `TablaDinamicaComponent` que maneja una tabla dinámica
   * del tipo `Sensible`. Esto permite la interacción con la instancia del componente en la plantilla.
   * 
   * @type {TablaDinamicaComponent<Sensible>}
   */
  @ViewChild('tablaMercancias') tablaMercancias!: TablaDinamicaComponent<Sensible>;

  /**
   * Objeto que almacena los datos necesarios para la movilización nacional.
   * @type {DatosParaMovilizacionNacional}
   */
  datosParaMovilizacionNacional = {} as DatosParaMovilizacionNacional;

  /**
   * Objeto que representa los terceros relacionados con el destino.
   * @type {TercerosrelacionadosdestinoTable}
   */
  tercerosRelacionados = {} as TercerosrelacionadosdestinoTable;

  /**
   * Objeto que representa el pago de derechos asociado a la solicitud.
   * Se inicializa como un objeto vacío del tipo `PagoDeDerechos`.
   */
  pagoDeDerechos = {} as PagoDeDerechos;

  /**
   * Variable para almacenar los datos de la solicitud capturada.
   * Se utiliza para guardar la información completa de la solicitud antes de enviarla al backend.
   */
  guardaSolicitud!: CapturarSolicitud;

  /**
   * Identificador de la solicitud guardada.
   * Se actualiza cuando se guarda la solicitud de manera total.
   * @type {string | null}
   */
  idSolicitud: string | null = null;

  // Identificador del trámite
  tramiteId: number = 220201;

  /**
   * Folio único que identifica la solicitud.
   */
  folioSolicitud: string = '';

  /**
   * RFC del solicitante asociado a la solicitud.
   * @type {string}
   */
  rfcSolicitante: string = 'AAL0409235E6';

  /**
   * Bandera que indica si la información de la solicitud ha sido guardada.
   * - true: la información se ha guardado correctamente.
   * - false: aún no se ha guardado o ocurrió un error.
   *
   * Se utiliza para controlar el comportamiento de la interfaz (por ejemplo,
   * deshabilitar campos, mostrar mensajes de confirmación o evitar envíos duplicados).
   *
   * @defaultValue false
   */
  banderaGuardado: boolean = false;


  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación de formularios.
   * @param {HttpClient} httpServicios - Cliente HTTP para realizar solicitudes.--220201
   * @param {CertificadoZoosanitarioServiceService} certificadoZoosanitarioServices - Servicio para lógica de certificado zoosanitario.
   * @param {ZoosanitarioQuery} certificadoZoosanitarioQuery - Consulta para acceder al estado del certificado zoosanitario.
   * @param {ConsultaioQuery} consultaQuery - Consulta para determinar si el formulario es de solo lectura.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    private readonly certificadoZoosanitarioQuery: ZoosanitarioQuery,
    private consultaQuery: ConsultaioQuery,
    public fitosanitarioStore: ZoosanitarioStore,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private catalogoService: CatalogosService,
    private registroSolicitudService: RegistroSolicitudService,
    private sharedService: SharedFormService,
    private solicitudService: SolicitudService,
    private consultaSolicitudService: ConsultaSolicitudService,
  ) {
  }

  /**
   * Crea el grupo de formularios principal.
   * @method crearFormulario
   */
  crearFormulario(): void {
    this.forma = this.fb.group({
      datosDelaSolicitud: this.fb.group({}),
    });
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
    } else {
      this.forma.enable();
    }
  }

  /**
   * Inicializa el componente.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.obtenerListasDesplegables();
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
      this.initActionFormBuild();
    }
    this.obtenerDataSolicitud();
    this.nuevaNotificacion = {} as Notificacion;
  }

  ngAfterViewInit(): void {
    this.radioBotonSeleccionado();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.folioSolicitud = seccionState.folioTramite;
          if (this.esFormularioSoloLectura) {
            this.datosDelaSolicitud.disable();
          }
        })
      )
      .subscribe();
    if (this.esFormularioSoloLectura) {
      this.recuperarDatosDeLaSolicitud();
    }
  }

  mensajeValidacion(): void {
    this.datosDelaSolicitud.get('claveUCON')?.valueChanges
      .pipe(debounceTime(300))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(value => {
        this.establecimientoTIF = [];
        this.obtenerEstablecimientoTif(value);
      });

      this.messageDeError = `No existe información para la clave UCON: ${this.datosDelaSolicitud.get('claveUCON')?.value} y RFC: ${this.rfcSolicitante} proporcionados. Favor de verificar.`;
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: this.messageDeError,
            cerrar: false,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'OK',
            txtBtnCancelar: '',
          };
  }

  /**
   * Obtiene los datos de la solicitud desde el servicio `certificadoZoosanitarioServices`
   * y los procesa para ser utilizados en el componente.
   *
   * - Recupera los datos del formulario y los almacena en `formulariodataStore`.
   * - Ordena los datos de la tabla por el número de partida (`noPartida`).
   * - Asigna los datos procesados a las propiedades correspondientes:
   *   - `cuerpoTabla`: Contiene los datos ordenados de la tabla.
   *   - `datosParaMovilizacionNacional`: Contiene los datos relacionados con la movilización nacional.
   *   - `tercerosRelacionados`: Contiene información del primer tercero relacionado, si existe.
   *   - `pagoDeDerechos`: Contiene los datos relacionados con el pago de derechos.
   *
   * La suscripción se gestiona utilizando `takeUntil` para evitar fugas de memoria.
   */
  obtenerDataSolicitud(): void {

    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (datos) => {
          this.formulariodataStore = datos.datos;

          //Mantiene ordenados los datos por no de partida
          if (datos.tablaDatos && datos.tablaDatos.length > 0) {
            datos.tablaDatos.sort((a, b) => {
              if (a.noPartida < b.noPartida) { return -1; }
              if (a.noPartida > b.noPartida) { return 1; }
              return 0;
            });
            this.cuerpoTabla = datos.tablaDatos;
            this.datosParaMovilizacionNacional = datos.datosParaMovilizacionNacional ?? {};
            this.tercerosRelacionados = datos.tercerosRelacionados[0] ?? {};
            this.pagoDeDerechos = datos.pagoDeDerechos ?? {};
          }
        }
      });
  }
  /**
   * Inicializa el grupo de formularios anidado para los datos de la solicitud.
   * @method initActionFormBuild
   */
  initActionFormBuild(): void {
    this.datosDelaSolicitud = this.fb.group({
      tipoMercancia: ['', Validators.required],
      aduanaIngreso: ['', Validators.required],
      oficinaInspeccion: ['', Validators.required],
      puntoInspeccion: ['', Validators.required],
      claveUCON: ['', Validators.pattern(/^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/)], // Solo letras y espacios
      establecimientoTIF: [''],
      nombreVeterinario: [''],
      numeroGuia: [''],
      certificacion: [''],
      regimen: ['', Validators.required],
      datosDeMercancia: ['']
    });
    this.forma.setControl('datosDelaSolicitud', this.datosDelaSolicitud);
    this.obtenerListasDesplegables();
    this.certificadoZoosanitarioQuery.seleccionarDatosSolicitud$.pipe(takeUntil(this.destroyNotifier$)).subscribe((datosDeLaSolicitud) => {
      if (datosDeLaSolicitud) {
        this.datosDelaSolicitud.patchValue({
          tipoMercancia: datosDeLaSolicitud.tipoMercancia || '',
          aduanaIngreso: datosDeLaSolicitud.aduanaIngreso || '',
          oficinaInspeccion: datosDeLaSolicitud.oficinaInspeccion || '',
          puntoInspeccion: datosDeLaSolicitud.puntoInspeccion || '',
          claveUCON: datosDeLaSolicitud.claveUCON || '',
          establecimientoTIF: datosDeLaSolicitud.establecimientoTIF || '',
          nombreVeterinario: datosDeLaSolicitud.nombreVeterinario || '',
          numeroGuia: datosDeLaSolicitud.numeroGuia || '',
          certificacion: datosDeLaSolicitud.certificacion || '',
          regimen: datosDeLaSolicitud.regimen || '',
          datosDeMercancia: datosDeLaSolicitud.datosDeMercancia || ''
        })
        this.radioBotonSeleccionado();
        if (datosDeLaSolicitud) {
          this.setValoresStore();
          this.obtenerPuntoInspeccionList(datosDeLaSolicitud.oficinaInspeccion || '');
          this.obtenerEstablecimientoTif(datosDeLaSolicitud.claveUCON || '');
          //Regimen
          this.obtenerRegimenList(datosDeLaSolicitud.regimen || '');
          this.obtenerSanidadAgropecuariaList(datosDeLaSolicitud.aduanaIngreso);
          this.obtenerVeterinarioList(datosDeLaSolicitud.establecimientoTIF || '');
        }
      }
    });
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsable
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Obtiene las listas desplegables.
   * @method obtenerListasDesplegables
   */
  obtenerListasDesplegables(): void {
    this.obtenerIngresoSelectList();
    this.obtenerRegimenList();
    this.obtenerDatosTablaSolicitud();
  }

  /**
   * Obtiene la lista para el select de aduana de ingreso.
   * @method obtenerIngresoSelectList
   */
  obtenerIngresoSelectList(): void {
    this.catalogoService.obtieneCatalogoAduana(this.tramiteId)
      .subscribe({
        next: (data): void => {
          this.aduanaDeIngreso = data.datos ?? [];
        }
      });
  }

  /**
   * Obtiene la lista para el select de sanidad agropecuaria.
   * @method obtenerSanidadAgropecuariaList
   */
  obtenerSanidadAgropecuariaList(cveAduana: string): void {
    if (cveAduana !== '') {
      this.catalogoService.obtieneCatalogoOficinasInspeccion(this.tramiteId, cveAduana)
        .subscribe({
          next: (data): void => {
            this.sanidadAgropecuaria = data.datos ?? [];
          }
        });
    }

  }

  /**
   * Obtiene la lista para el select de punto de inspección.
   * @method obtenerPuntoInspeccionList
   */
  obtenerPuntoInspeccionList(valor: string = ''): void {
    if (valor !== '') {
      this.catalogoService.obtieneCatalogoPuntoInspeccion(this.tramiteId, valor).subscribe({
        next: (data): void => {
          this.puntoInspeccion = data.datos ?? [];
        }
      });
    }
  }

  /**
   * Obtiene la lista para el select de establecimiento.
   * @method obtenerEstablecimientoList
   */
  obtenerEstablecimientoTif(cveUcon: string): boolean {
    if (cveUcon !== '') {
      this.catalogoService.obtieneCatalogoEstablecimientoTif(this.tramiteId, this.rfcSolicitante, cveUcon).subscribe({
        next: (data): void => {
          this.establecimientoTIF = data.datos ?? [];
        }
      });
    }
    return this.establecimientoTIF.length > 0;

  }

  /**
   * Obtiene la lista para el select de veterinario.
   * @method obtenerVeterinarioList
   */
  obtenerVeterinarioList(CVE_ESTABLECIMIENTO_TIF: string): void {
    if (CVE_ESTABLECIMIENTO_TIF !== '') {
      this.catalogoService.obtieneCatalogoMedicosVeterinarios(this.tramiteId, CVE_ESTABLECIMIENTO_TIF).subscribe({
        next: (data): void => {
          this.veterinario = data.datos ?? [];
        }
      });
    }
  }

  /**
   * Obtiene la lista para el select de régimen.
   * @method obtenerRegimenList
   */
  obtenerRegimenList(clave_regimen: string = ''): void {
    if (clave_regimen === '') {
      this.catalogoService.obtieneCatalogoRegimenes(this.tramiteId).subscribe({
        next: (data): void => {
          // Copia y ordena la lista en forma ascendente por clave
          const LISTAORDENADA = [...(data.datos ?? [])]
            .sort((a, b) => (a.descripcion ?? '').localeCompare(b.descripcion ?? ''));

          // Aplica filtro solo si se recibe clave_regimen
          this.regimen = clave_regimen
            ? LISTAORDENADA.filter(item => item.clave === clave_regimen)
            : LISTAORDENADA;
        }
      });
    }
  }


  /**
   * Obtiene los datos de la tabla de solicitud desde el servicio `registroSolicitudService`.
   * 
   * @remarks
   * Este método realiza una llamada al servicio `obtieneDatosDeLaSolicitud` con un ID de trámite
   * y un identificador específico. Los datos obtenidos se asignan a la propiedad `cuerpoTablaSolicitud`.
   * 
   */
  obtenerDatosTablaSolicitud(): void {
    this.registroSolicitudService.obtieneDatosDeLaSolicitud(this.tramiteId, this.rfcSolicitante).subscribe({
      next: (data): void => {
        this.cuerpoTablaSolicitud = data.datos ?? [];
      }
    });
  }

  /**
   * Recupera el punto de inspección basado en los valores actuales del formulario.
   * Opcionalmente, se puede proporcionar un grupo de formulario específico como parámetro.
   *
   * @param _forma - Una instancia opcional de `FormGroup` para usar en la obtención del punto de inspección.
   *                 Si no se proporciona, el método utiliza la propiedad `forma` por defecto.
   * @returns void
   */
  obtenerPuntoDeInspeccion(_forma?: FormGroup): void {
    const VALOR = this.forma.get('datosDelaSolicitud')?.get('oficinaInspeccion')?.value || '';
    this.obtenerPuntoInspeccionList(VALOR);
  }

  /**
   * Actualiza los datos almacenados en el store.
   * @method setValoresStore
   */
  setValoresStore(): void {
    const VALOR = this.datosDelaSolicitud.value;
    this.obtenerSanidadAgropecuariaList(VALOR.aduanaIngreso);
  }

  /**
   * Maneja la selección del botón de radio y actualiza el store.
   * @method radioBotonSeleccionado
   */
  radioBotonSeleccionado(): void {
    const VALOR = this.datosDelaSolicitud.value.tipoMercancia
    if (VALOR === 'yes') {
      this.configuracionColumnasoli = [
        { encabezado: 'No. partida', clave: (fila: FilaSolicitud): string => fila.noPartida, orden: 1 },
        { encabezado: 'Tipo de requisito', clave: (fila: FilaSolicitud): string => fila.descripcionTipoRequisito ?? '', orden: 2 },
        { encabezado: 'Requisito', clave: (fila: FilaSolicitud): string => fila.requisito, orden: 3 },
        { encabezado: 'Número de Certificado Internacional', clave: (fila: FilaSolicitud): string => fila.numeroCertificadoInternacional, orden: 4 },
        { encabezado: 'Fracción arancelaria', clave: (fila: FilaSolicitud): string => fila.fraccionArancelaria ?? '', orden: 5 },
        { encabezado: 'Descripción de la fracción', clave: (fila: FilaSolicitud): string => fila.descripcionFraccion, orden: 6 },
        { encabezado: 'Nico', clave: (fila: FilaSolicitud): string => fila.nico, orden: 7 },
        { encabezado: 'Descripción Nico', clave: (fila: FilaSolicitud): string => fila.descripcionNico, orden: 8 },
        { encabezado: 'Descripción', clave: (fila: FilaSolicitud): string => fila.descripcion, orden: 9 },
        { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (fila: FilaSolicitud): string => fila.descripcionUMT ?? '', orden: 10 },
        { encabezado: 'Cantidad UMT', clave: (fila: FilaSolicitud): string => String(fila.cantidadUMT), orden: 11 },
        { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (fila: FilaSolicitud): string => fila.descripcionUMC ?? '', orden: 12 },
        { encabezado: 'Cantidad UMC', clave: (fila: FilaSolicitud): string => String(fila.cantidadUMC), orden: 13 },
        { encabezado: 'Especie', clave: (fila: FilaSolicitud): string => fila.descripcionEspecie ?? '', orden: 14 },
        { encabezado: 'Uso', clave: (fila: FilaSolicitud): string => fila.descripcionUso ?? '', orden: 15 },
        { encabezado: 'País de origen', clave: (fila: FilaSolicitud): string => fila.descripcionPaisDeOrigen ?? '', orden: 16 },
        { encabezado: 'País de procedencia', clave: (fila: FilaSolicitud): string => fila.descripcionPaisDeProcedencia ?? '', orden: 17 },
        { encabezado: 'Certificado Internacional Electrónico', clave: (fila: FilaSolicitud): string => fila.certificadoInternacionalElectronico, orden: 18 }
      ];
    }
    else {
      this.configuracionColumnasoli = [
        { encabezado: 'No. partida', clave: (fila: FilaSolicitud): string => fila.noPartida, orden: 1 },
        { encabezado: 'Tipo de requisitos', clave: (fila: FilaSolicitud): string => fila.descripcionTipoRequisito ?? '', orden: 2 },
        { encabezado: 'Requisito', clave: (fila: FilaSolicitud): string => fila.requisito ?? '', orden: 3 },
        { encabezado: 'Número de Certificado Internacional', clave: (fila: FilaSolicitud): string => fila.numeroCertificadoInternacional, orden: 4 },
        { encabezado: 'Fracción arancelaria', clave: (fila: FilaSolicitud): string => fila.fraccionArancelaria, orden: 5 },
        { encabezado: 'Descripción de la fracción', clave: (fila: FilaSolicitud): string => fila.descripcion_fracción_arancelaria ?? '', orden: 6 },
        { encabezado: 'Nico', clave: (fila: FilaSolicitud): string => fila.nico, orden: 7 },
        { encabezado: 'Descripción Nico', clave: (fila: FilaSolicitud): string => fila.descripcionNico, orden: 8 },
        { encabezado: 'Descripción', clave: (fila: FilaSolicitud): string => fila.descripcion, orden: 9 },
        { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (fila: FilaSolicitud): string => fila.descripcionUMT ?? '', orden: 10 },
        { encabezado: 'Cantidad UMT', clave: (fila: FilaSolicitud): string => String(fila.cantidadUMT), orden: 11 },
        { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (fila: FilaSolicitud): string => fila.descripcionUMC ?? '', orden: 12 },
        { encabezado: 'Cantidad UMC', clave: (fila: FilaSolicitud): string => String(fila.cantidadUMC), orden: 13 },
        { encabezado: 'Especie', clave: (fila: FilaSolicitud): string => fila.descripcionEspecie ?? '', orden: 14 },
        { encabezado: 'Uso', clave: (fila: FilaSolicitud): string => fila.descripcionUso ?? '', orden: 15 },
        { encabezado: 'País de origen', clave: (fila: FilaSolicitud): string => fila.descripcionPaisDeOrigen ?? '', orden: 16 },
        { encabezado: 'País de procedencia', clave: (fila: FilaSolicitud): string => fila.descripcionPaisDeProcedencia ?? '', orden: 17 },
        { encabezado: 'Tipo de presentación', clave: (fila: FilaSolicitud): string => fila.tipoPresentacionDescripcion ?? '', orden: 18 },
        { encabezado: 'Tipo planta', clave: (fila: FilaSolicitud): string => fila.tipoPlanta ?? '', orden: 19 },
        { encabezado: 'Planta autorizada de origen', clave: (fila: FilaSolicitud): string => fila.descripcion_planta_autorizada ?? '', orden: 20 },
        { encabezado: 'Certificado Internacional Electrónico', clave: (fila: FilaSolicitud): string => fila.certificadoInternacionalElectronico, orden: 21 }
      ];
    }
  }

  /**
   * Elimina un pedimento de la lista si el parámetro `borrar` es verdadero.
   * @method eliminarPedimento
   * @param borrar - Indica si se debe eliminar el pedimento seleccionado.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.moduloEmergente = false;
    }
  }
  /**
  * Elimina un pedimento de la lista si el parámetro `borrar` es verdadero.
  * @method eliminarPedimento
  * @param borrar - Indica si se debe eliminar el pedimento seleccionado.
  */
  eliminarPedimentoDatos(borrar: boolean): void {

    if (borrar) {
      this.eliminarDatosTabla = false;
      const VALOR = this.fitosanitarioStore.getValue().tablaDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.fitosanitarioStore.getValue().selectedDatos.includes(item)
      );
      this.fitosanitarioStore.update(
        (state) => ({
          ...state,
          tablaDatos: FILTERED_VALOR
        })
      );
    }
    else {
      this.eliminarDatosTabla = false;
    }
  }

  /**
   * Verifica si hay registros en la tabla y configura una notificación en caso contrario.
   * 
   * @returns {boolean} - Devuelve `true` si hay registros en la tabla, de lo contrario `false`.
   */
  validacionBotones(): boolean {
    if (this.cuerpoTabla.length === 0 || this.listSelectedView.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return false;
    }
    return true;
  }

  /**
   * @description Navega a la página de agregar mercancía.
   * Este método redirige al usuario a la ruta relativa '../animales-vivo' para agregar una nueva mercancía.
   * @method agregarMercancia
   * @returns {void}
   */
  modificarMercancia(): void {

    if (!this.validacionBotones()) {
      return;
    }

    const VALOR = this.datosDelaSolicitud.value.tipoMercancia;
    const CANTIDAD_REGISTROS = this.cuerpoTabla.length;
    if (VALOR === 'yes') {

      this.modalRef.abrir(AnimalesVivoContenedoraComponent, { cantidadRegistros: CANTIDAD_REGISTROS });
    }
    else if (VALOR === 'no') {
      this.modalRef.abrir(SubProductosContenedoraComponent, { cantidadRegistros: CANTIDAD_REGISTROS });
    }
  }
  /**
  * @description Selecciona una fila de la tabla de solicitudes y actualiza el estado del store.
  * Este método se llama cuando se selecciona una fila en la tabla de solicitudes.
  * Actualiza el estado del store con los datos de la fila seleccionada.
  * @method seleccionTabla
  * @param {FilaSolicitud} event - Datos de la fila seleccionada.
  */
  seleccionTabla(event: FilaSolicitud[]): void {
    this.listSelectedView = event;
    this.fitosanitarioStore.update(
      (state) => ({
        ...state,
        selectedDatos: event
      })
    )
  }


  /**
 * Indica si se debe mostrar el modal para eliminar mercancía
 */
  eliminarMerDatosTabla: boolean = false;

  /**
  * @description Método que se ejecuta cuando el componente es destruido.
  * Utiliza un Subject para notificar a las suscripciones que deben ser destruidas, evitando fugas de memoria.
  * @method ngOnDestroy
  * @returns {void}
  */
  eliminarMercancia(): void {
    if (!this.validacionBotones()) {
      return;
    }

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Está seguro que desea eliminar estos datos?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    // NUEVA bandera, exclusiva para mercancía
    this.eliminarMerDatosTabla = true;
  }
  /**
  * @description Navega a la página de modificar mercancía.
  * Este método redirige al usuario a la ruta relativa '../animales-vivo' para modificar una mercancía existente.
  * @method agregarMercancia
  * @returns {void}
  */
  agregarMercancia(): void {
    if (this.filasSeleccionadas.size > 0) {
      this.tablaMercancias.clearSelection();
      this.filasSeleccionadas.clear();
      this.fitosanitarioStore.update(
        (state) => ({
          ...state,
          selectedDatos: []
        })
      );
    }
    const CANTIDAD_REGISTROS = this.cuerpoTabla.length;
    if (this.datosDelaSolicitud.value.tipoMercancia === 'no') {
      this.modalRef.abrir(SubProductosContenedoraComponent, { cantidadRegistros: CANTIDAD_REGISTROS });
    }
    else if (this.datosDelaSolicitud.value.tipoMercancia === 'yes') {
      this.modalRef.abrir(AnimalesVivoContenedoraComponent, { cantidadRegistros: CANTIDAD_REGISTROS });
    }

  }
  /**
  * @description Navega a la página de modificar mercancía.
  * Este método redirige al usuario a la ruta relativa '../animales-vivo' para modificar una mercancía existente.
  * @method validarFormulario
  * @returns {boolean}
  */
  validarFormulario(): boolean {
    this.mensajeErrorTabla = this.cuerpoTabla.length > 0 ? true : false;
    if (this.forma.valid) {
      return this.mensajeErrorTabla;
    }

    this.forma.markAllAsTouched();
    return false
  }

  /**
   * Maneja el evento de clic en una fila de la tabla de solicitudes.
   * 
   * @param event - Objeto que contiene los datos de la solicitud seleccionada.
   * 
   * Este método realiza las siguientes acciones:
   * - Verifica si el evento contiene un `id_solicitud` válido.
   * - Obtiene los datos prellenados de la solicitud desde el servicio `catalogoService`.
   * - Actualiza los formularios y listas relacionadas con los datos obtenidos.
   * - Procesa la información de mercancías, generando listas de detalles y sensibles.
   * - Actualiza el estado de la tienda `fitosanitarioStore` con las filas procesadas.
   * - Maneja errores en caso de fallos al obtener los datos.
   */
  onFilaClic(event: SolicitudData): void {
    if (event && event.id_solicitud) {
      this.catalogoService.obtenSolicitudPrellenado(220201, true, event.id_solicitud ?? '')
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (datos) => {
            if (datos?.datos) {
              this.solicitudService.emitirIdSolicitud(event.id_solicitud || '');
              this.obtenerSanidadAgropecuariaList(datos.datos.cve_aduana || '');
              this.obtenerVeterinarioList(datos.datos.establecimiento_TIF || '');
              this.obtenerPuntoInspeccionList(datos.datos.oficina_inspeccion_sanidad_agropecuaria || '');
              //Regimen
              this.obtenerRegimenList(datos.datos?.clave_regimen || '');
              this.datosDelaSolicitud.patchValue({
                aduanaIngreso: datos.datos.cve_aduana || '',
                tipoMercancia: datos.datos.mercancia[0].tipo_mercancia === 'TICERM.SOA' ? 'no' : 'yes', //'yes' para animales vivos, 'no' para subproductos
                oficinaInspeccion: datos.datos.oficina_inspeccion_sanidad_agropecuaria || '',
                claveUCON: datos.datos.clave_UCON || '',
                establecimientoTIF: datos.datos.establecimiento_TIF || '',
                puntoInspeccion: datos.datos.punto_inspeccion || '',
                nombreVeterinario: datos.datos.nombre_veterinario || '',
                regimen: datos.datos.clave_regimen || '',
                numeroGuia: datos.datos.numero_autorizacion || '',
              });
            }
            const DETALLE_MERCANCIA = datos?.datos as PrellenadoSolicitud || [];
            if (DETALLE_MERCANCIA.mercancia.length > 0) {

              const FILAS_SOLICITUD: FilaSolicitud[] = [];
              // eslint-disable-next-line complexity
              DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
                const LISTADETALLEPRODUCTOS: DetallasDatos[] = mercancia.lista_detalle_mercancia?.map((producto) => ({
                  numeroDeLote: producto.numero_lote_detalle || '',
                  fechaElaboracionEmpaqueProceso: producto.fecha_elaboracion || '',
                  fechaProduccionSacrificio: producto.fecha_sacrificio_str || '',
                  fechaFinProduccionSacrificio: producto.fecha_sacrificio_fin || '',
                  fechaCaducidadProducto: producto.fecha_caducidad_str || '',
                  fechaFinCaducidadProducto: producto.fecha_caducidad_fin || '',
                  fechaFinElaboracionEmpaqueProceso: producto.fecha_elaboracion_fin || '',
                  fechhaInicioProduccionSacrificio: producto.fecha_sacrificio_str || '',
                  fechaInicioCaducidadProducto: producto.fecha_caducidad_str || '',
                  fechaCaducidad: producto.fecha_caducidad || '',
                })) as DetallasDatos[] || [];

                const LISTADETALLESENSIBLES: Sensible[] = mercancia.lista_detalle_mercancia?.map((animal) => ({
                  noPartida: mercancia.numero_partida.toString(),
                  NumeroLote: animal.numero_lote_detalle || '',
                  ColorPelaje: animal.color_pelaje_detalle || '',
                  EdadAnimal: animal.edad_animal_detalle || '',
                  FaseDesarrollo: animal.fase_desarrollo_detalle || '',
                  FuncionZootecnica: animal.funcion_zootecnica_detalle || '',
                  NumeroIdentificacion: animal.numeroidentificacion_detalle || '',
                  Raza: animal.raza_detalle || '',
                  Sexo: animal.id_sexo_detalle || '',
                  NombreCientifico: animal.nombre_cientifico_detalle || '',
                  NombreMercancia: animal.nombre_mercancia_detalle || '',
                })) as Sensible[] || [];
                const CLAVEFRACCION = mercancia.cve_fraccion ? mercancia.cve_fraccion.slice(0, -2) : '';
                const FILAS: FilaSolicitud = {
                  noPartida: mercancia.numero_partida.toString(),
                  descripcionTipoRequisito: mercancia.descripcion_tipo_requisito || '',
                  tipoRequisito: mercancia.tipo_requisito || '',
                  requisito: mercancia.requisitos || '',
                  numeroCertificadoInternacional: String(mercancia.numero_certificado) || '',
                  fraccionArancelaria: CLAVEFRACCION || '',
                  descripcionFraccion: mercancia.descripcion_fracción_arancelaria || '',
                  descripcion_fracción_arancelaria: mercancia.descripcion_fracción_arancelaria || '',
                  descripcionEspecie: mercancia.descripcion_especie || '',
                  descripcion_tipo_planta: mercancia.descripcion_tipo_planta || '',
                  id_tipo_presentacion: mercancia.id_tipo_presentacion || '',
                  plantaAutorizadaOrigen: mercancia.id_planta_autorizada || '',
                  id_planta_autorizada: mercancia.id_planta_autorizada || '0',
                  descripcion_planta_autorizada: mercancia.descripcion_planta_autorizada || '',
                  fraccion: mercancia.cve_fraccion || '',
                  cantidadPresentacion: mercancia.cantidad_presentacion || '',
                  id_tipo_planta: mercancia.id_tipo_planta || '',
                  idDescripcionFraccion: mercancia.id_fraccion_gubernamental || 0,
                  id_fraccion_gubernamental: mercancia.id_fraccion_gubernamental || 0,
                  nico: mercancia.clave_nico || '',
                  descripcionNico: mercancia.descripcion_nico || '',
                  descripcion_nico: mercancia.descripcion_nico || '',
                  descripcionUso: mercancia.descripcion_uso || '',
                  umt: mercancia.clave_unidad_comercial || '',
                  cantidadUMT: mercancia.cantidad_umt || 0,
                  umc: mercancia.clave_unidad_medida || '',
                  descripcionUMT: mercancia.descripcion_umt || '',
                  descripcionUMC: mercancia.descripcion_umc || '',
                  cantidadUMC: mercancia.cantidad_umc || 0,
                  especie: String(mercancia.id_especie || ''),
                  cantidadEspecie: mercancia.cantidad_presentacion || 0,
                  cantidad_presentacion: mercancia.cantidad_presentacion || 0,
                  presentacion: mercancia.presentacion || '',
                  uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
                  paisDeOrigen: mercancia.clave_paises_origen || '',
                  paisDeDestino: mercancia.nombre_pais_procedencia || '',
                  paisDeProcedencia: mercancia.clave_paises_procedencia || '',
                  descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
                  descripcionPaisDeProcedencia: mercancia.nombre_pais_procedencia || '',
                  tipoPresentacionDescripcion: mercancia.descripcion_presentacion || '',
                  tipoPresentacion: mercancia.id_tipo_presentacion || '',
                  tipoPlanta: mercancia.id_tipo_planta || '',
                  certificadoInternacionalElectronico: String(mercancia.numero_certificado) || '',
                  tipoDeProducto: '',
                  numeroDeLote: '',
                  sensibles: LISTADETALLESENSIBLES,
                  detalleProductos: LISTADETALLEPRODUCTOS,
                  descripcion: mercancia.descripcion_mercancia,
                };
                FILAS_SOLICITUD.push(FILAS);
              });

              this.fitosanitarioStore.updateFilaSolicitud(FILAS_SOLICITUD);
            }
            this.radioBotonSeleccionado()
          },
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Ocurrió un error al obtener los datos de la solicitud. Por favor, intente nuevamente, más tarde.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        });

      this.catalogoService.obtenerMovilizacionPrellenado(this.tramiteId, true, event.id_solicitud ?? '')
        .subscribe({
          next: (response) => {
            this.sharedService.enviarMovilizacionPrellenado(response.datos as PrellenadoMovilizacion);
            this.sharedService.enviarDocumentosPrellenado(true);
          },
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Ocurrió un error al obtener los datos de la solicitud. Por favor, intente nuevamente, más tarde.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        });

      this.catalogoService.obtenerTerceroRelacionadosPrellenado(this.tramiteId, true, event.id_solicitud ?? '')
        .subscribe({
          next: (response) => {
            if (response.datos && 'terceros_exportador' in response.datos && 'terceros_destinatario' in response.datos) {
              this.sharedService.enviarTercerosRelacionadosPrellenado(response.datos as PrellenadoTercerosRelacionados);
            }
          },
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Ocurrió un error al obtener los datos de la solicitud. Por favor, intente nuevamente, más tarde.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        });

      this.catalogoService.obtenerPagoDerechosPrellenado(this.tramiteId, true, event.id_solicitud ?? '')
        .subscribe({
          next: (response) => {
            this.sharedService.enviarPagoDerechosPrellenado(response.datos as PrellenadoPagoDerechos);
          },
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Ocurrió un error al obtener los datos de la solicitud. Por favor, intente nuevamente, más tarde.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        });
    }
  }

  columns: ColumnConfig[] = [
    { encabezado: 'No. partida', clave: 'noPartida', width: '30%' },
    { encabezado: 'Tipo de requisito', clave: 'tipoRequisito', width: '20%' },
    { encabezado: 'Requisito', clave: 'requisito', width: '20%' },
    { encabezado: 'Número de Certificado Internacional', clave: 'numeroCertificadoInternacional', width: '30%' },
    { encabezado: 'Fracción arancelaria', clave: 'fraccionArancelaria', width: '30%' },
    { encabezado: 'Descripción de la fracción', clave: 'descripcionFraccion', width: '30%' },
    { encabezado: 'Nico', clave: 'nico', width: '30%' },
    { encabezado: 'Descripción Nico', clave: 'descripcionNico', width: '30%' },
    { encabezado: 'Descripción', clave: 'descripcion', width: '30%' },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: 'umt', width: '30%' },
    { encabezado: 'Cantidad UMT', clave: 'cantidadUMT', width: '30%' },
    { encabezado: 'Unidad de medida de comercialización (UMC)', clave: 'umc', width: '30%' },
    { encabezado: 'Cantidad UMC', clave: 'cantidadUMC', width: '30%' },
    { encabezado: 'Especie', clave: 'especie', width: '30%' },
    { encabezado: 'Uso', clave: 'uso', width: '30%' },
    { encabezado: 'País de origen', clave: 'paisOrigen', width: '30%' },
    { encabezado: 'País de procedencia', clave: 'paisProcedencia', width: '30%' },
    { encabezado: 'Tipo de presentación', clave: 'tipoPresentacion', width: '30%' },
    { encabezado: 'Tipo planta', clave: 'tipoPlanta', width: '30%' },
    { encabezado: 'Planta autorizada de origen', clave: 'plantaAutorizadaOrigen', width: '30%' },
    { encabezado: 'Certificado Internacional Electrónico', clave: 'certificadoInternacionalElectronico', width: '30%' },
  ];

  nestedColumns: ColumnConfig[] = [
    { encabezado: 'Número de lote', clave: 'NumeroLote', width: '10%' },
    { encabezado: 'Color/Pelaje', clave: 'ColorPelaje', width: '10%' },
    { encabezado: 'Edad del animal', clave: 'EdadAnimal', width: '10%' },
    { encabezado: 'Fase de desarrollo', clave: 'FaseDesarrollo', width: '10%' },
    { encabezado: 'Función zootécnica', clave: 'FuncionZootecnica', width: '10%' },
    { encabezado: 'Nombre de la mercancía', clave: 'NombreMercancia', width: '10%' },
    { encabezado: 'Numero de identificación', clave: 'NumeroIdentificacion', width: '10%' },
    { encabezado: 'Raza', clave: 'Raza', width: '10%' },
    { encabezado: 'Sexo', clave: 'Sexo', width: '10%' },
    { encabezado: 'Nombre cientifico', clave: 'NombreCientifico', width: '25%' },
  ];

  nestedColumnsDetalleProductos: ColumnConfig[] = [
    { encabezado: 'Número de lote', clave: 'numeroDeLote', width: '8%' },
    { encabezado: 'Fecha de elaboración o empaque o proceso', clave: 'fechaElaboracionEmpaqueProceso', width: '10%' },
    { encabezado: 'Fecha de producción o sacrificio', clave: 'fechaProduccionSacrificio', width: '10%' },
    { encabezado: 'Fecha de caducidad del producto o consumo preferente', clave: 'fechaCaducidadProducto', width: '10%' },
    { encabezado: 'Fecha de fin de elaboración o empaque o proceso', clave: 'fechaFinElaboracionEmpaqueProceso', width: '10%' },
    { encabezado: 'Fecha de fin de producción o sacrificio', clave: 'fechaFinProduccionSacrificio', width: '10%' },
    { encabezado: 'Fecha de fin de caducidad del producto o consumo preferente', clave: 'fechaFinCaducidadProducto', width: '10%' },
  ];

  /**
   * Configuración de columnas para datos sensibles.
   * Cada elemento define el encabezado de la columna, la función para obtener el valor desde la fila
   * y el orden en la presentación.
   */
  configuraColumna: ConfiguracionColumna<Sensible>[] = [
    // Número de partida o identificador de la fila
    { encabezado: 'No. partida', clave: (fila: Sensible): string => fila.noPartida, orden: 1 },
    // Color o pelaje del animal
    { encabezado: 'ColorPelaje', clave: (fila: Sensible): string => fila.ColorPelaje, orden: 2 },
    // Fase de desarrollo del animal (ej. juvenil, adulto)
    { encabezado: 'FaseDesarrollo', clave: (fila: Sensible): string => fila.FaseDesarrollo, orden: 3 },
    // Función zootécnica (uso productivo del animal)
    { encabezado: 'FuncionZootecnica', clave: (fila: Sensible): string => fila.FuncionZootecnica, orden: 4 },
    // Número de identificación del animal (ej. arete, microchip)
    { encabezado: 'NumeroIdentificacion', clave: (fila: Sensible): string => fila.NumeroIdentificacion, orden: 5 },
    // Raza del animal
    { encabezado: 'Raza', clave: (fila: Sensible): string => fila.Raza, orden: 7 },
    // Nombre científico de la especie
    { encabezado: 'NombreCientifico', clave: (fila: Sensible): string => fila.NombreCientifico, orden: 8 },
    // Sexo del animal (M/F u otra representación)
    { encabezado: 'Sexo', clave: (fila: Sensible): string => fila.Sexo, orden: 9 },
  ];

  /** Método que se ejecuta cuando una fila es expandida para mostrar detalles adicionales. */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  onRowExpanded(row: FilaSolicitud): void {

    // Aquí puedes cargar los datos para la tabla anidada si es necesario
  }

  /** Método para manejar el cambio de filas seleccionadas. */
  onfilasSeleccionadasChange(filasSeleccionadas: FilaSolicitud[]): void {
    const FS = filasSeleccionadas
      .map((row) => row.id)
      .filter((id): id is number => id !== undefined && id !== null);
    this.filasSeleccionadas = new Set(FS);
    if (this.filasSeleccionadas.size > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

    }

  }

  /**
   * Maneja la confirmación de un modal basado en el proceso actual.
   * @param confirmar - Indica si se confirma la acción en el modal.
   */
  confirmacionModal(confirmar: boolean): void {
    switch (this.procesoModal) {
      case 'validar_formulario':
        {
          if (confirmar) {
            this.procesoModal = '';
          }
          break;
        }
      default:
        break;
    }
  }

  /**
   * Guarda una solicitud parcial recopilando datos del formulario y la tabla,
   * construyendo un objeto estructurado y enviándolo al servicio backend.
   *
   * Pasos:
   * 1. Extrae datos del formulario `datosDelaSolicitud`.
   * 2. Mapea las filas de la tabla `cuerpoTabla` en un arreglo de objetos `Mercancia`.
   * 3. Construye un objeto `GuardaSolicitud` con los datos recopilados.
   * 4. Llama al servicio `registroSolicitudService` para guardar la solicitud parcial.
   *
   * @returns {void}
   */
  // eslint-disable-next-line complexity
  guardarParcial(): void {
    this.registroSolicitudService.guardaSolicitudParcial(this.tramiteId, this.construllePayload()).pipe(takeUntil(this.destroyNotifier$)).subscribe();
  }

  // eslint-disable-next-line class-methods-use-this, complexity
  guardarTotal(): boolean {
    this.registroSolicitudService.guardarSolicitud(this.tramiteId, this.construllePayload()).subscribe({
      next:
        (response) => {
          if (response.codigo === '00' && response.datos?.id_solicitud) {
            this.idSolicitud = response.datos.id_solicitud.toString();
            this.fitosanitarioStore.setIdSolicitud(response.datos?.id_solicitud);
            this.solicitudService.emitirIdSolicitud(this.idSolicitud);
            this.banderaGuardado = true;
          }
          if (response.codigo !== '00') {
            this.idSolicitud = '0';
            this.procesoModal = 'guardar_solicitud';
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Ocurrió un error al obtener guardar la solicitud. Por favor, intente nuevamente, más tarde, valide que los datos del pago sean correctos.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        }
    });
    return this.banderaGuardado;
  }

  // eslint-disable-next-line complexity
  construllePayload(): GuardaSolicitud {
    // Lógica para guardar la solicitud de forma completa
    const FORMULARIO = this.datosDelaSolicitud.value;
    // eslint-disable-next-line complexity
    const FILAS: Mercancia[] = this.cuerpoTabla.map((fila) => ({
      tipo_mercancia: this.datosDelaSolicitud.get('tipoMercancia')?.value === 'no' ? 'TICERM.SOA' : 'TICERM.AN',
      tipo_requisito: Number(fila.tipoRequisito) || 0,
      requisito: fila.requisito || '',
      numero_certificado: fila.numeroCertificadoInternacional || '',
      cve_fraccion: fila.fraccionArancelaria || '',
      id_fraccion_gubernamental: fila.id_fraccion_gubernamental ?? 0,
      clave_nico: fila.nico || '',
      descripcion_mercancia: fila.descripcion || '',
      descripcionFraccion: fila.descripcionFraccion || '',
      descripcion_nico: fila.descripcion_nico || '',
      descripcion_uso: fila.descripcionUso || '',
      descripcion_fracción_arancelaria: fila.descripcion_fracción_arancelaria || '',
      id_tipoPlanta: fila.tipoPlanta || '',
      descripcion_tipo_planta: fila.tipoPlanta || '',
      plantaAutorizadaOrigen: fila.id_planta_autorizada || '',
      id_planta_autorizada: fila.id_planta_autorizada || '',
      descripcion_planta_autorizada: fila.descripcion_planta_autorizada || '',
      cantidad_umt: Number(fila.cantidadUMT) || 0,
      clave_unidad_medida: fila.umc || '',
      cantidad_umc: Number(fila.cantidadUMC) || 0,
      clave_unidad_comercial: fila.umc || '',
      id_especie: Number(fila.especie) || 0,
      id_uso_mercancia_tipo_tramite: Number(fila.uso) || 0,
      presentacion: fila.presentacion || '',
      tipoPresentacion: fila.id_tipo_presentacion || '',
      numero_partida: Number(fila.noPartida) || 0,
      cantidad_presentacion: Number(fila.cantidadPresentacion) || 0,
      id_tipo_presentacion: fila.id_tipo_presentacion || '',
      id_tipo_planta: fila.id_tipo_planta || '',
      clave_paises_origen: fila.paisDeOrigen || '',
      clave_paises_procedencia: fila.paisDeProcedencia || '',
      lista_detalle_mercancia: this.datosDelaSolicitud.get('tipoMercancia')?.value === 'yes' ? (fila.sensibles ?? []).map((detalle) => ({
        numero_lote_detalle: detalle.NumeroLote || '',
        color_pelaje_detalle: detalle.ColorPelaje || '',
        edad_animal_detalle: detalle.EdadAnimal || '',
        fase_desarrollo_detalle: detalle.FaseDesarrollo || '',
        funcion_zootecnica_detalle: detalle.FuncionZootecnica || '',
        numeroidentificacion_detalle: detalle.NumeroIdentificacion || '',
        raza_detalle: detalle.Raza || '',
        id_sexo_detalle: detalle.Sexo || '',
        nombre_cientifico_detalle: detalle.NombreCientifico || '',
        nombre_mercancia_detalle: detalle.NombreMercancia || '',
        fecha_sacrificio: '',
        fecha_elaboracion: '',
        fecha_caducidad: '',
        fecha_elaboracion_fin: '',
        fecha_caducidad_fin: '',
        fecha_sacrificio_fin: '',
      })) : (fila.detalleProductos ?? []).map((detalleProducto) => ({
        numero_lote_detalle: detalleProducto.numeroDeLote || '',
        color_pelaje_detalle: '',
        edad_animal_detalle: '',
        fase_desarrollo_detalle: '',
        funcion_zootecnica_detalle: '',
        numeroidentificacion_detalle: '',
        raza_detalle: '',
        id_sexo_detalle: '',
        nombre_cientifico_detalle: '',
        nombre_mercancia_detalle: '',
        fecha_sacrificio: formatearFechaSolicitudSinHora(detalleProducto.fechaProduccionSacrificio ?? '') || '',
        fecha_elaboracion: formatearFechaSolicitudSinHora(detalleProducto.fechaElaboracionEmpaqueProceso ?? '') || '',
        fecha_caducidad: formatearFechaSolicitudSinHora(detalleProducto.fechaCaducidadProducto ?? '') || '',
        fecha_elaboracion_fin: formatearFechaSolicitudSinHora(detalleProducto.fechaFinElaboracionEmpaqueProceso ?? '') || '',
        fecha_caducidad_fin: formatearFechaSolicitudSinHora(detalleProducto.fechaFinCaducidadProducto ?? '') || '',
        fecha_sacrificio_fin: formatearFechaSolicitudSinHora(detalleProducto.fechaFinProduccionSacrificio ?? '') || '',
      }))
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const SOLICITUD: GuardaSolicitud = {
      id_solicitud: null,
      datos_solicitud: {
        clave_regimen: FORMULARIO.regimen || '',
        cve_aduana: FORMULARIO.aduanaIngreso,
        oficina_inspeccion_sanidad_agropecuaria: FORMULARIO.oficinaInspeccion,
        punto_inspeccion: FORMULARIO.puntoInspeccion,
        clave_UCON: FORMULARIO.claveUCON,
        establecimiento_TIF: FORMULARIO.establecimientoTIF,
        nombre_veterinario: FORMULARIO.nombreVeterinario,
        numero_autorizacion: FORMULARIO.numeroGuia,
        mercancia: FILAS
      },
      transporte: {
        coordenadas: this.datosParaMovilizacionNacional.coordenadas || '',
        ide_medio_transporte: this.datosParaMovilizacionNacional.medio || '',
        identificacion_transporte: this.datosParaMovilizacionNacional.transporte || '',
        id_punto_verificacion: Number(this.datosParaMovilizacionNacional.punto) || 0,
        razon_social: this.datosParaMovilizacionNacional.nombre || ''
      },
      terceros: {
        terceros_exportador: [{
          tipo_persona_sol: 'TIPERS.EXP',
          persona_moral: true,
          nombre: this.tercerosRelacionados?.nombre || '',
          apellido_paterno: this.tercerosRelacionados?.primerApellido || '',
          apellido_materno: this.tercerosRelacionados?.segundoApellido || '',
          razon_social: this.tercerosRelacionados?.razonSocial || '',
          pais: this.tercerosRelacionados?.pais || '',
          descripcion_ubicacion: this.tercerosRelacionados?.coloniaDescripcion || '',
          lada: this.tercerosRelacionados?.lada || '',
          telefonos: this.tercerosRelacionados?.telefono || '',
          correo: this.tercerosRelacionados?.correo || ''
        }],
        terceros_destinatario: [{
          tipo_persona_sol: 'TIPERS.DES',
          persona_moral: true,
          num_establ_tif: '',
          nom_establ_tif: '',
          nombre: this.tercerosRelacionados?.nombre || '',
          apellido_paterno: this.tercerosRelacionados?.primerApellido || '',
          apellido_materno: this.tercerosRelacionados?.segundoApellido || '',
          razon_social: this.tercerosRelacionados?.razonSocial || '',
          pais: this.tercerosRelacionados?.pais || '',
          codigo_postal: this.tercerosRelacionados?.codigoPostal || '',
          cve_entidad: this.tercerosRelacionados?.estado || '',
          cve_deleg_mun: this.tercerosRelacionados?.municipio || '',
          cve_colonia: this.tercerosRelacionados?.colonia || '',
          calle: this.tercerosRelacionados?.calle || '',
          num_exterior: this.tercerosRelacionados?.numeroExterior || '',
          num_interior: this.tercerosRelacionados?.numeroInterior || '',
          lada: this.tercerosRelacionados?.lada || '',
          telefonos: this.tercerosRelacionados?.telefono || '',
          correo: this.tercerosRelacionados?.correo || ''
        }]
      },
      pago: this.pagoDeDerechos?.exentoPago === 'si'
        ? {
          exento_pago: true,
          ide_motivo_exento_pago: 'MEXPG.M',
          cve_referencia_bancaria: null,
          cadena_pago_dependencia: null,
          cve_banco: "",
          llave_pago: null,
          fec_pago: "",
          imp_pago: 0
        } : {
          exento_pago: true,
          ide_motivo_exento_pago: this.pagoDeDerechos?.exentoPago || '',
          cve_referencia_bancaria: this.pagoDeDerechos?.claveReferencia || '',
          cadena_pago_dependencia: this.pagoDeDerechos?.cadenaDependencia || '',
          cve_banco: this.pagoDeDerechos?.banco || '',
          llave_pago: this.pagoDeDerechos?.llavePago || '',
          fec_pago: formatearFechaSolicitudSinHora(this.pagoDeDerechos?.fechaPago) || '',
          imp_pago: Number(this.pagoDeDerechos?.importePago) || 0
        },
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'AAL0409235E6',
        es_persona_moral: true,
        certificado_serial_number: '',
        rol_capturista: 'SOLICITANTE',
      },
      representacion_federal: {
        cve_entidad_federativa: 'DGO',
        cve_unidad_administrativa: '1016'
      }
    };
    return SOLICITUD;
  }

  /**
   * Guarda los datos de la solicitud actualizados en el store.
   * Utiliza el formulario `datosDelaSolicitud` para obtener los valores.
   */
  guardaDatosDeLaSolicitud(): void {
    if (this.datosDelaSolicitud.valid) {
      this.fitosanitarioStore.actualizarDatosDeLaSolicitud(this.datosDelaSolicitud.value);
    }
  }


  /**
   * Recupera los datos de la solicitud utilizando el folio proporcionado.
   * @param folio - Identificador único de la solicitud.
   */
  recuperarDatosDeLaSolicitud(): void {
    this.consultaSolicitudService.obtenTramiteDatosSolicitud(this.tramiteId, this.folioSolicitud)
      .subscribe({
        next: (response) => {
          const DATOS = response.datos;
          if (DATOS) {
            const DATOS_SOLICITUD_PATCH: DatosDeLaSolicitud = {
              tipoMercancia: DATOS.mercancia?.[0]?.tipo_mercancia === 'TICERM.SOA' ? 'no' : 'yes',
              aduanaIngreso: DATOS.cve_aduana || '',
              oficinaInspeccion: DATOS.oficina_inspeccion_sanidad_agropecuaria || '',
              puntoInspeccion: DATOS.punto_inspeccion || '',
              claveUCON: DATOS.clave_UCON || '',
              establecimientoTIF: DATOS.establecimiento_TIF || '',
              nombreVeterinario: DATOS.nombre_veterinario || '',
              numeroGuia: DATOS.numero_autorizacion || '',
              certificacion: '',
              regimen: DATOS.clave_regimen || '',
              datosDeMercancia: []
            };
            this.datosDelaSolicitud.patchValue({
              tipoMercancia: DATOS_SOLICITUD_PATCH.tipoMercancia || ''
            });
            const DETALLE_MERCANCIA = DATOS as PrellenadoSolicitud || [];
            if (DETALLE_MERCANCIA.mercancia.length > 0) {
              const FILAS_SOLICITUD: FilaSolicitud[] = [];
              // eslint-disable-next-line complexity
              DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
                const LISTADETALLEPRODUCTOS: DetallasDatos[] = mercancia.lista_detalle_mercancia?.map((producto) => ({
                  numeroDeLote: producto.numero_lote_detalle || '',
                  fechaElaboracionEmpaqueProceso: producto.fecha_elaboracion || '',
                  fechaProduccionSacrificio: producto.fecha_sacrificio_str || '',
                  fechaFinProduccionSacrificio: producto.fecha_sacrificio_fin || '',
                  fechaCaducidadProducto: producto.fecha_caducidad_str || '',
                  fechaFinCaducidadProducto: producto.fecha_caducidad_fin || '',
                  fechaFinElaboracionEmpaqueProceso: producto.fecha_elaboracion_fin || '',
                  fechhaInicioProduccionSacrificio: producto.fecha_sacrificio_str || '',
                  fechaInicioCaducidadProducto: producto.fecha_caducidad_str || '',
                  fechaCaducidad: producto.fecha_caducidad || '',
                })) as DetallasDatos[] || [];
                const LISTADETALLESENSIBLES: Sensible[] = mercancia.lista_detalle_mercancia?.map((animal) => ({
                  noPartida: mercancia.numero_partida.toString(),
                  NumeroLote: animal.numero_lote_detalle || '',
                  ColorPelaje: animal.color_pelaje_detalle || '',
                  EdadAnimal: animal.edad_animal_detalle || '',
                  FaseDesarrollo: animal.fase_desarrollo_detalle || '',
                  FuncionZootecnica: animal.funcion_zootecnica_detalle || '',
                  NumeroIdentificacion: animal.numeroidentificacion_detalle || '',
                  Raza: animal.raza_detalle || '',
                  Sexo: animal.id_sexo_detalle || '',
                  NombreCientifico: animal.nombre_cientifico_detalle || '',
                  NombreMercancia: animal.nombre_mercancia_detalle || '',
                })) as Sensible[] || [];
                const FILAS: FilaSolicitud = {
                  noPartida: mercancia.numero_partida.toString(),
                  descripcionTipoRequisito: mercancia.descripcion_tipo_requisito || '',
                  tipoRequisito: mercancia.tipo_requisito || '',
                  requisito: mercancia.requisitos || '',
                  numeroCertificadoInternacional: String(mercancia.numero_certificado) || '',
                  fraccionArancelaria: mercancia.fraccion_arancelaria_corto || '',
                  descripcionFraccion: mercancia.descripcion_mercancia || '',
                  idDescripcionFraccion: mercancia.id_fraccion_gubernamental || 0,
                  id_fraccion_gubernamental: mercancia.id_fraccion_gubernamental || 0,
                  nico: mercancia.clave_nico || '',
                  descripcionNico: mercancia.descripcion_nico || '',
                  descripcionUso: mercancia.descripcion_uso || '',
                  umt: mercancia.clave_unidad_comercial || '',
                  cantidadUMT: mercancia.cantidad_umt || 0,
                  umc: mercancia.clave_unidad_medida || '',
                  descripcionUMT: mercancia.descripcion_umt || '',
                  descripcionUMC: mercancia.descripcion_umc || '',
                  cantidadUMC: mercancia.cantidad_umc || 0,
                  especie: String(mercancia.id_especie || ''),
                  cantidadEspecie: mercancia.cantidad_presentacion || 0,
                  uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
                  paisDeOrigen: mercancia.clave_paises_origen || '',
                  paisDeDestino: mercancia.nombre_pais_procedencia || '',
                  paisDeProcedencia: mercancia.clave_paises_procedencia || '',
                  descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
                  descripcionPaisDeProcedencia: mercancia.nombre_pais_procedencia || '',
                  tipoPresentacionDescripcion: mercancia.descripcion_tipo_presentacion || '',
                  tipoPresentacion: mercancia.id_tipo_presentacion || '',
                  tipoPlanta: mercancia.id_tipo_planta || '',
                  plantaAutorizadaOrigen: mercancia.descripcion_planta_autorizada || '',
                  certificadoInternacionalElectronico: String(mercancia.numero_certificado) || '',
                  tipoDeProducto: '',
                  numeroDeLote: '',
                  sensibles: LISTADETALLESENSIBLES,
                  detalleProductos: LISTADETALLEPRODUCTOS,
                  descripcion: '',
                  cantidadPresentacion: mercancia.cantidadPresentacion || 0,
                };
                FILAS_SOLICITUD.push(FILAS);
              });
              this.fitosanitarioStore.updateFilaSolicitud(FILAS_SOLICITUD);
            }
            this.fitosanitarioStore.actualizarDatosDeLaSolicitud(DATOS_SOLICITUD_PATCH);
          }
        }
      });

    this.consultaSolicitudService.obtenTramiteMovilizacion(this.tramiteId, this.folioSolicitud)
      .subscribe({
        next: (response) => {
          const DATOS = response.datos;
          if (DATOS) {
            this.sharedService.enviarMovilizacionPrellenado(DATOS as PrellenadoMovilizacion);

          }
        }
      });

    this.consultaSolicitudService.obtenTramiteDatosTerceros(this.tramiteId, this.folioSolicitud)
      .subscribe({
        next: (response) => {
          const DATOS = response.datos;
          if (DATOS) {
            this.sharedService.enviarTercerosRelacionadosPrellenado(DATOS as PrellenadoTercerosRelacionados);
          }

        }
      });

    this.consultaSolicitudService.obtenTramiteDatosPagoDerechos(this.tramiteId, this.folioSolicitud)
      .subscribe({
        next: (response) => {
          const DATOS = response.datos;
          if (DATOS) {
            this.sharedService.enviarPagoDerechosPrellenado(DATOS as PrellenadoPagoDerechos);
          }
        }
      });
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Se utiliza para emitir una notificación y completar el observable `destroyNotifier$`, 
   * permitiendo limpiar suscripciones y evitar fugas de memoria.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
 * Evento que se ejecuta al seleccionar una aduana de ingreso.
 *
 * - Limpia los campos dependientes: puntoInspeccion y oficinaInspeccion.
 * - Obtiene el valor seleccionado de la aduana de ingreso.
 * - Carga el catálogo de sanidad agropecuaria correspondiente.
 *
 * @returns void
 */
  aduanaIngresoSeleccionado(): void {
    this.datosDelaSolicitud.get('puntoInspeccion')?.reset();
    this.datosDelaSolicitud.get('oficinaInspeccion')?.reset();
    const VALOR = this.datosDelaSolicitud.value.aduanaIngreso;
    this.obtenerSanidadAgropecuariaList(VALOR);
  }


  /**
 * @description
 * Confirma la eliminación de la mercancía solo si el usuario acepta la acción.
 * @param confirmado Indica si el usuario aceptó (true) o canceló (false).
 */
  confirmarEliminarMercancia(confirmado: boolean): void {

    this.eliminarDatosTabla = false;

    if (!confirmado) {
      this.eliminarDatosTabla = false;
      return;
    }
    // Limpia la selección visual de la tabla
    this.tablaMercancias.clearSelection();

    // Limpia el conjunto de filas seleccionadas
    this.filasSeleccionadas.clear();

    // Elimina todos los registros de la tabla
    this.cuerpoTabla = [];

    this.datosDelaSolicitud.value.datosDeMercancia = [];

    // Actualiza el store para reflejar que no hay filas en la solicitud
    this.fitosanitarioStore.updateFilaSolicitud([]);
  }

}