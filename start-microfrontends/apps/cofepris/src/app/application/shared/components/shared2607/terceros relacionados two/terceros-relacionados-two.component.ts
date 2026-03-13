import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent, Catalogo, CatalogoSelectComponent, InputRadioComponent, REGEX_CURP, REGEX_RFC_FISICA, REGEX_RFC_MORAL, REGEX_TELEFONO, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, REGEX_CORREO_ELECTRONICO, REGEX_NOMBRE, REGEX_SOLO_NUMEROS, TablaDinamicaComponent, TablaSeleccion, ValidacionesFormularioService, doDeepCopy, esValidArray, getValidDatos } from '@ng-mf/data-access-user';
import { DESTINATARIO_TABLE_CONFIG, FABRICANTE_TABLE_CONFIG, FACTURADOR_TABLE_CONFIG, NACIONALIDAD_OPCIONES_DE_BOTON_DE_RADIO, PERSONA_OPCIONES_DE_BOTON_DE_RADIO, PERSONA_OPCIONES_DE_BOTON_DE_RADIO_DOS, PROVEEDOR_TABLE_CONFIG, TERCEROS_TEXTO_DE_ALERTA, TIPO_PERSONA_DESTINATARIO } from '../../../constantes/tereceros-relacionados-fab-seccion.enum';
import { DestinatarioModel, FacricanteModel, FacturadorModel, ProveedorModel } from '../../../models/terceros-fabricante-relocionados.model';
import { Solicitud260702State, Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { Subject ,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { TercerosRelacionadosFabSeccionComponent } from '../../terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';
import { TercerosRelacionadosFebService } from '../../../services/tereceros-relacionados-feb.service';
import { TercerosRelacionadosQuery } from '../../../estados/queries/terceros-relacionados.query';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TramiteRelacionadaseStore } from '../../../estados/stores/terceros-relacionados.stores';
import { Tramite260704Store } from '../../../../tramites/260704/estados copy/stores/tramite260704Store.store';
import { Tramite260704Query } from '../../../../tramites/260704/estados copy/queries/tramite260704Query.query';


@Component({
  selector: 'app-terceros-relacionados-two',
  standalone: true,
  imports: [
    CommonModule,
      TituloComponent,
      AlertComponent,
      FormsModule,
      ReactiveFormsModule,
      ModalComponent,
      CatalogoSelectComponent,
      InputRadioComponent,
      TablaDinamicaComponent,
      TooltipModule
  ],
  templateUrl: './terceros-relacionados-two.component.html',
  styleUrl: './terceros-relacionados-two.component.scss',
  encapsulation: ViewEncapsulation.None
}) 
export class TercerosRelacionadosTwoComponent implements OnInit, OnDestroy {
  public isContinuarButtonClicked: boolean = false;

  /**
   * Método estático que verifica si un FormGroup está vacío.
   * 
   * Evalúa todos los valores del formulario para determinar si están vacíos,
   * considerando como vacíos los valores null, undefined y cadenas vacías.
   * 
   * @param formGroup - El FormGroup a evaluar
   * @returns `true` si todos los valores del formulario están vacíos, `false` en caso contrario
   */
  static isFormGroupEmpty(formGroup: FormGroup): boolean {
    return Object.values(formGroup.value).every(
      value => value === null || value === undefined || value === ''
    );
  }

  /**
   * Índice del fabricante que se está editando actualmente.
   * Es `null` cuando no se está editando ningún fabricante.
   */
  editFabricanteIndex: number | null = null;
  
  /**
   * Índice del destinatario que se está editando actualmente.
   * Es `null` cuando no se está editando ningún destinatario.
   */
  editDestinatarioIndex: number | null = null;
  
  /**
   * Índice del proveedor que se está editando actualmente.
   * Es `null` cuando no se está editando ningún proveedor.
   */
  editProveedorIndex: number | null = null;
  
  /**
   * Índice del facturador que se está editando actualmente.
   * Es `null` cuando no se está editando ningún facturador.
   */
  editFacturadorIndex: number | null = null;
  /**
   * Tipo de selección utilizado en las tablas del componente.
   * Configurado para usar checkboxes para la selección múltiple de filas.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  
  /**
   * Configuración de columnas para la tabla de fabricantes.
   * Define la estructura y propiedades de las columnas que se mostrarán en la tabla.
   */
  configuracionTabla: ConfiguracionColumna<FacricanteModel>[] = FABRICANTE_TABLE_CONFIG;
  
  /**
   * Configuración de columnas para la tabla de destinatarios.
   * Define la estructura y propiedades de las columnas que se mostrarán en la tabla.
   */
  configuracionTablaDestinatario: ConfiguracionColumna<DestinatarioModel>[] = DESTINATARIO_TABLE_CONFIG;
  
  /**
   * Configuración de columnas para la tabla de proveedores.
   * Define la estructura y propiedades de las columnas que se mostrarán en la tabla.
   */
  configuracionTablaProveedor: ConfiguracionColumna<ProveedorModel>[] = PROVEEDOR_TABLE_CONFIG;
  
  /**
   * Configuración de columnas para la tabla de facturadores.
   * Define la estructura y propiedades de las columnas que se mostrarán en la tabla.
   */
  configuracionTablaFacturador: ConfiguracionColumna<FacturadorModel>[] = FACTURADOR_TABLE_CONFIG;

  /**
    * Indica si se debe ocultar el botón "Agregar".
   */
  @Input() hideAgregarBtn: boolean = false;

  @Input() tramiteID!: string;
   /**
     * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
     */
    private destroy$ = new Subject<void>();
    /**
     * Almacena los datos del encabezado de la tabla.
     * Esta propiedad se utiliza para definir las columnas que se mostrarán en la tabla.
     */
    tablaEncabezadoData: string[] = [];
  
   /**
 * Indicador para determinar si la nacionalidad seleccionada es "Nacional".
 * 
 * @description Este indicador se utiliza para controlar la lógica relacionada con personas de nacionalidad nacional.
 * Por ejemplo, habilitar o deshabilitar campos específicos en el formulario según la selección.
 * 
 * @type {boolean}
 * @default false
 */
public nacional = false;
  
   /**
 * Indicador para determinar si la nacionalidad seleccionada es "Extranjera".
 * 
 * @description Este indicador se utiliza para controlar la lógica relacionada con personas de nacionalidad extranjera.
 * Por ejemplo, habilitar o deshabilitar campos específicos en el formulario según la selección.
 * 
 * @type {boolean}
 * @default false
 */
public extranjero = false;
  
    /**
     * Indicador para determinar si se ha seleccionado una persona física.
     * Inicialmente establecido en `false`.
     *
     * @description Este indicador se utiliza para controlar la lógica relacionada con personas físicas.
     */
    public fisica = false;

    /**
     * Indicador para determinar si se ha seleccionado la opción de no contribuyente.
     * Inicialmente establecido en `false`.
     */
    public noContribuyente = false;
  
    /**
     * Indicador para determinar si se ha seleccionado una persona moral.
     * Inicialmente establecido en `false`.
     *
     * @description Este indicador se utiliza para controlar la lógica relacionada con personas morales.
     */
    public moral = false;

   /**
     * Indicador de visibilidad para la sección de la tabla.
     * Inicialmente visible (`true`).
     *
     * @description Controla si se muestra o no la sección de la tabla.
     */
    showTableDiv = true;
  
    /**
     * Indicador de visibilidad para la sección del formulario de fabricante.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestra o no el formulario para agregar un fabricante.
     */
    showFabricante = false;
  
    /**
     * Indicador de visibilidad para la sección del formulario de destinatario.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestra o no el formulario para agregar un destinatario.
     */
    showDestinatario = false;
  
    /**
     * Indicador de visibilidad para la sección del formulario de proveedor.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestra o no el formulario para agregar un proveedor.
     */
    showProveedor = false;
  
    /**
     * Indicador de visibilidad para la sección del formulario de facturador.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestra o no el formulario para agregar un facturador.
     */
    showFacturador = false;
  
    /**
     * Indicador de visibilidad para los botones del formulario de fabricante.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestran o no los botones para el formulario de fabricante.
     */
    showFabricanteButtons = false;
  
    /**
     * Indicador de visibilidad para los botones del formulario de destinatario.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestran o no los botones para el formulario de destinatario.
     */
    showDestinatarioButtons = false;
  
    /**
     * Indicador de visibilidad para los botones del formulario de proveedor.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestran o no los botones para el formulario de proveedor.
     */
    showProveedorButtons = false;
  
    /**
     * Indicador de visibilidad para los botones del formulario de facturador.
     * Inicialmente no visible (`false`).
     *
     * @description Controla si se muestran o no los botones para el formulario de facturador.
     */
    showFacturadorButtons = false;
  
    /**
     * Inicializa las opciones de botón de radio para la nacionalidad.
     * Estas opciones se utilizan para presentar al usuario diferentes alternativas de nacionalidad.
     */
    nacionalidadOpcionDeBotonDeRadio = NACIONALIDAD_OPCIONES_DE_BOTON_DE_RADIO;
   
    /**
     * Inicializa las opciones de botón de radio para el tipo de persona.
     * Estas opciones se utilizan para distinguir entre diferentes tipos de personas (por ejemplo, física o moral).
     */
    personaOpcionDeBotonDeRadio = PERSONA_OPCIONES_DE_BOTON_DE_RADIO_DOS;

    /**
     * Indicador para mostrar u ocultar el campo de no contribuyente.
     * Inicialmente establecido en `false`.
     */
    tipoPersonnOpcion = TIPO_PERSONA_DESTINATARIO;
  
    /**
     * Selección del tipo de persona.
     */
    tipoPersonaSelection!: string;
  
    /**
     * Datos generales para los dropdowns.
     * Inicialmente vacío, se llenará con datos según sea necesario.
     *
     * @description Este arreglo almacena los datos generales para los selectores.
     */
    dropdownData: Catalogo[] = [];
  
    /**
     * Datos para el dropdown de países.
     * Utiliza los datos predefinidos en `PAIS_SELECT_DATA`.
     *
     * @description Este arreglo almacena las opciones para el selector de países.
     */
    paisDropdownData: Catalogo[] = [];
  
    /**
     * Datos para el dropdown de localidades.
     * Utiliza los datos predefinidos en `LOCALIDAD_SELECT_DATA`.
     *
     * @description Este arreglo almacena las opciones para el selector de localidades.
     */
    localidadDropdownData: Catalogo[] = [];
  
    /**
     * Datos para el dropdown de municipios.
     * Utiliza los datos predefinidos en `MUNICIPIO_SELECT_DATA`.
     *
     * @description Este arreglo almacena las opciones para el selector de municipios.
     */
    municipioDropdownData: Catalogo[] = [];
  
    /**
     * Datos para el dropdown de códigos postales.
     * Utiliza los datos predefinidos en `CODIGOPOSTAL_SELECT_DATA`.
     *
     * @description Este arreglo almacena las opciones para el selector de códigos postales.
     */
    codigoPostalDropdownData: Catalogo[] = [];
  
    /**
     * Datos para el dropdown de colonias.
     * Utiliza los datos predefinidos en `COLONIA_SELECT_DATA`.
     *
     * @description Este arreglo almacena las opciones para el selector de colonias.
     */
    coloniaDropdownData: Catalogo[] = [];
  
    /**
     * Formulario reactivo para agregar un fabricante.
     * Este formulario contiene los campos necesarios para ingresar los datos de un fabricante.
     *
     * @description Se utiliza para validar y procesar los datos del fabricante.
     */
    agregarFabricanteFormGroup!: FormGroup;
  
    /**
     * Formulario reactivo para agregar un destinatario.
     * Este formulario contiene los campos necesarios para ingresar los datos de un destinatario.
     *
     * @description Se utiliza para validar y procesar los datos del destinatario.
     */
    agregarDestinatarioFormGroup!: FormGroup;

  /**
     * Formulario reactivo para agregar un proveedor.
     * Este formulario contiene los campos necesarios para ingresar los datos de un proveedor.
     */
    tablaGroup!: FormGroup;

    /** Estado actual de la solicitud del trámite 260702. */
    solicitudState!: Solicitud260702State;
    
  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Identificador único del trámite que se está procesando.
   * Se recibe como entrada desde el componente padre y se utiliza
   * para obtener datos específicos del trámite desde los servicios.
   */
  @Input() idProcedimiento!: string;

  /**
   * Datos de la tabla de fabricantes.
   * Se utiliza para almacenar y mostrar la lista de fabricantes relacionados.
   * Inicialmente es un arreglo vacío.
   */
  @Output() fabricanteTablaDataChange = new EventEmitter<FacricanteModel[]>();

  /**
   * Datos de la tabla de destinatarios.
   * Se utiliza para almacenar y mostrar la lista de destinatarios relacionados.
   * Inicialmente es un arreglo vacío.
   */
  @Output() destinatarioTablaDataChange = new EventEmitter<DestinatarioModel[]>();

    /**
     * Constructor del componente de terceros relacionados.
     * 
     * Inicializa las dependencias necesarias para el funcionamiento del componente
     * y configura la suscripción al estado de consulta para manejar el modo de solo lectura.
     * 
     * @param fb - Constructor de formularios reactivos de Angular
     * @param tramiteStore - Store para gestionar el estado de terceros relacionados
     * @param tramiteQuery - Query para acceder al estado de terceros relacionados
     * @param tercerosService - Servicio para obtener datos de terceros relacionados
     * @param consultaioQuery - Query para obtener el estado de consulta (modo solo lectura)
     */
    constructor(
      private fb: FormBuilder,
     private tramiteStore: Tramite260704Store,
     private tramiteQuery: Tramite260704Query,
    private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,
      private tercerosService: TercerosRelacionadosFebService,
        private consultaioQuery: ConsultaioQuery,
        private validacionesService: ValidacionesFormularioService,
        private service: RegistrarSolicitudMcpService,
    ) {
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    }
  
    /**
     * Método del ciclo de vida que se ejecuta al inicializar el componente.
     * 
     * Realiza las siguientes operaciones de inicialización:
     * - Obtiene los datos iniciales de fabricantes y destinatarios
     * - Carga los datos de encabezado de tabla y catálogos generales
     * - Obtiene los datos de países para los dropdowns geográficos
     * - Inicializa todos los formularios reactivos
     * - Se suscribe al estado del store para mantener sincronizados los datos
     */
    ngOnInit(): void {
      this.tercerosService.getFabricanteForm().subscribe(data => {
        // this.fabricanteRowData = [data];
        this.tramiteStore.setFacricanteModel(this.fabricanteRowData)
      });
      this.tercerosService.getEncabezadoDeTabla()
        .pipe(takeUntil(this.destroy$)).subscribe((data:{ columns: string[] }) => {
        this.tablaEncabezadoData = data.columns;
      });
      
          if(this.solicitudState && 
            typeof this.solicitudState === 'object' && 
            this.solicitudState !== null && 
            'DestinatariosTabla' in this.solicitudState) {
              const DATOS = this.solicitudState['DestinatariosTabla'] as DestinatarioModel[];
              DATOS.forEach((dato: DestinatarioModel) => {
                const IS_ALREADY_ADDED = this.destinatarioRowData.some(
                  (item: DestinatarioModel) => item.pais === dato.pais
                );
                
                if(!IS_ALREADY_ADDED) {
                  this.destinatarioRowData = [...this.destinatarioRowData, dato];
                }
              });
          }
  
      /**
       * Obtiene los datos para los selectores desde el servicio de terceros.
       * Actualiza la propiedad `dropdownData` con los datos obtenidos.
       */
      this.tercerosService.getData(this.idProcedimiento)
      .pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.dropdownData = data;
      });
  
      /**
       * Carga los datos específicos para los dropdowns de ubicación geográfica.
       */
  
      // Carga los datos de país para el dropdown.
      this.tercerosService.getPaisData(this.idProcedimiento)
        .pipe(takeUntil(this.destroy$)).subscribe((data) => {
        /**
         * Asigna los datos de país a la variable paisDropdownData.
         */
        this.paisDropdownData = data;
      });
  
      /**
       * Inicializa los formularios reactivos para agregar terceros.
       */
      this.initializeAgregarFabricanteFormGroup();
      this.initializeAgregarDestinatarioFormGroup();

      this.tramiteQuery
        .select()
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
          // this.tablaGroup.patchValue(state, { emitEvent: false });
          this.fabricanteRowData = state.facricanteModel || [];
          this.destinatarioRowData = state.destinatarioModel || [];

        });
    }
    
    /**
     * Carga los datos de municipios basados en el estado seleccionado.
     * 
     * Si el evento contiene una clave válida, obtiene los municipios correspondientes
     * al estado desde el servicio. En caso contrario, limpia la lista de municipios.
     * 
     * @param evento - Objeto catálogo que contiene la clave del estado seleccionado
     */
    cargarEstado(evento: Catalogo): void {
      if (evento.clave) {
        this.tercerosService.getMunicipioData(this.idProcedimiento, evento.clave).pipe(
        takeUntil(this.destroy$)
      ).subscribe((data) => {
        this.municipioDropdownData = data;
      });
    } else {
      this.municipioDropdownData = [];
    }
    }

    /**
     * Carga los datos de localidades basadas en el municipio seleccionado.
     * 
     * Si el evento contiene una clave válida, obtiene las localidades correspondientes
     * al municipio desde el servicio. En caso contrario, limpia la lista de localidades.
     * 
     * @param evento - Objeto catálogo que contiene la clave del municipio seleccionado
     */
    cargarMunicipio(evento: Catalogo): void {
      if (evento.clave) {
        this.tercerosService.getLocalidadData(this.idProcedimiento, evento.clave).pipe(
        takeUntil(this.destroy$)
      ).subscribe((data) => {
        this.localidadDropdownData = data;
      });
    } else {
      this.localidadDropdownData = [];
    }
    }

    /**
     * Carga los datos de códigos postales basados en la localidad seleccionada.
     * 
     * Si el evento contiene una clave válida, obtiene los códigos postales correspondientes
     * a la localidad desde el servicio. En caso contrario, limpia la lista de códigos postales.
     * 
     * @param evento - Objeto catálogo que contiene la clave de la localidad seleccionada
     */
    cargarLocalidad(evento: Catalogo): void {
      if (evento.clave) {
        this.tercerosService.getCodigoPostalData(this.idProcedimiento, evento.clave).pipe(
        takeUntil(this.destroy$)
        ).subscribe((data) => {
          this.codigoPostalDropdownData = data;
        });
      } else {
        this.codigoPostalDropdownData = [];
      }
    }

    /**
     * Carga los datos de colonias basados en el código postal seleccionado.
     * 
     * Si el evento contiene una clave válida, obtiene las colonias correspondientes
     * al código postal desde el servicio. En caso contrario, limpia la lista de colonias.
     * 
     * @param evento - Objeto catálogo que contiene la clave del código postal seleccionado
     */
    cargarCodigoPostal(evento: Catalogo): void {
      if (evento.clave) {
        this.tercerosService.getColoniaData(this.idProcedimiento, evento.clave).pipe(
        takeUntil(this.destroy$)
        ).subscribe((data) => {
          this.coloniaDropdownData = data;
        });
      } else {
        this.coloniaDropdownData = [];
      }
    }

    /**
     * Inicializa el grupo de formulario para la tabla de terceros relacionados.
     * 
     * Crea un FormGroup que contiene un FormControl para el modelo de fabricantes,
     * el cual será utilizado para gestionar los datos de la tabla.
     */
    initializeTablaGroup(): void {
      this.tablaGroup = this.fb.group({
        fabricanteModel: new FormControl([]),
      });
    }
  
    /**
     * Inicializa el formulario para agregar un fabricante.
     * Configura los campos del formulario con validaciones y comportamientos específicos.
     */
    initializeAgregarFabricanteFormGroup(): void {
    /**
     * Crea el formulario reactivos para agregar un fabricante.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarFabricanteFormGroup = this.fb.group({
      /**
       * Nacionalidad del tercero.
       */
      tercerosNacionalidad: new FormControl('', [Validators.required]),
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl('', [Validators.required]),
      /**
       * RFC del tercero.
       * Requiere validación adicional mediante `rfcValidator`.
       */
      rfc: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(15),
        TercerosRelacionadosTwoComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(18),
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Denominación o razón social del tercero.
       */
      denominacionRazonSocial: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(REGEX_NOMBRE),
        Validators.maxLength(254)
      ]),
      /**
       * País del tercero.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl({ value: '', disabled: true }, [
        Validators.required,
         Validators.maxLength(120),
        TercerosRelacionadosTwoComponent.requiredPaisValidator,
      ]),
      /**
       * Estado o localidad del tercero.
       */
      estadoLocalidad: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(255)]),
      /**
       * Municipio o alcaldía del tercero.
       */
      municipioAlcaldia: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(120)]),
      /**
       * Localidad del tercero.
       */
      localidad: new FormControl({ value: '', disabled: true },[Validators.maxLength(120)]),
      /**
       * Entidad federativa del tercero.
       */
      entidadFederativa: new FormControl({ value: '', disabled: true }, [Validators.required]),
      /**
       * Código postal del tercero.
       */
      codigoPostaloEquivalente: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(12), Validators.pattern(/^[a-zA-Z0-9]*$/)]),
      /**
       * Colonia del tercero.
       */
      colonia: new FormControl({ value: '', disabled: true }),
      /**
       * Colonia equivalente del tercero.
       */
      coloniaoEquivalente: new FormControl({ value: '', disabled: true },[Validators.maxLength(100)]),
      /**
       * Calle del tercero.
       */
      calle: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(100)]),
      /**
       * Número exterior del tercero.
       */
      numeroExterior: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Número interior del tercero.
       */
      numeroInterior: new FormControl({ value: '', disabled: true },[Validators.maxLength(55),Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Lada del tercero.
       */
      lada: new FormControl({ value: '', disabled: true },[
        Validators.pattern(REGEX_NOMBRE),
      ]),
      /**
       * Teléfono del tercero.
       * Requiere validación adicional mediante `telefonoValidator`.
       */
      telefono: new FormControl({ value: '', disabled: true }, [
         Validators.pattern(REGEX_SOLO_NUMEROS),
         Validators.maxLength(30)
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl({ value: '', disabled: true },[Validators.maxLength(320),Validators.pattern(REGEX_CORREO_ELECTRONICO)]),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
    }
    
  
    /**
     * Inicializa el formulario para agregar un destinatario.
     * Configura los campos del formulario con validaciones y comportamientos específicos.
     */
    initializeAgregarDestinatarioFormGroup(): void {
      /**
       * Crea el formulario reactivos para agregar un destinatario.
       * Cada campo tiene sus propias validaciones.
       */
      this.agregarDestinatarioFormGroup = this.fb.group({
        /**
         * Tipo de persona (física o moral).
         */
        tipoPersona: new FormControl('', [Validators.required]),
        /**
         * RFC del destinatario.
         */
        rfc: new FormControl('', [Validators.required]),
        /**
         * CURP del destinatario.
         */
        curp: new FormControl('', [Validators.required]),
        /**
         * Denominación o razón social del destinatario.
         */
        denominacionRazonSocial: new FormControl('', [Validators.required]),
        /**
         * País del destinatario.
         */
        pais: new FormControl('', [Validators.required]),
        /**
         * Estado o localidad del destinatario.
         */
        estadoLocalidad: new FormControl('', [Validators.required]),
        /**
         * Municipio o alcaldía del destinatario.
         */
        municipioAlcaldia: new FormControl('', [Validators.required]),
        /**
         * Localidad del destinatario.
         */
        localidad: new FormControl(''),
        /**
         * Entidad federativa del destinatario.
         */
        entidadFederativa: new FormControl('', [Validators.required]),
        /**
         * Código postal del destinatario.
         */
        codigoPostaloEquivalente: new FormControl('', [Validators.required]),
        /**
         * Colonia del destinatario.
         */
        colonia: new FormControl(''),
        /**
         * Colonia equivalente del destinatario.
         */
        coloniaoEquivalente: new FormControl(''),
        /**
         * Calle del destinatario.
         */
        calle: new FormControl('', [Validators.required]),
        /**
         * Número exterior del destinatario.
         */
        numeroExterior: new FormControl('', [Validators.required]),
        /**
         * Número interior del destinatario.
         */
        numeroInterior: new FormControl(''),
        /**
         * Lada del destinatario.
         */
        lada: new FormControl(''),
        /**
         * Teléfono del destinatario.
         */
        telefono: new FormControl(''),
        /**
         * Correo electrónico del destinatario.
         */
        correoElectronico: new FormControl(''),
        nombre: new FormControl(''),
        primerApellido: new FormControl(''),
        segundoApellido: new FormControl('')
      });
  
      // Deshabilita campos hasta que se seleccione el tipo de persona
      this.agregarDestinatarioFormGroup.disable();
      this.agregarDestinatarioFormGroup.get('tipoPersona')?.enable();
    }

      /**
       * Maneja los cambios en los controles de los formularios de terceros relacionados.
       * 
       * Este método identifica el formulario correspondiente basado en el nombre proporcionado
       * y permite realizar acciones específicas cuando cambian los valores de los controles.
       * 
       * @param formName - Nombre del formulario que contiene el control
       * @param controlName - Nombre del control que ha cambiado
       */
      enCambioDeControl(formName: string, controlName: string): void {
        let formGroup: FormGroup;
    
        switch (formName) {
          case 'agregarFabricanteFormGroup':
            formGroup = this.agregarFabricanteFormGroup;
            break;
          case 'agregarDestinatarioFormGroup':
            formGroup = this.agregarDestinatarioFormGroup;
            break;
          default:
            
            }
      }
  
  
  
    /**
     * Maneja el cambio en los checkboxes para seleccionar el tipo de persona.
     * Actualiza los indicadores `fisica` y `moral` según el checkbox seleccionado.
     *
     * @param checkBoxValue Nombre del checkbox seleccionado (fisica o moral).
     */
    public tipoPersonaChecked(
      checkBoxValue: string | number,
      formGroupName: string
    ): void {
      if (checkBoxValue === '1') {
        this.fisica = true;
        this.moral = false;
      } else {
        this.fisica = false;
        this.moral = true;
      }
  
      /**
       * Habilita los campos del formulario según el tipo de grupo de formulario seleccionado.
       *
       * @param formGroupName Nombre del grupo de formulario.
       */
      if (formGroupName === 'Destinatario') {
        /**
         * Habilita los campos del formulario de destinatario.
         */
        this.agregarDestinatarioFormGroup.enable();
        this.agregarDestinatarioFormGroup
          .get('denominacionRazonSocial')
          ?.enable();
      } else if (formGroupName === 'Fabricante') {
        /**
         * Habilita los campos del formulario de fabricante.
         */
        this.agregarFabricanteFormGroup.enable();
      }
    }
  
    /**
     * Maneja la selección de nacionalidad en los controles de radio.
     * 
     * Actualiza los indicadores de nacionalidad (`nacional` y `extranjero`) basados
     * en el valor seleccionado. El valor '1' indica nacionalidad nacional,
     * cualquier otro valor indica nacionalidad extranjera.
     * 
     * @param checkBoxValue - Valor del radio button seleccionado
     */
    public tercerosInputChecked(checkBoxValue: string | number): void {
      if (checkBoxValue === '1') {
        this.nacional = true;
        this.extranjero = false;
      } else {
        this.nacional = false;
        this.extranjero = true;
      }
    }
  
    /**
     * Cambia la visibilidad del formulario de Fabricante.
     * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
     */
    toggleDivFabricante(): void {
      this.fisica = false;
      this.moral = false;
      this.showTableDiv = !this.showTableDiv;
      this.showFabricante = !this.showFabricante;
    }
  
    /**
     * Cambia la visibilidad del formulario de Destinatario.
     * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
     */
    toggleDivDestinatario(): void {
      this.fisica = false;
      this.moral = false;
      this.showTableDiv = !this.showTableDiv;
      this.showDestinatario = !this.showDestinatario;
    }
  
    /**
     * Cambia la visibilidad del formulario de Proveedor.
     * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
     */
    toggleDivProveedor(): void {
      this.fisica = false;
      this.moral = false;
      this.showTableDiv = !this.showTableDiv;
      this.showProveedor = !this.showProveedor;
    }
  
    /**
     * Cambia la visibilidad del formulario de Facturador.
     * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
     */
    toggleDivFacturador(): void {
      this.fisica = false;
      this.moral = false;
      this.showTableDiv = !this.showTableDiv;
      this.showFacturador = !this.showFacturador;
    }
  
  
    /**
     * Texto de alerta para los terceros relacionados.
     * Indica que las tablas con asterisco son obligatorias.
     */
    TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
  /**
   * Array que almacena los datos de los fabricantes para mostrar en la tabla.
   * Los datos se obtienen del servicio y se actualizan cuando se agregan, editan o eliminan fabricantes.
   */
   fabricanteRowData: FacricanteModel[] = [];
   
   /**
    * Array que almacena los datos de los destinatarios para mostrar en la tabla.
    * Los datos se obtienen del servicio y se actualizan cuando se agregan, editan o eliminan destinatarios.
    */
   destinatarioRowData: DestinatarioModel[] = [];
   
   /**
    * Array que almacena los datos de los facturadores para mostrar en la tabla.
    * Los datos se obtienen del servicio y se actualizan cuando se agregan, editan o eliminan facturadores.
    */
   facturadorRowData: FacturadorModel[] = [];
   
   /**
    * Array que almacena los datos de los proveedores para mostrar en la tabla.
    * Los datos se obtienen del servicio y se actualizan cuando se agregan, editan o eliminan proveedores.
    */
   proveedorRowData: ProveedorModel[] = [];
/**
 * Procesa y envía los datos del formulario de fabricante.
 * 
 * Valida que el formulario no esté vacío, luego crea un nuevo fabricante
 * o actualiza uno existente si se está en modo edición. Actualiza el store
 * con los nuevos datos y resetea el formulario.
 */
submitFabricanteForm() {
  if (this.agregarFabricanteFormGroup) {
     if (TercerosRelacionadosTwoComponent.isFormGroupEmpty(this.agregarFabricanteFormGroup)) {
    
      return;
    }
    if(this.agregarFabricanteFormGroup.invalid) {
      return;
    }
    const NEW_FABRICANTE = {
        denominacionRazonSocial: this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.value,
        rfc: this.agregarFabricanteFormGroup.get('rfc')?.value,
        curp: this.agregarFabricanteFormGroup.get('curp')?.value,
        telefono: this.agregarFabricanteFormGroup.get('telefono')?.value,
        CorreoElectronico: this.agregarFabricanteFormGroup.get('CorreoElectronico')?.value,
        calle: this.agregarFabricanteFormGroup.get('calle')?.value,
        numeroExterior: this.agregarFabricanteFormGroup.get('numeroExterior')?.value,
        numeroInterior: this.agregarFabricanteFormGroup.get('numeroInterior')?.value,
        pais: this.agregarFabricanteFormGroup.get('pais')?.value,
        colonia: this.agregarFabricanteFormGroup.get('colonia')?.value,
        municipioOAlcaldia: this.agregarFabricanteFormGroup.get('municipioOAlcaldia')?.value,
        localidad: this.agregarFabricanteFormGroup.get('localidad')?.value,
        entidadFederativa: this.agregarFabricanteFormGroup.get('entidadFederativa')?.value,
        estadoLocalidad: this.agregarFabricanteFormGroup.get('estadoLocalidad')?.value,
        codigoPostal: this.agregarFabricanteFormGroup.get('codigoPostal')?.value,
        coloniaoEquivalente: this.agregarFabricanteFormGroup.get('coloniaoEquivalente')?.value 
    };

    if (this.editFabricanteIndex !== null) {
      this.fabricanteRowData[this.editFabricanteIndex] = NEW_FABRICANTE;
      this.editFabricanteIndex = null;
    } else {
      this.fabricanteRowData = [...this.fabricanteRowData, NEW_FABRICANTE];
    }

    this.fabricanteTablaDataChange.emit(this.fabricanteRowData);

    this.toggleDivFabricante();
    this.agregarFabricanteFormGroup.reset();
    this.selectedFabricanteRows = [];
  }
}

/**
 * Maneja la modificación de un fabricante seleccionado.
 * Si hay una fila seleccionada, actualiza el formulario con los datos del fabricante seleccionado.
 */
onModificarFabricante() {
  if (this.selectedFabricanteRows.length === 1) {
    const SELECTED = this.selectedFabricanteRows[0];
    this.editFabricanteIndex = this.fabricanteRowData.findIndex(
      row => row === SELECTED
    );
    this.agregarFabricanteFormGroup.patchValue(SELECTED);
    this.showFabricante = true;
    this.showTableDiv = false;
  }
}
/**
 * Maneja la modificación de un destinatario seleccionado.
 * Si hay una fila seleccionada, actualiza el formulario con los datos del destinatario seleccionado.
 */
onModificarDestinatario(){
if(this.selectedDestinatarioRows.length === 1){
  const SELECTED = this.selectedDestinatarioRows[0];
  this.editDestinatarioIndex = this.destinatarioRowData.findIndex(
    row => row === SELECTED
  );
  this.agregarDestinatarioFormGroup.patchValue(SELECTED);
  this.showDestinatario = true;
  this.showTableDiv = false;
}
}

 /**
   * @property {string[]} elementosRequeridos
   * Lista de elementos que son obligatorios en el formulario.
   */
  @Input() public elementosRequeridos!: string[];

/**
 * Array que almacena las filas seleccionadas de la tabla de fabricantes mediante checkboxes.
 * Se utiliza para realizar operaciones en lote como eliminar o modificar múltiples fabricantes.
 */
selectedFabricanteRows: FacricanteModel[] = [];

/**
 * Maneja la selección de filas en la tabla de fabricantes.
 * 
 * Actualiza el array de filas seleccionadas cuando el usuario marca o desmarca
 * los checkboxes en la tabla de fabricantes.
 * 
 * @param selected - Array de fabricantes seleccionados por el usuario
 */
onFabricanteSeleccionados(selected: FacricanteModel[]):void {
  this.selectedFabricanteRows = selected;
}
/**
 * Elimina las filas seleccionadas de la tabla de fabricantes.
 */
eliminarSeleccionadosFabricante() :void {
  this.fabricanteRowData = this.fabricanteRowData.filter(
    row => !this.selectedFabricanteRows.includes(row)
  );
  this.selectedFabricanteRows = [];
  
  this.fabricanteTablaDataChange.emit(this.fabricanteRowData);
}
  /**
   * Envía el formulario de destinatario y actualiza los datos en el store.
   */
submitDestinatarioForm(): void {
  if (this.agregarDestinatarioFormGroup) {
    if (TercerosRelacionadosTwoComponent.isFormGroupEmpty(this.agregarDestinatarioFormGroup)) {
      return;
    }

    if(this.agregarDestinatarioFormGroup.invalid) {
      return;
    }
    const NEW_DESTINATARIO = this.agregarDestinatarioFormGroup.value;

    if (this.editDestinatarioIndex !== null) {
      this.destinatarioRowData[this.editDestinatarioIndex] = NEW_DESTINATARIO;
      this.editDestinatarioIndex = null;
    } else {
      this.destinatarioRowData = [...this.destinatarioRowData, NEW_DESTINATARIO];
    }

    this.destinatarioTablaDataChange.emit(this.destinatarioRowData);
    this.toggleDivDestinatario();
    this.agregarDestinatarioFormGroup.reset();
    this.selectedDestinatarioRows = [];
  }
}
/**
 * Array que almacena las filas seleccionadas de la tabla de destinatarios mediante checkboxes.
 * Se utiliza para realizar operaciones como eliminar o modificar destinatarios seleccionados.
 */
selectedDestinatarioRows: DestinatarioModel[] = [];

/**
 * Maneja la selección de filas en la tabla de destinatarios.
 * Actualiza el array con los destinatarios seleccionados por el usuario.
 */
selectedProveedorRows: ProveedorModel[] = [];

/**
 * Array que almacena las filas seleccionadas de la tabla de proveedores mediante checkboxes.
 * Se utiliza para realizar operaciones como eliminar o modificar proveedores seleccionados.
 */
selectedFacturadorRows: FacturadorModel[] = [];
/**
 * Maneja la selección de filas en la tabla de facturadores.
 * Actualiza la propiedad `selectedFacturadorRows` con las filas seleccionadas.
 * @param selected Filas seleccionadas de la tabla de facturadores.
 */
onDestinatarioSeleccionados(selected: DestinatarioModel[]) {
  this.selectedDestinatarioRows = selected;
}
/**
 * Elimina las filas seleccionadas de la tabla de destinatarios.
 * @description Este método filtra las filas de la tabla para eliminar aquellas que están en `selectedDestinatarioRows`.
 */
eliminarSeleccionadosDestinatario() {
  this.destinatarioRowData = this.destinatarioRowData.filter(
    row => !this.selectedDestinatarioRows.includes(row)
  );
  this.selectedDestinatarioRows = [];
  this.destinatarioTablaDataChange.emit(this.destinatarioRowData);
}
/**
 * 
 * @param selected Filas seleccionadas de la tabla de proveedores.
 */
onProveedorSeleccionados(selected: ProveedorModel[]) {
  this.selectedProveedorRows = selected;
}
   
  
    /**
     * Validador personalizado para verificar que el país seleccionado sea válido.
     * 
     * Valida que el valor del control no sea una cadena vacía ni el valor '-1',
     * que generalmente se usa como valor por defecto en los selectores.
     * 
     * @param control - Control del formulario a validar
     * @returns `null` si el valor es válido, objeto con error `requiredPais` si es inválido
     */
    static requiredPaisValidator(control: AbstractControl): { requiredPais: boolean } | null {
      return control.value !== '' && control.value !== '-1'
        ? null
        : { requiredPais: true };
    }
  
    /**
     * Validador personalizado para verificar que el RFC tenga un formato válido.
     * 
     * Utiliza expresiones regulares predefinidas para validar tanto RFC de personas
     * físicas como de personas morales, asegurando que cumplan con el formato
     * oficial establecido por el SAT.
     * 
     * @param control - Control del formulario que contiene el RFC a validar
     * @returns `null` si el RFC es válido, objeto con error `invalidRFC` si es inválido
     */
    static rfcValidator(control: AbstractControl): { invalidRFC: boolean } | null {
      const VALUE = control.value;
      if (REGEX_RFC_FISICA.test(VALUE) || REGEX_RFC_MORAL.test(VALUE)) {
        return null; // RFC válido
      }
      return { invalidRFC: true }; // RFC inválido
    }
   

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Emite una señal a través del Subject `destroy$` para cancelar todas las
   * suscripciones activas y completa el Subject para liberar recursos y
   * prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Valida todos los formularios de terceros relacionados del componente.
   * 
   * Verifica que todos los formularios (fabricante, destinatario, proveedor y facturador)
   * estén válidos. Si alguno no lo está, marca todos los campos como tocados
   * para mostrar los mensajes de validación correspondientes.
   * 
   * @returns `true` si todos los formularios son válidos, `false` en caso contrario
   */
  formularioValidacion(): boolean {
    const ISVALID = this.agregarFabricanteFormGroup.valid && this.agregarDestinatarioFormGroup.valid;
    if (!ISVALID) {
      this.agregarFabricanteFormGroup.markAllAsTouched();
      this.agregarDestinatarioFormGroup.markAllAsTouched();
    }
    return ISVALID? true : false;
  }

    /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
  cambiarRadio(value: string | number, formGroup: FormGroup): void {
    const VALOR_SELECCIONADO = value as string;
    this.resetAllExcept(formGroup, ['tercerosNacionalidad']);
    this.disableAllExcept(formGroup, ['tercerosNacionalidad', 'tipoPersona']);
    this.tercerosInputChecked(VALOR_SELECCIONADO);
  }

  /**
   * Deshabilita todos los controles de un FormGroup excepto los especificados.
   * @param formGroup El FormGroup cuyos controles se van a deshabilitar.
   * @param except Array de nombres de controles que no se deben deshabilitar.
   */
  resetAllExcept(formGroup: FormGroup, except: string[]): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (except.includes(key)) {
        return;
      }
      const CONTROL = formGroup.get(key);
      if (CONTROL instanceof FormGroup) {
        this.resetAllExcept(CONTROL, except);
      } else {
        CONTROL?.reset();
      }
    });
  }

  /**
   * Deshabilita todos los controles de un FormGroup excepto los especificados.
   * @param formGroup El FormGroup cuyos controles se van a deshabilitar.
   * @param except Array de nombres de controles que no se deben deshabilitar.
   */
  disableAllExcept(formGroup: FormGroup, except: string[]): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (except.includes(key)) {
        return;
      }
      const CONTROL = formGroup.get(key);
      if (CONTROL instanceof FormGroup) {
        this.disableAllExcept(CONTROL, except);
      } else {
        CONTROL?.disable();
      }
    });
  }

  /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
  cambiarRadioFisica(value: string | number, formGroup?: FormGroup): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO, formGroup);
  }

    /**
   * Maneja el cambio en los checkboxes para seleccionar el tipo de persona.
   * Actualiza los indicadores `fisica` y `moral` según el checkbox seleccionado.
   *
   * @param checkBoxName Nombre del checkbox seleccionado (fisica o moral).
   */
  public inputChecked(checkBoxName: string, formGroup?: FormGroup): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
      this.noContribuyente = false;
      this.agregarFabricanteFormGroup.get('curp')?.disable();
      this.agregarFabricanteFormGroup.get('rfc')?.enable();
    } else if (checkBoxName === 'moral') {
      this.fisica = false;
      this.moral = true;
      this.noContribuyente = false;
      this.agregarFabricanteFormGroup.get('curp')?.disable();
      this.agregarFabricanteFormGroup.get('rfc')?.enable();
    } else {
      this.noContribuyente = true;
      this.fisica = false;
      this.moral = false;
    }

    // Condition for updating the validitity on tipo persona change
    if (this.extranjero && (this.fisica || this.moral) && formGroup) {
      if (this.fisica) {
        ['rfc', 'curp', 'denominacionRazonSocial', 'codigoPostaloEquivalente', 'entidadFederativa','municipioAlcaldia', 'extranjeroCodigo', 'extranjeroColonia', 'estadoLocalidad'].forEach(key => formGroup.get(key)?.clearValidators());
        ['nombre', 'primerApellido', 'segundoApellido'].forEach(key => formGroup.get(key)?.setValidators([Validators.required]));
      } else if (this.moral) {
             ['rfc', 'curp', 'entidadFederativa', 'codigoPostaloEquivalente', 'municipioAlcaldia','extranjeroCodigo', 'extranjeroColonia', 'nombre', 'primerApellido', 'segundoApellido', 'estadoLocalidad'].forEach(key => formGroup.get(key)?.clearValidators());
        ['denominacionRazonSocial'].forEach(key => formGroup.get(key)?.setValidators([Validators.required]));
      }
      formGroup.updateValueAndValidity();
    }
    if (this.nacional && (this.fisica || this.moral) && formGroup) {
      ['rfc'].forEach(key => formGroup.get(key)?.setValidators([Validators.required, Validators.maxLength(15), TercerosRelacionadosTwoComponent.rfcValidator,]));
      ['curp'].forEach(key => formGroup.get(key)?.clearValidators());
      formGroup.updateValueAndValidity();
    }
    if (this.nacional && this.noContribuyente && formGroup) {
      ['curp'].forEach(key => formGroup.get(key)?.setValidators([Validators.required, Validators.maxLength(18),]));
      ['rfc'].forEach(key => formGroup.get(key)?.clearValidators());
      formGroup.updateValueAndValidity();
    }
  }

    /**
     * Valida el RFC del tercero.
     * Utiliza expresiones regulares para verificar el formato correcto.
     *
     * @param control Control del formulario que contiene el RFC.
     * @returns Un objeto de error si el RFC es inválido, o `null` si es válido.
     */
    onTipoPersonaChange(formGroup: FormGroup): void {
      this.tipoPersonaSelection = formGroup.get('tipoPersona')?.value || '';
      const TIPO_PERSONA_CONTROL = formGroup.get('tipoPersona');
      this.resetAllExcept(formGroup, ['tercerosNacionalidad', 'tipoPersona']);
      if (TIPO_PERSONA_CONTROL?.value && this.nacional && !this.extranjero) {
        if(this.fisica || this.moral) {
            formGroup.get('rfc')?.enable();
            formGroup.get('curp')?.disable();
        } else if(this.noContribuyente) {
            formGroup.get('rfc')?.disable();
            formGroup.get('curp')?.enable();
            
            [
              'pais', 'estadoLocalidad', 'municipioAlcaldia', 'localidad', 'codigoPostaloEquivalente',
              'colonia', 'calle', 'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
            ].forEach(key => formGroup.get(key)?.enable());
        } else {
            formGroup.get('rfc')?.enable();
            formGroup.get('curp')?.enable();
        }
      } else {
        formGroup.enable();
      }  
    }

  /**
   * compo doc
   * @method esValido
   * @description
   * Verifica si un campo específico del formulario es válido.
   * @param campo El nombre del campo que se desea validar.
   * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
   */
  public esValido(campo: string, form: FormGroup): boolean | null {
    return this.validacionesService.isValid(form, campo);
  }

    // eslint-disable-next-line class-methods-use-this
    buscar(form: FormGroup): void {
      const PROCEDIMIENTO = String(this.idProcedimiento);
      let DATOS: Record<string, unknown> = {};
      if (form.get('rfc')?.valid && getValidDatos(form.get('rfc')?.value)) {
        const PAYLOAD = {
          "rfcRepresentanteLegal": form.get('rfc')?.value
        }
        this.service.getRepresentanteLegala(PAYLOAD, PROCEDIMIENTO).pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const API_RESPONSE = doDeepCopy(response);
          if(esValidArray(API_RESPONSE.datos)) {
            DATOS = TercerosRelacionadosTwoComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
            form.patchValue(DATOS);
          }
        });
      } else if (form.get('curp')?.valid && getValidDatos(form.get('curp')?.value)) {
         const CURP = form.get('curp')?.value;
         this.service.getCURP(CURP, PROCEDIMIENTO).pipe(takeUntil(this.destroyNotifier$))
         .subscribe((response) => {
            const API_RESPONSE = doDeepCopy(response);
            if(esValidArray(API_RESPONSE.datos)) {
              DATOS = TercerosRelacionadosTwoComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
              form.patchValue(DATOS);
            }
         });
      } else {
        form.get('rfc')?.markAsTouched();
        form.get('curp')?.markAsTouched();
      }
    }

/**
  * @method mapApiResponseToForm
  * @description
  * Método estático que mapea la respuesta de una API a un objeto compatible con el formulario.
  * @param apiResponse Respuesta de la API que contiene los datos del tercero.
  * @returns Objeto con los campos mapeados para el formulario.
  */
 static mapApiResponseToForm(apiResponse: Record<string, unknown>): Record<string, unknown> {
   const CONTRIBUYENTE: unknown = apiResponse?.['contribuyente'] || {};
   const DOMICILIO =
     typeof CONTRIBUYENTE === 'object' && CONTRIBUYENTE !== null && 'domicilio' in CONTRIBUYENTE
       ? (CONTRIBUYENTE as { domicilio?: unknown }).domicilio || {}
       : {};

   return {
     ...TercerosRelacionadosTwoComponent.mapPersonFields(apiResponse, CONTRIBUYENTE as {
       curp?: string;
       nombre?: string;
       apellido_paterno?: string;
       apellido_materno?: string;
       razon_social?: string;
       telefono?: string;
       correo_electronico?: string;
     }),
     ...TercerosRelacionadosTwoComponent.mapAddressFields(DOMICILIO),
     lada: '',
     extranjeroCodigo: '',
     extranjeroEstado: '',
     extranjeroColonia: '',
   };
 }

  /**
  *  @method mapPersonFields
  * @description
  * Método estático que mapea los campos personales de la respuesta de la API y del contribuyente.
  * @param apiResponse Respuesta de la API que contiene los datos del tercero.
  * @param CONTRIBUYENTE Objeto que contiene los datos del contribuyente.
  * @returns Objeto con los campos personales mapeados.
  */
  private static mapPersonFields(
    apiResponse: { curp?: string; nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string } = {},
    CONTRIBUYENTE: { curp?: string; nombre?: string; apellido_paterno?: string; apellido_materno?: string; razon_social?: string; telefono?: string; correo_electronico?: string } = {}
  ): Record<string, unknown> {
    return {
      curp: apiResponse.curp ?? CONTRIBUYENTE.curp ?? '',
      nombre: apiResponse.nombre ?? CONTRIBUYENTE.nombre ?? '',
      primerApellido: apiResponse.apellidoPaterno ?? CONTRIBUYENTE.apellido_paterno ?? '',
      segundoApellido: apiResponse.apellidoMaterno ?? CONTRIBUYENTE.apellido_materno ?? '',
      denominacionRazonSocial: CONTRIBUYENTE.razon_social ?? '',
      telefono: CONTRIBUYENTE.telefono ?? '',
      correoElectronico: CONTRIBUYENTE.correo_electronico ?? '',
    };
  }

  /**
   * @method mapAddressFields
   * @description Método estático que mapea los campos de dirección de la respuesta de la API.
   * @param DOMICILIO Objeto que contiene los datos de la dirección.
   * @returns Objeto con los campos de dirección mapeados.
   */
  private static mapAddressFields(DOMICILIO: {
    pais?: { nombre?: string };
    entidad_federativa?: { nombre?: string };
    delegacion_municipio?: { nombre?: string };
    localidad?: { nombre?: string };
    cp?: string;
    colonia?: { nombre?: string };
    calle?: string;
    num_exterior?: string;
    num_interior?: string;
  } = {}): Record<string, unknown> {
    return {
      pais: DOMICILIO?.pais?.nombre ?? '',
      estadoLocalidad: DOMICILIO?.entidad_federativa?.nombre ?? '',
      municipioAlcaldia: DOMICILIO?.delegacion_municipio?.nombre ?? '',
      localidad: DOMICILIO?.localidad?.nombre ?? '',
      entidadFederativa: DOMICILIO?.entidad_federativa?.nombre ?? '',
      codigoPostaloEquivalente: DOMICILIO?.cp ?? '',
      colonia: DOMICILIO?.colonia?.nombre ?? '',
      coloniaoEquivalente: '',
      calle: DOMICILIO?.calle ?? '',
      numeroExterior: DOMICILIO?.num_exterior ?? '',
      numeroInterior: DOMICILIO?.num_interior ?? '',
    };
  }

/**
  * @method limpiar
  * @description
  * Método que limpia los valores de un formulario reactivo.
  */
  // eslint-disable-next-line class-methods-use-this
  public limpiar(forma: FormGroup): void {
    forma.reset();
  }
  /**
   * Verifica si un campo es requerido según la configuración de campos requeridos.
   *
   * @param {string} campo - Nombre del campo a verificar.
   * @returns {boolean} Retorna `true` si el campo es requerido, `false` en caso contrario.
   */
  esCampoRequerido(campo: string): boolean {
    return this.elementosRequeridos?.includes(campo) ?? false;
  }

   validarContenedor(): boolean {
    return (
      this.formularioSolicitudValidacion() ??
      false
    );
  }
   formularioSolicitudValidacion(): boolean {
    const IS_DESTINATARIO_REQUERIDO = !this.esCampoRequerido('DestinatarioFinal');
    
    let IS_DESTINATARIO_DATOS = true;
    
    // if(IS_DESTINATARIO_REQUERIDO && this.destinatarioFinalTablaDatos.length === 0){

    //   IS_DESTINATARIO_DATOS = false;
    // }
    
    if(IS_DESTINATARIO_DATOS === true){

return true;
    }
  this.isContinuarButtonClicked = true;
  return false;
   
  }
  get tramiteIDNumber(): number {
  return Number(this.tramiteID);
}
}
