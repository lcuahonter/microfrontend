import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionAporteColumna, ConfiguracionColumna, Notificacion, NotificacionesComponent, Pedimento, REG_X, TablaCampoSeleccion, TablaConEntradaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService,esValidArray, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MENSAJES_EXPORTACIONES_TOTALS, MENSAJES_VENTAS_TOTALES, TOTAL_EXPORTACIONES_MENSAJES, VALIDATORS_MENSAJES, VENTAS_TOTALES_MENSAJES } from '../../constantes/solicitud150102.enum';
import { Solicitud150102State, Solicitud150102Store } from '../../estados/solicitud150102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BienesProducidos } from '../../models/programas-reporte.model';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { Solicitud150102Query } from '../../estados/solicitud150102.query';
import { SolicitudService } from '../../services/solicitud.service';
/**
 * @description Componente que administra los datos del reporte anual y realiza cálculos relevantes.
 * Permite la visualización y edición de bienes producidos, ventas totales, exportaciones e importaciones.
 */
@Component({
  selector: 'app-datos-de-reporte-annual',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaConEntradaComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './datos-de-reporte-annual.component.html',
  styleUrl: './datos-de-reporte-annual.component.scss',
})
/**
 * @description Componente que administra los datos del reporte anual y realiza cálculos relevantes.
 * Permite la visualización y edición de bienes producidos, ventas totales, exportaciones e importaciones.
 */
export class DatosDeReporteAnnualComponent implements OnInit, OnDestroy {
  /**
   * Identificador del índice o fila seleccionada de los bienes producidos.
   * Se utiliza para marcar la selección en la tabla correspondiente.
   */
  bienesProducidosSelection!: number;

  /**
   * Identificador del índice o fila seleccionada en el listado de producidos.
   * Se utiliza para controlar la fila activa o marcada por el usuario.
   */
  producidosSelection!: number;

  /** Formulario reactivo para gestionar los datos del reporte anual */
  formReporteAnnual!: FormGroup;

  /** Estado de la solicitud utilizado para almacenar datos */
  solicitud150102State: Solicitud150102State = {} as Solicitud150102State;

  /** Observable utilizado para la destrucción de suscripciones */
  private destroyed$ = new Subject<void>();

  /** Tipo de selección de tabla: Radio */
  producidosSeleccionTabla = TablaSeleccion.RADIO;

  /** Lista de bienes producidos */
  producidosDatos: BienesProducidos[] = [];

  /** 
   * Indica si se deben mostrar los bienes producidos 
   */
  public mostrarAlerta: boolean = false;

  /** 
   * Lista de bienes producidos a mostrar 
   */
  private _mostrarBienesProducidos: BienesProducidos[] = [];

  /** 
   * Setter y getter para la propiedad mostrarBienesProducidos.
   * Permite actualizar y acceder a la lista de bienes producidos a mostrar.
   */
  @Input() set mostrarBienesProducidos(value: BienesProducidos[]) {
    this._mostrarBienesProducidos = value;
    // Prevent stack overflow by only updating if reference is different
    if (this.producidosDatos !== value) {
      this.producidosDatos = value;
    }
  }

  /** 
   * Getter para la propiedad mostrarBienesProducidos 
   */
  get mostrarBienesProducidos(): BienesProducidos[] {
    return this._mostrarBienesProducidos;
  }
  /** Configuración de la tabla de bienes producidos */
  producidosConfiguracionTabla: ConfiguracionAporteColumna<BienesProducidos>[] =
    [
      {
        encabezado: 'Clave sector',
        llave: 'claveSector',
        clave: (item: BienesProducidos) => item.claveSector,
        opcionDeEntrada: TablaCampoSeleccion.NONE,
        orden: 1,
        longitudMaxima: 0,
        tipo: '',
      },
      {
        encabezado: 'sector ',
        llave: 'sector',
        clave: (item: BienesProducidos) => item.sector,
        opcionDeEntrada: TablaCampoSeleccion.NONE,
        orden: 2,
        longitudMaxima: 0,
        tipo: '',
      },
      {
        encabezado: 'Fracción arancelaria',
        llave: 'fraccion',
        clave: (item: BienesProducidos) => item.fraccion,
        opcionDeEntrada: TablaCampoSeleccion.INPUT,
        orden: 3,
        longitudMaxima: 8,
        tipo: 'number',
      },
      {
        encabezado: 'Bienes producidos',
        llave: 'bienProducido',
        clave: (item: BienesProducidos) => item.bienProducido,
        opcionDeEntrada: TablaCampoSeleccion.INPUT,
        orden: 4,
        longitudMaxima: 250,
        tipo: 'text',
      },
      {
        encabezado: 'Volumen del total de bienes producidos',
        llave: 'totalBienesProducidos',
        clave: (item: BienesProducidos) => item.totalBienesProducidos,
        opcionDeEntrada: TablaCampoSeleccion.INPUT,
        orden: 5,
        longitudMaxima: 16,
        tipo: 'number',
      },
      {
        encabezado: 'Volumen del mercado nacional',
        llave: 'mercadoNacional',
        clave: (item: BienesProducidos) => item.mercadoNacional,
        opcionDeEntrada: TablaCampoSeleccion.INPUT,
        orden: 6,
        longitudMaxima: 16,
        tipo: 'number',
      },
      {
        encabezado: 'Volumen de exportaciones',
        llave: 'exportaciones',
        clave: (item: BienesProducidos) => item.exportaciones,
        opcionDeEntrada: TablaCampoSeleccion.INPUT,
        orden: 7,
        longitudMaxima: 16,
        tipo: 'number',
      },
    ];

  /** Instancia de bienes producidos seleccionada */
  bienesProducidos: BienesProducidos = {} as BienesProducidos;

  /** Tipo de selección de tabla: Radio */
  bienesProducidosSeleccionTabla = TablaSeleccion.RADIO;

  /** Lista de datos de bienes producidos */
  bienesProducidosDatos: BienesProducidos[] = [];

  /** Configuración de la tabla de bienes producidos */
  bienesProducidosConfiguracionTabla: ConfiguracionColumna<BienesProducidos>[] =
    [
      {
        encabezado: 'Bienes producidos',
        clave: (item: BienesProducidos) => item.bienProducido,
        orden: 1,
      },
      {
        encabezado: 'Clave sector ',
        clave: (item: BienesProducidos) => item.claveSector,
        orden: 2,
      },
      {
        encabezado: 'Fracción arancelaria',
        clave: (item: BienesProducidos) => item.fraccion,
        orden: 3,
      },
      {
        encabezado: 'Unidad de medida',
        clave: (item: BienesProducidos) => item.unidadMedida,
        orden: 4,
      },
      {
        encabezado: 'Volumen del total de bienes producidos',
        clave: (item: BienesProducidos) => item.totalBienesProducidos,
        orden: 5,
      },
      {
        encabezado: 'Volumen del mercado nacional',
        clave: (item: BienesProducidos) => item.mercadoNacional,
        orden: 6,
      },
      {
        encabezado: 'Volumen de exportaciones',
        clave: (item: BienesProducidos) => item.exportaciones,
        orden: 7,
      },
    ];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Objeto que representa una nueva notificación a mostrar al usuario.
   * Puede incluir información como el tipo, mensaje, duración, etc.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   *  Índice del pedimento marcado para eliminación.
   * */
  public elementoParaEliminar!: number;

  /**
   *  Arreglo que contiene los pedimentos registrados.
   */
  public pedimentos: Array<Pedimento> = [];

  /**
   * Lista de mensajes de validación que se muestran al usuario.
   * Contiene errores de formulario u otras advertencias generadas dinámicamente.
   */
  mensajesDeValidacion: string[] = [];

  /**
   * Indica si la tabla de bienes producidos está activa o visible.
   *
   * @type {boolean}
   */
  bienesTablaProducidos: boolean = true;
  /** Mensaje de alerta cuando las ventas totales son menores que las exportaciones totales.
   *
   * @type {string}
   */
  public mensajeDeAlerta: string = 'Las Ventas Totales deben ser mayores o iguales al Total de Exportaciones.';

  /** 
   * Estado de la solicitud actual 
   */
  public solicitudState!: Solicitud150102State;
  /** 
   * @property {boolean} mostraTab
   * @description Indica si se debe mostrar la pestaña de datos de reporte anual.
   */
  public mostraTab: boolean = true;
  /**
   * @description Constructor que inicializa las dependencias necesarias.
   * @param fb Instancia del FormBuilder para la creación de formularios reactivos.
   * @param solicitud150102Store Store que maneja el estado de la solicitud.
   * @param solicitud150102Query Query para seleccionar datos de la solicitud.
   * @param solicitudService Servicio para obtener datos de la solicitud.
   * @param consultaioQuery Query para seleccionar el estado del formulario.
   */
  constructor(
    public fb: FormBuilder,
    public solicitud150102Store: Solicitud150102Store,
    public solicitud150102Query: Solicitud150102Query,
    public solicitudService: SolicitudService,
    public consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService,
    private servicioDeFormularioService: ServicioDeFormularioService
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
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.mostrarAlerta = seccionState.update;
          this.mostraTab = !seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @description Método que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y sincroniza datos con el estado actual.
   */
  ngOnInit(): void {
    this.obtenerProducidosDatos();
    this.inicializarEstadoFormulario();
    if (this.mostrarAlerta) {
      this.calcularReporteAnnual();
    }
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
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formReporteAnnual.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formReporteAnnual.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `formReporteAnnual` con los datos del estado actual `solicitud150102State`.
   *
   * - Establece valores iniciales para ventas, exportaciones, importaciones, saldo y porcentaje de exportación.
   * - Aplica validaciones de longitud máxima a los campos numéricos editables.
   * - Escucha cambios en el estado para mantener el formulario actualizado en tiempo real.
   */
  inicializarFormulario(): void {
    this.formReporteAnnual = this.fb.group({
      ventasTotales: [
        { value: this.solicitud150102State.ventasTotales, disabled: !this.mostraTab },
        [
          Validators.maxLength(16),
          Validators.pattern(REG_X.SOLO_NUMEROS_Y_PUNTO),
          Validators.required,
        ],
      ],
      totalExportaciones: [
        {
          value: this.solicitud150102State.totalExportaciones,
          disabled: !this.mostraTab,
        },
        [
          Validators.maxLength(16),
          Validators.pattern(REG_X.SOLO_NUMEROS_Y_PUNTO),
          Validators.required,
        ],
      ],
      totalImportaciones: [
        {
          value: this.solicitud150102State.totalImportaciones,
          disabled: !this.mostraTab,          
        },
        [
          Validators.maxLength(16)
        ],
      ],
      saldo: [{ value: this.solicitud150102State.saldo, disabled: true }],
      porcentajeExportacion: [
        {
          value: this.solicitud150102State.porcentajeExportacion,
          disabled: true,
        },
      ],
    });

    this.solicitud150102Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150102State) => {
          this.solicitud150102State = respuesta;
          this.formReporteAnnual.patchValue({
            ventasTotales: this.solicitud150102State.ventasTotales,
            totalExportaciones: this.solicitud150102State.totalExportaciones,
            totalImportaciones: this.solicitud150102State.totalImportaciones,
            saldo: this.solicitud150102State.saldo,
            porcentajeExportacion:
              this.solicitud150102State.porcentajeExportacion,
          });
          this.producidosDatos = this.solicitud150102State.producidosDatos;
          this.bienesProducidosDatos =
            this.solicitud150102State.bienesProducidosDatos;
        })
      )
      .subscribe();
  }

  /**
   * @description Método que obtiene datos de bienes producidos y actualiza el estado con una lista única.
   */
  obtenerProducidosDatos(): void {
    if(!this.mostrarAlerta) {
      this.solicitudService
      .obtenerProducidosDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta: BienesProducidos[]) => {
          const MATRIZ_JSON = [
            ...this.solicitud150102State.producidosDatos,
            ...respuesta.filter(
              (item) =>
                !this.solicitud150102State.producidosDatos.some(
                  (existing) => existing.claveSector === item.claveSector
                )
            ),
          ];
          this.solicitud150102Store.actualizarProducidosDatos(MATRIZ_JSON);
        },
      });
    } else {
        this.solicitud150102Store.actualizarProducidosDatos(this.producidosDatos);
    }
  }
/**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }
  /**
   * @description Método para obtener y actualizar las ventas totales.
   * @param evento Evento de entrada con el valor ingresado.
   */
  obtenerVentasTotales(evento: Event): void {
    const VENTAS_TOTALES_CONTROL = this.formReporteAnnual?.get('ventasTotales');
    if (VENTAS_TOTALES_CONTROL) {
      if (VENTAS_TOTALES_CONTROL?.invalid && VENTAS_TOTALES_CONTROL?.touched) {
        this.abrirModal(VENTAS_TOTALES_MENSAJES);
      }
    }
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud150102Store.actualizarVentasTotales(VALOR);
    this.calcularReporteAnnual();
  }

  /**
   * @description Método para obtener y actualizar el total de exportaciones.
   * @param evento Evento de entrada con el valor ingresado.
   */
  obtenerTotalExportaciones(evento: Event): void {
    const TOTAL_EXPORTACIONES_CONTROL =
      this.formReporteAnnual?.get('totalExportaciones');
    if (TOTAL_EXPORTACIONES_CONTROL) {
      if (
        TOTAL_EXPORTACIONES_CONTROL?.invalid &&
        TOTAL_EXPORTACIONES_CONTROL?.touched
      ) {
        this.abrirModal(TOTAL_EXPORTACIONES_MENSAJES);
        return;
      }
    }
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud150102Store.actualizarTotalExportaciones(VALOR);
    this.calcularReporteAnnual();
  }

  /**
   * Valida que el total de exportaciones no sea mayor que las ventas totales.
   * También verifica que ambos campos estén completos.
   *
   * - Si alguno de los campos es inválido, se agrega un mensaje a `mensajesDeValidacion`.
   * - Si las exportaciones superan a las ventas totales, se abre un modal de advertencia.
   *
   * @returns `true` si los valores son válidos, de lo contrario `false`.
   */
  validarTotalExportaciones(): boolean {
    this.mensajesDeValidacion = [];
    const VENTASTOTALES = this.formReporteAnnual.get('ventasTotales')?.value;
    if (!VENTASTOTALES) {
      this.abrirModal(VALIDATORS_MENSAJES);
      this.mensajesDeValidacion.push(MENSAJES_VENTAS_TOTALES);
      return false;
    }
    const EXPORTACIONESTOTALS =
      this.formReporteAnnual.get('totalExportaciones')?.value;
    if (!EXPORTACIONESTOTALS) {
      this.abrirModal(VALIDATORS_MENSAJES);
      this.mensajesDeValidacion.push(MENSAJES_EXPORTACIONES_TOTALS);
      return false;
    }
    if (Number(VENTASTOTALES) < Number(EXPORTACIONESTOTALS)) {
      this.abrirModal(VALIDATORS_MENSAJES);
      return false;
    }
    return true;
  }

  /**
   * @description Método para obtener y actualizar el total de importaciones.
   * @param evento Evento de entrada con el valor ingresado.
   */
  obtenerTotalImportaciones(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    if(isNaN(Number(VALOR))) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'Total importaciones deben ser mayores o iguales a cero.',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
    } else {
        this.solicitud150102Store.actualizarTotalImportaciones(VALOR);
        this.calcularReporteAnnual();
    }
  }

  /**
   * @description Selecciona una fila y actualiza los bienes producidos en el estado.
   * @param evento Objeto seleccionado de bienes producidos.
   */
  seleccionarFilaDeEntrada(evento: BienesProducidos): void {
    this.bienesProducidos = evento;
    const OBJETO_JSON = [this.bienesProducidos];
    this.solicitud150102Store.actualizarProducidosDatos(OBJETO_JSON);
  }

  /**
   * Reinicia la selección de fila de bienes producidos si el arreglo recibido no está vacío.
   *
   * @param evento - Lista de bienes producidos seleccionados desde la tabla de entrada.
   */
seleccionarBienesFilaDeEntrada(evento: BienesProducidos): void {
  const OBJETO_JSON:BienesProducidos[] = [evento];
    if (OBJETO_JSON.length > 0) {
      this.bienesProducidosSelection = -1;
    } 
}
 /**
   * Resetea los campos editables de la fila de producidos en el índice dado.
   *
   * Este método limpia los valores de los campos 'fraccion', 'bienProducido',
   * 'totalBienesProducidos', 'mercadoNacional' y 'exportaciones' de la fila
   * correspondiente en el arreglo producidosDatos, si existen.
   *
   * @param selectedIdx Índice de la fila a resetear en producidosDatos. Si es menor a 0, no realiza ninguna acción.
   */
private resetProducidosRowByIndex(selectedIdx: number): void {
  if (selectedIdx >= 0) {
    const selected = this.producidosDatos[selectedIdx];
    if (selected) {
      if ('fraccion' in selected) selected.fraccion = '';
      if ('bienProducido' in selected) selected.bienProducido = '';
      if ('totalBienesProducidos' in selected) selected.totalBienesProducidos = '';
      if ('mercadoNacional' in selected) selected.mercadoNacional = '';
      if ('exportaciones' in selected) selected.exportaciones = '';
    }
  }
}

  /**
   * @description Método para agregar nuevos bienes producidos si no existen en la lista.
   */
  agregarBienesProducidos(): void {
    if(!esValidObject(this.bienesProducidos)) {
      this.abrirModal('Se debe seleccionar un sector.');
      return;
    }

  if(!getValidDatos(this.bienesProducidos.bienProducido) && 
    !getValidDatos(this.bienesProducidos.fraccion) &&
    !getValidDatos(this.bienesProducidos.totalBienesProducidos) &&
    !getValidDatos(this.bienesProducidos.mercadoNacional) &&
    !getValidDatos(this.bienesProducidos.exportaciones)) {
      this.abrirModal('Debe de ingresar una fracción que corresponda al sector selecciondado.');
      return;
    }
    const requiredFields: { key: keyof BienesProducidos; message: string }[] = [
      { key: 'bienProducido', message: 'Debe ingresar el bien producido' },
      { key: 'totalBienesProducidos', message: 'Debe ingresar volumen del total de bienes producidos' },
      { key: 'mercadoNacional', message: 'Debe ingresar el volumen del mercado nacional' },
      { key: 'exportaciones', message: 'Debe ingresar el volumen de exportaciones' },
    ];

    for (const field of requiredFields) {
      if (!getValidDatos(this.bienesProducidos[field.key])) {
        this.abrirModal(field.message);
        return;
      }
    }
     const selectedIdx = this.producidosDatos.findIndex(
          item => item.claveSector === this.bienesProducidos.claveSector
        );
 // Validate fraccion: must be exactly 8 digits
    const fraccion = this.bienesProducidos.fraccion;
    if (!fraccion ||!/^[0-9]{8}$/.test(fraccion)) {
      this.abrirModal('La fracción arancelaria no es válida o no está vigente.');
     this.resetProducidosRowByIndex(selectedIdx);
      return;
    }
    if (
      this.bienesProducidos &&
      Object.keys(this.bienesProducidos)?.length > 0
    ) {
      const EXISTE = this.bienesProducidosDatos.some(
        (item) => item.claveSector === this.bienesProducidos.claveSector
      );  
         
      if (!EXISTE) {
        this.bienesProducidosDatos = [
          ...this.bienesProducidosDatos,
          { ...this.bienesProducidos },
        ];
        this.solicitud150102Store.actualizarBienesProducidosDatos(
          this.bienesProducidosDatos
        );
      //this.resetProducidosRowByIndex(selectedIdx);
      }
    }
  }

  /**
   * @description Calcula y actualiza el saldo y porcentaje de exportación en el reporte anual.
   */
  calcularReporteAnnual(): void {
    const TOTAL_EXPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;
    const VENTAS_TOTALES =
      parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_IMPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalImportaciones')?.value) || 0;

    let TOTAL_PORCENTAJE = 0;
    if (VENTAS_TOTALES > 0) {
      TOTAL_PORCENTAJE = (TOTAL_EXPORTACIONES / VENTAS_TOTALES) * 100;
    }
    const TOTAL_PORCENTAJE_VALUE = Number.isFinite(TOTAL_PORCENTAJE)
      ? TOTAL_PORCENTAJE.toString()
      : '0';
    this.solicitud150102Store.actualizarPorcentajeExportacion(
      TOTAL_PORCENTAJE_VALUE
    );
    const TOTAL_SALDO: number = TOTAL_EXPORTACIONES - TOTAL_IMPORTACIONES;
    this.solicitud150102Store.actualizarSaldo(TOTAL_SALDO.toString());
  }

  /**
   * Abre el modal de confirmación para eliminar un pedimento.
   *
   * @param i Índice del elemento a eliminar. Valor predeterminado: 0.
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
   * Elimina un pedimento si el usuario ha confirmado la acción.
   *
   * @param borrar Valor booleano que indica si se debe proceder con la eliminación.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.nuevaNotificacion = undefined as unknown as Notificacion;
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Reinicia la selección de bienes producidos.
   */
eliminarBienesProducidos(): void {
    if(this.bienesProducidosSelection !== -1) {
      this.abrirModal('Selecciona un registro.');
      return;
    }
    this.bienesProducidosDatos = [];
    this.bienesProducidosSelection = -1;
  } 

    /**
   * @description Verifica si el total de exportaciones es mayor que las ventas totales.
   * Si es así, muestra una notificación de alerta.
   * @returns {void}
   */
  public diferenciaTotal(): void {
    const VENTAS_TOTALES = parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_EXPORTACIONES = parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;

    if (VENTAS_TOTALES < TOTAL_EXPORTACIONES) {
      this.mostrarNotificacion({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: this.mensajeDeAlerta,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    } else {
      this.nuevaNotificacion = null;
    }
  }

    /**
   * @method mostrarNotificacion
   * @description Muestra una notificación y la limpia después del tiempo especificado
   * @param notificacion - Objeto de notificación a mostrar
   */
  private mostrarNotificacion(notificacion: Notificacion): void {
    this.nuevaNotificacion = notificacion;

 if (notificacion.tiempoDeEspera) {
      setTimeout(() => {
        this.nuevaNotificacion = null;
      }, notificacion.tiempoDeEspera);
    }
  }

  /**
   * @description Método que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable `destroyed$` para completar todas las suscripciones activas
   * y liberar recursos asociados al componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(); // Notifica a las suscripciones que deben finalizar
    this.destroyed$.complete(); // Completa el Subject para evitar fugas de memoria
  }
}
