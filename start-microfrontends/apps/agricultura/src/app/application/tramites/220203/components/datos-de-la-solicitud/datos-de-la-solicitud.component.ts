import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  ConsultaioState,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  formatearFechaDdMmYyyy,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatoTabla,
  DestinatarioForm,
  FilaSolicitud,
  FormularioMovilizacion,
  PagoDeDerechos,
  RealizarGroup,
  SolicitudData,
  TercerosrelacionadosdestinoTable,
} from '../../models/220203/importacion-de-acuicultura.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { CatalogosService} from '../../services/220203/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { ConsultaSolicitudResponse } from '../../models/220203/response/consultar-solicitud-response.model';
import {
  ConsultaSolicitudService
} from '../../../220203/services/220203/consulta-solicitud/consulta-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { MENSAJE_DOBLE_CLIC } from '../../constantes/220203/importacion-de-acuicultura.enum';
import { MercanciaSolicitudComponent } from '../mercancia-solicitud/mercancia-solicitud.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PrellenadoSolicitud } from '../../models/220203/prellenado-solicitud.model';
import { RegistroSolicitudService } from '../../services/220203/registro-solicitud/registro-solicitud.service';
import { SolicitudService } from '../../../220203/services/220203/registro-solicitud/solicitud.service';

/**
 * @fileoverview
 * Componente Angular para gestionar los datos de la solicitud de importación de acuicultura.
 * Permite capturar, validar y actualizar la información relacionada con la mercancía, así como mostrar tablas dinámicas y catálogos.
 * Cobertura de documentación completa: cada propiedad, método y constructor está documentado en español.
 * @module DatosDeLaSolicitudComponent
 */

/**
 * Componente para gestionar los datos de la solicitud de importación de acuicultura.
 * Permite capturar, validar y actualizar la información relacionada con la mercancía, así como mostrar tablas dinámicas y catálogos.
 * Gestiona formularios reactivos con validaciones, tablas interactivas y operaciones CRUD sobre mercancías.
 * 
 * @export
 * @class DatosDeLaSolicitudComponent
 * @implements {OnDestroy}
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    CommonModule,
    ModalComponent,
    NotificacionesComponent
  ],
})
export class DatosDeLaSolicitudComponent implements OnDestroy, OnInit {
  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * Contiene la configuración de alertas y mensajes de confirmación para el usuario.
   * @type {Notificacion}
   * @public
   * @memberof DatosDeLaSolicitudComponent
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Referencia al componente modal para mostrar formularios de mercancía.
   * Se utiliza para abrir y cerrar modales de forma programática.
   * @type {ModalComponent}
   * @memberof DatosDeLaSolicitudComponent
   */
  @ViewChild('modalRef') modalRef!: ModalComponent;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   * Mantiene el estado de selección para operaciones de edición y eliminación.
   * @type {FilaSolicitud[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  listSelectedView: FilaSolicitud[] = [];

  /**
   * Subject para controlar la destrucción de suscripciones y evitar memory leaks.
   * Se utiliza para limpiar todas las suscripciones activas al destruir el componente.
   * @type {Subject<void>}
   * @private
   * @memberof DatosDeLaSolicitudComponent
   */
  private readonly DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Mensaje que se muestra en una alerta al hacer doble clic en elementos de la tabla.
   * Proporciona información al usuario sobre acciones disponibles.
   * @type {string}
   * @memberof DatosDeLaSolicitudComponent
   */
  alertMessage: string = MENSAJE_DOBLE_CLIC;

  /**
   * Tipo de selección para la tabla principal de mercancías.
   * Permite seleccionar múltiples elementos usando checkboxes.
   * @type {TablaSeleccion}
   * @memberof DatosDeLaSolicitudComponent
   */
  tipoSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Tipo de selección para la tabla de solicitudes.
   * No permite selección de elementos en esta tabla específica.
   * @type {TablaSeleccion}
   * @memberof DatosDeLaSolicitudComponent
   */
  tipoSeleccionsoli: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * Datos del cuerpo de la tabla de solicitudes.
   * Contiene la información mostrada en la tabla de solicitudes secundaria.
   * @type {DatoTabla[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  cuerpoTablasoli: DatoTabla[] = [];

  /**
   * Configuración de columnas para la tabla principal de mercancías.
   * Define la estructura, orden y visualización de cada columna en la tabla.
   * @type {ConfiguracionColumna<FilaSolicitud>[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  configuracionColumnas: ConfiguracionColumna<FilaSolicitud>[] = [
    { encabezado: 'No. partida', clave: (fila) => fila.noPartida, orden: 1 },
    { encabezado: 'Tipo de requisito', clave: (fila) => fila.tipoRequisito, orden: 2 },
    { encabezado: 'Requisito', clave: (fila) => fila.requisito, orden: 3 },
    { encabezado: 'Número de Certificado Internacional', clave: (fila) => fila.numeroCertificadoInternacional, orden: 4 },
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria, orden: 5 },
    { encabezado: 'Descripción de la fracción', clave: (fila) => fila.descripcionFraccion, orden: 6 },
    { encabezado: 'Nico', clave: (fila) => fila.nico, orden: 7 },
    {encabezado:'Descripción Nico', clave: (fila) => fila.descripcionNico, orden: 8},
    { encabezado: 'Descripción', clave: (fila) => fila.descripcion, orden: 9 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (fila) => fila.umt, orden: 10 },
    { encabezado: 'Cantidad UMT', clave: (fila) => fila.cantidadUMT, orden: 11 },
    { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (fila) => fila.umc, orden: 12 },
    { encabezado: 'Cantidad UMC', clave: (fila) => fila.cantidadUMC, orden: 13 },
    { encabezado: 'Uso', clave: (fila) => fila.uso, orden: 14 },
    { encabezado: 'Especie', clave: (fila) => fila.especie, orden: 15 },
    { encabezado: 'País de origen', clave: (fila) => fila.paisDeOrigen, orden: 16 },
    { encabezado: 'País de procedencia', clave: (fila) => fila.paisDeProcedencia, orden: 17 },
    { encabezado: 'Número de lote', clave: (fila) => fila.numeroDeLote, orden: 18 },
    { encabezado: 'Fase de desarrollo', clave: (fila) => fila.faseDeDesarrollo, orden: 19 },
    { encabezado: 'Certificado Internacional Electrónico', clave: (fila) => fila.certificadoInternacional, orden: 20 }
  ];

  /**
   * Datos del cuerpo de la tabla principal de mercancías.
   * Contiene todas las filas de mercancías que se muestran en la tabla.
   * @type {FilaSolicitud[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  cuerpoTablaFila: FilaSolicitud[] = [];

  /**
   * Configuración de columnas para la tabla de solicitudes secundaria.
   * Define la estructura y visualización de la tabla de solicitudes.
   * @type {ConfiguracionColumna<SolicitudData>[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  configuracionColumnasoli: ConfiguracionColumna<SolicitudData>[] = [
    { encabezado: 'Fecha Creación', clave: (fila) => fila.fecha_creacion, orden: 1 },
    { encabezado: 'Mercancía', clave: (fila) => fila.mercancia, orden: 2 },
    { encabezado: 'Cantidad', clave: (fila) => fila.cantidad.toString(), orden: 3 },
    { encabezado: 'Proveedor', clave: (fila) => fila.proveedor, orden: 4 },
  ];

  /**
   * Indica si la sección del formulario es colapsable.
   * Controla la visualización expandida o contraída de secciones del UI.
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
  colapsable: boolean = true;

  /**
   * Grupo de formularios reactivo para los datos de la mercancía.
   * Contiene validaciones y controles para capturar información de la solicitud.
   * @type {FormGroup}
   * @memberof DatosDeLaSolicitudComponent
   */
  datosMercanciaFormGroup!: FormGroup;

  /**
   * Lista de catálogos para las aduanas de ingreso disponibles.
   * Contiene las opciones de aduanas donde puede ingresar la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  aduanaDeIngresoList: Catalogo[] = [];

  /**
   * Lista de catálogos para las oficinas de inspección disponibles.
   * Contiene las opciones de oficinas donde se realizará la inspección.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  oficinaInspeccionList: Catalogo[] = [];

  /**
   * Lista de catálogos para los puntos de inspección disponibles.
   * Contiene las ubicaciones específicas donde se realizará la inspección.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  puntoInspeccionList: Catalogo[] = [];

  /**
   * Lista de catálogos para los tipos de requisitos disponibles.
   * Contiene las clasificaciones de requisitos aplicables a la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  tipoRequisitoList: Catalogo[] = [];

  /**
   * Lista de catálogos para las fracciones arancelarias disponibles.
   * Contiene las clasificaciones arancelarias aplicables a la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  arancelariaList: Catalogo[] = [];

  /**
   * Lista de catálogos para los regímenes aduaneros disponibles.
   * Contiene los tipos de régimen bajo los cuales puede ingresar la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  regimenList: Catalogo[] = [];

  /**
   * Lista de catálogos para los códigos NICO disponibles.
   * Contiene los Números de Identificación Comercial aplicables.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  nicoList: Catalogo[] = [];

  /**
   * Lista de catálogos para las Unidades de Medida Comercial disponibles.
   * Contiene las unidades de medida para comercialización de la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  umcList: Catalogo[] = [];

  /**
   * Lista de catálogos para los usos permitidos de la mercancía.
   * Contiene las finalidades autorizadas para el uso de la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  usoList: Catalogo[] = [];

  /**
   * Lista de catálogos para los países de origen disponibles.
   * Contiene los países donde se origina o produce la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  paisDeOrigenList: Catalogo[] = [];

  /**
   * Lista de catálogos para los países de procedencia disponibles.
   * Contiene los países desde donde se envía directamente la mercancía.
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  paisDeProcedenciaList: Catalogo[] = [];

  /**
   * Indica si se debe mostrar el mensaje de error de la tabla.
   * Controla la visualización de errores relacionados con datos faltantes en la tabla.
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
  tableErrorMeassageDispaly: boolean = false;

  /**
   * @description Lista de establecimientos agropecuarios.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de establecimientos agropecuarios en el formulario.
   */
  agropecuariaList: Catalogo[] = [];


  /**
   * Datos del cuerpo de la tabla principal de solicitudes.
   * Contiene la información de todas las solicitudes registradas.
   * @type {SolicitudData[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  cuerpoTabla: SolicitudData[] = [

  ];

  /**
   * Datos de la mercancía almacenados en el store del componente.
   * Mantiene el estado actual de los datos del grupo de realización.
   * @type {RealizarGroup}
   * @memberof DatosDeLaSolicitudComponent
   */
  datosMercanciaStore: RealizarGroup = {} as RealizarGroup;

  /**
   * Datos específicos del cuerpo de la tabla de solicitudes.
   * Información detallada de las solicitudes mostradas en la tabla secundaria.
   * @type {SolicitudData[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  cuerpoTablaSolicitud: SolicitudData[] = [];

  /**
   * Indica si se debe mostrar la barra de desplazamiento en las tablas.
   * Controla la visualización del scroll horizontal/vertical.
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
  myScrollbarValue: boolean = true;

  /**
   * @description Subject utilizado para destruir las suscripciones y evitar fugas de memoria cuando el componente se destruye.
   * @type {Subject<void>}
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Controla la habilitación/deshabilitación de todos los campos del formulario.
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @description Formulario principal.
   * Este `FormGroup` contiene todos los controles del formulario.
   */
  forma!: FormGroup;

  /**
   * Indica si se debe mostrar la confirmación para eliminar datos de la tabla.
   * Controla la visualización del modal de confirmación de eliminación.
   * @type {boolean}
   * @public
   * @memberof DatosDeLaSolicitudComponent
   */
  public eliminarDatosTabla: boolean = false;

  /**
 * Indica si se debe mostrar la confirmación para eliminar datos de la tabla.
 * Controla la visualización del modal de confirmación de eliminación.
 * @type {boolean}
 * @public
 * @memberof DatosDeLaSolicitudComponent
 */
  public modalAlert: boolean = false;

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
   * @description Indica si se debe mostrar la tabla de solicitudes.
   * Esta propiedad se utiliza para controlar la visibilidad de la tabla de solicitudes en la interfaz de usuario.
   * @type {boolean}
   */
  public mostrarSolicitudTabla: boolean = true;

  /**
   * Constructor del componente DatosDeLaSolicitudComponent.
   * Inicializa los servicios necesarios y establece las suscripciones al estado del formulario y datos de mercancía.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaServices - Servicio para obtener datos de catálogos y gestionar el estado
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de solo lectura del formulario
   * @param {AcuiculturaStore} acuiculturaStore - Store para gestionar el estado global de la aplicación de acuicultura
   * @memberof DatosDeLaSolicitudComponent
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly importacionDeAcuiculturaServices: ImportacionDeAcuiculturaService,
    private consultaQuery: ConsultaioQuery,
    private readonly acuiculturaStore: AcuiculturaStore,
    public catalogosService: CatalogosService,
    public registroSolicitudService: RegistroSolicitudService,
    public acuiculturaApiService: ImportacionDeAcuiculturaService,
    public consultaSolicitudService: ConsultaSolicitudService,
    private solicitudService: SolicitudService,
  ) {


    this.obtenerDatosTablaSolicitud();
    this.getaduanaLista();
    this.getRegimenLista();
    this.catalogoOficinas();
    forkJoin([
    this.obtenerCatalogosUMC(),
    this.obtenerCatalogosUMT(),
    this.obtenerCatalogosUSO()
    ]).pipe(takeUntil(this.DESTROY_NOTIFIER$))
    .subscribe({
      next: ([umc, umt, uso]) => {
      this.importacionDeAcuiculturaServices.obtenerDatos().pipe(takeUntil(this.DESTROY_NOTIFIER$)).subscribe((datos) => {

      this.cuerpoTablaFila = datos.mercanciaGroup;

      this.datosMercanciaStore = datos.realizarGroup;

        const SELECTED = this.acuiculturaStore.getValue().selectedmercanciaGroupDatos;
        if (SELECTED == null || SELECTED === undefined) {
          this.listSelectedView = [];
        }

      if(this.datosMercanciaFormGroup) {
        if (datos.realizarGroup.aduanaIngreso !== '' && datos.realizarGroup.aduanaIngreso !== undefined) {
          this.catalogosService.obtieneCatalogoOficinasInspeccion(220203, datos.realizarGroup.aduanaIngreso)
            .pipe(
              takeUntil(this.destroyNotifier$))
            .subscribe(
              (data): void => {
                this.oficinaInspeccionList = data.datos ?? [];
                if (datos.realizarGroup.oficinaInspeccion !== '' && datos.realizarGroup.oficinaInspeccion !== undefined) {
                  this.catalogosService.obtieneCatalogoPuntoInspeccion(220203, datos.realizarGroup.oficinaInspeccion)
                    .pipe(
                      takeUntil(this.destroyNotifier$))
                    .subscribe((data): void => {
                      this.puntoInspeccionList = data.datos ?? [];
                    });
                }

              }
            );
        }

          this.datosMercanciaFormGroup.patchValue({
            realizarGroup: {
              ...this.datosMercanciaStore

            }
          });
      }
       this.inicializarEstadoFormulario();
    })
  
      }
      , error: (err) => {
        console.error('Error loading catalogs:', err);
      }
    });
   this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (seccionState.parameter === 'FLUJO_FUNCIONARIO_ATENDER_REQUERIMIENTO') {
            this.mostrarSolicitudTabla = false;
          }
        }
      )
    ).subscribe();
  }

  /**
   * Crea el grupo de formularios principal para los datos de la mercancía.
   * Inicializa la estructura del formulario reactivo con el grupo anidado realizarGroup.
   * 
   * @public
   * @method createFromGroup
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public createFromGroup(): void {
    this.datosMercanciaFormGroup = this.fb.group({
      realizarGroup: this.createRealizarGroup(),
    });
    if (this.esFormularioSoloLectura && this.datosMercanciaFormGroup !== null) {
      this.datosMercanciaFormGroup?.disable({emitEvent: false});
    }
  }

  /**
   * Crea el grupo de formularios específico para los datos de realización.
   * Define todos los campos necesarios con sus validadores correspondientes.
   * 
   * @public
   * @method createRealizarGroup
   * @memberof DatosDeLaSolicitudComponent
   * @returns {FormGroup} El grupo de formularios configurado para los datos de realización
   */
  public createRealizarGroup(): FormGroup {
    return this.fb.group({
      aduanaIngreso: [ '', Validators.required],
      oficinaInspeccion: [ '', Validators.required],
      puntoInspeccion: [ '', Validators.required],
      numeroGuia: [ ''],
      regimen: [ '', Validators.required],
    });
  }
 

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa el formulario principal y obtiene todos los catálogos necesarios para el funcionamiento del componente.
   * 
   * @public
   * @method ngOnInit
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  async ngOnInit(): Promise<void> {
      await this.createFromGroup();
      if (this.ocultarForm) {
        this.obtenerDataSolicitud();
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
    this.datosMercanciaFormGroup.patchValue({
      aduanaDeIngreso: datos.cve_aduana || '',
      oficinaDeInspeccion: datos.oficina_inspeccion_sanidad_agropecuaria || '',
      puntoDeInspeccion: datos.punto_inspeccion || '',
      regimen: datos.clave_regimen || '',
      numeroDeGuia: datos.numero_autorizacion || '',
    });
    const GUARDAR_VALORES: RealizarGroup = {
      aduanaIngreso: datos.cve_aduana,
      numeroGuia: datos.numero_autorizacion,
      oficinaInspeccion: datos.oficina_inspeccion_sanidad_agropecuaria,
      puntoInspeccion: datos.punto_inspeccion,
      regimen: datos.clave_regimen
    };
    (this.acuiculturaApiService.actualizarSoloRealizarGroup as (value: RealizarGroup) => void)(GUARDAR_VALORES);

    const DETALLE_MERCANCIA =
      (datos as ConsultaSolicitudResponse) || [];
    if (DETALLE_MERCANCIA.mercancia.length > 0) {
      const FILAS_SOLICITUD: FilaSolicitud[] = [];
      DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
        const FILAS: FilaSolicitud = {
          certificadoInternacional: String(mercancia.numero_certificado) || '',
          especie: mercancia.descripcion_especie || '',
          faseDeDesarrollo: mercancia.fase_desarrollo,
          medidadetarifa: '',
          numeroCertificado: mercancia.numero_certificado,
          id: mercancia.id_mercancia_gob || Math.floor(Math.random() * 1000000),
          noPartida: mercancia.numero_partida.toString(),
          descripcionTipoRequisito:
            mercancia.descripcion_tipo_requisito || '',
          tipoRequisito: mercancia.tipo_requisito.toString() || '',
          requisito: mercancia.requisitos || '',
          numeroCertificadoInternacional:
            String(mercancia.numero_certificado) || '',
          fraccionArancelaria:
            mercancia.cve_fraccion || '',
          descripcionFraccion:
            mercancia.descripcion_fracción_arancelaria || '',
          idDescripcionFraccion: mercancia.id_fraccion_gubernamental || 0,
          nico: mercancia.clave_nico || '',
          descripcionNico: mercancia.descripcion_nico || '',
          descripcionUso: mercancia.descripcion_uso || '',
          umt: mercancia.clave_unidad_comercial || '',
          cantidadUMT: mercancia.cantidad_umt.toString() || '0',
          umc: mercancia.clave_unidad_medida || '',
          descripcionUMT: mercancia.descripcion_umt || '',
          descripcionUMC: mercancia.descripcion_umc || '',
          cantidadUMC: mercancia.cantidad_umc.toString() || '0',
          uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
          paisDeOrigen: mercancia.clave_paises_origen || '',
          paisDeProcedencia: mercancia.clave_paises_procedencia || '',
          descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
          descripcionPaisDeProcedencia: mercancia.nombre_pais_procedencia || '',
          certificadoInternacionalElectronico: String(mercancia.numero_certificado) || '',
          tipoDeProducto: String(mercancia.id_tipo_producto_tipo_tramite) || '',
          numeroDeLote: mercancia.numero_lote || '',
          descripcion: mercancia.descripcion_mercancia || ''
        };
        FILAS_SOLICITUD.push(FILAS);
      });

      this.acuiculturaStore.actualizarMercanciaGroup(FILAS_SOLICITUD);
    }
  }

  /**
   * Obtiene la lista para el select de régimen.
   * @method obtenerRegimenList
   */
  obtenerRegimenList(clave_regimen: string = ''): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService
        .obtieneCatalogoRegimenesVigentes(220203)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          this.regimenList = clave_regimen
            ? (data.datos ?? []).filter((item) => item.clave === clave_regimen)
            : data.datos ?? [];
          resolve();
        });
    })
  }

  /**
  * bandera para indicar que el formulario fue tocado
  */
  markTouched: boolean = false;

  /**
   * Obtiene los datos del catálogo de Unidades de Medida Comercial (UMC).
   * Carga las opciones disponibles para UMC y fracciones arancelarias.
   * 
   * @public
   * @method obtenerCatalogosUMC
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
public obtenerCatalogosUMC(): Observable<Catalogo[]> {
  return this.importacionDeAcuiculturaServices.obtenerDetallesDelCatalogo('aduana_de_ingreso.json').pipe(
    map((data) => {
      this.umcList = data.data as Catalogo[];
      this.arancelariaList = data.data as Catalogo[];
      return data.data as Catalogo[];
    }),
    catchError((err) => {
      console.error('Error loading UMC catalog:', err);
      return of([]); // fallback to empty array
    })
  );
}


  /**
   * Obtiene los datos del catálogo de Unidades de Medida de Tarifa (UMT).
   * Carga las opciones disponibles para regímenes, códigos NICO y puntos de inspección.
   * 
   * @public
   * @method obtenerCatalogosUMT
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
 public obtenerCatalogosUMT(): Observable<Catalogo[]> {
  return this.importacionDeAcuiculturaServices.obtenerDetallesDelCatalogo('empresa.json').pipe(
    map((data) => {
      this.regimenList = data.data as Catalogo[];
      this.nicoList = data.data as Catalogo[];
      return data.data as Catalogo[];
    }),
    catchError((err) => {
      return of([]);
    })
  );
}


  /**
   * Obtiene los datos del catálogo de usos y países.
   * Carga las opciones disponibles para usos, países de origen y países de procedencia.
   * 
   * @public
   * @method obtenerCatalogosUSO
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public obtenerCatalogosUSO(): Observable<Catalogo[]> {
    return this.importacionDeAcuiculturaServices.obtenerDetallesDelCatalogo('oficina_de_inspeccion.json').pipe(
      map((data) => {
        this.usoList = data.data as Catalogo[];
        this.paisDeOrigenList = data.data as Catalogo[];
        this.paisDeProcedenciaList = data.data as Catalogo[];
        return data.data as Catalogo[];
      }),
      catchError((err) => {
        return of([]); // fallback to empty array on error
      })
    );
  }

  /**
   * @description Obtiene la lista de aduanas desde un archivo JSON.
   * @method getaduanaLista
   * @returns {void}
   */
  getaduanaLista(): void {
    this.catalogosService.obtieneCatalogoAduana(220203) 
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
      (data): void => {
        this.aduanaDeIngresoList = data.datos ?? [];
      }
    );

  }

    /**
   * Obtiene la lista para el select de oficina de inspección de sanidad agropecuaria desde el selector.
   * @method catalogoOficinas
   */
  catalogoOficinas(_forma?: FormGroup): void {
    const VALOR = this.datosMercanciaFormGroup?.get('realizarGroup')?.value || {};
    this.obtenerSanidadoficinaInspeccionList(VALOR.aduanaIngreso);
  }

  /**
   * Obtiene la lista para el select de puntos de inspeccion desde el selector.
   * @method obtenerPuntoInspeccion
   */
  obtenerPuntoInspeccion(_forma?: FormGroup): void {
    const VALOR = this.datosMercanciaFormGroup?.get('realizarGroup')?.value || {};
    this.obtenerPuntoInspeccionList(VALOR.oficinaInspeccion);
  }

    /**
   * Obtiene la lista para el select de régimen.
   * @method getRegimenLista
   */
  getRegimenLista(clave_regimen:string=''): void {

    this.catalogosService.obtieneCatalogoRegimenesVigentes(220203).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.regimenList = clave_regimen
        ? (data.datos ?? []).filter((item) => item.clave === clave_regimen)
        : data.datos ?? [];
    });
  }

    /**
   * Obtiene la lista para el select de punto de inspección.
   * @method obtenerPuntoInspeccionList
   */
  async obtenerPuntoInspeccionList(valor: string): Promise<void> {
    await this.catalogosService.obtieneCatalogoPuntoInspeccion(220203, valor).pipe(takeUntil(this.destroyNotifier$)).subscribe((data): void => {
      this.puntoInspeccionList = data.datos ?? [];
    });
  }

  /**
   * Obtiene la lista para el select de sanidad agropecuaria.
   * @method obtenerSanidadoficinaInspeccionList
   */
  async obtenerSanidadoficinaInspeccionList(cveAduana: string): Promise<void> {
    this.oficinaInspeccionList = [];
    if(cveAduana && cveAduana !== ''){
      await this.catalogosService.obtieneCatalogoOficinasInspeccion(220203, cveAduana)
        .pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe(
        (data): void => {
          this.oficinaInspeccionList = data.datos ?? [];
        }
      );
    }

  }

  /**
   * Alterna la visualización de la sección colapsable del formulario.
   * Cambia el estado de expansión/contracción de las secciones del UI.
   * 
   * @public
   * @method mostrar_colapsable
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public mostrar_colapsable(): void {
    if(!this.esFormularioSoloLectura){
  this.colapsable = !this.colapsable;
    }
    else{
   this.colapsable = false;
    }
  }

  /**
   * Guarda los valores del formulario en el store de la aplicación.
   * Actualiza el estado global con los datos del grupo de realización.
   * 
   * @public
   * @method setValoresStore
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public setValoresStore(): void {
    const VALOR = this.datosMercanciaFormGroup.getRawValue();
    (this.importacionDeAcuiculturaServices.actualizarSoloRealizarGroup as (value: RealizarGroup) => void)(
      VALOR.realizarGroup as RealizarGroup
    );
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Habilita o deshabilita todos los controles del formulario basado en el estado actual.
   * 
   * @public
   * @method inicializarEstadoFormulario
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.datosMercanciaFormGroup.disable();
    }
    else {
      this.datosMercanciaFormGroup.enable();
    }
  }
  /**
   * Abre el modal para agregar una nueva fila de mercancía.
   * Utiliza el componente modal para mostrar el formulario de mercancía-solicitud.
   * 
   * @public
   * @method agregarFila
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  agregarFila(): void {
    this.modalRef.abrir(MercanciaSolicitudComponent);
  }

  /**
   * Selecciona una fila de la tabla de mercancías y actualiza el estado del store.
   * Este método se ejecuta cuando el usuario selecciona elementos en la tabla principal.
   * Actualiza el estado global con los datos de la fila seleccionada para operaciones posteriores.
   * 
   * @public
   * @method seleccionTabla
   * @param {FilaSolicitud[]} event - Array de filas seleccionadas de la tabla
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  seleccionTabla(event: FilaSolicitud[]): void {
    this.listSelectedView = event;
    this.acuiculturaStore.update(
      (state) => ({
        ...state,
        selectedmercanciaGroupDatos: event[0] || {}
      })
    )
  }
  /**
   * Inicia el proceso de eliminación de una fila de mercancía.
   * Muestra una notificación de confirmación antes de proceder con la eliminación.
   * 
   * @public
   * @method eliminarFila
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  eliminarFila(): void {
    if (this.listSelectedView.length == 1) {
      this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Eliminar datos de la tabla',
      mensaje: 'Está seguro que desea eliminar estos datos?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.eliminarDatosTabla = true;
    }
    else { this.modificarMercanciaNotification() }
  }
  /**
   * Ejecuta la eliminación de datos de la tabla basado en la confirmación del usuario.
   * Si el usuario confirma, elimina el elemento seleccionado de la tabla de mercancías y actualiza el store.
   * 
   * @public
   * @method eliminarPedimentoDatos
   * @param {boolean} borrar - Indica si se debe proceder con la eliminación
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  eliminarPedimentoDatos(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatosTabla = false;
      const VALOR = this.acuiculturaStore.getValue().mercanciaGroup;
      if (VALOR.length === 0) {
        return;
      }
      const SELECTED = this.acuiculturaStore.getValue().selectedmercanciaGroupDatos;
      const FILTERED_VALOR = VALOR.filter(
        (item) => item !== SELECTED
      ).map((item, index) => ({
        ...item,
        noPartida: String(index + 1)
      }));

      this.acuiculturaStore.update(
        (state) => ({
          ...state,
          mercanciaGroup: FILTERED_VALOR
        })
      );
      this.acuiculturaStore.update((state) => ({
        ...state,
        selectedmercanciaGroupDatos: {} as FilaSolicitud
      }))
      this.listSelectedView = [];
    }
    else {
      this.eliminarDatosTabla = false;
    }
  }
  /**
   * Abre el modal para modificar la fila seleccionada de mercancía.
   * Solo procede si hay al menos una fila seleccionada en la tabla.
   * 
   * @public
   * @method modificarFila
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  modificarFila(): void {
    if (this.listSelectedView.length == 1) {
      this.modalRef.abrir(MercanciaSolicitudComponent);
    }
    else { this.modificarMercanciaNotification() }
  }

  /**
   * Valida el estado actual del formulario y la tabla de mercancías.
   * Verifica que el formulario sea válido y que existan datos en la tabla.
   * 
   * @public
   * @method validarFormulario
   * @memberof DatosDeLaSolicitudComponent
   * @returns {boolean} True si tanto el formulario como la tabla son válidos, false en caso contrario
   */
  public validarFormulario(): boolean {
    // Marcar los select customizados
    this.markTouched = true;
    this.tableErrorMeassageDispaly = this.cuerpoTablaFila.length === 0 ? true : false;
    if (this.datosMercanciaFormGroup.invalid) {
      this.datosMercanciaFormGroup.markAllAsTouched();
      return false;
    }
    else if (this.tableErrorMeassageDispaly) {
      return false;
    }

    return true;
  }

  /**
   * Método del ciclo de vida OnDestroy de Angular.
   * Ejecuta la limpieza de recursos, detiene las suscripciones activas y libera memoria.
   * Previene memory leaks al destruir el componente.
   * 
   * @public
   * @method ngOnDestroy
   * @memberof DatosDeLaSolicitudComponent
   * @returns {void}
   */
  public ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }

  // TODO: recibir el parametro de rfc de la sesion
  public obtenerDatosTablaSolicitud(): void {
    this.registroSolicitudService.obtieneDatosSolicitud(220203, 'AAL0409235E6')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
    .subscribe((data)=>{
      this.cuerpoTabla = data.datos ?? [];
    })
  }

  /**
   * Maneja la selección de una fila en la tabla de solicitudes.
   *
   * Cuando se selecciona una fila, este método actualiza los valores del formulario (forma)
   * con datos predefinidos relacionados con la solicitud seleccionada, usando los IDs correctos de los catálogos.
   *
   * @param event - Objeto de tipo SolicitudFilaTabla que representa la fila seleccionada en la tabla.
   */
  seleccionFila(event: SolicitudData): void {
    if (event && event.id_solicitud) {
      // TODO: descomentar este codigo cuando los servicios esten bien y borrar el de abajo que tiene hardcode
      // this.obtenerPrellenadoMovilizacionNacional(event.id_solicitud);
      // this.obtenerPrellenadoTercerosRelacionados(event.id_solicitud);
      // this.obtenerPrellenadoPagoDerechos(event.id_solicitud);
      this.obtenerPrellenadoMovilizacionNacional('202738175');
      this.obtenerPrellenadoTercerosRelacionados('202738175');
      this.obtenerPrellenadoPagoDerechos('202738175');
      this.catalogosService
        .obtenSolicitudPrellenado(220203, true, '202738175' ?? '')
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: async (datos) => {
            if (datos?.datos) {
              await this.obtenerSanidadoficinaInspeccionList(
                datos.datos.cve_aduana || ''
              );
              await this.obtenerPuntoInspeccionList(
                datos.datos.oficina_inspeccion_sanidad_agropecuaria || ''
              );
              //Regimen
              this.getRegimenLista(datos.datos?.clave_regimen || '');
              this.datosMercanciaFormGroup.patchValue({
                aduanaDeIngreso: datos.datos.cve_aduana || '',
                tipoDeMercancia:
                  datos.datos.mercancia[0].tipo_mercancia === 'TICERM.SOA'
                    ? 'no'
                    : 'yes', //'yes' para animales vivos, 'no' para subproductos
                oficinaDeInspeccion: datos.datos.oficina_inspeccion_sanidad_agropecuaria || '',
                puntoDeInspeccion: datos.datos.punto_inspeccion || '',
                regimen: datos.datos.clave_regimen || '',
                numeroDeGuia: datos.datos.numero_autorizacion || '',
                numeroDeCarro: datos.datos.numero_carro_ferrocarril || '',
              });
              const GUARDAR_VALORES: RealizarGroup = {
                aduanaIngreso: datos.datos.cve_aduana,
                numeroGuia: datos.datos.numero_autorizacion,
                oficinaInspeccion: datos.datos.oficina_inspeccion_sanidad_agropecuaria,
                puntoInspeccion: datos.datos.punto_inspeccion,
                regimen: datos.datos.clave_regimen
              };
              (this.acuiculturaApiService.actualizarSoloRealizarGroup as (value: RealizarGroup) => void)(GUARDAR_VALORES);
            } else {
              this.datosMercanciaFormGroup.reset();
            }
            console.warn('Datos de la solicitud prellenada:', datos);
            const DETALLE_MERCANCIA =
              (datos?.datos as PrellenadoSolicitud) || [];
            if (DETALLE_MERCANCIA.mercancia.length > 0) {
              const FILAS_SOLICITUD: FilaSolicitud[] = [];
              DETALLE_MERCANCIA.mercancia.forEach((mercancia) => {
                const FILAS: FilaSolicitud = {
                  certificadoInternacional: String(mercancia.numero_certificado) || '',
                  especie: mercancia.descripcion_especie,
                  faseDeDesarrollo: mercancia.fase_desarrollo,
                  medidadetarifa: '',
                  numeroCertificado: mercancia.numero_certificado.toString(),
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
                  idDescripcionFraccion: mercancia.idDescripcionFraccion || 0, 
                  nico: mercancia.clave_nico || '',
                  descripcionNico: mercancia.descripcion_nico || '',
                  descripcionUso: mercancia.descripcion_uso || '',
                  umt: mercancia.clave_unidad_comercial || '',
                  cantidadUMT: mercancia.cantidad_umt.toString() || '0',
                  umc: mercancia.clave_unidad_medida || '',
                  descripcionUMT: mercancia.descripcion_umt || '',
                  descripcionUMC: mercancia.descripcion_umc || '',
                  cantidadUMC: mercancia.cantidad_umc.toString() || '0',
                  uso: String(mercancia.id_uso_mercancia_tipo_tramite) || '',
                  paisDeOrigen: mercancia.clave_paises_origen || '',
                  paisDeProcedencia: mercancia.clave_paises_procedencia || '',
                  descripcionPaisDeOrigen: mercancia.nombre_pais_origen || '',
                  descripcionPaisDeProcedencia: mercancia.nombre_pais_procedencia || '',
                  certificadoInternacionalElectronico: String(mercancia.numero_certificado) || '',
                  tipoDeProducto: String(mercancia.id_tipo_producto_tipo_tramite) || '',
                  numeroDeLote: mercancia.numero_lote || '',                  
                  descripcion: mercancia.descripcion_mercancia || ''
                };
                FILAS_SOLICITUD.push(FILAS);
              });

              this.acuiculturaStore.actualizarMercanciaGroup(FILAS_SOLICITUD);
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
   * Obtiene la lista para el select de sanidad agropecuaria.
   * @method obtenerSanidadAgropecuariaList
   */
  async obtenerSanidadAgropecuariaList(cveAduana: string): Promise<void> {
    this.agropecuariaList = [];
    if (cveAduana && cveAduana !== '') {
      await this.catalogosService
        .obtieneCatalogoOficinasInspeccion(220202, cveAduana)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data): void => {
          this.agropecuariaList = data.datos ?? [];
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
    // this.catalogosService.obtenSolicitudPrellenadoMovilizacionNacional(220203, true, idSolicitud ?? '')
    this.catalogosService
      .obtenSolicitudPrellenadoMovilizacionNacional(
        220203,
        true,
        '202738175' ?? ''
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (datos) => {
          if (datos.datos) {
            const GUARDAR_VALORES: FormularioMovilizacion = {
              medioDeTransporte: datos.datos.ide_medio_transporte,
              puntoVerificacion: datos.datos.id_punto_verificacion,
              nombreEmpresaTransportista: datos.datos.razon_social,
              identificacionTransporte: datos.datos.identificacion_transporte,
            };
            (
              this.importacionDeAcuiculturaServices.actualizarFormularioMovilizacion as (
                value: FormularioMovilizacion
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
    // this.catalogosService.obtenSolicitudPrellenadoTercerosRelacionados(220203, true, idSolicitud ?? '')
    this.catalogosService
      .obtenSolicitudPrellenadoTercerosRelacionados(
        220203,
        true,
        '202738175' ?? ''
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
                  tipoMercancia: item.persona_moral ? 'yes' : 'no',
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
                this.importacionDeAcuiculturaServices.updateTercerosRelacionado as (
                  value: TercerosrelacionadosdestinoTable[]
                ) => void
              )(ARRAY_TERCEROS_DESTINO);
            });
            const ARRAY_TERCEROS_EXPORTADOR: DestinatarioForm[] = [];
            datos.datos.terceros_exportador.forEach((item) => {
              const GUARDAR_VALORES_TERCEROS_EXPORTADOR: DestinatarioForm =
                {
                  tipoMercancia: item.persona_moral ? 'yes' : 'no',
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
                this.importacionDeAcuiculturaServices.updateDatosForma as (
                  value: DestinatarioForm[]
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
      .obtenSolicitudPrellenadoPagoDerechos(220203, true, '202738175' ?? '')
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
              this.importacionDeAcuiculturaServices.actualizarPagoDeDerechos as (
                value: PagoDeDerechos
              ) => void
            )(GUARDAR_VALORES);
          }
        },
      });
  }

  /**
  * @description Genera una notificación de error para la operación de modificar mercancía.
  * Esta función valida el estado actual de la selección de datos en la tabla y muestra un mensaje
  * @method modificarMercanciaNotification
  * @returns {void} No retorna ningún valor, pero actualiza la propiedad `nuevaNotificacion`
  */
  modificarMercanciaNotification(): void {

    const SELECTED_DATA = this.acuiculturaStore.getValue().selectedmercanciaGroupDatos;
    const TABLE_DATA = this.acuiculturaStore.getValue().mercanciaGroup;

    let mensaje = 'Selecciona sólo un registro para modificar.';

    // Si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    // Si no hay registros seleccionados pero hay registros en la tabla
    else if (SELECTED_DATA == null || SELECTED_DATA === undefined) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    else if (this.listSelectedView.length > 1) {
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
    this.modalAlert = true;
  }
  /**
   * evento cuando se cierra el modal de alerta
   *
      */
  cerrarModal(): void {
    this.modalAlert = false
  }

}

