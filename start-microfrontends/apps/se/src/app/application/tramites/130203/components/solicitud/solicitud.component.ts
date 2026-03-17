import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion
} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { DATOS_DEL_TRAMITE, ID_PROCEDIMIENTO, OPINIONES_SOLICITUD, PRODUCTO_OPCION } from '../../constants/exportacion-de-diamantes-en-bruto.enum';
import {
  Tramite130203State,
  Tramite130203Store,
} from '../../estados/tramites/tramites130203.store';
import { ExportacionDeDiamantesEnBrutoService } from '../../services/exportacion-de-diamantes-en-bruto.service';
import { map } from 'rxjs';

import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130202/partidas-de-la.json';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Subject } from 'rxjs';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130203Query } from '../../estados/queries/tramite130203.query';
import { takeUntil } from 'rxjs';

// import fractionValues from '@libs/shared/theme/assets/json/130203/fraccion_arancelaria.json';
// import solicitudeSelectVal from '@libs/shared/theme/assets/json/130202/solicitud-select.json';
// import unidadOptions from '@libs/shared/theme/assets/json/130203/unidad_da.json';

/**
 * @description
 * Componente para gestionar la solicitud del trámite 130203.
 * Este componente incluye formularios reactivos y suscripciones para manejar el estado del trámite.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * form
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;
  /*
  * modificarPartidasDelaMercanciaForm
  * Formulario reactivo para modificar las partidas.
  */
  modificarPartidasDelaMercanciaForm!: FormGroup;
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
  mostrarTabla = true;
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
   * jest.spyOnCatálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];
  /**
   * jest.spyOnCampos de entrada configurables para detalles adicionales.
   */

  datosInputFields = DATOS_DEL_TRAMITE;
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
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130203State;
  /**
   * Indica si se debe mostrar el error de clasificación.
   */
  mostrarErrorClasificacion = true;

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;

  /*
   * Indica si se debe mostrar el tooltip del valor de la factura en USD.
   */
  mostrarTooltipValorFacturaUSD = true;
  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;
  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
    * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
    * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
    */
  @ViewChild(PartidasDeLaMercanciaComponent) partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;


  /**
   * @description
   * Constructor del componente.
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param http Servicio HTTP para realizar solicitudes.
   * @param exportacionDeDiamantesEnBrutoService Servicio para obtener datos relacionados con la exportación.
   * @param tramite130203Store Store para gestionar el estado del trámite.
   * @param tramite130203Query Query para obtener datos del estado del trámite.
   * @param consultaioQuery Query para obtener datos de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private exportacionDeDiamantesEnBrutoService: ExportacionDeDiamantesEnBrutoService,
    private tramite130203Store: Tramite130203Store,
    private tramite130203Query: Tramite130203Query,
    private consultaioQuery: ConsultaioQuery
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
   * @description
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.fetchRegimenCatalogos();
    this.getFraccionCatalogo();
    this.fetchEntidadFederativa();
    this.listaDePaisesDisponibles();

    this.tramite130203Query.select(state => state.tableBodyData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tableBodyData = data || [];
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
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    // Patch: Update store with all current form values before re-initializing forms
    this.tramite130203Store.actualizarEstado({
      ...this.formDelTramite?.getRawValue?.(),
      ...this.mercanciaForm?.getRawValue?.(),
      ...this.partidasDelaMercanciaForm?.getRawValue?.(),
      ...this.paisForm?.getRawValue?.(),
      ...this.frmRepresentacionForm?.getRawValue?.(),
      tableBodyData: this.tableBodyData,
      filaSeleccionada: this.filaSeleccionada,
      cantidadTotal: this.formForTotalCount?.get('cantidadTotal')?.value,
      valorTotalUSD: this.formForTotalCount?.get('valorTotalUSD')?.value,
    });
    this.inicializarFormularios();
  }

  /**
   * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130111.
   * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
   * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  suscribirseAEstadoDeSolicitud(): void {
    this.tramite130203Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite130203State) => {
        this.seccionState = data;
        // if (this.seccionState.regimen) {
        //   this.fetchClasificacionRegimenCatalogos(this.seccionState.regimen);
        // }

        // if (this.seccionState.fraccion) {
        //   this.getUnidadesMedidaTarifaria(this.seccionState.fraccion);
        // }

        //  if (this.seccionState.entidad) {
        //   this.fetchRepresentacionFederal(this.seccionState.entidad);
        // }
      });
  }

  /**
   * @description
   * Inicializa los formularios del componente.
   */
  inicializarFormularios(): void {
    this.suscribirseAEstadoDeSolicitud();
    this.formDelTramite = this.fb.group({
      solicitud: [this.seccionState?.solicitud, Validators.required],
      regimen: [this.seccionState?.regimen, Validators.required],
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    this.mercanciaForm = this.fb.group({
      producto: [this.seccionState?.producto],
      descripcion: [
        this.seccionState?.descripcion,
        [
          Validators.required,
          SolicitudComponent.validarSinCaracterAnguloDerecho
        ],
      ],
      fraccion: [this.seccionState?.fraccion, Validators.required],
      cantidad: [
        this.seccionState?.cantidad,
        [
          Validators.required,
          SolicitudComponent.validarNumeroTresDecimales,
          Validators.min(1),
        ],
      ],
      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD,
        [
          Validators.required,
          SolicitudComponent.validarNumeroTresDecimales,
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
          SolicitudComponent.validarCatorceEnterosTresDecimales,
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
          SolicitudComponent.validarCatorceEnterosTresDecimalesUSD,
          Validators.maxLength(20),
        ],
      ],
    });
    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          SolicitudComponent.validarCatorceEnterosTresDecimales,
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
          SolicitudComponent.validarCatorceEnterosTresDecimalesUSD,
          Validators.maxLength(20),
        ],
      ],
    });

    this.formularioTotalCount(
      String(this.seccionState?.cantidadTotal),
      String(this.seccionState?.valorTotalUSD)
    );
    this.paisForm = this.fb.group({
      bloque: [this.seccionState?.bloque],
      usoEspecifico: [this.seccionState?.usoEspecifico,
      [Validators.required,
      SolicitudComponent.validarSinCaracterAnguloDerecho
      ]],
      justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion,
      [Validators.required,
      SolicitudComponent.validarSinCaracterAnguloDerecho
      ]
      ],
      observaciones: [this.seccionState?.observaciones],
      numeroPermisoImportacion: [this.seccionState?.numeroPermisoImportacion],
    });
    this.frmRepresentacionForm = this.fb.group({
      entidad: [this.seccionState?.entidad, Validators.required],
      representacion: [this.seccionState?.representacion, Validators.required],
    });
  }

  fetchRegimenCatalogos(): void {
    this.exportacionDeDiamantesEnBrutoService.getRegimenOptions(this.idProcedimiento.toString()).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.catalogosArray[0] = data;
    });
  }

  fetchClasificacionRegimenCatalogos(ID: string): void {
    this.exportacionDeDiamantesEnBrutoService.getClasificacionRegimenCatalogo(ID).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.catalogosArray[1] = data;
    });
  }

  /**
   * @description Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param event Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130203Store.actualizarEstado({ [$event.campo]: VALOR });
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.mostrarErrorClasificacion = false;
      this.fetchClasificacionRegimenCatalogos(VALOR);
    }

    if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUnidadesMedidaTarifaria(VALOR);
    }

    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.fetchRepresentacionFederal(VALOR);
    }
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
  * formularioTotalCount
  * Crea el formulario reactivo para capturar los totales de las partidas.
  */
  formularioTotalCount(cantidadTotal: string, valorTotalUSD: string): void {
    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: cantidadTotal, disabled: true }],
      valorTotalUSD: [{ value: valorTotalUSD, disabled: true }],
    });
  }

  /**
   * @description
   * Maneja la fila seleccionada en la tabla.
   * @param filasSeleccionadas Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(
    filasSeleccionadas: PartidasDeLaMercanciaModelo[]
  ): void {
    this.filaSeleccionada = filasSeleccionadas.length ? filasSeleccionadas : [];
    if (this.filaSeleccionada) {
      this.tramite130203Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }
  /**
   * @description
   * Obtiene la lista de países disponibles desde el servicio.
   */
  listaDePaisesDisponibles(): void {
    this.exportacionDeDiamantesEnBrutoService.getListaDePaisesDisponibles(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.elementosDeBloque = data;
      });
  }

  /**
   *  Maneja la selección de todos los países.
   * @param evento 
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.exportacionDeDiamantesEnBrutoService.getTodosPaisesSeleccionados(this.idProcedimiento.toString()).subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
    }
  }

  /**
   *  Maneja la selección de fechas y actualiza el estado global.
   * @param evento 
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130203Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   * @description
   * Obtiene los países por bloque desde el servicio.
   * @param _bloqueId ID del bloque seleccionado.
   */
  fetchPaisesPorBloque(bloqueId: string): void {
    this.exportacionDeDiamantesEnBrutoService.getPaisesPorBloque(this.idProcedimiento.toString(), bloqueId).pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paisesPorBloque = data;
        this.selectRangoDias = this.paisesPorBloque.map(
          (pais: Catalogo) => pais.descripcion
        );
      });
  }

  /**
   * @description
   * Maneja el cambio de bloque y actualiza los países correspondientes.
   * @param bloqueId ID del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.fetchPaisesPorBloque(bloqueId.toString());
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.exportacionDeDiamantesEnBrutoService.getFraccionCatalogoService(this.idProcedimiento.toString()).subscribe((data) => {
      this.fraccionCatalogo = data?.map(item => ({
        ...item,
        descripcion: `${item.clave} - ${item.descripcion}`
      }));
    });
  }

  /**
   * @description
   * Obtiene la lista de entidades federativas desde el servicio.
   */
  fetchEntidadFederativa(): void {
    this.exportacionDeDiamantesEnBrutoService.getEntidadFederativa(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyed$)).subscribe((data) => {
        this.entidadFederativa = data;
      });
  }

  /**
   * @description
   * Obtiene la lista de representaciones federales desde el servicio.
   */
  fetchRepresentacionFederal(cveEntidad: string): void {
    this.exportacionDeDiamantesEnBrutoService.getRepresentacionFederal(this.idProcedimiento.toString(), cveEntidad)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.representacionFederal = data;
      });
  }

  /**
   *  Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID 
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.exportacionDeDiamantesEnBrutoService.getUMTService(this.idProcedimiento.toString(), FRACCION_ID).subscribe((data) => {
      this.unidadCatalogo = data as Catalogo[];
      if (this.unidadCatalogo.length > 0) {
        this.mercanciaForm.get('unidadMedida')?.setValue(this.unidadCatalogo[0]?.clave || '');
        this.tramite130203Store.actualizarEstado({ unidadMedida: this.unidadCatalogo[0]?.clave || '' });
      }
    });
  }

  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
   *
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true;
    }
    return disabled;
  }
  /**
      * onModificarPartidaSeleccionada
      * Maneja la modificación de una partida seleccionada.
      * @param partida - La partida que se va a modificar.
      */
  onModificarPartidaSeleccionada(partida: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.setValue({
      cantidadPartidasDeLaMercancia: partida.cantidad,
      descripcionPartidasDeLaMercancia: partida.descripcion,
      valorPartidaUSDPartidasDeLaMercancia: partida.totalUSD
    });
  }
  /**
   * onPartidaModificada
   * Maneja la modificación de una partida.
   * @param partida - La partida que se va a modificar.
   */
  onPartidaModificada(partida: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map(row =>
      row.id === partida.id ? { ...row, ...partida } : row
    );
    this.tramite130203Store.actualizarEstado({ tableBodyData: this.tableBodyData });
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130203Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
  }

  /**
   * validarYEnviarFormulario
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
    ['cantidad', 'valorFacturaUSD'].forEach((controlName) => {
      const CONTROL = this.mercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.mercanciaForm.get('cantidad')?.invalid ||
      this.mercanciaForm.get('valorFacturaUSD')?.invalid
    ) {
      this.mostrarErroresMercancia = true;
      this.mostrarErroresPartidas = false;
      return;
    }

    this.mostrarErroresMercancia = false;

    [
      'cantidadPartidasDeLaMercancia',
      'valorPartidaUSDPartidasDeLaMercancia',
      'descripcionPartidasDeLaMercancia',
    ].forEach((controlName) => {
      const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')
        ?.invalid
    ) {
      this.mostrarErroresPartidas = true;
      return;
    }

    // Si fracción no tiene valor, mostrar popup y detener flujo
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
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }
    const CURRENT_TABLE = this.tramite130203Query.getValue().tableBodyData || [];
    const CANTIDAD = Number(this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value);
    const TOTALUSD = Number(this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value);

    const PRECIOUNITARIO_USD =
      CANTIDAD && !isNaN(CANTIDAD) && !isNaN(TOTALUSD)
        ? (TOTALUSD / CANTIDAD).toFixed(2)
        : '';
    const UMT = this.unidadCatalogo.map(item => item.clave === this.seccionState?.unidadMedida ? item.descripcion : '').toString();
    const NEW_ROW: PartidasDeLaMercanciaModelo = {
      id: Date.now().toString(),
      cantidad: this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value,
      totalUSD: this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value,
      descripcion: this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.value,
      unidadDeMedida: UMT || '',
      fraccionFrancelaria: this.seccionState?.fraccion || '',
      precioUnitarioUSD: PRECIOUNITARIO_USD
    };

    const UPDATED_TABLE = [...CURRENT_TABLE, NEW_ROW];
    this.tramite130203Store.actualizarEstado({
      tableBodyData: UPDATED_TABLE,
      mostrarTabla: true
    });

    this.tableBodyData = UPDATED_TABLE;
    this.mostrarTabla = true;

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );

    this.tramite130203Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });

    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
    this.partidasDelaMercanciaForm.reset();
    this.mostrarErroresPartidas = false;
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130203Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130203Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }
  /**
   * @description
   * Método para limpiar las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Valida que un número tenga como máximo tres decimales.
   */
  static validarNumeroTresDecimales(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return null;
    }

    if (!/^\d+(\.\d+)?$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (/^\d+\.\d{4,}$/.test(VALOR)) {
      return { maximoTresDecimales: true };
    }

    return null;
  }

  /**
   * Valida que un string no contenga el carácter de ángulo derecho (›).
   */
  static validarSinCaracterAnguloDerecho(
    control: AbstractControl
  ): ValidationErrors | null {
    if (typeof control.value === 'string' &&
      (control.value.includes('›') || control.value.includes('^') || control.value.includes('~'))) {
      return { validarSinCaracterAnguloDerecho: true };
    }
    return null;
  }

  /*
      Valida que un número tenga como máximo 14 enteros y 3 decimales.
      */
  static validarCatorceEnterosTresDecimales(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return null;
    }

    if (!/^\d*\.?\d*$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (!/^\d{1,14}(\.\d{1,3})?$/.test(VALOR)) {
      return { validarCatorceEnterosTresDecimales: true };
    }

    return null;
  }

  /*
  Valida que un número tenga como máximo 16 enteros y 3 decimales.
  */
  static validarCatorceEnterosTresDecimalesUSD(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') { return null; }

    if (!/^\d*\.?\d*$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (!/^\d{1,16}(\.\d{1,3})?$/.test(VALOR)) {
      return { validarCatorceEnterosTresDecimalesUSD: true };
    }

    return null;
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

  /*
  * Método que se ejecuta cuando se eliminan partidas de la tabla.
  * Actualiza los datos de la tabla y recalcula los totales.  
  */
  onPartidasEliminadas(ids: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(row => !ids.includes(row.id));
    this.mostrarTabla = this.tableBodyData.length > 0;

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130203Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
    this.tramite130203Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
      mostrarTabla: this.mostrarTabla
    });
  }


}

