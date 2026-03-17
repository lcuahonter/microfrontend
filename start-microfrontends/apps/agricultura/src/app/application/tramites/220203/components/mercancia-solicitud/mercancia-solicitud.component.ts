import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, AlertComponent, REGEX_DESCRIPCION, NUMERICO_CON_PUNTO_REGEX } from '@libs/shared/data-access-user/src';
import { CatalogoData, Detalles, FilaSolicitud } from '../../models/220203/importacion-de-acuicultura.module';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AcuiculturaQuery } from '../../estados/sanidad-certificado.query';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { CommonModule } from '@angular/common';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { CatalogosService } from '../../services/220203/catalogos/catalogos.service';
import { RegistroSolicitudService } from '../../services/220203/registro-solicitud/registro-solicitud.service';
import { ERROR_FORMA_ALERT } from '../../constantes/220203/importacion-de-acuicultura.enum';

/**
 * Componente para gestionar la solicitud de mercancías en el trámite de importación de acuicultura 220203.
 * Proporciona funcionalidades para agregar, editar y eliminar detalles de mercancías.
 * 
 * @export
 * @class MercanciaSolicitudComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-mercancia-solicitud',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    CommonModule,
    NotificacionesComponent,
    AlertComponent
],
  templateUrl: './mercancia-solicitud.component.html',
  styleUrl: './mercancia-solicitud.component.scss',
})
export class MercanciaSolicitudComponent implements OnInit {
  /**
   * Detalles seleccionados de la tabla para operaciones de edición o eliminación.
   * @type {Detalles}
   * @memberof MercanciaSolicitudComponent
   */
  detallesSeleccionados: Detalles[] = [];

  /**
   * Evento emitido al cerrar el formulario de mercancía.
   * @type {EventEmitter<void>}
   * @memberof MercanciaSolicitudComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Datos de la mercancía almacenados en el store.
   * @type {FilaSolicitud}
   * @memberof MercanciaSolicitudComponent
   */
  datosMercanciaStore: FilaSolicitud = {} as FilaSolicitud;

  /**
   * Grupo de formularios para los datos principales de la mercancía.
   * @type {FormGroup}
   * @memberof MercanciaSolicitudComponent
   */
  mercanciaGroup!: FormGroup;

  /**
 * Indica si el formulario tiene errores de validación.
 *
 * Se utiliza para mostrar/ocultar el alert de errores en el modal.
 */
  esFormaValido: boolean = false;

  /**
   * Mensaje de error que se muestra cuando la validación de formularios falla.
   * @public
   * @readonly
   * @type {string}
   * @memberof SanidadCertificadoComponent
   */
  public readonly FORM_ERROR_ALERT = ERROR_FORMA_ALERT;

  /**
   * Grupo de formularios para los detalles adicionales de la mercancía.
   * @type {FormGroup}
   * @memberof MercanciaSolicitudComponent
   */
  detallesGroup!: FormGroup;

  /**
   * Datos de catálogos necesarios para los selectores del formulario.
   * @type {CatalogoData}
   * @memberof MercanciaSolicitudComponent
   */
  detallesCatalogo: CatalogoData = {} as CatalogoData;

  /**
   * Bandera que indica si se debe mostrar la confirmación para eliminar datos de la tabla.
   * @type {boolean}
   * @memberof MercanciaSolicitudComponent
   */
  eliminarDatosTabla: boolean = false;

  /**
   * Tipo de selección para la tabla principal.
   * @type {TablaSeleccion}
   * @memberof MercanciaSolicitudComponent
   */
  tipoSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla de detalles.
   * @type {ConfiguracionColumna<Detalles>[]}
   * @memberof MercanciaSolicitudComponent
   */
  configuracionColumnas: ConfiguracionColumna<Detalles>[] = [
    { encabezado: 'Nombre científico', clave: (fila) => fila.nombreCientifico, orden: 1 },
  ];

  /**
   * Datos del cuerpo de la tabla de detalles.
   * @type {Detalles[]}
   * @memberof MercanciaSolicitudComponent
   */
  cuerpoTablaDetalle: Detalles[] = [];

  /**
   * Subject para controlar la destrucción de suscripciones y evitar memory leaks.
   * @type {Subject<void>}
   * @private
   * @memberof MercanciaSolicitudComponent
   */
  private readonly DESTROY_NOTIFIER$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   * @memberof MercanciaSolicitudComponent
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   * @public
   * @memberof MercanciaSolicitudComponent
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el formulario tiene errores de validación.
   *
   * Se utiliza para mostrar/ocultar el alert de errores en el modal.
   */
  esFormaInValido: boolean = false;

  /**
   * Constructor del componente MercanciaSolicitudComponent.
   * Inicializa los servicios necesarios y obtiene los catálogos requeridos.
   * 
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaServices - Servicio para operaciones de importación de acuicultura
   * @param {FormBuilder} fb - Constructor de formularios de Angular
   * @param {AcuiculturaStore} acuiculturaStore - Store para el manejo del estado de acuicultura
   * @param {AcuiculturaQuery} acuiculturaQuery - Query para acceder al estado de acuicultura
   * @memberof MercanciaSolicitudComponent
   */
  constructor(
    private readonly importacionDeAcuiculturaServices: ImportacionDeAcuiculturaService, 
    private readonly fb: FormBuilder,
    private readonly acuiculturaStore: AcuiculturaStore,
    private readonly acuiculturaQuery: AcuiculturaQuery,
    private catalogosService: CatalogosService,
    private registroSolicitudService: RegistroSolicitudService
  ) {
    this.obtenerCatalogoRestricciones();
    this.getFraccionArancelariaLista();
    this.getCatalogoUnidadesMedidaComerciales();
    this.getCatalogoUsosMercancia();
    this.getcatalogosDatospaisOrigenLista()

    this.importacionDeAcuiculturaServices.obtenerDatos().pipe(takeUntil(this.DESTROY_NOTIFIER$)).subscribe((datos) => {
      console.log('datos mercancia obtener datos', JSON.stringify(datos));
      this.datosMercanciaStore = datos.selectedmercanciaGroupDatos || {} as FilaSolicitud;
    })
  }
  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa los grupos de formularios principales del componente.
   * 
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.mercanciaGroup = this.createMercanciaGroup();
    this.detallesGroup = this.createDetallesGroup();
  }

  /**
 * Obtiene el catálogo de restricciones del servicio correspondiente.
 * Realiza una llamada al servicio de catálogos para obtener las restricciones
 * asociadas al trámite 220202.
 * Los datos obtenidos se almacenan en la propiedad tipoRequisitoList.
 * La suscripción se cancela automáticamente cuando el componente se destruye
 * mediante el uso de takeUntil.
 * @returns void
 */
  obtenerCatalogoRestricciones(): void {
    this.catalogosService.obtieneCatalogoRestricciones(220203)
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data): void => {
        this.detallesCatalogo.tipoRequisitoList = data.datos ?? [];
      });
  }

  /**
 * @description Obtiene la lista de fraccion arancelaria desde un archivo JSON.
 * @method getFraccionArancelariaLista
 * @returns {void}
 */
  getFraccionArancelariaLista(): void {
    this.catalogosService.obtieneCatalogoFraccionesArancelarias(220203)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {
          this.detallesCatalogo.arancelariaList = data.datos ?? [];
        }
      );

  }

  /**
  * @description Obtiene la lista de fraccion arancelaria desde un archivo JSON.
  * @method getNicoFraccionArancelariaLista
  * @returns {void}
  */
  getNicoFraccionArancelariaLista(fraccionArancelaria: string): void {
    this.catalogosService.obtieneCatalogoNicoFraccionArancelaria(220203, fraccionArancelaria)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {

          this.detallesCatalogo.nicoList = data.datos ?? [];
        }
      );
  };

  /**
 * Maneja la selección de un elemento del catálogo NICO.
 * Busca el elemento NICO seleccionado en la lista de catálogos y actualiza
 */
  nicoSeleccionado(): void {
    console.log('nicoSeleccionado', this.mercanciaGroup.get('nico')?.value);
    this.registroSolicitudService.obtieneNicoDescripcion(220203, this.mercanciaGroup.get('fraccionArancelaria')?.value, this.mercanciaGroup.get('nico')?.value)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {
          this.mercanciaGroup.patchValue({
            descripcionNico: data.datos ?? 'Sin descripción'
          });
        }
      );
  };

  /**
* @description Obtiene la descripcion de unidad de medida.
* @method getUnidadMedida
* @returns {void}
*/
  getUnidadMedida(): void {
    this.registroSolicitudService.obtieneUnidadMedida(220203, this.mercanciaGroup.get('fraccionArancelaria')?.value)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {

          this.mercanciaGroup.patchValue({
            umt: data.datos?.clave ?? 'sin clave',
            descripcionUMT: data.datos?.descripcion ?? 'Sin descripción'
          });
        }
      );
  };

  /**
   * @description Obtiene la lista de unidades de medida comerciales.
   * @method getCatalogoUnidadesMedidaComerciales
   * @returns {void}
   */
  getCatalogoUnidadesMedidaComerciales(): void {
    this.catalogosService.obtieneCatalogoUnidadesMedidaComerciales(220203)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {
          this.detallesCatalogo.umcList = data.datos ?? [];
        }
      );

  };

  /**
 * @description Obtiene la lista de catalogo de usos de mercancia.
 * @method getCatalogoUsosMercancia
 * @returns {void}
 */
  getCatalogoUsosMercancia(): void {
    this.catalogosService.obtieneCatalogoUsosMercancia(220203)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {
          this.detallesCatalogo.usoList = data.datos ?? [];
        }
      );

  };


  /**
 * @description Realiza una petición para obtener el catálogo de pais origen.
 * @method getcatalogosDatospaisOrigenLista
 * @returns {void}
 */
  getcatalogosDatospaisOrigenLista(): void {
    this.catalogosService.obtieneCatalogoPaises(220203)
      .pipe(
        takeUntil(this.DESTROY_NOTIFIER$)
      ).subscribe(
        (data): void => {
          this.detallesCatalogo.paisDeOrigenList = data.datos ?? [];
          this.detallesCatalogo.paisDeProcedenciaList = data.datos ?? [];

        }
      );

  }



  /**
   * Obtiene los datos del catálogo de puntos y fracciones arancelarias.
   * Carga los datos necesarios para los selectores de tipo de requisito y fracción arancelaria.
   * 
   * @public
   * @method obtenerCatalogosTransporte
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  public obtenerCatalogosTransporte(): void {
    this.importacionDeAcuiculturaServices.obtenerDetallesDelCatalogo('punto.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        // this.detallesCatalogo.tipoRequisitoList = data.data as Catalogo[];
        this.detallesCatalogo.arancelariaList = data.data as Catalogo[];
      }, (_error) => {
        // this.detallesCatalogo.tipoRequisitoList = [];
          this.detallesCatalogo.arancelariaList = [];
      });
  }

  /**
   * Obtiene los datos del catálogo UMC (Unidad de Medida Comercial) y otros catálogos relacionados.
   * Carga las unidades de medida, usos, países de origen y procedencia necesarios para el formulario.
   * 
   * @public
   * @method obtenerUMCCatalogosTransporte
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  public obtenerUMCCatalogosTransporte(): void {
    this.importacionDeAcuiculturaServices.obtenerDetallesDelCatalogo('umc.json')
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((data) => {
        this.detallesCatalogo.umcList = data.data as Catalogo[];
        this.detallesCatalogo.usoList = data.data as Catalogo[];
        this.detallesCatalogo.paisDeOrigenList = data.data as Catalogo[];
        this.detallesCatalogo.paisDeProcedenciaList = data.data as Catalogo[];
      }, (_error) => { 
        this.detallesCatalogo.usoList = [];
        this.detallesCatalogo.paisDeOrigenList = [];    
        this.detallesCatalogo.paisDeProcedenciaList = [];
        this.detallesCatalogo.umcList = [];
      });
  }
  /**
   * Actualiza valores específicos en el formulario principal basado en el campo seleccionado.
   * Maneja la lógica de actualización automática de campos dependientes.
   * 
   * @public
   * @method setValoresStore
   * @param {FormGroup} [form] - El formulario que contiene los valores (opcional)
   * @param {string} [campo] - El campo específico a actualizar en el store
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  public setValoresStore(
    form?: FormGroup,
    campo?: string,
  ): void {
    if (campo === 'fraccionArancelaria') {
      this.registroSolicitudService.obtieneFraccionArancelariaDescripcion(220203, this.mercanciaGroup.get('fraccionArancelaria')?.value)
        .pipe(
          takeUntil(this.DESTROY_NOTIFIER$)
        ).subscribe(
          (data): void => {
            this.mercanciaGroup.patchValue({
              descripcionFraccion: data.datos?.descripcion ?? 'Sin descripción',
              idDescripcionFraccion: data.datos?.id_fraccion ?? 0,
              nico: '',
              descripcionNico: ''
            });
            this.getNicoFraccionArancelariaLista(this.mercanciaGroup.get('fraccionArancelaria')?.value);
            this.getUnidadMedida();
          }
        );      
    }
    else if (campo === 'nico') {
      this.nicoSeleccionado();
    }

  }
  /**
   * Guarda los valores del formulario de detalles en el store de acuicultura.
   * Agrega el nuevo detalle al estado actual del grupo de mercancías.
   * 
   * @public
   * @method setValoresDetalleStore
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  public setValoresDetalleStore(): void {
    // Obtiene el estado actual del grupo de mercancía desde el query
    const ESTADO_ACTUAL = this.acuiculturaQuery.getValue().mercanciaGroup;
    const VALOR = this.detallesGroup.getRawValue();
    ESTADO_ACTUAL.push(VALOR);
  }
  /**
   * Agrega una nueva fila de detalle a la tabla de detalles.
   * Toma los valores del formulario de detalles y los añade a la tabla local.
   * 
   * @public
   * @method agregarFilaDetalle
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  agregarFilaDetalle(): void {
    const nuevoDetalle = this.detallesGroup.getRawValue() as Detalles;
    if (nuevoDetalle.nombreCientifico || nuevoDetalle.nombreCientifico.trim() != '') {
      this.cuerpoTablaDetalle = [...this.cuerpoTablaDetalle, nuevoDetalle];
    this.detallesGroup.reset();
    }
  }
  /**
   * Crea el grupo de formularios principal para los datos de mercancía.
   * Inicializa el formulario con los datos almacenados en el store.
   * 
   * @public
   * @method createMercanciaGroup
   * @memberof MercanciaSolicitudComponent
   * @returns {FormGroup} El grupo de formularios configurado para mercancía
   */
  public createMercanciaGroup(): FormGroup {
    const MERCANCIA_DATA = this.datosMercanciaStore || {}
    return this.buildMercanciaFormGroup(MERCANCIA_DATA);
  }

  /**
   * Construye el grupo de formularios para los datos de mercancía con validaciones.
   * Define todos los campos necesarios con sus validadores correspondientes.
   * 
   * @private
   * @method buildMercanciaFormGroup
   * @param {FilaSolicitud} MERCANCIA_DATA - Los datos de mercancía para inicializar el formulario
   * @memberof MercanciaSolicitudComponent
   * @returns {FormGroup} El grupo de formularios construido con validaciones
   */
  private buildMercanciaFormGroup(MERCANCIA_DATA: FilaSolicitud): FormGroup {
    if (MERCANCIA_DATA.fraccionArancelaria !== undefined && MERCANCIA_DATA.fraccionArancelaria !== '') {
      this.getNicoFraccionArancelariaLista(MERCANCIA_DATA.fraccionArancelaria);
    }
    return this.fb.group({
      tipoRequisito: [MERCANCIA_DATA.tipoRequisito || '', Validators.required],
      requisito: [MERCANCIA_DATA.requisito || '', Validators.required],
      numeroCertificadoInternacional: [MERCANCIA_DATA.numeroCertificadoInternacional || '', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      numeroOficioCasoEspecial: [MERCANCIA_DATA.numeroOficioCasoEspecial || ''],
      fraccionArancelaria: [MERCANCIA_DATA.fraccionArancelaria || '', Validators.required],
      descripcionFraccion: [{ value: MERCANCIA_DATA.descripcionFraccion || '', disabled: true }, Validators.required],
      idDescripcionFraccion: [MERCANCIA_DATA.idDescripcionFraccion || 0],
      nico: [MERCANCIA_DATA.nico || '', Validators.required],
      descripcionNico: [{value: MERCANCIA_DATA.descripcionNico || '', disabled: true}, Validators.required],
      descripcion: [MERCANCIA_DATA.descripcion || '', [Validators.required, Validators.maxLength(1000)]],
      cantidadUMT: [MERCANCIA_DATA.cantidadUMT || '', [Validators.required, Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      umt: [{ value: MERCANCIA_DATA.umt || '', disabled: true }, Validators.required],
      descripcionUMT: [{ value: MERCANCIA_DATA.descripcionUMT || '', disabled: true }, Validators.required],
      cantidadUMC: [MERCANCIA_DATA.cantidadUMC || '', [Validators.required, Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      umc: [MERCANCIA_DATA.umc || '', Validators.required],
      uso: [MERCANCIA_DATA.uso || '', Validators.required],
      numeroDeLote: [MERCANCIA_DATA.numeroDeLote || '', Validators.required],
      faseDeDesarrollo: [MERCANCIA_DATA.faseDeDesarrollo || '', Validators.required],
      especie: [MERCANCIA_DATA.especie || '', Validators.required],
      paisDeOrigen: [MERCANCIA_DATA.paisDeOrigen || '', Validators.required],
      paisDeProcedencia: [MERCANCIA_DATA.paisDeProcedencia || '', Validators.required],
    });
  }
  /**
   * Crea el grupo de formularios para los detalles adicionales de la mercancía.
   * Inicializa un formulario simple para capturar información científica de la mercancía.
   * 
   * @public
   * @method createDetallesGroup
   * @memberof MercanciaSolicitudComponent
   * @returns {FormGroup} El grupo de formularios para detalles
   */
  public createDetallesGroup(): FormGroup {
    this.cuerpoTablaDetalle = this.datosMercanciaStore.lista_detalle_mercancia || []
    return this.fb.group({
      nombreCientifico: [''],
    });
  }
  /**
   * Elimina la fila actual del formulario y cierra el modal.
   * Resetea el formulario principal y emite el evento de cierre.
   * 
   * @public
   * @method eliminarFila
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  eliminarFila(): void {
    this.mercanciaGroup.reset();
    this.cerrar.emit();
  }
  /**
   * Limpia todos los formularios del componente.
   * Resetea tanto el formulario principal como el de detalles.
   * 
   * @public
   * @method onLimpiarDestinatario
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  onLimpiarDestinatario(): void {
    this.mercanciaGroup.reset();
    this.detallesGroup.reset();
  }
  /**
   * Agrega una nueva fila de mercancía al store y cierra el modal.
   * Maneja la lógica de agregar o actualizar una mercancía existente.
   * 
   * @public
   * @method agregarFila
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  agregarFila(): void {
    if (this.mercanciaGroup.invalid) {
      this.mercanciaGroup.markAllAsTouched();
      this.esFormaInValido = true;
    }

    else {
      const NUEVA_MERCANCIA: FilaSolicitud = this.mercanciaGroup.getRawValue();
      NUEVA_MERCANCIA.lista_detalle_mercancia = this.cuerpoTablaDetalle;
    const ESTADO_ACTUAL = this.acuiculturaQuery.getValue().mercanciaGroup;
    let FILTERED_VALOR: FilaSolicitud[] = [];
    
    if (this.datosMercanciaStore) {
      FILTERED_VALOR = ESTADO_ACTUAL.filter(
        (item) => item !== this.datosMercanciaStore
      );
    } else {
      FILTERED_VALOR = ESTADO_ACTUAL;
    }
    
      const NUEVA_MERCANCIA_LIST = [
        ...(FILTERED_VALOR || []),
        NUEVA_MERCANCIA
      ].map((item, index) => ({
        ...item,
        noPartida: String(index + 1)
      }));
    
      this.acuiculturaStore.actualizarMercanciaGroup(NUEVA_MERCANCIA_LIST);
    this.detallesGroup.reset();
    this.cerrar.emit();
  }
  }
  /**
   * Inicia el proceso de eliminación de una fila de detalle.
   * Muestra una notificación de confirmación antes de proceder con la eliminación.
   * 
   * @public
   * @method eliminarFilaDetalle
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  eliminarFilaDetalle(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Eliminar datos de la tabla',
      mensaje: '¿Está seguro que desea eliminar estos datos?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };

    this.eliminarDatosTabla = true;
  }
  /**
   * Ejecuta la eliminación de datos de la tabla basado en la confirmación del usuario.
   * Si el usuario confirma, elimina el elemento seleccionado de la tabla de detalles.
   * 
   * @public
   * @method eliminarPedimentoDatos
   * @param {boolean} borrar - Indica si se debe proceder con la eliminación
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  eliminarPedimentoDatos(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatosTabla = false;
      this.cuerpoTablaDetalle = this.cuerpoTablaDetalle.filter(
        item => !this.detallesSeleccionados.includes(item)
      );
    } else {
      this.eliminarDatosTabla = false;
    }
  }
  /**
   * Maneja la selección de elementos en la tabla de detalles.
   * Almacena el primer elemento seleccionado para operaciones posteriores.
   * 
   * @public
   * @method seleccionTabla
   * @param {Detalles[]} event - Array de detalles seleccionados de la tabla
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  seleccionTabla(event: Detalles[]): void {
    this.detallesSeleccionados = event || {} as Detalles;
  }

  /**
 * Validador personalizado para verificar si el número tiene más de 3 decimales
 * @param control - Control del formulario a validar
 * @returns ValidationErrors si tiene más de 3 decimales, null si es válido
 */
  static maxDecimalsValidator(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const STRING_VALUE = VALUE.toString();
    const DECIMAL_PART = STRING_VALUE.split('.')[1];

    if (DECIMAL_PART && DECIMAL_PART.length > 3) {
      return { maxDecimals: true };
    }

    return null;
  }

  /**
   * Validador personalizado para verificar si el número tiene más de 12 números enteros
   * @param control - Control del formulario a validar
   * @returns ValidationErrors si tiene más de 12 números enteros, null si es válido
   */
  static maxWholeNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const STRING_VALUE = VALUE.toString();
    const WHOLE_PART = STRING_VALUE.split('.')[0];

    if (WHOLE_PART.length > 12) {
      return { maxWholeNumbers: true };
    }

    return null;
  }

  /**
 * Método del ciclo de vida de Angular que se llama justo antes de destruir el componente.
 * Emite una señal a través del observable `destroy$` para notificar a los suscriptores que deben limpiar recursos y cancelar suscripciones.
 * Posteriormente, completa el observable para evitar fugas de memoria.
 */
  ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }
}
