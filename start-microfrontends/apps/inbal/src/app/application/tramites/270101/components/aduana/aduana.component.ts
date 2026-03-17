import {
  ADUANA_ALERT,
  CONFIGURACION_ADUANA_DE_TABLA,
  ERROR_FORMA_ALERT,
  ITINERARIO_DE_EXPORTACION,
  ITINERARIO_DE_EXPORTACION_MAXIMO
} from '../../constantes/exportar-ilustraciones.enum';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ModeloDeFormaDinamica,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  Validadores,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ExportarIlustraciones270101State,
  Tramite270101Store,
} from '../../../../estados/tramites/270101/tramite270101.store';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AduanaDeSalida } from '../../models/exportar-ilustraciones.model';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Modal } from 'bootstrap';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
import { ValidadoresDeFormulariosComponent } from '@libs/shared/data-access-user/src/tramites/components/validadores-de-formularios/validadores-de-formularios/validadores-de-formularios.component';

/**
 * @component AduanaComponent
 * @selector aduana
 * @description
 * Este componente es responsable de gestionar y renderizar los datos relacionados con la aduana de salida
 * en el proceso de exportación de obras de arte. Incluye formularios dinámicos, tablas configurables y modales
 * para la interacción del usuario.
 *
 * Funcionalidades principales:
 * - Renderiza un formulario dinámico basado en la configuración definida en `ITINERARIO_DE_EXPORTACION`.
 * - Muestra una tabla dinámica con los datos de itinerarios y transportación.
 * - Gestiona la apertura y cierre de modales para agregar o confirmar datos.
 * - Valida los campos del formulario utilizando el servicio `ValidacionesFormularioService`.
 * - Obtiene datos relacionados con aduanas y tipos de traslado desde el servicio `ExportarIlustracionesService`.
 *
 * Componentes importados:
 * - `FormasDinamicasComponent`: Componente para renderizar formularios dinámicos.
 * - `TituloComponent`: Componente para mostrar títulos en el formulario.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * - `ValidadoresDeFormulariosComponent`: Componente para manejar validaciones de formularios.
 * - `AlertComponent`: Componente para mostrar alertas.
 * - `TablaDinamicaComponent`: Componente para mostrar tablas dinámicas.
 *
 * @templateUrl ./aduana.component.html
 * @styleUrl ./aduana.component.scss
 */
@Component({
  selector: 'aduana',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ValidadoresDeFormulariosComponent,
    AlertComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './aduana.component.html',
  styleUrl: './aduana.component.scss',
})
export class AduanaComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /**
   * @property registroAlert
   * @type {string}
   * @description
   * Esta propiedad almacena el mensaje de alerta relacionado con la información de la obra de arte.
   * El valor de esta propiedad se obtiene de la constante `ERROR_DE_REGISTRO_ALERT`, que contiene el contenido
   * predefinido para mostrar en el componente de alerta.
   *
   * @example
   * console.log(this.registroAlert);
   * // Muestra el contenido de la alerta configurada en `ERROR_DE_REGISTRO_ALERT`.
   */
  public formaErrorAlert = ERROR_FORMA_ALERT;
  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalAduana') modal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /** Variable que controla el estado del modal de confirmación (abierto o cerrado).
   * @type {string}
   * @memberof DatosDelTramiteComponent
   */
  public modalConfirmacion: string = 'modal';

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof AduanaComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public forma: FormGroup = new FormGroup({
    aduana: new FormControl('', Validators.required),
    extentoPago: new FormControl(false),
  });

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof AduanaComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public modalForma: FormGroup = new FormGroup({
    itinerarioFormGroup: new FormGroup({}),
    itinerarioMaximoFormGroup: new FormGroup({}),
  });

  /**
   * compo doc
   * @getter ninoFormGroup
   * @description
   * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
   * dentro del formulario reactivo principal `forma`.
   * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
   *
   * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
   *
   * @example
   * const grupo = this.ninoFormGroup;
   * grupo.get('campo').setValue('nuevo valor');
   */
  get itinerarioFormGroup(): FormGroup {
    return this.modalForma.get('itinerarioFormGroup') as FormGroup;
  }

  /**
   * compo doc
   * @getter ninoFormGroup
   * @description
   * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
   * dentro del formulario reactivo principal `forma`.
   * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
   *
   * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
   *
   * @example
   * const grupo = this.ninoFormGroup;
   * grupo.get('campo').setValue('nuevo valor');
   */
  get itinerarioMaximoFormGroup(): FormGroup {
    return this.modalForma.get('itinerarioMaximoFormGroup') as FormGroup;
  }

  /**
   * @property {Catalogo[]} aduanaData
   * @description
   * Almacena los datos relacionados con las fracciones arancelarias.
   * @default []
   */
  public aduanaData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} transporteData
   * @description
   * Almacena los datos relacionados con las fracciones arancelarias.
   * @default []
   */
  public transporteData: Catalogo[] = [];

  /**
   * @property validadores
   * @type {Validadores[]}
   * @description
   * Esta propiedad define un conjunto de validadores utilizados para validar los campos del formulario.
   * Cada validador incluye el tipo de validación, un valor asociado (si aplica) y un mensaje de error
   * que se muestra cuando la validación falla.
   *
   * Funcionalidad:
   * - Valida los campos del formulario asegurándose de que cumplan con los requisitos especificados.
   * - Muestra un mensaje de error personalizado si el campo no cumple con la validación.
   *
   * @example
   * public validadores: Validadores[] = [
   *   { tipo: 'required', valor: '', mensaje: 'Este campo es obligatorio' }
   * ];
   */
  public validadores: Validadores[] = [
    { tipo: 'required', valor: '', mensaje: 'Este campo es obligatorio' },
  ];

  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * @property alertInformacion
   * @type {string}
   * @description
   * Esta propiedad almacena el mensaje de alerta relacionado con la información de la obra de arte.
   * El valor de esta propiedad se obtiene de la constante `ADUANA_ALERT`, que contiene el contenido
   * predefinido para mostrar en el componente de alerta.
   *
   * @example
   * console.log(this.aduanaAlert);
   * // Muestra el contenido de la alerta configurada en `ADUANA_ALERT`.
   */
  public aduanaAlert = ADUANA_ALERT;

  /**
   * Configuración de la tabla de selección.
   */
  public tablaSeleccion = TablaSeleccion;

  /**
   * Configuración de la tabla.
   */
  public configuracionTabla = CONFIGURACION_ADUANA_DE_TABLA;
  /**
   * Datos configurados para la tabla.
   */
  public configuracionTablaDatos: AduanaDeSalida[] = [];

  /**
   * Datos configurados para la tabla.
   */
  public datosSeleccionados: AduanaDeSalida[] = [];

  /**
   * compo doc
   * @property itinerarioFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `ITINERARIO_DE_EXPORTACION`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public itinerarioFormData = ITINERARIO_DE_EXPORTACION;

  /**
   * compo doc
   * @property itinerarioMaximoFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `ITINERARIO_DE_EXPORTACION_MAXIMO`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public itinerarioMaximoFormData = ITINERARIO_DE_EXPORTACION_MAXIMO;

  /**
   * @property mostrarError
   * @type {boolean}
   * @description
   * Esta propiedad controla la visibilidad de los mensajes de error en el componente.
   * Se utiliza para indicar si se debe mostrar un mensaje de error relacionado con la validación
   * o el estado del formulario.
   *
   * Funcionalidad:
   * - Cuando es `true`, se muestra un mensaje de error en el componente.
   * - Cuando es `false`, no se muestra ningún mensaje de error.
   *
   * @default false
   *
   * @example
   * this.mostrarError = true;
   * // Activa la visualización de mensajes de error.
   */
  public mostrarError: boolean = false;

  /**
   * Estado de la solicitud de la sección 301.
   * @type {ExportarIlustraciones270101State}
   * @memberof MotivoDeLaExportacionComponent
   */
  public exportarIlustracionesState!: ExportarIlustraciones270101State;

  /**
   * compo doc
   * @output formularioEventoEmitir
   * @type {EventEmitter}
   * @memberof AduanaComponent
   * @description
   * Este es un EventEmitter que emite un evento cuando se hace clic en un botón
   * asociado a un campo dinámico del formulario. El evento emite un objeto de tipo
   * `ModeloDeFormaDinamica`, que contiene información sobre el campo dinámico
   * relacionado con el botón clicado.
   */
  @Output() formularioEventoEmitir: EventEmitter<FormGroup> =
    new EventEmitter();

  /**
   * @constructor
   * @description
   * Este constructor inicializa el componente `AduanaComponent` e inyecta los servicios necesarios
   * para gestionar los datos y el estado del formulario relacionado con la aduana de salida.
   *
   * Servicios inyectados:
   * - `ExportarIlustracionesService`: Servicio utilizado para obtener y gestionar datos relacionados con la exportación.
   * - `Tramite270101Store`: Servicio encargado de gestionar el estado dinámico asociado al trámite 270101.
   * - `Tramite270101Query`: Servicio utilizado para consultar datos específicos del estado del trámite 270101.
   *
   * @param {ExportarIlustracionesService} exportarIlustracionesService - Servicio para gestionar datos de exportación.
   * @param {Tramite270101Store} tramite270101Store - Servicio para gestionar el estado dinámico del trámite.
   * @param {Tramite270101Query} tramite270101Query - Servicio para consultar datos del estado del trámite.
   */
  constructor(
    public exportarIlustracionesService: ExportarIlustracionesService,
    private tramite270101Store: Tramite270101Store,
    private tramite270101Query: Tramite270101Query
  ) {
    //
  }

  /**
   * @method ngOnInit
   * @description
   * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente
   * después de que Angular haya inicializado todas las propiedades vinculadas al componente.
   * En este caso, se utiliza para inicializar el estado del formulario, obtener datos relacionados
   * con la aduana de salida y el tipo de traslado, y configurar la tabla dinámica.
   *
   * Funcionalidad:
   * - Obtiene el estado actual del trámite desde `tramite270101Query`.
   * - Asigna el valor de la aduana al formulario si está disponible en el estado.
   * - Configura los datos de la tabla dinámica si están disponibles en el estado.
   * - Llama a los métodos `obtenerAduanaDeSalida` y `obtrenerTipoDeTraslado` para cargar datos adicionales.
   *
   * @example
   * ngOnInit(): void {
   *   this.tramite270101Query.selectExportarIlustraciones$
   *     .pipe(takeUntil(this.destroy$))
   *     .subscribe((seccionState) => {
   *       this.exportarIlustracionesState = seccionState;
   *       // Configura el formulario y la tabla dinámica.
   *     });
   *   this.obtenerAduanaDeSalida();
   *   this.obtrenerTipoDeTraslado();
   * }
   */
  ngOnInit(): void {
    this.tramite270101Query.selectExportarIlustraciones$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.exportarIlustracionesState = seccionState;
          if (
            this.exportarIlustracionesState &&
            typeof this.exportarIlustracionesState === 'object' &&
            this.exportarIlustracionesState !== null
          ) {
            const ADUANA = this.exportarIlustracionesState?.['aduana'];

            if (ADUANA !== undefined) {
              this.forma.get('aduana')?.setValue(ADUANA);
            }

            if ('configuracionTablaDatos' in this.exportarIlustracionesState) {
              const DATOS =
                this.exportarIlustracionesState['configuracionTablaDatos'];
              if (Array.isArray(DATOS)) {
                DATOS.forEach((dato) => {
                  const IS_ALREADY_ADDED = this.configuracionTablaDatos.some(
                    (item: { ciudad: string }) => item.ciudad === dato.ciudad
                  );
                  if (!IS_ALREADY_ADDED) {
                    this.configuracionTablaDatos.push(dato);
                  }
                });
              }
            }
          }
        })
      )
      .subscribe();
    let terminado = 0;
    const COMPROBAR_TODO_CARGADO = (): void => {
      terminado++;
      if (terminado === 2 && this.consultaState.readonly) {
        this.forma.get('extentoPago')?.disable();
        this.agregarTablaDatos();
      }
      if (this.consultaState.update) {
        this.forma.get('extentoPago')?.setValue(true);
      }
    };
    this.obtenerAduanaDeSalida(COMPROBAR_TODO_CARGADO);
    this.obtrenerTipoDeTraslado(COMPROBAR_TODO_CARGADO);
  }

  /**
 * @method agregarTablaDatos
 * Construye y devuelve un objeto con los datos completos de la ilustración a partir del estado actual del formulario.
 */
agregarTablaDatos(): void {
  this.configuracionTablaDatos?.push(this.tablaDatos());
}

/**
 * @method tablaDatos
 * Genera un objeto con los datos de la solicitud a partir del estado actual del formulario de exportación de ilustraciones
 */
  tablaDatos(): AduanaDeSalida {
    const DETALLES = {
      tipo: AduanaComponent.obtenerDescripcion(this.aduanaData, this.exportarIlustracionesState['tipoDeTraslado']),
      ciudad: this.exportarIlustracionesState['ciudad'],
      sede: this.exportarIlustracionesState['ciudad'],
      tipoDeTraslado: AduanaComponent.obtenerDescripcion(this.transporteData, this.exportarIlustracionesState['tipoDeTraslado']),
      fechaExhibicion: this.exportarIlustracionesState['fechaDeExhibicion'],
      observaciones: this.exportarIlustracionesState['observaciones'],
      fechoInicio: this.exportarIlustracionesState['fechaInicio'],
      fechaFin: this.exportarIlustracionesState['fechaFin'],
    };
    return DETALLES;
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
   * @method obtenerAduanaDeSalida
   * @description
   * Este método se utiliza para obtener los datos relacionados con las aduanas de salida desde el servicio
   * `ExportarIlustracionesService` y asignarlos a la propiedad `aduanaData`.
   *
   * Funcionalidad:
   * - Realiza una solicitud al servicio para obtener los datos de las aduanas de salida.
   * - Asigna los datos obtenidos a la propiedad `aduanaData`.
   * - Utiliza `takeUntil` para gestionar la destrucción de las suscripciones y evitar fugas de memoria.
   *
   * @example
   * this.obtenerAduanaDeSalida();
   * // Obtiene los datos de las aduanas de salida y los asigna a `aduanaData`.
   */
  public obtenerAduanaDeSalida(callback: () => void): void {
    this.exportarIlustracionesService
      .getAduanaDeSalidaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: Catalogo[]) => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.aduanaData = resp;
          } else {
            this.aduanaData = [];
          }
          callback();
        },
        error: () => {
          this.aduanaData = [];
        }
      });
  }

  /**
   * Obtiene los datos de transporte desde el servicio y los asigna a `transporteData`.
   */
  public obtrenerTipoDeTraslado(callback: () => void): void {
    this.exportarIlustracionesService
      .getTransporteData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.transporteData = data;
        const TIPO_TRASLADO_FIELD = this.itinerarioFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'tipoDeTraslado'
        ) as ModeloDeFormaDinamica;
        if (TIPO_TRASLADO_FIELD) {
          if (!TIPO_TRASLADO_FIELD.opciones) {
            TIPO_TRASLADO_FIELD.opciones = this.transporteData.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
         callback();
      });
  }

  /**
   * @method abrirDialogo
   * @description
   * Este método se utiliza para abrir un modal en el componente.
   * Verifica si existe una referencia al elemento del modal (`modal`)
   * y, de ser así, crea una instancia del modal y lo muestra.
   *
   * Funcionalidad:
   * - Verifica la existencia de la referencia al elemento del modal.
   * - Crea una instancia del modal utilizando Bootstrap y lo muestra.
   *
   * @example
   * this.abrirDialogo();
   * // Abre el modal configurado en el componente.
   */
  abrirDialogo(): void {
    if (this.modal) {
      const INSTANCIA_MODAL = new Modal(this.modal.nativeElement);
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * @method agregarConfirmarModal
   * @description
   * Este método abre un modal de confirmación si el formulario `ninoFormGroup` es válido.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar los errores de validación.
   *
   * Funcionalidad:
   * - Verifica si el formulario `ninoFormGroup` es válido.
   * - Si es válido, cierra el modal actual y abre el modal de confirmación.
   * - Si no es válido, marca todos los campos del formulario como tocados.
   *
   * @example
   * this.agregarConfirmarModal();
   * // Abre el modal de confirmación si el formulario es válido.
   */
  agregarConfirmarModal(): void {
    if (this.configuracionTablaDatos.length === 0) {
      if (this.itinerarioFormGroup.valid) {
        const DETALLES = {
          tipo: this.itinerarioFormGroup.get('tipoItinerario')?.value,
          ciudad: this.itinerarioFormGroup.get('ciudad')?.value,
          sede: '',
          tipoDeTraslado: this.itinerarioFormGroup.get('tipoDeTraslado')?.value,
          fechaExhibicion: '',
          observaciones: this.itinerarioFormGroup.get('observaciones')?.value,
          fechoInicio: AduanaComponent.formatoFecha(
            this.itinerarioFormGroup.get('fechaInicio')?.value
          ),
          fechaFin: AduanaComponent.formatoFecha(
            this.itinerarioFormGroup.get('fechaFin')?.value
          ),
        };
        this.configuracionTablaDatos?.push(DETALLES);
        this.exportarIlustracionesService.setAduanaArray(DETALLES);
        this.cambioEnValoresStore(
          'configuracionTablaDatos',
          this.configuracionTablaDatos
        );
        const TIPO_ITINERARIO_VALUE =
          this.itinerarioFormGroup.get('tipoItinerario')?.value;
        const FECHA_FIN = this.itinerarioFormGroup.get('fechaFin')?.value;
        this.itinerarioFormGroup.reset();
        this.itinerarioFormGroup
          .get('tipoItinerario')
          ?.setValue(TIPO_ITINERARIO_VALUE);
        this.itinerarioFormGroup.get('fechaFin')?.setValue(FECHA_FIN);
        this.cerrarModal();
      } else {
        this.itinerarioFormGroup.markAllAsTouched();
      }
    } else {
      const CURRENT_START_DATE =
        this.itinerarioMaximoFormGroup.get('fechaInicio')?.value;
      this.confirmacionModalAbierta(CURRENT_START_DATE);
    }
  }

  /**
   * @method confirmacionModalAbierta
   * @description
   * Este método verifica si la nueva fecha de inicio (`nuevaFechaInicio`) es menor o igual a la última fecha agregada (`fechaFin`).
   * Si la condición se cumple, abre un modal de confirmación. De lo contrario, llama al método `confirmacionItinerarioMaximo`
   * para manejar el itinerario máximo y oculta cualquier mensaje de error.
   *
   * Funcionalidad:
   * - Compara la nueva fecha de inicio con la última fecha agregada.
   * - Si la nueva fecha es válida, abre el modal de confirmación.
   * - Si no es válida, ejecuta la lógica para manejar el itinerario máximo.
   *
   * @param {string} nuevaFechaInicio - La nueva fecha de inicio que se desea validar.
   *
   * @example
   * this.confirmacionModalAbierta('2025-04-18');
   * // Abre el modal de confirmación si la fecha es válida.
   */
  public confirmacionModalAbierta(nuevaFechaInicio: string): void {
    const ULTIMA_FECHA_AGREGADA =
      this.itinerarioFormGroup.get('fechaFin')?.value;
    const FECHA_ACTUAL = nuevaFechaInicio;
    if (FECHA_ACTUAL <= ULTIMA_FECHA_AGREGADA) {
      const ELEMENTO_MODAL = document.getElementById('modalConfirmacion');
      if (ELEMENTO_MODAL) {
        const CONFIRMACION_MODAL = new Modal(ELEMENTO_MODAL);
        CONFIRMACION_MODAL.show();
      }
    } else {
      this.confirmacionItinerarioMaximo();
      this.mostrarError = false;
    }
  }

  /**
   * @method confirmacionItinerarioMaximo
   * @description
   * Este método se utiliza para manejar la confirmación de un itinerario máximo.
   * Valida los datos del formulario `itinerarioMaximoFormGroup` y, si son válidos,
   * agrega los detalles del itinerario a la tabla dinámica. Si el formulario no es válido,
   * marca todos los campos como tocados para mostrar los errores de validación.
   *
   * Funcionalidad:
   * - Valida los datos del formulario `itinerarioMaximoFormGroup`.
   * - Si los datos son válidos, agrega los detalles del itinerario a `configuracionTablaDatos`.
   * - Actualiza el estado del formulario en el store utilizando `cambioEnValoresStore`.
   * - Resetea el formulario y mantiene el valor del campo `tipoItinerario`.
   * - Cierra el modal actual.
   *
   * @example
   * this.confirmacionItinerarioMaximo();
   * // Agrega un itinerario máximo a la tabla dinámica si los datos son válidos.
   */
  confirmacionItinerarioMaximo(): void {
    if (this.itinerarioMaximoFormGroup.valid) {
      const DETALLES = {
        tipo: this.itinerarioMaximoFormGroup.get('tipoItinerario')?.value,
        ciudad: this.itinerarioMaximoFormGroup.get('ciudad')?.value,
        sede: this.itinerarioMaximoFormGroup.get('nombre')?.value,
        tipoDeTraslado: '',
        fechaExhibicion: AduanaComponent.formatoFecha(
          this.itinerarioMaximoFormGroup.get('fechaDeExhibicion')?.value
        ),
        observaciones:
          this.itinerarioMaximoFormGroup.get('observaciones')?.value,
        fechoInicio: AduanaComponent.formatoFecha(
          this.itinerarioMaximoFormGroup.get('fechaInicio')?.value
        ),
        fechaFin: AduanaComponent.formatoFecha(
          this.itinerarioMaximoFormGroup.get('fechaFin')?.value
        ),
      };
      this.configuracionTablaDatos?.push(DETALLES);
      this.cambioEnValoresStore(
        'configuracionTablaDatos',
        this.configuracionTablaDatos
      );
      const TIPO_ITINERARIO_VALUE =
        this.itinerarioMaximoFormGroup.get('tipoItinerario')?.value;
      this.itinerarioMaximoFormGroup.reset();
      this.itinerarioMaximoFormGroup
        .get('tipoItinerario')
        ?.setValue(TIPO_ITINERARIO_VALUE);
      this.cerrarModal();
    } else {
      this.itinerarioMaximoFormGroup.markAllAsTouched();
    }
  }

  /**
   * @method formatoFecha
   * @description
   * Este método estático se utiliza para formatear una fecha en el formato "DD/MM/YYYY".
   * Acepta una fecha como cadena o como objeto `Date` y devuelve la fecha formateada como una cadena.
   * Si el valor proporcionado no es válido, devuelve una cadena vacía.
   *
   * Funcionalidad:
   * - Verifica si la fecha proporcionada es una cadena o un objeto `Date`.
   * - Convierte la fecha al formato "DD/MM/YYYY" utilizando `toLocaleDateString` con la configuración regional "en-GB".
   * - Devuelve la fecha formateada como una cadena.
   *
   * @param {Date | string} date - La fecha que se desea formatear.
   * @returns {string} La fecha formateada en el formato "DD/MM/YYYY".
   *
   * @example
   * const fechaFormateada = AduanaComponent.formatoFecha('2025-04-18');
   * console.log(fechaFormateada); // "18/04/2025"
   */
  public static formatoFecha(fecha: Date | string): string {
    let FECHA: Date;
    if (typeof fecha === 'string') {
      FECHA = new Date(fecha);
    } else if (fecha instanceof Date) {
      FECHA = fecha;
    } else {
      return '';
    }
    const FECHA_FORMATEADA = FECHA.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return FECHA_FORMATEADA;
  }

  /**
   * @method cerrarModal
   * @description
   * Este método se utiliza para cerrar el modal actual en el componente.
   * Verifica si existe una referencia al botón de cierre del modal (`closeModal`)
   * y, de ser así, simula un clic en dicho botón para cerrar el modal.
   *
   * Funcionalidad:
   * - Verifica la existencia de la referencia al botón de cierre del modal.
   * - Simula un clic en el botón para cerrar el modal.
   *
   * @example
   * this.cerrarModal();
   * // Cierra el modal actual.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * @method listaDeFilaSeleccionada
   * @description
   * Este método se utiliza para manejar la selección de filas en la tabla dinámica.
   * Cuando se seleccionan filas, los datos correspondientes se agregan a la propiedad `datosSeleccionados`.
   *
   * Funcionalidad:
   * - Verifica si el evento contiene elementos seleccionados.
   * - Itera sobre los elementos seleccionados y los agrega a la lista `datosSeleccionados`.
   *
   * @param {AduanaDeSalida[]} event - Lista de elementos seleccionados en la tabla dinámica.
   *
   * @example
   * this.listaDeFilaSeleccionada(seleccionados);
   * // Agrega los elementos seleccionados a `datosSeleccionados`.
   */
  public listaDeFilaSeleccionada(event: AduanaDeSalida[]): void {
    if (event.length > 0) {
      event.forEach((item) => {
        this.datosSeleccionados.push(item);
      });
    }
  }

  /**
   * @method eliminar
   * @description
   * Este método se utiliza para eliminar las filas seleccionadas de la tabla dinámica.
   * Itera sobre los elementos seleccionados en `datosSeleccionados`, busca su índice en
   * `configuracionTablaDatos` y los elimina si existen. Luego, actualiza el estado del store
   * con los datos actualizados de la tabla.
   *
   * Funcionalidad:
   * - Itera sobre los elementos seleccionados en `datosSeleccionados`.
   * - Busca el índice de cada elemento en `configuracionTablaDatos`.
   * - Elimina el elemento si se encuentra en la tabla.
   * - Actualiza el estado del store con los datos actualizados.
   *
   * @example
   * this.eliminar();
   * // Elimina las filas seleccionadas de la tabla dinámica.
   */
  public eliminar(): void {
    this.datosSeleccionados.forEach((item) => {
      const INDICE = this.configuracionTablaDatos?.findIndex(
        (obj) => obj.ciudad === item.ciudad
      );
      if (INDICE !== -1) {
        this.configuracionTablaDatos?.splice(INDICE, 1);
        this.cambioEnValoresStore(
          'configuracionTablaDatos',
          this.configuracionTablaDatos
        );
      }
    });
  }

  /**
   * @method cerrarConfirmacionModal
   * @description
   * Este método se utiliza para cerrar el modal de confirmación en el componente.
   * Verifica si existe una referencia al elemento del modal (`modalConfirmacion`)
   * y, de ser así, lo oculta utilizando Bootstrap. Además, restablece ciertos campos
   * del formulario `itinerarioMaximoFormGroup` y activa la visualización de mensajes de error.
   *
   * Funcionalidad:
   * - Verifica la existencia del elemento del modal.
   * - Oculta el modal utilizando Bootstrap.
   * - Restablece los valores de los campos `fechaDeExhibicion`, `fechaInicio` y `fechaFin` en el formulario.
   * - Activa la visualización de mensajes de error (`mostrarError`).
   *
   * @example
   * this.cerrarConfirmacionModal();
   * // Cierra el modal de confirmación y restablece los campos del formulario.
   */
  public cerrarConfirmacionModal(): void {
    const ELEMENTO_MODAL = document.getElementById('modalConfirmacion');
    if (ELEMENTO_MODAL) {
      const CONFIRMACION_MODAL = new Modal(ELEMENTO_MODAL);
      CONFIRMACION_MODAL.hide();
      this.mostrarError = true;
      this.itinerarioMaximoFormGroup.patchValue({
        fechaDeExhibicion: '',
        fechaInicio: '',
        fechaFin: '',
      });
    }
  }

  /**
   * compo doc
   * @method cambioEnValoresStore
   * @description
   * Este método se utiliza para emitir un evento cuando hay un cambio en los valores del formulario.
   * Recibe como parámetros el formulario preactivo (FormGroup) y el campo que ha cambiado.
   * Luego, emite un objeto con esta información utilizando el EventEmitter `emitirValorCambiado`.
   * @param form - El formulario reactivo que contiene los datos.
   * @param campo - El nombre del campo que ha cambiado.
   */
  public cambioEnValoresStore(campo: string, valor: unknown): void {
    this.tramite270101Store.setDynamicFieldValue(campo, valor);
  }

  /**
   * @method eventoDeCambioDeValor
   * @description
   * Este método se utiliza para manejar los eventos de cambio en los campos del formulario.
   * Obtiene el valor actual del campo modificado y actualiza el estado del store, emite un evento
   * con el formulario actualizado y guarda los cambios en el servicio `ExportarIlustracionesService`.
   *
   * Funcionalidad:
   * - Verifica si el evento contiene un valor válido.
   * - Obtiene el valor del campo modificado desde el evento.
   * - Actualiza el estado del store con el nuevo valor del campo.
   * - Emite el formulario actualizado utilizando el EventEmitter `formularioEventoEmitir`.
   * - Guarda el formulario actualizado en el servicio `ExportarIlustracionesService`.
   *
   * @param {Event} event - Evento de cambio generado por el campo del formulario.
   * @param {string} campo - Nombre del campo que se modificó.
   *
   * @example
   * this.eventoDeCambioDeValor($event, 'aduana');
   * // Actualiza el valor del campo 'aduana' en el store y emite el formulario actualizado.
   */
  eventoDeCambioDeValor(event: Event, campo: string): void {
    if (event) {
      let VALOR;
      if (event.target) {
        VALOR = (event.target as HTMLInputElement).value;
      } else {
        VALOR = event;
      }
      this.cambioEnValoresStore(campo, VALOR);
      this.formularioEventoEmitir.emit(this.forma);
      this.exportarIlustracionesService.setForm('aduana', this.forma);
    }
  }

  /**
   * @method ngOnDestroy
   * @description
   * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente
   * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones
   * activas y evitar fugas de memoria en la aplicación.
   *
   * Funcionalidad:
   * - Notifica a través del `Subject` `destroy$` que el componente será destruido.
   * - Completa el `Subject` para liberar los recursos asociados.
   *
   * @example
   * ngOnDestroy(): void {
   *   this.destroy$.next();
   *   this.destroy$.complete();
   * }
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
