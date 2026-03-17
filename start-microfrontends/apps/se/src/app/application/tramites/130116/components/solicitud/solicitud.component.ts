import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  ConsultaioQuery,
  Notificacion,
  REGEX_NUMERO_DECIMAL_ENTERO,
  REGEX_SOLO_PERMITIDOS,
  REG_X,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130116/partidas-de-la.json';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';

import {
  ID_PROCEDIMIENTO,
  OPINIONES_SOLICITUD,
  PRODUCTO_OPCION,
} from '../../constants/solicitud-importacion-ambulancia.enum';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

import {
  Tramite130116State,
  Tramite130116Store,
} from '../../../../estados/tramites/tramites130116.store';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { SolicitudImportacionAmbulanciaService } from '../../services/solicitud-importacion-ambulancia.service';
import { Tramite130116Query } from '../../../../estados/queries/tramite130116.query';

/**
 * jest.spyOnComponente para gestionar la solicitud de mercancías.
 * Contiene formularios reactivos y opciones configurables relacionadas con el trámite.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {

  /**
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent)
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;
  
  /**
   * form
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;
  /**
   * jest.spyOnFormulario reactivo para los datos del trámite.
   */
  formDelTramite!: FormGroup;

  /**
   * jest.spyOnFormulario reactivo para los detalles de la mercancía.
   */
  mercanciaForm!: FormGroup;
  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  formForTotalCount!: FormGroup;
  /**
   * Formulario reactivo para la selección de países.
   */
  paisForm!: FormGroup;

  /**
   * Formulario reactivo para la representación.
   */
  frmRepresentacionForm!: FormGroup;

  /**
   * Formulario reactivo para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * tableHeaderData
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] =
    PARTIDASDELAMERCANCIA_TABLA;

  /**
   * tableBodyData
   * Datos que se mostrarán en el cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * mostrarTabla
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  mostrarTabla = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error.
   */
  mostrarErrores = true;

  /**
   * CHECKBOX
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;

  /**
   * getEstablecimientoTableData
   * Datos de configuración de la tabla obtenidos de un archivo JSON.
   */
  public getEstablecimientoTableData = PartidasdelaTable;

  /**
   * filaSeleccionada
   * Fila seleccionada en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   * jest.spyOnOpciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = PRODUCTO_OPCION;

  /**
   * jest.spyOnCatálogo con valores de fracción arancelaria.
   */

  fraccionCatalogo: Catalogo[] = [];

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * jest.spyOnCatálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];

  /**
   * jest.spyOnCampos de entrada configurables para detalles adicionales.
   */
  datosInputFields = [
    {
      label: 'Régimen al que se destinará la mercancía',
      placeholder: 'Seleccione un documento',
      required: true,
      controlName: 'regimen',
    },
    {
      label: 'Clasificación del régimen',
      placeholder: 'Seleccione un documento',
      required: true,
      controlName: 'clasificacion',
    },
  ];

  /**
   * jest.spyOnMatriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[], []];

  /**
   * jest.spyOnOpciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = OPINIONES_SOLICITUD;

  /**
   * jest.spyOnSujeto para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * jest.spyOnArreglo que almacena un catálogo de elementosDeBloque.
   */
  elementosDeBloque: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que contiene un catálogo de países organizados por bloque.
   */
  paisesPorBloque: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que guarda un catálogo de entidades federativas.
   */
  entidadFederativa: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que almacena un catálogo de representaciones federales.
   */
  representacionFederal: Catalogo[] = [];

  /**
   * jest.spyOnArreglo de cadenas que representa las opciones seleccionables de rangos de días.
   */
  selectRangoDias: string[] = [];

  /**
   * jest.spyOnObjeto o constante que contiene los textos utilizados en la aplicación.
   */
  TEXTOS = TEXTOS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas.
   */
  isInvalidaPartidas: boolean = false;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130116State;

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130116Store: Tramite130116Store,
    private tramite130116Query: Tramite130116Query,
    private solicitudImportacionAmbulanciaService: SolicitudImportacionAmbulanciaService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormularios();
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
   * jest.spyOnCiclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.configuracionFormularioSuscripciones();
    this.getRegimenCatalogo();
    this.getFraccionCatalogo();
    this.getEntidadesFederativasCatalogo();
    this.getBloque();
    this.formularioTotalCount();

    this.tramite130116Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla;
      });

    this.tramite130116Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.seccionState = data;
        this.tableBodyData = data.tableBodyData || [];
      });
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormularios();
    }
  }

  /**
   * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130111.
   * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
   * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  suscribirseAEstadoDeSolicitud(): void {
    this.tramite130116Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite130116State) => {
        this.seccionState = data;
      });
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormularios();
  }

  /**
   * Inicializa los formularios reactivos del componente.
   * Configura los formularios principales para capturar datos de la solicitud, mercancía y otros detalles.
   */
  inicializarFormularios(): void {
    this.suscribirseAEstadoDeSolicitud();
    this.formDelTramite = this.fb.group({
      solicitud: [this.seccionState?.defaultSelect, Validators.required],
      regimen: [this.seccionState?.regimen, Validators.required],
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    this.mercanciaForm = this.fb.group({
      producto: [this.seccionState?.defaultProducto],
      descripcion: [
        this.seccionState?.descripcion,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          SolicitudComponent.validarSinCaracterAnguloDerecho,
        ],
      ],
      fraccion: [this.seccionState?.fraccion, Validators.required],
      cantidad: [
        this.seccionState?.cantidad,
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.min(1),
        ],
      ],

      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD,
        [
          Validators.required,
          Validators.pattern(REG_X.DECIMALES_DOS_LUGARES),
          Validators.min(0.01),
        ],
      ],

      unidadMedida: [this.seccionState?.unidadMedida, Validators.required],
    });
    this.partidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.descripcionPartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
          Validators.maxLength(20),
        ],
      ],
    });

    this.paisForm = this.fb.group({
      bloque: [this.seccionState?.bloque],
      pais: [this.seccionState?.fechasSeleccionadas, Validators.required],
      usoEspecifico: [this.seccionState?.usoEspecifico, [Validators.required, SolicitudComponent.validarSinCaracterAnguloDerecho]],
      justificacionImportacionExportacion: [
        this.seccionState?.justificacionImportacionExportacion,
        [Validators.required, SolicitudComponent.validarSinCaracterAnguloDerecho],
      ],
      observaciones: [this.seccionState?.observaciones, Validators.maxLength(512)],
    });
    this.frmRepresentacionForm = this.fb.group({
      entidad: [this.seccionState?.entidad, Validators.required],
      representacion: [this.seccionState?.representacion, Validators.required],
    });

    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.descripcionPartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  /**
   *  Actualiza la partida modificada en la tabla de datos.
   * @param evento
   */
  partidaModificada(evento: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map((item) => {
      if (item.id === evento.id) {
        return {
          ...item,
          cantidad: evento.cantidad,
          totalUSD: evento.totalUSD,
          precioUnitarioUSD: evento.precioUnitarioUSD,
          descripcion: evento.descripcion,
        };
      }
      return item;
    });
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (acc, item) => acc + parseInt(item.cantidad, 10),
      0
    );
    const TOTAL_USD = this.tableBodyData.reduce(
      (acc, item) => acc + parseFloat(item.totalUSD),
      0
    );
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });

    this.tramite130116Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
    });
  }

  /**
   * Elimina las partidas seleccionadas de la tabla de datos.
   * Filtra los elementos de la tabla según los IDs proporcionados en el evento,
   * @param {string[]} evento - Arreglo de IDs (como strings) de las partidas que deben ser eliminadas
   * @returns {void} No retorna ningún valor, pero actualiza la tabla de datos, 
   */
  partidasEliminadas(evento: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(
      (item) => !evento.includes(String(item.id))
    );
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (acc, item) => acc + parseInt(item.cantidad, 10),
      0
    );
    const TOTAL_USD = this.tableBodyData.reduce(
      (acc, item) => acc + parseFloat(item.totalUSD),
      0
    );
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });
    this.tramite130116Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
    });
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   * @returns {void}
   */
  getRegimenCatalogo(): void {
    this.solicitudImportacionAmbulanciaService
      .getRegimenCatalogo(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.catalogosArray[0] = data as Catalogo[];
      });
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   * @returns {void}
   */
  getClasificacionRegimenCatalogo(VALOR: string): void {
    this.solicitudImportacionAmbulanciaService
      .getClasificacionRegimenCatalogo(VALOR)
      .subscribe((data) => {
        this.catalogosArray[1] = data as Catalogo[];
      });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.solicitudImportacionAmbulanciaService
      .getFraccionCatalogoService(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.fraccionCatalogo = data?.map((item) => ({
          ...item,
          descripcion: `${item.clave} - ${item.descripcion}`,
        }));
      });
  }

  /**
   * Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param _FRACCION_ID
   */
  getUnidadesMedidaTarifaria(_FRACCION_ID: string): void {
    this.solicitudImportacionAmbulanciaService
      .getUMTService(this.idProcedimiento.toString(), _FRACCION_ID)
      .subscribe((data) => {
        this.unidadCatalogo = data as Catalogo[];
        if (this.unidadCatalogo.length > 0) {
          this.mercanciaForm
            .get('unidadMedida')
            ?.setValue(this.unidadCatalogo[0]?.clave || '');
          this.tramite130116Store.actualizarEstado({
            unidadMedida: this.unidadCatalogo[0]?.clave || '',
          });
        }
      });
  }

  /**
   * Obtiene los bloques desde el servicio y los asigna a la propiedad `elementosDeBloque`.
   * @returns {void}
   */
  getBloque(): void {
    this.solicitudImportacionAmbulanciaService
      .getBloqueService(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.elementosDeBloque = data as Catalogo[];
      });
  }

  /**
   *  Obtiene los países por bloque desde el servicio y los asigna a la propiedad `paisesPorBloque`.
   * @param ID
   */
  getPaisesPorBloque(ID: string): void {
    this.solicitudImportacionAmbulanciaService
      .getPaisesPorBloqueService(this.idProcedimiento.toString(), ID)
      .subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
  }

  /**
   * Maneja la selección de todos los países.
   * @param evento
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.solicitudImportacionAmbulanciaService
        .getTodosPaisesSeleccionados(this.idProcedimiento.toString())
        .subscribe((data) => {
          this.paisesPorBloque = data as Catalogo[];
        });
    }
  }

  /**
   * Maneja la selección de fechas y actualiza el estado global.
   * @param evento
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130116Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio y lo asigna a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  getEntidadesFederativasCatalogo(): void {
    this.solicitudImportacionAmbulanciaService
      .getEntidadesFederativasCatalogo(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.entidadFederativa = data as Catalogo[];
      });
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.solicitudImportacionAmbulanciaService
      .getRepresentacionFederalCatalogo(cveEntidad)
      .subscribe((data) => {
        this.representacionFederal = data as Catalogo[];
      });
  }

  /**
   * Valida todos los formularios y la selección de filas.
   * @returns {boolean} Indica si todos los formularios y la selección son válidos.
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (this.formDelTramite.invalid) {
      this.formDelTramite.markAllAsTouched();
      isValid = false;
    }
    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
      isValid = false;
    }
    if (this.tableBodyData.length === 0) {
      this.isInvalidaPartidas = true;
      isValid = false;
    } else if (this.tableBodyData.length > 0) {
      this.isInvalidaPartidas = false;
    }
    if (this.paisForm.invalid) {
      this.paisForm.markAllAsTouched();
      isValid = false;
    }
    if (this.frmRepresentacionForm.invalid) {
      this.frmRepresentacionForm.markAllAsTouched();
      isValid = false;
    }
    return isValid;
  }

  /**
   * Configura las suscripciones para sincronizar los formularios con el estado global.
   * Actualiza los valores de los formularios reactivos en función de los cambios en el estado.
   */
  configuracionFormularioSuscripciones(): void {
    this.tramite130116Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.seccionState = seccionState;

          this.formDelTramite.patchValue({
            solicitud: seccionState.defaultSelect,
            regimen: seccionState.regimen,
            clasificacion: seccionState.clasificacion,
          });

          this.mercanciaForm.patchValue({
            producto: seccionState.producto,
            descripcion: seccionState.descripcion,
            fraccion: seccionState.fraccion,
            cantidad: seccionState.cantidad,
            valorFacturaUSD: seccionState.valorFacturaUSD,
            unidadMedida: seccionState.unidadMedida,
          });

          this.paisForm.patchValue({
            bloque: seccionState.bloque,
            pais: seccionState.fechasSeleccionadas,
            usoEspecifico: seccionState.usoEspecifico,
            justificacionImportacionExportacion:
              seccionState.justificacionImportacionExportacion,
            observaciones: seccionState.observaciones,
          });

          this.frmRepresentacionForm.patchValue({
            entidad: seccionState.entidad,
            representacion: seccionState.representacion,
          });
        })
      )

      .subscribe();
  }

  /**
   * Crea el formulario reactivo para capturar los totales de las partidas.
   * Este formulario incluye campos deshabilitados para mostrar los valores calculados.
   */
  formularioTotalCount(): void {
    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: '', disabled: true }],
      valorTotalUSD: [{ value: '', disabled: true }],
    });
  }

  /**
   * Maneja la selección de filas en la tabla dinámica.
   * Actualiza el estado global con las filas seleccionadas.
   */
  manejarlaFilaSeleccionada(
    filasSeleccionadas: PartidasDeLaMercanciaModelo[]
  ): void {
    this.filaSeleccionada = filasSeleccionadas.length ? filasSeleccionadas : [];
    if (this.filaSeleccionada) {
      this.tramite130116Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   *  Modifica los valores del formulario de partidas de la mercancía según el evento recibido.
   * @param evento
   */
  modificarPartidaSeleccionada(evento: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: evento.cantidad,
      valorPartidaUSDPartidasDeLaMercancia: evento.totalUSD,
      descripcionPartidasDeLaMercancia: evento.descripcion,
    });
  }

  /**
   * Valida los formularios de mercancía y partidas de la mercancía antes de permitir la carga de un archivo.
   */
  validarYCargarArchivo(): void {
    ['cantidad', 'valorFacturaUSD', 'fraccion'].forEach((controlName) => {
      const CONTROL = this.mercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.mercanciaForm.get('cantidad')?.invalid ||
      this.mercanciaForm.get('valorFacturaUSD')?.invalid ||
      this.mercanciaForm.get('fraccion')?.invalid
    ) {
      this.mostrarErroresMercancia = true;
      this.mostrarErroresPartidas = false;
      return;
    }

    this.mostrarErroresMercancia = false;

    if (!this.mercanciaForm.get('fraccion')?.value) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Debes seleccionar una Fracción arancelaria',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm',
      };
      this.mostrarNotificacion = true;
      return;
    }

    this.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal();
  }

  /**
   * Valida el formulario de partidas de la mercancía.
   * Si es válido, muestra la tabla dinámica y actualiza el estado global.
   */
  validarYEnviarFormulario(): void {
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
    } else {
      this.mostrarTabla = true;
      this.tramite130116Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        this.seccionState?.cantidadPartidasDeLaMercancia
      );

      const UMT = this.unidadCatalogo
        .map((item) =>
          item.clave === this.seccionState?.unidadMedida ? item.descripcion : ''
        )
        .toString();

      const DATOS = [
        {
          id: String(this.tableBodyData.length + 1),
          cantidad: this.seccionState?.cantidadPartidasDeLaMercancia || '',
          unidadDeMedida: UMT || '',
          fraccionFrancelaria: this.seccionState?.fraccion || '',
          descripcion: this.seccionState?.descripcion || '',
          precioUnitarioUSD: PRECIO_UNITARIO_USD || '',
          totalUSD:
            this.seccionState?.valorPartidaUSDPartidasDeLaMercancia || '',
        },
      ];
      this.tableBodyData = [...this.tableBodyData, ...DATOS];
      this.partidasDelaMercanciaForm.reset();
      const CANTIDAD_TOTAL = this.tableBodyData.reduce(
        (acc, item) => acc + parseInt(item.cantidad, 10),
        0
      );
      const TOTAL_USD = this.tableBodyData.reduce(
        (acc, item) => acc + parseFloat(item.totalUSD),
        0
      );
      this.formForTotalCount.patchValue({
        cantidadTotal: CANTIDAD_TOTAL,
        valorTotalUSD: TOTAL_USD,
      });
      this.tramite130116Store.actualizarEstado({
        tableBodyData: this.tableBodyData,
      });
    }
  }

  /**
   * Navega para modificar una partida específica.
   * Actualiza el estado global con las filas seleccionadas.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130116Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130116Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * Maneja el cambio de bloque seleccionado.
   * Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.getPaisesPorBloque(bloqueId.toString());
  }

  /**
   * @description Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param event Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130116Store.actualizarEstado({ [$event.campo]: VALOR });
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.getClasificacionRegimenCatalogo(VALOR);
    }
    if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUnidadesMedidaTarifaria(VALOR);
    }
    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.getRepresentacionFederalCatalogo(VALOR);
    }
  }

  /**
   * Calcula el importe unitario basado en la cantidad y el valor USD.
   * @param cantidadPartidas Cantidad de partidas
   * @param cantidadUSD Valor en USD
   * @returns Importe unitario calculado
   */
  calcularImporteUnitario(
    cantidadPartidas: string,
    cantidadUSD: string
  ): string {
    const TOTAL_PARTIDAS = Number(cantidadPartidas) || 0;
    const TOTAL_USD = Number(cantidadUSD) || 0;

    if (TOTAL_PARTIDAS === 0) {
      return '0';
    }

    const MAXIMO_DECIMALES = 3;
    const IMPORTE_UNITARIO_USD = TOTAL_USD / TOTAL_PARTIDAS;

    return IMPORTE_UNITARIO_USD.toFixed(MAXIMO_DECIMALES).toString();
  }

  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Devuelve verdadero si no hay filas seleccionadas en la tabla dinámica.
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true;
    }
    return disabled;
  }
  /**
   * Valida que un string no contenga caracteres especiales como ~`{}\\|^›@#$%!.
   * @param control Control del formulario a validar
   * @returns ValidationErrors | null
   */
  static validarSinCaracterAnguloDerecho(
    control: AbstractControl
  ): ValidationErrors | null {
    if (typeof control.value === 'string' && control.value) {
      // Regex que permite solo letras, números, espacios, acentos, ñ, puntos y comas
      const SOLO_PERMITIDOS = REGEX_SOLO_PERMITIDOS;
      if (!SOLO_PERMITIDOS.test(control.value)) {
        return { validarSinCaracterAnguloDerecho: true };
      }
    }
    return null;
  }

  /**
   * Limpia las suscripciones activas al destruir el componente.
   * Evita fugas de memoria al completar el sujeto de destrucción.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
