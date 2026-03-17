import { Catalogo, ConfiguracionColumna, MostrarPartidas, Notificacion, NotificacionesComponent, REGEX_NUMERO_DECIMAL_ENTERO, REGEX_REMOVE_COMA, REG_X, TablaSeleccion } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FRACCIONES_ANARCIA_TABLA, PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FraccionArancelariaProsec, PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { OPINIONES_SOLICITUD, PRODUCTO_OPCION } from '../../constantes/importacion-definitiva.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite130103State, Tramite130103Store } from '../../../../estados/tramites/tramite130103.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CriterioDictamenComponent } from '../../../../shared/components/criterio-dictamen/CriterioDictamen.component';
import { DatosDeLaMercanciaComponent } from "../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component";
import { DatosDelTramiteComponent } from "../../../../shared/components/datos-del-tramite/datos-del-tramite.component";
import { HttpClient } from '@angular/common/http';
import { ImportacionDefinitivaService } from '../../services/importacion-definitiva.service';
import { PaisProcendenciaComponent } from "../../../../shared/components/pais-procendencia/pais-procendencia.component";
import { PartidasDeLaMercanciaComponent } from "../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component";
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { RepresentacionComponent } from "../../../../shared/components/representacion/representacion.component";
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { Tramite130103Query } from '../../../../estados/queries/tramite130103.query';
import { UsoSpecificoComponent } from "../../../../shared/components/uso-specifico/uso-specifico.component";
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, NotificacionesComponent, RepresentacionComponent, PaisProcendenciaComponent, PartidasDeLaMercanciaComponent, DatosDeLaMercanciaComponent, DatosDelTramiteComponent, UsoSpecificoComponent, CriterioDictamenComponent],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css',
})
export class SolicitudComponent implements OnInit, OnDestroy {

  /**
     * form
     * Formulario reactivo principal para capturar los datos de la solicitud.
     */
  partidasDelaMercanciaForm!: FormGroup;

  /**
     * usoSpecifico
     * Formulario reactivo para capturar los datos de uso específico.
     */
  usoSpecifico!: FormGroup;

  /**
   * criterioDictamenForm
   * Formulario reactivo para capturar los datos del criterio de dictamen.
   */
  criterioDictamenForm!: FormGroup;
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
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;

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
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
     * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
     * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
     */
  @ViewChild(PartidasDeLaMercanciaComponent) partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /**
   * tableHeaderData
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] = PARTIDASDELAMERCANCIA_TABLA;

  /**
   * configuracionTabla
   * Configuración de las columnas de la tabla dinámica para fracciones arancelarias.
   */
  configuracionTabla: ConfiguracionColumna<FraccionArancelariaProsec>[] = FRACCIONES_ANARCIA_TABLA;
  /**
   * tableBodyData
   * Datos que se mostrarán en el cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * datosSocios
   * Arreglo que almacena los datos de socios para fracciones arancelarias.
   */
  datosSocios: FraccionArancelariaProsec[] = [];
  /**
   * mostrarTabla
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  mostrarTabla = false;
  /**
   * CHECKBOX
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;
  /**
   * getEstablecimientoTableData
   * Datos de configuración de la tabla obtenidos de un archivo JSON.
   */
  public getEstablecimientoTableData = [];

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
   * jest.spyOnCatálogo con opciones de unidad de medida.
   */
  unidadMedidaCatalogo: Catalogo[] = [];

  /**
   * Lista de opciones del catálogo utilizadas para la modificación de la fracción
   * arancelaria en la sección *Partidas de la mercancía*.
   *
   * Esta propiedad almacena los elementos del catálogo que se mostrarán en el
   * componente (por ejemplo, en un dropdown o autocompletado) para que el usuario
   * seleccione la fracción correspondiente.
   */
  fraccionModificationPartidasDeLaMercancia: Catalogo[] = [];

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

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
  esFormularioSoloLectura: boolean = true;

  /**
  * Estado interno de la sección actual del trámite 130110.
  * Utilizado para gestionar y almacenar la información relacionada con esta sección.
  * Propiedad privada.
  */
  public seccionState!: Tramite130103State;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = 130103;
/**
 * Modifica los valores del formulario de partidas de la mercancía según el evento recibido.
 */
  cveregimenSeleccionado: string = '2';
  
  /**
   * jest.spyOnArreglo que almacena las partidas a mostrar en la tabla.
   * @type {MostrarPartidas[]}
   */
  mostrarPartidas: MostrarPartidas[] = [];

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  /**
    * @descripcion Notificación para mostrar mensajes al usuario.
    */
  public nuevaNotificacion!: Notificacion;

  /**
   * Lista de elementos del catálogo que contienen las descripciones asociadas
   * a las fracciones arancelarias dentro de *Partidas de la mercancía*.
   *
   * Esta propiedad se utiliza para poblar los controles (por ejemplo, un
   * dropdown o autocompletado) donde el usuario puede seleccionar la descripción
   * correspondiente a la fracción arancelaria.
   */
  fraccionDescripcionPartidasDeLaMercancia: Catalogo[] = [];

  /**   * catálogo con datos de PROSEC.
   */
  catalogosProsec: Catalogo[] = [];

  /**   * catálogo con datos de esquema de regla.
   */
  esquemaRegla: Catalogo[] = [];

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130105Store: Tramite130103Store,
    private tramite130105Query: Tramite130103Query,
    private importacionDefinitivaService: ImportacionDefinitivaService,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.inicializarFormularios();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            // Si el formulario está en modo solo lectura, aquí se podría mostrar las partidas asociadas a la solicitud.
            //  this.getMostrarPartidas();
          }
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
    this.getUnidadMedidaCatalogo();
    this.getFraccionDivisionesCatalogo();
    this.getEsquemaReglaCatalogo();
    this.getEntidadesFederativasCatalogo();
    this.getBloque();
    this.tramite130105Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla;
      });

    this.tramite130105Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => { 
        this.seccionState = data;
        this.tableBodyData = data.tableBodyData || [];
      });
  }

  /**
  * Calls buscarDatosPost API and updates criterioDictamen field.
  */
  processBuscarMercancia(body: unknown): void {
    const CRITERIO_CONTROL = this.criterioDictamenForm.get('criterioDictamen');
    if (CRITERIO_CONTROL) {
      CRITERIO_CONTROL.enable({ emitEvent: false });
    }
    this.importacionDefinitivaService.buscarDatosPost(body as Record<string, unknown>).subscribe({
      next: (response) => {
        const RESPONSE = response as { datos?: { requisitos?: string } };
        const CRITERIO_TEXT = RESPONSE?.datos?.requisitos || '';
        if (CRITERIO_CONTROL) {
          CRITERIO_CONTROL.setValue(CRITERIO_TEXT);
          CRITERIO_CONTROL.disable({ emitEvent: false });
          this.setValoresStore({ form: this.criterioDictamenForm, campo: 'criterioDictamen' });
        }
      },
      error: (_err) => {
        if (CRITERIO_CONTROL) {
          CRITERIO_CONTROL.setValue('');
          CRITERIO_CONTROL.disable({ emitEvent: false });
        }
      }
    });
  }
  /**
   * Handler for mercanciaEsquemaChange event from child.
   */
  onMercanciaEsquemaChange(value: unknown): void {
    if (value) {
      const V = value as { fraccionArancelariaTIGIE_clave?: string; clave?: number };
      const PAYLOAD = {
        fraccionArancelariaTIGIE_clave: V.fraccionArancelariaTIGIE_clave || value,
        clave: V.clave || 1
      };
      this.processBuscarMercancia(PAYLOAD);
    } else {
      const CRITERIO_CONTROL = this.criterioDictamenForm.get('criterioDictamen');
      if (CRITERIO_CONTROL) {
        CRITERIO_CONTROL.setValue('');
        CRITERIO_CONTROL.disable({ emitEvent: false });
      }
    }
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
      unidadesMedida: [this.seccionState?.unidadesMedida, Validators.required],
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
      fraccionTigiePartidasDeLaMercancia: [
        '', [Validators.required, Validators.maxLength(255)],
      ],
      fraccionDescripcionPartidasDeLaMercancia: [''],
    });
    this.usoSpecifico = this.fb.group({
      fraccionArancelariaProsec: [this.seccionState?.fraccionArancelariaProsec, Validators.required],
      descripcionFraccionProsec: [this.seccionState?.descripcionFraccionProsec, Validators.required]
    });
    this.criterioDictamenForm = this.fb.group({
      mercanciaEsquema: [this.seccionState?.mercanciaEsquema, Validators.required],
      criterioDictamen: [this.seccionState?.criterioDictamen, Validators.required]
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
      fraccionTigiePartidasDeLaMercancia: [
        this.seccionState?.fraccionTigiePartidasDeLaMercancia,
        [Validators.required]
      ],
      fraccionDescripcionPartidasDeLaMercancia: [
        this.seccionState?.fraccionDescripcionPartidasDeLaMercancia,
        []
      ]
    });

    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: this.seccionState?.cantidadTotal, disabled: true }],
      valorTotalUSD: [{ value: this.seccionState?.valorTotalUSD, disabled: true }],
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
    if(this.usoSpecifico.invalid){
      this.usoSpecifico.markAllAsTouched();
      isValid = false;
    }
    if (this.criterioDictamenForm.invalid) {
      this.criterioDictamenForm.markAllAsTouched();
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
   * jest.spyOnConfigura las suscripciones para actualizar formularios y almacenar estados.
   */
  configuracionFormularioSuscripciones(): void {
    this.tramite130105Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$),
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
            unidadesMedida: seccionState.unidadesMedida,
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
   * manejarlaFilaSeleccionada
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(filasSeleccionadas: PartidasDeLaMercanciaModelo[]): void {
    this.filaSeleccionada = filasSeleccionadas.length
      ? filasSeleccionadas
      : [];
    if (this.filaSeleccionada) {
      this.tramite130105Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
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
      this.tramite130105Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(this.seccionState?.valorPartidaUSDPartidasDeLaMercancia, this.seccionState?.cantidadPartidasDeLaMercancia);
      const UMT = this.unidadMedidaCatalogo.map(item => item.clave === this.seccionState?.unidadesMedida ? item.descripcion : '').toString();
      const DATOS = [
        {
          id: String(this.tableBodyData.length + 1),
          cantidad: this.seccionState?.cantidadPartidasDeLaMercancia || "",
          unidadDeMedida: UMT.replace(REGEX_REMOVE_COMA, '') || "",
          fraccionFrancelaria: this.seccionState?.fraccionDescripcionPartidasDeLaMercancia || "",
          descripcion: this.seccionState?.descripcionPartidasDeLaMercancia || "",
          precioUnitarioUSD: PRECIO_UNITARIO_USD || "",
          totalUSD: this.seccionState?.valorPartidaUSDPartidasDeLaMercancia || ""
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
      this.tramite130105Store.actualizarEstado({
        tableBodyData: this.tableBodyData
      })
    }
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130105Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130105Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
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
   * jest.spyOnActualiza el almacén con nuevos valores basados en eventos de formulario.
   * jest.spyOnEvento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130105Store.actualizarEstado({ [$event.campo]: VALOR });
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.getClasificacionesRegimen(VALOR);
    }
    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.getRepresentacionFederalCatalogo(VALOR);
    }
    if ($event.campo === 'fraccionTigiePartidasDeLaMercancia') {
      const VALOR = this.partidasDelaMercanciaForm.get('fraccionTigiePartidasDeLaMercancia')?.value;
      this.getFraccionDescripcionPartidasDeLaMercancia(VALOR);
    }
  }

  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
   * 
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true
    }
    return disabled;
  }

  /**
   *  Modifica los valores del formulario de partidas de la mercancía según el evento recibido.
   * @param evento 
   */
  modificarPartidaSeleccionada(evento: PartidasDeLaMercanciaModelo): void {
    if (evento.fraccionFrancelaria) {
      this.getFraccionAllDatos(evento.fraccionFrancelaria?.toString() || '0');
    }
    this.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: evento.cantidad,
      valorPartidaUSDPartidasDeLaMercancia: evento.totalUSD,
      descripcionPartidasDeLaMercancia: evento.descripcion,
      fraccionModificationPartidasDeLaMercancia: evento.fraccionFrancelaria,
    });
  }

  /**
   *  Actualiza la partida modificada en la tabla de datos.
   * @param evento 
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

    this.tramite130105Store.actualizarEstado({
      tableBodyData: this.tableBodyData
    })
  }

  /**
 * Elimina partidas de la tabla según los IDs recibidos y recalcula los totales.
 *
 * @param {string[]} evento - Arreglo de IDs (como cadenas) de las partidas que deben eliminarse.
 *
 * @description
 * Esta función filtra `tableBodyData` removiendo los elementos cuyo `id` coincida
 * con alguno de los valores en `evento`.  
 * Luego recalcula:
 * - `cantidadTotal`: suma de todas las cantidades restantes.
 * - `valorTotalUSD`: suma del total en USD de cada partida.
 *
 * Finalmente, actualiza el formulario `formForTotalCount` con los nuevos valores.
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
    this.tramite130105Store.actualizarEstado({
      tableBodyData: this.tableBodyData
    })
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
  * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
  *
  * @returns {void}
  */
  getRegimenCatalogo(): void {
    this.importacionDefinitivaService.getRegimenCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.catalogosArray[0] = data as Catalogo[];
    });
  }
 
  /**
   * Obtiene el catálogo de clasificaciones de régimen desde el servicio y lo asigna a la propiedad `catalogosArray[1]`.
   */
    getClasificacionesRegimen( VALOR: string): void { 
    this.importacionDefinitivaService.getClasificacionesRegimen(this.idProcedimiento.toString(), VALOR).subscribe((data) => {
      this.catalogosArray[1] = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de unidades de medida desde el servicio y lo asigna a la propiedad `unidadMedidaCatalogo`.
   *
   * @returns {void}
   */
  getUnidadMedidaCatalogo(): void {
    this.importacionDefinitivaService.getUnidadMedidaCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.unidadMedidaCatalogo = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `catalogosProsec`.
   *
   * @returns {void}
   */
  getFraccionDivisionesCatalogo(): void {
    this.importacionDefinitivaService.getFraccionDivisionesCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.catalogosProsec = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de esquema de regla desde el servicio y lo asigna a la propiedad `esquemaRegla`.
   *
   * @returns {void}
   */
  getEsquemaReglaCatalogo(): void {
    this.importacionDefinitivaService.getEsquemaReglaCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.esquemaRegla = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   *
   * @returns {void}
   */
  getClasificacionRegimenCatalogo(VALOR: string): void {
    this.importacionDefinitivaService.getClasificacionRegimenCatalogo(VALOR).subscribe((data) => {
      this.catalogosArray[1] = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.importacionDefinitivaService.getFraccionCatalogoService(this.idProcedimiento.toString()).subscribe((data) => {
      this.fraccionCatalogo = data?.map(item => ({
        ...item,
        descripcion: `${item.clave} - ${item.descripcion}`
      }));
    });
  }

  /**
   * Obtiene los bloques desde el servicio y los asigna a la propiedad `elementosDeBloque`.
   *
   * @returns {void}
   */
  getBloque(): void {
    this.importacionDefinitivaService.getBloqueService(this.idProcedimiento.toString()).subscribe((data) => {
      this.elementosDeBloque = data as Catalogo[];
    });
  }

  /**
   *  Obtiene los países por bloque desde el servicio y los asigna a la propiedad `paisesPorBloque`.
   * @param ID 
   */
  getPaisesPorBloque(ID: string): void {
    this.importacionDefinitivaService.getPaisesPorBloqueService(this.idProcedimiento.toString(), ID).subscribe((data) => {
      this.paisesPorBloque = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio y lo asigna a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  getEntidadesFederativasCatalogo(): void {
    this.importacionDefinitivaService.getEntidadesFederativasCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.entidadFederativa = data as Catalogo[];
    })
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad 
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.importacionDefinitivaService.getRepresentacionFederalCatalogo(this.idProcedimiento.toString(), cveEntidad).subscribe((data) => {
      this.representacionFederal = data as Catalogo[];
    });
  }

  /**
   *  Maneja la selección de todos los países.
   * @param evento 
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.importacionDefinitivaService.getTodosPaisesSeleccionados(this.idProcedimiento.toString()).subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
    }
  }

  /**
   * Obtiene la descripción de la fracción arancelaria correspondiente a las
   * *Partidas de la mercancía* y actualiza la lista de descripciones del catálogo.
   *
   * Este método consume el servicio `getFraccionDescripcionPartidasDeLaMercanciaService`
   * enviando el ID del procedimiento y el ID seleccionado por el usuario.
   *
   * @param {string} ID - Identificador de la fracción seleccionada.
   * @returns {void}
   */
  getFraccionDescripcionPartidasDeLaMercancia(ID: string): void {
    this.importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService(this.idProcedimiento.toString(), ID)
      .subscribe((data) => {
        this.fraccionDescripcionPartidasDeLaMercancia = data as Catalogo[];
      });
  }

  /**
   * Obtiene todos los datos relacionados con una fracción arancelaria específica
   * dentro de *Partidas de la mercancía*, actualizando la lista utilizada para la
   * modificación de la fracción seleccionada.
   *
   * Este método consulta el mismo servicio que obtiene la descripción de la fracción,
   * pero almacena el resultado en `fraccionModificationPartidasDeLaMercancia` para
   * fines de edición o actualización.
   *
   * @param {string} id - Identificador de la fracción cuyos datos deben consultarse.
   * @returns {void}
   */
  getFraccionAllDatos(id: string): void {
    this.importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService(this.idProcedimiento.toString(), id).subscribe((data) => {
      this.fraccionModificationPartidasDeLaMercancia = data as Catalogo[];
    });
  }

  /**
   * Obtiene las partidas a mostrar desde el servicio y las asigna a la propiedad `mostrarPartidas`.
   *
   * @returns {void}
   */
  getMostrarPartidas(): void {
    let idSolicitud = 0;
    if (this.seccionState?.idSolicitud) {
      idSolicitud = this.seccionState?.idSolicitud;
    }
    this.importacionDefinitivaService.getMostrarPartidasService(idSolicitud).subscribe((data) => {
      if (data.codigo === '00') {
        this.mostrarPartidas = data.datos as MostrarPartidas[];
        if (this.mostrarPartidas.length > 0) {
          const TABLE_BODY = this.mostrarPartidas.map((item, i) => ({
            id: i?.toString(),
            cantidad: item.candidatoEliminar?.toString() || '',
            unidadDeMedida: item.unidadMedidaDescripcion?.toString() || '',
            fraccionFrancelaria: item.fraccionClave?.toString() || '',
            descripcion: item.descripcionOriginal?.toString() || '',
            precioUnitarioUSD: item.importeUnitarioUSD?.toString() || '',
            totalUSD: item.importeTotalUSD?.toString() || '',
            fraccionTigiePartidasDeLaMercancia: item.fraccionClave,
            fraccionDescripcionPartidasDeLaMercancia: item.fraccionDescripcion,
          }));
          this.tramite130105Store.actualizarEstado({ tableBodyData: TABLE_BODY })
        }
        this.tramite130105Store.actualizarEstado({ mostrarPartidas: this.mostrarPartidas });
      }
    });
  }

  /**
   *  Maneja la selección de fechas y actualiza el estado global.
   * @param evento 
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130105Store.actualizarEstado({ fechasSeleccionadas: evento });
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
   * jest.spyOnCiclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
