import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  ConsultaioQuery,
  Notificacion,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130115/partidas-de-la.json';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import fractionValues from '@libs/shared/theme/assets/json/130115/fraccion_arancelaria.json';
import solicitudeSelectVal from '@libs/shared/theme/assets/json/130115/solicitud-select.json';
import unidadOptions from '@libs/shared/theme/assets/json/130115/unidad_da.json';

import { ImportacionVehiculosNuevosService } from '../../services/importacion-vehiculos-nuevos.service';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

import {
  Tramite130115State,
  Tramite130115Store,
} from '../../../../estados/tramites/tramite130115.store';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';

import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { Tramite130115Query } from '../../../../estados/queries/tramite130115.query';
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
  productoOpciones: ProductoOpción[] = [];
  /**
   * jest.spyOnCatálogo con valores de fracción arancelaria.
   */

  fraccionCatalogo: Catalogo[] = [];

  /**
   * jest.spyOnCatálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = unidadOptions;
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
   * Arreglo que contiene el catálogo de clasificaciones de régimen.
   * Cada elemento es de tipo `Catalogo`.
   * Utilizado para mostrar las opciones disponibles de clasificación de régimen en la solicitud.
   */
  catalogoClasificacionRegimen: Catalogo[] = [];

  /**
   * Arreglo que contiene los diferentes regímenes disponibles en el catálogo.
   * Cada elemento es de tipo `Catalogo`.
   */
  catalogoRegimenes: Catalogo[] = [];

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;

  /**
   * jest.spyOnOpciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = [];

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
  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130115State;

  /**
   * Indica si el estado ha sido creado.
   * Cuando es `true`, significa que el estado inicial del trámite ya fue establecido.
   */
  esEstadoCreado: boolean = false;
  /**
     * Indica si se debe mostrar el error de clasificación.
     */
    mostrarErrorClasificacion = true;
  
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
   * Identificador del pedimento asociado al trámite actual.
   * 
   * @remarks
   * Este valor representa el código único del pedimento utilizado en el proceso de solicitud.
   * 
   * @example
   * // Acceso al identificador del pedimento
   * console.log(this.idPedimento); // "130115"
   */
  idPedimento: string = "130115";
  

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130115Store: Tramite130115Store,
    private tramite130115Query: Tramite130115Query,
    private importacionVehiculosNuevosService: ImportacionVehiculosNuevosService,
    private consultaioQuery: ConsultaioQuery
  ) {
   this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState)=>{
          this.esFormularioSoloLectura = seccionState.readonly; 
        })
      )
      .subscribe();
  }
  /**
   * jest.spyOnCiclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
    ngOnInit(): void {
    this.tramite130115Store.actualizarEstado({
      solicitud: 'TISOL.I',
      producto: 'CONDMER.N',
      defaultSelect: 'TISOL.I',
      defaultProducto: 'CONDMER.N'
  });

    this.inicializarEstadoFormulario();
    this.opcionesDeBusqueda();
    this.fetchEntidadFederativa();
    this.listaDePaisesDisponibles();
    this.getRegimenes();
    this.getFraccionCatalogo();
    this.enCambioDeBloque(105);
    this.tramite130115Query.select(state => state.tableBodyData)
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
   * Obtiene los catálogos de regímenes y clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getRegimenes(): void {
    this.importacionVehiculosNuevosService.getRegimenes(this.idPedimento).subscribe((data) => {
      this.catalogosArray[0] = data;
    });
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getClasificacionRegimen(valor: string): void {
    this.importacionVehiculosNuevosService.getRegimenClasificacion(this.idPedimento, valor).subscribe((data) => {
      this.catalogosArray[1] = data;
    });
  }

  /**
 * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
 *
 * @returns {void}
 */
  getFraccionCatalogo(): void {
    this.importacionVehiculosNuevosService.getFraccionCatalogoService(this.idPedimento).subscribe((data) => {
      this.fraccionCatalogo = data?.map(item => ({
        ...item,
        descripcion: `${item.clave} - ${item.descripcion}`
      }));
    });
  }

  /**
   * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130111.
   * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
   * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  suscribirseAEstadoDeSolicitud(): void {
    this.tramite130115Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite130115State) => {
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
   * jest.spyOnInicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */

/**
 * Inicializa y configura los formularios reactivos utilizados en el componente de solicitud.
 * 
 * Este método crea y asigna los formularios principales del trámite, mercancia, partidas de la mercancia,
 * modificación de partidas, país y representación, estableciendo sus controles, valores iniciales y validadores.
 * Los valores iniciales se obtienen del estado actual de la sección (`seccionState`).
 * 
 * Además, suscribe el componente al estado de la solicitud y calcula los totales de cantidad y valor en USD.
 * 
 * @remarks
 * - Cada formulario contiene validaciones específicas según los requisitos del trámite.
 * - Algunos validadores personalizados son utilizados para reglas de negocio particulares.
 * 
 * @returns {void} No retorna ningún valor.
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
            SolicitudComponent.validarCatorceEnterosTresDecimales,
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
            SolicitudComponent.validarCatorceEnterosTresDecimales,
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
          [ 
            Validators.required,
            SolicitudComponent.validarSinCaracterAnguloDerecho
          ]
        ],
        justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion, 
          [
            Validators.required,
            SolicitudComponent.validarSinCaracterAnguloDerecho
          ]
        ],
        observaciones: [this.seccionState?.observaciones],
      });
      this.frmRepresentacionForm = this.fb.group({
        entidad: [this.seccionState?.entidad, Validators.required],
        representacion: [this.seccionState?.representacion, Validators.required],
      });
    }
 

 /**
   * formularioTotalCount
   * Crea el formulario reactivo para capturar los totales de las partidas.
   */
  formularioTotalCount(cantidadTotal: string , valorTotalUSD: string): void {
  this.formForTotalCount = this.fb.group({
    cantidadTotal: [{ value: cantidadTotal, disabled: true }],
    valorTotalUSD: [{ value: valorTotalUSD, disabled: true }],
  });
}

  /**
   * jest.spyOnSolicita opciones configurables para los formularios desde archivos JSON.
   */
  opcionesDeBusqueda(): void {
    this.importacionVehiculosNuevosService
      .getSolicitudeOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.opcionesSolicitud = data.options;
          this.tramite130115Store.actualizarEstado({
            solicitud: data.options[0]?.value || '',
            defaultSelect: data.defaultSelect || 'TISOL.I',
          });
        },
        error: (error) =>
          console.error('Error loading solicitude options:', error),
      });

    this.importacionVehiculosNuevosService
      .getProductoOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.productoOpciones = data.options;
          this.tramite130115Store.actualizarEstado({
            producto: data.options[0]?.value || 'CONDMER.N',
            defaultProducto: data.options[0]?.value || 'CONDMER.N',
          });
        },
      });
  }
  /**
   * manejarlaFilaSeleccionada
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(
    filasSeleccionadas: PartidasDeLaMercanciaModelo[]
  ): void {
    this.filaSeleccionada = filasSeleccionadas.length ? filasSeleccionadas : [];
    if (this.filaSeleccionada) {
      this.tramite130115Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }
  /**
   * onModificarPartidaSeleccionada
   * Maneja la modificación de una partida seleccionada.
   * @param partida - La partida que se va a modificar.
   */
  onModificarPartidaSeleccionada(partida: PartidasDeLaMercanciaModelo) :void{
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
    this.tramite130115Store.actualizarEstado({ tableBodyData: this.tableBodyData });

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130115Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
  }

  /**
   * Maneja el evento de cambio en las fechas seleccionadas.
   *
   * Actualiza el estado del store `tramite130115Store` con las nuevas fechas seleccionadas.
   *
   * @param evento - Un arreglo de cadenas que representa las fechas seleccionadas.
   */
  onFechasSeleccionadasChange(evento: string[]): void {
    this.tramite130115Store.actualizarEstado({ fechasSeleccionadas: evento });
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
  const CURRENT_TABLE = this.tramite130115Query.getValue().tableBodyData || [];
  const CANTIDAD = Number(this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value);
  const TOTALUSD = Number(this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value);

  const PRECIOUNITARIO_USD =
    CANTIDAD && !isNaN(CANTIDAD) && !isNaN(TOTALUSD)
      ? (TOTALUSD / CANTIDAD).toFixed(2)
      : '';

  const NEW_ROW: PartidasDeLaMercanciaModelo = {
    id: Date.now().toString(),
    cantidad: this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value,
    totalUSD: this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value,
    descripcion: this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.value,
    unidadDeMedida: this.unidadCatalogo.find(f => String(f.clave) === String(this.mercanciaForm.get('unidadMedida')?.value))?.descripcion || '',
    fraccionFrancelaria: this.fraccionCatalogo.find(f => String(f.clave) === String(this.mercanciaForm.get('fraccion')?.value))?.descripcion || '',
    precioUnitarioUSD: PRECIOUNITARIO_USD
  };

  const UPDATED_TABLE = [...CURRENT_TABLE, NEW_ROW];
  this.tramite130115Store.actualizarEstado({ 
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

this.tramite130115Store.actualizarEstado({
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
      this.tramite130115Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130115Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * Método para obtener la lista de entidades federativas.
   */
  fetchEntidadFederativa(): void {
    this.importacionVehiculosNuevosService
    .getEntidadesFederativasCatalogo(this.idPedimento)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.entidadFederativa = data;
    });
  }
  

  /**
   * Método para obtener la lista de países disponibles.
   */
  listaDePaisesDisponibles(): void {
    this.importacionVehiculosNuevosService
    .getBloqueService(this.idPedimento)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.elementosDeBloque = data;
    });
  }
  /**
   * Método para obtener la lista de países por bloque.
   * Identificador del bloque.
   */
  fetchPaisesPorBloque(_bloqueId: number): void {
    this.importacionVehiculosNuevosService
    .getPaisesPorBloqueService(this.idPedimento, String(_bloqueId))
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.paisesPorBloque = data;
      this.selectRangoDias = this.paisesPorBloque.map(
        (pais: Catalogo) => pais.descripcion
      );
    });
  }
  /**
   * Maneja el cambio de bloque seleccionado.
   * Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.fetchPaisesPorBloque(bloqueId);
  }
  /**
   * @description Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param event Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;

    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.formDelTramite.get('clasificacion')?.setValue('');
      this.mostrarErrorClasificacion = false;
      this.tramite130115Store.actualizarEstado({
        [$event.campo]: VALOR,
        clasificacion: '',
      });
      this.getClasificacionRegimen(VALOR);
    } else {
      this.tramite130115Store.actualizarEstado({ [$event.campo]: VALOR });
      if ($event.campo === 'clasificacion' && VALOR) {
        this.mostrarErrorClasificacion = true;
      }
    }

   if ($event.campo === 'fraccion') {
       this.mercanciaForm.get('unidadMedida')?.setValue('1'); 
       this.tramite130115Store.actualizarEstado({ 'unidadMedida': '1' });
    }

    if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUnidadesMedidaTarifaria("06011008");
    }

    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.getRepresentacionFederalCatalogo(VALOR);
    }
  }

  /**
   *  Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID 
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.importacionVehiculosNuevosService.getUMTService(this.idPedimento, FRACCION_ID).subscribe((data) => {
      this.unidadCatalogo = data as Catalogo[];
      if (this.unidadCatalogo.length > 0) {
        this.mercanciaForm.get('unidadMedida')?.setValue(this.unidadCatalogo[0]?.clave || '');
        this.tramite130115Store.actualizarEstado({ unidadMedida: this.unidadCatalogo[0]?.clave || '' });
      }
    });
  }

  /**
 *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
 * @param cveEntidad 
 */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.importacionVehiculosNuevosService.getRepresentacionFederalCatalogo(this.idPedimento, cveEntidad).subscribe((data) => {
      this.representacionFederal = data as Catalogo[];
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
   * jest.spyOnCiclo de vida de Angular: limpia las suscripciones al destruir el componente.
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
      if (
        typeof control.value === 'string' &&
        (control.value.includes('›') || control.value.includes('^') || control.value.includes('~'))
      ) {
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
  
    /**
     * Valida los formularios de mercancía y partidas de la mercancía antes de permitir la carga de un archivo.
     */
    validarYCargarArchivo(): void {
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
      this.tramite130115Store.actualizarEstado({
         cantidadTotal: String(CANTIDAD_TOTAL),
         valorTotalUSD: String(VALOR_TOTAL_USD)
      });
      this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
        this.tramite130115Store.actualizarEstado({ 
          tableBodyData: this.tableBodyData, 
          mostrarTabla: this.mostrarTabla 
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
     
  }
  