import { AGREGAR_MIEMBRO_TABLA, DATOS_COMUNES_TEXTOS, DATOS_COMUNES_TEXTOS_DOS, Miembro } from '../../models/datos-comunes.model';
import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputCheckComponent, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosComunesState, DatosComunesStore } from '../../estados/stores/datos-comunes.store';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosComunesDosComponent } from '../datos-comunes-dos/datos-comunes-dos.component';
import { DatosComunesQuery } from '../../estados/queries/datos-comunes.query';
import { DatosComunesService } from '../../services/datos-comunes.service';
import { FederalDeTrabajaoComponent } from '../federal-de-trabajao/federal-de-trabajao.component';
import { TituloComponent } from "@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component";
import dinamicaradio from '@libs/shared/theme/assets/json/31602/dinamica-radio-datos.json';
import radio_si_no from '@libs/shared/theme/assets/json/31601/radio_si_no.json';

/**
 * Componente que representa la funcionalidad compartida de datos comunes.
 * Este componente es responsable de gestionar formularios, obtener datos y manejar
 * interacciones del usuario relacionadas con los datos comunes en la aplicación.
 */
@Component({
  selector: 'shared-datos-comunes',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    InputCheckComponent,
    CatalogoSelectComponent,
    AlertComponent,
    FederalDeTrabajaoComponent,
    DatosComunesDosComponent,
    TituloComponent,
    TablaDinamicaComponent
],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
export class DatosComunesComponent implements OnInit, OnDestroy {

  /**
   * Esta propiedad de entrada recibe un valor de tipo string que representa el identificador
   * único o número del trámite. Se utiliza para mostrar o procesar información
   * relacionada con un trámite específico dentro del componente.
   *
   * @example
   * <app-datos-comunes [procedureNumero]="'12345'"></app-datos-comunes>
   */
  @Input() procedureNumero: string = '';
  /**
   * Indica si el trámite está actualmente activo.
   * 
   * @remarks
   * Esta propiedad de entrada controla el estado activo del trámite.
   * 
   * @defaultValue false
   */
  @Input() procedureActivo: boolean = false;
  /**
   * Representa el objeto de datos comunes utilizado en el componente.
   * 
   * @property tieneProcedure - Contiene información sobre un trámite.
   * @property tieneProcedure.numero - El número del trámite como cadena.
   * @property tieneProcedure.activo - Indica si el trámite está activo.
   */
  public datosComunesObj = {
    tieneProcedure: { numero: '', activo: false }
  }
  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar
   * los campos de datos comunes dentro del componente. Este grupo de
   * formulario se inicializa y configura para manejar la entrada del
   * usuario y la lógica de validación para datos compartidos/comunes.
   */
  public comunesForm!: FormGroup;
  /**
   * Instancia de FormGroup reactivo para gestionar y validar los campos del formulario "manifestado".
   * Inicializado en el ciclo de vida del componente, este FormGroup contiene controles y lógica de validación
   * para la entrada del usuario relacionada con la sección "manifestado".
   */
  public manifestadoForm!: FormGroup;
  /**
   * Grupo de formulario utilizado para gestionar y validar los datos para agregar un miembro a la empresa.
   */
  public agregarMiembroDeLaEmpresaFrom!: FormGroup;
  /**
   * Una propiedad pública que contiene el valor de `dinamicaradio`.
   * Esta propiedad probablemente se utiliza para gestionar o hacer referencia
   * a la funcionalidad o datos de botones de radio dinámicos dentro del componente.
   */
  public dinamicaRadio = dinamicaradio;
  /**
   * Un subject utilizado para notificar y completar las suscripciones cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier suscripción en curso
   * vinculada a este notifier sea correctamente desuscrita.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Represents the options for a radio button group, typically used to indicate
   * a "Yes" or "No" selection.
   */
  public radioOptions = radio_si_no;
  /**
   * Representa una colección de sectores productivos relacionados con AGACE.
   * Este arreglo contiene elementos del tipo `Catalogo`, que pueden incluir
   * información sobre varios sectores en el contexto de la aplicación.
   */
  public sectorProductivoAgace: Catalogo[] = [];
  /**
   * Un arreglo de objetos `Catalogo` que representa los servicios disponibles en AGACE.
   * Esta propiedad se utiliza para almacenar y gestionar el catálogo de servicios.
   */
  public serviciosAgace: Catalogo[] = [];
  /**
   * Una constante pública que contiene los datos de texto comunes utilizados en toda la aplicación.
   * Esto se inicializa con el valor de `DATOS_COMUNES_TEXTOS`.
   */
  public TEXTOS = DATOS_COMUNES_TEXTOS;
  /**
   * Un arreglo de objetos `Catalogo` que representa las opciones disponibles para los bimestres en el contexto de IDC.
   * Esto se utiliza para llenar un componente de selección o desplegable.
   */
  public comboBimestresIDC: Catalogo[] = [];
  /**
   * Una constante que contiene el valor de `DATOS_COMUNES_TEXTOS_DOS`.
   * Esto se utiliza para almacenar datos textuales compartidos para el componente.
   */
  public TEXTOSDOS = DATOS_COMUNES_TEXTOS_DOS;
  /**
   * Represents the CSS class used to style an alert element.
   */
  public infoAlert = 'alerta-peligro';
  /**
   * Representa el estado de los cambios para un objeto específico.
   * 
   * @property {boolean} empleadosPropios - Indica si el objeto tiene empleados propios.
   * @property {boolean} deTrabajao - Indica si el objeto está relacionado con el trabajo.
   * @property {string} obligadoaTributaren - Especifica la obligación de pagar impuestos en una ubicación determinada.
   */
  public cambioObj = {
    empleadosPropios: false,
    deTrabajao: false,
    obligadoaTributaren: '',
  };
  /**
   * Representa el modo de selección para un componente de tabla, específicamente utilizando casillas de verificación.
   * Esta propiedad se asigna con un valor del enumerado `TablaSeleccion`, indicando
   * que las filas de la tabla pueden ser seleccionadas mediante casillas de verificación.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Configuración para la tabla de miembros (`Miembro`).
   * Esta propiedad define la configuración de las columnas para la tabla utilizando el tipo `ConfiguracionColumna`.
   * La configuración se inicializa con la constante `AGREGAR_MIEMBRO_TABLA`.
   */
  public agregarMiembroTabla: ConfiguracionColumna<Miembro>[] = AGREGAR_MIEMBRO_TABLA;
  /**
   * Un arreglo para almacenar miembros del tipo `Miembro` para los datos de la tabla.
   * Esto se utiliza para gestionar y mostrar los miembros en el componente.
   */
  public agregarMiembroTablaDatos: Miembro[] = [];
  /**
   * Una referencia a la instancia del modal creada utilizando el `BsModalService`.
   * Esto se puede usar para controlar el modal, como cerrarlo programáticamente.
   * @type {BsModalRef | undefined}
   */
  modalRef?: BsModalRef;
  /**
   * Representa las opciones disponibles para el campo "En Su Carácter De".
   * Este arreglo se llena con elementos del tipo `Catalogo`.
   */
  public enSuCaracterDeOptions: Catalogo[] = [];
  /**
   * Un arreglo de opciones que representa diferentes nacionalidades.
   * Cada opción es un objeto del tipo `Catalogo`.
   */
  public nacionalidadOptions: Catalogo[] = [];
  /**
   * Representa una colección de entradas de catálogo relacionadas con el tipo de persona.
   * Este arreglo se utiliza para almacenar y gestionar datos de diferentes categorías o clasificaciones
   * de individuos, como personas morales o físicas.
   */
  public tipoDePersona: Catalogo[] = [];
  /**
   * Representa el estado de la sección "Datos Comunes".
   * Esta propiedad se utiliza para gestionar y almacenar el estado
   * de los datos compartidos dentro del componente.
   */
  public solicitudState!: DatosComunesState;
  /**
   * Representa el estado actual del proceso de consulta.
   */
  public consultaState!: ConsultaioState;
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
  /**
 * Evento que emite cambios en la visualización de importaciones.
 * Emite un valor booleano indicando si mostrar u ocultar.
 */
  @Output() mostrarImportacionesChange = new EventEmitter<boolean>();
  /**
  * Evento que emite cambios en la visualización de depósitos fiscales.
  * Emite un valor booleano indicando si mostrar u ocultar.
  */
  @Output() mostrarDepositoFiscalChange = new EventEmitter<boolean>();
  /**
  * Evento que emite cambios en la visualización de registros en elaboración.
  * Emite un valor booleano indicando si mostrar u ocultar.
  */
  @Output() mostrarElaboracionChange = new EventEmitter<boolean>();
  /**
  * Evento que emite cambios en la visualización de registros del recinto.
  * Emite un valor booleano indicando si mostrar u ocultar.
  */
  @Output() mostrarRecintoChange = new EventEmitter<boolean>();

  /** Indica si se debe mostrar el mensaje de error para el campo de empleados propios. */
  public mostrarEmpPropiosError: boolean = false;

  /**
   * Constructor de la clase DatosComunesComponent.
   * 
   * @param datosComunesSvc - Servicio para manejar operaciones de datos comunes.
   * @param modalService - Servicio para gestionar diálogos modales.
   * @param fb - Instancia de FormBuilder para crear y gestionar formularios reactivos.
   * @param datosComunesStore - Store para gestionar el estado de los datos comunes.
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
   * - Llama a métodos para obtener datos del sector productivo, servicios y datos adicionales de la tabla de miembros.
   * - Inicializa formularios para datos comunes y para agregar miembros.
   * - Recupera datos adicionales de miembros.
   * 
   * La suscripción a `selectSolicitud$` se desuscribe automáticamente cuando el componente es destruido utilizando el subject `destroyNotifier$`.
   */
  ngOnInit(): void {
    this.datosComunesQuery.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
      this.solicitudState = seccionState;
    })).subscribe();
    this.datosComunesObj.tieneProcedure.numero = this.procedureNumero;
    this.datosComunesObj.tieneProcedure.activo = this.procedureActivo;
    this.getComboBimestres();
    this.getSectorProductivoAgace();
    this.getServiciosAgace();
    this.getAgregarMiembroTablaDatos();
    this.crearComunesForm();
    this.crearAgregarMiembroForm();
    this.obtenerAgregarMiembroDatos();
    this.crearManifestadoForm();
    this.inicializarEstadoFormulario();
    this.obtenerEnSuCaracterDeOpciones();
    this.obtenerTipoDePersonaOpciones();
    this.obtenerNacionalidadOpciones();
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerEnSuCaracterDeOpciones(): void {
    this.datosComunesSvc
      .getEnSuCaracterDeDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.enSuCaracterDeOptions = data;
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerTipoDePersonaOpciones(): void {
    this.datosComunesSvc
      .getTipoDePersonaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tipoDePersona = data;
      });
  }

  /** Obtiene las opciones de nacionalidad desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerNacionalidadOpciones(): void {
    this.datosComunesSvc
      .getNacionalidadDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.nacionalidadOptions = data;
      });
  }


  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
    public inicializarFormulario(): void {
      this.datosComunesQuery.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
      })).subscribe();

        this.crearComunesForm();
        this.crearAgregarMiembroForm();
        this.crearManifestadoForm();
    }

  /**
   * Inicializa el FormGroup `comunesForm` con un conjunto de controles de formulario y sus valores
   * predeterminados derivados del objeto `solicitudState`. Cada control de formulario se configura
   * con validadores opcionales para aplicar reglas específicas de validación.
   *
   * Controles del Formulario:
   * - `autorizacionIVAIEPS`: Un campo obligatorio para la autorización de IVA/IEPS.
   * - `regimenUno`: Representa el primer régimen, opcional.
   * - `regimenDos`: Representa el segundo régimen, opcional.
   * - `regimenTres`: Representa el tercer régimen, opcional.
   * - `sectorProductivo`: Representa el sector productivo, opcional.
   * - `servicio`: Representa el servicio, opcional.
   * - `preOperativo`: Un campo obligatorio que indica el estado preoperativo.
   * - `indiqueSi`: Un campo obligatorio para una indicación específica.
   * - `senale`: Un campo obligatorio para una señal específica.
   * - `empPropios`: Representa el número de empleados propios, con una longitud máxima de 8 caracteres.
   * - `bimestre`: Representa el bimestre, opcional.
   * - `senaleSi`: Un campo obligatorio para la confirmación de una señal específica.
   * - `seMomento`: Un campo obligatorio para un momento específico.
   * - `encuentra`: Un campo obligatorio que indica un hallazgo específico.
   * - `delMismo`: Un campo obligatorio que indica una relación específica.
   * - `senaleMomento`: Un campo obligatorio para señalar un momento específico.
   * - `enCaso`: Un campo obligatorio para un caso específico.
   *
   * Este método se utiliza para configurar la estructura del formulario y la lógica de validación
   * para el componente.
   */
  public crearComunesForm(): void {
    this.comunesForm = this.fb.group({
      autorizacionIVAIEPS: [this.solicitudState?.autorizacionIVAIEPS, Validators.required],
      regimenUno:[this.solicitudState?.regimenUno],
      regimenDos:[this.solicitudState?.regimenDos],
      regimenTres:[this.solicitudState?.regimenTres],
      regimenCuatro:[this.solicitudState?.regimenCuatro],
      sectorProductivo:[this.solicitudState?.sectorProductivo],
      servicio:[this.solicitudState?.servicio],
      preOperativo: [this.solicitudState?.preOperativo, Validators.required],
      indiqueSi: [this.solicitudState?.indiqueSi, Validators.required],
      senale: [this.solicitudState?.senale, Validators.required],
      empPropios:[this.solicitudState?.empPropios,Validators.maxLength(8)],
      bimestre:[this.solicitudState?.bimestre],
      senaleSi: [this.solicitudState?.senaleSi, Validators.required],
      cumpleCon: [this.solicitudState?.cumpleCon, Validators.required],
      cumpleConDos: [this.solicitudState?.cumpleConDos, Validators.required],
      acreditaRealizar: [this.solicitudState?.acreditaRealizar, Validators.required],
      seMomento: [this.solicitudState?.seMomento, Validators.required],
      encuentra: [this.solicitudState?.encuentra, Validators.required],
      delMismo: [this.solicitudState?.delMismo, Validators.required],
      senaleMomento: [this.solicitudState?.senaleMomento, Validators.required],
      enCaso: [this.solicitudState?.enCaso, Validators.required]
    });
  }

  /**
   * Inicializa el FormGroup `manifestadoForm` con controles para `manifestado` y `protesta`.
   * Los valores iniciales de estos controles se toman del `solicitudState` actual.
   */
  public crearManifestadoForm(): void {
    this.manifestadoForm = this.fb.group({
      manifestado: [this.solicitudState?.manifestado],
      protesta: [this.solicitudState?.protesta],
    });
  }

  /**
   * Inicializa el grupo de formulario `agregarMiembroDeLaEmpresaFrom` con controles
   * y sus respectivos valores predeterminados, reglas de validación y estados.
   * 
   * El formulario incluye los siguientes controles:
   * - `enSuCaracterde`: Un campo obligatorio para especificar el rol o capacidad.
   * - `obligadoaTributarenMexico`: Un campo obligatorio que indica obligaciones fiscales en México.
   * - `nacionalidad`: Un campo obligatorio para especificar la nacionalidad.
   * - `registroFederaldeContribuyentes`: Un campo obligatorio y deshabilitado para el Registro Federal de Contribuyentes.
   * - `rfc`: Un campo obligatorio para el RFC (Registro Federal de Contribuyentes).
   * - `nombreCompleto`: Un campo obligatorio y deshabilitado para el nombre completo.
   */
  public crearAgregarMiembroForm(): void {
    this.agregarMiembroDeLaEmpresaFrom = this.fb.group({
      enSuCaracterDe: [''],
      obligadoaTributarenMexico: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      registroFederaldeContribuyentes: [
        { value: '', disabled: true },
        Validators.required,
      ],
      rfc: ['', [Validators.required]],
      nombreCompleto: [
        { value: '', disabled: true },
        Validators.required,
      ],
      tipoDePersona: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombreDeLaEmpresa: ['', Validators.required]
    });
  }

  /**
   * Rellena los campos del formulario en `agregarMiembroDeLaEmpresaFrom` con valores predefinidos.
   * 
   * Este método establece valores predeterminados para varios campos en el formulario, incluyendo:
   * - `enSuCaracterde`: Establece el valor a '1'.
   * - `obligadoaTributarenMexico`: Establece el valor a 'Si'.
   * - `nacionalidad`: Establece el valor a '1'.
   * - `registroFederaldeContribuyentes`: Establece el valor a 'HEJE780514BVA'.
   * - `rfc`: Establece el valor a 'CDGFN780514BVA'.
   * - `nombreCompleto`: Establece el valor a 'ERNESTO HERNÁNDEZ URI'.
   * Este método es útil para inicializar el formulario con datos predeterminados.
   */
  public obtenerAgregarMiembroDatos(): void {
    this.agregarMiembroDeLaEmpresaFrom.get('enSuCaracterde')?.setValue('1');
    this.agregarMiembroDeLaEmpresaFrom.get('obligadoaTributarenMexico')?.setValue('Si');
    this.agregarMiembroDeLaEmpresaFrom.get('nacionalidad')?.setValue('1');
    this.agregarMiembroDeLaEmpresaFrom.get('registroFederaldeContribuyentes')?.setValue('HEJE780514BVA');
    this.agregarMiembroDeLaEmpresaFrom.get('rfc')?.setValue('CDGFN780514BVA');
    this.agregarMiembroDeLaEmpresaFrom.get('nombreCompleto')?.setValue('ERNESTO HERNÁNDEZ URI');
  }

  /**
   * Recupera los datos del sector productivo para AGACE y los asigna a la propiedad `sectorProductivoAgace`.
   * 
   * Este método utiliza el servicio `datosComunesSvc.getProductivoDatos()` para obtener los datos,
   * procesa la respuesta y asegura la limpieza adecuada de las suscripciones utilizando `takeUntil` con `destroyNotifier$`.
   */
  public getSectorProductivoAgace(): void {
    this.datosComunesSvc.getProductivoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      this.sectorProductivoAgace = JSON.parse(JSON.stringify(response));
    });
  }

  /**
   * Obtiene los datos de servicios de AGACE desde el servicio `datosComunesSvc`.
   * Se suscribe al observable y asigna la respuesta a la propiedad `serviciosAgace`.
   * La suscripción se desuscribe automáticamente cuando `destroyNotifier$` emite un valor.
   */
  public getServiciosAgace(): void {
    this.datosComunesSvc.getServiciosAgaceDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      this.serviciosAgace = JSON.parse(JSON.stringify(response));
    });
  }

  /**
   * Recupera los datos para agregar un miembro a la tabla y los asigna a la propiedad `agregarMiembroTablaDatos`.
   * 
   * Este método se suscribe al observable `getAgregarMiembroTabla` del servicio `datosComunesSvc`,
   * procesa la respuesta y actualiza el estado del componente. La suscripción se desuscribe automáticamente
   * cuando el observable `destroyNotifier$` emite un valor, asegurando una limpieza adecuada.
   * 
   * @remarks
   * La respuesta se copia profundamente utilizando `JSON.parse(JSON.stringify(response))` antes de ser asignada a
   * `agregarMiembroTablaDatos`.
   */
  public getAgregarMiembroTablaDatos(): void {
    this.datosComunesSvc.getAgregarMiembroTabla().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.agregarMiembroTablaDatos = DATOS;
    });
  }

  /**
   * Maneja los cambios en las selecciones de botones de radio y actualiza las propiedades correspondientes
   * en el objeto `cambioObj` basado en el valor y el nombre proporcionados.
   *
   * @param value - El valor seleccionado del botón de radio, que puede ser una cadena o un número.
   *                Generalmente, se espera que sea 'Si' u otro valor.
   * @param nombre - El nombre de la propiedad en `cambioObj` que se actualizará. 
   *                 Los valores esperados son:
   *                 - 'empleadosPropios': Actualiza `cambioObj.empleadosPropios` como un booleano.
   *                 - 'deTrabajao': Actualiza `cambioObj.deTrabajao` como un booleano.
   *                 - 'obligadoaTributaren': Actualiza `cambioObj.obligadoaTributaren` como una cadena ('Si' o 'No').
   */
  public onRadioCambio(value: string | number,nombre:string): void {
    if(nombre === 'empleadosPropios') {
      this.cambioObj.empleadosPropios = value === 'Si' ? true : false;
    }
    if(nombre === 'deTrabajao') {
      this.cambioObj.deTrabajao = value === 'Si' ? true : false;
    }
    if(nombre === 'obligadoaTributaren') {
      this.cambioObj.obligadoaTributaren = value === 'Si' ? 'Si' : 'No';
    }
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

  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada.
   * @param template - Un `TemplateRef` que define el contenido del modal.
   *                   Esta plantilla se mostrará dentro del cuadro de diálogo modal.
   * @remarks
   * El modal se muestra con una clase CSS de 'modal-lg' para aplicar un estilo específico.
   * Este método utiliza el `modalService` para crear y gestionar la instancia del modal.
   */
  public abrirModal(template: TemplateRef<void>, type?: string): void {
    if (type === 'agregar') {
      this.modalRef = this.modalService.show(template, { class: 'modal-xl modal-dialog-centered', });
    } else {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered', });
    }
  }

  /**
   * Actualiza el store con un valor obtenido de un campo específico del formulario.
   *
   * @param form - La instancia de FormGroup que contiene los controles del formulario.
   * @param campo - El nombre del control del formulario cuyo valor será obtenido.
   * @param metodoNombre - La clave del método en el `DatosComunesStore` que será invocado
   *                       para actualizar el store con el valor obtenido.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DatosComunesStore): void {
    const VALOR = form.get(campo)?.value;
    (this.datosComunesStore[metodoNombre] as (value: unknown) => void)(VALOR);

    if (campo === 'empPropios' && VALOR) {
      this.mostrarEmpPropiosError = true;
    }

    if (campo === 'bimestre' && VALOR) {
      this.mostrarEmpPropiosError = false;
    }

  /**
  * Emite un evento para actualizar la visualización de importaciones
  * según el valor del campo 'regimenUno' del formulario.
  */
   if (campo === 'regimenUno') {
    this.mostrarImportacionesChange.emit(Boolean(form.get('regimenUno')?.value));
  }
  /**
  * Emite un evento para actualizar la visualización de depósitos fiscales
  * según el valor del campo 'regimenDos' del formulario.
  */
    if (campo === 'regimenDos') {
    this.mostrarDepositoFiscalChange.emit(Boolean(form.get('regimenDos')?.value));
  }
  /**
  * Emite un evento para actualizar la visualización de registros en elaboración
  * según el valor del campo 'regimenTres' del formulario.
  */
   if (campo === 'regimenTres') {
    this.mostrarElaboracionChange.emit(Boolean(form.get('regimenTres')?.value));
  }
  /**
  * Emite un evento para actualizar la visualización de registros del recinto
  * según el valor del campo 'regimenCuatro' del formulario.
  */
    if (campo === 'regimenCuatro') {
    this.mostrarRecintoChange.emit(Boolean(form.get('regimenCuatro')?.value));
  }

/** Lista de nombres de controles tipo radio que deben emitir el evento radioChanged. 
 * Se utiliza para identificar los controles relevantes en el formulario. */
  const RADIO_CONTROLS = [
    'autorizacionIVAIEPS',
    'encuentra',
    'delMismo',
    'enCaso',
    'preOperativo',
    'indiqueSi',
    'senale',
    'senaleSi',
    'senaleMomento'
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
 * Método que emite el evento `radioChanged` cuando se produce un cambio en un control tipo radio.
 *
 * Este método permite propagar el evento hacia los componentes padres, enviando un objeto
 * que contiene el nombre del control (`controlName`) y el valor seleccionado (`value`).
 *
 * @param event Objeto con el nombre del control y el valor seleccionado.
 */
onRadioChanged(event: { controlName: string, value: unknown }):void {
  this.radioChanged.emit(event);
}

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
    this.cambioObj.empleadosPropios = this.comunesForm.get('senale')?.value === 'Si' ? true : false;
    this.cambioObj.deTrabajao = this.comunesForm.get('senaleSi')?.value === 'Si' ? true : false;
  }

  /**
   * Inicializa el formulario y alterna su estado habilitado/deshabilitado según la bandera de solo lectura.
   */
  public guardarFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.comunesForm.disable();
      this.agregarMiembroDeLaEmpresaFrom.disable();
    } else {
      this.comunesForm.enable();
      this.agregarMiembroDeLaEmpresaFrom.enable();
    }
  }

  /** Agrega un nuevo miembro a la tabla con los datos capturados en el formulario y cierra el modal. */
  public miembroModalAceptar(): void {
    const DATOS = {
      tipoDePersona: DatosComunesComponent.obtenerDescripcion(this.tipoDePersona, this.agregarMiembroDeLaEmpresaFrom.get('tipoDePersona')?.value),
      nombre: this.agregarMiembroDeLaEmpresaFrom.get('nombre')?.value,
      rfc: this.agregarMiembroDeLaEmpresaFrom.get('rfc')?.value,
      caracter: DatosComunesComponent.obtenerDescripcion(this.enSuCaracterDeOptions, this.agregarMiembroDeLaEmpresaFrom.get('enSuCaracterDe')?.value),
      nacionalidad: DatosComunesComponent.obtenerDescripcion(this.nacionalidadOptions, this.agregarMiembroDeLaEmpresaFrom.get('nacionalidad')?.value),
      obligadoTributar: this.agregarMiembroDeLaEmpresaFrom.get('obligadoaTributarenMexico')?.value,
      nombreEmpresa: this.agregarMiembroDeLaEmpresaFrom.get('nombreCompleto')?.value
    };
    this.agregarMiembroTablaDatos = [...this.agregarMiembroTablaDatos, DATOS];
    this.modalRef?.hide();
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

  /** Busca el RFC ingresado y asigna los datos simulados de registro y nombre completo al formulario si existe un valor. */
  buscarRFC(): void {
    if (this.agregarMiembroDeLaEmpresaFrom.get('rfc')?.value) {
      this.agregarMiembroDeLaEmpresaFrom.patchValue({
        registroFederaldeContribuyentes: this.agregarMiembroDeLaEmpresaFrom.get('rfc')?.value,
        nombreCompleto: 'QAS'
      });
    }
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a los suscriptores que se desuscriban y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
