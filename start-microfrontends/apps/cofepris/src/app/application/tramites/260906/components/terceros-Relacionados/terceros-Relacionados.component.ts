import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AlertComponent, Catalogo, CatalogoSelectComponent, InputRadioComponent, REGEX_CURP, REGEX_RFC_FISICA, REGEX_RFC_MORAL, REGEX_TELEFONO, TituloComponent } from '@libs/shared/data-access-user/src';
import { CODIGOPOSTALSELECTDATA, COLONIASELECTDATA, LOCALIDADSELECTDATA, MUNICIPIOSELECTDATA, PAISSELECTDATA, TERCEROS_RELACIONADOS_TABLE_HEADER_DATA } from '@libs/shared/data-access-user/src/core/enums/260906/permiso.enum';
import { Component, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Sanitario260906Store, Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../model/modal.component';
import { OnInit } from '@angular/core';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { SanitarioService } from '../../services/sanitario.service';
import { Subject } from 'rxjs';
import { TablaDatos } from '@libs/shared/data-access-user/src/core/models/260906/detos.model';
import { TableComponent } from '@ng-mf/data-access-user';
import nacionalidadRedio from '@libs/shared/theme/assets/json/260906/nacionalidadRedio.json';
import tipoPersonaoptions from '@libs/shared/theme/assets/json/260906/tipoPersonaoptions.json';

/**
 * Interface que extiende TablaDatos para incluir la funcionalidad de selección.
 */
interface TablaDatosConSeleccion extends TablaDatos {
  selected?: boolean;
}

/**
* Constante que define el texto de alerta para las tablas de terceros relacionados.
* Este texto indica que las tablas con asterisco son obligatorias.
*/
const TERCEROS_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';


/**
 * Componente que gestiona la funcionalidad de terceros relacionados.
 * Permite agregar, editar y visualizar información de fabricantes, destinatarios, proveedores y facturadores.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, TituloComponent, TableComponent, ReactiveFormsModule, AlertComponent, FormsModule, ModalComponent, InputRadioComponent],
  templateUrl: './terceros-Relacionados.component.html',
  styleUrl: './terceros-Relacionados.component.scss',

})
export class TercerosRelacionadoesComponent implements OnInit, OnDestroy {

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
   * Notificador para destruir observables y evitar memory leaks.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Formulario reactivo para agregar un facturador.
   * Este formulario contiene los campos necesarios para ingresar los datos de un facturador.
   *
   * @description Se utiliza para validar y procesar los datos del facturador.
   */
  agregarFacturadorFormGroup!: FormGroup;
  /**
   * Estado actual de la consulta obtenido desde el servicio.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  soloLectura: boolean = false;
  /**
    * Estado de la solicitud.
    * @type {Solicitud260906State}
    */
  public solicitudState!: Solicitud260906State;
  /**
   * Constructor del componente.
   * Inyecta el FormBuilder, el store del trámite y el servicio de terceros.
   *
   * @param fb Constructor de formularios para crear los formularios reactivos.
   * @param sanitario260906Store Store del trámite 260906.
   * @param service Servicio que proporciona datos de terceros.
   */
  constructor(
    private fb: FormBuilder,
    private Sanitario260906Store: Sanitario260906Store,
    private service: SanitarioService,
    private consultaioQuery: ConsultaioQuery,
    private permiso260906Query: Permiso260906Query

  ) {
    // Inicializa el store del trámite 260906.
  }

  /**
   * Ciclo de vida que se ejecuta al iniciar el componente.
   * Obtiene los datos para los selectores desde el servicio y inicializa los formularios.
   */
  ngOnInit(): void {

    this.permiso260906Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    /**
     * Obtiene los datos para los selectores desde el servicio de terceros.
     * Actualiza la propiedad `dropdownData` con los datos obtenidos.
     */
    this.service.getData().subscribe((data) => {
      this.dropdownData = data;
    });

    /**
     * Inicializa los formularios reactivos para agregar terceros.
     */
    this.initializeAgregarFabricanteFormGroup();
    this.initializeAgregarDestinatarioFormGroup();
    this.initializeAgregarProveedorFormGroup();
    this.initializeAgregarFacturadorFormGroup();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
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
      rfc: new FormControl('', [
        Validators.required,
        TercerosRelacionadoesComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl('', [
        Validators.required,
        TercerosRelacionadoesComponent.curpValidator,
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl('', [Validators.required]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl('', [Validators.required]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl('', [Validators.required]),
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
        TercerosRelacionadoesComponent.requiredPaisValidator,
      ]),
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
      codigoPostaloEquivalente: new FormControl('', [Validators.required]),
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
      telefono: new FormControl('', [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl(''),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl('', [Validators.required]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl('', [Validators.required]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl('', [Validators.required]),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarFabricanteFormGroup.get('rfc')?.disable();
    this.agregarFabricanteFormGroup.get('curp')?.disable();
    this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.disable();
    this.inicializarEstadoFormulario();
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
      telefono: new FormControl('', [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
      /**
       * Correo electrónico del destinatario.
       */
      correoElectronico: new FormControl(''),
    });

    // Deshabilita campos hasta que se seleccione el tipo de persona
    this.agregarDestinatarioFormGroup.get('rfc')?.disable();
    this.agregarDestinatarioFormGroup.get('curp')?.disable();
    this.agregarDestinatarioFormGroup.get('denominacionRazonSocial')?.disable();
    this.inicializarEstadoFormulario();
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
      telefono: new FormControl('', [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
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
    this.inicializarEstadoFormulario();
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
        TercerosRelacionadoesComponent.requiredPaisValidator,
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
      telefono: new FormControl('', [
        TercerosRelacionadoesComponent.telefonoValidator,
      ]),
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
    this.inicializarEstadoFormulario();
  }

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

  public nacional = false;

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
  fabricanteRowData: TablaDatosConSeleccion[] = [];

  /**
   * Datos de las filas para la tabla de destinatarios.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de destinatarios.
   */
  destinatarioRowData: TablaDatosConSeleccion[] = [];

  /**
   * Datos de las filas para la tabla de proveedores.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de proveedores.
   */
  proveedorRowData: TablaDatosConSeleccion[] = [];

  /**
   * Datos de las filas para la tabla de facturadores.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de facturadores.
   */
  facturadorRowData: TablaDatosConSeleccion[] = [];

  /**
   * Indica si hay filas seleccionadas en la tabla de fabricantes.
   * Se utiliza para mostrar/ocultar los botones de "Eliminar" y "Modificar".
   */
  hasFabricanteSelection = false;

  /**
   * Indica si hay filas seleccionadas en la tabla de destinatarios.
   * Se utiliza para mostrar/ocultar los botones de "Eliminar" y "Modificar".
   */
  hasDestinatarioSelection = false;

  /**
   * Indica si hay filas seleccionadas en la tabla de proveedores.
   * Se utiliza para mostrar/ocultar los botones de "Eliminar" y "Modificar".
   */
  hasProveedorSelection = false;

  /**
   * Indica si hay filas seleccionadas en la tabla de facturadores.
   * Se utiliza para mostrar/ocultar los botones de "Eliminar" y "Modificar".
   */
  hasFacturadorSelection = false;

  /**
   * Maneja el cambio en los checkboxes para seleccionar el tipo de persona.
   * Actualiza los indicadores `fisica` y `moral` según el checkbox seleccionado.
   *
   * @param checkBoxName Nombre del checkbox seleccionado (fisica o moral).
   */
  public inputChecked(checkBoxName: string): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
    } else {
      this.fisica = false;
      this.moral = true;
    }
  }

  public tercerosInputChecked(checkBoxName: string): void {
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
   * Envía el formulario de Fabricante y actualiza los datos en el store.
   * Obtiene los valores seleccionados de los dropdowns y crea una nueva fila para la tabla.
   *
   * @description Este método es llamado al enviar el formulario de agregar un fabricante.
   */
  submitFabricanteForm(): void {
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
    this.Sanitario260906Store.setFabricante(this.fabricanteRowData);

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
  submitDestinatarioForm(): void {
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
    this.Sanitario260906Store.setDestinatario(this.destinatarioRowData);

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
  submitProveedorForm(): void {
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
    this.Sanitario260906Store.setProveedor(this.proveedorRowData);

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
  submitFacturadorForm(): void {
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
    this.Sanitario260906Store.setFacturador(this.facturadorRowData);

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
    const RFC_FISICA = REGEX_RFC_FISICA;
    const RFC_MORAL = REGEX_RFC_MORAL;
    return RFC_FISICA.test(control.value) || RFC_MORAL.test(control.value)
      ? null
      : { invalidRFC: true };
  }

  /**
  * Cambia el valor del radio button seleccionado.
  *
  * @param value Valor seleccionado del radio button.
  */
  cambiarRadio(value: string | number): void {
    const VALOR_SELECCIONADO = value as string;
    this.tercerosInputChecked(VALOR_SELECCIONADO);
  }

  /**
  * Cambia el valor del radio button seleccionado.
  *
  * @param value Valor seleccionado del radio button.
  */
  cambiarRadioFisica(value: string | number, form: number): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO);
    // Habilita campos al cambiar el tipo de persona
    if (form === 1) {
      this.agregarFacturadorFormGroup.get('nombre')?.enable();
      this.agregarFacturadorFormGroup.get('primerApellido')?.enable();
      this.agregarFacturadorFormGroup.get('segundoApellido')?.enable();
      this.agregarFacturadorFormGroup
        .get('denominacionRazonSocial')
        ?.enable();
    } else if (form === 2) {
      this.agregarFabricanteFormGroup.get('rfc')?.enable();
      this.agregarFabricanteFormGroup.get('curp')?.enable();
      this.agregarFabricanteFormGroup
        .get('denominacionRazonSocial')
        ?.enable();
    } else if (form === 3) {
      this.agregarProveedorFormGroup.get('nombre')?.enable();
      this.agregarProveedorFormGroup.get('primerApellido')?.enable();
      this.agregarProveedorFormGroup.get('segundoApellido')?.enable();
      this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.enable();
    } else if (form === 4) {
      this.agregarDestinatarioFormGroup.get('rfc')?.enable();
      this.agregarDestinatarioFormGroup.get('curp')?.enable();
      this.agregarDestinatarioFormGroup
        .get('denominacionRazonSocial')
        ?.enable();
    }
  }

  /**
   * Validador para verificar que la CURP sea válida.
   * Utiliza una expresión regular para validar el formato de la CURP.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si la CURP es válida, de lo contrario devuelve un objeto con la propiedad `invalidCURP`.
   */
  static curpValidator(control: AbstractControl): ValidationErrors | null {
    const PATTERN = REGEX_CURP;
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
    const PATTERN = REGEX_TELEFONO;
    return PATTERN.test(control.value) ? null : { invalidTelefono: true };
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

  /**
* Inicializa el estado del formulario según el modo de solo lectura.
* @public
*/
  public inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.agregarFabricanteFormGroup?.disable();
      this.agregarDestinatarioFormGroup?.disable();
      this.agregarProveedorFormGroup?.disable();
      this.agregarFacturadorFormGroup?.disable();
      this.fabricanteRowData = (this.solicitudState?.Fabricante || []) as TablaDatosConSeleccion[];
      this.destinatarioRowData = (this.solicitudState?.Destinatario || []) as TablaDatosConSeleccion[];
      this.proveedorRowData = (this.solicitudState?.Proveedor || []) as TablaDatosConSeleccion[];
      this.facturadorRowData = (this.solicitudState?.Facturador || []) as TablaDatosConSeleccion[];
    } else {
      this.agregarFabricanteFormGroup?.enable();
      this.agregarDestinatarioFormGroup?.enable();
      this.agregarProveedorFormGroup?.enable();
      this.agregarFacturadorFormGroup?.enable();
    }
  }

  /**
   * Limpia todos los campos del formulario de fabricante.
   * Reinicia el formulario a su estado inicial y resetea los indicadores de tipo de persona.
   */
  limpiarFabricanteForm(): void {
    this.agregarFabricanteFormGroup.reset();
    this.fisica = false;
    this.moral = false;
    this.nacional = false;
    this.extranjero = false;
    this.initializeAgregarFabricanteFormGroup();
  }

  /**
   * Limpia todos los campos del formulario de destinatario.
   * Reinicia el formulario a su estado inicial y resetea los indicadores de tipo de persona.
   */
  limpiarDestinatarioForm(): void {
    this.agregarDestinatarioFormGroup.reset();
    this.fisica = false;
    this.moral = false;
    this.initializeAgregarDestinatarioFormGroup();
  }

  /**
   * Limpia todos los campos del formulario de proveedor.
   * Reinicia el formulario a su estado inicial y resetea los indicadores de tipo de persona.
   */
  limpiarProveedorForm(): void {
    this.agregarProveedorFormGroup.reset();
    this.fisica = false;
    this.moral = false;
    this.initializeAgregarProveedorFormGroup();
  }

  /**
   * Limpia todos los campos del formulario de facturador.
   * Reinicia el formulario a su estado inicial y resetea los indicadores de tipo de persona.
   */
  limpiarFacturadorForm(): void {
    this.agregarFacturadorFormGroup.reset();
    this.fisica = false;
    this.moral = false;
    this.initializeAgregarFacturadorFormGroup();
  }

  /**
   * Maneja el cambio de selección en la tabla de fabricantes.
   * @param hasSelection Indica si hay filas seleccionadas.
   */
  onFabricanteSelectionChange(hasSelection: boolean): void {
    this.hasFabricanteSelection = hasSelection;
  }

  /**
   * Maneja el cambio de selección en la tabla de destinatarios.
   * @param hasSelection Indica si hay filas seleccionadas.
   */
  onDestinatarioSelectionChange(hasSelection: boolean): void {
    this.hasDestinatarioSelection = hasSelection;
  }

  /**
   * Maneja el cambio de selección en la tabla de proveedores.
   * @param hasSelection Indica si hay filas seleccionadas.
   */
  onProveedorSelectionChange(hasSelection: boolean): void {
    this.hasProveedorSelection = hasSelection;
  }

  /**
   * Maneja el cambio de selección en la tabla de facturadores.
   * @param hasSelection Indica si hay filas seleccionadas.
   */
  onFacturadorSelectionChange(hasSelection: boolean): void {
    this.hasFacturadorSelection = hasSelection;
  }

  /**
   * Elimina las filas seleccionadas de la tabla de fabricantes.
   */
  eliminarFabricanteSeleccionado(): void {
    // Filtrar las filas que no están seleccionadas
    this.fabricanteRowData = this.fabricanteRowData.filter((item: TablaDatosConSeleccion) => item.selected);
    this.Sanitario260906Store.setFabricante(this.fabricanteRowData);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de destinatarios.
   */
  eliminarDestinatarioSeleccionado(): void {
    // Filtrar las filas que no están seleccionadas
    this.destinatarioRowData = this.destinatarioRowData.filter((item: TablaDatosConSeleccion) => !item.selected);
    this.Sanitario260906Store.setDestinatario(this.destinatarioRowData);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de proveedores.
   */
  eliminarProveedorSeleccionado(): void {
    // Filtrar las filas que no están seleccionadas
    this.proveedorRowData = this.proveedorRowData.filter((item: TablaDatosConSeleccion) => !item.selected);
    this.Sanitario260906Store.setProveedor(this.proveedorRowData);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de facturadores.
   */
  eliminarFacturadorSeleccionado(): void {
    // Filtrar las filas que no están seleccionadas
    this.facturadorRowData = this.facturadorRowData.filter((item: TablaDatosConSeleccion) => !item.selected);
    this.Sanitario260906Store.setFacturador(this.facturadorRowData);
    this.hasFacturadorSelection = false;
  }

  /**
   * Modifica la primera fila seleccionada de la tabla de fabricantes.
   */
  modificarFabricanteSeleccionado(): void {
    const SELECTED_ROW = this.fabricanteRowData.find((item: TablaDatosConSeleccion) => item.selected);
    if (SELECTED_ROW) {
      // Abrir el formulario de agregar fabricante para modificar
      this.toggleDivFabricante();
    }
  }

  /**
   * Modifica la primera fila seleccionada de la tabla de destinatarios.
   */
  modificarDestinatarioSeleccionado(): void {
    const SELECTED_ROW = this.destinatarioRowData.find((item: TablaDatosConSeleccion) => item.selected);
    if (SELECTED_ROW) {
      // Abrir el formulario de agregar destinatario para modificar
      this.toggleDivDestinatario();
    }
  }

  /**
   * Modifica la primera fila seleccionada de la tabla de proveedores.
   */
  modificarProveedorSeleccionado(): void {
    const SELECTED_ROW = this.proveedorRowData.find((item: TablaDatosConSeleccion) => item.selected);
    if (SELECTED_ROW) {
      // Abrir el formulario de agregar proveedor para modificar
      this.toggleDivProveedor();
    }
  }

  /**
   * Modifica la primera fila seleccionada de la tabla de facturadores.
   */
  modificarFacturadorSeleccionado(): void {
    const SELECTED_ROW = this.facturadorRowData.find((item: TablaDatosConSeleccion) => item.selected);
    if (SELECTED_ROW) {
      // Abrir el formulario de agregar facturador para modificar
      this.toggleDivFacturador();
    }
  }
}

