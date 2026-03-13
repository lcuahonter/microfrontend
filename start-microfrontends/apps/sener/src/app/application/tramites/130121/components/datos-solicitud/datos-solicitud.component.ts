

import { Catalogo, ConsultaioQuery, REGEX_CARACTERES_NO_PERMITIDOS, REGEX_NUMERO_DECIMAL_ENTERO, REGEX_TEXTO_PREFIJO, REG_X } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DATOS_INPUT_FIELDS, MERCANCIA_INPUT_VALUES } from '../../../../shared/constantes/valores-constantes.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite130121State, Tramite130121Store } from '../../estados/tramites/tramites130121.store';
import {DatosDeLaMercanciaComponent} from'../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import {DatosDelTramiteComponent} from'../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import acotacionOptions from '@libs/shared/theme/assets/json/130121/acotacion.json';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { PaisDeOrigenComponent } from '../../../../shared/components/pais-de-origen/pais-de-origen.component';
import {PartidasDeLaMercanciaComponent} from'../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { PermisoDeHidrocarburosService } from '../../services/permiso-de-hidrocarburos.service';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TITULO_ORIGEN } from '../../../../shared/constantes/pais-titulo.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130121Query } from '../../estados/queries/tramite130121.query';
import mercanciaCatalogoVal from '@libs/shared/theme/assets/json/130121/datos-fraccion_arancelaria.json';
import nicoCatalogoVal from '@libs/shared/theme/assets/json/130121/nico.json';
import solicitudeSelectVal from '@libs/shared/theme/assets/json/130121/solicitud-select.json';
import unidadOptions from '@libs/shared/theme/assets/json/130121/unidad-medida.json';


/**
 * Componente de Solicitud para gestionar la solicitud de exportación de minerales de hierro.
 * Este componente permite la creación, edición y visualización de la solicitud.
 * 
 * @example
 * <app-datos-solicitud></app-datos-solicitud>
 */
@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.scss'],
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {

  /** 
* Formulario de partidas de la mercancía.
* @type {FormGroup} Formulario que contiene los campos relacionados con las partidas de la mercancía.
*/
  partidasDelaMercanciaForm!: FormGroup;

  /**
 * Formulario del trámite.
 * @type {FormGroup} Formulario que contiene los campos relacionados con el trámite.
 */
  formDelTramite!: FormGroup;

  /**
   * Formulario de la mercancía.
   * @type {FormGroup} Formulario que contiene los campos relacionados con la mercancía.
   */
  mercanciaForm!: FormGroup;

  /**
   * Formulario para el conteo total.
   * @type {FormGroup} Formulario que se usa para gestionar el conteo total de la mercancía.
   */
  formForTotalCount!: FormGroup;

  /**
   * Formulario del país.
   * @type {FormGroup} Formulario que contiene la información relacionada con el país.
   */
  paisForm!: FormGroup;
    /**
    * Componente de Datos de la Solicitud.
    * Referencia al componente hijo que maneja los datos específicos de la solicitud.
    */
  @ViewChild(DatosDelTramiteComponent)
      datosDeLaSolicitudComponent!: DatosDelTramiteComponent;
   
 /**
    * Componente de Datos de la Solicitud.
    * Referencia al componente hijo que maneja los datos específicos de la solicitud.
    */
 @ViewChild(DatosDeLaMercanciaComponent)
 datosDeLaMercanciaComponent!:DatosDeLaMercanciaComponent;

 /**
    * Componente de Datos de la Solicitud.
    * Referencia al componente hijo que maneja los datos específicos de la solicitud.
    */
 @ViewChild(PartidasDeLaMercanciaComponent)
 partidasDeLaMercanciaComponent!:PartidasDeLaMercanciaComponent;

 



  /**
   * Formulario de representación.
   * @type {FormGroup} Formulario utilizado para representar los datos de la mercancía.
   */
  frmRepresentacionForm!: FormGroup;
  /**
   * Identificador del procedimiento.
   * @type {number} Valor numérico que representa el ID del procedimiento.
   * Este ID se utiliza para identificar el trámite específico en el sistema.
   */

  idProcedominto: number = 130121;

   /**
   * Formulario reactivo para capturar el estado del manifiesto de aceptación (checkbox).
   * Este formulario se utiliza para almacenar y gestionar el valor del checkbox de aceptación en el store.
   */
  manifestoForm!: FormGroup;

  /**
   * tableHeaderData
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] = PARTIDASDELAMERCANCIA_TABLA;

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
 * Indica si el formulario ha sido enviado.
 * Esta bandera se utiliza para mostrar mensajes de validación o controlar el flujo
 * después de que el usuario intenta enviar el formulario.
 * 
 * @type {boolean}
 * @default false
 */
  formularioEnviado = false;

  /**
   * Checkbox de selección de la tabla.
   * @type {TablaSeleccion} Enum que especifica el tipo de selección de la tabla.
   */
  checkBox = TablaSeleccion.CHECKBOX;

  /**
   * Fila seleccionada en la tabla.
   * @type {any} Contiene la fila seleccionada de la tabla.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Opciones de productos disponibles.
   * @type {ProductoOpción[]} Arreglo que contiene las opciones de productos que se pueden seleccionar.
   */
  productoOpciones: ProductoOpción[] = [];

  /**
   * Valores del catálogo de unidades.
   * @type {Catalogo[]} Arreglo que contiene los valores disponibles en el catálogo de unidades.
   */
  unidadCatalogo: Catalogo[] = unidadOptions;

  /**
   * Catálogo de acotación disponible.
   * @type {Catalogo[]} Arreglo que contiene las opciones de acotación.
   */
  acotacionCatalogo: Catalogo[] = acotacionOptions;

  /**
   * Datos de los campos de entrada del formulario.
   * @type {Array<{label: string, placeholder: string, required: boolean, controlName: string}>} Arreglo que contiene los datos de los campos del formulario de mercancía.
   */
  datosInputFields = DATOS_INPUT_FIELDS;

  /**
 * Datos de los campos de entrada para la mercancía.
 * @type {Array<{label: string, placeholder: string, required: boolean, controlName: string}>} 
 * Arreglo que contiene los datos de los campos que serán utilizados en el formulario de mercancía.
 */
  mercanciaInputValues = MERCANCIA_INPUT_VALUES;

  /**
 * Array de catálogos.
 * @type {Catalogo[][]} Arreglo bidimensional de catálogos que contiene los valores para las solicitudes.
 */
  catalogosArray: Catalogo[][] = solicitudeSelectVal;

  /**
   * Opciones de productos disponibles.
   * @type {ProductoOpción[]} Arreglo que contiene las opciones de productos para seleccionar en la solicitud.
   */
  opcionesSolicitud: ProductoOpción[] = [];

  /**
   * Sujeto para manejar el ciclo de vida de los observables y evitar posibles fugas de memoria.
   * @type {Subject<void>} Sujeto usado para emitir valores y completar el flujo de datos.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Elementos del bloque.
   * @type {Catalogo[]} Arreglo que contiene los elementos del catálogo para el bloque.
   */
  elementosDeBloque: Catalogo[] = [];

  /**
  * Componente de País de Origen.
  * Referencia al componente de selección del país de origen de la mercancía.
  */
  @ViewChild(PaisDeOrigenComponent)
  paisDeOrigenComponent!: PaisDeOrigenComponent;

  /**
    * Catálogo de países por bloque.
    * @type {Catalogo[]} Arreglo que contiene los países disponibles para cada bloque.
    */
  paisesPorBloque: Catalogo[] = [];

  /**
   * Estado catalogado.
   * @type {Catalogo[]} Arreglo que contiene los estados disponibles en el catálogo.
   */
  estado: Catalogo[] = [];

  /**
    * Representación federal en el catálogo.
    * @type {Catalogo[]} Arreglo que contiene los valores de representación federal.
    */
  representacionFederal: Catalogo[] = [];

  /**
 * Rango de días para la solicitud.
 * @type {string[]} Arreglo que contiene las opciones de rango de días disponibles para la selección.
 */
  selectRangoDias: string[] = [];

    /**
   * Fecha seleccionada por el usuario.
   * @type {string[]}
   */
  fechaSeleccionada: string[] = [];

  /**
   * Constantes de textos utilizados en la aplicación.
   * @type {any} Objeto que contiene los textos de la aplicación para su uso en diferentes partes de la interfaz.
   */
  TEXTOS = TEXTOS;

  /**
    * Array de catálogos de mercancías.
    * @type {Catalogo[][]} Arreglo bidimensional que contiene los valores de los catálogos para las mercancías.
    */
  mercanciaCatalogoArray: Catalogo[][] = mercanciaCatalogoVal as Catalogo[][];

  /**
   * Array de catálogos de NICO (Número de Identificación de la Carga).
   * @type {Catalogo[]} Arreglo que contiene los catálogos disponibles para el número de identificación de la carga (NICO).
   */
  nicoCatalogoArray: Catalogo[] = nicoCatalogoVal as Catalogo[];

/**
 * @property
 * @name tituloParte
 * @description
 * Título que se utiliza para mostrar el encabezado de la sección relacionada con los países de origen.
 * Este valor se asigna desde la constante `TITULO_ORIGEN` para mantener consistencia en los textos utilizados.
 * 
 * @type {string}
 * @default 'Pais(es) de origen'
 * 
 * @example
 * <h1>{{ tituloParte }}</h1>
 */
tituloParte = TITULO_ORIGEN;
  
  /**
 * @public
 * @property {Tramite130108State} seccionState
 * @description
 * Estado de la sección actual del trámite 130108. 
 * Esta propiedad almacena los datos relacionados con el estado del trámite, 
 * incluyendo información sobre la solicitud, mercancía, y otros detalles relevantes.
 * 
 * @example
 * // Ejemplo de uso:
 * this.seccionState.solicitud; // Accede a la solicitud actual del estado
 * 
 * @type {Tramite130121State}
 */
  public seccionState!: Tramite130121State;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor de la clase.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {HttpClient} http - Servicio para hacer peticiones HTTP.
   * @param {Tramite130121Store} tramite130121Store - Servicio que gestiona el estado relacionado con el trámite 130121.
   * @param {Tramite130121Query} tramite130121Query - Servicio que consulta el estado del trámite 130121.
   * @param {PermisoDeHidrocarburosService} permisodehidrocarburosService - Servicio que gestiona la permiso de hidrocarburos Service
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130121Store: Tramite130121Store,
    private tramite130121Query: Tramite130121Query,
    private permisodehidrocarburosService: PermisoDeHidrocarburosService,
    private consultaioQuery: ConsultaioQuery,

  ) {
     this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
  * Método de ciclo de vida de Angular, llamado al inicializar el componente.
  * En este método se configuran varios formularios, consultas y se suscribe a diversos observables.
  * 
  * 1. Inicializa los formularios utilizando `inicializarFormularios()`.
  * 2. Configura los formularios específicos para suscripciones mediante `configuracionFormularioSuscripciones()`.
  * 3. Llama al método `opcionesDeBusqueda()` para establecer las opciones de búsqueda.
  * 4. Realiza un cálculo del total mediante `formularioTotalCount()`.
  * 5. Obtiene los datos de la tabla mediante `obtenerTablaDatos()`.
  * 6. Obtiene las entidades federativas usando `fetchEntidadFederativa()`.
  * 7. Obtiene la representación federal con `fetchRepresentacionFederal()`.
  * 8. Carga la lista de países disponibles con `listaDePaisesDisponibles()`.
  * 9. Se suscribe al observable `mostrarTabla$` de la consulta `tramite130121Query` para actualizar el estado de la variable `mostrarTabla`.
  * 10. Se suscribe al observable `selectSolicitud$` de la consulta `tramite130121Query`, donde se actualizan los valores del formulario `partidasDelaMercanciaForm`
  *     con los valores provenientes del estado de la sección, utilizando `patchValue()`.
  * 
  * @returns void
  */

  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.opcionesDeBusqueda();
    this.formularioTotalCount();
    this.fetchEntidadFederativa();
    this.fetchRepresentacionFederal();
    this.listaDePaisesDisponibles();
    
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormularios();
    }  
  }

  /**
   * @description
   * Método que se encarga de validar el formulario contenido en
   * el componente `DatosDeLaSolicitudComponent`.
   *
   * Utiliza el método `formularioSolicitudValidacion()` del componente hijo
   * para comprobar si el formulario es válido.
   * En caso de que el hijo no esté inicializado o devuelva `null/undefined`,
   * se retorna `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el formulario es válido.
   * - `false`: si el formulario no es válido o el componente hijo aún no está disponible.
   */
  validarContenedor(): boolean {
    const IS_SOLICITUD_VALID = this.datosDeLaSolicitudComponent?.formularioSolicitudValidacion();
    const MERCANCIA_VALID = this.datosDeLaMercanciaComponent?.formularioSolicitudValidacion();
    const PAIS_VALID = this.paisDeOrigenComponent?.formularioSolicitudValidacion();
    const PARTIDAS_VALID = this.partidasDeLaMercanciaComponent?.formularioSolicitudValidacion();
    return (
      IS_SOLICITUD_VALID ?? false) && (MERCANCIA_VALID ?? false) && (PAIS_VALID ?? false) && (PARTIDAS_VALID ?? false
     );
  }

  /**
   * Método para inicializar los formularios del trámite, mercancia, partidas de la mercancia, 
   * pais y representación. Cada formulario se construye utilizando el FormBuilder 
   * de Angular con validadores para asegurar que los campos tengan los valores correctos 
   * antes de ser enviados.
   */
  inicializarFormularios(): void {

    this.configuracionFormularioSuscripciones();


    // Formulario principal del trámite, contiene los campos de solicitud, régimen y clasificación
    this.formDelTramite = this.fb.group({
      /**
       * Campo que captura la solicitud asociada al trámite.
       * Es un campo obligatorio.
       */
      solicitud: [this.seccionState?.solicitud, Validators.required],

      /**
       * Campo que captura el régimen bajo el cual se realiza el trámite.
       * Es un campo obligatorio.
       */
      regimen: [this.seccionState?.regimen, Validators.required],

      /**
       * Campo que captura la clasificación del trámite.
       * Es un campo obligatorio.
       */
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    // Formulario relacionado con los detalles de la mercancía
    this.mercanciaForm = this.fb.group({
      /**
       * Campo que captura el plazo relacionado con la mercancía.
       * En este caso, el valor por defecto es "Largo plazo (5 años)" y es obligatorio.
       */
      plazo: [this.seccionState?.plazo, Validators.required],

      /**
       * Descripción detallada de la mercancía.
       * Es obligatorio y debe tener una longitud entre 10 y 500 caracteres.
       */
      descripcion: [
        this.seccionState?.descripcion,
        [
          Validators.required,
         
          Validators.pattern(REGEX_CARACTERES_NO_PERMITIDOS),
        ],
      ],

      /**
       * Campo que captura la fracción de la mercancía.
       * Es un campo obligatorio.
       */
      fraccion: [this.seccionState?.fraccion, Validators.required],

      /**
       * Campo que captura la cantidad de la mercancía.
       * Es obligatorio, debe ser un número mayor a 0 y debe cumplir con un patrón de solo números.
       */
      cantidad: [
        this.seccionState?.cantidad,
        [
          Validators.required,
          Validators.pattern(REG_X.ENTERO_12_DECIMAL_2),
          Validators.pattern(REG_X.SOLO_NUMEROS_Y_PUNTO),
          Validators.min(1),
        ],
      ],

      /**
       * Valor de la factura en USD relacionada con la mercancía.
       * Es obligatorio, debe ser un número decimal con hasta dos lugares después del punto y un valor mínimo de 0.01.
       */
      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD?.toString() ?? '',
        [
          Validators.required,
          Validators.pattern(REG_X.ENTERO_12_DECIMAL_2),
          Validators.pattern(REG_X.SOLO_NUMEROS_Y_PUNTO), 
          Validators.min(0.01),
        ],
      ],

      /**
       * Campo que captura la unidad de medida de la mercancía.
       * Es un campo obligatorio.
       */
      umt: [this.seccionState?.umt, Validators.required],

      /**
       * Campo que captura el código NICO de la mercancía.
       * Es obligatorio.
       */
      nico: [this.seccionState?.nico, Validators.required],

      /**
       * Campo para la acotación de la mercancía.
       * Este campo está deshabilitado por defecto.
       * @type {Array<{ value: string, disabled: boolean }>} Arreglo que contiene un valor vacío y deshabilitado.
       */
      acotacion: [{ value: this.seccionState?.acotacion, disabled: true }],

      /**
       * Campo para la descripción del NICO (Número de Identificación de la Carga).
       * Este campo está deshabilitado por defecto.
       * @type {Array<{ value: string, disabled: boolean }>} Arreglo que contiene un valor vacío y deshabilitado.
       */
      descripcionNico: [{ value: this.seccionState?.descripcionNico, disabled: true }],
    });

    // Formulario para la información relacionada con las partidas de la mercancía
    this.partidasDelaMercanciaForm = this.fb.group({
      /**
     * Campo que captura la cantidad de partidas de la mercancía.
     * Es obligatorio, debe ser un número entero y no puede exceder los 18 caracteres.
     */
      cantidadModificar: [
        this.seccionState?.cantidadModificar,
        [
             
        ],
      ],
     
      /**
       * Descripción de las partidas de la mercancía.
       * Es obligatorio y no debe exceder los 255 caracteres.
       */
      descripcionModificar: [
        this.seccionState?.descripcionModificar,
        
      ],
      
      /**
       * Valor en USD de cada partida de la mercancía.
       * Es obligatorio, debe ser un número con hasta dos decimales y no puede ser negativo.
       */
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          
        ],
      ],
    });

    // Formulario para la información relacionada con el país de origen o destino
    this.paisForm = this.fb.group({

      /**
    * Bloque en el que se encuentra el país. Es un campo opcional.
    */
      bloque: [this.seccionState?.bloque],

      /**
       * Uso específico del país relacionado con la mercancía.
       * Es obligatorio.
       */
      usoEspecifico: [this.seccionState?.usoEspecifico,[ Validators.required, Validators.pattern(REGEX_CARACTERES_NO_PERMITIDOS),
      ]],

      /**
       * Justificación de la importación o exportación.
       * Es obligatorio.
       */
      justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion, [Validators.required,Validators.pattern(REGEX_CARACTERES_NO_PERMITIDOS)]],
      /**
       * Observaciones adicionales sobre el país.
       * Es un campo opcional.
       */
      observaciones: [this.seccionState?.observaciones,Validators.pattern(REGEX_CARACTERES_NO_PERMITIDOS)],
    });

    // Formulario para la representación legal relacionada con el trámite
    this.frmRepresentacionForm = this.fb.group({
      /**
       * Entidad que representa al solicitante en el trámite.
       * Es un campo obligatorio.
       */
      entidad: [this.seccionState?.entidad],

      /**
       * Representación legal o nombre del representante.
       * Es un campo obligatorio.
       */
      representacion: [this.seccionState?.representacion, Validators.required],
    });

     /**
     * @description Inicializa el formulario reactivo para el manifiesto de aceptación.
     * Este formulario contiene el control 'manifesto', que representa el estado del checkbox de aceptación.
     * El valor por defecto es 'false'.
     * @type {FormGroup}
     */
    this.manifestoForm = this.fb.group({
      
      /**
       * @description Estado del checkbox del manifiesto de aceptación.
       * Valor booleano que indica si el usuario ha aceptado el manifiesto.
       * Se utiliza para almacenar y gestionar el valor en el formulario reactivo y en el store.
       * @type {boolean}
       * @default false
       */
      manifesto: [this.seccionState?.manifesto], 
    });
  }

  /**
 * @method
 * @name guardarDatosFormulario
 * @description
 * Inicializa los formularios y obtiene los datos de la tabla. 
 * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`), 
 * deshabilita o habilita todos los formularios del componente.
 * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
 * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
 * 
 * @returns {void}
 */
  guardarDatosFormulario(): void {
      this.inicializarFormularios();
      this.obtenerTablaDatos();
      if (this.esFormularioSoloLectura) {
        this.formDelTramite.disable();
        this.mercanciaForm.disable();
        this.partidasDelaMercanciaForm.disable();
        this.paisForm.disable();
        this.frmRepresentacionForm.disable();
        this.manifestoForm.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.formDelTramite.enable();
        this.mercanciaForm.enable();
        this.partidasDelaMercanciaForm.enable();
        this.paisForm.enable();
        this.frmRepresentacionForm.enable();
        this.manifestoForm.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }

  /**
* Método para configurar las suscripciones de los formularios, actualizando sus valores
* cuando se reciben cambios desde el store o la consulta a la API.
* 
* - Suscripciones a los valores de 'solicitud', 'regimen' y 'clasificacion' que se 
*   reciben desde el store (tramite130121Query).
* - Suscripciones a los valores de 'mercanciaState', 'selectSolicitud' y 'frmRepresentacionForm'.
* - Actualización del estado global del store cada vez que los formularios se modifican.
*/
  configuracionFormularioSuscripciones(): void {
    this.tramite130121Query.selectSolicitud$
          .pipe(takeUntil(this.destroyed$))
          .subscribe((state: Tramite130121State) => {
            this.seccionState = state;

              // Actualizar tableBodyData desde el store
            if (state.tablaDatos) {
              this.tableBodyData = [...state.tablaDatos];
            }
        
            // Solo actualizar crosslist datos si es la primera vez o si hay cambios específicos en rangoDias/seleccionada
            if (!this.selectRangoDias.length && !this.fechaSeleccionada.length) {
              this.storeCrosslistaDatos();
            }
          });
    
        this.tramite130121Query.mostrarTabla$
          .pipe(takeUntil(this.destroyed$))
          .subscribe((mostrarTabla) => {
            this.mostrarTabla = mostrarTabla;
          });
  
  }

  /**
 * @description
 * Método que inicializa el formulario utilizado para mostrar la cantidad total y el valor total en USD.
 * El formulario contiene dos campos: `cantidadTotal` y `valorTotalUSD`, ambos deshabilitados para que no sean editables por el usuario.
 *
 * @method
 * @name formularioTotalCount
 */
  formularioTotalCount(): void {
    // Inicializa el formulario con el FormBuilder
    this.formForTotalCount = this.fb.group({
      /**
         * @description
         * Campo que representa la cantidad total. Está deshabilitado para que el usuario no pueda modificar su valor.
         * 
         * @type {FormControl}
         * @default ''
         * @disabled true
         */
      cantidadTotal: [{ value: this.seccionState?.tablaDatos?.[0]?.cantidad || '', disabled: true }],

      /**
       * @description
       * Campo que representa el valor total en USD. También está deshabilitado para que el usuario no pueda modificar su valor.
       * 
       * @type {FormControl}
       * @default ''
       * @disabled true
       */
        valorTotalUSD: [{ value: this.seccionState?.tablaDatos?.[0]?.totalUSD || '', disabled: true }],
    });
  }

  /**
   * @description
   * Método encargado de obtener las opciones para la solicitud y el producto mediante dos llamadas a servicios:
   * 1. **getSolicitudeOptions**: Recupera las opciones para la solicitud y actualiza el estado de la tienda (`tramite130121Store`) con la opción seleccionada y un valor predeterminado.
   * 2. **getProductoOptions**: Recupera las opciones para el producto y actualiza el estado de la tienda con el plazo seleccionado y un valor predeterminado.
   * 
   * Ambas solicitudes se manejan usando un `pipe` con el operador `takeUntil` para asegurarse de que las suscripciones se cancelen cuando el componente sea destruido, evitando posibles fugas de memoria.
   *
   * @method
   * @name opcionesDeBusqueda
   */
  opcionesDeBusqueda(): void {
    /**
     * @description
     * Realiza una llamada al servicio `getSolicitudeOptions` para obtener las opciones disponibles para la solicitud.
     * Una vez obtenidos los datos, se actualizan las opciones de solicitud y se modifica el estado de la tienda `tramite130121Store`.
     * 
     * @observable {Observable<any>} Observa el resultado de la llamada a `getSolicitudeOptions` del servicio `permisodehidrocarburosService`.
     * @param {data} datos que contienen las opciones de solicitud.
     * @returns {void}
     */

    this.permisodehidrocarburosService
      .getSolicitudeOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        /**
         * @description
         * Acción a realizar cuando la respuesta de la solicitud es exitosa. Actualiza las opciones de solicitud y el estado en `tramite130121Store`.
         * 
         * @param {data} Respuesta de la API que contiene las opciones de la solicitud.
         */
        next: (data) => {
          this.opcionesSolicitud = data.options;
        },
        /**
        * @description
        * Acción a realizar en caso de error en la solicitud de opciones de solicitud. Se registra el error en la consola.
        * 
        * @param {error} El error generado si la llamada a la API falla.
        */
        error: (error) =>
          console.error('Error loading solicitude options:', error),
      });

    /**
   * @description
   * Realiza una llamada al servicio `getProductoOptions` para obtener las opciones disponibles para el producto.
   * Al igual que la llamada anterior, una vez obtenidos los datos, se actualiza el estado de la tienda `tramite130121Store`.
   * 
   * @observable {Observable<any>} Observa el resultado de la llamada a `getProductoOptions` del servicio `permisodehidrocarburosService`.
   * @param {data} datos que contienen las opciones de producto.
   * @returns {void}
   */

    this.permisodehidrocarburosService
      .getProductoOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        /**
         * @description
         * Acción a realizar cuando la respuesta de la solicitud de producto es exitosa. Actualiza las opciones de producto y el estado en `tramite130121Store`.
         * 
         * @param {data} Respuesta de la API que contiene las opciones del producto.
         */
        next: (data) => {
          this.productoOpciones = data.options;
        },
      });
  }


  /**
* Método para obtener los datos de la tabla dinámica.
* Este método realiza una solicitud al servicio `ExportacionMineralesDeHierroService` para obtener los datos
* de la tabla, los almacena en el store y luego actualiza las propiedades relacionadas con la tabla dinámica.
* 
* - Obtiene los datos de la API y los almacena en el store usando el método específico setTablaDatos.
* - Los datos de la tabla se actualizarán automáticamente a través de la suscripción al store.
* - Los totales del formulario se actualizan cuando el estado cambia.
* 
*/
  obtenerTablaDatos(): void {
    this.permisodehidrocarburosService.getTablaDatos().pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      // Almacenar los datos en el store usando el método específico
      this.tramite130121Store.establecerDatos({tablaDatos: data});
      this.formForTotalCount.patchValue({
        cantidadTotal: data[0].cantidad,
        valorTotalUSD: data[0].totalUSD
      });
    });
  }
  
  /**
 * Elimina todos los datos del cuerpo de la tabla dinámica.
 * Este método se ejecuta cuando el usuario hace clic en el botón de eliminar,
 * limpiando los datos tanto del store como del componente.
 *
 * @example
 * this.alClicEnEliminar();
 */
  alClicEnEliminar(): void {
    // Limpiar los datos de la tabla en el store
    this.tramite130121Store.establecerDatos({ tablaDatos: [] });
  }



  /**
 * @description
 * Método encargado de manejar las actualizaciones del store basadas en eventos del formulario.
 * Este método realiza diferentes acciones dependiendo del valor de `metodoNombre` en el evento recibido.
 * 
 * - Si `metodoNombre` es `setFraccion`, actualiza el valor de la fracción y, si existe, 
 *   establece la unidad de medida relacionada (UMT) en el formulario.
 * - Si `metodoNombre` es `setNico`, actualiza el valor de NICO y, si existe, 
 *   establece la descripción del NICO en el formulario.
 * 
 * @param {Object} event - Evento que contiene el formulario, el campo y el nombre del método.
 * @param {FormGroup} event.form - Formulario reactivo asociado al evento.
 * @param {string} event.campo - Nombre del campo que se está actualizando.
 * @param {string} event.metodoNombre - Nombre del método que define la acción a realizar.
 * 
 * @returns {void}
 */
handleStoreUpdate(event: { form: FormGroup; campo: string; metodoNombre: string }): void {
    if (event.metodoNombre === 'setFraccion') {
      this.setValoresStore(event.form, 'fraccion');

      const RAW_FRACCION_VALUE = event.form.get('fraccion')?.value;

      const SELECTED_FRACCION = Number(RAW_FRACCION_VALUE);

      const FRACTION_OBJ = this.mercanciaCatalogoArray[0]?.find(
        (frac) => frac.id === SELECTED_FRACCION
      );
      if (FRACTION_OBJ) {
        if (FRACTION_OBJ.relacionadaUmtId) {
          event.form.patchValue({ umt: FRACTION_OBJ.relacionadaUmtId });
          this.setValoresStore(event.form, 'umt');

        } else {
          console.warn('No se encontró la propiedad relacionadaUmtId en el objeto fracción.');
        }
      } else {
        console.warn('No se encontró el objeto fracción para el ID seleccionado.');
      }
    }
    else if (event.metodoNombre === 'setNico') {

      this.setValoresStore(event.form, 'nico');

      const RAW_FRACCION_VALUE = event.form.get('fraccion')?.value;

      const SELECTED_FRACCION = Number(RAW_FRACCION_VALUE);
      const FRACTION_OBJ = this.mercanciaCatalogoArray[0]?.find(
        (frac) => frac.id === SELECTED_FRACCION
      );

      if (FRACTION_OBJ) {
        const TEXT_ONLY = FRACTION_OBJ.descripcion.replace(REGEX_TEXTO_PREFIJO, '').trim();
        event.form.patchValue({ descripcionNico: TEXT_ONLY });
        this.setValoresStore(event.form, 'descripcionNico');
      } else {
        console.warn('No se encontró el objeto fracción para actualizar la descripción NICO en setNico.');
      }

    }
  }
  /**
 * @description
 * Método encargado de validar el formulario `partidasDelaMercanciaForm`. 
 * Si el formulario es inválido, se marca todos los campos como tocados y se oculta la tabla (`mostrarTabla` se establece en `false`).
 * Si el formulario es válido, se muestra la tabla (`mostrarTabla` se establece en `true`).
 *
 * @method
 * @name validarYEnviarFormulario
 * @returns {void}
 */
  validarYEnviarFormulario(): void {
        /**
 * Marca el formulario como enviado.
 * Esta bandera se utiliza para activar la visualización de mensajes de validación
 * o controlar el flujo después de que el usuario intenta enviar el formulario.
 *
 * @example
 * this.formularioEnviado = true;
 */
  this.formularioEnviado = true;

    /**
     * @description
     * Verifica si el formulario es inválido. En caso de serlo, marca todos los campos como tocados 
     * para que se muestren los mensajes de error y se oculta la tabla.
     * 
     * @type {boolean}
     * @default false
     */
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
      /**
       * @description
       * Establece la propiedad `mostrarTabla` en `false` para ocultar la tabla si el formulario es inválido.
       * 
       * @type {boolean}
       * @default false
       */
      this.mostrarTabla = false;
    } else {
      /**
       * @description
       * Establece la propiedad `mostrarTabla` en `true` para mostrar la tabla si el formulario es válido.
       * 
       * @type {boolean}
       * @default true
       */
      this.mostrarTabla = true;
      
  /**
 * Llama al método encargado de obtener los datos de la tabla dinámica.
 * Este método actualiza la propiedad `tableBodyData` y los totales en el formulario correspondiente
 * con los datos obtenidos del servicio de exportación de petrolíferos.
 *
 * @example
 * this.obtenerTablaDatos();
 */
      this.obtenerTablaDatos();
    }
  }


  /**
   * Método que realiza la consulta al servicio de exportación de minerales
   * de hierro para obtener los datos del estado de la entidad federativa.
   * Luego, asigna los datos obtenidos a la propiedad `estado` de la clase.
   */
  fetchEntidadFederativa(): void {
    // Llamada al servicio para obtener los datos del estado
    this.permisodehidrocarburosService.getEstado()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        // Asignamos el resultado al estado
        this.estado = data;
      });
  }


  /**
  * Método que realiza una consulta al servicio de exportación de minerales
  * de hierro para obtener la representación federal. Los datos obtenidos
  * se asignan a la propiedad `representacionFederal` de la clase.
  */
  fetchRepresentacionFederal(): void {
    // Llamada al servicio para obtener la representación federal
    this.permisodehidrocarburosService
      .getRepresentacionFederal().pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        // Asignamos el resultado a la propiedad representacionFederal
        this.representacionFederal = data;
      });
  }

  /**
   * Método que solicita la lista de países disponibles a través del servicio
   * de exportación de minerales de hierro. Utiliza `takeUntil` para manejar
   * la cancelación de suscripciones. Los datos obtenidos se asignan a la
   * propiedad `elementosDeBloque`.
   */
  listaDePaisesDisponibles(): void {
    // Llamada al servicio para obtener la lista de países disponibles
    this.permisodehidrocarburosService
      .getListaDePaisesDisponibles()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        // Asignamos el resultado a la propiedad elementosDeBloque
        this.elementosDeBloque = data;
      });
  }
  
   /**
  * Método que realiza una solicitud al servicio de exportación de minerales
  * de hierro para obtener la lista de ciudades. La respuesta es procesada y
  * se asigna a la propiedad `fechasDatos` del componente `crosslistComponent` 
  * de `paisDeOrigenComponent`, si dicho componente está disponible.
  * Utiliza `takeUntil` para manejar la cancelación de suscripciones.
  */
  obtenerListaDeCiudades(): void {
    // Llamada al servicio para obtener la lista de ciudades
    this.permisodehidrocarburosService
      .obtenerListaDeCiudades()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.selectRangoDias = data.map(
            (item) => item.descripcion
          );
        // Actualizar el store con los nuevos datos
        this.tramite130121Store.establecerDatos({
          rangoDias: this.selectRangoDias,
          seleccionada: []
        });
        this.fechaSeleccionada = [];
      });
  }

  /**
  * Método que consulta la lista de países pertenecientes a un bloque
  * específico, identificado por el parámetro `_bloqueId`. Los datos obtenidos
  * se asignan a la propiedad `paisesPorBloque` y se extraen las descripciones
  * de los países para asignarlas a la propiedad `selectRangoDias`. 
  * Utiliza `takeUntil` para manejar la cancelación de suscripciones.
  * 
  * @param _bloqueId Identificador del bloque para obtener los países correspondientes.
  */
  fetchPaisesPorBloque(_bloqueId: number): void {
    this.permisodehidrocarburosService
      .getPaisesPorBloque(_bloqueId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.paisesPorBloque = data;
        this.selectRangoDias = this.paisesPorBloque.map(
          (pais: Catalogo) => pais.descripcion
        );
      });
  }
  /**
     * Método que maneja el cambio de bloque. Llama al método `fetchPaisesPorBloque`
     * con el `bloqueId` proporcionado para actualizar la lista de países correspondientes
     * a dicho bloque.
     * 
     * @param bloqueId Identificador del nuevo bloque.
     */
  enCambioDeBloque(bloqueId: number): void {
    // Llama al método fetchPaisesPorBloque para obtener los países correspondientes al bloque
    this.fetchPaisesPorBloque(bloqueId);
  }
 /**
   * Método que establece los valores en el store de `tramite130108Store`.
   * Se utiliza para actualizar el estado del store con los valores de un campo específico
   * del formulario. Si el formulario o el campo no existen, se retorna sin hacer nada.
   * 
   * @param form FormGroup | null - El formulario del cual se obtendrán los valores.
   * @param campo string - El nombre del campo cuyo valor se desea establecer en el store.
   */

 setValoresStore(form: FormGroup | null, campo: string): void {
  if (!form) {
    return;
  }
  const CONTROL = form.get(campo);
  if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
    this.tramite130121Store.establecerDatos({ [campo]: CONTROL.value });
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
   * Actualiza los datos de las listas cruzadas basándose en el estado actual.
   * 
   * Sincroniza las listas seleccionadas y originales con el estado de la aplicación.
   * Si las matrices del estado están vacías o indefinidas, utiliza valores predeterminados.
   */
  storeCrosslistaDatos(): void {
    // Función auxiliar para verificar si una matriz es válida y no está vacía
    const ES_MATRIZ_VALIDA = (array: string[] | undefined | null): boolean => 
      Array.isArray(array) && array.length > 0;

    // Solo actualizar selectRangoDias si hay datos en el estado y no hay datos locales
    if (ES_MATRIZ_VALIDA(this.seccionState.rangoDias) && !this.selectRangoDias.length) {
      this.selectRangoDias = this.seccionState.rangoDias as string[];
    }

    // Solo actualizar fechaSeleccionada si hay datos en el estado y no hay datos locales
    if (ES_MATRIZ_VALIDA(this.seccionState.seleccionada) && !this.fechaSeleccionada.length) {
      this.fechaSeleccionada = this.seccionState.seleccionada || [];
    }
  }

  /**
   * @metodo
   * @nombre onFechasSeleccionadasChange
   * @descripcion Maneja el cambio de fechas seleccionadas en el crosslist del componente pais-de-origen.
   * Actualiza la propiedad local y almacena los cambios en el store.
   * @param {string[]} fechasSeleccionadas - Array de fechas seleccionadas.
   */
  onFechasSeleccionadasChange(fechasSeleccionadas: string[]): void {
    this.fechaSeleccionada = fechasSeleccionadas;
    // Actualizar el store con las fechas seleccionadas
    this.tramite130121Store.establecerDatos({ seleccionada: fechasSeleccionadas });
  }

  /**
   * Se ejecuta cuando el componente o servicio es destruido.
   * 
   * Este método es parte del ciclo de vida de un componente de Angular. Se utiliza para liberar recursos y evitar
   * fugas de memoria, cancelando observables o tareas que ya no son necesarias una vez que el componente ha sido destruido.
   * En este caso, se emite un valor a través de `destroyed$` y se completa el observable, lo que indica que el 
   * componente ya no necesita estar suscrito o escuchar cambios.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    // Emite un valor indicando que el componente ha sido destruido
    this.destroyed$.next();

    // Completa el observable para evitar fugas de memoria
    this.destroyed$.complete();
  }

}