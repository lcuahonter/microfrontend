import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConfiguracionColumna, GENERAR_LINEA_CAPTURA_URL, InputFechaComponent, Notificacion, NotificacionesComponent, REGEX_LINEA_CAPTURA, REGEX_REEMPLAZAR, TITULO_MODAL_AVISO, TablaDinamicaComponent, TablaSeleccion, TableData, TituloComponent } from "@libs/shared/data-access-user/src";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ImportanteCatalogoSeleccion, PagoDerechosLista } from "../../models/registro-muestras-mercancias.model";
import { Solicitud30901State, Solicitud30901Store } from "../../estados/tramites30901.store";
import { Subject, Subscription, map, takeUntil } from "rxjs";
import { BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RenovacionesMuestrasMercanciasService } from "../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service";
import { Solicitud30901Query } from "../../estados/tramites30901.query";
import { ToastrService } from "ngx-toastr";

/**
 * Componente para el manejo del pago de la línea de captura.
 *
 * @component
 * @selector 'app-pago-linea-de-captura'
 * @templateUrl './pago-linea-de-captura.component.html'
 * @styleUrl './pago-linea-de-captura.component.scss'
 */
@Component({
  selector: 'app-pago-linea-de-captura',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    TituloComponent,
  ],
  providers: [
    RenovacionesMuestrasMercanciasService,
    ToastrService,
    BsModalService,
  ],
  templateUrl: './pago-linea-de-captura.component.html',
  styleUrl: './pago-linea-de-captura.component.scss',
})
export class PagoLineaDeCapturaComponent implements OnInit, OnDestroy {
  /**
   * Formulario para el pago de la línea de captura.
   */
  formPagoLC!: FormGroup;
  /**
   * Datos de la tabla utilizados en el componente Pago LC.
   * @type {TableData}
   */
  tableData: TableData = {} as TableData;

  /**
   * Administra el ciclo de vida de la suscripción `darseDeBaja`.
   *
   * - La variable `darseDeBaja` almacena la suscripción activa,
   *   la cual puede ser `null` si no hay suscripción.
   * - El método `ngOnDestroy` se asegura de que la suscripción
   *   se cancele correctamente cuando el componente se destruya,
   *   evitando fugas de memoria.
   */
  darseDeBaja: Subscription | null = null;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
  /**
   * Estado actual de la solicitud 30901.
   * Se inicializa como un objeto vacío con la estructura de `Solicitud30901State`.
   */
  solicitud30901State: Solicitud30901State = {} as Solicitud30901State;

  /**
   * Tipo de selección de la tabla.
   * En este caso, se utiliza un checkbox para la selección de elementos.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla.
   * Define el encabezado, la clave de acceso a los datos y el orden de las columnas.
   */
  configuracionColumnas: ConfiguracionColumna<PagoDerechosLista>[] = [
    {
      encabezado: 'Línea de captura', // Título de la columna
      clave: (item: PagoDerechosLista) => item.linea, // Accede a la propiedad 'linea'
      orden: 1, // Orden en la tabla
    },
    {
      encabezado: 'Monto', // Título de la columna
      clave: (item: PagoDerechosLista) => item.monto, // Accede a la propiedad 'monto'
      orden: 2, // Orden en la tabla
    },
  ];

  /**
   * Lista de líneas de captura seleccionadas por el usuario.
   * Se inicializa como un arreglo vacío del tipo PagoDerechosLista.
   */
  seleccionadaLineaCapturaLista: PagoDerechosLista[] =
    [] as PagoDerechosLista[];

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Lista de pagos de derechos asociados a la solicitud.
   * Se inicializa como un array vacío con la estructura de `PagoDerechosLista`.
   */
  pagoDerechosLista: PagoDerechosLista[] = [] as PagoDerechosLista[];

  /**
   * URL utilizada para generar la línea de captura.
   * Esta constante apunta al endpoint definido por GENERAR_LINEA_CAPTURA_URL.
   */
  generarLineaCapturaURL: string = GENERAR_LINEA_CAPTURA_URL;
   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor del componente `DatosProrrogaMuestrasMercanciasComponent`.
   *
   * Este constructor inyecta los servicios y stores necesarios para manejar el formulario de prórroga,
   * el estado de la solicitud 30901, y la configuración de solo lectura basada en el estado global de consulta.
   *
   * @param {FormBuilder} fb - Utilizado para construir y gestionar formularios reactivos.
   * @param {RenovacionesMuestrasMercanciasService} renovacionesService - Servicio que gestiona la lógica de negocio para renovaciones de muestras de mercancías.
   * @param {Solicitud30901Store} solicitud30901Store - Store que mantiene el estado centralizado de la solicitud 30901.
   * @param {Solicitud30901Query} solicitud30901Query - Query que permite observar los cambios en el estado de la solicitud 30901.
   * @param {ConsultaioQuery} consultaioQuery - Query que proporciona el estado de consulta general, incluyendo si el formulario debe estar en modo solo lectura.
   */
  constructor(
    public fb: FormBuilder,
    private renovacionesService: RenovacionesMuestrasMercanciasService,
    public solicitud30901Store: Solicitud30901Store,
    public solicitud30901Query: Solicitud30901Query,
    private consultaioQuery: ConsultaioQuery,
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
          takeUntil(this.destroyed$),
          map((seccionState)=>{
            this.esFormularioSoloLectura = seccionState.readonly; 
            this.inicializarEstadoFormulario();
          })
        )
        .subscribe()
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * En este método se inicializa el formulario `formPagoLC` con dos campos:
   * - `lineaCaptura`: Campo de texto con una longitud máxima de 20 caracteres.
   * - `valorPago`: Campo de texto con un valor predeterminado de '4845' que está deshabilitado y tiene una longitud máxima de 20 caracteres.
   *
   * Además, se llama al método `obtenerDatosIniciales` para cargar los datos necesarios al iniciar el componente.
   */
  ngOnInit(): void {
       this.inicializarEstadoFormulario();
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

      /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formPagoLC.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formPagoLC.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
}


 /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.formPagoLC = this.fb.group({
      lineaCaptura: [
        this.solicitud30901State.lineaCaptura,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(REGEX_LINEA_CAPTURA),
        ],
      ],
      valorPago: [
        { value: this.solicitud30901State.valorPago, disabled: false },
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.solicitud30901Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((response: Solicitud30901State) => {
          this.solicitud30901State = response;
          this.pagoDerechosLista = response.pagoDerechosLista;
          this.formPagoLC.patchValue({
            lineaCaptura: this.solicitud30901State.lineaCaptura,
            valorPago: this.solicitud30901State.valorPago,
          });
        })
      )
      .subscribe();
    this.obtenerDatosIniciales();
  }
  /**
   * Actualiza el valor de la línea de captura en el estado.
   */
  setLineaCaptura(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '').toUpperCase();

    this.formPagoLC.patchValue({
      lineaCaptura: CLEANED,
    });

    this.solicitud30901Store.setLineaCaptura(CLEANED);
  }

  /**
   * Método para obtener los datos iniciales necesarios para el componente.
   * Realiza una llamada al servicio de renovaciones para obtener las opciones desplegables
   * y asigna los datos de la tabla de tarifas de pago a la propiedad `tableData`.
   *
   * @returns {void}
   */
  obtenerDatosIniciales(): void {
    this.darseDeBaja = this.renovacionesService
      .obtenerOpcionesDesplegables()
      .subscribe({
        next: (res: ImportanteCatalogoSeleccion) => {
          this.solicitud30901Store.setValorPago(res.pagoDerechosLista[0].monto);
        },
      });
  }

  /**
   * Limpia los campos del formulario de pago LC.
   *
   * Este método restablece el campo 'lineaCaptura' del formulario 'formPagoLC' a su estado inicial.
   *
   * @returns {void} No retorna ningún valor.
   */
  limpiarCampos(): void {
    this.formPagoLC.get('lineaCaptura')?.reset();
  }

  /**
   * Agrega tarifas de pago obteniendo los valores del formulario y actualizando la tabla.
   */
  anadirTarifasDePago(): void {
    if (this.formPagoLC.invalid) {
      this.formPagoLC.markAllAsTouched();
      return;
    }

    const JSON_OBJECT = [
      {
        linea: this.formPagoLC.get('lineaCaptura')?.value,
        monto: this.formPagoLC.get('valorPago')?.value,
      },
    ];

    for (const INDEX in this.pagoDerechosLista) {
      if (
        this.pagoDerechosLista[INDEX].linea ===
        this.formPagoLC.get('lineaCaptura')?.value
      ) {
        return;
      }
    }
    this.solicitud30901Store.setPagoDerechosLista(JSON_OBJECT);
  }

  /**
   * Método que se ejecuta cuando se selecciona una fila en la lista de pagos de derechos.
   * Asigna la fila seleccionada (o filas) a la variable `seleccionadaLineaCapturaLista`.
   *
   * @param evento - Arreglo de objetos de tipo `PagoDerechosLista` que representa las filas seleccionadas.
   */
  onFilaSeleccionada(evento: PagoDerechosLista[]): void {
    this.seleccionadaLineaCapturaLista = evento;
  }

  /**
   * Elimina las filas seleccionadas de la lista de pagos de derechos.
   *
   * - Si no hay ninguna fila seleccionada, muestra una notificación de advertencia al usuario.
   * - Si hay filas seleccionadas, obtiene sus líneas, filtra la lista original eliminando esas líneas
   *   y actualiza el store con la nueva lista.
   * - Finalmente, limpia la selección actual.
   */
  eliminarSeleccion(): void {
    if (this.seleccionadaLineaCapturaLista.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: 'Selecciona por lo menos un registro',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const LINEAS_A_ELIMINAR = this.seleccionadaLineaCapturaLista.map(
      (item) => item.linea
    );

    const NUEVA_LISTA = this.pagoDerechosLista.filter(
      (elemento) => !LINEAS_A_ELIMINAR.includes(elemento.linea)
    );
    this.seleccionadaLineaCapturaLista = [];
    this.solicitud30901Store.setPagoDerechosLista(NUEVA_LISTA);
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (this.formPagoLC.invalid) {
      this.formPagoLC.markAllAsTouched();
    }
    return this.formPagoLC.valid;
  }

  /**
   * Hook del ciclo de vida que se invoca cuando se destruye el componente.
   * - Verifica si la suscripción `darseDeBaja` está activa.
   * - Si existe, se da de baja (unsubscribe) del observable para liberar recursos.
   * - Establece `darseDeBaja` a `null` como parte del proceso de limpieza.
   */
  ngOnDestroy(): void {
    if (this.darseDeBaja) {
      this.darseDeBaja.unsubscribe();
      this.darseDeBaja = null;
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
