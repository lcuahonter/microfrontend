import { CODIGOPOSTALSELECTDATA, COLONIASELECTDATA, LOCALIDADSELECTDATA, MUNICIPIOSELECTDATA, PAISSELECTDATA, TERCEROS_RELACIONADOS_TABLE_HEADER_DATA } from '@libs/shared/data-access-user/src/core/enums/260906/permiso.enum';
import { CONFIGURATION_TABLA_FABRICANTE, TABLA_ROWDATA, TERCEROS_TEXTO_DE_ALERTA } from '../../constantes/derechos.model';
import { FabricanteDatos, TERCEROS_DATAS } from '../../models/permiso-sanitario.enum';
import {InputRadioComponent , TituloComponent } from '@libs/shared/data-access-user/src';
import { TablaDatos } from '@libs/shared/data-access-user/src/core/models/260211/detos.model';

import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Terceros260211State, Terceros260211Store } from '../../../../estados/tramites/terceros260211.store';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

import { ConfiguracionColumna, ConsultaioQuery, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { ModalComponent } from '../model/modal.component';
import { Sanitario260215Store } from '../../../../estados/tramites/sanitario.store';
import { SanitarioService } from '../../services/sanitario.service';
import { TableComponent } from '@ng-mf/data-access-user';
import { Terceros260211Query } from '../../../../estados/queries/terceros260211.query';
import nacionalidadRedio from '@libs/shared/theme/assets/json/260211/nacionalidadRedio.json';
import tipoPersonaoptions from '@libs/shared/theme/assets/json/260211/tipoPersonaoptions.json';

 


@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [CommonModule,CatalogoSelectComponent,NotificacionesComponent,TituloComponent,TableComponent,TablaDinamicaComponent,ReactiveFormsModule,AlertComponent,FormsModule,ModalComponent,InputRadioComponent],
  templateUrl: './terceros-Relacionados.component.html',
  styleUrl: './terceros-Relacionados.component.scss',
 
})
export class TercerosRelacionadoesComponent implements OnInit , OnDestroy{
  /**
  * @property {ConfiguracionColumna<FabricanteDatos>[]} configuracionTablaFabricante
  * Configuración de columnas para la tabla de fabricantes.
  */
  configuracionTablaFabricante: ConfiguracionColumna<FabricanteDatos>[] = CONFIGURATION_TABLA_FABRICANTE;
    /**
   * Lista de fabricantes obtenida desde un archivo JSON.
   * Cada fabricante contiene información como nombre, RFC, CURP, teléfono, correo electrónico y dirección.
   */
  fabricanteTablaDatos: FabricanteDatos[] = [...TABLA_ROWDATA];
   /**
   * Índice de la fila de facturador actualmente en edición.
   * Si está definido, indica que se debe modificar esa fila en lugar de agregar una nueva.
   */
  editFacturadorIndex?: number;
  /**
  * Configuración de las columnas de la tabla de exportadores.
  * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
  */
  public checkbox = TablaSeleccion.CHECKBOX;
    /**
 * @property {string} rutaAcciones
 * Ruta relativa hacia la sección de acciones.
 */
  /**
   * Lista de fabricantes seleccionados en la tabla.
   * Se utiliza para operaciones como modificar o eliminar un fabricante específico.
   */
  public fabricanteSeleccionadoDatos: FabricanteDatos[] = [];
    /**
     * Estado de la solicitud obtenido desde el store.
     */
    public solicitudStates!: Terceros260211State;
    /**
     * Notificador para destruir observables y evitar memory leaks.
     * @private
     * @type {Subject<void>}
     */
    private destroyNotifier$: Subject<void> = new Subject();
/**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
 public esFormularioSoloLectura: boolean = false; 
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
   * Índice de la fila de destinatario actualmente en edición.
   * Si está definido, indica que se debe modificar esa fila en lugar de agregar una nueva.
   */
  editDestinatarioIndex?: number;
  /**
   * Índice de la fila de fabricante actualmente en edición.
   * Si está definido, indica que se debe modificar esa fila en lugar de agregar una nueva.
   */
  editFabricanteIndex?: number;
  /**
   * Índice de la fila de proveedor actualmente en edición.
   * Si está definido, indica que se debe modificar esa fila en lugar de agregar una nueva.
   */
  editProveedorIndex?: number;
  /**
   * Indicador de visibilidad para la sección del formulario de facturador.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestra o no el formulario para agregar un facturador.
   */
  showFacturador = false;
  /**
   * @property {string[]} tablaEncabezadoData
   * Encabezado de la tabla que muestra los datos de terceros relacionados.
   */
  public nuevaNotificacion!: Notificacion;
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
   * Selección del tipo de persona.
   */
  tipoPersonaSelection!: string;

  /**
   * Datos generales para los dropdowns.
   * Inicialmente vacío, se llenará con datos según sea necesario.
   *
   * @description Este arreglo almacena los datos generales para los selectores.
   */
  dropdownData: Catalogo[] = TERCEROS_DATAS;

  /**
   * Datos para el dropdown de países.
   * Utiliza los datos predefinidos en `PAISSELECTDATA`.
   *
   * @description Este arreglo almacena las opciones para el selector de países.
   */
  paisDropdownData: Catalogo[] = PAISSELECTDATA;

  /**
   * Datos para el dropdown de localidades.
   * Utiliza los datos predefinidos en `LOCALIDADSELECTDATA`.
   *
   * @description Este arreglo almacena las opciones para el selector de localidades.
   */
  localidadDropdownData: Catalogo[] = LOCALIDADSELECTDATA;

  /**
   * Datos para el dropdown de municipios.
   * Utiliza los datos predefinidos en `MUNICIPIOSELECTDATA`.
   *
   * @description Este arreglo almacena las opciones para el selector de municipios.
   */
  municipioDropdownData: Catalogo[] = MUNICIPIOSELECTDATA;

  /**
   * Datos para el dropdown de códigos postales.
   * Utiliza los datos predefinidos en `CODIGOPOSTALSELECTDATA`.
   *
   * @description Este arreglo almacena las opciones para el selector de códigos postales.
   */
  codigoPostalDropdownData: Catalogo[] = CODIGOPOSTALSELECTDATA;

  /**
   * Datos para el dropdown de colonias.
   * Utiliza los datos predefinidos en `COLONIASELECTDATA`.
   *
   * @description Este arreglo almacena las opciones para el selector de colonias.
   */
  coloniaDropdownData: Catalogo[] = COLONIASELECTDATA;

  /**
   * Formulario reactivo para agregar un fabricante.
   * Este formulario contiene los campos necesarios para ingresar los datos de un fabricante.
   *
   * @description Se utiliza para validar y procesar los datos del fabricante.
   */
  agregarFabricanteFormGroup!: FormGroup;

  nacionalidadOptions = nacionalidadRedio;

  /**
   * Opciones para el radio de tipo de persona.
   * Utiliza los datos predefinidos en `TipoPersonaRadioOptions`.
   *
   * @description Este arreglo almacena las opciones para el selector de tipo de persona.
   */
 tipoPersonaOptions = tipoPersonaoptions;


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
 /**
   * @property {ConfiguracionColumna<FabricanteDatos>[]} configuracionTablaProveedor
   * Configuración de columnas para la tabla de proveedores.
   */
  configuracionTablaProveedor: ConfiguracionColumna<FabricanteDatos>[] = CONFIGURATION_TABLA_FABRICANTE;
  /**
   * @property {ConfiguracionColumna<FabricanteDatos>[]} configuracionTablaFacturador
   * Configuración de columnas para la tabla de facturadores.
   */
  configuracionTablaFacturador: ConfiguracionColumna<FabricanteDatos>[] = CONFIGURATION_TABLA_FABRICANTE;
  
  /**
   * Lista de facturadores obtenida desde un archivo JSON.
   * Cada facturador contiene información como nombre, RFC, CURP, teléfono, correo electrónico y dirección.
   */
  facturadorTablaDatos: FabricanteDatos[] = [...TABLA_ROWDATA];
    /**
   * Lista de facturadores seleccionados en la tabla.
   * Se utiliza para operaciones como modificar o eliminar un facturador específico.
   */
  public facturadorSeleccionadoDatos: FabricanteDatos[] = [];
 /**
   * Lista de proveedores obtenida desde un archivo JSON.
   * Cada proveedor contiene información como nombre, RFC, CURP, teléfono, correo electrónico y dirección.
   */
  proveedorTablaDatos: FabricanteDatos[] = [...TABLA_ROWDATA];
  /**
   * Lista de proveedores seleccionados en la tabla.
   * Se utiliza para operaciones como modificar o eliminar un proveedor específico.
   */
  public proveedorSeleccionadoDatos: FabricanteDatos[] = [];
  /**
   * Constructor del componente.
   * Inyecta el FormBuilder, el store del trámite y el servicio de terceros.
   *
   * @param fb Constructor de formularios para crear los formularios reactivos.
   * @param sanitario260215Store Store del trámite 260215.
   * @param service Servicio que proporciona datos de terceros.
   */
  constructor(
    private fb: FormBuilder,
    private Sanitario260215Store:Sanitario260215Store,
    private service: SanitarioService,
     private consultaioQuery: ConsultaioQuery,     
     private terceros260211Query: Terceros260211Query,
     private tereceros260211store:Terceros260211Store
  ) {
     /**
         * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
         *
         * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
         * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
         * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
         */
        this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState)=>{
            this.esFormularioSoloLectura = seccionState.readonly; 
           
            this.inicializarEstadoFormulario();
          })
        )
        .subscribe();
  }

  /**
   * Ciclo de vida que se ejecuta al iniciar el componente.
   * Obtiene los datos para los selectores desde el servicio y inicializa los formularios.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();

    /**
     * Inicializa los formularios reactivos para agregar terceros.
     */
    this.initializeAgregarFabricanteFormGroup();
    this.initializeAgregarDestinatarioFormGroup();
    this.initializeAgregarProveedorFormGroup();
    this.initializeAgregarFacturadorFormGroup();
  }
/**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
    
  }
/**
 * Inicializa el formulario con los grupos de formularios para agregar fabricantes, destinatarios, proveedores y facturadores.
 */
 inicializarFormulario(): void {
     this.terceros260211Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudStates = seccionState;
        })
      )
      .subscribe();
    this.initializeAgregarFabricanteFormGroup();
    this.initializeAgregarDestinatarioFormGroup();
    this.initializeAgregarProveedorFormGroup();
    this.initializeAgregarFacturadorFormGroup();
 
}

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
     this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.agregarFacturadorFormGroup.disable();
      this.agregarFabricanteFormGroup.disable();
      this.agregarDestinatarioFormGroup.disable();
      this.agregarFacturadorFormGroup.disable();
      } else if (!this.esFormularioSoloLectura) {
       this.agregarFacturadorFormGroup.enable();
      this.agregarFabricanteFormGroup.enable();
      this.agregarDestinatarioFormGroup.enable();
      this.agregarFacturadorFormGroup.enable();
      } 
  }
  /**
   * Inicializa el formulario para agregar un fabricante.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarFabricanteFormGroup() :void{
    /**
     * Crea el formulario reactivos para agregar un fabricante.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarFabricanteFormGroup = this.fb.group({
      /**
       * Nacionalidad del tercero.
       */
      tercerosNacionalidad: new FormControl(this.solicitudStates.tercerosNacionalidad, [Validators.required]),
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl(this.solicitudStates.tipoPersona, [Validators.required]),
      /**
       * RFC del tercero.
       * Requiere validación adicional mediante `rfcValidator`.
       */
      rfc: new FormControl(this.solicitudStates.rfc, [
        Validators.required,
        TercerosRelacionadoesComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl(this.solicitudStates.curp, [
        Validators.required,
        TercerosRelacionadoesComponent.curpValidator,
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl(this.solicitudStates.nombre, [Validators.required]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl(this.solicitudStates.primerApellido, [Validators.required]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl(this.solicitudStates.segundoApellido, [Validators.required]),
      /**
       * Denominación o razón social del tercero.
       */
      denominacionRazonSocial: new FormControl(this.solicitudStates.denominacionRazonSocial, [Validators.required]),
      /**
       * País del tercero.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl(this.solicitudStates.pais, [
        Validators.required,
        TercerosRelacionadoesComponent.requiredPaisValidator,
      ]),
      /**
       * Estado o localidad del tercero.
       */
      estadoLocalidad: new FormControl(this.solicitudStates.estadoLocalidad, [Validators.required]),
      /**
       * Municipio o alcaldía del tercero.
       */
      municipioAlcaldia: new FormControl(this.solicitudStates.municipioAlcaldia, [Validators.required]),
      /**
       * Localidad del tercero.
       */
      localidad: new FormControl(this.solicitudStates.localidad),
      /**
       * Entidad federativa del tercero.
       */
      entidadFederativa: new FormControl(this.solicitudStates.entidadFederativa, [Validators.required]),
      /**
       * Código postal del tercero.
       */
      codigoPostaloEquivalente: new FormControl(this.solicitudStates.codigoPostaloEquivalente, [Validators.required]),
      /**
       * Colonia del tercero.
       */
      colonia: new FormControl(this.solicitudStates.colonia),
      /**
       * Colonia equivalente del tercero.
       */
      coloniaoEquivalente: new FormControl(this.solicitudStates.coloniaoEquivalente),
      /**
       * Calle del tercero.
       */
      calle: new FormControl(this.solicitudStates.calle, [Validators.required]),
      /**
       * Número exterior del tercero.
       */
      numeroExterior: new FormControl(this.solicitudStates.numeroExterior, [Validators.required]),
      /**
       * Número interior del tercero.
       */
      numeroInterior: new FormControl(this.solicitudStates.numeroInterior),
      /**
       * Lada del tercero.
       */
      lada: new FormControl(this.solicitudStates.lada),
      /**
       * Teléfono del tercero.
       * Requiere validación adicional mediante `telefonoValidator`.
       */
      telefono: new FormControl(this.solicitudStates.telefono, [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl(this.solicitudStates.correoElectronico),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl(this.solicitudStates.extranjeroCodigo, [Validators.required]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl(this.solicitudStates.extranjeroEstado, [Validators.required]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl(this.solicitudStates.extranjeroColonia, [Validators.required]),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarFabricanteFormGroup.get('rfc')?.disable();
    this.agregarFabricanteFormGroup.get('curp')?.disable();
    this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.disable();

    // Habilita campos al cambiar el tipo de persona
    this.agregarFabricanteFormGroup
      .get('tipoPersona')
      ?.valueChanges.subscribe(() => {
        this.agregarFabricanteFormGroup.get('rfc')?.enable();
        this.agregarFabricanteFormGroup.get('curp')?.enable();
        this.agregarFabricanteFormGroup
          .get('denominacionRazonSocial')
          ?.enable();
      });
  }

  /**
   * Inicializa el formulario para agregar un destinatario.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarDestinatarioFormGroup() :void{
    /**
     * Crea el formulario reactivos para agregar un destinatario.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarDestinatarioFormGroup = this.fb.group({
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl(this.solicitudStates.tipoPersona, [Validators.required]),
      /**
       * RFC del destinatario.
       */
      rfc: new FormControl(this.solicitudStates.rfc, [Validators.required]),
      /**
       * CURP del destinatario.
       */
      curp: new FormControl(this.solicitudStates.curp, [Validators.required]),
      /**
       * Denominación o razón social del destinatario.
       */
      denominacionRazonSocial: new FormControl(this.solicitudStates.denominacionRazonSocial, [Validators.required]),
      /**
       * País del destinatario.
       */
      pais: new FormControl(this.solicitudStates.pais, [Validators.required]),
      /**
       * Estado o localidad del destinatario.
       */
      estadoLocalidad: new FormControl(this.solicitudStates.estadoLocalidad, [Validators.required]),
      /**
       * Municipio o alcaldía del destinatario.
       */
      municipioAlcaldia: new FormControl(this.solicitudStates.municipioAlcaldia, [Validators.required]),
      /**
       * Localidad del destinatario.
       */
      localidad: new FormControl(this.solicitudStates.localidad),
      /**
       * Entidad federativa del destinatario.
       */
      entidadFederativa: new FormControl(this.solicitudStates.entidadFederativa, [Validators.required]),
      /**
       * Código postal del destinatario.
       */
      codigoPostaloEquivalente: new FormControl(this.solicitudStates.codigoPostaloEquivalente, [Validators.required]),
      /**
       * Colonia del destinatario.
       */
      colonia: new FormControl(this.solicitudStates.colonia),
      /**
       * Colonia equivalente del destinatario.
       */
      coloniaoEquivalente: new FormControl(this.solicitudStates.coloniaoEquivalente),
      /**
       * Calle del destinatario.
       */
      calle: new FormControl(this.solicitudStates.calle, [Validators.required]),
      /**
       * Número exterior del destinatario.
       */
      numeroExterior: new FormControl(this.solicitudStates.numeroExterior, [Validators.required]),
      /**
       * Número interior del destinatario.
       */
      numeroInterior: new FormControl(this.solicitudStates.numeroInterior),
      /**
       * Lada del destinatario.
       */
      lada: new FormControl(this.solicitudStates.lada),
      /**
       * Teléfono del destinatario.
       */
      telefono: new FormControl(this.solicitudStates.telefono, [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del destinatario.
       */
      correoElectronico: new FormControl(this.solicitudStates.correoElectronico),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarDestinatarioFormGroup.get('rfc')?.disable();
    this.agregarDestinatarioFormGroup.get('curp')?.disable();
    this.agregarDestinatarioFormGroup.get('denominacionRazonSocial')?.disable();

    // Habilita campos al cambiar el tipo de persona
    this.agregarDestinatarioFormGroup
      .get('tipoPersona')
      ?.valueChanges.subscribe(() => {
        this.agregarDestinatarioFormGroup.get('rfc')?.enable();
        this.agregarDestinatarioFormGroup.get('curp')?.enable();
        this.agregarDestinatarioFormGroup
          .get('denominacionRazonSocial')
          ?.enable();
      });
  }

  /**
   * Inicializa el formulario para agregar un proveedor.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarProveedorFormGroup():void{
    /**
     * Crea el formulario reactivos para agregar un proveedor.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarProveedorFormGroup = this.fb.group({
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl(this.solicitudStates.tipoPersona, [Validators.required]),
      /**
       * Nombre del proveedor.
       */
      nombre: new FormControl(this.solicitudStates.nombre, [Validators.required]),
      /**
       * Primer apellido del proveedor.
       */
      primerApellido: new FormControl(this.solicitudStates.primerApellido, [Validators.required]),
      /**
       * Denominación o razón social del proveedor.
       */
      denominacionRazonSocial: new FormControl(this.solicitudStates.denominacionRazonSocial, [Validators.required]),
      /**
       * Segundo apellido del proveedor (opcional).
       */
      segundoApellido: new FormControl(this.solicitudStates.segundoApellido),
      /**
       * País del proveedor.
       */
      pais: new FormControl(this.solicitudStates.pais, [Validators.required]),
      /**
       * Estado del proveedor.
       */
      estado: new FormControl(this.solicitudStates.estado, [Validators.required]),
      /**
       * Código postal del proveedor (opcional).
       */
      codigoPostaloEquivalente: new FormControl(this.solicitudStates.codigoPostaloEquivalente),
      /**
       * Colonia equivalente del proveedor (opcional).
       */
      coloniaoEquivalente: new FormControl(this.solicitudStates.coloniaoEquivalente),
      /**
       * Calle del proveedor.
       */
      calle: new FormControl(this.solicitudStates.calle, [Validators.required]),
      /**
       * Número exterior del proveedor.
       */
      numeroExterior: new FormControl(this.solicitudStates.numeroExterior, [Validators.required]),
      /**
       * Número interior del proveedor (opcional).
       */
      numeroInterior: new FormControl(this.solicitudStates.numeroInterior),
      /**
       * Lada del proveedor (opcional).
       */
      lada: new FormControl(this.solicitudStates.lada),
      /**
       * Teléfono del proveedor (opcional).
       */
      telefono: new FormControl(this.solicitudStates.telefono, [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del proveedor (opcional).
       */
      correoElectronico: new FormControl(this.solicitudStates.correoElectronico),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarProveedorFormGroup.get('nombre')?.disable();
    this.agregarProveedorFormGroup.get('segundoApellido')?.disable();
    this.agregarProveedorFormGroup.get('primerApellido')?.disable();
    this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.disable();

    // Habilita campos al cambiar el tipo de persona
    this.agregarProveedorFormGroup
      .get('tipoPersona')
      ?.valueChanges.subscribe(() => {
        this.agregarProveedorFormGroup.get('nombre')?.enable();
        this.agregarProveedorFormGroup.get('primerApellido')?.enable();
        this.agregarProveedorFormGroup.get('segundoApellido')?.enable();
        this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.enable();
      });
  }

  /**
   * Inicializa el formulario para agregar un facturador.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarFacturadorFormGroup():void {
    /**
     * Crea el formulario reactivos para agregar un facturador.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarFacturadorFormGroup = this.fb.group({
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl(this.solicitudStates.tipoPersona, [Validators.required]),
      /**
       * Nombre del facturador.
       */
      nombre: new FormControl(this.solicitudStates.nombre, [Validators.required]),
      /**
       * Primer apellido del facturador.
       */
      primerApellido: new FormControl(this.solicitudStates.primerApellido, [Validators.required]),
      /**
       * Denominación o razón social del facturador.
       */
      denominacionRazonSocial: new FormControl(this.solicitudStates.denominacionRazonSocial, [Validators.required]),
      /**
       * Segundo apellido del facturador (opcional).
       */
      segundoApellido: new FormControl(this.solicitudStates.segundoApellido),
      /**
       * País del facturador.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl(this.solicitudStates.pais, [
        Validators.required,
        TercerosRelacionadoesComponent.requiredPaisValidator,
      ]),
      /**
       * Estado del facturador.
       */
      estado: new FormControl(this.solicitudStates.estado, [Validators.required]),
      /**
       * Código postal del facturador (opcional).
       */
      codigoPostaloEquivalente: new FormControl(this.solicitudStates.codigoPostaloEquivalente),
      /**
       * Colonia equivalente del facturador (opcional).
       */
      coloniaoEquivalente: new FormControl(this.solicitudStates.coloniaoEquivalente),
      /**
       * Calle del facturador.
       */
      calle: new FormControl(this.solicitudStates.calle, [Validators.required]),
      /**
       * Número exterior del facturador.
       */
      numeroExterior: new FormControl(this.solicitudStates.numeroExterior, [Validators.required]),
      /**
       * Número interior del facturador (opcional).
       */
      numeroInterior: new FormControl(this.solicitudStates.numeroInterior),
      /**
       * Lada del facturador (opcional).
       */
      lada: new FormControl(this.solicitudStates.lada),
      /**
       * Teléfono del facturador (opcional).
       */
      telefono: new FormControl(this.solicitudStates.telefono, [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del facturador (opcional).
       */
      correoElectronico: new FormControl(this.solicitudStates.correoElectronico),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarFacturadorFormGroup.get('nombre')?.disable();
    this.agregarFacturadorFormGroup.get('segundoApellido')?.disable();
    this.agregarFacturadorFormGroup.get('primerApellido')?.disable();
    this.agregarFacturadorFormGroup.get('denominacionRazonSocial')?.disable();

    // Habilita campos al cambiar el tipo de persona
    this.agregarFacturadorFormGroup
      .get('tipoPersona')
      ?.valueChanges.subscribe(() => {
        this.agregarFacturadorFormGroup.get('nombre')?.enable();
        this.agregarFacturadorFormGroup.get('primerApellido')?.enable();
        this.agregarFacturadorFormGroup.get('segundoApellido')?.enable();
        this.agregarFacturadorFormGroup
          .get('denominacionRazonSocial')
          ?.enable();
      });
  }
 /**
   * @property {ConfiguracionColumna<FabricanteDatos>[]} configuracionTablaDestinatarioFinal
   * Configuración de columnas para la tabla de destinatarios finales.
   */
  configuracionTablaDestinatarioFinal: ConfiguracionColumna<FabricanteDatos>[] = CONFIGURATION_TABLA_FABRICANTE;
  /**
   * Lista de destinatarios finales obtenida desde un archivo JSON.
   * Cada destinatario contiene información como nombre, RFC, CURP, teléfono, correo electrónico y dirección.
   */
  destinatarioFinalTablaDatos: FabricanteDatos[] = [...TABLA_ROWDATA];
  /**
   * Lista de destinatarios seleccionados en la tabla.
   * Se utiliza para operaciones como modificar o eliminar un destinatario específico.
   */
  public destinatarioSeleccionadoDatos: FabricanteDatos[] = [];
  /**
   * Encabezados para la tabla de fabricantes.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLE_HEADER_DATA`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de fabricantes.
   */
  fabricanteHeaderData = TERCEROS_RELACIONADOS_TABLE_HEADER_DATA;

  /**
   * Encabezados para la tabla de destinatarios.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLE_HEADER_DATA`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de destinatarios.
   */
  destinatarioHeaderData = TERCEROS_RELACIONADOS_TABLE_HEADER_DATA;

  /**
   * Encabezados para la tabla de proveedores.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLE_HEADER_DATA`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de proveedores.
   */
  proveedorHeaderData = TERCEROS_RELACIONADOS_TABLE_HEADER_DATA;

  /**
   * Encabezados para la tabla de facturadores.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLE_HEADER_DATA`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de facturadores.
   */
  facturadorHeaderData = TERCEROS_RELACIONADOS_TABLE_HEADER_DATA;
/**
   * Indicador para determinar si se ha seleccionado una persona nacional.
   * Inicialmente establecido en `false`.
   */
  public nacional = false;
/**
 * Indicador para determinar si se ha seleccionado una persona extranjera.
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
   * Datos de las filas para la tabla de fabricantes.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de fabricantes.
   */
  fabricanteRowData: TablaDatos[] = [
  {
    tbodyData: [
      'Laboratorios S.A.',
      'LAB123456789',
      'CURP123456HDFRRL01',
      '55-12345678',
      'contacto@laboratorios.com',
      'Calle 1',
      '100',
      '2',
      'México',
      'Centro',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      '06000'
    ]
  }
  
];

  /**
   * Datos de las filas para la tabla de destinatarios.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de destinatarios.
   */
  destinatarioRowData: TablaDatos[] = [ {
    tbodyData: [
      'Empresa Destino S.A.',
      'DES123456789',
      'CURPDESTINO01',
      '55-98765432',
      'contacto@destino.com',
      'Calle Destino',
      '500',
      '10',
      'México',
      'Colonia Centro',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      '07000'
      ]
  }];

  /**
   * Datos de las filas para la tabla de proveedores.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de proveedores.
   */
  proveedorRowData: TablaDatos[] = [ {
    tbodyData: [
      'Proveedor Global S.A.',
      'PRO123456789',
      'CURPPROV001',
      '55-11223344',
      'contacto@proveedor.com',
      'Av. Comercio',
      '150',
      '10',
      'México',
      'Colonia Industrial',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      '06500'
      ]
  }];

  /**
   * Datos de las filas para la tabla de facturadores.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de facturadores.
   */
  facturadorRowData: TablaDatos[] = [
     {
    tbodyData: [
      'Facturador Uno S.A.',
      'FAC123456789',
      'CURPFACT001',
      '55-99887766',
      'facturas@uno.com',
      'Calle Factura',
      '400',
      '12',
      'México',
      'Colonia Centro',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      'CDMX',
      '08000'
      ]
  },
  ];

  /**
   * Maneja el cambio en los checkboxes para seleccionar el tipo de persona.
   * Actualiza los indicadores `fisica` y `moral` según el checkbox seleccionado.
   *
   * @param checkBoxName Nombre del checkbox seleccionado (fisica o moral).
   */
  public inputChecked(checkBoxName: string) : void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
    } else {
      this.fisica = false;
      this.moral = true;
    }
  }
/**
 *    
 * @param checkBoxName 
 */
  public tercerosInputChecked(checkBoxName: string):void {
    if (checkBoxName === 'nacional') {
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
  toggleDivFabricante() :void{
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showFabricante = !this.showFabricante;
  }

  /**
   * Cambia la visibilidad del formulario de Destinatario.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
  toggleDivDestinatario() :void{
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatario = !this.showDestinatario;
  }

  /**
   * Cambia la visibilidad del formulario de Proveedor.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
  toggleDivProveedor():void {
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
  }

  /**
   * Cambia la visibilidad del formulario de Facturador.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
  toggleDivFacturador() :void{
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showFacturador = !this.showFacturador;
  }
  /** Limpia y deshabilita todos los campos del formulario de fabricante, excepto el de nacionalidad. */
  limpiarFacturadorForm(): void {
    this.agregarFacturadorFormGroup.reset();
    Object.keys(this.agregarFacturadorFormGroup.controls).forEach(controlName => {
      this.agregarFacturadorFormGroup.get(controlName)?.disable();
    });
    this.agregarFacturadorFormGroup.get('tipoPersona')?.enable();
  }
  /**
   * Texto de alerta para los terceros relacionados.
   * Indica que las tablas con asterisco son obligatorias.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Envía el formulario de Fabricante y actualiza los datos en el store.
   * Obtiene los valores seleccionados de los dropdowns y crea una nueva fila para la tabla.
   *
   * @description Este método es llamado al enviar el formulario de agregar un fabricante.
   */
  submitFabricanteForm() :void{
    /**
     * Obtiene el valor de la localidad seleccionada en el formulario.
     */
    const LOCALIDAD_VALOR = this.localidadDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFabricanteFormGroup.value.localidad
    )?.descripcion;

    /**
     * Obtiene el valor del municipio seleccionado en el formulario.
     */
    const MUNICIPIO_VALOR = this.municipioDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFabricanteFormGroup.value.municipioAlcaldia
    )?.descripcion;

    /**
     * Obtiene el valor del código postal seleccionado en el formulario.
     */
    const CODIGO_POSTAL_VALOR = this.codigoPostalDropdownData.find(
      (item: Catalogo) =>
        item.id ===
        this.agregarFabricanteFormGroup.value.codigoPostaloEquivalente
    )?.descripcion;

    /**
     * Obtiene el valor de la colonia seleccionada en el formulario.
     */
    const COLONIA_VALOR = this.coloniaDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFabricanteFormGroup.value.colonia
    )?.descripcion;

    /**
     * Crea una nueva fila para la tabla de fabricantes.
     * Esta fila contiene los datos del formulario de agregar un fabricante.
     *
     * @description Esta fila se agrega a la lista de filas del fabricante.
     */
    const FABRICANTE_FILA = {
      /**
       * Datos de la fila que se mostrarán en la tabla.
       * Cada elemento del arreglo corresponde a una columna de la tabla.
       */
      tbodyData: [
        /**
         * Denominación o razón social del fabricante.
         */
        this.agregarFabricanteFormGroup.value.denominacionRazonSocial,

        /**
         * RFC del fabricante.
         */
        this.agregarFabricanteFormGroup.value.rfc,

        /**
         * CURP del fabricante.
         */
        this.agregarFabricanteFormGroup.value.curp,

        /**
         * Teléfono del fabricante, incluyendo lada.
         */
        this.agregarFabricanteFormGroup.value.lada +
          '-' +
          this.agregarFabricanteFormGroup.value.telefono,

        /**
         * Correo electrónico del fabricante.
         */
        this.agregarFabricanteFormGroup.value.correoElectronico,

        /**
         * Calle del fabricante.
         */
        this.agregarFabricanteFormGroup.value.calle,

        /**
         * Número exterior del fabricante.
         */
        this.agregarFabricanteFormGroup.value.numeroExterior,

        /**
         * Número interior del fabricante.
         */
        this.agregarFabricanteFormGroup.value.numeroInterior,

        /**
         * País del fabricante.
         */
        this.agregarFabricanteFormGroup.value.pais,

        /**
         * Colonia del fabricante.
         */
        COLONIA_VALOR,

        /**
         * Municipio del fabricante.
         */
        MUNICIPIO_VALOR,

        /**
         * Localidad del fabricante.
         */
        LOCALIDAD_VALOR,

        /**
         * Entidad federativa del fabricante.
         */
        this.agregarFabricanteFormGroup.value.entidadFederativa,

        /**
         * Estado o localidad del fabricante.
         */
        this.agregarFabricanteFormGroup.value.estadoLocalidad,

        /**
         * Código postal del fabricante.
         */
        CODIGO_POSTAL_VALOR,

        /**
         * Colonia equivalente del fabricante.
         */
        this.agregarFabricanteFormGroup.value.coloniaoEquivalente,
      ],
    };

    /**
     * Agrega la nueva fila a la lista de filas del fabricante.
     */
    this.fabricanteRowData.push(FABRICANTE_FILA);

    /**
     * Actualiza el estado del store con los nuevos datos del fabricante.
     */
    this.Sanitario260215Store.setFabricante(this.fabricanteRowData);

    /**
     * Cambia la visibilidad de las secciones del componente.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showFabricante = !this.showFabricante;
  }

  /**
   * Envía el formulario de Destinatario y actualiza los datos en el store.
   * Obtiene los valores seleccionados de los dropdowns y crea una nueva fila para la tabla.
   *
   * @description Este método es llamado al enviar el formulario de agregar un destinatario.
   */
  submitDestinatarioForm():void {
    /**
     * Obtiene el valor de la localidad seleccionada en el formulario.
     */
    const LOCALIDAD_VALOR = this.localidadDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarDestinatarioFormGroup.value.localidad
    )?.descripcion;

    /**
     * Obtiene el valor del municipio seleccionado en el formulario.
     */
    const MUNICIPIO_VALOR = this.municipioDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarDestinatarioFormGroup.value.municipioAlcaldia
    )?.descripcion;

    /**
     * Obtiene el valor del código postal seleccionado en el formulario.
     */
    const CODIGO_POSTAL_VALOR = this.codigoPostalDropdownData.find(
      (item: Catalogo) =>
        item.id ===
        this.agregarDestinatarioFormGroup.value.codigoPostaloEquivalente
    )?.descripcion;

    /**
     * Obtiene el valor de la colonia seleccionada en el formulario.
     */
    const COLONIA_VALOR = this.coloniaDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarDestinatarioFormGroup.value.colonia
    )?.descripcion;

    /**
     * Crea una nueva fila para la tabla de destinatarios.
     * Esta fila contiene los datos del formulario de agregar un destinatario.
     *
     * @description Esta fila se agrega a la lista de filas del destinatario.
     */
    const DESTINATARIO_FILA = {
      /**
       * Datos de la fila que se mostrarán en la tabla.
       * Cada elemento del arreglo corresponde a una columna de la tabla.
       */
      tbodyData: [
        /**
         * Denominación o razón social del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.denominacionRazonSocial,

        /**
         * RFC del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.rfc,

        /**
         * CURP del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.curp,

        /**
         * Teléfono del destinatario, incluyendo lada.
         */
        this.agregarDestinatarioFormGroup.value.lada +
          '-' +
          this.agregarDestinatarioFormGroup.value.telefono,

        /**
         * Correo electrónico del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.correoElectronico,

        /**
         * Calle del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.calle,

        /**
         * Número exterior del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.numeroExterior,

        /**
         * Número interior del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.numeroInterior,

        /**
         * País del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.pais,

        /**
         * Colonia del destinatario.
         */
        COLONIA_VALOR,

        /**
         * Municipio del destinatario.
         */
        MUNICIPIO_VALOR,

        /**
         * Localidad del destinatario.
         */
        LOCALIDAD_VALOR,

        /**
         * Entidad federativa del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.entidadFederativa,

        /**
         * Estado o localidad del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.estadoLocalidad,

        /**
         * Código postal del destinatario.
         */
        CODIGO_POSTAL_VALOR,

        /**
         * Colonia equivalente del destinatario.
         */
        this.agregarDestinatarioFormGroup.value.coloniaoEquivalente,
      ],
    };

    /**
     * Agrega la nueva fila a la lista de filas del destinatario.
     */
    this.destinatarioRowData.push(DESTINATARIO_FILA);

    /**
     * Actualiza el estado del store con los nuevos datos del destinatario.
     */
    this.Sanitario260215Store.setDestinatario(this.destinatarioRowData);

    /**
     * Cambia la visibilidad de las secciones del componente.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatario = !this.showDestinatario;
  }

  /**
   * Envía el formulario de Proveedor y actualiza los datos en el store.
   * Crea una nueva fila para la tabla con los datos del formulario.
   *
   * @description Este método es llamado al enviar el formulario de agregar un proveedor.
   */
  submitProveedorForm() :void{
    /**
     * Crea una nueva fila para la tabla con los datos del formulario.
     */
    const PROVEEDOR_FILA = {
      tbodyData: [
        this.agregarProveedorFormGroup.value.denominacionRazonSocial,
        this.agregarProveedorFormGroup.value.rfc,
        this.agregarProveedorFormGroup.value.curp,
        this.agregarProveedorFormGroup.value.lada +
          '-' +
          this.agregarProveedorFormGroup.value.telefono,
        this.agregarProveedorFormGroup.value.correoElectronico,
        this.agregarProveedorFormGroup.value.calle,
        this.agregarProveedorFormGroup.value.numeroExterior,
        this.agregarProveedorFormGroup.value.numeroInterior,
        this.agregarProveedorFormGroup.value.pais,
        this.agregarProveedorFormGroup.value.colonia,
        this.agregarProveedorFormGroup.value.municipioAlcaldia,
        this.agregarProveedorFormGroup.value.localidad,
        this.agregarProveedorFormGroup.value.entidadFederativa,
        this.agregarProveedorFormGroup.value.estadoLocalidad,
        this.agregarProveedorFormGroup.value.codigoPostaloEquivalente,
        this.agregarProveedorFormGroup.value.coloniaoEquivalente,
      ],
    };

    /**
     * Agrega la nueva fila a la lista de filas del proveedor.
     */
    this.proveedorRowData.push(PROVEEDOR_FILA);

    /**
     * Actualiza el estado del store con los nuevos datos del proveedor.
     */
    this.Sanitario260215Store.setProveedor(this.proveedorRowData);

    /**
     * Cambia la visibilidad de las secciones del componente.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
  }

  /**
   * Envía el formulario de Facturador y actualiza los datos en el store.
   * Crea una nueva fila para la tabla con los datos del formulario.
   *
   * @description Este método es llamado al enviar el formulario de agregar un facturador.
   */
  submitFacturadorForm() :void{
    /**
     * Crea una nueva fila para la tabla con los datos del formulario.
     */
    const FACTURADOR_FILA = {
      tbodyData: [
        this.agregarFacturadorFormGroup.value.denominacionRazonSocial,
        this.agregarFacturadorFormGroup.value.rfc,
        this.agregarFacturadorFormGroup.value.curp,
        this.agregarFacturadorFormGroup.value.lada +
          '-' +
          this.agregarFacturadorFormGroup.value.telefono,
        this.agregarFacturadorFormGroup.value.correoElectronico,
        this.agregarFacturadorFormGroup.value.calle,
        this.agregarFacturadorFormGroup.value.numeroExterior,
        this.agregarFacturadorFormGroup.value.numeroInterior,
        this.agregarFacturadorFormGroup.value.pais,
        this.agregarFacturadorFormGroup.value.colonia,
        this.agregarFacturadorFormGroup.value.municipioAlcaldia,
        this.agregarFacturadorFormGroup.value.localidad,
        this.agregarFacturadorFormGroup.value.entidadFederativa,
        this.agregarFacturadorFormGroup.value.estadoLocalidad,
        this.agregarFacturadorFormGroup.value.codigoPostaloEquivalente,
        this.agregarFacturadorFormGroup.value.coloniaoEquivalente,
      ],
    };

    /**
     * Agrega la nueva fila a la lista de filas del facturador.
     */
    this.facturadorRowData.push(FACTURADOR_FILA);

    /**
     * Actualiza el estado del store con los nuevos datos del facturador.
     */
    this.Sanitario260215Store.setFacturador(this.facturadorRowData);

    /**
     * Cambia la visibilidad de las secciones del componente.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showFacturador = !this.showFacturador;
  }

  /**
   * Validador personalizado para verificar que el país seleccionado no esté vacío ni sea '-1'.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el valor es válido, de lo contrario devuelve un objeto con la propiedad `requiredPais`.
   */
  static requiredPaisValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    return control.value !== '' && control.value !== '-1'
      ? null
      : { requiredPais: true };
  }

  /**
   * Validador para verificar que el RFC sea válido.
   * Utiliza expresiones regulares para validar tanto RFC de personas físicas como morales.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el RFC es válido, de lo contrario devuelve un objeto con la propiedad `invalidRFC`.
   */
  static rfcValidator(control: AbstractControl): ValidationErrors | null {
    const RFC_FISICA = /^([a-zñA-ZÑ]{4})(\d{6})(([a-zA-Z]|\d){3})$/;
    const RFC_MORAL = /^([a-zñA-ZÑ&]{3})(\d{6})(([a-zA-Z]|\d){3})$/;
    return RFC_FISICA.test(control.value) || RFC_MORAL.test(control.value)
      ? null
      : { invalidRFC: true };
  }

   /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
   cambiarRadio(value: string | number):void {
    const VALOR_SELECCIONADO = value as string;
    this.tercerosInputChecked(VALOR_SELECCIONADO);
  }

   /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
   cambiarRadioFisica(value: string | number):void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO);
  }

  /**
   * Validador para verificar que la CURP sea válida.
   * Utiliza una expresión regular para validar el formato de la CURP.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si la CURP es válida, de lo contrario devuelve un objeto con la propiedad `invalidCURP`.
   */
  static curpValidator(control: AbstractControl): ValidationErrors | null {
    const PATTERN = /^([a-zA-Z]{4})([0-9]{6})([HhMm][a-zA-Z]{5})([0-9]{2})$/;
    return PATTERN.test(control.value) ? null : { invalidCURP: true };
  }

  /**
   * Validador para verificar que el teléfono sea válido.
   * Utiliza una expresión regular que permite números, letras, guiones, paréntesis y espacios.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el teléfono es válido, de lo contrario devuelve un objeto con la propiedad `invalidTelefono`.
   */
  static telefonoValidator(control: AbstractControl): ValidationErrors | null {
    const PATTERN = /^([0-9A-Za-z\-() ])*$/;
    return PATTERN.test(control.value) ? null : { invalidTelefono: true };
  }
   /**
   * Elimina los datos del pedimento.
   * @param borrar Indica si se deben eliminar los datos seleccionados.
   * Elimina los datos del pedimento.
   * @param borrar Indica si se deben eliminar los datos seleccionados.
   */
  eliminarPedimentoDatos(borrar: boolean): void {
    if (borrar) {
      // Filtra los datos, eliminando los seleccionados
      this.fabricanteTablaDatos = this.fabricanteTablaDatos.filter(
        res => !this.fabricanteSeleccionadoDatos.includes(res)
      );
      // Limpia la selección
      this.fabricanteSeleccionadoDatos = [];
      this.tereceros260211store.setFabricantes(this.fabricanteTablaDatos);
    }
  }
   /**
   * Elimina los fabricantes seleccionados de la tabla.
   */
  eliminarFabricante(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: '¿Confirma la eliminación?',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }
   /**
 * Permite modificar un fabricante seleccionado en la tabla.
 * Si no hay ningún fabricante seleccionado, la función retorna.
 * Obtiene la fila seleccionada, guarda su índice para edición,
 * habilita el formulario y lo rellena con los datos de la fila seleccionada.
 */
  modificarFabricante(): void {
    if (!(this.fabricanteSeleccionadoDatos || []).length) { return }

    const SELECCIONADA = this.fabricanteSeleccionadoDatos[0];
    this.editFabricanteIndex = this.fabricanteTablaDatos.indexOf(SELECCIONADA);

    this.agregarFabricanteFormGroup.enable();
    this.agregarFabricanteFormGroup.patchValue(SELECCIONADA);
    this.showTableDiv = !this.showTableDiv;
    this.showFabricante = !this.showFabricante;

  }
   /** Limpia y deshabilita todos los campos del formulario de fabricante, excepto el de nacionalidad. */
  limpiarFabricanteForm(): void {
    this.agregarFabricanteFormGroup.reset();
    Object.keys(this.agregarFabricanteFormGroup.controls).forEach(controlName => {
      this.agregarFabricanteFormGroup.get(controlName)?.disable();
    });
    this.agregarFabricanteFormGroup.get('tercerosNacionalidad')?.enable();
  }
    /**
 * Envía el formulario de fabricantes, agrega un nuevo registro a `fabricanteTablaDatos`,
 * reinicia y desactiva los campos del formulario excepto 'tipoPersona' y 'tercerosNacionalidad',
 * y alterna la visibilidad de las secciones del componente.
 */
  submitFabricantesForm(): void {
    const NUEVO: FabricanteDatos = {
      nombre: this.agregarFabricanteFormGroup.get('nombre')?.value || '',
      rfc: this.agregarFabricanteFormGroup.get('rfc')?.value || '',
      curp: this.agregarFabricanteFormGroup.get('curp')?.value || '',
      telefono: this.agregarFabricanteFormGroup.get('telefono')?.value || '',
      correo: this.agregarFabricanteFormGroup.get('correoElectronico')?.value || '',
      calle: this.agregarFabricanteFormGroup.get('calle')?.value || '',
      numeroExterior: this.agregarFabricanteFormGroup.get('numeroExterior')?.value || '',
      numeroInterior: this.agregarFabricanteFormGroup.get('numeroInterior')?.value || '',
      pais: this.agregarFabricanteFormGroup.get('pais')?.value || '',
      colonia: this.agregarFabricanteFormGroup.get('colonia')?.value || '',
      municipio: this.agregarFabricanteFormGroup.get('municipioAlcaldia')?.value || '',
      localidad: this.agregarFabricanteFormGroup.get('localidad')?.value || '',
      entidadFederativa: this.agregarFabricanteFormGroup.get('entidadFederativa')?.value || '',
      estado: this.agregarFabricanteFormGroup.get('estadoLocalidad')?.value || '',
      codigoPostal: this.agregarFabricanteFormGroup.get('codigoPostaloEquivalente')?.value || '',
      coloniaEquivalente: this.agregarFabricanteFormGroup.get('coloniaEquivalente')?.value || '',      
    };
    if (this.editFabricanteIndex !== undefined) {
      this.fabricanteTablaDatos[this.editFabricanteIndex] = NUEVO;
      this.editFabricanteIndex = undefined;
    } else {
      this.fabricanteTablaDatos = [...this.fabricanteTablaDatos, NUEVO];
    }
    this.agregarFabricanteFormGroup.reset();
    Object.keys(this.agregarFabricanteFormGroup.controls).forEach(key => {
      if (key !== 'tipoPersona' && key !== 'tercerosNacionalidad') {
        this.agregarFabricanteFormGroup.controls[key].disable();
      }
    });
    this.tereceros260211store.setFabricantes(this.fabricanteTablaDatos);
    /**
        * Cambia la visibilidad de las secciones del componente.
        */
    this.showTableDiv = !this.showTableDiv;
    this.showFabricante = !this.showFabricante;
    this.fabricanteSeleccionadoDatos = [];

  }
    /**
   * Elimina los destinatarioFinalTablaDatos de la tabla.
   */
  eliminarDestinario(): void {
    // Filtra los datos, eliminando los seleccionados
    this.destinatarioFinalTablaDatos = this.destinatarioFinalTablaDatos.filter(
      f => !this.destinatarioSeleccionadoDatos.includes(f)
    );
    // Limpia la selección
    this.destinatarioSeleccionadoDatos = [];
    this.tereceros260211store.setDestinatarios(this.destinatarioFinalTablaDatos);
  }
  
  /** Limpia y deshabilita todos los campos del formulario de destinatario, excepto el de tipoPersona. */
  limpiarDestinatarioForm(): void {
    this.agregarDestinatarioFormGroup.reset();
    Object.keys(this.agregarDestinatarioFormGroup.controls).forEach(controlName => {
      this.agregarDestinatarioFormGroup.get(controlName)?.disable();
    });
    this.agregarDestinatarioFormGroup.get('tipoPersona')?.enable();
     }
    /**
   * Envía el formulario de destinatarios, agrega un nuevo registro a `destinatarioFinalTablaDatos`,
   * reinicia y desactiva los campos del formulario excepto 'tipoPersona' y 'tercerosNacionalidad',
   * y alterna la visibilidad de las secciones del componente.
   */
  submitDestinatariosForm(): void {
    const NUEVO = { ...this.agregarDestinatarioFormGroup.getRawValue() };
    if (this.editDestinatarioIndex !== undefined) {
      this.destinatarioFinalTablaDatos[this.editDestinatarioIndex] = NUEVO;
      this.editDestinatarioIndex = undefined;
    } else {
      this.destinatarioFinalTablaDatos = [...this.destinatarioFinalTablaDatos, NUEVO];
    }

    this.agregarDestinatarioFormGroup.reset();

    Object.keys(this.agregarDestinatarioFormGroup.controls).forEach(key => {
      if (key !== 'tipoPersona' && key !== 'tercerosNacionalidad') {
        this.agregarDestinatarioFormGroup.controls[key].disable();
      }
    });
    this.tereceros260211store.setDestinatarios(this.destinatarioFinalTablaDatos);
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatario = !this.showDestinatario;
    this.destinatarioSeleccionadoDatos = [];
  }
    /**
   * Permite modificar un destinatario seleccionado en la tabla.
   * Si no hay ningún destinatario seleccionado, la función retorna.
   * Obtiene la fila seleccionada, guarda su índice para edición,
   * habilita el formulario y lo rellena con los datos de la fila seleccionada.
   */
  modificarDestinatario(): void {
    if (!(this.destinatarioSeleccionadoDatos || []).length) { return }
    const SELECCIONADO = this.destinatarioSeleccionadoDatos[0];
    this.editDestinatarioIndex = this.destinatarioFinalTablaDatos.indexOf(SELECCIONADO);
    this.agregarDestinatarioFormGroup.enable();
    this.agregarDestinatarioFormGroup.patchValue(SELECCIONADO);
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatario = !this.showDestinatario;
  }
    /**
   * Elimina los proveedorSeleccionadoDatos de la tabla.
   */
  eliminarProveedor(): void {
    // Filtra los datos, eliminando los seleccionados
    this.proveedorTablaDatos = this.proveedorTablaDatos.filter(
      f => !this.proveedorSeleccionadoDatos.includes(f)
    );
    // Limpia la selección
    this.proveedorSeleccionadoDatos = [];
    this.tereceros260211store.setProveedors(this.proveedorTablaDatos);
  }
    /**
   * Envía el formulario de proveedores, agrega un nuevo registro a `proveedorTablaDatos`,
   * reinicia y desactiva los campos del formulario excepto 'tipoPersona' y 'tercerosNacionalidad',
   * y alterna la visibilidad de las secciones del componente.
   */
  submitProveedoresForm(): void {

    const NUEVO = { ...this.agregarProveedorFormGroup.getRawValue() };



    if (this.editProveedorIndex !== undefined) {
      this.proveedorTablaDatos[this.editProveedorIndex] = NUEVO;
      this.editProveedorIndex = undefined;
    } else {
      this.proveedorTablaDatos = [...this.proveedorTablaDatos, NUEVO];
    }


    this.agregarProveedorFormGroup.reset();


    Object.keys(this.agregarProveedorFormGroup.controls).forEach(key => {
      if (key !== 'tipoPersona' && key !== 'tercerosNacionalidad') {
        this.agregarProveedorFormGroup.controls[key].disable();
      }
    });

    this.tereceros260211store.setProveedors(this.proveedorTablaDatos);
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
    this.proveedorSeleccionadoDatos = [];
  }
    /**
   * Permite modificar un proveedor seleccionado en la tabla.
   * Si no hay ningún proveedor seleccionado, la función retorna.
   * Obtiene la fila seleccionada, guarda su índice para edición,
   * habilita el formulario y lo rellena con los datos de la fila seleccionada.
   */
  modificarProveedor(): void {
    if (!(this.proveedorSeleccionadoDatos || []).length) { return }
    const SELECCIONADO = this.proveedorSeleccionadoDatos[0];
    this.editProveedorIndex = this.proveedorTablaDatos.indexOf(SELECCIONADO);
    this.agregarProveedorFormGroup.enable();
    this.agregarProveedorFormGroup.patchValue(SELECCIONADO);
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
  }
  /** Limpia y deshabilita todos los campos del formulario de fabricante, excepto el de nacionalidad. */
  limpiarProveedorForm(): void {
    this.agregarProveedorFormGroup.reset();
    Object.keys(this.agregarProveedorFormGroup.controls).forEach(controlName => {
      this.agregarProveedorFormGroup.get(controlName)?.disable();
    });
    this.agregarProveedorFormGroup.get('tipoPersona')?.enable();
  }
    /**
   * Envía el formulario de facturadores, agrega un nuevo registro a `facturadorTablaDatos`,
   * reinicia y desactiva los campos del formulario excepto 'tipoPersona' y 'tercerosNacionalidad',
   * y alterna la visibilidad de las secciones del componente.
   */
  submitFacturadoresForm(): void {

    const NUEVO = { ...this.agregarFacturadorFormGroup.getRawValue() };


    if (this.editFacturadorIndex !== undefined) {
      this.facturadorTablaDatos[this.editFacturadorIndex] = NUEVO;
      this.editFacturadorIndex = undefined;
    } else {

      this.facturadorTablaDatos = [...this.facturadorTablaDatos, NUEVO];
    }


    this.agregarFacturadorFormGroup.reset();


    Object.keys(this.agregarFacturadorFormGroup.controls).forEach(key => {
      if (key !== 'tipoPersona' && key !== 'tercerosNacionalidad') {
        this.agregarFacturadorFormGroup.controls[key].disable();
      }
    });
    this.tereceros260211store.setFacturadors(this.facturadorTablaDatos);
    this.showTableDiv = !this.showTableDiv;
    this.showFacturador = !this.showFacturador;
    this.facturadorSeleccionadoDatos = [];
  }
  /**
   * Elimina los facturadorSeleccionadoDatos de la tabla.
   */
  eliminarFacturador(): void {
    // Filtra los datos, eliminando los seleccionados
    this.facturadorTablaDatos = this.facturadorTablaDatos.filter(
      f => !this.facturadorSeleccionadoDatos.includes(f)
    );
    // Limpia la selección
    this.facturadorSeleccionadoDatos = [];
    this.tereceros260211store.setFacturadors(this.facturadorTablaDatos);
  }
  /**
   * Permite modificar un facturador seleccionado en la tabla.
   * Si no hay ningún facturador seleccionado, la función retorna.
   * Obtiene la fila seleccionada, guarda su índice para edición,
   * habilita el formulario y lo rellena con los datos de la fila seleccionada.
   */
  modificarFacturador(): void {
    if (!this.facturadorSeleccionadoDatos || this.facturadorSeleccionadoDatos.length === 0) { return }
    const SELECT_ROW = this.facturadorSeleccionadoDatos[0];
    this.editFacturadorIndex = this.facturadorTablaDatos.indexOf(SELECT_ROW);
    this.showTableDiv = !this.showTableDiv;
    this.showFacturador = !this.showFacturador;
    this.agregarFacturadorFormGroup.enable();
    this.agregarFacturadorFormGroup.patchValue(SELECT_ROW);
  }
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable `destroyNotifier$` para cancelar las suscripciones activas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

