import { CONTROL_INVENTARIOS_TABLA, DATOS_COMUNES_TEXTOS_CUATRO } from '../../models/datos-comunes.model';
import { Component, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ControlInventarios } from '../../models/datos-comunes.model';
import { DATOS_COMUNES_TEXTOS_TRES } from '../../models/datos-comunes.model';
import { DatosComunesQuery } from '../../estados/queries/datos-comunes.query';
import { DatosComunesService } from '../../services/datos-comunes.service';
import { DatosComunesState } from '../../estados/stores/datos-comunes.store';
import { DatosComunesStore } from '../../estados/stores/datos-comunes.store';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { INSTALACIONES_PRINCIPALES_TABLA } from '../../models/datos-comunes.model';
import { Inject } from '@angular/core';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { InstalacionesPrincipalesTablaInfo } from '../../models/datos-comunes.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PRINCIPALES_INSTALACIONES_COLUMNA } from '../../constants/datos-comunes-tres.enum';
import { PrincipalesInstalaciones } from '../../models/datos-comunes-tres.model';
import { REGEX_RFC } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TemplateRef } from '@angular/core';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import dinamicaradio from '@libs/shared/theme/assets/json/31602/dinamica-radio-datos.json';
import { map } from 'rxjs';
import radio_si_no from '@libs/shared/theme/assets/json/31601/radio_si_no.json';
import { takeUntil } from 'rxjs';

/**
 * Componente que representa la sección "Datos Comunes Dos".
 * Este componente es un componente independiente de Angular que gestiona formularios y datos
 * relacionados con datos comunes, instalaciones y control de inventarios.
 */
@Component({
  selector: 'app-datos-comunes-dos',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    TituloComponent,
    InputCheckComponent,
  ],
  templateUrl: './datos-comunes-dos.component.html',
  styleUrl: './datos-comunes-dos.component.scss',
})
export class DatosComunesDosComponent implements OnInit,OnDestroy {

  @Input() datosComunesObj = {
    tieneProcedure: { numero: '', activo: false }
  };
  /**
   * Un subject utilizado para emitir una señal para limpiar suscripciones y otros recursos
   * cuando el componente es destruido. Esto ayuda a prevenir fugas de memoria asegurando
   * que cualquier suscripción en curso vinculada a este notifier se desuscriba correctamente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar los datos
   * del componente "Datos Comunes Dos".
   */
  public comunesDosForm!: FormGroup;
  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar los datos
   * de las instalaciones principales dentro del componente. Este grupo de formulario
   * se inicializa dinámicamente y contiene controles para capturar la entrada del usuario
   * relacionada con las instalaciones principales.
   */
  public instalacionesPrincipalesForm!: FormGroup;
  /**
   * Una instancia de FormGroup utilizada para gestionar y rastrear el estado de un formulario en el componente.
   * Este grupo de formulario probablemente se inicializa y configura con controles de formulario en otra parte del componente.
   */
  public modificarForm!: FormGroup;

  /** Lista completa de número de empleados */
  public instalacionesTablaDatos: PrincipalesInstalaciones[] = [] as PrincipalesInstalaciones[];

  /** Lista de socios IC seleccionados por el usuario */
  public seleccionarListaInstalaciones: PrincipalesInstalaciones[] = [] as PrincipalesInstalaciones[];

  /** Configuración de columnas para la sección de socios IC */
  public instalacionesConfiguracionColumnas: ConfiguracionColumna<PrincipalesInstalaciones>[] = PRINCIPALES_INSTALACIONES_COLUMNA;
    
  /**
   * Una referencia a la instancia del modal creada por el `BsModalService`.
   * Esto se puede usar para interactuar con el modal, como cerrarlo programáticamente.
   */
  modalRef?: BsModalRef;
  /**
   * Una propiedad pública que contiene el valor de `dinamicaradio`.
   * Esta propiedad probablemente se utiliza para gestionar o hacer referencia a datos o comportamientos
   * dinámicos de botones de radio dentro del componente `datos-comunes-dos`.
   */
  public dinamicaRadio = dinamicaradio;
  /**
   * Un arreglo de objetos `Catalogo` que representa las opciones disponibles para los bimestres en el contexto de IDC.
   * Esta propiedad se utiliza para poblar un componente de selección o desplegable con los bimestres.
   */
  public comboBimestresIDC: Catalogo[] = [];
  /**
   * Un arreglo de objetos `Catalogo` que representa las opciones disponibles para los bimestres en el contexto de IDC.
   * Esta propiedad se utiliza para poblar un componente de selección o desplegable con los bimestres.
   */
  public entidadFederativa: Catalogo[] = [];
  /**
   * Una constante que contiene los datos de texto para el componente "Datos Comunes Dos".
   * Estos datos provienen de `DATOS_COMUNES_TEXTOS_TRES` y se utilizan para mostrar
   * o gestionar información textual común dentro del componente.
   */
  public TEXTOS = DATOS_COMUNES_TEXTOS_TRES;

  /**
   * Una constante que contiene los datos de texto para el componente "Datos Comunes Dos".
   * Estos datos provienen de `DATOS_COMUNES_TEXTOS_CUATRO` y se utilizan para mostrar
   * o gestionar información textual común dentro del componente.
   */
  public TEXTOS_CUATRO = DATOS_COMUNES_TEXTOS_CUATRO;
  /**
   * Representa el modo de selección para un componente de tabla.
   * Esta propiedad está configurada para usar un mecanismo de selección basado en casillas de verificación.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Representa la configuración para las columnas de la tabla "Instalaciones Principales".
   * Esta propiedad es un arreglo de configuraciones de columnas, donde cada configuración
   * define la estructura y el comportamiento de una columna en la tabla.
   *
   * @type {ConfiguracionColumna<InstalacionesPrincipalesTablaInfo>[]}
   */
  public instalacionesPrincipalesTabla: ConfiguracionColumna<InstalacionesPrincipalesTablaInfo>[] = INSTALACIONES_PRINCIPALES_TABLA;
  /**
   * Un arreglo que contiene datos relacionados con las instalaciones principales.
   * Cada elemento en el arreglo es de tipo `InstalacionesPrincipalesTablaInfo`.
   */
  public instalacionesPrincipalesTablaDatos: InstalacionesPrincipalesTablaInfo[] = [];

  /** Almacena la fila seleccionada de la tabla de instalaciones principales. */
  private seleccionadaInstalacionesDatos: InstalacionesPrincipalesTablaInfo | null = null;

  /** Almacena la fila seleccionada de la tabla de Control Inventarios. */
  private seleccionadaControlInventarios: ControlInventarios | null = null;
  /**
   * Representa la opción seleccionada para un grupo de botones de radio.
   * Se espera que el valor sea de tipo `radio_si_no`, que probablemente define
   * los posibles estados u opciones para el botón de radio (por ejemplo, "sí" o "no").
   */
  public opcionDeBotonDeRadio = radio_si_no;
  /**
   * Representa el catálogo de sectores productivos para AGACE.
   * Este arreglo contiene una lista de objetos `Catalogo` que definen
   * los sectores productivos disponibles.
   */
  public sectorProductivoAgace: Catalogo[] = [];
  /**
   * Representa la ruta de contexto utilizada dentro de la aplicación.
   * Esta propiedad se utiliza típicamente para almacenar la ruta base o segmento de URL
   * que define el contexto para el componente o módulo actual.
   */
  public rutaDeContexto: string = '';
  /**
   * Configuración para la tabla de controles de inventarios.
   * Esta propiedad es un arreglo de configuraciones de columnas para el tipo `ControlInventarios`.
   * Se inicializa con la constante predefinida `CONTROL_INVENTARIOS_TABLA`.
   */
  public controlInentariosTabla: ConfiguracionColumna<ControlInventarios>[] = CONTROL_INVENTARIOS_TABLA;
  /**
   * Un arreglo de objetos `ControlInventarios` utilizado para gestionar y almacenar datos
   * relacionados con el control de inventarios en el componente.
   */
  public controlInentariosTablaDatos: ControlInventarios[] = [];
  /**
   * Representa el estado de la funcionalidad "Datos Comunes" dentro de la aplicación.
   * Esta propiedad se utiliza para gestionar y almacenar el estado compartido para el componente.
   * 
   * @type {DatosComunesState}
   */
  public solicitudState!: DatosComunesState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;
/**
 * Evento emitido cuando se produce un cambio en algún control tipo radio del formulario.
 *
 * El evento emite un objeto que contiene el nombre del control (`controlName`) y el valor seleccionado (`value`).
 * Este evento permite a los componentes padres reaccionar ante cambios en los botones de radio del formulario.
 */
  @Output() radioChanged = new EventEmitter<{ controlName: string, value: unknown }>();

  /** Indica si se debe mostrar el mensaje de error en el formulario. */
  public mostrarMensajeError: boolean = true;

  /**
   * Constructor de la clase DatosComunesDosComponent.
   * 
   * @param datosComunesSvc - Servicio para manejar operaciones de datos comunes.
   * @param modalService - Servicio para gestionar diálogos modales.
   * @param fb - Instancia de FormBuilder para crear y gestionar formularios reactivos.
   * @param datosComunesStore - Almacén para gestionar el estado de los datos comunes.
   * @param datosComunesQuery - Servicio de consulta para recuperar el estado de los datos comunes.
   */
  constructor(
    private datosComunesSvc: DatosComunesService,
    @Inject(BsModalService)
    private modalService: BsModalService,
    private fb: FormBuilder,
    private datosComunesStore: DatosComunesStore,
    private datosComunesQuery: DatosComunesQuery,
    private consultaQuery: ConsultaioQuery
  ) {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
      })).subscribe();
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * Este método realiza las siguientes acciones:
   * - Se suscribe al observable `selectSolicitud$` de `datosComunesQuery` para actualizar la propiedad `solicitudState`.
   * - Llama a métodos para obtener e inicializar datos para varios componentes:
   *   - `getComboBimestres`: Recupera datos para el desplegable de bimestres.
   *   - `getInstalacionesPrincipalesTablaDatos`: Obtiene datos para la tabla de instalaciones principales.
   *   - `getSectorProductivoAgace`: Carga datos para el sector productivo.
   *   - `getControlInventariosDatos`: Recupera datos de control de inventarios.
   * - Inicializa formularios reactivos:
   *   - `crearComunesDosFormulario`: Crea el formulario para la sección de datos comunes dos.
   *   - `crearInstalacionesPrincipalesFormulario`: Crea el formulario para las instalaciones principales.
   *   - `crearModificarForm`: Crea el formulario para modificaciones.
   * 
   * El método asegura una limpieza adecuada utilizando `takeUntil` con el observable `destroyNotifier$`.
   */
  ngOnInit(): void {
    this.datosComunesQuery.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
      this.solicitudState = seccionState;
    })).subscribe();
    this.getComboBimestres();
    this.getInstalacionesPrincipalesTablaDatos();
    this.getSectorProductivoAgace();
    this.getControlInventariosDatos();
    this.crearComunesDosFormulario();
    this.crearInstalacionesPrincipalesFormulario();
    this.crearModificarForm();
    this.inicializarEstadoFormulario();
    this.obtenerEntidadFederativaOpciones();
  }

    /**
     * Inicializa el formulario suscribiéndose al observable del estado de solicitud,
     * actualizando el estado local en consecuencia y creando los grupos de formularios requeridos.
     * 
     * Este método realiza las siguientes acciones:
     * - Se suscribe a `datosComunesQuery.selectSolicitud$` para mantener actualizado `solicitudState`,
     *   anulando la suscripción automáticamente cuando `destroyNotifier$` emite.
     * - Llama a `crearComunesDosFormulario()` para configurar los controles del formulario común.
     * - Llama a `crearInstalacionesPrincipalesFormulario()` para configurar el formulario de instalaciones principales.
     * - Llama a `crearModificarForm()` para configurar el formulario de modificación.
     */
    public inicializarFormulario(): void {
      this.datosComunesQuery.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
      })).subscribe();

        this.crearComunesDosFormulario();
        this.crearInstalacionesPrincipalesFormulario();
        this.crearModificarForm();
    }

  /**
   * Inicializa el FormGroup `comunesDosForm` con controles predefinidos y sus respectivos validadores.
   * 
   * Este método crea una estructura de formulario reactivo para gestionar los datos del formulario "Comunes Dos". 
   * Cada control del formulario se inicializa con un valor predeterminado, que se obtiene del objeto `solicitudState`, 
   * y se le asignan reglas de validación apropiadas.
   * 
   * Controles del Formulario:
   * - `comboBimestresIDCSeleccione`: Campo opcional inicializado con `solicitudState.comboBimestresIDCSeleccione`.
   * - `ingresar`: Campo obligatorio inicializado con `solicitudState.ingresar`.
   * - `encuentraSus`: Campo obligatorio inicializado con `solicitudState.encuentraSus`.
   * - `registrosQue`: Campo opcional inicializado con `solicitudState.registrosQue`.
   * - `registrosQue2`: Campo opcional inicializado con `solicitudState.registrosQue2`.
   * - `momentoIngresar`: Campo obligatorio inicializado con `solicitudState.momentoIngresar`.
   * - `indiqueCuenta`: Campo obligatorio inicializado con `solicitudState.indiqueCuenta`.
   * - `indiqueCheck`: Campo opcional inicializado con `solicitudState.indiqueCheck`.
   * - `nombreDel`: Campo obligatorio con una longitud mínima de 3 y máxima de 250 caracteres, inicializado con `solicitudState.nombreDel`.
   * - `lugarDeRadicacion`: Campo obligatorio con una longitud mínima de 3 y máxima de 250 caracteres, inicializado con `solicitudState.lugarDeRadicacion`.
   * - `contabilidad`: Campo obligatorio inicializado con `solicitudState.contabilidad`.
   * - `rmfRadio`: Campo obligatorio inicializado con `solicitudState.rmfRadio`.
   * - `vinculacionRegistroCancelado`: Campo obligatorio inicializado con `solicitudState.vinculacionRegistroCancelado`.
   * - `proveedoresListadoSAT`: Campo obligatorio inicializado con `solicitudState.proveedoresListadoSAT`.
   * - `numeroAutorizacionCITES`: Campo obligatorio con validación de patrón regex (`REGEX_RFC`).
   * - `archivoNacionales`: Campo opcional inicializado como una cadena vacía.
   */
  public crearComunesDosFormulario(): void {
    this.comunesDosForm = this.fb.group({
        comboBimestresIDCSeleccione:[this.solicitudState?.comboBimestresIDCSeleccione],
        ingresar: [this.solicitudState?.ingresar, Validators.required],
        encuentraSus: [this.solicitudState?.encuentraSus, Validators.required],
        registrosQue:[this.solicitudState?.registrosQue],
        registrosQue2:[this.solicitudState?.registrosQue2],
        registrosQue3:[this.solicitudState?.registrosQue3],
        momentoIngresar: [this.solicitudState?.momentoIngresar, Validators.required],
        indiqueCuenta: [this.solicitudState?.indiqueCuenta, Validators.required],
        indiqueCheck:[this.solicitudState?.indiqueCheck],
        nombreDel: [
          this.solicitudState?.nombreDel,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
            Validators.pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,-]*$/)
          ],
        ],
        lugarDeRadicacion: [
          this.solicitudState?.lugarDeRadicacion,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
            Validators.pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,-]*$/)
          ],
        ],
        contabilidad: [this.solicitudState?.contabilidad, Validators.required],
        rmfRadio: [this.solicitudState?.rmfRadio, Validators.required],
        vinculacionRegistroCancelado: [this.solicitudState?.vinculacionRegistroCancelado, Validators.required],
        proveedoresListadoSAT: [this.solicitudState?.proveedoresListadoSAT, Validators.required],
        numeroAutorizacionCITES: ['',[Validators.required,Validators.pattern(REGEX_RFC)]],
        archivoNacionales: [''],
        ensucaso: [this.solicitudState?.ensucaso],
        alMomento: [this.solicitudState?.alMomento],
        delMismomodo: [this.solicitudState?.delMismomodo],
        encuentra: [this.solicitudState?.encuentra],
        susCertificados: [this.solicitudState?.susCertificados],
        afirmativo: [this.solicitudState?.afirmativo],
        actualizado: [this.solicitudState?.actualizado]
    });
  }

  /**
   * Inicializa el FormGroup `instalacionesPrincipalesForm` con controles de formulario predeterminados
   * y sus respectivos valores iniciales.
   *
   * El formulario incluye los siguientes controles:
   * - `instalacionesPrincipales`: Representa las instalaciones principales (por defecto: cadena vacía).
   * - `municipioAlcaldia`: Representa el municipio o alcaldía (por defecto: cadena vacía).
   * - `tipoDeInstalacion`: Representa el tipo de instalación (por defecto: cadena vacía).
   * - `entidadFederative`: Representa la entidad federativa (por defecto: cadena vacía).
   * - `registroAnte`: Representa la autoridad de registro (por defecto: cadena vacía).
   * - `colonia`: Representa la colonia o barrio (por defecto: cadena vacía).
   * - `codigoPostal`: Representa el código postal (por defecto: cadena vacía).
   * - `procesoProductivo`: Representa el proceso productivo (por defecto: cadena vacía).
   * - `acreditacionDelUso`: Representa la acreditación del uso (por defecto: cadena vacía).
   */
  public crearInstalacionesPrincipalesFormulario(): void {
    this.instalacionesPrincipalesForm = this.fb.group({
      instalacionesPrincipales: [''],
      municipioAlcaldia: [''],
      tipoDeInstalacion: [''],
      entidadFederative: [''],
      registroAnte: [''],
      colonia: [''],
      codigoPostal: [''],
      procesoProductivo: [''],
      acreditacionDelUso: ['']
    });
  }

  /**
   * Inicializa el FormGroup `modificarForm` con controles de formulario predeterminados y sus valores iniciales.
   * El formulario incluye los siguientes controles:
   * - `nombreDelSistema`: Un campo de texto inicializado con una cadena vacía.
   * - `indiqueCheckSi`: Un campo de texto inicializado con una cadena vacía.
   * - `lugar`: Un campo de texto inicializado con una cadena vacía.
   *
   * Este método se utiliza para crear o restablecer la estructura del formulario para el componente.
   */
  public crearModificarForm(): void {
    this.modificarForm = this.fb.group({
      nombreDelSistema: ['', Validators.required],
      indiqueCheckSi: [''],
      lugar: ['', Validators.required]
    });
  }

  /**
   * Obtiene los datos del sector productivo para AGACE desde el servicio y los asigna a la propiedad `sectorProductivoAgace`.
   * 
   * Este método utiliza la llamada al servicio `datosComunesSvc.getProductivoDatos()` para recuperar los datos,
   * procesa la respuesta y asegura una limpieza adecuada de las suscripciones utilizando `takeUntil` con `destroyNotifier$`.
   * 
   * @remarks
   * La respuesta del servicio se analiza y se asigna a la propiedad `sectorProductivoAgace`.
   */
  public getSectorProductivoAgace(): void {
    this.datosComunesSvc.getProductivoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const API_DATOS = JSON.parse(JSON.stringify(response));
      this.sectorProductivoAgace = API_DATOS;
    });
  }

  /**
   * Obtiene los datos del combo de bimestres desde el servicio y los asigna a la propiedad `comboBimestresIDC`.
   * 
   * Este método se suscribe al observable `getComboBimestres` del servicio `datosComunesSvc`,
   * procesa la respuesta y extrae la propiedad `data` para poblar la variable `comboBimestresIDC`.
   * La suscripción se desuscribe automáticamente cuando el observable `destroyNotifier$` emite un valor.
   * 
   * @remarks
   * - La respuesta se copia profundamente utilizando `JSON.parse(JSON.stringify(response))` antes de extraer los datos.
   * - Asegúrese de que `datosComunesSvc` y `destroyNotifier$` estén correctamente inicializados antes de llamar a este método.
   */
  public getComboBimestres(): void {
    this.datosComunesSvc.getComboBimestres().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.comboBimestresIDC = DATOS;
    });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
    obtenerEntidadFederativaOpciones(): void {
      this.datosComunesSvc
        .getEntidadDatos()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          const DATOS = JSON.parse(JSON.stringify(data));
          this.entidadFederativa = DATOS;
        });
    }

  /**
   * Obtiene los datos principales de las instalaciones desde el servicio y actualiza los datos de la tabla.
   * 
   * Este método recupera los datos llamando al método `getInstalacionesPrincipalesDatos`
   * del servicio `datosComunesSvc`. La respuesta se procesa y se asigna a la propiedad
   * `instalacionesPrincipalesTablaDatos`. La suscripción se desuscribe automáticamente
   * cuando el observable `destroyNotifier$` emite un valor.
   * 
   * @returns {void}
   */
  public getInstalacionesPrincipalesTablaDatos(): void {
    this.datosComunesSvc.getInstalacionesPrincipalesDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.instalacionesPrincipalesTablaDatos = DATOS.data;
    });
  }

  /**
   * Obtiene los datos de control de inventarios desde el servicio y los asigna a la propiedad del componente.
   * Los datos se recuperan a través de una solicitud HTTP y se procesan como un observable.
   * 
   * @remarks
   * Este método utiliza el operador `takeUntil` para desuscribirse automáticamente del observable
   * cuando el `destroyNotifier$` emite un valor, evitando fugas de memoria.
   */
  public getControlInventariosDatos(): void {
    this.datosComunesSvc.getControlInventariosTabla().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.controlInentariosTablaDatos = DATOS;
    });
  }

  /**
   * Actualiza el `datosComunesStore` invocando un método especificado con el valor
   * obtenido de un campo de formulario dado.
   *
   * @param form - La instancia de `FormGroup` que contiene los controles del formulario.
   * @param campo - El nombre del control del formulario cuyo valor será obtenido.
   * @param metodoNombre - La clave del método en `DatosComunesStore` que será invocado.
   *                        Este método será llamado con el valor obtenido.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DatosComunesStore): void {
    const VALOR = form.get(campo)?.value;
    (this.datosComunesStore[metodoNombre] as (value: unknown) => void)(VALOR);

    /** Lista de nombres de controles tipo radio que deben emitir el evento radioChanged. 
     * Se utiliza para identificar los controles relevantes en el formulario. */
  const RADIO_CONTROLS = [
    'encuentraSus',
    'rmfRadio',
    'vinculacionRegistroCancelado',
    'proveedoresListadoSAT',
    'ingresar',
    'momentoIngresar',
    'indiqueCuenta',
    'contabilidad'
  ];

  /**
   * Si el campo modificado está incluido en la lista de controles tipo radio (`RADIO_CONTROLS`),
   * emite el evento `radioChanged` con el nombre del control y el valor seleccionado.
   *
   * Esto permite que los componentes padres reaccionen ante cambios en los botones de radio
   * relevantes del formulario.
   */
if (RADIO_CONTROLS.includes(campo)) {
  this.radioChanged.emit({ controlName: campo, value: VALOR });
}
  }

  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada.
   *
   * @param template - Un `TemplateRef` que define el contenido del modal.
   *                   Esto es típicamente una referencia de plantilla de Angular.

   */
  public abrirModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg',});
  }

  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada.
   *
   * @param template - Un `TemplateRef` que define el contenido del modal.
   *                   Esto es típicamente una referencia de plantilla de Angular.

   */
  public modificarRegistro(template: TemplateRef<void>): void {
    if (this.seleccionadaInstalacionesDatos) {
      this.abrirModal(template);
      this.instalacionesPrincipalesForm.patchValue({
        instalacionesPrincipales: this.seleccionadaInstalacionesDatos.instalacionesPrincipales,
        municipioAlcaldia: this.seleccionadaInstalacionesDatos.municipioODelegacion,
        tipoDeInstalacion: this.seleccionadaInstalacionesDatos.tipoDeInstalacion,
        entidadFederative: this.seleccionadaInstalacionesDatos.entidadFederativa,
        registroAnte: '',
        colonia: this.seleccionadaInstalacionesDatos.colonia,
        codigoPostal: '',
        procesoProductivo: '',
        acreditacionDelUso: ''
      })
    }
  }

  /** Almacena la fila seleccionada de la tabla de control de inventarios. */
  seleccionarControlInventarios(event: ControlInventarios): void {
    this.seleccionadaControlInventarios = event;
  }

  /** Almacena la fila seleccionada de la tabla de Principales. */
  onFilaSeleccionada(event: InstalacionesPrincipalesTablaInfo): void {
    this.seleccionadaInstalacionesDatos = event;
  }

  /** Valida el formulario de instalaciones principales y cierra el modal si es válido; de lo contrario, marca todos los campos como tocados. */
  instalacionesAceptar(): void {
    if (this.instalacionesPrincipalesForm.valid) {
      this.modalRef?.hide();
    } else {
      this.instalacionesPrincipalesForm.markAllAsTouched();
    } 
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), guarda el estado actual del formulario llamando a `guardarFormulario()`.
   * - De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario y alterna su estado habilitado/deshabilitado según la bandera de solo lectura.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), todos los formularios relacionados se deshabilitan.
   * De lo contrario, todos los formularios relacionados se habilitan para su edición.
   */
  public guardarFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.comunesDosForm.disable();
      this.instalacionesPrincipalesForm.disable();
      this.modificarForm.disable();
    } else {
      this.comunesDosForm.enable();
      this.instalacionesPrincipalesForm.enable();
      this.modificarForm.enable();
    }
  }

  /**
 * Actualiza la lista de instalaciones principales al cambiar la entidad federativa seleccionada.
 * @param event - Entidad federativa seleccionada.
 */
  onEntidadFederativaChange(event: Catalogo): void {
    if (event) {
      this.datosComunesSvc
        .getInstalacionesTablaDatos()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          this.instalacionesTablaDatos = data;
        });
    }
  }

  /**  Guarda la selección de socios hecha por el usuario.*/
  seleccionarlistaInstalaciones(evento: PrincipalesInstalaciones[]): void {
    this.seleccionarListaInstalaciones = evento;
  }

  /** Valida el formulario de instalaciones principales, cierra el modal si es válido y oculta el mensaje de error; de lo contrario, marca todos los campos como tocados. */
  instalacionesConfirm(): void {
    if (this.instalacionesPrincipalesForm.valid) {
      this.modalRef?.hide();
      this.mostrarMensajeError = false; 
    } else {
      this.instalacionesPrincipalesForm.markAllAsTouched();
    }
  }
  
  /** Valida el formulario de instalaciones principales, cierra el modal si es válido y oculta el mensaje de error; de lo contrario, marca todos los campos como tocados. */
  controlInventariosAgregar(): void {
    if (this.comunesDosForm.get('nombreDel')?.value && this.comunesDosForm.get('lugarDeRadicacion')?.value) {
      const DATOS = {
        nombreSistema: this.comunesDosForm.get('nombreDel')?.value,
        lugarRadicacion: this.comunesDosForm.get('lugarDeRadicacion')?.value,
        sistemaControlInventarios: this.comunesDosForm.get('indiqueCheck')?.value
      }
      this.controlInentariosTablaDatos = [...this.controlInentariosTablaDatos, DATOS];
      this.comunesDosForm.get('nombreDel')?.reset();
      this.comunesDosForm.get('lugarDeRadicacion')?.reset();
      this.comunesDosForm.get('indiqueCheck')?.reset();
    } else {
      this.comunesDosForm.get('nombreDel')?.markAsTouched();
      this.comunesDosForm.get('lugarDeRadicacion')?.markAsTouched();
      this.comunesDosForm.get('indiqueCheck')?.markAsTouched();
    }
  }

  /** Abre el modal para modificar el registro de control de inventarios y carga los datos seleccionados en el formulario. */
  modificarControlInventarios(template: TemplateRef<void>): void {
    if (this.seleccionadaControlInventarios) {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered' });
      this.modificarForm.patchValue({
        nombreDelSistema: this.seleccionadaControlInventarios.nombreSistema,
        lugar: this.seleccionadaControlInventarios.lugarRadicacion,
        indiqueCheckSi: this.seleccionadaControlInventarios.sistemaControlInventarios
      });
    }
  }


  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a las suscripciones que deben desuscribirse.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


}
