import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  SolicitanteQuery,
  TablaDinamicaComponent,
  TablaDinamicaExpandidaComponent,
  TablaSeleccion,
  TituloComponent,
  formatearFechaDdMmYyyy,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  DatosDeFila,
  DatosForma,
  FilaSolicitud,
  Movilizacion,
  PagoDeDerechos,
  RadioOpcion,
  SolicitudData,
  SolicitudFilaTabla,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosdestinoTable,
} from '../../models/220202/fitosanitario.model';
import {
  DetallasDatos,
  DetalleVidaSilvestre,
  Sensible,
} from '../../../../shared/models/datos-de-la-solicitue.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarMercanciaComponent } from '../agregar-mercancia/agregar-mercancia.component';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CatalogosService } from '../../services/220202/catalogos/catalogos.service';
import { ColumnConfig } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica-expandida/tabla-dinamica-exp.component';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudResponse } from '../../models/220202/response/consultar-solicitud-response.model';
import { ConsultaSolicitudService } from '../../services/220202/consulta-solicitud/consulta-solicitud.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { INSTRUCCION_DOBLE_CLIC } from '../../constantes/220202/fitosanitario.enums';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PrellenadoSolicitud } from '../../../220202/models/220202/prellenado-solicitud.model';
import { RegistroSolicitudService } from '../../services/220202/registro-solicitud/registro-solicitud.service';
import { SolicitudService } from '../../services/220202/registro-solicitud/solicitud.service';

/**
 * @description Constructor del componente.
 * @param fb - FormBuilder para crear formularios reactivos.
 * @param agriculturaApiService - Servicio para realizar peticiones HTTP relacionadas con la agricultura.
 * @param consultaioQuery - Query para obtener el estado de la consulta.
 * @param router - Router para navegar entre rutas.
 * @param activatedROute - Ruta activada para obtener parámetros de la ruta actual.
 * @param fitosanitarioStore - Store para manejar el estado del fitosanitario.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    CommonModule,
    NotificacionesComponent,
    ModalComponent,
    TablaDinamicaExpandidaComponent,
  ],
})

/**
 * Componente encargado de gestionar y mostrar los datos de la solicitud en el trámite agrícola.
 *
 * Este componente administra el formulario principal de la solicitud, así como la visualización y manipulación
 * de las tablas relacionadas con los datos de la solicitud y mercancías. Permite la carga de catálogos para los
 * selectores del formulario, la gestión del estado de solo lectura, y la actualización de los datos en el store.
 *
 * Además, implementa la lógica para inicializar los campos del formulario, manejar la selección de filas en las tablas,
 * y controlar la suscripción a los servicios para evitar fugas de memoria.
 *
 * @remarks
 * - Utiliza servicios para obtener datos de catálogos y del formulario.
 * - Permite alternar entre modo edición y solo lectura.
 * - Implementa OnInit y OnDestroy para el ciclo de vida del componente.
 *
 * @example
 * ```html
 * <app-datos-de-la-solicitud></app-datos-de-la-solicitud>
 * ```
 *
 * @see {@link AgriculturaApiService}
 * @see {@link FormBuilder}
 * @see {@link ConsultaioQuery}
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /** @description Indica si el panel de detalle está colapsado o no. */
  colapsable: boolean = true;

  /**
   * @description Datos para las columnas de la tabla.
   * Cada elemento del array representa una columna y contiene la información para mostrar en la cabecera y las celdas de la tabla.
   */
  mesaColumnas: string[] = [];

  @ViewChild('modalRef') modalRef!: ModalComponent;

  /**
   * @description Rango de días seleccionados.
   * Este array contiene las fechas seleccionadas por el usuario para filtrar la información mostrada en la tabla.
   */
  selectRangoDias: string[] = [];

  /**
   * @description Instrucción para el doble clic.
   * Este string contiene el mensaje que se muestra al usuario indicando que debe hacer doble clic en una celda para ver más detalles.
   */
  instruccionDobleClic: string = INSTRUCCION_DOBLE_CLIC;

  /**
   * @description Datos para el cuerpo de la tabla.
   * Este array contiene la información que se muestra en las celdas de la tabla, excluyendo la cabecera.
   */
  mesaCuerpo: string[] = [];

  /**
   * @description Datos de las filas de la tabla.
   * Este array de objetos contiene la información de cada fila de la tabla. Cada objeto representa una fila y contiene las propiedades necesarias para mostrar los datos en las celdas.
   */
  tablaDeDatosDeCelda: DatosDeFila[] = [];

  /**
   * @description Formulario para los datos del trámite.
   * Este `FormGroup` contiene los controles para los campos del formulario relacionados con los datos del trámite.
   */
  procedureData?: FormGroup;

  /**
   * @description Lista de aduanas.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de aduanas en el formulario.
   */
  aduanaList: Catalogo[] = [];

  /**
   * @description Lista de establecimientos agropecuarios.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de establecimientos agropecuarios en el formulario.
   */
  agropecuariaList: Catalogo[] = [];

  /**
   * @description Lista de puntos de verificación.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de puntos de verificación en el formulario.
   */
  puntoList: Catalogo[] = [];

  /**
   * @description Lista de regímenes.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de regímenes en el formulario.
   */
  regimeList: Catalogo[] = [];

  /**
   * @description Lista de productos.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de productos en el formulario.
   */
  productoList: Catalogo[] = [];

  /**
   * @description Lista de usos.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de usos en el formulario.
   */
  usoList: Catalogo[] = [];

  /**
   * @description Lista de unidades de medida de cantidad (UMC).
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de UMC en el formulario.
   */
  umcList: Catalogo[] = [];

  /**
   * @description Lista de NICO (Número de Identificación Comercial).
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de NICO en el formulario.
   */
  nicoList: Catalogo[] = [];

  /**
   * @description Lista de fracciones arancelarias.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de fracciones arancelarias en el formulario.
   */
  arancelariaList: Catalogo[] = [];

  /**
   * @description Formulario principal.
   * Este `FormGroup` contiene todos los controles del formulario.
   */
  forma!: FormGroup;

  /**
   * @description Formulario para el transporte.
   * Este `FormGroup` contiene los controles para los campos del formulario relacionados con la información de transporte.
   */
  formularioDeTransporte?: FormGroup;

  /**
   * @description Almacena los datos del formulario principal.
   * @type {DatosForma}
   */
  formulariodataStore: DatosForma = {} as DatosForma;

  /**
   * @description Tipo de selección para la tabla de solicitudes.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoli: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * @description Tipo de selección para la tabla de mercancías.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

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
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Grupo de formularios anidado para los datos de la solicitud.--220202
   * @property {FormGroup} datos
   */
  datos!: FormGroup;

  /**
   * @description Configuración de las columnas de la tabla de solicitudes.
   * Cada objeto define el encabezado, la clave de acceso y el orden de la columna.
   * @type {ConfiguracionColumna<FilaSolicitud>[]}
   */
  configuracionColumnasoli: ConfiguracionColumna<FilaSolicitud>[] = [
    { encabezado: 'No. partida', clave: (fila) => fila.noPartida, orden: 1 },
    {
      encabezado: 'Tipo de requisito',
      clave: (fila) => fila.descripcionTipoRequisito,
      orden: 2,
    },
    { encabezado: 'Requisito', clave: (fila) => fila.requisito, orden: 3 },
    {
      encabezado: 'Número de Certificado Internacional',
      clave: (fila) => fila.numeroCertificadoInternacional,
      orden: 4,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (fila) => fila.fraccionArancelaria,
      orden: 5,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (fila) => fila.descripcionFraccion,
      orden: 6,
    },
    { encabezado: 'Nico', clave: (fila) => fila.nico, orden: 7 },
    {
      encabezado: 'Descripción Nico',
      clave: (fila) => fila.descripcionNico,
      orden: 8,
    },
    { encabezado: 'Descripción', clave: (fila) => fila.descripcion, orden: 9 },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (fila) => fila.descripcionUMT,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (fila) => fila.cantidadUMT,
      orden: 11,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (fila) => fila.descripcionUMC,
      orden: 12,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (fila) => fila.cantidadUMC,
      orden: 13,
    },
    { encabezado: 'Uso', clave: (fila) => fila.descripcionUso, orden: 14 },
    {
      encabezado: 'Tipo de Producto',
      clave: (fila) => fila.descripcionTipoDeProducto,
      orden: 15,
    },
    {
      encabezado: 'Número de lote',
      clave: (fila) => fila.numeroDeLote,
      orden: 16,
    },
    {
      encabezado: 'País de origen',
      clave: (fila) => fila.descripcionPaisDeOrigen,
      orden: 17,
    },
    {
      encabezado: 'País de procedencia',
      clave: (fila) => fila.descripcionPaisDeProcedencia,
      orden: 18,
    },
    {
      encabezado: 'Certificado Internacional Electrónico',
      clave: (fila) => fila.certificadoInternacionalElectronico,
      orden: 19,
    },
  ];

  /**
   * @description Configuración de las columnas de la tabla de solicitudes.
   * Cada objeto define el encabezado, la clave de acceso y el orden de la columna.
   * @type {ConfiguracionColumna<SolicitudData>[]}
   */
  solicitudConfigurationColumnasoli: ConfiguracionColumna<SolicitudData>[] = [
    {
      encabezado: 'Fecha Creación',
      clave: (fila) => fila.fecha_creacion,
      orden: 1,
    },
    { encabezado: 'Mercancía', clave: (fila) => fila.mercancia, orden: 2 },
    { encabezado: 'Cantidad', clave: (fila) => fila.cantidad, orden: 3 },
    { encabezado: 'Proovedor', clave: (fila) => fila.proveedor, orden: 4 },
  ];

  /**
   * @description Datos de la tabla principal.
   * @type {FilaSolicitud[]}
   */
  cuerpoTabla: FilaSolicitud[] = [];

  /**
   * @description Lista de solicitudes para la tabla.
   * @type {SolicitudFilaTabla[]}
   */
  solicitubLista: SolicitudFilaTabla[] = [];

  /**
   * @description Subject utilizado para destruir las suscripciones y evitar fugas de memoria cuando el componente se destruye.
   * @type {Subject<void>}
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * @description Indica si el formulario se encuentra en modo solo lectura.
   * @type {boolean}
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @description Fila seleccionada en la tabla.
   * @type {FilaSolicitud[]}
   */
  selectedRow: FilaSolicitud[] = [];

  /**
   * Opciones para el botón de radio.
   * @property {RadioOpcion[]} opcionDeBotonDeRadio
   */
  opcionDeBotonDeRadio: RadioOpcion[] = [
    {
      label: 'Animales Vivos',
      value: 'yes',
    },
    {
      label: 'Productos Subproductos',
      value: 'no',
    },
  ];

  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  // public consultaState!: ConsultaioState;

  /**
   * @description Indica si se debe mostrar la notificación de verificación.
   * Esta propiedad se utiliza para controlar la visibilidad de una notificación en la interfaz de usuario.
   *
   * @type {boolean}
   */
  public notificationCheck: boolean = true;

  /**
   * @description Indica si se debe mostrar la tabla de solicitudes.
   * Esta propiedad se utiliza para controlar la visibilidad de la tabla de solicitudes en la interfaz de usuario.
   * @type {boolean}
   */
  public mostrarSolicitudTabla: boolean = true;

  /**
   * @description
   * Cuerpo de la tabla de solicitudes con datos de ejemplo.
   * Este arreglo contiene objetos que representan las filas de la tabla.
   * @type {SolicitudData[]}
   */
  cuerpoTablaSolicitud: SolicitudData[] = [];

  /**
   * Configuración para el select de régimen.--220201
   * @property {Catalogo[]} regimen
   */
  regimen: Catalogo[] = [];

  /** Conjunto de filas seleccionadas en la tabla */
  filasSeleccionadas: Set<number> = new Set();

  /**
   * Constantes de texto.
   * @property {string} TEXTOS
   */
  mensajeErrorTabla: boolean = false;

  nestedColumns: ColumnConfig[] = [
    {
      encabezado: 'Nombre cientifico',
      clave: 'nombreCientifico',
      width: '25%',
    },
  ];

  /**
   * bandera para indicar que el formulario fue tocado
   */
  markTouched: boolean = false;
  /**
   * Rfc de la pantalla solicitante
   */
  rfcOriginal: string = '';
  /**
   * @property {ConsultaioState[]} consultaState
   * @description Consulta solicitud.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * booleano para ocultar el formulario
   * @property {boolean} ocultarForm
   */
  @Input() ocultarForm: boolean = false;

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio FormBuilder para crear y gestionar formularios reactivos.
   * @param {AgriculturaApiService} agriculturaApiService - Servicio HttpClient para realizar peticiones HTTP.
   * @param consultaioQuery
   * @param router
   * @param activatedRoute
   * @param fitosanitarioStore
   * @param catalogosService
   * @param fitosanitarioQuery
   * @param registroSolicitudService
   * @param solicitanteQuery
   */
  constructor(
    public fb: FormBuilder,
    public agriculturaApiService: AgriculturaApiService,
    public consultaioQuery: ConsultaioQuery,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public fitosanitarioStore: FitosanitarioStore,
    public catalogosService: CatalogosService,
    public fitosanitarioQuery: FitosanitarioQuery,
    public registroSolicitudService: RegistroSolicitudService,
    public solicitanteQuery: SolicitanteQuery,
    public consultaSolicitudService: ConsultaSolicitudService,
    private solicitudService: SolicitudService,
  ) {
    this.agriculturaApiService
      .getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.formulariodataStore = datos.datos;
        this.cuerpoTabla = datos.tablaDatos;
      });
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (
            seccionState.parameter === 'FLUJO_FUNCIONARIO_ATENDER_REQUERIMIENTO'
          ) {
            this.mostrarSolicitudTabla = false;
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @description Inicializa el componente.
   * Este método se llama automáticamente después de que se crea el componente.
   * Llama a otros métodos para obtener los datos iniciales que se mostrarán en el formulario y la tabla.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.forma?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(() => {
        const FORMA_VALIDA_ACTUALIZADA = {
          datosFormaValidacion: false,
        };
        FORMA_VALIDA_ACTUALIZADA.datosFormaValidacion = this.forma?.valid
          ? true
          : false;
        this.agriculturaApiService.actualizarFormaValida(
          FORMA_VALIDA_ACTUALIZADA
        );
      });
    if (this.ocultarForm) {
      this.obtenerTodosLosDatosDeLaLista();
      this.createFromFields();
      this.initActionFormBuild();
      this.obtenerDataSolicitud();
      this.obtieneDatosTabSolicitud();
    } else {
      this.obtenerTodosLosDatosDeLaLista();
      this.createFromFields();
      this.initActionFormBuild();
      this.obtieneDatosTabSolicitud();
    }
  }

  /**
   * Obtiene los datos de una solicitud mediante un folio específico y procesa la respuesta
   * para llenar un formulario y realizar diversas acciones basadas en los datos recibidos.
   */
  obtenerDataSolicitud(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetalleSolicitud(Number(this.consultaState.procedureId), FOLIO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(async (response) => {
        if (response?.codigo === '00' && response?.datos) {
          await this.getaduanaLista();
          await this.obtenerSanidadAgropecuariaList(
            response.datos.cve_aduana || ''
          );
          await this.obtenerPuntoInspeccionList(
            response.datos.oficina_inspeccion_sanidad_agropecuaria || ''
          );
          //Regimen
          await this.obtenerRegimenList(response.datos?.clave_regimen || '');
          this.llenarFormularioDesdeRespuesta(response.datos);
        }
      })
  }

  /**
   * Llena el formulario con los datos obtenidos de la respuesta de la consulta de solicitud.
   * @param datos Datos de la respuesta de la consulta de solicitud.
   */
  llenarFormularioDesdeRespuesta(datos: ConsultaSolicitudResponse): void {
    this.datos.patchValue({
      aduanaDeIngreso: datos.cve_aduana,
      oficinaDeInspeccion: datos.oficina_inspeccion_sanidad_agropecuaria,
      puntoDeInspeccion: datos.punto_inspeccion,
      regimen: datos.clave_regimen,
      numeroDeGuia: datos.numero_autorizacion,
      numeroDeCarro: datos.numero_carro_ferrocarril,
    });
    const GUARDAR_VALORES: DatosForma = {
      aduanaDeIngreso: datos.cve_aduana,
      oficinaDeInspeccion: datos.oficina_inspeccion_sanidad_agropecuaria,
      puntoDeInspeccion: datos.punto_inspeccion,
      regimen: datos.clave_regimen,
      numeroDeGuia: datos.numero_autorizacion,
      numeroDeCarro: datos.numero_carro_ferrocarril,
    };
    (
      this.agriculturaApiService.updateDatosForma as (
        value: DatosForma
      ) => void
    )(GUARDAR_VALORES);
    const DETALLE_MERCANCIA =
      (datos as ConsultaSolicitudResponse) || [];
    if (DETALLE_MERCANCIA.mercancia.length > 0) {
      const FILAS_SOLICITUD: FilaSolicitud[] = [];
      // eslint-disable-next-line complexity
      DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
        const LISTADETALLEVIDASILVESTRE: DetalleVidaSilvestre[] =
          (mercancia.lista_detalle_mercancia?.map((vidaSilvestre) => ({
            idDetalleMercancia: vidaSilvestre.id_detalle_mercancia,
            idMercanciaGob: vidaSilvestre.id_mercancia_gob,
            idVidaSilvestre: vidaSilvestre.id_vida_silvestre,
            nombreCientifico: vidaSilvestre.nombre_cientifico,
          })) as DetalleVidaSilvestre[]) || [];

        const FILAS: FilaSolicitud = {
          id: mercancia.id_mercancia_gob || false,
          noPartida: mercancia.numero_partida.toString(),
          descripcionTipoRequisito:
            mercancia.descripcion_tipo_requisito || '',
          tipoRequisito: mercancia.tipo_requisito.toString(),
          requisito: mercancia.requisitos || '',
          numeroCertificadoInternacional: String(mercancia.numero_certificado) || '',
          fraccionArancelaria: mercancia.fraccion_arancelaria_corto || '',
          descripcionFraccion: mercancia.descripcion_fracción_arancelaria || '',
          idDescripcionFraccion: mercancia.id_fraccion_gubernamental || 0,
          nico: mercancia.clave_nico || '',
          descripcionNico: mercancia.descripcion_nico || '',
          descripcionUso: mercancia.descripcion_uso || '',
          umt: mercancia.clave_unidad_comercial || '',
          cantidadUMT: mercancia.cantidad_umt || 0,
          umc: mercancia.clave_unidad_medida || '',
          descripcionUMT: mercancia.descripcion_umt || '',
          descripcionUMC: mercancia.descripcion_umc || '',
          cantidadUMC: mercancia.cantidad_umc || 0,
          uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
          paisDeOrigen: mercancia.clave_paises_origen || '',
          paisDeProcedencia: mercancia.clave_paises_procedencia || '',
          descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
          descripcionPaisDeProcedencia: mercancia.nombre_pais_procedencia || '',
          certificadoInternacionalElectronico: String(mercancia.numero_certificado) || '',
          tipoDeProducto: mercancia.id_tipo_producto_tipo_tramite || 0,
          descripcionTipoDeProducto: mercancia.descripcion_tipo_producto || '',
          numeroDeLote: mercancia.numero_lote || '',
          detalleVidaSilvestre: LISTADETALLEVIDASILVESTRE,
          descripcion: mercancia.descripcion_mercancia || '',
        };
        FILAS_SOLICITUD.push(FILAS);
      });

      this.fitosanitarioStore.updateFilaSolicitud(FILAS_SOLICITUD);
    }
  }

  /**
   * Obtiene los datos de la pestaña Solicitante, en esta caso el RFC ORIGINAL
   */
  obtieneDatosTabSolicitud() {
    this.solicitanteQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.rfcOriginal = seccionState.rfc_original;
      });
  }

  /**
   * Inicializa el grupo de formularios anidado para los datos de la solicitud.
   * @method initActionFormBuild
   */
  initActionFormBuild(): void {
      this.datos = this.fb.group({
        aduanaDeIngreso: ['', Validators.required],
        oficinaDeInspeccion: ['', Validators.required],
        puntoDeInspeccion: ['', Validators.required],
        regimen: ['', Validators.required],
        numeroDeGuia: [''],
        numeroDeCarro: [''],
      });
      this.forma.setControl('datos', this.datos);
      if (this.esFormularioSoloLectura && this.datos !== null) {
        this.datos.get('numeroDeGuia')?.disable({emitEvent: false});
        this.datos.get('numeroDeCarro')?.disable({emitEvent: false});
      }
      this.fitosanitarioQuery.seleccionarDatosForma$
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: DatosForma) => {
          if (datos) {
            // carga de catalogos antes de asignar valores
            const CARGACATALOGOS = async () => {
              if (
                datos.aduanaDeIngreso !== undefined &&
                datos.aduanaDeIngreso !== ''
              ) {
                await this.obtenerSanidadAgropecuariaList(datos.aduanaDeIngreso);
              }
              if (
                datos.oficinaDeInspeccion !== undefined &&
                datos.oficinaDeInspeccion !== ''
              ) {
                await this.obtenerPuntoInspeccionList(datos.oficinaDeInspeccion);
              }
            };
            CARGACATALOGOS().then(() => {
              this.datos.patchValue({
                aduanaDeIngreso: datos.aduanaDeIngreso || '',
                oficinaDeInspeccion: datos.oficinaDeInspeccion || '',
                puntoDeInspeccion: datos.puntoDeInspeccion || '',
                regimen: datos.regimen || '',
                numeroDeGuia: datos.numeroDeGuia || '',
                numeroDeCarro: datos.numeroDeCarro || '',
              });
            });
          }
      });
  }

  /**
   * @description Obtiene los datos de la tabla de solicitudes recientes para el
   * prellenado.
   * @method obtenerDatosTablaSolicitud
   * @returns {void}
   */
  obtenerDatosTablaSolicitud(): void {
    this.registroSolicitudService
      // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
      // .obtieneDatosDeLaSolicitud(220202, this.rfcOriginal)
      .obtieneDatosDeLaSolicitud(220202, 'AAL0409235E6')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.cuerpoTablaSolicitud = data.datos ?? [];
      });
  }

  /**
   * @description Inicializa el estado del formulario dependiendo si está en modo solo lectura o edición.
   * Si el formulario está en modo solo lectura, deshabilita los campos; de lo contrario, los habilita y crea los campos del formulario.
   * @method inicializarEstadoFormulario
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * @description Habilita o deshabilita el formulario según el modo de solo lectura.
   * Si el formulario está en modo solo lectura, deshabilita todos los controles; si no, los habilita.
   * @method guardarDatosFormulario
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.forma?.disable({emitEvent: false});
    } else {
      this.forma?.enable({emitEvent: false});
    }
  }

  /**
   * @description Crea los campos del formulario y los agrupa en un `FormGroup`.
   * Inicializa el formulario principal (`forma`) con los controles para los datos de la solicitud,
   * incluyendo un `FormArray` para las mercancías.
   * @method createFromFields
   * @returns {void}
   */
  createFromFields(): void {
    this.forma = this.fb.group({
      datos: this.fb.group({}),
    });
    if (this.forma) {
      this.notificationCheck = true;
    }
  }

  /**
   * Método que inicializa los campos del formulario.
   * @returns Un objeto con los campos del formulario.
   */
  inicializarCamposFormulario(): Record<string, unknown> {
    return {
      ...this.crearCamposRequeridos(),
    };
  }

  /**
   * Método para crear campos requeridos del formulario.
   * @param FORMULARIO Datos de formulariodataStore.
   * @returns Objeto con los campos requeridos.
   */
  crearCamposRequeridos(): Record<string, unknown> {
    const FORMULARIO = this.formulariodataStore;
    return {
      tipoMercancia: [
        { value: 'yes', disabled: this.esFormularioSoloLectura },
        Validators.required,
      ],
      aduanaDeIngreso: [
        {
          value: FORMULARIO.aduanaDeIngreso || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required,
      ],
      oficinaDeInspeccion: [
        {
          value: FORMULARIO.oficinaDeInspeccion || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required,
      ],
      puntoDeInspeccion: [
        {
          value: FORMULARIO.puntoDeInspeccion || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required,
      ],
      regimen: [
        {
          value: FORMULARIO.regimen || '',
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required,
      ],
      numeroDeGuia: [
        {
          value: FORMULARIO.numeroDeGuia || '',
          disabled: this.esFormularioSoloLectura,
        },
      ],
      numeroDeCarro: [
        {
          value: FORMULARIO.numeroDeCarro || '',
          disabled: this.esFormularioSoloLectura,
        },
      ],
    };
  }

  /**
   * @description Obtiene todos los datos para las listas de opciones (selects) del formulario.
   * Este método llama a las funciones individuales para obtener los datos de cada lista: aduana, agropecuaria, punto, régimen, arancelaria, NICO, producto, unidad de medida de cantidad (UMC) y uso.
   * @method obtenerTodosLosDatosDeLaLista
   * @returns {void}
   */
  obtenerTodosLosDatosDeLaLista(): void {
    this.obtenerDatosTablaSolicitud();
    this.getaduanaLista();
    this.getRegimenLista();
    this.getArancelariaLista();
    this.getNicoLista();
    this.getProductoLista();
    this.getUmCLista();
    this.getusoLista();
  }

  /**
   * @description Muestra u oculta el panel colapsable.
   * @method mostrar_colapsable
   * @returns {void}
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * @description Obtiene la lista de aduanas desde un archivo JSON.
   * @method getaduanaLista
   * @returns {void}
   */
  getaduanaLista(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService
        .obtieneCatalogoAduana(220202)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data): void => {
          this.aduanaList = data.datos ?? [];
          resolve();
        });
    })
  }

  /**
   * @description Obtiene la lista de fracciones arancelarias desde un archivo JSON.
   * @method getArancelariaLista
   * @returns {void}
   */
  getArancelariaLista(): void {
    this.agriculturaApiService
      .obtenerSelectorList('nombre.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.arancelariaList = data as Catalogo[];
      });
  }

  /**
   * @description Obtiene la lista de NICO desde un archivo JSON.
   * @method getNicoLista
   * @returns {void}
   */
  getNicoLista(): void {
    this.agriculturaApiService
      .obtenerSelectorList('nombre.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.nicoList = data as Catalogo[];
      });
  }

  /**
   * @description Obtiene la lista de unidades de medida de cantidad (UMC) desde un archivo JSON.
   * @method getUmCLista
   * @returns {void}
   */
  getUmCLista(): void {
    this.agriculturaApiService
      .obtenerSelectorList('nombre.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.umcList = data as Catalogo[];
      });
  }

  /**
   * @description Obtiene la lista de usos desde un archivo JSON.
   * @method getusoLista
   * @returns {void}
   */
  getusoLista(): void {
    this.agriculturaApiService
      .obtenerSelectorList('nombre.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.usoList = data as Catalogo[];
      });
  }

  /**
   * @description Obtiene la lista de productos desde un archivo JSON.
   * @method getProductoLista
   * @returns {void}
   */
  getProductoLista(): void {
    this.agriculturaApiService
      .obtenerSelectorList('nombre.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.productoList = data as Catalogo[];
      });
  }

  /**
   * @description Actualiza los datos almacenados en el store.
   * @method setValoresStore
   */
  setValoresStore(): void {
    const VALOR = this.datos.value;
    (
      this.agriculturaApiService.updateDatosForma as (value: DatosForma) => void
    )(VALOR);
  }

  /**
   * Obtiene la lista para el select de oficina de inspección de sanidad agropecuaria desde el selector.
   * @method catalogoOficinas
   */
  catalogoOficinas(_forma?: FormGroup): void {
    const VALOR = this.forma.value;
    this.obtenerSanidadAgropecuariaList(VALOR.datos.aduanaDeIngreso);
  }

  /**
   * Obtiene la lista para el select de puntos de inspeccion desde el selector.
   * @method obtenerPuntoInspeccion
   */
  obtenerPuntoInspeccion(_forma?: FormGroup): void {
    const VALOR = this.forma.value;
    this.obtenerPuntoInspeccionList(VALOR.datos.oficinaDeInspeccion);
  }

  /**
   * Obtiene la lista para el select de régimen.
   * @method getRegimenLista
   */
  getRegimenLista(): void {
    this.catalogosService
      .obtieneCatalogoRegimenesVigentes(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.regimeList = data.datos ?? [];
      });
  }

  /**
   * Obtiene la lista para el select de punto de inspección.
   * @method obtenerPuntoInspeccionList
   */
  obtenerPuntoInspeccionList(valor: string): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService
        .obtieneCatalogoPuntoInspeccion(220202, valor)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data): void => {
          this.puntoList = data.datos ?? [];
          resolve();
        });
    })
  }

  /**
   * Obtiene la lista para el select de sanidad agropecuaria.
   * @method obtenerSanidadAgropecuariaList
   */
  obtenerSanidadAgropecuariaList(cveAduana: string): Promise<void> {
    return new Promise((resolve) => {
      this.agropecuariaList = [];
      if (cveAduana && cveAduana !== '') {
        this.catalogosService
          .obtieneCatalogoOficinasInspeccion(220202, cveAduana)
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data): void => {
            this.agropecuariaList = data.datos ?? [];
            resolve();
          });
      }
    })
  }

  /**
   * Obtiene la lista para el select de régimen.
   * @method obtenerRegimenList
   */
  obtenerRegimenList(clave_regimen: string = ''): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService
        .obtieneCatalogoRegimenes(220202)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          this.regimen = clave_regimen
            ? (data.datos ?? []).filter((item) => item.clave === clave_regimen)
            : data.datos ?? [];
          resolve();
        });
    })
  }

  /**
   * Maneja la selección de una fila en la tabla de solicitudes.
   *
   * Cuando se selecciona una fila, este método actualiza los valores del formulario (`forma`)
   * con datos predefinidos relacionados con la solicitud seleccionada, usando los IDs correctos de los catálogos.
   *
   * @param event - Objeto de tipo `SolicitudFilaTabla` que representa la fila seleccionada en la tabla.
   */
  seleccionFila(event: SolicitudData): void {
    if (event && event.id_solicitud) {
      // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
      // this.obtenerPrellenadoMovilizacionNacional(event.id_solicitud);
      // this.obtenerPrellenadoTercerosRelacionados(event.id_solicitud);
      // this.obtenerPrellenadoPagoDerechos(event.id_solicitud);
      this.obtenerPrellenadoMovilizacionNacional('202850466');
      this.obtenerPrellenadoTercerosRelacionados('202850466');
      this.obtenerPrellenadoPagoDerechos('202850466');
      this.catalogosService
        .obtenSolicitudPrellenado(220202, true, '202850466' ?? '')
        // this.catalogosService.obtenSolicitudPrellenado(220202, true, event.id_solicitud ?? '')
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: async (datos) => {
            if (datos?.datos) {
              if (event.id_solicitud !== undefined) {
                this.solicitudService.emitirIdSolicitud(event.id_solicitud.toString());
                this.solicitudService.emitirEsPrellenado(true);
              }
              await this.obtenerSanidadAgropecuariaList(
                datos.datos.cve_aduana || ''
              );
              await this.obtenerPuntoInspeccionList(
                datos.datos.oficina_inspeccion_sanidad_agropecuaria || ''
              );
              //Regimen
              await this.obtenerRegimenList(datos.datos?.clave_regimen || '');
              this.datos.patchValue({
                aduanaDeIngreso: datos.datos.cve_aduana || '',
                tipoDeMercancia:
                  datos.datos.mercancia[0].tipo_mercancia === 'TICERM.SOA'
                    ? 'no'
                    : 'yes', //'yes' para animales vivos, 'no' para subproductos
                oficinaDeInspeccion:
                  datos.datos.oficina_inspeccion_sanidad_agropecuaria || '',
                puntoDeInspeccion: datos.datos.punto_inspeccion || '',
                regimen: datos.datos.clave_regimen || '',
                numeroDeGuia: datos.datos.numero_autorizacion || '',
                numeroDeCarro: datos.datos.numero_carro_ferrocarril || '',
              });
              const GUARDAR_VALORES: DatosForma = {
                aduanaDeIngreso: datos.datos.cve_aduana,
                numeroDeCarro: datos.datos.numero_carro_ferrocarril,
                numeroDeGuia: datos.datos.numero_autorizacion,
                oficinaDeInspeccion:
                  datos.datos.oficina_inspeccion_sanidad_agropecuaria,
                puntoDeInspeccion: datos.datos.punto_inspeccion,
                regimen: datos.datos.clave_regimen,
              };
              (
                this.agriculturaApiService.updateDatosForma as (
                  value: DatosForma
                ) => void
              )(GUARDAR_VALORES);
            } else {
              this.datos.reset();
            }
            console.warn('Datos de la solicitud prellenada:', datos);
            const DETALLE_MERCANCIA =
              (datos?.datos as PrellenadoSolicitud) || [];
            if (DETALLE_MERCANCIA.mercancia.length > 0) {
              const FILAS_SOLICITUD: FilaSolicitud[] = [];
              // eslint-disable-next-line complexity
              DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
                const LISTADETALLEVIDASILVESTRE: DetalleVidaSilvestre[] =
                  (mercancia.lista_detalle_mercancia?.map((vidaSilvestre) => ({
                    idDetalleMercancia:
                      vidaSilvestre.id_detalle_mercancia || '',
                    idMercanciaGob: vidaSilvestre.id_mercancia_gob || '',
                    idVidaSilvestre: vidaSilvestre.id_vida_silvestre || '',
                    nombreCientifico: vidaSilvestre.nombre_cientifico || '',
                  })) as DetalleVidaSilvestre[]) || [];

                const FILAS: FilaSolicitud = {
                  id: mercancia.id_mercancia_gob || Math.floor(Math.random() * 1000000),
                  noPartida: mercancia.numero_partida.toString(),
                  descripcionTipoRequisito:
                    mercancia.descripcion_tipo_requisito || '',
                  tipoRequisito: mercancia.tipo_requisito || '',
                  requisito: mercancia.requisitos || '',
                  numeroCertificadoInternacional:
                    String(mercancia.numero_certificado) || '',
                  fraccionArancelaria:
                    mercancia.cve_fraccion || '',
                  descripcionFraccion:
                    mercancia.descripcion_fracción_arancelaria || '',
                  idDescripcionFraccion:
                    mercancia.id_fraccion_gubernamental || 0,
                  nico: mercancia.clave_nico || '',
                  descripcionNico: mercancia.descripcion_nico || '',
                  descripcionUso: mercancia.descripcion_uso || '',
                  umt: mercancia.clave_unidad_comercial || '',
                  cantidadUMT: mercancia.cantidad_umt || 0,
                  umc: mercancia.clave_unidad_medida || '',
                  descripcionUMT: mercancia.descripcion_umt || '',
                  descripcionUMC: mercancia.descripcion_umc || '',
                  cantidadUMC: mercancia.cantidad_umc || 0,
                  uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
                  paisDeOrigen: mercancia.clave_paises_origen || '',
                  paisDeProcedencia: mercancia.clave_paises_procedencia || '',
                  descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
                  descripcionPaisDeProcedencia:
                    mercancia.nombre_pais_procedencia || '',
                  certificadoInternacionalElectronico:
                    String(mercancia.numero_certificado) || '',
                  tipoDeProducto: mercancia.id_tipo_producto_tipo_tramite || 0,
                  descripcionTipoDeProducto: mercancia.descripcion_tipo_producto || '',
                  numeroDeLote: mercancia.numero_lote || '',
                  detalleVidaSilvestre: LISTADETALLEVIDASILVESTRE,
                  descripcion: mercancia.descripcion_mercancia || '',
                };
                FILAS_SOLICITUD.push(FILAS);
              });

              this.fitosanitarioStore.updateFilaSolicitud(FILAS_SOLICITUD);
            }
          },
          error: (error) => {
            console.error(
              'Error al obtener los datos de la solicitud prellenada:',
              error
            );
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Error',
              mensaje:
                'Ocurrió un error al obtener los datos de la solicitud. Por favor, intente nuevamente, más tarde.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          },
        });
    }
  }

  /**
   * Metodo que obtiene los datos de la solicitud prellenada para la pestaña
   * de movilizacion nacional
   * @param idSolicitud
   */
  obtenerPrellenadoMovilizacionNacional(idSolicitud: string): void {
    // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
    // this.catalogosService.obtenSolicitudPrellenadoMovilizacionNacional(220202, true, idSolicitud ?? '')
    this.catalogosService
      .obtenSolicitudPrellenadoMovilizacionNacional(
        220202,
        true,
        '202850466' ?? ''
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (datos) => {
          if (datos.datos) {
            const GUARDAR_VALORES: Movilizacion = {
              transporte: datos.datos.ide_medio_transporte,
              puntoVerificacion: datos.datos.id_punto_verificacion,
              empresaTransportista: datos.datos.razon_social,
              identificacion: datos.datos.identificacion_transporte,
            };
            (
              this.agriculturaApiService.updateMovilizacion as (
                value: Movilizacion
              ) => void
            )(GUARDAR_VALORES);
          }
        },
      });
  }

  /**
   * Metodo que obtiene los datos de la solicitud prellenada para la pestaña
   * de terceros relacionados
   * @param idSolicitud
   */
  obtenerPrellenadoTercerosRelacionados(idSolicitud: string): void {
    // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
    // this.catalogosService.obtenSolicitudPrellenadoTercerosRelacionados(220202, true, idSolicitud ?? '')
    this.catalogosService
      .obtenSolicitudPrellenadoTercerosRelacionados(
        220202,
        true,
        '202850466' ?? ''
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (datos) => {
          if (datos.datos) {
            const ARRAY_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable[] =
              [];
            datos.datos.terceros_destinatario.forEach((item) => {
              const GUARDAR_VALORES_TERCEROS_DESTINO: TercerosrelacionadosdestinoTable =
                {
                  tipoMercancia: '',
                  nombre: item.nombre,
                  primerApellido: item.apellido_paterno,
                  segundoApellido: item.apellido_materno,
                  razonSocial: item.razon_social,
                  pais: item.pais,
                  codigoPostal: item.codigo_postal,
                  estado: item.cve_entidad,
                  municipio: item.cve_deleg_mun,
                  colonia: item.cve_colonia,
                  calle: item.calle,
                  numeroExterior: item.num_exterior,
                  numeroInterior: item.num_interior,
                  lada: item.lada,
                  telefono: item.telefonos,
                  correo: item.correo,
                  planta: '',
                  domicilio: '',
                  municipioDescripcion: '',
                  estadoDescripcion: '',
                  paisDescripcion: '',
                  coloniaDescripcion: '',
                };
              ARRAY_TERCEROS_DESTINO.push(GUARDAR_VALORES_TERCEROS_DESTINO);
              (
                this.agriculturaApiService.updateTercerosRelacionado as (
                  value: TercerosrelacionadosdestinoTable[]
                ) => void
              )(ARRAY_TERCEROS_DESTINO);
            });
            const ARRAY_TERCEROS_EXPORTADOR: TercerosrelacionadosExportadorTable[] =
              [];
            datos.datos.terceros_exportador.forEach((item) => {
              const GUARDAR_VALORES_TERCEROS_EXPORTADOR: TercerosrelacionadosExportadorTable =
                {
                  tipoMercancia: '',
                  nombre: item.nombre,
                  razonSocial: item.razon_social,
                  pais: item.pais,
                  telefono: item.telefonos,
                  domicilio: item.descripcion_ubicacion,
                  correo: item.correo,
                  primerApellido: item.apellido_paterno,
                  segundoApellido: item.apellido_materno,
                  lada: item.lada,
                };
              ARRAY_TERCEROS_EXPORTADOR.push(
                GUARDAR_VALORES_TERCEROS_EXPORTADOR
              );
              (
                this.agriculturaApiService.updateTercerosExportador as (
                  value: TercerosrelacionadosExportadorTable[]
                ) => void
              )(ARRAY_TERCEROS_EXPORTADOR);
            });
          }
        },
      });
  }

  /**
   * Metodo que obtiene los datos de la solicitud prellenada para la pestaña
   * de pago de derechos
   * @param idSolicitud
   */
  obtenerPrellenadoPagoDerechos(idSolicitud: string): void {
    // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
    // this.catalogosService.obtenSolicitudPrellenadoPagoDerechos(220202, true, idSolicitud ?? '')
    this.catalogosService
      .obtenSolicitudPrellenadoPagoDerechos(220202, true, '202850466' ?? '')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (datos) => {
          if (datos.datos) {
            const GUARDAR_VALORES: PagoDeDerechos = {
              exentoPago: datos.datos.exento_pago ? 'si' : 'no',
              justificacion: datos.datos.ide_motivo_exento_pago,
              claveReferencia: datos.datos.cve_referencia_bancaria,
              cadenaDependencia: datos.datos.cadena_pago_dependencia,
              banco: datos.datos.cve_banco,
              llavePago: datos.datos.llave_pago,
              importePago: datos.datos.imp_pago,
              fechaPago: formatearFechaDdMmYyyy(datos.datos.fec_pago),
            };
            (
              this.agriculturaApiService.updatePago as (
                value: PagoDeDerechos
              ) => void
            )(GUARDAR_VALORES);
          }
        },
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
  onRowExpanded(row: any): void {
    // Aquí puedes cargar los datos para la tabla anidada si es necesario
    console.warn('Fila expandida:', row);
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
   * @description Getter que indica si hay registros seleccionados en la tabla.
   * @returns {boolean} true si hay al menos un registro seleccionado, false en caso contrario.
   */
  get tieneRegistrosSeleccionados(): boolean {
    const SELECTED_DATA = this.fitosanitarioStore.getValue().selectedDatos;
    return SELECTED_DATA && SELECTED_DATA.length > 0;
  }

  /**
   * @description Navega a la página de agregar mercancía.
   * Este método redirige al usuario a la ruta relativa 'mercancia-form' para agregar una nueva mercancía.
   * @method agregarMercancia
   * @returns {void}
   */
  agregarMercancia(): void {
    this.seleccionTabla([],[]);
    this.modalRef.abrir(AgregarMercanciaComponent);
  }

  /**
   * @description Selecciona una fila de la tabla de solicitudes y actualiza el estado del store.
   * Este método se llama cuando se selecciona una fila en la tabla de solicitudes.
   * Actualiza el estado del store con los datos de la fila seleccionada.
   * @method seleccionTabla
   * @param {FilaSolicitud} event - Datos de la fila seleccionada.
   */
  seleccionTabla(event: FilaSolicitud[],datosCroosList:string[]): void {
    this.fitosanitarioStore.update((state) => ({
      ...state,
      selectedDatos: event,
      usoCrossListDatos:datosCroosList
    }));
  }

  /**
   * @description Navega a la página de modificar mercancía.
   * Este método redirige al usuario a la ruta relativa '../mercancia-form' para modificar una mercancía existente.
   * Solo permite la navegación si hay al menos un registro seleccionado.
   * Mantiene los datos seleccionados en el store para pre-llenar el formulario.
   * @method modificarMercancia
   * @returns {void}
   */
  modificarMercancia(): void {
    const SELECTED_DATA = this.fitosanitarioStore.getValue().selectedDatos;
    const TABLE_DATA = this.fitosanitarioStore.getValue().tablaDatos;

    // Verificar si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      this.modificarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Verificar si no hay registros seleccionados
    if (!SELECTED_DATA || SELECTED_DATA.length === 0) {
      this.modificarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Verificar si hay más de un registro seleccionado
    if (SELECTED_DATA.length > 1) {
      this.modificarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Si hay exactamente un dato seleccionado, abrir el modal con el componente de agregar/modificar mercancía
    this.modalRef.abrir(AgregarMercanciaComponent);
  }

  /**
   * @description Elimina mercancía seleccionada directamente sin confirmación.
   * @method eliminarMercancia
   * @returns {void}
   */
  eliminarMercancia(): void {
    const SELECTED_DATA = this.fitosanitarioStore.getValue().selectedDatos;
    const TABLE_DATA = this.fitosanitarioStore.getValue().tablaDatos;

    // Verificar si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      this.eliminarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Verificar si no hay registros seleccionados
    if (!SELECTED_DATA || SELECTED_DATA.length === 0) {
      this.eliminarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Si hay más de un registro seleccionado, mostrar mensaje de error
    if (SELECTED_DATA.length > 1) {
      this.eliminarMercanciaNotification();
      this.moduloEmergente = true;
      return;
    }

    // Si hay exactamente un registro seleccionado, eliminar directamente
    if (SELECTED_DATA.length === 1) {
      const FILTERED_VALOR = TABLE_DATA
        .filter(item => !SELECTED_DATA.includes(item))
        .map((item, index) => ({
          ...item,
          noPartida: String(index + 1)
        }));
      this.fitosanitarioStore.update((state) => ({
        ...state,
        tablaDatos: FILTERED_VALOR,
      }));

      // Limpiar selección después de eliminar
      this.seleccionTabla([],[]);
    }
  }

  /**
   * @description Destruye la suscripción cuando el componente es destruido.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Elimina un pedimento de la lista si el parámetro `borrar` es verdadero.
   * @method eliminarPedimento
   * @param borrar - Indica si se debe eliminar el pedimento seleccionado.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.moduloEmergente = false;
    } else {
      this.moduloEmergente = false;
    }
  }

  /**
   * Elimina un pedimento de la lista si el parámetro `borrar` es verdadero.
   * @method eliminarPedimentoDatos
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
        (item) =>
          !this.fitosanitarioStore.getValue().selectedDatos.includes(item)
      );
      this.fitosanitarioStore.update((state) => ({
        ...state,
        tablaDatos: FILTERED_VALOR,
      }));

      // Limpiar selección después de eliminar
      this.seleccionTabla([],[]);
    } else {
      this.eliminarDatosTabla = false;
    }
  }

  /**
   * @description
   * Genera una notificación de error para la operación de eliminar mercancía.
   * Esta función valida el estado actual de la selección de datos en la tabla y muestra un mensaje
   * @method eliminarMercanciaNotification
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `nuevaNotificacion`
   */
  eliminarMercanciaNotification(): void {
    const SELECTED_DATA = this.fitosanitarioStore.getValue().selectedDatos;
    const TABLE_DATA = this.fitosanitarioStore.getValue().tablaDatos;

    let mensaje = 'Selecciona un registro.';

    // Si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      mensaje = 'Selecciona un registro.';
    }
    // Si no hay registros seleccionados pero hay registros en la tabla
    else if (!SELECTED_DATA || SELECTED_DATA.length === 0) {
      mensaje = 'Selecciona un registro.';
    }
    // Si hay múltiples registros seleccionados
    else if (SELECTED_DATA.length > 1) {
      mensaje = 'Selecciona un registro.';
    }

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
  }

  /**
   * @description Genera una notificación de error para la operación de modificar mercancía.
   * Esta función valida el estado actual de la selección de datos en la tabla y muestra un mensaje
   * @method modificarMercanciaNotification
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `nuevaNotificacion`
   */
  modificarMercanciaNotification(): void {
    const SELECTED_DATA = this.fitosanitarioStore.getValue().selectedDatos;
    const TABLE_DATA = this.fitosanitarioStore.getValue().tablaDatos;

    let mensaje = 'Selecciona sólo un registro para modificar.';

    // Si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    // Si no hay registros seleccionados pero hay registros en la tabla
    else if (!SELECTED_DATA || SELECTED_DATA.length === 0) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    // Si hay más de un registro seleccionado
    else if (SELECTED_DATA.length > 1) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }

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
  }

  /**
   * @description Valida todos los campos del formulario y marca los campos como touched
   * para mostrar los errores de validación en los componentes app-catalogo-select
   * @method validarFormulario
   * @returns { valido: boolean; mensaje: string } true si el formulario es válido, false en caso contrario
   */
  public validarFormulario(): { valido: boolean; mensaje?: string } {
    // Marcar los select customizados
    this.markTouched = true;
    this.forma.updateValueAndValidity();
    this.forma.markAllAsTouched();

    // Verificar si hay datos en la tabla
    const TABLE_DATA = this.fitosanitarioStore.getValue().tablaDatos;
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      this.mensajeErrorTabla = true;
      return { valido: false, mensaje: 'Debe agregar al menos una mercancía.' };
    }

    // Retornar si el formulario es válido
    if (!this.forma.valid) {
      return { valido: false };
    }

    return { valido: true };
  }
}
