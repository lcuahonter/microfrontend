import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Catalogo, CatalogoServices, ConsultaioQuery, Notificacion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite130110State, Tramite130110Store } from '../../../../estados/tramites/tramites130110.store';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ImportacionNeumaticosComercializarService } from '../../services/importacion-neumaticos-comercializar.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130110/partidas-de-la.json';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130110Query } from '../../../../estados/queries/tramite130110.query';
import fractionValues from '@libs/shared/theme/assets/json/130110/fraccion_arancelaria.json';
import solicitudeSelectVal from '@libs/shared/theme/assets/json/130110/solicitud-select.json';
import unidadOptions from '@libs/shared/theme/assets/json/130110/unidad_da.json';

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
  /*
  * modificarPartidasDelaMercanciaForm
  * Formulario reactivo para modificar las partidas.
  */
  modificarPartidasDelaMercanciaForm!: FormGroup;

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
  paisForm!: FormGroup;

  /**
   * Formulario reactivo para la representación.
   */
  frmRepresentacionForm!: FormGroup;

  /**
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] = PARTIDASDELAMERCANCIA_TABLA;

  /**
   * Datos que se mostrarán en el cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  mostrarTabla = true;

  /**
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;

  /**
   * Datos de configuración de la tabla obtenidos de un archivo JSON.
   */
  public getEstablecimientoTableData = PartidasdelaTable;

  /**
   * Fila seleccionada en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Opciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = [];

  /**
   * Catálogo con valores de fracción arancelaria.
   */
  fraccionCatalogo: Catalogo[] = [];

  /**
   * Catálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];

  /**
   * Catálogo con opciones de descripción de fracción para las partidas de la mercancía.
   */
  fraccionDescripcionPartidasDeLaMercanciaCatalogo: Catalogo[] = [];

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
   * Opciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = [];

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
   * Objeto o constante que contiene los textos utilizados en la aplicación.
   */
  TEXTOS = TEXTOS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es true, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130110State;

  /**
   * Indica si se debe mostrar el error de clasificación.
   */
  mostrarErrorClasificacion = true;
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
   * Catálogo con opciones de clasificación de régimen.
   */
  catalogoClasificacionRegimen: Catalogo[] = [];

  /**
   * Catálogo con opciones de regímenes disponibles.
   */
  catalogoRegimenes: Catalogo[] = [];

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;

  /**
   * Identificador del procedimiento de trámite.
   */
  procedureId: string = "130110"
  
  /**
   * Constructor del componente.
   * Inicializa los formularios y suscripciones necesarias.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130110Store: Tramite130110Store,
    private tramite130110Query: Tramite130110Query,
    private importacionNeumaticosComercializarService: ImportacionNeumaticosComercializarService,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices,
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
   * Ciclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.tramite130110Store.actualizarEstado({
      solicitud: 'TISOL.I',
      producto: 'CONDMER.N',
      defaultSelect: 'TISOL.I',
      defaultProducto: 'CONDMER.N'
  });
    this.inicializarEstadoFormulario();
    this.opcionesDeBusqueda();
    this.fetchEntidadFederativa();
    this.fetchRepresentacionFederal();
    this.listaDePaisesDisponibles();

    this.tramite130110Query.select(state => state.tableBodyData)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.tableBodyData = data || [];
    });
    this.getRegimenes();
    this.getFraccionArancelaria();
    this.getUMTCatalogo();
    this.enCambioDeBloque(105);
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormularios();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   * Utilizado cuando el formulario está en modo solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormularios();
  }

    /**
     * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130111.
     * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
     * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
     */
    suscribirseAEstadoDeSolicitud(): void {
      this.tramite130110Query.selectSolicitud$
        ?.pipe(takeUntil(this.destroyed$))
        .subscribe((data: Tramite130110State) => {
          this.seccionState = data;
        });
    }

  /**
   * Inicializa los formularios reactivos formDelTramite y mercanciaForm.
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
        fraccionDescripcionPartidasDeLaMercancia: [this.seccionState?.fraccionDescripcionPartidasDeLaMercancia],
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
        usoEspecifico: [this.seccionState?.usoEspecifico, Validators.required],
        justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion, [Validators.required]],
        observaciones: [this.seccionState?.observaciones],
      });
      this.frmRepresentacionForm = this.fb.group({
        entidad: [this.seccionState?.entidad, Validators.required],
        representacion: [this.seccionState?.representacion, Validators.required],
      });
    }



 /**
   * Crea el formulario reactivo para capturar los totales de las partidas.
   * @param cantidadTotal - Cantidad total de todas las partidas.
   * @param valorTotalUSD - Valor total en USD de todas las partidas.
   */
  formularioTotalCount(cantidadTotal: string , valorTotalUSD: string): void {
  this.formForTotalCount = this.fb.group({
    cantidadTotal: [{ value: cantidadTotal, disabled: true }],
    valorTotalUSD: [{ value: valorTotalUSD, disabled: true }],
  });
}

  /**
   * Solicita opciones configurables para los formularios desde archivos JSON.
   */
  opcionesDeBusqueda(): void {
    this.importacionNeumaticosComercializarService
      .getSolicitudeOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.opcionesSolicitud = data.options;
          this.tramite130110Store.actualizarEstado({
            solicitud: data.options[0]?.value || '',
            defaultSelect: data.defaultSelect || 'TISOL.I',
          });
        },
        error: (error) =>
          console.error('Error loading solicitude options:', error),
      });

    this.importacionNeumaticosComercializarService
      .getProductoOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.productoOpciones = data.options;
          this.tramite130110Store.actualizarEstado({
            producto: data.options[0]?.value || 'CONDMER.N',
            defaultProducto: data.options[0]?.value || 'CONDMER.N',
          });
        },
      });
  }

  /**
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * @param filasSeleccionadas - Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(filasSeleccionadas: PartidasDeLaMercanciaModelo[]): void {
    this.filaSeleccionada = filasSeleccionadas.length
      ? filasSeleccionadas
      : [];
    if (this.filaSeleccionada) {
      this.tramite130110Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
  }

  	
	  /**
	   * Maneja la modificación de una partida seleccionada.
	   * Carga los datos de la partida seleccionada en el formulario de modificación.
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
	   * Maneja la modificación de una partida existente en la tabla.
	   * Actualiza los datos de la tabla y recalcula los totales después de la modificación.
	   * @param partida - La partida que se va a modificar.
	   */
	  onPartidaModificada(partida: PartidasDeLaMercanciaModelo): void {
	    this.tableBodyData = this.tableBodyData.map(row =>
	      row.id === partida.id ? { ...row, ...partida } : row
	    );
	    this.tramite130110Store.actualizarEstado({ tableBodyData: this.tableBodyData });
	    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
	      (sum, row) => sum + Number(row.cantidad),
	      0
	    );
	    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
	      (sum, row) => sum + Number(row.totalUSD),
	      0
	    );
	    this.tramite130110Store.actualizarEstado({
	      cantidadTotal: String(CANTIDAD_TOTAL),
	      valorTotalUSD: String(VALOR_TOTAL_USD)
	    });
	    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
	  }


  /**
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
  ['cantidad', 'valorFacturaUSD'].forEach(controlName => {
    const CONTROL = this.mercanciaForm.get(controlName);
    if (CONTROL) {
      CONTROL.markAsTouched();
      CONTROL.updateValueAndValidity();
    }
  });
  
  if (this.mercanciaForm.get('cantidad')?.invalid ||
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
    'descripcionPartidasDeLaMercancia'
  ].forEach(controlName => {
    const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
    if (CONTROL) {
      CONTROL.markAsTouched();
      CONTROL.updateValueAndValidity();
    }
  });
  if (
    this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.invalid ||
    this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.invalid ||
    this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.invalid
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

  const CURRENT_TABLE = this.tramite130110Query.getValue().tableBodyData || [];
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
    fraccionDescripcionPartidasDeLaMercancia: this.fraccionCatalogo.find(f => String(f.id) === String(this.partidasDelaMercanciaForm.get('fraccionDescripcionPartidasDeLaMercancia')?.value))?.descripcion || '',
    precioUnitarioUSD: PRECIOUNITARIO_USD
  };
  const UPDATED_TABLE = [...CURRENT_TABLE, NEW_ROW];
  this.tramite130110Store.actualizarEstado({ 
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
this.tramite130110Store.actualizarEstado({
  cantidadTotal: String(CANTIDAD_TOTAL),
  valorTotalUSD: String(VALOR_TOTAL_USD)
});
  this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
  this.partidasDelaMercanciaForm.reset();
  this.mostrarErroresPartidas = false;
}



  /**
   * Navega para modificar una partida específica y actualiza el estado global.
   * Utiliza la fila seleccionada para habilitar la funcionalidad de modificación.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130110Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130110Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
  }

  /**
   * Obtiene los catálogos de regímenes y clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getRegimenes(): void {
    this.importacionNeumaticosComercializarService.getRegimenes(this.procedureId).subscribe((data) => {
      this.catalogosArray[0] = data;
    });
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getClasificacionRegimen(valor: string): void {
    this.importacionNeumaticosComercializarService.getRegimenClasificacion(this.procedureId, valor).subscribe((data) => {
      this.catalogosArray[1] = data;
    });
  }

  /**  
   * Obtiene el catálogo de fracciones arancelarias desde el servicio.
    * Actualiza la propiedad del componente con los datos obtenidos.
    */
 getFraccionArancelaria(): void {
   this.importacionNeumaticosComercializarService.getFraccionesArancelarias(this.procedureId).subscribe((data) => {
     this.fraccionCatalogo = data || [];
   });
 }

 /**  
  * Obtiene el catálogo de unidades de medida desde el servicio.
  * Actualiza la propiedad del componente con los datos obtenidos.
  */
 getUMTCatalogo(): void {
   this.importacionNeumaticosComercializarService.getUMTCatalogo(this.procedureId).subscribe((data) => {
     this.unidadCatalogo = data || [];
   });
 }

 /**
  * Maneja el cambio de fechas seleccionadas y actualiza el estado del store.
  * @param evento - Array de fechas seleccionadas.
  */
 /**
  * Maneja el cambio de fechas seleccionadas y actualiza el estado del store.
  * @param evento - Array de fechas seleccionadas.
  */
 onFechasSeleccionadasChange(evento: string[]): void {
  this.tramite130110Store.actualizarEstado({ fechasSeleccionadas: evento });
 }

  /**
   * Método para obtener la lista de entidades federativas.
   */
  fetchEntidadFederativa(): void {
    this.importacionNeumaticosComercializarService
      .getEntidadFederativa(this.procedureId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.entidadFederativa = data;
      });
  }

  /**
   * Método para obtener la lista de representaciones federales.
   */
  fetchRepresentacionFederal(): void {
    this.importacionNeumaticosComercializarService
    .getRepresentacionFederal(this.procedureId,"SIN")
    .subscribe((data) => {
      this.representacionFederal = data;
    });
  }

  /**
   * Método para obtener la lista de países disponibles.
   */
  listaDePaisesDisponibles(): void {
    this.importacionNeumaticosComercializarService
      .getBloque(this.procedureId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.elementosDeBloque = data;
      });
  }

  /**
   * Método para obtener la lista de países por bloque.
   * @param _bloqueId - Identificador del bloque.
   */
  fetchPaisesPorBloque(_bloqueId: number): void {
    this.importacionNeumaticosComercializarService
      .getPaisesPorBloque(this.procedureId, String(_bloqueId))
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
   * @param bloqueId - Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.fetchPaisesPorBloque(bloqueId);
  }

  /**
   * Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param $event - Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;

    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.formDelTramite.get('clasificacion')?.setValue('');
      this.mostrarErrorClasificacion = false;
      this.tramite130110Store.actualizarEstado({
        [$event.campo]: VALOR,
        clasificacion: ''
      });
      this.getClasificacionRegimen(VALOR);
    } else {
      this.tramite130110Store.actualizarEstado({ [$event.campo]: VALOR });
      if ($event.campo === 'clasificacion' && VALOR) {
        this.mostrarErrorClasificacion = true;
      }
    }

    if ($event.campo === 'fraccion') {
       this.mercanciaForm.get('unidadMedida')?.setValue('1'); 
       this.tramite130110Store.actualizarEstado({ 'unidadMedida': '1' });


    }
  }

  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
   * @returns {boolean} true si el botón debe estar deshabilitado, false en caso contrario.
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true;
    }
    return disabled;
  }

  /**
   * Ciclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Valida que un string no contenga el carácter de ángulo derecho (›).
   * @param control - Control de formulario a validar.
   * @returns {ValidationErrors | null} Objeto de error si contiene el carácter, null si es válido.
   */
  static validarSinCaracterAnguloDerecho(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value === 'string' && control.value.includes('›')) {
      return { validarSinCaracterAnguloDerecho: true };
    }
    return null;
  }

  /**
   * Valida que un número tenga como máximo tres decimales.
   * @param control - Control de formulario a validar.
   * @returns {ValidationErrors | null} Objeto de error si tiene más de tres decimales, null si es válido.
   */
  static validarNumeroTresDecimales(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') { return null; }

    if (!/^\d+(\.\d+)?$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (/^\d+\.\d{4,}$/.test(VALOR)) {
      return { maximoTresDecimales: true };
    }

    return null;
  }

  /**
   * Valida que un número tenga como máximo 14 enteros y 3 decimales.
   * @param control - Control de formulario a validar.
   * @returns {ValidationErrors | null} Objeto de error si no cumple con el formato, null si es válido.
   */
  static validarCatorceEnterosTresDecimales(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') { return null; }

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
      ['cantidad', 'valorFacturaUSD'].forEach(controlName => {
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
        'descripcionPartidasDeLaMercancia'
      ].forEach(controlName => {
        const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
        if (CONTROL) {
          CONTROL.markAsTouched();
          CONTROL.updateValueAndValidity();
        }
      });
      if (
        this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.invalid ||
        this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.invalid ||
        this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.invalid
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
          tamanioModal: 'modal-sm'
        };
        this.mostrarNotificacion = true;
        return;
      }
      this.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal();
    }

    /**
     * Método que se ejecuta cuando se eliminan partidas de la tabla.
     * Actualiza los datos de la tabla y recalcula los totales.
     * @param ids - Array de identificadores de las partidas a eliminar.
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
    this.tramite130110Store.actualizarEstado({
       cantidadTotal: String(CANTIDAD_TOTAL),
       valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
      this.tramite130110Store.actualizarEstado({ 
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