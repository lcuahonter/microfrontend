import { AlphaNumericOnlyDirective } from '@libs/shared/data-access-user/src/tramites/directives/alpha-numeric-only/alpha-numeric-only.directive';
/**
 * Importaciones necesarias para el componente de empresas.
 * Incluye servicios, modelos, componentes compartidos y decoradores de Angular.
 */
import {
  Catalogo,
  CatalogosService,
  EMAIL,
  InputFecha,
  InputFechaComponent,
  NotificacionesComponent,
  REGEX_RFC,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  UppercaseDirective,
  ValidacionesFormularioService,
  WEBPAGE,
} from '@libs/shared/data-access-user/src';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  DatosComplimentos,
  SociaoAccionistas,
} from '../../models/complimentos.model';
import {
  ESTADO,
  FECHA_DE_PAGO,
  FORMA_SOCIO,
  FORMA_SOCIO_ACCIONISTAS,
  FORMA_SOCIO_ACCIONISTAS_EXTRANJEROS,
  PAIS,
  TABLA_SOCIO_ACCIONISTAS,
  TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS,
  TIPO_FORMA,
} from '../../constantes/complimentos.enum';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, Subscription, delay, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../services/complimentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Notificacion } from '@ng-mf/data-access-user';

import { DatosCatalago, INPUT_FECHA_CONFIG, INPUT_FECHA_CONFIGURACION } from '../../../tramites/80102/models/autorizacion-programa-nuevo.model';
import { CatalogoPaises } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { SelectPaisesComponent } from '@libs/shared/data-access-user/src/tramites/components/select-paises/select-paises.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TramiteStore } from '../../../estados/tramite.store';
import moment from 'moment';
/**
 * Componente Complimentos.
 * Responsable de mostrar y gestionar los datos relacionados a los complimentos.
 * Utiliza módulos comunes, formularios reactivos y componentes compartidos.
 */
@Component({
  selector: 'app-complimentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TituloComponent,
    CatalogoSelectComponent,
    SelectPaisesComponent,
    InputFechaComponent,
    NotificacionesComponent,
    AlphaNumericOnlyDirective,
    UppercaseDirective
  ],
  templateUrl: './complimentos.component.html',
  styleUrl: './complimentos.component.scss',
})
/**
 * Clase ComplimentosComponent.
 * Gestiona la lógica del componente Complimentos, incluyendo inicialización y limpieza.
 */
export class ComplimentosComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  @Input() consultaState!: ConsultaioState;


  /**
   * property {Catalogo[]} derechosList - Lista de derechos obtenida del servicio.
   */
  public derechosList!: Catalogo[];

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @type {FormGroup}
   * @description Grupo de formularios para los complementos.
   */
  formaComplimentos!: FormGroup;

  /**
  * Constante para configurar el input de fecha.
  * Define las propiedades del campo de entrada de fecha.
  */
  INPUT_FECHA_CONFIG = INPUT_FECHA_CONFIG;

  /**
 * Constante para configurar el input de fecha.
 * Define las propiedades del campo de entrada de fecha.
 */
  INPUT_FECHA_CONFIGURACION = INPUT_FECHA_CONFIGURACION;

  /**
   * @type {Catalogo[]}
   * @description lista de catálogos.
   */
  estados!: Catalogo[];

  /**
   * @description
   * Objeto que representa una nueva notificación para RFC.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacionRfc!: Notificacion;

  /**
   * Flag to track if we're currently processing RFC validation
   * Prevents interference from other form events
   */
  private isProcessingRfcValidation: boolean = false;

  /**
   * @type {Subscription}
   * @description Suscripción privada inicializada como una nueva suscripción.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Storage for form data to preserve across radio button changes
   */
  private PRESERVED_FORM_DATA: { [key: string]: string | number | boolean } = {};

  /**
   * @type {DatosCatalago[]}
   * @description Campos del formulario por defecto para los socios accionistas.
   */
  camposFormularioDefault: DatosCatalago[] = FORMA_SOCIO_ACCIONISTAS;

  /**
   * @type {any}
   * @description Campos del formulario para la nacionalidad.
   */
  camposFormularioNationalidad = FORMA_SOCIO;

  /**
   * @type {any}
   * @description Campos del formulario para el tipo de persona.
   */
  camposFormularioTipoPersona = FORMA_SOCIO_ACCIONISTAS_EXTRANJEROS;

  /**
   * @type {DatosCatalago[]}
   * @description Campos del formulario para los socios accionistas.
   */
  camposFormulario: DatosCatalago[] = FORMA_SOCIO_ACCIONISTAS;

  /**
   * @type {any}
   * @description Tipo de formulario por defecto.
   */
  tipoFormulario = TIPO_FORMA.DEFAULT;

  /**
   * @type {DatosComplimentos | null}
   * @description Datos de los complementos del formulario.
   */
  @Input() datosFormaComplimentos!: DatosComplimentos | null;

  /**
   * @type {SociaoAccionistas[]}
   * @description Datos de los socios accionistas.
   */
  @Input() datosSocioAccionistas: SociaoAccionistas[] = [];

  /**
   * @type {SociaoAccionistas[]}
   * @description Datos de los socios accionistas extranjeros.
   */
  @Input() datosSocioAccionistasExtrenjeros: SociaoAccionistas[] = [];

  /**
   * @type {any}
   * @description Tabla de socios accionistas.
   */
  tablaSociaAccionistas = TABLA_SOCIO_ACCIONISTAS;

  /**
   * @type {any}
   * @description Tabla de socios accionistas extranjeros.
   */
  tablaSociaAccionistasExtranjeros = TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS;

  /**
   * @type {any}
   * @description Selección de tabla.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * @type {SociaoAccionistas[]}
   * @description Lista de socios accionistas seleccionados.
   */
  empresaAccionistasSeleccionados: SociaoAccionistas[] = [];

  /**
   * @type {SociaoAccionistas[]}
   * @description Lista de accionistas extranjeros seleccionados.
   */
  accionistasExtranjerosSeleccionados: SociaoAccionistas[] = [];

  /**
   * @type {EventEmitter<DatosComplimentos>}
   * @description Emisor de eventos para los datos de complementos.
   */
  @Output()
  complimentosDatos: EventEmitter<DatosComplimentos> =
    new EventEmitter<DatosComplimentos>(true);

  /**
   * @type {EventEmitter<SociaoAccionistas>}
   * @description Emisor de eventos para los accionistas agregados.
   */
  @Output() accionistasAgregados: EventEmitter<SociaoAccionistas> =
    new EventEmitter<SociaoAccionistas>(true);

  /**
   * @type {EventEmitter<SociaoAccionistas[]>}
   * @description Emisor de eventos para los accionistas eliminados.
   */
  @Output() accionistasEliminados: EventEmitter<SociaoAccionistas[]> =
    new EventEmitter<SociaoAccionistas[]>(true);

  /**
   * @type {EventEmitter<SociaoAccionistas[]>}
   * @description Emisor de eventos para los accionistas extranjeros eliminados.
   */
  @Output() accionistasExtranjerosEliminado: EventEmitter<SociaoAccionistas[]> =
    new EventEmitter<SociaoAccionistas[]>(true);

  /**
   * Emisor de eventos para indicar si el formulario es válido.
   * @type {EventEmitter<boolean>}
   */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;

  /**
  * @description
  * Objeto que representa una nueva notificación.
  * Se utiliza para mostrar mensajes de alerta o información al usuario.
  */
  public eliminarNotificacion!: Notificacion;

  /**
  * @description
  * Objeto que representa una nueva notificación.
  * Se utiliza para mostrar mensajes de alerta o información al usuario.
  */
  public eliminarUnoConfirmationNotificacion!: Notificacion;

  /**
* @description
* Objeto que representa una nueva notificación.
* Se utiliza para mostrar mensajes de alerta o información al usuario.
*/
  public eliminarDosConfirmationNotificacion!: Notificacion;

  /**
   * Configuración del input de fecha de inicio
   * @property {InputFecha} fechaInicioInput
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
* Obtiene el número total de socios accionistas registrados en el formulario.
* @returns {number} Total de socios accionistas. 
*/
  get totalItemsDatosSocioAccionistas(): number {
    return this.datosSocioAccionistas.length;
  }

  /**
* Obtiene el número total de socios accionistas registrados en el formulario.
* @returns {number} Total de socios accionistas. 
*/
  get totalItemsDatosSocioAccionistasExtranjeros(): number {
    return this.datosSocioAccionistasExtrenjeros.length;
  }

  /**
   * Stores the list of country catalog data used within the component.
   * Each entry represents a country and its associated information.
   */
  paisDatos: CatalogoPaises[] = [];

  /**
   * Notificación relacionada con accionistas extranjeros.
   * Se utiliza para mostrar mensajes o alertas específicas en la interfaz.
   */
  public accionistasExtranjerosNotificacion!: Notificacion;

  /**
   * Notificación relacionada con el correo electrónico.
   * Se utiliza para mostrar mensajes o alertas específicas en la interfaz.
   */
  public nuevaNotificacionCorreo!: Notificacion;

  /**
   * Notificación relacionada con RFC.
   */
  public nuevaNotificacionRfcDel!: Notificacion;
  /**
   * Nombre del representante legal.
   */
  public representanteLegal: string = '';
  /**
   * Constructor para inicializar el formulario de datos del subcontratista.
   * @param {FormBuilder} fb - FormBuilder para la creación del formulario reactivo.
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos.
   * @param {ComplimentosService} complimentosService - Servicio para obtener los datos de complementos.
   */
  constructor(
    private fb: FormBuilder,
    private catalogosServices: CatalogosService,
    private complimentosService: ComplimentosService,
    private consultaioQuery: ConsultaioQuery,
    private tramiteStore: TramiteStore,
    private validacionesService: ValidacionesFormularioService,
    private cdr: ChangeDetectorRef,
    private servicioDeFormularioService: ServicioDeFormularioService,
  ) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.formularioDeshabilitado = seccionState.readonly;
        })
      )
      .subscribe();

    if (this.datosSocioAccionistas) {
      this.servicioDeFormularioService.registerArray('datosSocioAccionistas', this.datosSocioAccionistas);
    }

    if (this.datosSocioAccionistasExtrenjeros) {
      this.servicioDeFormularioService.registerArray('datosSocioAccionistasExtrenjeros', this.datosSocioAccionistasExtrenjeros);
    }
  }

  /**
 * Verifica si un control del formulario es inválido.
 * @param fechaDeActa El nombre del control a verificar.
 * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
 */
  onFechaCambiada(fecha: string): void {
    if (fecha) {
      this.formaComplimentos.patchValue({ fechaDeActa: fecha });
    }
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * 
   * Configura el formulario para gestionar los campos relacionados con el pago de derechos, como clave, 
   * dependencia, banco, llave, fecha e importe. También asigna valores predeterminados a algunos campos.
   */
  private inicializarFormulario(): void {
    this.formaComplimentos = this.fb.group({
      modalidad: [{ value: 'Industrial', disabled: true }],
      programaPreOperativo: [false],
      datosGeneralis: this.fb.group({
        paginaWWeb: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(WEBPAGE)]],
        localizacion: ['', [Validators.required, Validators.maxLength(120)]],
      }),
      obligacionesFiscales: this.fb.group({
        opinionPositiva: [{ value: 1, disabled: true }, Validators.required],
        fechaExpedicion: ['', Validators.required],
        aceptarObligacionFiscal: [''],
      }),
      formaModificaciones: this.fb.group({
        nombreDelFederatario: ['', [Validators.required, Validators.maxLength(120)]],
        nombreDeNotaria: ['', [Validators.required]],
        estado: ['', Validators.required],
        nombreDeActa: ['', [Validators.required]],
        fechaDeActa: ['', Validators.required],
        rfc: ['', [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
          Validators.pattern(REGEX_RFC)
        ]],
        nombreDeRepresentante: [{ value: '', disabled: true }],
      }),
      formaCertificacion: this.fb.group({
        certificada: [{ value: '', disabled: true }],
        fechaInicio: [{ value: '', disabled: true }],
        fechaVigencia: [{ value: '', disabled: true }],
      }),
      formaSocioAccionistas: this.fb.group({
        nationalidadMaxicana: ['false', Validators.required],
        tipoDePersona: ['false', Validators.required],
        formaDatos: this.obtainerFormaDatos(TIPO_FORMA.DEFAULT),
      }),
    });
    
    // Aplicar datos iniciales si están disponibles
    if (this.datosFormaComplimentos) {

      // Usar ejecución inmediata para una mejor experiencia de usuario
      setTimeout(() => {
        this.aplicarDatosFormulario();
      }, 0);
    }

    if (this.esFormularioSoloLectura) {
      setTimeout(() => {
        Object.keys(this.formaDatos.controls).forEach(controlName => {
          this.formaDatos.get(controlName)?.disable();
        });
        this.cdr.detectChanges();
      }, 0);
    }

    if (this.esFormularioSoloLectura) {
      this.formaComplimentos.disable();
    }

    this.servicioDeFormularioService.registerForm('datosGeneralisForm', this.datosGeneralis);
    this.servicioDeFormularioService.registerForm('obligacionesFiscalesForm', this.obligacionesFiscales);
    this.servicioDeFormularioService.registerForm('formaModificacionesForm', this.formaModificaciones);
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'datosGeneralisForm') {
        this.formaComplimentos.get('datosGeneralis')?.markAllAsTouched();
      }
      if (formName === 'obligacionesFiscalesForm') {
        this.formaComplimentos.get('obligacionesFiscales')?.markAllAsTouched();
      }
      if (formName === 'formaModificacionesForm') {
        this.formaComplimentos.get('formaModificaciones')?.markAllAsTouched();
      }
    })
  }

  /**
   * Limita la entrada de un campo de texto a un número máximo de caracteres numéricos.
   * @param event Event del input
   * @param maxLength 
   */
  onInputMaxLength(event: Event, maxLength: number, controlPath: string): void {
    const TARGET = event.target as HTMLInputElement;
    let value = TARGET.value;
    value = value.replace(/\D/g, '').slice(0, maxLength);
    TARGET.value = value;
    this.formaComplimentos.get(controlPath)?.setValue(value, { emitEvent: false });
  }

  /**
 * Obtiene el formulario anidado de datos de socios accionistas.
 * @returns {FormGroup} FormGroup correspondiente a 'formaSocioAccionistas.formaDatos'.
 */
  get datosGeneralis(): FormGroup {
    return this.formaComplimentos.get('datosGeneralis') as FormGroup;
  }

  /**
 * Obtiene el formulario anidado de datos de socios accionistas.
 * @returns {FormGroup} FormGroup correspondiente a 'formaSocioAccionistas.formaDatos'.
 */
  get obligacionesFiscales(): FormGroup {
    return this.formaComplimentos.get('obligacionesFiscales') as FormGroup;
  }

  /**
 * Obtiene el formulario anidado de datos de socios accionistas.
 * @returns {FormGroup} FormGroup correspondiente a 'formaSocioAccionistas.formaDatos'.
 */
  get formaModificaciones(): FormGroup {
    return this.formaComplimentos.get('formaModificaciones') as FormGroup;
  }

  /**
 * Obtiene el formulario anidado de datos de socios accionistas.
 * @returns {FormGroup} FormGroup correspondiente a 'formaSocioAccionistas.formaDatos'.
 */
  get formaDatos(): FormGroup {
    return this.formaComplimentos.get('formaSocioAccionistas.formaDatos') as FormGroup;
  }

  /**
  * compo doc
  * @method isValid
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(formgroup: string, campo: string): boolean | null {
    const FORMGRUPO = this.formaComplimentos.get(formgroup) as FormGroup;
    return this.validacionesService.isValid(FORMGRUPO, campo);
  }

  /**
   * Aplica los datos del complemento al formulario, transformando los valores según sea necesario.
   */
  private aplicarDatosFormulario(): void {
    if (!this.datosFormaComplimentos || !this.formaComplimentos) {
      return;
    }

    // Crear una copia de los datos para transformación
    const DATOS_TRANSFORMADOS = JSON.parse(JSON.stringify(this.datosFormaComplimentos));

    this.transformarValoresRadio(DATOS_TRANSFORMADOS);

    if (
      !DATOS_TRANSFORMADOS.obligacionesFiscales ||
      DATOS_TRANSFORMADOS.obligacionesFiscales.opinionPositiva === undefined ||
      DATOS_TRANSFORMADOS.obligacionesFiscales.opinionPositiva === null ||
      DATOS_TRANSFORMADOS.obligacionesFiscales.opinionPositiva === '' ||
      isNaN(Number(DATOS_TRANSFORMADOS.obligacionesFiscales.opinionPositiva))
    ) {
      if (!DATOS_TRANSFORMADOS.obligacionesFiscales) {
        DATOS_TRANSFORMADOS.obligacionesFiscales = {};
      }
      DATOS_TRANSFORMADOS.obligacionesFiscales.opinionPositiva = 1;
    }

    const PROGRAMA_PREOPERATIVO_VALUE = this.transformarCheckboxValue(DATOS_TRANSFORMADOS.programaPreOperativo);

    const ACEPTAR_OBLIGACION_FISCAL_VALUE = this.transformarCheckboxValue(DATOS_TRANSFORMADOS.aceptarObligacionFiscal);
    this.formaComplimentos.patchValue(DATOS_TRANSFORMADOS, { emitEvent: false });
    this.formaComplimentos.get('modalidad')?.setValue('Industrial', { emitEvent: false });

  }

  /**
   * Transforms radio button values to the expected format
   */
  private transformarValoresRadio(datos: DatosComplimentos): void {

    if (!datos.formaSocioAccionistas || !this.formaComplimentos) {
      return;
    }
    if (datos.formaSocioAccionistas.nationalidadMaxicana === 'Sí' ||
      datos.formaSocioAccionistas.nationalidadMaxicana === 'Si') {
      datos.formaSocioAccionistas.nationalidadMaxicana = 'true';
    } else if (datos.formaSocioAccionistas.nationalidadMaxicana === 'No') {
      datos.formaSocioAccionistas.nationalidadMaxicana = 'false';
    }


    if (datos.formaSocioAccionistas.tipoDePersona === 'Física' ||
      datos.formaSocioAccionistas.tipoDePersona === 'Persona Física') {
      datos.formaSocioAccionistas.tipoDePersona = 'true';
    } else if (datos.formaSocioAccionistas.tipoDePersona === 'Moral' ||
      datos.formaSocioAccionistas.tipoDePersona === 'Persona Moral') {
      datos.formaSocioAccionistas.tipoDePersona = 'false';
    }
  }

  /**
   * Transforms formaDatos structure to match form expectations
   */
  private transformarFormaDatos(datos: DatosComplimentos): void {
    if (!datos.formaSocioAccionistas) {
      return;
    }

    // Verificar si tenemos datos de tablaDatosComplimentos para poblar el formulario dinámico
    if (this.datosSocioAccionistas && this.datosSocioAccionistas.length > 0) {
      const PRIMER_REGISTRO = this.datosSocioAccionistas[0];
      datos.formaSocioAccionistas.formaDatos = {
        taxId: PRIMER_REGISTRO.taxId || '',
        razonSocial: PRIMER_REGISTRO.razonSocial || '',
        pais: PRIMER_REGISTRO.pais || '',
        codigoPostal: PRIMER_REGISTRO.codigoPostal || '',
        estado: PRIMER_REGISTRO.estado || '',
        correoElectronico: PRIMER_REGISTRO.correoElectronico || '',
        nombre: PRIMER_REGISTRO.nombre || '',
        apellidoPaterno: PRIMER_REGISTRO.apellidoPaterno || '',
        apellidoMaterno: PRIMER_REGISTRO.apellidoMaterno || '',
        rfc: PRIMER_REGISTRO.rfc || ''
      };
    } else if (this.esEstructuraFormaDatosInvalida(datos.formaSocioAccionistas.formaDatos ?? {})) {
      datos.formaSocioAccionistas.formaDatos = this.crearFormaDatosVacio();
    }
  }

  /**
   * Applies dynamic form data with single form modification
   */
  private aplicarDatosDinamicos(datos: DatosComplimentos): void {

    this.transformarFormaDatos(datos);


    const FORM_DATA_TO_APPLY = datos.formaSocioAccionistas?.formaDatos;


    if (FORM_DATA_TO_APPLY) {
      Object.keys(FORM_DATA_TO_APPLY).forEach(key => {
        this.PRESERVED_FORM_DATA[key] = FORM_DATA_TO_APPLY[key];
      });
    }

    // Determinar el tipo de formulario correcto basado en los valores de radio
    const NACIONALIDAD_MEXICANA = datos.formaSocioAccionistas && datos.formaSocioAccionistas.nationalidadMaxicana === 'true';
    const PERSONA_FISICA = datos.formaSocioAccionistas && datos.formaSocioAccionistas.tipoDePersona === 'true';

    // Aplicar la modificación de formulario apropiada una vez
    if (NACIONALIDAD_MEXICANA) {
      this.modificarFormulario(TIPO_FORMA.NATIONALIDAD_MEXICANA, this.camposFormularioNationalidad);
    } else if (PERSONA_FISICA) {
      this.modificarFormulario(TIPO_FORMA.TIPO_PERSONA, this.camposFormularioTipoPersona);
    } else {
      this.modificarFormulario(TIPO_FORMA.DEFAULT, this.camposFormularioDefault);
    }
  }

  /**
   * Checks if formaDatos structure is invalid
   */
  private esEstructuraFormaDatosInvalida(formaDatos: { [key: string]: string }): boolean {
    return !formaDatos ||
      typeof formaDatos !== 'object' ||
      Object.keys(formaDatos).some(key => key.startsWith('socio'));
  }

  /**
   * Creates empty formaDatos structure
   */
  private crearFormaDatosVacio(): { [key: string]: string } {
    return {
      taxId: '',
      razonSocial: '',
      pais: '',
      codigoPostal: '',
      estado: '',
      correoElectronico: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      rfc: ''
    };
  }

  /**
   * Transforms checkbox values
   */
  private transformarCheckboxValue(valor: string): boolean | string {
    if (valor === 'Sí' || valor === 'Si') {
      return true;
    } else if (valor === 'No') {
      return false;
    }
    return valor;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene los catálogos de países y estados, y configura las suscripciones para los cambios en el formulario.
   * Si hay datos de complementos disponibles, los establece en el formulario.
   * @returns {void}
   */
  ngOnInit(): void {
    //  this.getCatalogoPaises();
    this.inicializarFormulario();
    this.loadComboUnidadMedida();
    this.getPais();
    this.obtenerEstados();

    this.formaComplimentos.valueChanges
      .pipe(delay(100))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_) => {
        this.complimentosDatos.emit(this.formaComplimentos.value);
        this.formaValida.emit(this.formaComplimentos.valid);
      });

    // Aplicar datos después de que los catálogos estén cargados y el formulario esté listo
    if (this.datosFormaComplimentos) {
      // Usar aplicación inmediata para mejor rendimiento
      setTimeout(() => {
        this.aplicarDatosFormulario();
      }, 100);
    }

    if (this.formularioDeshabilitado) {
      this.formaComplimentos.disable();
    }
  }

  /**
   * Lifecycle hook that is called when any data-bound property changes.
   * Handles changes to input properties.
   */
  ngOnChanges(): void {
    if (this.formaComplimentos && this.datosFormaComplimentos) {
      // Aplicar inmediatamente para mejor experiencia de usuario
      this.aplicarDatosFormulario();
    }

    if (this.datosSocioAccionistas.length) {
      this.servicioDeFormularioService.setArray('datosSocioAccionistas', this.datosSocioAccionistas);
    }

    if (this.datosSocioAccionistasExtrenjeros.length) {
      this.servicioDeFormularioService.setArray('datosSocioAccionistasExtrenjeros', this.datosSocioAccionistasExtrenjeros);
    }
  }

  /**
   * Obtiene el formulario de datos según el tipo de formulario.
   *
   * @param {number} tipoForma - El tipo de formulario.
   * @returns {FormGroup} El formulario correspondiente.
   */
  obtainerFormaDatos(tipoForma: number): FormGroup {
    switch (tipoForma) {
      case TIPO_FORMA.DEFAULT:
        return this.fb.group({
          taxId: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
          razonSocial: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
          pais: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
          codigoPostal: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
          estado: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
          correoElectronico: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(200), Validators.pattern(EMAIL)]),
        });

      case TIPO_FORMA.TIPO_PERSONA:
        return this.fb.group({
          taxId: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
          nombre: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(200)]),
          pais: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
          codigoPostal: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
          estado: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(250)]),
          correoElectronico: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(200), Validators.pattern(EMAIL)]),
          apellidoPaterno: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(200)]),
        });

      case TIPO_FORMA.NATIONALIDAD_MEXICANA:
        return this.fb.group({
          rfc: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(13),
            Validators.pattern(REGEX_RFC)
          ]),
        });

      default:
        return this.createDefaultGroup();
    }
  }

  /**
  * Obtiene el formulario de datos según el tipo de formulario.
  * @returns {FormGroup} El formulario correspondiente.
  */
  createDefaultGroup(): FormGroup {
    return this.fb.group({
      taxId: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
      razonSocial: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
      pais: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
      codigoPostal: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(12)]),
      estado: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, Validators.required),
      correoElectronico: this.fb.control({ value: '', disabled: this.esFormularioSoloLectura ? true : false }, [Validators.required, Validators.maxLength(200), Validators.pattern(EMAIL)]),
    });
  }

  /**
 * Modifica el formulario según el tipo de formulario y los campos del formulario.
 *
 * @param {number} tipoForma - El tipo de formulario.
 * @param {DatosCatalago[]} camposDelFormulario - Los campos del formulario.
 */
  modificarFormulario(
    tipoForma: number,
    camposDelFormulario: DatosCatalago[]
  ): void {
    const CONTROL = this.formaComplimentos.get(
      'formaSocioAccionistas'
    ) as FormGroup;

    // Obtener el tipo de formulario actual para determinar si debemos preservar los datos
    const CURRENT_FORM_TYPE = this.tipoFormulario;
    const IS_SWITCHING_FROM_NACIONALIDAD_MEXICANA = CURRENT_FORM_TYPE === TIPO_FORMA.NATIONALIDAD_MEXICANA;
    const IS_SWITCHING_TO_NACIONALIDAD_MEXICANA = tipoForma === TIPO_FORMA.NATIONALIDAD_MEXICANA;

    // Guardar datos actuales del formulario antes de remover el control, pero ser selectivo sobre qué preservar
    const CURRENT_FORM_DATA = CONTROL.get('formaDatos')?.value || {};

    // Limpiar datos preservados anteriores al cambiar entre tipos de formulario incompatibles
    if (IS_SWITCHING_FROM_NACIONALIDAD_MEXICANA || IS_SWITCHING_TO_NACIONALIDAD_MEXICANA) {
      this.PRESERVED_FORM_DATA = {};
    } else {
      // Solo preservar datos al cambiar entre formularios compatibles (DEFAULT <-> TIPO_PERSONA)
      Object.keys(CURRENT_FORM_DATA).forEach(key => {
        const VALUE = CURRENT_FORM_DATA[key];
        if (VALUE !== undefined && VALUE !== null && VALUE !== '') {
          this.PRESERVED_FORM_DATA[key] = VALUE;
        }
      });
    }

    // Actualizar estructura del formulario de manera síncrona
    CONTROL.removeControl('formaDatos', { emitEvent: false });
    this.camposFormulario = [...camposDelFormulario];
    const NEW_FORM_CONTROL = this.obtainerFormaDatos(tipoForma);
    CONTROL.setControl('formaDatos', NEW_FORM_CONTROL, {
      emitEvent: false,
    });

    const DATA_TO_RESTORE: { [key: string]: string | number | boolean } = {};
    const NEW_FORM_CONTROLS = Object.keys(NEW_FORM_CONTROL.controls);

    // Solo restaurar datos para transiciones de formulario compatibles
    if (!IS_SWITCHING_FROM_NACIONALIDAD_MEXICANA && !IS_SWITCHING_TO_NACIONALIDAD_MEXICANA) {
      // Restaurar datos solo para controles coincidentes cuando no se cambia hacia/desde Nacionalidad Mexicana
      NEW_FORM_CONTROLS.forEach(controlName => {
        if (this.PRESERVED_FORM_DATA[controlName] !== undefined) {
          DATA_TO_RESTORE[controlName] = this.PRESERVED_FORM_DATA[controlName];
        }
      });
    }

    // Aplicar datos restaurados solo si hay alguno que restaurar
    if (Object.keys(DATA_TO_RESTORE).length > 0) {
      NEW_FORM_CONTROL.patchValue(DATA_TO_RESTORE, { emitEvent: false });
    }

    this.tipoFormulario = tipoForma;
  }
  /**
   * Verifica si el formulario contiene controles.
   *
   * @returns {boolean} Verdadero si el formulario contiene controles, falso si no.
   */
  obtenerControles(): boolean {
    return (
      this.formaComplimentos.get('formaSocioAccionistas') as FormGroup
    ).contains('formaDatos');
  }



  /**
  * method loadComboUnidadMedida
  * description Carga la lista de derechos desde el servicio.
  */
  loadComboUnidadMedida(): void {
    this.complimentosService.getDatos() // Llama al servicio para obtener los datos.
      .pipe(takeUntil(this.destroyNotifier$)) // Finaliza la suscripción al destruir el componente.
      .subscribe((data): void => { // Maneja los datos recibidos.
        this.derechosList = data as Catalogo[]; // Asigna los datos a la lista de derechos.
      });
  }

  /**
   * @description Obtiene el catálogo de estados y actualiza las opciones de los campos del formulario.
   * @returns {void}
   */
  getCatalogoEstado(): void {
    this.complimentosService
      .obtenerListaEstado()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        const INDICE = this.camposFormulario.findIndex(
          (ele) => ele.campo === PAIS
        );
        const INDICEALT = this.camposFormularioTipoPersona.findIndex(
          (ele) => ele.campo === ESTADO
        );

        this.camposFormularioTipoPersona[INDICEALT].opcionesCatalogo = datos;
        if (this.camposFormularioDefault && this.camposFormularioDefault[INDICE].opcionesCatalogo) {
          this.camposFormularioDefault[INDICE].opcionesCatalogo = datos;
        }
      });
  }

  /**
   * @description Agrega un nuevo accionista desde el formulario de complementos y emite el evento correspondiente.
   * @returns {void}
   */
  aggregarAccionistas(): void {
    const CORREO_CONTROL = this.formaComplimentos.get('formaSocioAccionistas.formaDatos.correoElectronico');
    
    // Custom regex validation for minimum email pattern a@a.aa
    if (CORREO_CONTROL && CORREO_CONTROL.value) {
      const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!EMAIL_REGEX.test(CORREO_CONTROL.value.trim())) {
        this.nuevaNotificacionCorreo = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'El correo no cumple con el formato requerido.',
          cerrar: true,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        return;
      }
    }

    if (CORREO_CONTROL && CORREO_CONTROL.invalid) {
      if (CORREO_CONTROL.errors?.['pattern'] || CORREO_CONTROL.errors?.['email']) {
        this.nuevaNotificacionCorreo = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'El correo no cumple con el formato requerido.',
          cerrar: true,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        return;
      }
    }

    const RFC_CONTROL = this.formaComplimentos.get('formaSocioAccionistas.formaDatos.rfc');
    if (RFC_CONTROL && RFC_CONTROL.value && RFC_CONTROL.invalid && RFC_CONTROL.value.length !== 12) {
      this.nuevaNotificacionRfc = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'El RFC debe tener al menos 12 caracteres de longitude',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const CONTROL = this.formaComplimentos.get(
      'formaSocioAccionistas'
    ) as FormGroup;
    const FORMADATOS_GROUP = CONTROL?.get('formaDatos') as FormGroup;
    if (FORMADATOS_GROUP?.valid) {

      let VALUE = CONTROL.get('formaDatos')?.value;
      if (VALUE.pais) {
        const DATOS = {
          ...VALUE,
          pais: ComplimentosComponent.obtenerDescripcion(this.estados, VALUE.pais)
        };
        VALUE = DATOS;
      }
      if (VALUE) {
        this.accionistasAgregados.emit(VALUE);
      }

      if (VALUE.rfc) {
        this.servicioDeFormularioService.pushToArray('datosSocioAccionistas', VALUE);
      } else if (VALUE.taxId) {
        this.servicioDeFormularioService.pushToArray('datosSocioAccionistasExtrenjeros', VALUE);
      }

      setTimeout(() => {
        const CURRENT_RFC = FORMADATOS_GROUP.get('rfc')?.value;
        const RESET_OBJ: Record<string, unknown> = {};
        Object.keys(FORMADATOS_GROUP.controls).forEach(key => {
          if (key !== 'rfc') {
            RESET_OBJ[key] = '';
          } else {
            RESET_OBJ[key] = CURRENT_RFC;
          }
        });
        FORMADATOS_GROUP.reset(RESET_OBJ);
      }, 0);

    } else {
      this.accionistasExtranjerosNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Los campos marcados con (*) son requeridos.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], id: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.id) === Number(id))?.descripcion;
    return DESCRIPCION ?? '';
  }

  /**
   * @description Elimina los accionistas seleccionados y emite el evento correspondiente.
   * @returns {void}
   */

  eliminarAccionistas(): void {
    if (this.eliminarUnoConfirmationNotificacion) {
      this.eliminarUnoConfirmationNotificacion.cerrar = false;
    }
    if (this.empresaAccionistasSeleccionados.length) {
      this.abrirEliminarUnoConfirmationModal();
    } else {
      this.abrirEliminarModal();
    }
  }

  /**
   * Abre un modal relacionado con las plantas Immex y configura una notificación
   * para alertar al usuario en caso de que no se hayan seleccionado datos de las plantas.
   *
   * La notificación configurada tiene las siguientes características:
   * - Tipo de notificación: 'alert'
   * - Categoría: 'danger'
   * - Modo: 'action'
   * - Título: vacío
   * - Mensaje: 'No se seleccionaron datos de las plantas Immex.'
   * - Cierre automático: habilitado
   * - Tiempo de espera: 2000 milisegundos
   * - Texto del botón Aceptar: 'Aceptar'
   * - Texto del botón Cancelar: vacío
   *
   * @returns {void} No retorna ningún valor.
   */
  abrirEliminarModal(): void {
    this.eliminarNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar accionistas a eliminar.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
 * Abre un modal relacionado con las plantas Immex y configura una notificación
 * para alertar al usuario en caso de que no se hayan seleccionado datos de las plantas.
 *
 * La notificación configurada tiene las siguientes características:
 * - Tipo de notificación: 'alert'
 * - Categoría: 'danger'
 * - Modo: 'action'
 * - Título: vacío
 * - Mensaje: 'No se seleccionaron datos de las plantas Immex.'
 * - Cierre automático: habilitado
 * - Tiempo de espera: 2000 milisegundos
 * - Texto del botón Aceptar: 'Aceptar'
 * - Texto del botón Cancelar: vacío
 *
 * @returns {void} No retorna ningún valor.
 */
  abrirEliminarUnoConfirmationModal(): void {
    this.eliminarUnoConfirmationNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Eliminar Accionista',
      mensaje: '¿Desea eliminar a los accionistas?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
* Método para manejar la selección de plantas IMMEX.
* 
* Este método recibe un evento de tipo `PlantasImmex` y lo agrega al arreglo
* `plantasImmexSeleccionadoDatos`, asegurando que no se dupliquen entradas.
* 
* @param {PlantasImmex} event - Objeto de tipo `PlantasImmex` que representa la planta seleccionada.
*/
  closePlantasModal(): void {
    this.eliminarNotificacion.cerrar = false;
  }

  /**
   * @description Elimina los accionistas extranjeros seleccionados y emite el evento correspondiente.
   * @returns {void}
   */
  eliminarAccionistasExtrenjeros(): void {
    if (this.eliminarDosConfirmationNotificacion && this.eliminarDosConfirmationNotificacion.cerrar) {
      this.eliminarDosConfirmationNotificacion.cerrar = false;
    }
    if (this.accionistasExtranjerosSeleccionados.length) {
      this.abrirEliminarDosConfirmationModal();
    } else {
      this.abrirEliminarModal();
    }
  }

  /**
* Abre un modal relacionado con las plantas Immex y configura una notificación
* para alertar al usuario en caso de que no se hayan seleccionado datos de las plantas.
*
* La notificación configurada tiene las siguientes características:
* - Tipo de notificación: 'alert'
* - Categoría: 'danger'
* - Modo: 'action'
* - Título: vacío
* - Mensaje: 'No se seleccionaron datos de las plantas Immex.'
* - Cierre automático: habilitado
* - Tiempo de espera: 2000 milisegundos
* - Texto del botón Aceptar: 'Aceptar'
* - Texto del botón Cancelar: vacío
*
* @returns {void} No retorna ningún valor.
*/
  abrirEliminarDosConfirmationModal(): void {
    this.eliminarDosConfirmationNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Eliminar Accionista',
      mensaje: '¿Desea eliminar a los accionistas?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }
  /**
   * @description Maneja la modificación del formulario basado en la nacionalidad y el tipo de persona.
   * @returns {void}
   */
  handleModificarForma(): void {
    // First, save current form data immediately, with special focus on taxId
    const CONTROL = this.formaComplimentos.get('formaSocioAccionistas') as FormGroup;
    const CURRENT_DATA = CONTROL.get('formaDatos')?.value || {};

    // Store initial data from datosFormaComplimentos if available
    if (this.datosFormaComplimentos?.formaSocioAccionistas?.formaDatos) {
      Object.keys(this.datosFormaComplimentos.formaSocioAccionistas.formaDatos).forEach(key => {
        const VALUE = this.datosFormaComplimentos?.formaSocioAccionistas?.formaDatos?.[key];
        if (VALUE) {
          this.PRESERVED_FORM_DATA[key] = VALUE;
        }
      });
    }

    // Preserve all current fields, with explicit handling for taxId
    Object.keys(CURRENT_DATA).forEach(key => {
      const VALUE = CURRENT_DATA[key];
      if (VALUE !== undefined && VALUE !== null && VALUE !== '') {
        this.PRESERVED_FORM_DATA[key] = VALUE;
      }
    });

    // Double-check taxId preservation
    if (CURRENT_DATA.taxId && CURRENT_DATA.taxId.trim() !== '') {
      this.PRESERVED_FORM_DATA['taxId'] = CURRENT_DATA.taxId;
    }

    // Execute form modification immediately without timeout
    const VALUE = this.formaComplimentos.value;

    if (VALUE.formaSocioAccionistas.nationalidadMaxicana === 'true') {
      this.modificarFormulario(
        TIPO_FORMA.NATIONALIDAD_MEXICANA,
        this.camposFormularioNationalidad
      );
    } else {
      if (VALUE.formaSocioAccionistas.tipoDePersona === 'true') {
        this.modificarFormulario(
          TIPO_FORMA.TIPO_PERSONA,
          this.camposFormularioTipoPersona
        );
      } else {
        this.modificarFormulario(
          TIPO_FORMA.DEFAULT,
          this.camposFormularioDefault
        );
      }
    }
    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        formaSocioAccionistas: {
          nationalidadMaxicana: VALUE.formaSocioAccionistas.nationalidadMaxicana,
          tipoDePersona: VALUE.formaSocioAccionistas.tipoDePersona,
        }
      }
    );
  }

  /**
   * Maneja los cambios en el campo "Fecha de Pago".
   * Actualiza el estado del almacén con la fecha de pago proporcionada.  
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.formaComplimentos.get('obligacionesFiscales.fechaExpedicion')?.setValue(nuevo_valor);
    this.tramiteStore.setfechaExpedicion(nuevo_valor);
    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        obligacionesFiscales: {
          fechaExpedicion: nuevo_valor
        }
      }
    );
  }

  /**
 * Maneja los cambios en el campo "Fecha de Pago".
 * Actualiza el estado del almacén con la fecha de pago proporcionada.  
 */
  cambioFecha(nuevo_valor: string): void {
    this.formaComplimentos.get('formaModificaciones.fechaDeActa')?.setValue(nuevo_valor);
    this.tramiteStore.setfechaDeActa(nuevo_valor);
    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        formaModificaciones: {
          fechaDeActa: nuevo_valor
        }
      }
    );
  }

  /**
   * Clears all preserved form data
   */
  private clearPreservedData(): void {
    this.PRESERVED_FORM_DATA = {};
  }

  /**
   * Gets the appropriate error message for the main RFC field validation (formaModificaciones.rfc only)
   * @returns {string} The error message to display
   */
  getRfcErrorMessage(): string {
    if (!this.formaComplimentos) {
      return 'Formulario no inicializado';
    }

    // ONLY get errors from the main RFC field, not the dynamic form RFC
    const RFC_CONTROL = this.formaComplimentos.get('formaModificaciones')?.get('rfc');

    if (!RFC_CONTROL?.errors) {
      return '';
    }

    if (RFC_CONTROL.errors['required']) {
      return 'El RFC es obligatorio';
    }

    if (RFC_CONTROL.errors['minlength']) {
      return 'El RFC no se encontró, favor de verificar';
    }

    if (RFC_CONTROL.errors['maxlength']) {
      return 'El RFC no se encontró, favor de verificar';
    }

    if (RFC_CONTROL.errors['pattern']) {
      return 'El RFC no se encontró, favor de verificar';
    }

    return 'El RFC tiene errores de validación';
  }

  /**
   * Handles MAIN RFC field blur event to show validation popup (formaModificaciones.rfc only)
   */
  onRfcBlur(): void {
    // Set flag to indicate we're processing RFC validation
    this.isProcessingRfcValidation = true;

    // Only target the main RFC field in formaModificaciones
    const RFC_CONTROL = this.formaComplimentos.get('formaModificaciones')?.get('rfc');
    if (RFC_CONTROL) {
      RFC_CONTROL.markAsTouched();
      // Only check validation for the main RFC field specifically on blur
      this.checkRfcValidationOnly();
    }

    // Reset flag after a delay
    setTimeout(() => {
      this.isProcessingRfcValidation = false;
    }, 200);
  }

  /**
   * Handles MAIN RFC field input change to show validation popup (formaModificaciones.rfc only)
   * Only triggers when called directly from the main RFC input field
   */
  onRfcChange(): void {
    // Set flag to indicate we're processing RFC validation
    this.isProcessingRfcValidation = true;

    // Clear any existing notification first
    this.clearRfcNotification();

    // Check validation after a slight delay to allow the value to be updated
    setTimeout(() => {
      // Only target the main RFC field in formaModificaciones
      const RFC_CONTROL = this.formaComplimentos.get('formaModificaciones')?.get('rfc');
      if (RFC_CONTROL && RFC_CONTROL.value) {
        RFC_CONTROL.markAsTouched();
        RFC_CONTROL.updateValueAndValidity();
        // Only check validation for the main RFC field specifically and only if it has a value
        this.checkRfcValidationOnly();
      }

      // Reset flag
      this.isProcessingRfcValidation = false;
    }, 100);
  }

  /**
   * Checks ONLY the main RFC validation (formaModificaciones.rfc) and shows notification if invalid
   * This method is separate from other form validations to avoid interference
   * Specifically ignores the dynamic form RFC field (formaDatos.rfc)
   */
  private checkRfcValidationOnly(): void {
    if (!this.formaComplimentos) {
      return;
    }

    // ONLY proceed if we're explicitly processing RFC validation
    if (!this.isProcessingRfcValidation) {
      return;
    }

    // ONLY check the main RFC field in formaModificaciones, NOT the dynamic form RFC
    const RFC_CONTROL = this.formaComplimentos.get('formaModificaciones')?.get('rfc');

    // Additional check: ensure we're not processing other form events
    const ACTIVE_ELEMENT = document.activeElement as HTMLInputElement;
    const IS_RFC_FIELD = ACTIVE_ELEMENT?.id === 'rfc' ||
      (RFC_CONTROL?.touched && RFC_CONTROL?.value && RFC_CONTROL?.value.trim() !== '');

    // Ensure we're only checking the specific main RFC field and user is actually interacting with it
    if (RFC_CONTROL?.invalid && RFC_CONTROL?.touched && RFC_CONTROL?.value &&
      RFC_CONTROL?.value.trim() !== '' && IS_RFC_FIELD) {
      const ERROR_MESSAGE = this.getRfcErrorMessage();

      // Only show notification if there's actually an error message and no notification is already shown
      if (ERROR_MESSAGE && ERROR_MESSAGE.trim() !== '' && !this.nuevaNotificacionRfc) {
        this.nuevaNotificacionRfc = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: ERROR_MESSAGE,
          cerrar: false,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
      }
    } else if (RFC_CONTROL?.valid && IS_RFC_FIELD) {
      // Clear notification if main RFC field becomes valid and we're in RFC context
      this.clearRfcNotification();
    }
  }

  /**
   * Clears the RFC notification
   */
  private clearRfcNotification(): void {
    if (this.nuevaNotificacionRfc) {
      this.nuevaNotificacionRfc = undefined as unknown as Notificacion;
    }
  }

  /**
   * Handles notification confirmation for RFC validation
   * @param confirmar Indicates if the user confirmed the notification
   */
  confirmarNotificacionRfc(confirmar: boolean): void {
    if (confirmar) {
      // Clear the notification
      this.clearRfcNotification();

      // Optionally focus back on the RFC field
      const RFC_INPUT = document.getElementById('rfc');
      if (RFC_INPUT) {
        RFC_INPUT.focus();
      }
    }
  }

  /**
   * Maneja la confirmación de la notificación para accionistas extranjeros.
   * Si el usuario confirma, elimina la notificación correspondiente.
   * @param confirmar Indica si el usuario confirmó la notificación.
   */
  confirmarAccionistasConfirmation(confirmar: boolean): void {
    if (confirmar) {
      if (this.accionistasExtranjerosNotificacion) {
        this.accionistasExtranjerosNotificacion = undefined as unknown as Notificacion;
      }
    }
  }

  /**
 * Maneja la confirmación de la notificación para eliminar registros.
 * Si el usuario confirma, elimina la notificación correspondiente.
 * @param confirmar Indica si el usuario confirmó la notificación.
 */
  confirmarEliminarNotificacion(confirmar: boolean): void {
    if (confirmar) {
      if (this.eliminarNotificacion) {
        this.eliminarNotificacion = undefined as unknown as Notificacion;
      }
    }
  }

  /**
 * Maneja la confirmación de la notificación para eliminar accionistas extranjeros.
 * Si el usuario confirma, emite el evento con los accionistas seleccionados y limpia la lista.
 * Si no confirma, elimina la notificación correspondiente.
 * @param confirmar Indica si el usuario confirmó la notificación.
 */
  confirmarEliminarDosConfirmation(confirmar: boolean): void {
    if (confirmar) {
      this.accionistasExtranjerosEliminado.emit(this.accionistasExtranjerosSeleccionados);
      const TAX_IDS = this.accionistasExtranjerosSeleccionados.map(x => x.taxId);
      this.accionistasExtranjerosSeleccionados =
        this.accionistasExtranjerosSeleccionados.filter(
          item => !TAX_IDS.includes(item.taxId)
        );
    } else {
      this.eliminarDosConfirmationNotificacion = undefined as unknown as Notificacion;
    }
  }

  /**
 * Maneja la confirmación de la notificación para eliminar accionistas seleccionados.
 * Si el usuario confirma, emite el evento con los accionistas seleccionados.
 * Si no confirma, elimina la notificación correspondiente.
 * @param confirmar Indica si el usuario confirmó la notificación.
 */
  confirmarEliminarUnoConfirmation(confirmar: boolean): void {
    if (confirmar) {
      this.accionistasEliminados.emit(this.empresaAccionistasSeleccionados);
    } else {
      this.eliminarUnoConfirmationNotificacion = undefined as unknown as Notificacion;
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.clearPreservedData();
  }


  /**
   * Handles input change for Localización field and converts to uppercase
   * @param event Input event
   */
  onLocalizacionInputChange(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const UPPERCASEVALUE = INPUT.value.toUpperCase();

    // Update the form control value
    this.formaComplimentos.get('datosGeneralis')?.get('localizacion')?.setValue(UPPERCASEVALUE, { emitEvent: false });

    // Update the input field display
    INPUT.value = UPPERCASEVALUE;
    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        datosGeneralis: {
          localizacion: UPPERCASEVALUE
        }
      }
    );
  }

  /**
   * Handles input change for RFC field and converts to uppercase
   * @param event Input event
   */
  onRFCInputChange(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const RFC = INPUT.value;

    // Update the form control value
    this.formaComplimentos.get('formaModificaciones')?.get('rfc')?.setValue(RFC, { emitEvent: false });

    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        formaModificaciones: {
          rfc: RFC
        }
      }
    );
  }

  /**
   * Handles blur event for RFC field to show validation popup
   */
  onRfcDelBlur(): void {
    const RFC_CONTROL = this.formaComplimentos.get('formaModificaciones.rfc');
    if (RFC_CONTROL && RFC_CONTROL.touched && RFC_CONTROL.value) {
      if (RFC_CONTROL.invalid) {
        this.nuevaNotificacionRfcDel = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'El RFC no se encontró, favor de verificarlo.',
          cerrar: true,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.formaModificaciones.get('nombreDeRepresentante')?.setValue('');
      } else if (RFC_CONTROL.valid) {
        this.complimentosService.getRazonSocial(RFC_CONTROL.value).pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
          this.representanteLegal = res.datos.razon_social;
          this.formaModificaciones.get('nombreDeRepresentante')?.setValue(this.representanteLegal);
        });
      }
    }
  }

  /**
   * Handles keypress events to allow only letters and common characters
   * @param event Keyboard event
   * @returns boolean indicating if the key should be allowed
   */
  onKeyPress(event: KeyboardEvent): boolean {
    const CHAR = String.fromCharCode(event.which);
    const ALLOWEDPATTERN = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s.\-_:/@]$/;

    // Allow backspace, delete, tab, escape, enter
    if (event.which === 8 || event.which === 46 || event.which === 9 ||
      event.which === 27 || event.which === 13) {
      return true;
    }

    if (event.ctrlKey && (event.which === 65 || event.which === 67 ||
      event.which === 86 || event.which === 88 || event.which === 90)) {
      return true;
    }

    // Test the character against the pattern
    if (!ALLOWEDPATTERN.test(CHAR)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  /**
 * Marca como tocado el control especificado dentro del formulario de socios accionistas al perder el foco.
 * @param campo - Nombre del campo que perdió el foco.
 */
  // onDesenfoque(campo: string): void {
  //   const CONTROL = this.formaComplimentos.get(`formaSocioAccionistas.formaDatos.${campo}`);
  //   if (CONTROL?.value === '' || CONTROL?.value === null) {
  //     CONTROL?.markAsTouched();
  //   }
  // }

  /**
 * Actualiza el valor del campo especificado en el formulario de socios accionistas cuando cambia su valor.
 * Marca el control como tocado y actualiza su validez; si el valor está vacío, lo marca como modificado.
 * @param event - Evento de cambio del input.
 * @param campo - Nombre del campo a actualizar.
 */
  onCambio(event: Event, campo: string): void {
    const VALOR = (event.target as HTMLInputElement).value;
    const CONTROL = this.formaComplimentos.get(`formaSocioAccionistas.formaDatos.${campo}`);
    if (!CONTROL) {
      return;
    }
    if (VALOR) {
      const NEW_VALUE = campo === 'taxId' ? VALOR.toUpperCase() : VALOR;
      if (CONTROL.value !== NEW_VALUE) {
        CONTROL.setValue(NEW_VALUE, { emitEvent: false });
      }
      CONTROL.markAsTouched({ onlySelf: true });
    } else {
      CONTROL?.markAsDirty();
      CONTROL?.markAsTouched();
    }
    this.servicioDeFormularioService.setFormValue('complimentosForm',
      {
        formaSocioAccionistas: {
          formaDatos: this.formaDatos.value
        }
      }
    );
  }


  /**
   * Obtiene la lista de países desde el servicio `complimentosService` y actualiza las opciones
   * de los campos de formulario correspondientes con los datos recibidos.
   * 
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza tanto el campo 'pais' en `camposFormularioDefault` como el campo correspondiente
   * en `camposFormularioTipoPersona` con las opciones obtenidas.
   */
  getPais(): void {
    this.complimentosService.getPais().pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
      const INDICE = this.camposFormulario.findIndex(
        (ele) => ele.campo === 'pais'
      );
      const INDICEALT = this.camposFormularioTipoPersona.findIndex(
        (ele) => ele.campo === PAIS
      );
      this.camposFormularioDefault[INDICE].opcionesCatalogo = res.datos;

      this.camposFormularioTipoPersona[INDICEALT].opciones = res.datos
        .filter((item: Catalogo) => item.clave !== undefined)
        .map((item: Catalogo) => ({
          ...item,
          clave: Number(item.clave)
        })) as CatalogoPaises[];
    });

  }

  /**
 * Obtiene la lista de estados llamando al servicio `complimentosService`.
 * Se suscribe al observable retornado por `getEstado()` y muestra la respuesta en la consola.
 * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
 */
  obtenerEstados(): void {
    this.complimentosService.getEstado().pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
      this.estados = res.datos;
    });
  }

  /**
   * Maneja el cambio de estado en el formulario de modificaciones.
   * Actualiza el valor del campo 'estado' en el formulario con la clave seleccionada.
   * @param event Objeto del catálogo seleccionado.
   */
  estadoChange(event: Catalogo): void {
    if (event) {
      this.formaComplimentos.get('formaModificaciones.estado')?.setValue(event?.clave);
    }
  }
}