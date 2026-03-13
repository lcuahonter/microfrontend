import { CATALOGOS_ID,Notificacion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {REGEX_DECIMAL_16_TOTAL,REGEX_RFC, } from '@ng-mf/data-access-user';
import { Solicitud32502State, Tramite32502Store } from '../../../../estados/tramites/tramite32502.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TEXTOS, NotificacionesComponent } from '@ng-mf/data-access-user';
import { SolicitanteState, SolicitanteQuery} from '@ng-mf/data-access-user';
import { Tramite32502Query } from '../../../../estados/queries/tramite32502.query';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Solicitante } from '../../../../core/models/32502/tramite32502.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  REGEX_SOLO_NUMEROS,
  TablaDinamicaComponent,
  TituloComponent
} from '@libs/shared/data-access-user/src';

import {
  COLONIA, DELEGACION_MUNICIPIO,
  ENTIDAD_FEDERATIVA,
  FRACCION_ARANCELARIA, ADUANAS_ACTIVAS,
  FRACCION_REGLA_422
} from '../../../../shared/constants/datos-comunes.enum';


/**
 * Componente para la vista de la solicitud de la sección de "32502".
 */
@Component({
  selector: 'solicitud',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputFechaComponent,
    TituloComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './solicitud.component.html',
  styleUrl:'./solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
    /**
   * Representa la fecha de inicio ingresada por el usuario.
   * 
   * @type {InputFecha}
   * @default FECHA_INGRESO
   */
    public fechaInicioInput: InputFecha = {
      labelNombre: 'Fecha Aproximada Importacion',
      required: true,
      habilitado: true,
    };

  /**
   * Lista de catálogos de fracción arancelaria.
   */
  fraccionArancelaria!: Catalogo[];

  /** Datos del solicitante */
  solicitanteState!:SolicitanteState;

  /**
   * Opción seleccionada para Fracción Arancelaria.
   */
  opcionFraccionArancelaria: CatalogosSelect = FRACCION_ARANCELARIA;

  /**
   * Opción seleccionada para Entidad Federativa.
   */
  opcionEntidadFederativa: CatalogosSelect = ENTIDAD_FEDERATIVA;

  /**
   * Opción seleccionada para Delegación o Municipio.
   */
  opcionDelegacionMunicipio: CatalogosSelect = DELEGACION_MUNICIPIO;

  /**
   * Opción seleccionada para Colonia.
   */
  opcionColonia: CatalogosSelect = COLONIA;

  /**
   * Opción seleccionada para Aduanas.
   */
  opcionAduana: CatalogosSelect = ADUANAS_ACTIVAS;

  /**
   * Opción seleccionada para Aduanas.
   */
  opcionRegla422: CatalogosSelect = FRACCION_REGLA_422;

  /** Texto declaración */
  declaracion: string = '';

  /** Clave de la declaración */
  claveDeclaracion?: string;

  /**
   * Observable para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();


   /**
     * @public
     * @property {Notificacion} nuevaNotificacion
     * @description Representa una nueva notificación que se utilizará en el componente.
     * @command Este campo debe ser inicializado antes de su uso.
     */
   public nuevaNotificacion!: Notificacion;

  /**
   * Lista de catálogos de fracción regla.
   */
  fraccionRegla!: Catalogo[];
  

  /**
   * Estado de la solicitud.
   */
  public seccionState!: Solicitud32502State;

  /**
   * Formulario principal de la solicitud.
   */
  FormSolicitud!: FormGroup;

  /**
   * Mensaje declaración de responsabilidad solidaria.
   * @property {string} declaracionDeResponsabilidadSolidaria - Mensaje mostrado declaración de responsabilidad solidaria.
   */
  declaracionDeResponsabilidadSolidaria : string = TEXTOS.DECLARACION_DE_RESPONSABILIDAD_SOLIDARIA;
  private destroy$: Subject<void> = new Subject<void>();
    /**
    * Indica si el formulario está en modo solo lectura.
    * Cuando es `true`, los campos del formulario no se pueden editar.
    */
    esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param avisoService Servicio para obtener datos de PEXIM.
   * @param fb FormBuilder para crear formularios.
   * @param validacionesService Servicio para validaciones de formularios.
   * @param tramite32502Store Almacén de estado para el trámite 32502.
   */
  constructor(
    private avisoService: AvisoService,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    public tramite32502Store: Tramite32502Store,
    private tramite32502Query: Tramite32502Query,
    private consultaioQuery: ConsultaioQuery,
    private solicitanteQuery: SolicitanteQuery) {
          /**
       * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
       *
       * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
       * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
       * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
       */
          this.consultaioQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroy$),
            map((seccionState: { readonly: boolean }) => {
              this.esFormularioSoloLectura = seccionState.readonly;
              this.guardarDatosFormulario();
            })
          )
          .subscribe()
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método realiza las siguientes acciones:
   * 1. Inicializa los catálogos necesarios para el formulario.
   * 2. Selecciona los valores iniciales para los catálogos de fraccian de arancelaria, regla.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite32502Store.reset();
    this.inicializarEstadoFormulario();
    this.inicializaCatalogos();
    this.tramite32502Query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.seccionState = state;
        this.crearFormSolicitud();
      });
    
    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: SolicitanteState) => {
          this.solicitanteState = respuesta;
          this.tramite32502Store.update(
            {
              solicitante: this.getSolicitante()
            }
          );
        })
      )
      .subscribe();

    
  }

  /**
   * Setea los valores de solicitante al storage
   * @returns {Solicitante} Este método no retorna ningún valor.
   */
  getSolicitante(): Solicitante {

    return {
      rfc: this.solicitanteState.rfc_original,
      denominacion: this.solicitanteState.nombre,
      actividadEconomica: '',
      correoElectronico: '',
      pais: '',
      codigoPostal: '',
      entidadFederativa: '',
      cveEntidadFederativa: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calle: '',
      nExt: '',
      nInt: '',
      lada: '',
      telefono: '', 
      adace: '',
      tipoPersona: ''
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene el grupo de formulario 'adaceForm' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'adaceForm'.
   */
  get adaceForm(): FormGroup {
    return this.FormSolicitud.get('adaceForm') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'extranjeroAvisoAgace' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'extranjeroAvisoAgace'.
   */
  get extranjeroAvisoAgace(): FormGroup {
    return this.FormSolicitud.get('extranjeroAvisoAgace') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'mercanciaST' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'mercanciaST'.
   */
  get mercanciaST(): FormGroup {
    return this.FormSolicitud.get('mercanciaST') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'direccionST' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'direccionST'.
   */
  get direccionST(): FormGroup {
    return this.FormSolicitud.get('direccionST') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'pedimentoST' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'pedimentoST'.
   */
  get pedimentoST(): FormGroup {
    return this.FormSolicitud.get('pedimentoST') as FormGroup;
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }
 /*
  * Método para permitir solo números en un campo de entrada.
  * @param event Evento de teclado que se dispara al presionar una tecla.
  * @return {void}
  * Este método previene la entrada de cualquier carácter que no sea un dígito del 0 al 9.
  * Se utiliza una expresión regular para verificar si el carácter ingresado es un número.
  * Si el carácter no es un número, se previene la acción predeterminada del evento.
  * @param {KeyboardEvent} event - Evento de teclado que se dispara al presionar una tecla.
  * @return {void}
  */
  allowOnlyNumbers(event: KeyboardEvent): void {
    const CHARCODE= event.key;
    if (!/^\d$/.test(CHARCODE)) {
      event.preventDefault();
    }
    const DATOS = this.esFormularioSoloLectura; 
  }

  /**
   * Método para crear el formulario principal de la solicitud.
   */
  crearFormSolicitud(): void {
    this.tramite32502Query.selectSolicitud$
    .pipe(
      takeUntil(this.destroy$),
      map((seccionState) => {
        this.seccionState = seccionState;
      })
    )
    .subscribe()
    this.FormSolicitud = this.fb.group({
      adaceForm: this.fb.group({
      adace: [
        { value: this.seccionState?.adace || 'Centro', disabled: true}
      ]
      }),
      extranjeroAvisoAgace: this.fb.group({
      razonSocial: [
        this.seccionState?.razonSocial || '',
        Validators.required
      ],
      rfc: [
        this.seccionState?.rfc,
        [Validators.required,Validators.pattern(REGEX_RFC)]
      ],
      rfcExtranjero: [
        this.seccionState?.rfcExtranjero,
        Validators.required
      ]
      }),
      mercanciaST: this.fb.group({
      cveFraccionArancelaria: [
        this.seccionState?.cveFraccionArancelaria,
        Validators.required
      ],
      reglaFraccion: [
        this.seccionState?.reglaFraccion,
        Validators.required
      ],
      nico: [
        this.seccionState?.nico,
        Validators.required
      ],
      valorUSD: [
        this.seccionState?.valorUSD,
        Validators.required
      ],
      marca: [
        this.seccionState?.marca,
        Validators.required
      ],
      peso: [
        this.seccionState?.peso,
        [Validators.required,Validators.pattern(REGEX_DECIMAL_16_TOTAL)]
      ],
      fechaInicio: [
        this.seccionState?.fechaInicio,
        Validators.required
      ],
      numeroSerie: [
        this.seccionState?.numeroSerie,
        Validators.required
      ],
      descripcionMercancia: [
        this.seccionState?.descripcionMercancia,
        Validators.required
      ]
      }),
      direccionST: this.fb.group({
      informacionExtra: [
        this.seccionState?.informacionExtra,
        Validators.required
      ],
      entidadFederativa: [
        this.seccionState?.entidadFederativa,
        Validators.required
      ],
      delegacionMunicipio: [
        this.seccionState?.delegacionMunicipio,
        Validators.required
      ],
      colonia: [
        this.seccionState?.colonia,
        Validators.required
      ],
      calle: [
        this.seccionState?.calle,
        Validators.required
      ],
      numeroExterior: [
        this.seccionState?.numeroExterior,
        Validators.required
      ],
      numeroInterior: [
        this.seccionState?.numeroInterior,
        Validators.required
      ],
      codigoPostal: [
        this.seccionState?.codigoPostal,
        [ Validators.required,
          Validators.maxLength(5),
          Validators.pattern(/^\d{1,5}$/)]
      ]
      }),
      pedimentoST: this.fb.group({
      patenteAutorizacion: [
        this.seccionState?.patenteAutorizacion,
        [Validators.required, Validators.maxLength(4)]
      ],
      rfcAgenteAduanal: [
        this.seccionState?.rfcAgenteAduanal,
        [Validators.required, Validators.maxLength(12),Validators.pattern(REGEX_RFC)]
      ],
      numeroPedimento: [
        this.seccionState?.numeroPedimento,
        Validators.required
      ],
      claveAduana: [
        this.seccionState?.claveAduana,
        Validators.required
      ],
      informacionConfidencial:[
        this.seccionState?.informacionConfidencial,
        Validators.requiredTrue
      ]
      })
    });
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud.disable();
      this.esFormularioSoloLectura=true;
    } else {
      this.FormSolicitud.enable();
    }
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  public inicializaCatalogos(): void {

    this.obtenerFraccionesArancelariasCatalogo();
    this.obtenerEntidadFederativaCatalogo();
    this.obtenerFraccionReglas();
    this.obtenerAduanasActivas();
    this.obtenerDeclaracion();
  }
 


  

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup): void {
    console.log('Asignando valor ------');
    const VALORES = {
      razonSocial: this.extranjeroAvisoAgace.get('razonSocial')?.value,
      rfc: this.extranjeroAvisoAgace.get('rfc')?.value,
      rfcExtranjero: this.extranjeroAvisoAgace.get('rfcExtranjero')?.value,
      cveFraccionArancelaria: this.mercanciaST.get('cveFraccionArancelaria')?.value,
      reglaFraccion: this.mercanciaST.get('reglaFraccion')?.value,
      nico: this.mercanciaST.get('nico')?.value,
      valorUSD: this.mercanciaST.get('valorUSD')?.value,
      marca: this.mercanciaST.get('marca')?.value,
      peso: this.mercanciaST.get('peso')?.value,
      fechaInicio: this.mercanciaST.get('fechaInicio')?.value,
      numeroSerie: this.mercanciaST.get('numeroSerie')?.value,
      descripcionMercancia: this.mercanciaST.get('descripcionMercancia')?.value,
      informacionExtra: this.direccionST.get('informacionExtra')?.value,
      entidadFederativa: this.direccionST.get('entidadFederativa')?.value,
      delegacionMunicipio: this.direccionST.get('delegacionMunicipio')?.value,
      colonia: this.direccionST.get('colonia')?.value,
      calle: this.direccionST.get('calle')?.value,
      numeroExterior: this.direccionST.get('numeroExterior')?.value,
      numeroInterior: this.direccionST.get('numeroInterior')?.value,
      codigoPostal: this.direccionST.get('codigoPostal')?.value,
      patenteAutorizacion: this.pedimentoST.get('patenteAutorizacion')?.value,
      rfcAgenteAduanal: this.pedimentoST.get('rfcAgenteAduanal')?.value,
      numeroPedimento: this.pedimentoST.get('numeroPedimento')?.value,
      claveAduana: this.pedimentoST.get('claveAduana')?.value,
      adace: this.adaceForm.get('adace')?.value,
      informacionConfidencial: this.pedimentoST.get('informacionConfidencial')?.value,
      cve_declaracion: this.claveDeclaracion
    };
    this.tramite32502Store.establecerDatos(VALORES);
  }

/*
   * Establece los valores del formulario en el estado de la solicitud.
   *
   * @param formulario - El formulario del cual se obtienen los valores.
   * @param campo - El nombre del campo cuyo valor se desea establecer en el estado.
   *
   * Este método obtiene el valor del campo especificado en el formulario y lo establece
   * en el estado de la solicitud utilizando el store `solicitud32501Store`.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    if (campo === 'entidadFederativa') {
      this.obtenerMunicipiosCatalogo(VALOR)
      this.opcionColonia.catalogos = [];
      this.opcionColonia.primerOpcion = 'Seleccione un valor';
    } else if (campo === 'delegacionMunicipio') {
      this.obtenerColoniasCatalogo(VALOR);
    }

    this.tramite32502Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Verifica el formato del RFC ingresado en el formulario.
   * Si el RFC no cumple con el patrón esperado, se muestra una notificación de error.
   * @return {void}
   * Este método utiliza la propiedad `nuevaNotificacion` para configurar y mostrar la notificación.
   * La notificación indica que existen datos incorrectos que no cumplen con el formato esperado.
   * La notificación tiene una categoría de 'danger' y se muestra durante 3000 milisegundos.
   * El botón de aceptar en la notificación está etiquetado como 'Aceptar'.
   * 
   * @param {string} rfc - El RFC ingresado por el usuario.
   */
  verificarRFC(): void {
    
    if ((this.extranjeroAvisoAgace.get('rfc')?.errors?.['pattern'])) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
   
  }
  /**
   * Verifica el formato del RFC del agente aduanal ingresado en el formulario.
   * Si el RFC no cumple con el patrón esperado, se muestra una notificación de error.
   * @return {void}
   * Este método utiliza la propiedad `nuevaNotificacion` para configurar y mostrar la notificación.
   * La notificación indica que existen datos incorrectos que no cumplen con el formato esperado.
   * La notificación tiene una categoría de 'danger' y se muestra durante 3000 milisegundos.
   * El botón de aceptar en la notificación está etiquetado como 'Aceptar'.
   * 
   * @param {string} rfc - El RFC del agente aduanal ingresado por el usuario.
   */
  verificarRFCDos(): void {
   
    if ( this.pedimentoST.get('rfcAgenteAduanal')?.errors?.['pattern']) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }



  /**
   * Método para validar el formulario.
   * @returns void
   */
  validarFormulario(): void {
    if (this.FormSolicitud.invalid) {
      this.FormSolicitud.markAllAsTouched();
    }
  }

  /**
   * Cambia la fecha de ingreso a un nuevo valor.
   *
   * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
   * 
   * Este método actualiza el valor de 'fechaInicio' en el formulario 'mercanciaST',
   * marca el campo como no tocado y también actualiza la fecha de inicio en el 
   * store 'tramite32502Store'.
   */
  public cambioFechaDeIngreso(nuevo_valor: string): void {
    this.mercanciaST.patchValue({      
      fechaInicio: nuevo_valor
    });


    this.setValoresStore(this.mercanciaST);
  }

  /**
 * Inicializa el estado del formulario.
 * 
 * Este método evalúa si el formulario debe ser inicializado en modo solo lectura o en modo editable.
 * 
 * 1. Si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
 *    - Llama al método `guardarDatosFormulario` para cargar los datos y deshabilitar el formulario.
 * 
 * 2. Si el formulario no está en modo solo lectura:
 *    - Llama al método `obtenerDatosFormulario` para cargar los datos del estado actual.
 * 
 * Este método es útil para configurar el estado inicial del formulario y sincronizarlo
 * con los datos del estado global de la aplicación.
 * 
 * @returns {void}
 */
inicializarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.guardarDatosFormulario();
  } else {
    this.crearFormSolicitud();
  }
}
/**
 * Método para permitir solo números y un punto decimal en un campo de entrada.
 * @param event Evento de teclado que se dispara al presionar una tecla.
 * @return {void}
 * Este método previene la entrada de cualquier carácter que no sea un dígito del 0 al 9 o un punto decimal.
 * Se utiliza una expresión regular para verificar si el carácter ingresado es un número o un punto.
 * Si el carácter no es un número o un punto, se previene la acción predeterminada del evento.
 * @param {KeyboardEvent} event - Evento de teclado que se dispara al presionar una tecla.
 * @return {void}
 * */
permitirSoloNumerosDecimal(event: KeyboardEvent): void {
  const INPUT_CHAR = event.key;
  const VAL = (event.target as HTMLInputElement).value;
  const DATOS = this.esFormularioSoloLectura; 

  if (event.ctrlKey || event.metaKey || INPUT_CHAR === 'Backspace') 
    {return}

  const ISDIGIT = /^[0-9]$/.test(INPUT_CHAR);
  const ISDOT = INPUT_CHAR=== '.';

  // Only allow one dot
  if (ISDOT && VAL.includes('.')) {
    event.preventDefault();
    return;
  }

  // Block anything that's not a digit or a dot
  if (!ISDIGIT && !ISDOT) {
    event.preventDefault();
  }
}

/**
 * Método para permitir solo números en un campo de entrada.
 * @param event Evento de teclado que se dispara al presionar una tecla.
 * @return {void}
 * Este método previene la entrada de cualquier carácter que no sea un dígito del 0 al 9.
 * Se utiliza una expresión regular para verificar si el carácter ingresado es un número.
 * Si el carácter no es un número, se previene la acción predeterminada del evento.
 * @param {KeyboardEvent} event - Evento de teclado que se dispara al presionar una tecla.
 * @return {void}
 * */
permitirSoloNumeros(event: KeyboardEvent): void {
  const VAL = event.key;
  if (!/^\d$/.test(VAL)) {
    event.preventDefault();
  }
  const DATOS = this.esFormularioSoloLectura;
}


  /**
* Carga los datos del formulario y actualiza su estado.
* 
* Este método realiza las siguientes acciones:
* 
* 1. Llama al método `obtenerDatosFormulario` para cargar los datos del estado actual.
* 2. Llama al método `crearFormulario` para inicializar el formulario reactivo con los datos obtenidos.
* 3. Evalúa si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
*    - Si está en modo solo lectura, deshabilita el formulario utilizando el método `disable`.
*    - Si no está en modo solo lectura, habilita el formulario utilizando el método `enable`.
* 
* Este método es útil para sincronizar los datos del formulario con el estado global de la aplicación
* y configurar su estado (habilitado o deshabilitado) según corresponda.
* 
* @returns {void}
*/
guardarDatosFormulario(): void {
  this.crearFormSolicitud();
}


/**
   * Método para obtener las fracciones arancelarias requeridas para el trámite.
   */
  obtenerFraccionesArancelariasCatalogo(): void {

    this.avisoService.getFraccionArancelariaCatalogo()
      .pipe(takeUntil(this.destroyed$))
      .pipe(map(catFA => catFA.datos))
      .subscribe(
        datoFA => {
          this.opcionFraccionArancelaria.catalogos = datoFA;
        }
      );
  }

  /**
   * Método para obtener las entidades federativas.
   */
  obtenerEntidadFederativaCatalogo(): void {

    this.avisoService.obtenerEntidadesFederativas()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catEF => catEF.datos)
      ).subscribe(
        datoEF => {
          this.opcionEntidadFederativa.catalogos = datoEF;
        }
      );
  }

  /**
   * Método para solicitar los municipios.
   * @param clave Clave de la entidad federativa.
   */
  obtenerMunicipiosCatalogo(clave: string): void {

    this.avisoService.obtenerMunicipios(clave)
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catDM => catDM.datos)
      ).subscribe(
        datoDM => {
          this.opcionDelegacionMunicipio.catalogos = datoDM;
        }
      );
  }

  /**
   * Método para solicitar las colonias.
   * @param clave Clave del municipio.
   */
  obtenerColoniasCatalogo(clave: string): void {

    this.avisoService.obtenerColonias(clave)
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catColonias => catColonias.datos)
      ).subscribe(
        datoCol => {
          this.opcionColonia.catalogos = datoCol;
        }
      );
  }

  /**
   * Método para obtener Aduanas.
   */
  obtenerAduanasActivas(): void {

    this.avisoService.obtenerAduanas()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catAduanas => catAduanas.datos)
      ).subscribe(
        datoAduana => {
          this.opcionAduana.catalogos = datoAduana;
        }
      );
  }

  /**
   * Método para obtener Fraccion - Reglas.
   */
  obtenerFraccionReglas(): void {

    this.avisoService.getFraccionReglaCatalogo()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catReglas => catReglas.datos)
      ).subscribe(
        datoReglas => {
          this.opcionRegla422.catalogos = datoReglas;
        }
      );
  }

  /**
   * Método para obtener Declaracion.
   */
  obtenerDeclaracion(): void {

    this.avisoService.getDeclaracionTramite()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catDeclara => catDeclara.datos)
      ).subscribe(
        datoDeclaracion => {
          this.declaracion = datoDeclaracion[0].descripcion;
          this.claveDeclaracion = datoDeclaracion[0].clave;
        }
      );
  }
}
