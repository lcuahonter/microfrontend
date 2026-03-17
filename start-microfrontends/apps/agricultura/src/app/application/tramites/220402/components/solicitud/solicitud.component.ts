import { CommonModule } from '@angular/common';

import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';

import { map, startWith, takeUntil } from 'rxjs/operators';

import {
  Catalogo,
  CatalogoLista,
  ConsultaioQuery,
  ConsultaioState,
  InputFecha,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';

import {
  CatalogoSelectComponent,
  ConfiguracionColumna,
  FECHA_FINAL,
  FECHA_INICIO,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_SOLO_DIGITOS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';

import { CONFIGURATION_TABLA_GENERALES, CONFIGURATION_TABLA_MERCANCIA, RADIO_OPCIONS } from '../../constantes/certificado-zoosanitario.enum';
import { DatosGenerales, FraccionResponse, TablaMercancia } from '../../models/pantallas-captura.model';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';

import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';

import { Solicitud220402State, Solicitud220402Store } from '../../estados/tramites/tramites220402.store';

import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';


/**
 * Componente para la vista de la solicitud de la sección de "220402".
 */

@Component({
  selector: 'solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NotificacionesComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    TablaDinamicaComponent,
    InputRadioComponent
  ],
  providers: [ToastrService]
})

/**
 * Componente que representa la página de solicitud.
 */

export class SolicitudComponent implements OnInit, OnDestroy {
  /**
 * Indica el origen del flujo. Si es 'READ_PROCEDURE', se muestran tabs y vistas específicas para solo lectura.
 * Este valor se recibe como input desde el componente padre.
 */
  @Input() origin?: string;
  /**
   * Marca todos los campos del formulario principal y del modal como tocados para mostrar errores.
   */
  public markAllAsTouched(): void {
    if (this.FormSolicitud) {
      this.FormSolicitud.markAllAsTouched();
    }
    if (this.generalesMercanciaForm) {
      this.generalesMercanciaForm.markAllAsTouched();
    }
  }

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud220402State;

  /**
   * Fecha inicio de entrada.
   */
  fechaInicioInput: InputFecha = FECHA_INICIO;
  /**
    * @property {string} diaMinimo
    * @description Representa el día mínimo permitido para la selección de fechas en el formulario.
    */
  diaMinimo!: string;
  /**
   * Fecha final de entrada.
   */
  fechaFinalInput: InputFecha = FECHA_FINAL;

  /**
   * Formulario principal de la solicitud.
   */
  FormSolicitud!: FormGroup;

  // tipo de certificado
  tipoCertificado:string="";

  /**
   * Lista de catálogos de Seleccione una opción.
   */
  Opciones!: Catalogo[];

  /**
   * Lista de catálogos de Seleccione una opción.
   */
  seccionAduaneraLista!: Catalogo[];
  
  // Lista de catálogos de País de destino.
   paisLista!: Catalogo[];

   //unidad de verificacion
  unidadVerificationLista!: Catalogo[];

  //modulos fitosanitaria
  modulosFitosanitariaLista!: Catalogo[];

  //modulos tercero especialista
  terceroEspecialistaLista!: Catalogo[];

  //entidad federativa unidad expedidora
  getEntidadFederativaUnidadExpedidoraLista!: Catalogo[];

  // fitosanitario
  fitosanitarioLista!: Catalogo[];
  
  // Lista de catálogos de
  nombreComunLista!: Catalogo[];

   // Lista de catálogos de nombre clientifico
  nombreClientifioLista!: Catalogo[];

  // Lista de catálogos de unidad medida comercial
  UnidadMedidaCommercialLista!: Catalogo[];

  // Lista de catálogos de descripcion empaque
  descripcionEmpaqueLista!: Catalogo[];

   // Lista de catálogos de uso mercania
  usoMercaniaList!: Catalogo[];
  /**
 * Datos Generales de la Mercancía Exhibición de mesa.
 */
  datosGeneralesArr: DatosGenerales[] = [];
  /**
 * Origen Exhibición de mesa.
 */
  origenArr: TablaMercancia[] = [];
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Subscription} statusSubscription
   * @description Suscripción a los cambios de estado del formulario para actualizar el store.
   * @private
   */
  private statusSubscription!: Subscription;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;
  /**
   * Configuración de una nueva notificación.
   */
  public nuevaNotificacion!: Notificacion;
  /**
  * Opciones disponibles para el grupo de radio.
  */
  radioOpcions = RADIO_OPCIONS;
  /**
 * Configuración de las columnas de la tabla de datos generales.
 */
  configuracionTablaDatos: ConfiguracionColumna<DatosGenerales>[] = CONFIGURATION_TABLA_GENERALES;

  /**
   * Configuración del tipo de selección en la tabla (checkbox).
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Formulario para gestionar los datos de los destinatarios.
   */
  destinatarioForm!: FormGroup;

  /**
   * Formulario para gestionar los datos generales de la mercancía.
   */
  generalesMercanciaForm!: FormGroup;

  /**
   * Referencia al modal para los datos generales de la mercancía.
   */
  @ViewChild('modalGeneralesMercancia') modalGeneralesMercancia!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal de datos generales de la mercancía.
   */
  @ViewChild('closeGeneralesMercancia') public closeGeneralesMercancia!: ElementRef;

  /**
   * Configuración de las columnas de la tabla de mercancías.
   */
  configuracionTablaMercancia: ConfiguracionColumna<TablaMercancia>[] = CONFIGURATION_TABLA_MERCANCIA;

  /**
   * Lista de mercancías seleccionadas en la tabla.
   */
  seleccionarArr: TablaMercancia[] = [];

  /**
   * Opciones disponibles para los municipios.
   */
  municipiodeOpcions !: Catalogo[];
  /**
   * Lista de datos generales seleccionados en la tabla.
   */
  seleccionarDatosGeneralesArr: DatosGenerales[] = [];
  /**
   * Almacena el ID de la fila que se está editando. Si es nulo, indica que se está agregando una nueva fila.
   */
  idFilaSeleccionada: number | null = null;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param validacionesService Servicio para validaciones de formularios.
   * @param mediodetransporteService Servicio para obtener medios de transporte.
   * @param solicitud220402Store Almacén de estado para el trámite 220402.
   * @param solicitud220402Query Consulta de estado para el trámite 220402.
   * @param consultaioQuery Consulta de estado general del trámite.
   * @param cdr ChangeDetectorRef para detección de cambios manual.
   */
  constructor(
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private mediodetransporteService: MediodetransporteService,
    private solicitud220402Store: Solicitud220402Store,
    private solicitud220402Query: Solicitud220402Query,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método realiza las siguientes acciones:
   * 1. Inicializa los catálogos necesarios para el formulario.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.solicitud220402Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.cargarCatalogosDependientes();
        })
      )
      .subscribe();
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
    this.datosGeneralesArr = this.solicitudState?.datosGeneralesArr || [];
    // Inicializar el formulario principal
    this.crearFormSolicitud();
    this.crearFormGeneralesMercancia();

    this.datosMercancia.get('rangoDeFechas')?.valueChanges.pipe(
      startWith(this.datosMercancia.get('rangoDeFechas')?.value),
      takeUntil(this.destroyNotifier$)
    ).subscribe(isRango => {
      const FECTHAFINALCONTROL = this.datosMercancia.get('fechaFinal');
      if (isRango) {
        FECTHAFINALCONTROL?.setValidators([Validators.required, ValidacionesFormularioService.validaFechaNoHoy]);
      } else {
        FECTHAFINALCONTROL?.clearValidators();
        FECTHAFINALCONTROL?.setValue(null);
      }
      FECTHAFINALCONTROL?.updateValueAndValidity();
    });

    // Suscripción a los cambios de estado del formulario para actualizar el store de Akita.
    this.statusSubscription = this.FormSolicitud.statusChanges.subscribe(() => {
        this.solicitud220402Store.updateFormStatus('datosSolicitud', this.FormSolicitud.valid);
    });

    // Comprueba si se debe marcar el formulario como 'touched' al iniciar.
    if (this.solicitud220402Query.getValue().markAllAsTouched) {
        this.mostrarErrores();
    }
  }

  /**
   * Carga catálogos dependientes al iniciar el componente si ya existen valores en el estado.
   *
   * Este método se encarga de verificar si los campos de los que dependen otros catálogos
   * (como 'Unidad de Verificación' y 'Entidad Federativa') ya tienen un valor preseleccionado
   * en el estado de la solicitud. Si es así, invoca las llamadas al servicio para cargar
   * las listas de opciones de los campos dependientes ('Tercero Especialista' y 'Módulo Fitosanitario').
   * Esto asegura que los dropdowns se pueblen correctamente al volver a visitar el formulario.
   * @private
   * @returns {void}
   */
  private cargarCatalogosDependientes(): void {
    // Lógica para 'Tercero Especialista'
    if (this.solicitudState?.unidadDeVerificar) {
      this.mediodetransporteService
        .GetterceroEspecialista(this.solicitudState.unidadDeVerificar)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data: CatalogoLista): void => {
          this.terceroEspecialistaLista = data?.datos ? data.datos : [];
        });
    }

    // Lógica para 'Módulo Fitosanitario'
    if (this.solicitudState?.entidadFederative) {
      this.mediodetransporteService
        .getModulosFitosanitaria(this.solicitudState.entidadFederative)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data: CatalogoLista): void => {
          this.modulosFitosanitariaLista = data?.datos ? data.datos : [];
        });
    }
  }

  /**
* Obtiene el grupo de formulario 'datosDelTramiteRealizar' del formulario principal 'FormSolicitud'.
*
* @returns {FormGroup} El grupo de formulario 'datosDelTramiteRealizar'.
*/
  get datosDelTramiteRealizar(): FormGroup {
    return this.FormSolicitud.get('datosDelTramiteRealizar') as FormGroup;
  }

  /**
 * Obtiene el grupo de formulario 'datosMercancia' del formulario principal 'FormSolicitud'.
 *
 * @returns {FormGroup} El grupo de formulario 'datosMercancia'.
 */
  get datosMercancia(): FormGroup {
    return this.FormSolicitud.get('datosMercancia') as FormGroup;
  }

  /**
* Obtiene el grupo de formulario 'datosGenerales' del formulario principal 'FormSolicitud'.
*
* @returns {FormGroup} El grupo de formulario 'datosGenerales'.
*/
  get datosGenerales(): FormGroup {
    return this.generalesMercanciaForm.get('datosGenerales') as FormGroup;
  }


  /**
* Obtiene el grupo de formulario 'numeroDescDeLosEmpaques' del formulario principal 'FormSolicitud'.
*
* @returns {FormGroup} El grupo de formulario 'numeroDescDeLosEmpaques'.
*/
  get numeroDescDeLosEmpaques(): FormGroup {
    return this.generalesMercanciaForm.get('numeroDescDeLosEmpaques') as FormGroup;
  }

  /**
* Obtiene el grupo de formulario 'unidadDeVerificacion' del formulario principal 'FormSolicitud'.
*
* @returns {FormGroup} El grupo de formulario 'unidadDeVerificacion'.
*/
  get unidadDeVerificacion(): FormGroup {
    return this.FormSolicitud.get('unidadDeVerificacion') as FormGroup;
  }

  /**
  * Obtiene el grupo de formulario 'unidadExpedidoraFitosanitario' del formulario principal 'FormSolicitud'.
  *
  * @returns {FormGroup} El grupo de formulario 'unidadExpedidoraFitosanitario'.
  */
  get unidadExpedidoraFitosanitario(): FormGroup {
    return this.FormSolicitud.get('unidadExpedidoraFitosanitario') as FormGroup;
  }
  /**
   * Verifica si un campo específico en un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
     * Inicializa los catálogos necesarios para el formulario.
     */
  public inicializaCatalogos(): void {
    this.mediodetransporteService
      .AduanaDeSalida()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.seccionAduaneraLista = data?.datos ? data.datos : [];
      });

      this.mediodetransporteService
      .getPais()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.paisLista = data?.datos ? data.datos : [];
      });

      this.mediodetransporteService
      .getUnidadVerification()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.unidadVerificationLista = data?.datos ? data.datos : [];
      });

      this.mediodetransporteService
      .getEntidadFederativaUnidadExpedidora()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.getEntidadFederativaUnidadExpedidoraLista = data?.datos ? data.datos : [];
      });

      this.mediodetransporteService
      .getFitosanitario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.fitosanitarioLista = data?.datos ? data.datos : [];
      });

        this.mediodetransporteService
      .getNombreComun()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.nombreComunLista = data?.datos ? data.datos : [];
      });
      
       this.mediodetransporteService
      .getUnidadMedidaCommercial()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.UnidadMedidaCommercialLista = data?.datos ? data.datos : [];
      });      

      this.mediodetransporteService
      .getDescripcionEmpaque()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.descripcionEmpaqueLista = data?.datos ? data.datos : [];
      });      

        this.mediodetransporteService
      .getUsosMercania()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.usoMercaniaList = data?.datos ? data.datos : [];
      });      
  }

  /**
   * Carga el catálogo de terceros especialistas de acuerdo con la unidad de verificación seleccionada.
   *
   * Obtiene la clave de la unidad de verificación desde el formulario `unidadDeVerificacion`,
   */
  getTerceroEspecialistaLista(): void {
    const CVEUNIDAD = this.unidadDeVerificacion.get('unidadDeVerificar')?.value;
     this.mediodetransporteService
      .GetterceroEspecialista(CVEUNIDAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.terceroEspecialistaLista = data?.datos ? data.datos : [];
      });
  }



/**
 * Carga el catálogo de municipios de origen de acuerdo con la entidad federativa seleccionada.
 *
 * Obtiene la clave de la entidad federativa desde el formulario `datosGenerales`,
 * realiza la llamada al servicio correspondiente y asigna el resultado
 * al arreglo `municipiodeOpcions`.
 *
 * @returns {void}
 */
  cargarMunicipios(): void {
    const CVEENTIDAD = this.datosGenerales.get('entidadFederativadeOrigen')?.value;
    if(CVEENTIDAD){
 this.mediodetransporteService
      .getMunicipioDeOrigin(CVEENTIDAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.municipiodeOpcions = data?.datos ? data.datos : [];
      });  
    }
  }

  getModulosFitosanitariaLista(): void {
    const CVEUNIDAD = this.unidadExpedidoraFitosanitario.get('entidadFederative')?.value;
      this.mediodetransporteService
      .getModulosFitosanitaria(CVEUNIDAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.modulosFitosanitariaLista = data?.datos ? data.datos : [];
      });

  }

  /**
   * Crea el formulario de solicitud.
   * @return {void} No retorna ningún valor.
   */
  crearFormSolicitud(): void {
    this.FormSolicitud = this.fb.group({
      datosDelTramiteRealizar: this.fb.group({
        tipoDeCertificado: [this.solicitudState?.tipoDeCertificado, [Validators.required]],
        seccionAduanera: [this.solicitudState?.seccionAduanera, [Validators.required]],
        puntoDestino: [this.solicitudState?.puntoDestino, [Validators.required, Validators.maxLength(245)]],
        paisDeDestino: [this.solicitudState?.paisDeDestino, [Validators.required]],
        paisDeProcedencia: ['MEX', [Validators.required]]
      }),
      datosMercancia: this.fb.group({
        rangoDeFechas: [this.solicitudState?.rangoDeFechas],
        fechaInicio: [
          this.solicitudState?.fechaInicio,
          [Validators.required, ValidacionesFormularioService.validaFechaNoHoy],
        ],
        fechaFinal: [
          this.solicitudState?.fechaFinal,
          [ValidacionesFormularioService.validaFechaNoHoy],
        ]
      }),
      unidadDeVerificacion: this.fb.group({
        unidadDeVerificar: [this.solicitudState?.unidadDeVerificar, [Validators.required]],
        terceroEspecialista: [this.solicitudState?.terceroEspecialista, [Validators.required]]
      }),
      unidadExpedidoraFitosanitario: this.fb.group({
        entidadFederative: [this.solicitudState?.entidadFederative, [Validators.required]],
        fitosanitario: [this.solicitudState?.fitosanitario, [Validators.required]]
      })
    });
    this.inicializarEstadoFormulario();
  }
  /**
   * Crea el formulario para gestionar los datos generales de la mercancía.
   * 
   * Este formulario incluye los siguientes grupos de controles:
   * - `datosGenerales`: Contiene campos como nombre común, nombre científico, descripción del producto,
   *   fracción arancelaria, cantidades, unidades de medida, país de origen, entre otros.
   * - `numeroDescDeLosEmpaques`: Contiene campos para el número y la descripción de los empaques.
   * 
   * Los campos incluyen validaciones como requeridos, patrones específicos y longitudes máximas.
   */
  crearFormGeneralesMercancia(): void {
    this.generalesMercanciaForm = this.fb.group({
      datosGenerales: this.fb.group({
        nombreComun: [this.solicitudState?.nombreComun, [Validators.required]],
        nombreCientifico: [this.solicitudState?.nombreCientifico, [Validators.required]],
        descripcionProducto: [this.solicitudState?.descripcionProducto, [Validators.required]],
        fraccionArancelaria: [this.solicitudState?.fraccionArancelaria, [Validators.pattern(REGEX_SOLO_DIGITOS), Validators.minLength(8), Validators.maxLength(8)]],
        descdelaFraccion: [{ value: this.solicitudState?.descdelaFraccion, disabled: true }, []],
        cantidadUMT: [{ value: this.solicitudState?.cantidadUMT }, []],
        UMT: [{ value: this.solicitudState?.UMT, disabled: true }, []],
        cantidadUMC: [this.solicitudState?.cantidadUMC, [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX_SOLO_DIGITOS)]],
        UMC: [this.solicitudState?.UMC, [Validators.required]],
        paisdeOrigen: [this.solicitudState?.paisdeOrigen, [Validators.required]],
        entidadFederativadeOrigen: [this.solicitudState?.entidadFederativadeOrigen, []],
        municipiodeOrigen: [this.solicitudState?.municipiodeOrigen, []],
        marcasDistintivas: [this.solicitudState?.marcasDistintivas, [Validators.maxLength(60)]],
        USO: [this.solicitudState?.USO, [Validators.required]]
      }),
      numeroDescDeLosEmpaques: this.fb.group({
        numero: [this.solicitudState?.numero, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        empaques: [this.solicitudState?.empaques, [Validators.required]]
      })
    });
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Configura el estado del formulario `FormSolicitud` según el modo de solo lectura.
   * 
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles del formulario.
   * 
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.FormSolicitud?.disable();
    } else {
      this.FormSolicitud?.enable();
    }
  }
  /**
   * Método para cambiar la fecha incio.
   * @param nuevo_valor Nuevo valor de la fecha incio.
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.datosMercancia.get('fechaInicio')?.setValue(nuevo_valor);
    this.datosMercancia.get('fechaInicio')?.markAsUntouched();
  }

  /**
   * Método para cambiar la fecha final.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.datosMercancia.get('fechaFinal')?.setValue(nuevo_valor);
    this.datosMercancia.get('fechaFinal')?.markAsUntouched();
  }

  /**
   * Método para eliminar una mercancía de la lista.
   * @param {number} i - Índice de la mercancía a eliminar.
   * @returns {void}
   */
  mercanciaBorrar(i: number): void {
    this.datosGeneralesArr.splice(i, 1);
  }


  /**
   * @method municipioAgregar
   * @description Este método actualiza las propiedades `federativaOrigen` y `origenArr` 
   * basándose en los valores obtenidos de los controles del formulario `datosGenerales`.
   * 
   * - `federativaOrigen` se establece con el valor del control `entidadFederativadeOrigen` 
   *   o 'NA' si el control no tiene valor.
   * - `origenArr` se establece con el valor del control `municipiodeOrigen` 
   *   o un arreglo vacío si el control no tiene valor.
   */
municipioAgregar(): void {
    const ENTIDADCONTROL = this.datosGenerales.get('entidadFederativadeOrigen');
    const MUNICIPIOCONTROL = this.datosGenerales.get('municipiodeOrigen');

    ENTIDADCONTROL?.markAsTouched();
    MUNICIPIOCONTROL?.markAsTouched();

    if (ENTIDADCONTROL?.invalid || MUNICIPIOCONTROL?.invalid) {
      return;
    }

    if (!ENTIDADCONTROL?.value || !Array.isArray(MUNICIPIOCONTROL?.value) || MUNICIPIOCONTROL.value.length === 0) {
      return;
    }

    const ENTIDADCLAVE: string = ENTIDADCONTROL.value;

    const ENTIDADLABEL =
      this.getEntidadFederativaUnidadExpedidoraLista
        .find(OPT => OPT.clave === ENTIDADCLAVE)?.descripcion ?? '';

    if (!ENTIDADLABEL) {
      return;
    }

    const MUNICIPIOSSELECCIONADOS: string[] = MUNICIPIOCONTROL.value;

    const NUEVASFILAS: TablaMercancia[] = MUNICIPIOSSELECCIONADOS
      .map(MUNICIPIOCLAVE => {
        const MUNICIPIOLABEL =
          this.municipiodeOpcions
            .find(OPT => OPT.clave === MUNICIPIOCLAVE)?.descripcion ?? '';

        if (!MUNICIPIOLABEL) {
          return null;
        }

        const EXISTE = this.origenArr.some(
          FILA =>
            FILA.federativaOrigen === ENTIDADCLAVE &&
            FILA.origen === MUNICIPIOCLAVE
        );

        return EXISTE
          ? null
          : {
            id: 0,

            federativaOrigen: ENTIDADCLAVE,
            federativaOrigenLabel: ENTIDADLABEL,

            origen: MUNICIPIOCLAVE,
            origenLabel: MUNICIPIOLABEL
          };
      })
      .filter((FILA): FILA is TablaMercancia => FILA !== null);

    if (!NUEVASFILAS.length) {
      return;
    }

    let MAXID =
      this.origenArr.length > 0
        ? Math.max(...this.origenArr.map(O => O.id))
        : 0;

    NUEVASFILAS.forEach(FILA => (FILA.id = ++MAXID));

    this.origenArr = [...this.origenArr, ...NUEVASFILAS];
  }

  /**
   * Selecciona los datos de mercancías desde el evento.
   * 
   * Este método actualiza la lista de mercancías seleccionadas en la tabla.
   * 
   * @param {TablaMercancia[]} evento - Lista de mercancías seleccionadas.
   */
  seleccionarDatos(evento: TablaMercancia[]): void {
    this.seleccionarArr = evento;
  }
  /**
   * Selecciona los datos generales desde el evento.
   * 
   * Este método actualiza la lista de datos generales seleccionados en la tabla.
   * 
   * @param {DatosGenerales[]} evento - Lista de datos generales seleccionados.
   */
  seleccionarTabla(evento: DatosGenerales[]): void {
    this.seleccionarDatosGeneralesArr = evento;
  }

  /**
   * Método para eliminar un municipio del arreglo `origenArr`.
   * 
   * Este método obtiene el valor del control `municipiodeOrigen` del formulario `datosGenerales`
   * y filtra el arreglo `origenArr` para eliminar cualquier elemento que coincida con dicho valor.
   * 
   * @returns {void}
   */
  municipioEliminar(): void {
     if (!this.seleccionarArr.length) {
    this.origenArr = [];
    return;
  }

  this.origenArr = this.origenArr.filter(
    EL => !this.seleccionarArr.some(SEL => SEL.id === EL.id)
  );

  this.origenArr = this.origenArr.map((EL, INDEX) => ({
    ...EL,
    id: INDEX + 1
  }));

  this.seleccionarArr = [];
  }
  /**
   * Elimina los datos generales seleccionados de la lista.
   * 
   * Este método filtra la lista `datosGeneralesArr` para eliminar los elementos que coincidan
   * con los datos seleccionados en `seleccionarDatosGeneralesArr`.
   */
  eliminar(): void {
    this.datosGeneralesArr = this.datosGeneralesArr.filter(el => !this.seleccionarDatosGeneralesArr.some(seleccionada => seleccionada.id === el.id));
  }
  /**
   * Modifica los datos generales seleccionados en el formulario.
   * 
   * Este método verifica si hay datos seleccionados en `seleccionarDatosGeneralesArr`, y si es así:
   * - Llama al método `agregar` para abrir el modal.
   * - Obtiene el primer elemento seleccionado y busca las descripciones correspondientes en las opciones disponibles.
   * - Actualiza los valores del formulario `generalesMercanciaForm` con los datos seleccionados.
   */
 modificar(): void {
  if (!this.seleccionarDatosGeneralesArr.length) {return;}

  const VALOR = this.seleccionarDatosGeneralesArr[0];
  this.idFilaSeleccionada = VALOR.id;
  this.origenArr = VALOR.origenes || [];

  this.agregar(); // must only add controls

  this.generalesMercanciaForm.patchValue(
    {
      datosGenerales: {
        nombreComun: VALOR.nombreComun,
        nombreCientifico: VALOR.nombreCientifico,
        descripcionProducto: VALOR.descripcionProducto,
        fraccionArancelaria: VALOR.fraccionArancelaria,
        descdelaFraccion: VALOR.descdelaFraccion,
        cantidadUMT: VALOR.cantidadUMT,
        UMT: VALOR.UMT,
        cantidadUMC: VALOR.cantidadUMC,
        entidadFederativadeOrigen: VALOR.entidadFederativadeOrigen,
        UMC: VALOR.UMC,
        paisdeOrigen: VALOR.paisdeOrigen,
        marcasDistintivas: VALOR.marcasDistintivas,
        USO: VALOR.USO
      },
      numeroDescDeLosEmpaques: {
        numero: VALOR.numero,
        empaques: VALOR.empaques
      }
    },
    { emitEvent: false }
  );

  this.generalesMercanciaForm.updateValueAndValidity({ emitEvent: false });
  this.cargarMunicipios();
  this.fraccionArancelariaActualizar();
  this.getNombreCientifico(VALOR.nombreComun);
}

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud220402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud220402Store[metodoNombre] as (value: unknown) => void)(VALOR);

    if(campo==='nombreComun'){
 this.getNombreCientifico(VALOR);
    }
  }

  getNombreCientifico(value:string): void {
         this.mediodetransporteService
      .getNombreClint(value)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CatalogoLista): void => {
        this.nombreClientifioLista = data?.datos ? data.datos : [];
      });    
  }

  /**
   * @method changeFechaFinal
   * @description Actualiza la validez del formulario y establece la fecha final en el store.
   */
  changeFechaFinal(): void {
    this.datosMercancia.updateValueAndValidity();
    this.setValoresStore(this.datosMercancia, 'fechaFinal', 'setFechaFinal');
  }

  /**
   * Verifica si hay un error de intervalo de fecha en los datos del servicio.
   * @returns {boolean} - `true` si hay un error de intervalo de fecha y el campo ha sido tocado, de lo contrario `false`.
   */
  intervaloFechaError(): boolean {
    return (
      this.datosMercancia.hasError('invalidIntervalo') &&
      this.datosMercancia.touched
    );
  }

  /**
   * Maneja el cambio de tipo de certificado.
   * 
   * Este método muestra un modal de confirmación al usuario, indicando que al cambiar el tipo de certificado
   * se eliminarán las mercancías registradas. Solicita confirmación para proceder con el cambio.
   */
  tipoDeCertificadoCambio(): void {
    if (!this.solicitudState?.tipoDeCertificado) {
      this.setValoresStore(this.datosDelTramiteRealizar, 'tipoDeCertificado', 'setTipoDeCertificado');
      this.tipoCertificado= this.datosDelTramiteRealizar.get('tipoDeCertificado')?.value;
    } else {
      this.abrirModal(
        'Aceptar',
        'Cancelar',
        'Al cambiar de tipo certificado se eliminarán las mercancías registradas ¿Estás seguro de cambiar de certificado?'
      );
    }
  }

  /**
   * Abre un modal con los parámetros proporcionados.
   * 
   * Este método configura y muestra un modal con el mensaje, botones y configuración especificados.
   * 
   * @param {string} txtBtnAceptar - Texto del botón de aceptación.
   * @param {string} txtBtnCancelar - Texto del botón de cancelación.
   * @param {string} mensaje - Mensaje que se mostrará en el modal.
   */
  public abrirModal(txtBtnAceptar = '', txtBtnCancelar = '', mensaje = ''): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      tamanioModal: 'modal-lg',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar,
    };
  }

  /**
   * Maneja la confirmación del modal.
   * 
   * Este método realiza acciones dependiendo de la respuesta del usuario en el modal de confirmación.
   * Si el usuario no acepta, se limpia el valor del tipo de certificado en el formulario.
   * 
   * @param {boolean} aceptar - Indica si el usuario aceptó la acción en el modal.
   */
  confirmacionModal(aceptar: boolean): void {
    if (!aceptar) {
      this.FormSolicitud.get('datosDelTramiteRealizar.tipoDeCertificado')?.setValue(this.solicitudState?.tipoDeCertificado);
    } else {
      this.setValoresStore(this.datosDelTramiteRealizar, 'tipoDeCertificado', 'setTipoDeCertificado');
    }
  }
  /**
   * Muestra el modal para agregar datos generales de la mercancía.
   * 
   * Este método utiliza el modal `modalGeneralesMercancia` para mostrar el formulario
   * de datos generales de la mercancía.
   */
  agregar(): void {
    if (this.modalGeneralesMercancia) {
      this.tipoCertificado =
      this.datosDelTramiteRealizar.get('tipoDeCertificado')?.value;
this.generalesMercanciaForm.reset();
    this.actualizarValidacionesPorTipo(this.tipoCertificado);
      const MODAL_INSTANCE = new Modal(this.modalGeneralesMercancia.nativeElement);
      MODAL_INSTANCE.show();
    }
  }
  
  /**
 * Actualiza las validaciones y el estado de los campos
 * de acuerdo con el tipo de certificado seleccionado.
 *
 * - Si el tipo es "exportacion":
 *   - Habilita entidad federativa y municipio
 *   - Marca ambos campos como requeridos
 *   - Asigna el país de origen como México (MEX)
 *
 * - Para cualquier otro tipo:
 *   - Limpia validaciones
 *   - Resetea valores
 *   - Deshabilita los campos
 *
 * @param {string} tipoCertificado Tipo de certificado seleccionado
 * @returns {void}
 */
  private actualizarValidacionesPorTipo(tipoCertificado: string): void {
  const DATOSGENERALES = this.generalesMercanciaForm.get('datosGenerales') as FormGroup;

  const ENTIDADCTRL = DATOSGENERALES.get('entidadFederativadeOrigen');
  const MUNCIPIOCTRL = DATOSGENERALES.get('municipiodeOrigen');
  const PAISDEORIGEN= DATOSGENERALES.get('paisdeOrigen');

  if (tipoCertificado === 'EXPORTACION') {
    ENTIDADCTRL?.enable();
    MUNCIPIOCTRL?.enable();
    PAISDEORIGEN?.setValue('MEX');
    ENTIDADCTRL?.setValidators([Validators.required]);
    MUNCIPIOCTRL?.setValidators([Validators.required]);

  } else {
    ENTIDADCTRL?.clearValidators();
    MUNCIPIOCTRL?.clearValidators();

    ENTIDADCTRL?.reset();
    MUNCIPIOCTRL?.reset();

    ENTIDADCTRL?.disable();
    MUNCIPIOCTRL?.disable();
  }

  ENTIDADCTRL?.updateValueAndValidity();
  MUNCIPIOCTRL?.updateValueAndValidity();
}
  /**
   * Agrega los datos generales de la mercancía al arreglo `datosGeneralesArr`.
   * 
   * Este método valida el formulario `generalesMercanciaForm` y, si es válido:
   * - Obtiene los valores del formulario.
   * - Busca las descripciones correspondientes en las opciones disponibles.
   * - Agrega los datos al arreglo `datosGeneralesArr`.
   * - Cierra el modal de datos generales de la mercancía.
   */
  agregarModel(): void {
    this.generalesMercanciaForm.markAllAsTouched();
    if(this.generalesMercanciaForm.valid){
    const VALOR = this.generalesMercanciaForm.getRawValue();
    const UMC: string = this.UnidadMedidaCommercialLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.UMC)?.clave || '';
    const UMCLABEL: string = this.UnidadMedidaCommercialLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.UMC)?.descripcion || '';
    const PAISDEORIGEN: string = this.paisLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.paisdeOrigen)?.clave || '';
    const PAISDEORIGENLABEL: string = this.paisLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.paisdeOrigen)?.descripcion || '';
    const NOMBRECOMUN: string = this.nombreComunLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.nombreComun)?.clave || '';
    const NOMBRECOMUNLABEL: string = this.nombreComunLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.nombreComun)?.descripcion || '';
    const NOMBRECIENTIFICO: string = this.nombreClientifioLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.nombreCientifico)?.clave || '';
    const NOMBRECIENTIFICOLABEL: string = this.nombreClientifioLista.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.nombreCientifico)?.descripcion || '';
    const USO: string = this.usoMercaniaList.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.USO)?.clave || '';
    const USOLABEL: string = this.usoMercaniaList.find(opt => opt?.clave?.toString() === VALOR.datosGenerales.USO)?.descripcion || '';
    const EMPAQUES: string = this.descripcionEmpaqueLista.find(opt => opt?.clave?.toString() === VALOR.numeroDescDeLosEmpaques.empaques)?.clave || '';
    const EMPAQUESLABEL: string = this.descripcionEmpaqueLista.find(opt => opt?.clave?.toString() === VALOR.numeroDescDeLosEmpaques.empaques)?.descripcion || '';
    
    const MERCANCIAACTUALIZADA = {
      id: this.idFilaSeleccionada !== null ? this.idFilaSeleccionada : this.datosGeneralesArr.length + 1,
      fraccionArancelaria: VALOR.datosGenerales.fraccionArancelaria,
      descdelaFraccion: VALOR.datosGenerales.descdelaFraccion,
      cantidadUMT: VALOR.datosGenerales.cantidadUMT,
      UMT: VALOR.datosGenerales.UMT,
      cantidadUMC: VALOR.datosGenerales.cantidadUMC,
      UMC: UMC,
      UMCLabel: UMCLABEL,
      descripcionProducto: VALOR.datosGenerales.descripcionProducto,
      nombreComun: NOMBRECOMUN,
      nombreComunLabel: NOMBRECOMUNLABEL,
      nombreCientifico: NOMBRECIENTIFICO,
      nombreCientificoLabel: NOMBRECIENTIFICOLABEL,
      USO: USO,
      USOlabel: USOLABEL,
      paisdeOrigen: PAISDEORIGEN,
      paisdeOrigenLabel: PAISDEORIGENLABEL,
      marcasDistintivas: VALOR.datosGenerales.marcasDistintivas,
      numero: VALOR.numeroDescDeLosEmpaques.numero,
      empaques: EMPAQUES,
      empaquesLabel: EMPAQUESLABEL,
      origenes: this.origenArr,
      entidadFederativadeOrigen: VALOR.datosGenerales.entidadFederativadeOrigen
    };

    if (this.idFilaSeleccionada !== null) {
      // Modo Edición
      const INDEX = this.datosGeneralesArr.findIndex(item => item.id === this.idFilaSeleccionada);
      if (INDEX !== -1) {
        this.datosGeneralesArr[INDEX] = MERCANCIAACTUALIZADA;
        this.datosGeneralesArr = [...this.datosGeneralesArr]; // Forzar detección de cambios
      }
    } else {
      // Modo Agregar
      this.datosGeneralesArr = [...this.datosGeneralesArr, MERCANCIAACTUALIZADA];
    }
    this.solicitud220402Store.setDatosGeneralesArr(this.datosGeneralesArr);
    this.generalesMercanciaForm.reset({});
    this.municipiodeOpcions = [];
    this.closeGeneralesMercancia.nativeElement.click();
    this.limpiar();
  }
  }
  /**
   * Limpia el formulario de datos generales de la mercancía.
   * 
   * Este método reinicia el formulario `generalesMercanciaForm` y vacía el arreglo `origenArr`.
   */
  limpiar(): void {
    this.generalesMercanciaForm.reset({});
    this.origenArr = [];
    this.idFilaSeleccionada = null;
  }
  /**
   * Actualiza los valores de la fracción arancelaria en el formulario.
   * 
   * Este método verifica si el campo `fraccionArancelaria` es válido y, si es así:
   * - Establece valores predeterminados para `descdelaFraccion` y `UMT`.
   * - Si no es válido, limpia los valores de estos campos.
   */
  fraccionArancelariaActualizar(): void {
    if (this.datosGenerales.get('fraccionArancelaria')?.valid) {
        this.mediodetransporteService
      .getFraccionArancelaria(this.datosGenerales.get('fraccionArancelaria')?.value)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: FraccionResponse): void => {
         this.datosGenerales.get('descdelaFraccion')?.setValue(data.datos.descripcion);
      this.datosGenerales.get('UMT')?.setValue(data.datos.umt_descripcion);
      this.datosGenerales.get('cantidadUMT')?.setValue(data.datos.umt_clave);
      });     
     
    } else {
      this.datosGenerales.get('descdelaFraccion')?.setValue('');
      this.datosGenerales.get('UMT')?.setValue('');
      this.datosGenerales.get('cantidadUMT')?.setValue('');
    }
  }


  /**
   * Este método se utiliza para destruir la suscripción.
   * @returns destroyNotifier$
   */
  ngOnDestroy(): void {
    // Asegura que el último estado de validez se guarde en el store antes de destruir el componente.
    this.solicitud220402Store.updateFormStatus('datosSolicitud', this.FormSolicitud.valid);

    // Cancela la suscripción a los cambios de estado para evitar fugas de memoria.
    if (this.statusSubscription) {
        this.statusSubscription.unsubscribe();
    }

    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Muestra los errores del formulario principal marcando todos los campos como tocados.
   * 
   * Este método es útil para activar la visualización de errores de validación en el formulario.
   * Se asegura de que todos los campos del formulario principal sean marcados como tocados,
   * lo que desencadena la visualización de mensajes de error para los campos inválidos.
   * 
   * @returns {void}
   */
  public mostrarErrores():void {
    this.FormSolicitud?.markAllAsTouched?.();
    this.cdr.detectChanges();
  }

}