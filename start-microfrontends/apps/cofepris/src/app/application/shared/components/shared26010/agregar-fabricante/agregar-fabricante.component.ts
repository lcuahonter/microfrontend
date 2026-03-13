import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  AlertComponent,
  Catalogo,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_CORREO_ELECTRONICO,
  REGEX_IMPORTE_PAGO,
  REGEX_NOMBRE,
  REGEX_RFC_FISICA,
  REGEX_RFC_MORAL,
  REGEX_TELEFONO,
  TipoPersona,
  TituloComponent,
  doDeepCopy,
  esValidArray,
  getValidDatos,
} from '@ng-mf/data-access-user';
import {CatalogoSelectComponent, CatalogoServices} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DEFAULT_TABLA_ORDENS, TERCEROS_RELACIONADOS_DATOS_INICIALES } from '../models/terceros-fabricante.enum';
import { PROCEDIMIENTOS_PARA_COLONIA_O_EQUIVALENTE, PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR, STR_NACIONAL } from '../constents/datos-solicitud.enum';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DatosSolicitudService } from '../services/datos-solicitud.service';
import { Fabricante } from '../models/terceros-relacionados.model';
import { FabricanteRequiredField } from '../models/datos-solicitud.model';
import { PROCEDIMIENTOS_MUESTRAN_RFC } from '../../../constantes/terceros-relacionados-fabricante.enum';
import { Shared2605Service } from '../../../services/shared2605/shared2605.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
 interface OpcionesPublicacion{
  label: string;
  value: string;
  hint?: string;
}
/**
 * Componente para agregar datos de un fabricante.
 * Provee un formulario reactivo y métodos para guardar la información del fabricante.
 *
 * @example
 * <app-agregar-fabricante></app-agregar-fabricante>
 */
@Component({
  selector: 'app-agregar-fabricante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    TooltipModule,
    NotificacionesComponent,
    AlertComponent
  ],
  templateUrl: './agregar-fabricante.component.html',
  styleUrl: './agregar-fabricante.component.css',
})
export class AgregarFabricanteComponent
  implements OnDestroy, OnInit, OnChanges
{

  errorMessageValidator = {
  tipoPersona: false,
  rfc: false,
  curp: false,
  nombres: false,
  primerApellido: false,
  razonSocial: false,
  pais: false,
  estado: false,
  municipio: false,
  localidad: false,
  codigoPostal: false,
  colonia: false,
  calle: false,
  numeroExterior: false,
  correoElectronico: false,
};

requiredFieldVlidator:FabricanteRequiredField[] =[]

  mensajeDeError: string = '';
  /**
   * Función de callback (Input) para propagar la lista de fabricantes.
   * @property {(value: Fabricante[]) => void} guardarFabricanteForm
   */
  @Input()
  guardarFabricanteForm!: (value: Fabricante[]) => void;

  /**
   * Identificador del procedimiento actual.
   * Utilizado para controlar el flujo de la vista dependiendo del tipo de procedimiento.
   *
   * @input idProcedimiento - Cadena que representa el ID del procedimiento (por ejemplo: '260102').
   */
  @Input()
  idProcedimiento!: number;

  /**
   * FormGroup para el formulario de agregar fabricante.
   * @property {FormGroup} agregarFabricanteForm
   */
  agregarFabricanteForm!: FormGroup;

  /**
   * Datos de catálogo de códigos postales.
   * @property {Catalogo[]} codigosPostalesDatos
   */
  public codigosPostalesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de países.
   * @property {Catalogo[]} paisesDatos
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Lista de destinatarios seleccionados que se reciben como entrada
   * desde un componente padre.
   *
   * @input
   * @type {Destinatario[] | undefined}
   */
  @Input() datoSeleccionadorfc: Fabricante[] | undefined;

  /**
   * @property tipoPersona
   * @description Proporciona acceso al enum `TipoPersona` para su uso en la clase.
   * @type {TipoPersona}
   */
  public tipoPersona = TipoPersona;
  /**
   * Datos de catálogo de estados.
   * @property {Catalogo[]} estadosDatos
   */
  public estadosDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de municipios.
   * @property {Catalogo[]} municipiosDatos
   */
  public municipiosDatos: Catalogo[] = [];

  /**
   * @property nacionalStr
   * @description Almacena la cadena de texto para "Nacional" para su uso en la interfaz de usuario.
   * @type {string}
   * @default STR_NACIONAL
   */
  public nacionalStr = STR_NACIONAL;

  /**
   * Datos de catálogo de localidades.
   * @property {Catalogo[]} localidadesDatos
   */
  public localidadesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de colonias.
   * @property {Catalogo[]} coloniasDatos
   */
  public coloniasDatos: Catalogo[] = [];

  /**
   * Arreglo de fabricantes a agregar.
   * @property {Fabricante[]} fabricantes
   */
  fabricantes: Fabricante[] = [];

  /**
   * Subject que se utiliza para desuscribir observables y evitar fugas de memoria.
   * @property {Subject<void>} unsubscribe$
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Emite un evento con la lista de fabricantes actualizada.
   * @property {EventEmitter<Fabricante[]>} updateFabricanteTablaDatos
   */
  @Output() updateFabricanteTablaDatos = new EventEmitter<Fabricante[]>();
  /**
   * Indica si el componente debe estar oculto o visible.
   * @type {boolean}
   * @input
   */
  @Input() estaOculto!: boolean;

  /**
   * @property {Fabricante | undefined} datoSeleccionado
   * Dato seleccionado que se pasará al componente hijo `AgregarFabricanteComponent`.
   */
  @Input() datoSeleccionado: Fabricante[] | undefined;

  @Input() tramiteID: string = '';

  /**
   * Indica si se debe mostrar la colonia o equivalente.
   * @type {boolean}
   * @input
   */
  mostarColoniaOEquivalente = false;

  /**
   * Indica si se ha realizado la verificación de validación al intentar guardar.
   * Esta bandera se utiliza para controlar la visualización de mensajes de error o advertencia
   * cuando el usuario intenta guardar el formulario sin cumplir con los requisitos de validación.
   */
  chequeoValidacionAlGuardar =false;

    /**
     * Evento de salida que se emite cuando el usuario decide guardar y salir del formulario.
     * Los componentes padres pueden suscribirse a este evento para ejecutar acciones adicionales
     * después de que se haya guardado la información y se haya solicitado salir.
     */
    @Output() guardarYSalir = new EventEmitter<void>();
    /**
     * Evento de salida que emite una señal para cancelar o cerrar el modal actual.
     * Los componentes padres pueden suscribirse a este evento para manejar la acción de cancelación.
     */
    @Output() cancelarmodal = new EventEmitter<void>();
    /**
     * @input
     * Lista de objetos de tipo `Fabricante` que se mostrarán en la tabla de fabricantes.
     * Este arreglo es recibido como entrada por el componente.
     */
    @Input() fabricanteTablaDatos: Fabricante[] = [];

 /**
   * Lista de elementos deshabilitados en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben estar deshabilitados en el formulario.
   */
  public elementosDeshabilitados: string[] = [];

  /**
   * Lista de elementos requeridos en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben ser obligatorios en el formulario.
   */
  public elementosNoRequeridos: string[] = [];

  /**
   * Controla si el desplegable de nacionalidad está deshabilitado.
   * @property {boolean} estaDeshabilitadoDesplegable
   */
  public estaDeshabilitadoDesplegable: boolean = true;

  /**
   * @property {boolean} habilitarContribuyente
   * @description
   * Indica si el campo de contribuyente debe estar habilitado en el formulario de fabricante.
   * Se activa dependiendo del procedimiento seleccionado.
   */
  public habilitarContribuyente: boolean = false;
  /**
   * Datos de catálogo de municipios.
   * @property {Catalogo[]} municipiosTempDatos
   */
  public municipiosTempDatos: Catalogo[] = [];
  /**
   * Datos de catálogo de colonias.
   * @property {Catalogo[]} coloniasTempDatos
   */
  public coloniasTempDatos: Catalogo[] = [];
  /**
   * Datos de catálogo de localidades.
   * @property {Catalogo[]} localidadesTempDatos
   */
  public localidadesTempDatos: Catalogo[] = [];

  /**
   * Objeto de tipo `Fabricante` asociado al componente.
   *
   * @type {Fabricante | undefined}
   * @optional
   */
  fabricante?: Fabricante;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Event emitted when fabricante is successfully saved
   */
  @Output() fabricanteSaved = new EventEmitter<void>();


  public requestedFocus: boolean = true;

      /**
       * @property {Subscription} subscription
       * @private
       * @description
       * Contenedor principal para gestionar suscripciones a observables que requieren
       * limpieza manual. Se utiliza como alternativa al patrón destroyNotifier$
       * para casos específicos que necesitan control granular de suscripciones.
       * 
       * @pattern Subscription Management
       * @purpose Agrupa múltiples suscripciones para limpieza eficiente
       * @cleanup Se desuscribe manualmente en ngOnDestroy()
       * @use_case Suscripciones que requieren lógica de limpieza personalizada
       * 
       * @example
       * ```typescript
       * this.subscription.add(
       *   this.service.getData().subscribe(data => { ... })
       * );
       * ```
       */
      private subscription: Subscription = new Subscription();
      disableLabel:string[] =['Física','Moral'];
    /**
     * Arreglo que almacena las opciones dinámicas obtenidas desde un archivo JSON.
     */
    losDatos: OpcionesPublicacion[] = [{
      label: 'Nacional',
      value: 'Nacional'
    },
    {
      label: 'Extranjero',
      value: 'Extranjero'
    }];
    losDatosTipoPersona: OpcionesPublicacion[] = [{
      label: 'Física',
      value: 'Fisica',
      hint:'Una persona física es entendida como toda persona con una actividad específica'
    },
    {
label: 'Moral',
      value:  'Moral',
      hint:'Una persona física es entendida como toda persona con una actividad específica'
    }
    ];


  /**
   * Constructor que inyecta los servicios y crea el formulario de fabricante.
   *
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {Tramite260204Store} tramiteStore - Store para manejar la información del trámite 260204.
   * @param {Tramite260204Query} tramiteQuery - Query para consultar el estado del trámite 260204.
   * @param {Location} ubicaccion - Servicio para manejar la navegación en el historial del navegador.
   * @param {DatosSolicitudService} datosSolicitudService - Servicio para obtener información de catálogos.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private catalogoService: CatalogoServices,
      private _sharedSvc: Shared2605Service,
  ) {
    //constructor necesario para inyectar el servicio
  }

  /**
   * Hook que se ejecuta al inicializar el componente.
   * Llama a la función para cargar los datos de los catálogos.
   */
  ngOnInit(): void {
    this.requestedFocus = DEFAULT_TABLA_ORDENS.includes(this.idProcedimiento) ? false : true;
    this.cambiarHabilitacionContribuyente();
    this.cargarDatos(this.tramiteID);
    this.chequeoValidacionAlGuardar =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento)
        ? true
        : false;
    this.validarElementos();
    this.crearAgregarFormularioFabricante();
    this.estaDeshabilitadoDesplegable = true;
    this.changeTipoPersona();

    this.mostarColoniaOEquivalente =
      PROCEDIMIENTOS_PARA_COLONIA_O_EQUIVALENTE.includes(this.idProcedimiento)
        ? true
        : false;
    this.forzarDeshabilitarPais();
  }

  /**
   * Ciclo de vida de Angular: `ngOnChanges`.
   *
   * @param {SimpleChanges} currentValue - Objeto que contiene los cambios en las propiedades de entrada (`@Input`).
   *
   * @description
   * Este método se ejecuta automáticamente cada vez que cambia alguna propiedad de entrada del componente.
   *
   * - Verifica si existe un valor en `datoSeleccionado` y si tiene registros.
   * - Si hay información:
   *   1. Asigna el nuevo valor de `datoSeleccionado`.
   *   2. Tras un pequeño retraso (`setTimeout`), habilita el formulario `agregarFabricanteForm`
   *      si los campos `nacionalidad` y `tipoPersona` están presentes.
   *   3. Actualiza el formulario con los valores del primer elemento de `datoSeleccionado`.
   * - Si no existe información, limpia el formulario mediante `reset()`.
   */

/**
 * Ciclo de vida de Angular: `ngOnChanges`.
 */
ngOnChanges(currentValue: SimpleChanges): void {
  if (this.chequeoValidacionAlGuardar) {
    this.fabricantes = Array.isArray(this.fabricanteTablaDatos) ? [...this.fabricanteTablaDatos] : [];
  }
  if (currentValue['datoSeleccionado'] && currentValue['datoSeleccionado'].currentValue && currentValue['datoSeleccionado'].currentValue.length > 0) {
    this.datoSeleccionado = currentValue['datoSeleccionado'].currentValue;
    
    this.cargarCatalogosParaModificacion().then(() => {
      setTimeout(() => {
        if (
          this.datoSeleccionado?.[0]?.tipoPersona && this.idProcedimiento !== 260103
        ) {
          this.agregarFabricanteForm?.enable();
        }
        else if(this.idProcedimiento === 260103){
          this.agregarFabricanteForm?.disable();
          this.agregarFabricanteForm.get('tipoPersona')?.enable();
          this.agregarFabricanteForm.get('rfc')?.enable();
        }

        
        this.patchFormWithCatalogObjects();
        this.actualizarEstadoDesplegables();
        this.updateValidatorsBasedOnTipoPersona();
      }, 100);
    });
  } else {
    this.agregarFabricanteForm?.reset();
  }
}

/**
 * Updates validators based on tipo persona
 */
private updateValidatorsBasedOnTipoPersona(): void {
  const RAZONSOCIALCONTROL = this.agregarFabricanteForm.get('razonSocial');
  const NOMBRESCONTROL = this.agregarFabricanteForm.get('nombres');
  const PRIMERAPELLIDOCONTROL = this.agregarFabricanteForm.get('primerApellido');
  const TIPOPERSONAVALUE = this.datoSeleccionado?.[0]?.tipoPersona;

  if (this.chequeoValidacionAlGuardar) {
    if (TIPOPERSONAVALUE === this.tipoPersona.MORAL) {
      RAZONSOCIALCONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
    } else {
      RAZONSOCIALCONTROL?.clearValidators();
    }
    RAZONSOCIALCONTROL?.updateValueAndValidity();

    if (TIPOPERSONAVALUE === this.tipoPersona.FISICA) {
      NOMBRESCONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
      PRIMERAPELLIDOCONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
    } else {
      NOMBRESCONTROL?.clearValidators();
      PRIMERAPELLIDOCONTROL?.clearValidators();
    }
    NOMBRESCONTROL?.updateValueAndValidity();
    PRIMERAPELLIDOCONTROL?.updateValueAndValidity();
  }
}


/**
 * Loads catalog data required for modification
 * This method loads all the necessary catalogs when editing a fabricante
 */
private async cargarCatalogosParaModificacion(): Promise<void> {
  const SELECTEDDATA = this.datoSeleccionado?.[0];
  if (!SELECTEDDATA){
    return;
  }
  try {
    if (SELECTEDDATA.entidadFederativa || SELECTEDDATA.entidadFederativaObj) {
      const ESTADOSRESPONSE = await this.catalogoService.estadosCatalogo(this.tramiteID).toPromise();
      this.estadosDatos = ESTADOSRESPONSE?.datos as Catalogo[] || [];
      
      const ESTADOCLAVE = SELECTEDDATA.entidadFederativaObj?.clave ||
        this.estadosDatos.find(estado => estado.descripcion === SELECTEDDATA.entidadFederativa)?.clave;

      if (ESTADOCLAVE) {
        const MUNICIPIOSRESPONSE = await this.catalogoService.municipiosDelegacionesCatalogo(this.tramiteID, String(ESTADOCLAVE)).toPromise();
        this.municipiosDatos = MUNICIPIOSRESPONSE?.datos as Catalogo[] || [];
        this.municipiosTempDatos = [...this.municipiosDatos];
        
        const MUNICIPIOCLAVE = SELECTEDDATA.municipioAlcaldiaObj?.clave ||
          this.municipiosDatos.find(municipio => municipio.descripcion === SELECTEDDATA.municipioAlcaldia)?.clave;

        if (MUNICIPIOCLAVE) {
          const [LOCALIDADESRESPONSE, COLONIASRESPONSE] = await Promise.all([
            this.catalogoService.localidadesCatalogo(this.tramiteID, String(MUNICIPIOCLAVE)).toPromise(),
            this.catalogoService.coloniasCatalogo(this.tramiteID, String(MUNICIPIOCLAVE)).toPromise()
          ]);
          
          this.localidadesDatos = LOCALIDADESRESPONSE?.datos as Catalogo[] || [];
          this.localidadesTempDatos = [...this.localidadesDatos];
          this.coloniasDatos = COLONIASRESPONSE?.datos as Catalogo[] || [];
          this.coloniasTempDatos = [...this.coloniasDatos];
        }
      }
    }

    if (!this.paisesDatos.length) {
      const PAIS_RESPONSE = await this.catalogoService.paisesCatalogo(this.tramiteID).toPromise();
      this.paisesDatos = PAIS_RESPONSE?.datos as Catalogo[] || [];
    }

    if (!this.codigosPostalesDatos.length) {
      this.datosSolicitudService
        .obtenerListaCodigosPostales()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          this.codigosPostalesDatos = data;
        });
    }

  } catch (error) {
    console.error('Error loading catalogs for modification:', error);
  }
}

/**
 * Patches form with selected data using proper catalog keys
 */
private patchFormWithCatalogObjects(): void {
  const SELECTEDDATA = this.datoSeleccionado?.[0];
  if (!SELECTEDDATA){
    return;
  }

  const PAISCLAVE = SELECTEDDATA.paisObj?.clave || this.paisesDatos.find(pais => 
    pais.descripcion === SELECTEDDATA.pais
  )?.clave || SELECTEDDATA.pais;

  const ESTADOCLAVE = SELECTEDDATA.entidadFederativaObj?.clave || this.estadosDatos.find(estado => 
    estado.descripcion === SELECTEDDATA.entidadFederativa
  )?.clave || SELECTEDDATA.estadoLocalidad;

  const MUNICIPIO_CLAVE = SELECTEDDATA.municipioAlcaldiaObj?.clave || this.municipiosDatos.find(municipio => 
    municipio.descripcion === SELECTEDDATA.municipioAlcaldia
  )?.clave || SELECTEDDATA.municipioAlcaldia;

  const LOCALIDAD_CLAVE = SELECTEDDATA.localidadObj?.clave || this.localidadesDatos.find(localidad => 
    localidad.descripcion === SELECTEDDATA.localidad
  )?.clave || SELECTEDDATA.localidad;

  const COLONIA_CLAVE = SELECTEDDATA.coloniaObj?.clave || this.coloniasDatos.find(colonia => 
    colonia.descripcion === SELECTEDDATA.colonia
  )?.clave || SELECTEDDATA.colonia;

  const CODIGO_POSTAL_CLAVE = SELECTEDDATA.codigoPostalObj?.clave || this.codigosPostalesDatos.find(cp => 
    cp.descripcion === SELECTEDDATA.codigoPostal
  )?.clave || SELECTEDDATA.codigoPostal;

  this.agregarFabricanteForm?.patchValue({
    tipoPersona: SELECTEDDATA.tipoPersona,
    rfc: SELECTEDDATA.rfc,
    curp: SELECTEDDATA.curp,
    nombres: SELECTEDDATA.nombres,
    primerApellido: SELECTEDDATA.primerApellido,
    segundoApellido: SELECTEDDATA.segundoApellido,
    razonSocial: SELECTEDDATA.razonSocial,
    pais: PAISCLAVE,
    estado: ESTADOCLAVE,
    municipio: MUNICIPIO_CLAVE,
    localidad: LOCALIDAD_CLAVE,
    codigoPostal: CODIGO_POSTAL_CLAVE,
    colonia: COLONIA_CLAVE,
    calle: SELECTEDDATA.calle,
    numeroExterior: SELECTEDDATA.numeroExterior,
    numeroInterior: SELECTEDDATA.numeroInterior,
    lada: SELECTEDDATA.lada,
    telefono: SELECTEDDATA.telefono,
    correoElectronico: SELECTEDDATA.correoElectronico,
    coloniaOEquivalente: SELECTEDDATA.coloniaEquivalente,
  });
  if(this.idProcedimiento === 260103){
    this.agregarFabricanteForm.disable();
    this.agregarFabricanteForm.get('tipoPersona')?.enable();
    this.agregarFabricanteForm.get('rfc')?.enable();
  }
}



  /**
   * @method cambiarHabilitacionContribuyente
   * @description
   * Habilita el campo de contribuyente en el formulario si el procedimiento actual está incluido en la lista `TERCEROS_RELACIONADOS_DATOS_INICIALES`.
   * Cambia el valor de la propiedad `habilitarContribuyente` a `true` si la condición se cumple.
   *
   * @returns {void}
   */
  public cambiarHabilitacionContribuyente(): void {
    if (TERCEROS_RELACIONADOS_DATOS_INICIALES.includes(this.idProcedimiento)) {
      this.habilitarContribuyente = true;
    }
  }

  /**
   * Método para inicializar el formulario reactivo `agregarFacturadorForm`.
   * Define los campos y sus validaciones.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  crearAgregarFormularioFabricante(): void {
    this.agregarFabricanteForm = this.fb.group({
      tipoPersona: [
        {
          value: this.obtenerValor('tipoPersona'),
          disabled: false,
        },
        Validators.required
      ],
      rfc: [
        this.obtenerValor('rfc')
      ],
      curp: [
        this.obtenerValor('curp'),
        this.idProcedimiento === 260912 ? [] : (this.estaOculto ? [] : [Validators.required, Validators.pattern(/^[A-Za-z]{4}\d{6}[HM][A-Za-z]{5}\d{2}$/)])
      ],
      nombres: [
        this.obtenerValor('nombres')
      ],
      primerApellido: [
        this.obtenerValor('primerApellido')
      ],
      segundoApellido: [
        this.obtenerValor('segundoApellido'),
        [Validators.pattern(REGEX_NOMBRE)],
      ],
      razonSocial: [
        this.obtenerValor('razonSocial'),
        [Validators.required]
      ],
      pais: [
        {
          value: this.elementosDeshabilitados.includes('pais')
            ? ''
            : this.obtenerValor('pais'),
          disabled: this.elementosDeshabilitados.includes('pais') || this.chequeoValidacionAlGuardar,
        }
      ],
      estado: [
        {
          value: this.elementosDeshabilitados.includes('estado')
            ? '1'
            : this.obtenerValor('estadoLocalidad'),
          disabled: this.elementosDeshabilitados.includes('estado'),
        }
      ],
      municipio: [
        {
          value: this.elementosDeshabilitados.includes('municipio')
            ? '1'
            : this.obtenerValor('municipioAlcaldia'),
          disabled: this.elementosDeshabilitados.includes('municipio'),
        }
      ],
      localidad: [
        this.obtenerValor('localidad'),
        
      ],
      codigoPostal: [
        this.obtenerValor('codigoPostal'),
        this.idProcedimiento === 260911 
        ? [] 
        :!this.elementosNoRequeridos.includes('codigoPostal')
        ? [Validators.required, Validators.pattern(REGEX_IMPORTE_PAGO)]
        : [],
      ],
      colonia: [
        this.obtenerValor('colonia'),
        !this.elementosNoRequeridos.includes('colonia')
          ? [Validators.required]
          : [],
      ],
      calle: [this.obtenerValor('calle')],
      numeroExterior: [
        this.obtenerValor('numeroExterior')
      ],
      numeroInterior: [this.obtenerValor('numeroInterior')],
      lada: [this.obtenerValor('lada')],
      telefono: [
        {
          value: this.obtenerValor('telefono'),
          disabled: this.elementosDeshabilitados.includes('telefono'),
        },
        [Validators.pattern(REGEX_TELEFONO)],
      ],
      correoElectronico: [
        {
          value: this.elementosDeshabilitados.includes('correoElectronico')
            ? 'abc@njk.com'
            : this.obtenerValor('correoElectronico'),
          disabled: this.elementosDeshabilitados.includes('correoElectronico'),
        },
        [Validators.pattern(REGEX_CORREO_ELECTRONICO)],
      ],
      coloniaOEquivalente: [
        { value: this.obtenerValor('coloniaEquivalente'), disabled: true },
      ],
    });
    const RAZON_SOCIAL_CONTROL = this.agregarFabricanteForm.get('razonSocial');
    const NOMBRES_CONTROL = this.agregarFabricanteForm.get('nombres');
    const PRIMER_APELLIDO_CONTROL = this.agregarFabricanteForm.get('primerApellido');
    const TIPO_PERSONA_CONTROL = this.agregarFabricanteForm.get('tipoPersona');
  const SET_STRICT_VALIDATORS = (tipo: TipoPersona): void => {
      if (this.chequeoValidacionAlGuardar) {
        if (tipo === this.tipoPersona.MORAL) {
          RAZON_SOCIAL_CONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
        } else {
          RAZON_SOCIAL_CONTROL?.clearValidators();
        }
        RAZON_SOCIAL_CONTROL?.updateValueAndValidity();
        if (tipo === this.tipoPersona.FISICA) {
          NOMBRES_CONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
          PRIMER_APELLIDO_CONTROL?.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
        } else {
          NOMBRES_CONTROL?.clearValidators();
          PRIMER_APELLIDO_CONTROL?.clearValidators();
        }
        NOMBRES_CONTROL?.updateValueAndValidity();
        PRIMER_APELLIDO_CONTROL?.updateValueAndValidity();
      }
    };
    SET_STRICT_VALIDATORS(TIPO_PERSONA_CONTROL?.value);
    TIPO_PERSONA_CONTROL?.valueChanges.subscribe(tipo => {
      SET_STRICT_VALIDATORS(tipo);
    });
  }

    /**
   * @private
   * Fuerza la deshabilitación del campo 'pais' en el formulario de agregar destinatario final.
   * 
   * Si la variable `chequeoValidacionAlGuardar` es verdadera, deshabilita el control 'pais'
   * dentro del formulario reactivo `agregarDestinatarioFinal`.
   * 
   * Útil para evitar que el usuario modifique el país cuando ciertas condiciones de validación se cumplen al guardar.
   */
private forzarDeshabilitarPais(): void {

      this.agregarFabricanteForm.patchValue({pais: ''});
    

  if (
      (this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.FISICA ||
      this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.MORAL) && this.idProcedimiento !== 260103
  ) {
    this.agregarFabricanteForm.get('pais')?.enable();
  }
}

  /**
   * Valida elementos según el `idProcedimiento` y establece
   * las listas de elementos no válidos y añadidos.
   * @returns {void} Lista de elementos no válidos.
   */
  validarElementos(): void {
    switch (this.idProcedimiento) {
      case 260103:
       this.elementosNoRequeridos = ['codigoPostal','colonia'];
        this.elementosDeshabilitados = ['pais'];
       break;
        default:
        this.elementosDeshabilitados = [];
        this.elementosNoRequeridos = [];
    }
  }

validatorFuctionRequired():void{
switch(this.idProcedimiento) {
  case 260103:
    if (this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.FISICA) {
      this.requiredFieldVlidator =[
          "tipoPersona",
         "rfc",
         
      ]
       }
    else if(this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.MORAL){
  this.requiredFieldVlidator =[
     "tipoPersona",
         "rfc"

  ]
    }
    else{
  this.requiredFieldVlidator =[
     "tipoPersona",
         "rfc",
          "curp",
           "nombres",
   "primerApellido",
   "razonSocial",
  "pais",
  "estado",
  "municipio",
  "localidad",
  "codigoPostal",
  "colonia",
  "calle",
  "numeroExterior",
  "correoElectronico"
  ]
    }
    break;
     case 260102:
      if (this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.FISICA) {
      this.requiredFieldVlidator =[
     "tipoPersona",
           "nombres",
   "primerApellido",
  "pais",
  "estado",
  "codigoPostal",
  "calle",
  "numeroExterior",
      ]
       }
    else if(this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.MORAL){
  this.requiredFieldVlidator =[
 "tipoPersona",
 "razonSocial",
  "pais",
  "estado",
  "municipio",
  "localidad",
  "codigoPostal",
  "calle",
  "numeroExterior",
  ]
    }
    else{
  this.requiredFieldVlidator =[
     "tipoPersona",
         "rfc",
          "curp",
           "nombres",
   "primerApellido",
   "razonSocial",
  "pais",
  "estado",
  "municipio",
  "localidad",
  "codigoPostal",
  "colonia",
  "calle",
  "numeroExterior",
  "correoElectronico"
  ]
    }
    break;
    case 260104:
      if (this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.FISICA) {
      this.requiredFieldVlidator =[
     "tipoPersona",
           "nombres",
   "primerApellido",
  "pais",
  "estado",
  "codigoPostal",
  "calle",
  "numeroExterior",
      ]
       }
    else if(this.agregarFabricanteForm.get('tipoPersona')?.value === this.tipoPersona.MORAL){
  this.requiredFieldVlidator =[
 "tipoPersona",
 "razonSocial",
  "pais",
  "estado",
  "codigoPostal",
  "calle",
  "numeroExterior",
  ]
    }
    else{
  this.requiredFieldVlidator =[
     "tipoPersona",
         "rfc",
          "curp",
           "nombres",
   "primerApellido",
   "razonSocial",
  "pais",
  "estado",
  "municipio",
  "localidad",
  "codigoPostal",
  "colonia",
  "calle",
  "numeroExterior",
  "correoElectronico"
  ]
    }
    break;
  default:
   this.requiredFieldVlidator=[];
    break;
}
}
resetAllErrorFlags(): void {
  Object.keys(this.errorMessageValidator).forEach((key) => {
     this.errorMessageValidator[key as keyof typeof this.errorMessageValidator] = false;
  });
}
areAllFieldsValid(): boolean {
  return Object.values(this.errorMessageValidator).every(v => v === false);
}

  /**
   * Guarda un fabricante nuevo en el arreglo `fabricantes`, lo actualiza en el store y
   * regresa a la página anterior en el historial del navegador.
   */
guardarFabricante(): void {
  this.validatorFuctionRequired();
  this.resetAllErrorFlags();
  this.validateRequiredFields()
if(this.areAllFieldsValid()){
   this.mensajeDeError = '';  
  const VALOR_FORMULARIO = this.agregarFabricanteForm.getRawValue();

  let nombreRazonSocial: string;

  if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.MORAL) {
    nombreRazonSocial = VALOR_FORMULARIO.razonSocial;
  } else if (VALOR_FORMULARIO.tipoPersona === this.tipoPersona.FISICA) {
    nombreRazonSocial = `${VALOR_FORMULARIO.nombres} ${VALOR_FORMULARIO.primerApellido} ${VALOR_FORMULARIO.segundoApellido || ''}`.trim();
  } else {
    nombreRazonSocial = '';
  }
  /**
   * Gets catalog object with both clave and descripcion
   */
  const OBTENER_OBJETO_CATALOGO = (catalogArray: Catalogo[], claveSeleccionada: string | number): Catalogo | undefined => {
    if (!claveSeleccionada){
      return undefined;
    }
    
    const ITEM = catalogArray.find(cat => cat.clave?.toString() === claveSeleccionada.toString());
    return ITEM ? {
      clave: ITEM.clave,
      descripcion: ITEM.descripcion,
      id: ITEM.id
    } : {
      clave: claveSeleccionada.toString(),
      descripcion: claveSeleccionada.toString(),
      id: 0
    };
  };

  const PAISOBJ = OBTENER_OBJETO_CATALOGO(this.paisesDatos, VALOR_FORMULARIO.pais);
  const ESTADOOBJ = OBTENER_OBJETO_CATALOGO(this.estadosDatos, VALOR_FORMULARIO.estado);
  const MUNICIPIOOBJ = OBTENER_OBJETO_CATALOGO(this.municipiosDatos, VALOR_FORMULARIO.municipio);
  const LOCALIDADOBJ = OBTENER_OBJETO_CATALOGO(this.localidadesDatos, VALOR_FORMULARIO.localidad);
  const COLONIAOBJ = OBTENER_OBJETO_CATALOGO(this.coloniasDatos, VALOR_FORMULARIO.colonia);
  const CODIGOPOSTALOBJ = OBTENER_OBJETO_CATALOGO(this.codigosPostalesDatos, VALOR_FORMULARIO.codigoPostal);

  const NUEVO_FABRICANTE: Fabricante = {
    id: this.datoSeleccionado?.[0]?.id || Date.now(),
    tipoPersona: VALOR_FORMULARIO.tipoPersona,
    nombreRazonSocial: nombreRazonSocial,
    rfc: VALOR_FORMULARIO.rfc,
    curp: VALOR_FORMULARIO.curp,
    telefono: VALOR_FORMULARIO.telefono,
    correoElectronico: VALOR_FORMULARIO.correoElectronico,
    calle: VALOR_FORMULARIO.calle,
    numeroExterior: VALOR_FORMULARIO.numeroExterior,
    numeroInterior: VALOR_FORMULARIO.numeroInterior || '',
    
    pais: PAISOBJ?.descripcion || '',
    paisObj: PAISOBJ,
    
    colonia: COLONIAOBJ?.descripcion || '',
    coloniaObj: COLONIAOBJ,
    
    municipioAlcaldia: MUNICIPIOOBJ?.descripcion || '',
    municipioAlcaldiaObj: MUNICIPIOOBJ,

    localidad: LOCALIDADOBJ?.descripcion || '',
    localidadObj: LOCALIDADOBJ,

    entidadFederativa: ESTADOOBJ?.descripcion || '',
    entidadFederativaObj: ESTADOOBJ,
    estadoLocalidad: ESTADOOBJ?.descripcion || '',

    codigoPostal: CODIGOPOSTALOBJ?.descripcion || '',
    codigoPostalObj: CODIGOPOSTALOBJ,
    
    coloniaEquivalente: VALOR_FORMULARIO.coloniaOEquivalente,
    nombres: VALOR_FORMULARIO.nombres,
    primerApellido: VALOR_FORMULARIO.primerApellido,
    segundoApellido: VALOR_FORMULARIO.segundoApellido,
    razonSocial: VALOR_FORMULARIO.razonSocial,
    lada: VALOR_FORMULARIO.lada,
  };

  let updatedFabricantes: Fabricante[];

  const SELECTED_ID = this.datoSeleccionado?.[0]?.id;

  if (this.datoSeleccionado && this.datoSeleccionado.length > 0 && SELECTED_ID !== undefined) {
    updatedFabricantes = this.fabricanteTablaDatos.map(f => 
      f.id === SELECTED_ID ? NUEVO_FABRICANTE : f
    );
  } else {
    updatedFabricantes = [...this.fabricanteTablaDatos, NUEVO_FABRICANTE];
  }

  this.updateFabricanteTablaDatos.emit(updatedFabricantes);
  
  this.limpiarFormulario();
  this.datoSeleccionado = []; 
  this.cancelarmodal.emit(); 
}
}
validateRequiredFields(): void {
  const FORM = this.agregarFabricanteForm;
  this.requiredFieldVlidator.forEach((key) => {
    const CONTROL = FORM.get(key);
    if (!CONTROL) { return; }
       if (!this.requiredFieldVlidator.includes(key as FabricanteRequiredField)) {
      this.errorMessageValidator[key] = false;
      return;
    }
    if (!CONTROL.getRawValue() || CONTROL.getRawValue() === '' || CONTROL.getRawValue() === null) {
      this.errorMessageValidator[key] = true;
    } else {
      this.errorMessageValidator[key] = false;
    }
  });
}

  /**
   * Carga datos de catálogos (códigos postales, países, estados, municipios, etc.)
   * utilizando el servicio `DatosSolicitudService`.
   * Se desuscribe automáticamente al destruir el componente.
   */
  cargarDatos(tramite: string): void {

       this.subscription.add(
            this.catalogoService
            .paisesCatalogo(tramite)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response) => {
              const DATOS = response.datos as Catalogo[];
              
              if (response) {
                this.paisesDatos = DATOS;
              }
            })
          );  
       

       this.subscription.add(
            this.catalogoService
            .estadosCatalogo(tramite)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response) => {
              const DATOS = response.datos as Catalogo[];
              
              if (response) {
                this.estadosDatos = DATOS;
              }
            })
          );  

  }




  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `agregarProveedorForm` para limpiar todos los campos.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  limpiarFormulario(): void { 
    this.agregarFabricanteForm.reset();
    this.agregarFabricanteForm.markAsUntouched();

    if (this.chequeoValidacionAlGuardar) {    
          this.agregarFabricanteForm.disable(); 
      this.agregarFabricanteForm.get('tipoPersona')?.enable();
      this.estaDeshabilitadoDesplegable = true;
    }
  }
  /**
   * @method cancelar
   * @description Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  cancelar(): void {
      this.limpiarFormulario();
      this.datoSeleccionado = [];
      this.cancelarmodal.emit();
  }

  /**
   * Carga la lista de estados cuando se selecciona un catálogo válido.
   *
   * @param evento Objeto de tipo `Catalogo` que contiene la información seleccionada.
   *
   * ### Descripción:
   * - Si el `id` del evento es mayor que 0, asigna la lista temporal de municipios (`municipiosTempDatos`)
   *   a la lista principal (`municipiosDatos`).
   */
  cargarEstados(evento: Catalogo): void {
    if (evento.clave) {
    this.subscription.add(this.catalogoService.municipiosDelegacionesCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.municipiosDatos = DATOS;
    }));
  } else {
    this.municipiosDatos = [];
  }
  }
  /**
   * Carga la lista de localidades cuando se selecciona un catálogo válido.
   *
   * Objeto de tipo `Catalogo` que contiene la información seleccionada.
   */
  cargarLocalidades(_evento: Catalogo): void {
    const MUNICIIO_CLAVE = this.agregarFabricanteForm.get('municipio')?.value;

  if (MUNICIIO_CLAVE) {
    this.subscription.add(
      this.catalogoService.codigoCatalogo(this.tramiteID, MUNICIIO_CLAVE)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          this.codigosPostalesDatos = data.datos as Catalogo[];
        })
    );
  } else {
    this.codigosPostalesDatos = [];
  }
}
  /**
   * Carga la lista de municipios, localidades y colonias cuando se selecciona un catálogo válido.
   *
   * @param evento Objeto de tipo `Catalogo` que contiene la información seleccionada.
   *
   * ### Descripción:
   * - Si el `id` del evento es mayor que 0:
   *   - Asigna la lista temporal de localidades (`localidadesTempDatos`) a la lista principal (`localidadesDatos`).
   *   - Asigna la lista temporal de colonias (`coloniasTempDatos`) a la lista principal (`coloniasDatos`).
   */
  cargarMunicipios(evento: Catalogo): void {
    if (evento.clave) {
    this.subscription.add(this.catalogoService.localidadesCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.localidadesDatos = DATOS;
    }));

    this.subscription.add(this.catalogoService.coloniasCatalogo(this.tramiteID, evento.clave).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.coloniasDatos = DATOS;
    }));

  } else {
    this.localidadesDatos = [];
    this.coloniasDatos = [];
  }
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.agregarFabricanteForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
   * @param {keyof Fabricante} field - Nombre del campo a obtener.
   * @returns {string | number | undefined | string[]} - Valor del campo especificado.
   */
  public obtenerValor(field: keyof Fabricante): string | number | undefined {
    const VALUE = this.datoSeleccionado?.[0]?.[field as keyof Fabricante];
    if (typeof VALUE === 'object' && VALUE !== null) {
      return '';
    }
    return VALUE ?? '';
  }
  /**
   * Validador personalizado para RFC según el tipo de persona (Física o Moral).
   *
   * @param TIPO_PERSONA El tipo de persona para el cual se debe validar el RFC.
   * @returns Una función validadora que verifica si el valor cumple con el formato RFC correspondiente.
   *          Si el valor es inválido, retorna un objeto con la clave de error específica.
   *          Si el tipo de persona es desconocido o el valor está vacío, retorna null.
   */
  static rfcFisicaValidator(
    TIPO_PERSONA: TipoPersona
  ): (CONTROL: AbstractControl) => ValidationErrors | null {
    return (CONTROL: AbstractControl): ValidationErrors | null => {
      const VALUE = CONTROL?.value;

      if (!VALUE) {
        return null;
      }

      let REGEX;
      let ERROR_KEY;

      if (TIPO_PERSONA === TipoPersona.FISICA) {
        REGEX = REGEX_RFC_FISICA;
        ERROR_KEY = { INVALID_RFC_FISICA: true };
      } else if (TIPO_PERSONA === TipoPersona.MORAL) {
        REGEX = REGEX_RFC_MORAL;
        ERROR_KEY = { INVALID_RFC_MORAL: true };
      } else {
        return null;
      }

      return REGEX.test(VALUE) ? null : ERROR_KEY;
    };
  }

  /**
   * Maneja el evento de cambio en el campo de RFC.
   *
   * @param {Event} event - Evento que se dispara al cambfiar el valor del campo de entrada (input).
   */
  onChangeRfc(event: Event): void {
    if (this.chequeoValidacionAlGuardar) {
      return;
    }
    const RFC_VALUE = (event.target as HTMLInputElement).value;
    this.datoSeleccionadorfc?.forEach((dato) => {
      if (dato.rfc === RFC_VALUE) {
        const PEDIMENTO = {
          patente: 0,
          pedimento: 0,
          aduana: 0,
          idTipoPedimento: 0,
          descTipoPedimento: 'Por evaluar',
          numero: '',
          comprobanteValor: '',
          pedimentoValidado: false,
        };
        this.abrirModal(
          'La información proporcionada de la persona ya existe, favor de verificar.'
        );
        this.pedimentos.push(PEDIMENTO);
      }
    });
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }



  /**
   * @method changeTipoPersona
   * @description Cambia el estado de los controles del formulario según el tipo de persona seleccionado.
   * Si el tipo de persona es física, habilita el campo RFC; si es moral, lo deshabilita.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
changeTipoPersona(): void {

  const RFC_CONTROL = this.agregarFabricanteForm.get('rfc');
  const TIPOPERSONA = this.agregarFabricanteForm.get('tipoPersona')?.value;
  if (RFC_CONTROL) {
    if (
      (TIPOPERSONA === this.tipoPersona.FISICA || TIPOPERSONA === this.tipoPersona.MORAL)
    ) {
      RFC_CONTROL.clearValidators();
    } else {
      RFC_CONTROL.setValidators([
        Validators.required,
        AgregarFabricanteComponent.rfcFisicaValidator(TIPOPERSONA)
      ]);
    }
    RFC_CONTROL.updateValueAndValidity();
  }
  this.agregarFabricanteForm.disable();
  if(this.idProcedimiento === 260103){
 this.agregarFabricanteForm.get('tipoPersona')?.enable();
 this.agregarFabricanteForm.get('rfc')?.enable();
  }
  else{
 this.agregarFabricanteForm.get('tipoPersona')?.enable();
 if(this.agregarFabricanteForm.get('tipoPersona')?.value){
  this.agregarFabricanteForm.enable();
   this.estaDeshabilitadoDesplegable=false;
 }
  }

  this.forzarDeshabilitarPais();
}







  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Updates the estaDeshabilitadoDesplegable flag based on whether both nacionalidad and tipoPersona are selected.
   * If either is missing, disables dropdowns. If both are present, enables them.
   */
  private actualizarEstadoDesplegables(): void {

    const TIPO_PERSONA = this.agregarFabricanteForm?.get('tipoPersona')?.value;
        if(this.idProcedimiento === 260103){
        this.agregarFabricanteForm.disable();
        this.agregarFabricanteForm.get('tipoPersona')?.enable();
        this.agregarFabricanteForm.get('rfc')?.enable();
      }
      else{
    if (TIPO_PERSONA) {
      this.estaDeshabilitadoDesplegable = false;
      Object.keys(this.agregarFabricanteForm.controls).forEach((controlName) => {
        if (!this.elementosDeshabilitados.includes(controlName)) {
          this.agregarFabricanteForm.get(controlName)?.enable();
        }
      });
    } else {
      this.estaDeshabilitadoDesplegable = true;
      Object.keys(this.agregarFabricanteForm.controls).forEach((controlName) => {
        if ( controlName !== 'tipoPersona') {
          this.agregarFabricanteForm.get(controlName)?.disable();
        } else {
          this.agregarFabricanteForm.get(controlName)?.enable();
        }
      });
      if (this.chequeoValidacionAlGuardar) {
        this.agregarFabricanteForm.get('tipoPersona')?.disable();
      }
    }
  }
  }
  /**
   * Getter que determina si se debe mostrar el campo RFC en el formulario.
   * @returns {boolean} True si la nacionalidad no es 'Extranjero' y el procedimiento actual está en la lista de procedimientos que muestran RFC; de lo contrario, false.
   */
  get mostrarRFC(): boolean {
    return (
      PROCEDIMIENTOS_MUESTRAN_RFC.includes(this.idProcedimiento)
    );
  }
   buscar(form: FormGroup): void {
    const PROCEDIMIENTO = String(this.idProcedimiento);

    if (form.get('rfc')?.valid && getValidDatos(form.get('rfc')?.value)) {
      const PAYLOAD = {
        "rfcRepresentanteLegal": form.get('rfc')?.value
      }
      this._sharedSvc.getRepresentanteLegala(PAYLOAD, PROCEDIMIENTO).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidArray(API_RESPONSE.datos)) {
        this.agregarFabricanteForm.patchValue({
          rfc: API_RESPONSE.datos[0].rfc,
          curp: API_RESPONSE.datos[0].curp,
          nombres: API_RESPONSE.datos[0].nombre,
          primerApellido: API_RESPONSE.datos[0].primerApellido,
          segundoApellido: API_RESPONSE.datos[0].segundoApellido,
          razonSocial: API_RESPONSE.datos[0].razonSocial,
          pais: API_RESPONSE.datos[0].paisObj?.clave || '',
          estado: API_RESPONSE.datos[0].entidadFederativaObj?.clave || '',
          municipio: API_RESPONSE.datos[0].municipioAlcaldiaObj?.clave || '',
          localidad: API_RESPONSE.datos[0].localidadObj?.clave || '',
          codigoPostal: API_RESPONSE.datos[0].codigoPostalObj?.clave || '',
          colonia: API_RESPONSE.datos[0].coloniaObj?.clave || '',
          calle: API_RESPONSE.datos[0].calle,
          numeroExterior: API_RESPONSE.datos[0].numeroExterior,
          numeroInterior: API_RESPONSE.datos[0].numeroInterior,
          lada: API_RESPONSE.datos[0].lada,
          telefono: API_RESPONSE.datos[0].telefono,
          correoElectronico: API_RESPONSE.datos[0].correoElectronico,
        })
        if(this.idProcedimiento === 260103){
          this.agregarFabricanteForm.disable();
          this.agregarFabricanteForm.get('tipoPersona')?.enable();
          this.agregarFabricanteForm.get('rfc')?.enable();

        }
          // form.patchValue(DATOS);
        }
      });
    } else {
      form.get('rfc')?.markAsTouched();
    }
  }
  /**
   * Hook que se ejecuta al destruir el componente.
   * Envía un valor al Subject `unsubscribe$` y lo completa para liberar suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}