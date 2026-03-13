// Importación de módulos, servicios, constantes y datos JSON necesarios para el funcionamiento del componente
// Este conjunto de importaciones cubre funcionalidades relacionadas con la gestión de formularios, validaciones,
// permisos, configuraciones, así como la obtención y manipulación de datos externos para la aplicación.

import { Catalogo, ConsultaioQuery, REGEX_NUMERO_DECIMAL_ENTERO, REG_X } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ID_PROCEDIMIENTO, OPINIONES_SOLICITUD, PRODUCTO_OPCION } from '../../enums/accion-botton.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite130217State, Tramite130217Store } from '../../../../estados/tramites/tramite130217.store';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130217Query } from '../../../../estados/queries/tramite130217.query';

/**
 * Componente para gestionar la solicitud de mercancías.
 * Contiene formularios reactivos y opciones configurables relacionadas con el trámite.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;

  /**
   * Formulario reactivo para los datos del trámite.
   */
  formDelTramite!: FormGroup;

  /**
   * Formulario reactivo para los detalles de la mercancía.
   */
  mercanciaForm!: FormGroup;

  /**
   * Formulario reactivo para capturar los totales de las partidas.
   */
  formForTotalCount!: FormGroup;

  /**
   * Formulario reactivo para la selección de países.
   */
  paisForm!: FormGroup;  /**
   * Formulario reactivo para la representación.
   */
  frmRepresentacionForm!: FormGroup;

  /**
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent)
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /**
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] = PARTIDASDELAMERCANCIA_TABLA;

  /**
   * Datos para el cuerpo de la tabla de partidas.
   * @type {{ tbodyData: string[] }[]}
   */
  tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  mostrarTabla = false;

  /**
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;
  /**
   * Datos de configuración de la tabla obtenidos mediante servicio.
   */
  public getEstablecimientoTableData = [];

  /**
   * Fila seleccionada en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  /**
   * jest.spyOnOpciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = OPINIONES_SOLICITUD;

  /**
   * Catálogo con valores de fracción arancelaria.
   */
  fraccionCatalogo: Catalogo[] = [];

  /**
   * Catálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];

  /**
   * Campos de entrada configurables para detalles adicionales.
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
   * Matriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[], []];
  /**
   * jest.spyOnOpciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = PRODUCTO_OPCION;

  /**
   * Sujeto para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Arreglo que almacena un catálogo de elementosDeBloque.
   */
  elementosDeBloque: Catalogo[] = [];

  /**
   * Arreglo que contiene un catálogo de países organizados por bloque.
   */
  paisesPorBloque: Catalogo[] = [];

  /**
   * Arreglo que guarda un catálogo de entidades federativas.
   */
  entidadFederativa: Catalogo[] = [];

  /**
   * Arreglo que almacena un catálogo de representaciones federales.
   */
  representacionFederal: Catalogo[] = [];

  /**
   * Arreglo de cadenas que representa las opciones seleccionables de rangos de días.
   */
  selectRangoDias: string[] = [];

  /**
   * Objeto que contiene los textos utilizados en la aplicación.
   */
  TEXTOS = TEXTOS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Objeto para mostrar notificaciones al usuario.
   */
  nuevaNotificacion!: Notificacion;

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;

  /**
  * Estado interno de la sección actual del trámite 130110.
  * Utilizado para gestionar y almacenar la información relacionada con esta sección.
  * Propiedad privada.
  */
  private seccionState!: Tramite130217State;

  /**
   * Formulario reactivo para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   * @param fb Servicio para la creación de formularios reactivos.
   * @param http Servicio para realizar solicitudes HTTP.
   * @param tramite130217Store Store para gestionar el estado del trámite 130217.
   * @param tramite130217Query Query para consultar el estado del trámite 130217.
   * @param ControlPermisosPreviosExportacionService Servicio para la exportación de minerales de hierro.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130217Store: Tramite130217Store,
    private tramite130217Query: Tramite130217Query,
    private ControlPermisosPreviosExportacionService: ControlPermisosPreviosExportacionService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.inicializarFormularios();
    /**
 * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }
  /**
   * Ciclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.configuracionFormularioSuscripciones();
    this.getRegimenCatalogo();
    this.getFraccionCatalogo();
    this.getEntidadesFederativasCatalogo();
    this.getBloque();

    this.tramite130217Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla;
      });

    this.tramite130217Query.selectSolicitud$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.seccionState = data;
      this.tableBodyData = data.tableBodyData || [];
    });
      
  }

  /**
   * jest.spyOnInicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */
  inicializarFormularios(): void {
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
      usoEspecifico: [this.seccionState?.usoEspecifico, Validators.required],
      justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion, [Validators.required]],
      observaciones: [this.seccionState?.observaciones],
    });
    this.frmRepresentacionForm = this.fb.group({
      entidad: [this.seccionState?.entidad, Validators.required],
      representacion: [this.seccionState?.representacion, Validators.required],
    });

    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm?.descripcionPartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm?.valorPartidaUSDPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
          Validators.maxLength(20),
        ],
      ],
    });

    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: this.seccionState?.cantidadTotal, disabled: true }],
      valorTotalUSD: [{ value: this.seccionState?.valorTotalUSD, disabled: true }],
    });
  }

  /**
   * Configura las suscripciones para actualizar formularios y almacenar estados.
   */
  configuracionFormularioSuscripciones(): void {
    this.tramite130217Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {

          this.formDelTramite.patchValue({
            solicitud: seccionState.solicitud,
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
      ).subscribe();
  }

  /**
   * Maneja la selección de filas en la tabla de partidas.
   * @param {any[]} filasSeleccionadas - Array de filas seleccionadas
   */ 
  manejarlaFilaSeleccionada(filasSeleccionadas: PartidasDeLaMercanciaModelo[]): void {
    this.filaSeleccionada = filasSeleccionadas.length
      ? filasSeleccionadas
      : [];
    if (this.filaSeleccionada) {
      this.tramite130217Store.actualizarEstado({filaSeleccionada:this.filaSeleccionada});
    }
  }

  /**
   * validarYEnviarFormulario
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
    } else {
      this.mostrarTabla = true;
      this.tramite130217Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(this.seccionState?.valorPartidaUSDPartidasDeLaMercancia, this.seccionState?.cantidadPartidasDeLaMercancia);
      const UMT = this.unidadCatalogo.map(item => item.clave === this.seccionState?.unidadMedida ? item.descripcion : '').toString();
      const DATOS = [
        {
          "id": String(this.tableBodyData.length + 1),
          "cantidad": this.seccionState?.cantidadPartidasDeLaMercancia || "",
          "unidadDeMedida": UMT || "",
          "fraccionFrancelaria": this.seccionState?.fraccion || "",
          "descripcion": this.seccionState?.descripcion || "",
          "precioUnitarioUSD": PRECIO_UNITARIO_USD || "",
          "totalUSD": String(this.seccionState?.valorPartidaUSDPartidasDeLaMercancia ?? "")
        }
      ];
      this.tableBodyData = [...this.tableBodyData, ...DATOS];
      this.partidasDelaMercanciaForm.reset();
      const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
      const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
      this.formForTotalCount.patchValue({
        cantidadTotal: CANTIDAD_TOTAL,
        valorTotalUSD: TOTAL_USD,
      });
      this.tramite130217Store.actualizarEstado({
        tableBodyData: this.tableBodyData
      })
    }
  }

  /**
 *  Calcula el importe unitario en USD basado en la cantidad de partidas y el total en USD.
 * @param cantidadPartidas 
 * @param cantidadUSD 
 * @returns 
 */
  calcularImporteUnitario(cantidadPartidas: string, cantidadUSD: string): string {
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
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130217Store.actualizarEstado({mostrarTabla:true});
      this.tramite130217Store.actualizarEstado({filaSeleccionada:this.filaSeleccionada});
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
   * Maneja el cambio de bloque seleccionado.
   * @param bloqueId Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.getPaisesPorBloque(bloqueId.toString());
  }
  
  /**
   * jest.spyOnActualiza el almacén con nuevos valores basados en eventos de formulario.
   * jest.spyOnEvento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130217Store.actualizarEstado({ [$event.campo]: VALOR });
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
 * Determina si el botón "Modificar" debe estar deshabilitado.
 * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
 * 
 */
disabledModificar() : boolean {
  let disabled = false;
  if(this.filaSeleccionada.length === 0){
    disabled = true
  }
  return disabled;
}

  /**
  * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `catalogosArray`.
  *
  * @returns {void}
  */
  getRegimenCatalogo(): void {
    this.ControlPermisosPreviosExportacionService.getRegimenCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.catalogosArray[0] = data as Catalogo[];
    });
  }
  
  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   *
   * @returns {void}
   */
  getClasificacionRegimenCatalogo(CLASSIFICACIONES_REGIMEN: string): void {
    this.ControlPermisosPreviosExportacionService.getClasificacionRegimenCatalogo(this.idProcedimiento.toString(), CLASSIFICACIONES_REGIMEN).subscribe((data) => {
      this.catalogosArray[1] = data as Catalogo[];
    });
  }
  
  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.ControlPermisosPreviosExportacionService.getFraccionCatalogoService(this.idProcedimiento.toString()).subscribe((data) => {
      this.fraccionCatalogo = data?.map(item => ({
        ...item,
        descripcion: `${item.clave} - ${item.descripcion}`
      }));
      
    });
  }

  /**
   *  Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID 
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.ControlPermisosPreviosExportacionService.getUMTService(this.idProcedimiento.toString(), FRACCION_ID).subscribe((data) => {
      this.unidadCatalogo = data as Catalogo[];
      if (this.unidadCatalogo.length > 0) {
        this.mercanciaForm.get('unidadMedida')?.setValue(this.unidadCatalogo[0]?.clave || '');
        this.tramite130217Store.actualizarEstado({ unidadMedida: this.unidadCatalogo[0]?.clave || '' });
      }
    });
  }

  /**
   * Obtiene los bloques desde el servicio y los asigna a la propiedad `elementosDeBloque`.
   *
   * @returns {void}
   */
  getBloque(): void {
    this.ControlPermisosPreviosExportacionService.getBloqueService(this.idProcedimiento.toString()).subscribe((data) => {
      this.elementosDeBloque = data as Catalogo[];
    });
  }

  /**
   *  Obtiene los países por bloque desde el servicio y los asigna a la propiedad `paisesPorBloque`.
   * @param ID 
   */
  getPaisesPorBloque(ID: string): void {
    this.ControlPermisosPreviosExportacionService.getPaisesPorBloqueService(this.idProcedimiento.toString(), ID).subscribe((data) => {
      this.paisesPorBloque = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio y lo asigna a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  getEntidadesFederativasCatalogo(): void {
    this.ControlPermisosPreviosExportacionService.getEntidadesFederativasCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.entidadFederativa = data as Catalogo[];
    })
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad 
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.ControlPermisosPreviosExportacionService.getRepresentacionFederalCatalogo(this.idProcedimiento.toString(), cveEntidad).subscribe((data) => {
      this.representacionFederal = data as Catalogo[];
    });
  }

  /**
   *  Maneja la selección de todos los países.
   * @param evento 
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.ControlPermisosPreviosExportacionService.getTodosPaisesSeleccionados(this.idProcedimiento.toString()).subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
    }
  }

  /**
   *  Maneja la selección de fechas y actualiza el estado global.
   * @param evento 
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130217Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   * Modifica la partida seleccionada en el formulario.
   * @param evento - Partida de la mercancía seleccionada
   */
  modificarPartidaSeleccionada(evento: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: evento.cantidad,
      valorPartidaUSDPartidasDeLaMercancia: evento.totalUSD,
      descripcionPartidasDeLaMercancia: evento.descripcion,
    });
  }

  /**
   * Actualiza la partida modificada en la tabla de datos.
   * @param evento - Partida de la mercancía modificada
   */
  partidaModificada(evento: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map(item => {
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
    const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
    const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });
    this.tramite130217Store.actualizarEstado({ tableBodyData: this.tableBodyData });
  }

  /**
   * Elimina las partidas seleccionadas de la tabla.
   * @param evento - Array de IDs de partidas a eliminar
   */
  partidasEliminadas(evento: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(
      item => !evento.includes(String(item.id))
    );
    const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
    const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });
    this.tramite130217Store.actualizarEstado({ tableBodyData: this.tableBodyData });
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
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
      return;
    }
     this.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal();
  }

  /**
   * Ciclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}