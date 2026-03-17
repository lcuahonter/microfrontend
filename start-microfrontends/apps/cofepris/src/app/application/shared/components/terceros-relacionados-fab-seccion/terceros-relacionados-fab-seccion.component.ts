import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionColumna, ConsultaioQuery, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';

import { AlertComponent, Catalogo, CatalogoSelectComponent, InputRadioComponent, REGEX_CURP, REGEX_RFC_FISICA, REGEX_RFC_MORAL, REGEX_TELEFONO, TituloComponent } from '@libs/shared/data-access-user/src';

import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DestinatarioModel, FacricanteModel, FacturadorModel, ProveedorModel } from '../../models/terceros-fabricante-relocionados.model';

import { DESTINATARIO_TABLE_CONFIG, FABRICANTE_TABLE_CONFIG, FACTURADOR_TABLE_CONFIG, NACIONALIDAD_OPCIONES_DE_BOTON_DE_RADIO, PERSONA_OPCIONES_DE_BOTON_DE_RADIO, PROVEEDOR_TABLE_CONFIG, TERCEROS_TEXTO_DE_ALERTA } from '../../constantes/tereceros-relacionados-fab-seccion.enum';
import { ModalComponent } from '../modal/modal.component';

import {Subject ,map, takeUntil } from 'rxjs';

import { TercerosRelacionadosFebService } from '../../services/tereceros-relacionados-feb.service';

import { TramiteRelacionadaseStore } from '../../estados/stores/terceros-relacionados.stores';

import { TercerosRelacionadosQuery } from '../../estados/queries/terceros-relacionados.query';
import { TooltipModule } from 'ngx-bootstrap/tooltip';



@Component({
  selector: 'app-terceros-relacionados-fab-seccion',
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
  templateUrl: './terceros-relacionados-fab-seccion.component.html',
  styleUrl: './terceros-relacionados-fab-seccion.component.scss',
  encapsulation: ViewEncapsulation.None
}) 
export class TercerosRelacionadosFabSeccionComponent implements OnInit, OnDestroy {

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
    personaOpcionDeBotonDeRadio = PERSONA_OPCIONES_DE_BOTON_DE_RADIO;
  
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
     *
     * @description Se utiliza para validar y procesar los datos del proveedor.
     */
    agregarProveedorFormGroup!: FormGroup;
  
    /**
     * Formulario reactivo para agregar un facturador.
     * Este formulario contiene los campos necesarios para ingresar los datos de un facturador.
     *
     * @description Se utiliza para validar y procesar los datos del facturador.
     */
    agregarFacturadorFormGroup!: FormGroup;

    tablaGroup!: FormGroup;
    
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
  @Input() tramiteId!: string;

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
     private tramiteStore: TramiteRelacionadaseStore,
     private tramiteQuery: TercerosRelacionadosQuery,
      private tercerosService: TercerosRelacionadosFebService,
        private consultaioQuery: ConsultaioQuery,
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
     * - Obtiene los datos iniciales de fabricantes, destinatarios, proveedores y facturadores
     * - Carga los datos de encabezado de tabla y catálogos generales
     * - Obtiene los datos de países para los dropdowns geográficos
     * - Inicializa todos los formularios reactivos
     * - Se suscribe al estado del store para mantener sincronizados los datos
     */
    ngOnInit(): void {
      this.tercerosService.getFabricanteForm().subscribe(data => {
        this.fabricanteRowData = [data];
        this.tramiteStore.setFacricanteModel(this.fabricanteRowData)
      });
        
      this.tercerosService.getDestinatarioForm().subscribe(data => {
        this.destinatarioRowData = [data];
        this.tramiteStore.setDestinatarioModel(this.destinatarioRowData)
      });
      this.tercerosService.getProveedorForm().subscribe(data => {
       this.proveedorRowData = [data];
        this.tramiteStore.setProveedorModel(this.proveedorRowData)
      });
      this.tercerosService.getFacturadorForm().subscribe(data => {
        this.facturadorRowData = [data];
        this.tramiteStore.setFacturadorModel(this.facturadorRowData)
      }
      );
      this.tercerosService.getEncabezadoDeTabla()
        .pipe(takeUntil(this.destroy$)).subscribe((data:{ columns: string[] }) => {
        this.tablaEncabezadoData = data.columns;
      });
  
      /**
       * Obtiene los datos para los selectores desde el servicio de terceros.
       * Actualiza la propiedad `dropdownData` con los datos obtenidos.
       */
      this.tercerosService.getData(this.tramiteId)
      .pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.dropdownData = data;
      });
  
      /**
       * Carga los datos específicos para los dropdowns de ubicación geográfica.
       */
  
      // Carga los datos de país para el dropdown.
      this.tercerosService.getPaisData(this.tramiteId)
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
      this.initializeAgregarProveedorFormGroup();
      this.initializeAgregarFacturadorFormGroup();

      this.tramiteQuery
        .select()
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
          // this.tablaGroup.patchValue(state, { emitEvent: false });
          this.fabricanteRowData = state.facricanteModel || [];

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
        this.tercerosService.getMunicipioData(this.tramiteId, evento.clave).pipe(
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
        this.tercerosService.getLocalidadData(this.tramiteId, evento.clave).pipe(
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
        this.tercerosService.getCodigoPostalData(this.tramiteId, evento.clave).pipe(
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
        this.tercerosService.getColoniaData(this.tramiteId, evento.clave).pipe(
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
        rfc: new FormControl('', [Validators.required,TercerosRelacionadosFabSeccionComponent.rfcValidator]),
        /**
         * CURP del tercero.
         * Requiere validación adicional mediante `curpValidator`.
         */
        curp: new FormControl('', [Validators.required, Validators.pattern(REGEX_CURP)]),
        /**
         * Nombre del tercero.
         */
        nombre: new FormControl('', [Validators.required]),
        /**
         *Primer Apellido del tercero.
         */
        primerApellido: new FormControl('', [Validators.required]),
        /**
         * Segundo Apellido del tercero.
         */
        segundoApellido: new FormControl(''),
        /**
         * Denominación o razón social del tercero.
         */
        denominacionRazonSocial: new FormControl('', [Validators.required]),
        /**
         * País del tercero.
         * Requiere validación adicional mediante `requiredPaisValidator`.
         */
        pais: new FormControl('', [
          Validators.required,
          TercerosRelacionadosFabSeccionComponent.requiredPaisValidator,
        ]),
        extranjeroEstado: new FormControl('', [Validators.required]),
        /**
         * Estado o localidad del tercero.
         */
        estadoLocalidad: new FormControl('', [Validators.required]),
        /**
         * Municipio o alcaldía del tercero.
         */
        municipioAlcaldia: new FormControl('', [Validators.required]),
        /**
         * Localidad del tercero.
         */
        localidad: new FormControl(''),
        /**
         * Entidad federativa del tercero.
         */
        entidadFederativa: new FormControl('', [Validators.required]),
        /**
         * Código postal del tercero.
         */
        codigoPostaloEquivalente: new FormControl(''),
        /**
         * Colonia del tercero.
         */
        colonia: new FormControl(''),
        /**
         * Colonia equivalente del tercero.
         */
        coloniaoEquivalente: new FormControl(''),
        /**
         * Calle del tercero.
         */
        calle: new FormControl('', [Validators.required]),
        /**
         * Número exterior del tercero.
         */
        numeroExterior: new FormControl('', [Validators.required]),
        /**
         * Número interior del tercero.
         */
        numeroInterior: new FormControl(''),
        /**
         * Lada del tercero.
         */
        lada: new FormControl(''),
        /**
         * Teléfono del tercero.
         * Requiere validación adicional mediante `telefonoValidator`.
         */
        telefono: new FormControl('', [Validators.pattern(REGEX_TELEFONO)]),
        /**
         * Correo electrónico del tercero.
         */
        correoElectronico: new FormControl(''),
      });
  
      // Deshabilita campos hasta que se seleccione el tipo de persona
      this.agregarFabricanteFormGroup.get('rfc')?.disable();
      this.agregarFabricanteFormGroup.get('curp')?.disable();
      this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.disable();
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
      });
  
      // Deshabilita campos hasta que se seleccione el tipo de persona
      this.agregarDestinatarioFormGroup.get('rfc')?.disable();
      this.agregarDestinatarioFormGroup.get('curp')?.disable();
      this.agregarDestinatarioFormGroup.get('denominacionRazonSocial')?.disable();
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
          case 'agregarProveedorFormGroup':
            formGroup = this.agregarProveedorFormGroup;
            break;
          case 'agregarFacturadorFormGroup':
            formGroup = this.agregarFacturadorFormGroup;
            break;
          default:
            return;
        }
      }

    /**
     * Inicializa el formulario para agregar un proveedor.
     * Configura los campos del formulario con validaciones y comportamientos específicos.
     */
    initializeAgregarProveedorFormGroup(): void {
      /**
       * Crea el formulario reactivos para agregar un proveedor.
       * Cada campo tiene sus propias validaciones.
       */
      this.agregarProveedorFormGroup = this.fb.group({
        /**
         * Tipo de persona (física o moral).
         */
        tipoPersona: new FormControl('', [Validators.required]),
        /**
         * Nombre del proveedor.
         */
        nombre: new FormControl('', [Validators.required]),
        /**
         * Primer apellido del proveedor.
         */
        primerApellido: new FormControl('', [Validators.required]),
        /**
         * Denominación o razón social del proveedor.
         */
        denominacionRazonSocial: new FormControl('', [Validators.required]),
        /**
         * Segundo apellido del proveedor (opcional).
         */
        segundoApellido: new FormControl(''),
        /**
         * País del proveedor.
         */
        pais: new FormControl('', [Validators.required]),
        /**
         * Estado del proveedor.
         */
        estado: new FormControl('', [Validators.required]),
        /**
         * Código postal del proveedor (opcional).
         */
        codigoPostaloEquivalente: new FormControl(''),
        /**
         * Colonia equivalente del proveedor (opcional).
         */
        coloniaoEquivalente: new FormControl(''),
        /**
         * Calle del proveedor.
         */
        calle: new FormControl('', [Validators.required]),
        /**
         * Número exterior del proveedor.
         */
        numeroExterior: new FormControl('', [Validators.required]),
        /**
         * Número interior del proveedor (opcional).
         */
        numeroInterior: new FormControl(''),
        /**
         * Lada del proveedor (opcional).
         */
        lada: new FormControl(''),
        /**
         * Teléfono del proveedor (opcional).
         */
        telefono: new FormControl(''),
        /**
         * Correo electrónico del proveedor (opcional).
         */
        correoElectronico: new FormControl(''),
      });
  
      // Deshabilita campos hasta que se seleccione el tipo de persona
      this.agregarProveedorFormGroup.get('nombre')?.disable();
      this.agregarProveedorFormGroup.get('segundoApellido')?.disable();
      this.agregarProveedorFormGroup.get('primerApellido')?.disable();
      this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.disable();
    }
  
    /**
     * Inicializa el formulario para agregar un facturador.
     * Configura los campos del formulario con validaciones y comportamientos específicos.
     */
    initializeAgregarFacturadorFormGroup(): void {
      /**
       * Crea el formulario reactivos para agregar un facturador.
       * Cada campo tiene sus propias validaciones.
       */
      this.agregarFacturadorFormGroup = this.fb.group({
        /**
         * Tipo de persona (física o moral).
         */
        tipoPersona: new FormControl('', [Validators.required]),
        /**
         * Nombre del facturador.
         */
        nombre: new FormControl('', [Validators.required]),
        /**
         * Primer apellido del facturador.
         */
        primerApellido: new FormControl('', [Validators.required]),
        /**
         * Denominación o razón social del facturador.
         */
        denominacionRazonSocial: new FormControl('', [Validators.required]),
        /**
         * Segundo apellido del facturador (opcional).
         */
        segundoApellido: new FormControl(''),
        /**
         * País del facturador.
         * Requiere validación adicional mediante `requiredPaisValidator`.
         */
        pais: new FormControl('', [
          Validators.required,
          TercerosRelacionadosFabSeccionComponent.requiredPaisValidator,
        ]),
        /**
         * Estado del facturador.
         */
        estado: new FormControl('', [Validators.required]),
        /**
         * Código postal del facturador (opcional).
         */
        codigoPostaloEquivalente: new FormControl(''),
        /**
         * Colonia equivalente del facturador (opcional).
         */
        coloniaoEquivalente: new FormControl(''),
        /**
         * Calle del facturador.
         */
        calle: new FormControl('', [Validators.required]),
        /**
         * Número exterior del facturador.
         */
        numeroExterior: new FormControl('', [Validators.required]),
        /**
         * Número interior del facturador (opcional).
         */
        numeroInterior: new FormControl(''),
        /**
         * Lada del facturador (opcional).
         */
        lada: new FormControl(''),
        /**
         * Teléfono del facturador (opcional).
         */
        telefono: new FormControl(''),
        /**
         * Correo electrónico del facturador (opcional).
         */
        correoElectronico: new FormControl(''),
      });
  
      // Deshabilita campos hasta que se seleccione el tipo de persona
      this.agregarFacturadorFormGroup.get('nombre')?.disable();
      this.agregarFacturadorFormGroup.get('segundoApellido')?.disable();
      this.agregarFacturadorFormGroup.get('primerApellido')?.disable();
      this.agregarFacturadorFormGroup.get('denominacionRazonSocial')?.disable();
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
      if (formGroupName === 'Facturador') {
        /**
         * Habilita los campos del formulario de facturador.
         */
        this.agregarFacturadorFormGroup.get('nombre')?.enable();
        this.agregarFacturadorFormGroup.get('primerApellido')?.enable();
        this.agregarFacturadorFormGroup.get('segundoApellido')?.enable();
        this.agregarFacturadorFormGroup.get('denominacionRazonSocial')?.enable();
      } else if (formGroupName === 'Proveedor') {
        /**
         * Habilita los campos del formulario de proveedor.
         */
        this.agregarProveedorFormGroup.get('nombre')?.enable();
        this.agregarProveedorFormGroup.get('primerApellido')?.enable();
        this.agregarProveedorFormGroup.get('segundoApellido')?.enable();
        this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.enable();
      } else if (formGroupName === 'Destinatario') {
        /**
         * Habilita los campos del formulario de destinatario.
         */
        this.agregarDestinatarioFormGroup.get('rfc')?.enable();
        this.agregarDestinatarioFormGroup.get('curp')?.enable();
        this.agregarDestinatarioFormGroup
          .get('denominacionRazonSocial')
          ?.enable();
      } else if (formGroupName === 'Fabricante') {
        /**
         * Habilita los campos del formulario de fabricante.
         */
        this.agregarFabricanteFormGroup.get('rfc')?.enable();
        this.agregarFabricanteFormGroup.get('curp')?.enable();
        this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.enable();
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
     if (TercerosRelacionadosFabSeccionComponent.isFormGroupEmpty(this.agregarFabricanteFormGroup)) {
    
      return;
    }
    const NEW_FABRICANTE = this.agregarFabricanteFormGroup.value;

    if (this.editFabricanteIndex !== null) {
      this.fabricanteRowData[this.editFabricanteIndex] = NEW_FABRICANTE;
      this.editFabricanteIndex = null;
    } else {
      this.fabricanteRowData = [...this.fabricanteRowData, NEW_FABRICANTE];
    }

    this.tramiteStore.setFacricanteModel(this.fabricanteRowData);

    this.toggleDivFabricante();
    this.agregarFabricanteFormGroup.reset();
    this.selectedFabricanteRows = [];
  }
}
/**
 * Envía el formulario de facturador y actualiza los datos en el store.
 */
submitFacturadorForm(): void {
  if (this.agregarFacturadorFormGroup) {
     if (TercerosRelacionadosFabSeccionComponent.isFormGroupEmpty(this.agregarFacturadorFormGroup)) {
      
      return;
    }
    const NEW_FACTURADOR = this.agregarFacturadorFormGroup.value;

    if (this.editFacturadorIndex !== null) {
      this.facturadorRowData[this.editFacturadorIndex] = NEW_FACTURADOR;
      this.editFacturadorIndex = null;
    } else {
      this.facturadorRowData = [...this.facturadorRowData, NEW_FACTURADOR];
    }

    this.tramiteStore.setFacturadorModel(this.facturadorRowData);

    this.toggleDivFacturador();
    this.agregarFacturadorFormGroup.reset();
    this.selectedFacturadorRows = [];
  }
}
/**
 * Envía el formulario de proveedor y actualiza los datos en el store.
 */
onModificarProveedor(){
  if (this.selectedProveedorRows.length === 1) {
    const SELECTED = this.selectedProveedorRows[0];
    this.editProveedorIndex = this.proveedorRowData.findIndex(
      row => row === SELECTED
    );
    this.agregarProveedorFormGroup.patchValue(SELECTED);
    this.showProveedor = true;
    this.showTableDiv = false;
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
 * Maneja la modificación de un facturador seleccionado.
 * Si hay una fila seleccionada, actualiza el formulario con los datos del facturador seleccionado.
 */ 
onModificarFacturador(){
  if (this.selectedFacturadorRows.length === 1) {
    const SELECTED = this.selectedFacturadorRows[0];
    this.editFacturadorIndex = this.facturadorRowData.findIndex(
      row => row === SELECTED
    );
    this.agregarFacturadorFormGroup.patchValue(SELECTED);
    this.showFacturador = true;
    this.showTableDiv = false;
  }
}
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
  
  this.tramiteStore.setFacricanteModel(this.fabricanteRowData);
}
  /**
   * Envía el formulario de destinatario y actualiza los datos en el store.
   */
submitDestinatarioForm(): void {
  if (this.agregarDestinatarioFormGroup) {
    if (TercerosRelacionadosFabSeccionComponent.isFormGroupEmpty(this.agregarDestinatarioFormGroup)) {
      return;
    }
    const NEW_DESTINATARIO = this.agregarDestinatarioFormGroup.value;

    if (this.editDestinatarioIndex !== null) {
      this.destinatarioRowData[this.editDestinatarioIndex] = NEW_DESTINATARIO;
      this.editDestinatarioIndex = null;
    } else {
      this.destinatarioRowData = [...this.destinatarioRowData, NEW_DESTINATARIO];
    }

    this.tramiteStore.setDestinatarioModel(this.destinatarioRowData);

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
  
  this.tramiteStore.setDestinatarioModel(this.destinatarioRowData);
}
/**
 * 
 * @param selected Filas seleccionadas de la tabla de proveedores.
 */
onProveedorSeleccionados(selected: ProveedorModel[]) {
  this.selectedProveedorRows = selected;
}
/**
 * Elimina las filas seleccionadas de la tabla de proveedores.  
 */
  eliminarSeleccionadosProveedor(){
    this.proveedorRowData = this.proveedorRowData.filter(
    row => !this.selectedProveedorRows.includes(row)
  );
  this.selectedProveedorRows = [];
  
  this.tramiteStore.setProveedorModel(this.proveedorRowData);
  }

    /**
     * Envía el formulario de Proveedor y actualiza los datos en el store.
     * Crea una nueva fila para la tabla con los datos del formulario.
     *
     * @description Este método es llamado al enviar el formulario de agregar un proveedor.
     */
   submitProveedorForm(): void {
  if (this.agregarProveedorFormGroup) {
 if (TercerosRelacionadosFabSeccionComponent.isFormGroupEmpty(this.agregarProveedorFormGroup)) {
      return;
    }
    const NEW_PROVEEDOR = this.agregarProveedorFormGroup.value;

    if (this.editProveedorIndex !== null) {
      this.proveedorRowData[this.editProveedorIndex] = NEW_PROVEEDOR;
      this.editProveedorIndex = null;
    } else {
      this.proveedorRowData = [...this.proveedorRowData, NEW_PROVEEDOR];
    }

    this.tramiteStore.setProveedorModel(this.proveedorRowData);

    this.toggleDivProveedor();
    this.agregarProveedorFormGroup.reset();
    this.selectedProveedorRows = [];
  }
}
    /**
     * 
     * @param selected Filas seleccionadas de la tabla de facturadores.
     * @description Este método actualiza la propiedad `selectedFacturadorRows` con las filas seleccionadas.
     */
  onFacturadorSeleccionados(selected: FacturadorModel[]) {
  this.selectedFacturadorRows = selected;
}
/**
 * Elimina las filas seleccionadas de la tabla de facturadores.
 * @description Este método filtra las filas de la tabla para eliminar aquellas que están en `selectedFacturadorRows`.
 */
  eliminarSeleccionadosFacturador(){
    this.facturadorRowData = this.facturadorRowData.filter(
    row => !this.selectedFacturadorRows.includes(row)
  );
  this.selectedFacturadorRows = [];
  
  this.tramiteStore.setFacturadorModel(this.facturadorRowData);
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
    const ISVALID = this.agregarFabricanteFormGroup.valid && this.agregarDestinatarioFormGroup.valid && this.agregarProveedorFormGroup.valid && this.agregarFacturadorFormGroup.valid;
    if (!ISVALID) {
      this.agregarFabricanteFormGroup.markAllAsTouched();
      this.agregarDestinatarioFormGroup.markAllAsTouched();
      this.agregarProveedorFormGroup.markAllAsTouched();
      this.agregarFacturadorFormGroup.markAllAsTouched();
    }
    return ISVALID? true : false;
  }
}
