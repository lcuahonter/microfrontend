import {
  CONFIGURACION_ENCABEZADO_FACTURAS,
  ERROR_FORMA_ALERT,
  EXPEDICION_FACTURA_FECHA,
  VALIDO,
} from '../../constantes/elegibilidad-de-textiles.enums';
import {
  Catalogo,
  CatalogoSelectComponent,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ElegibilidadDeTextilesStore,
  TextilesState,
} from '../../estados/elegibilidad-de-textiles.store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Subject, delay, forkJoin, map, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { FacturaTplCapturaRequest } from '../../models/request/facturas-tpl-captura-requet.model';
import { FacturasAsociadasService } from '../../services/facturas-asociadas.service';
import { FacturasTplCapturaResponse } from '../../models/response/facturas-tpl-captura-response.model';
import { REGEX_SOLO_DIGITOS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Solicitud120301State } from '../../estados/tramites/tramite120301.store';
import { Tramite120301Query } from '../../estados/queries/tramite120301.query';
import { UnidadMedidaService } from '../../services/catalogos/unidad-medida.service';


/**
 * @component CapturarFacturasComponent
 * @description Este componente es responsable de capturar los detalles de las facturas.
 * Incluye un formulario para capturar los datos de las facturas y una tabla para mostrar las facturas capturadas.
 */
@Component({
  selector: 'app-capturar-facturas',
  templateUrl: './capturar-facturas.component.html',
  styleUrl: './capturar-facturas.component.scss',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputFechaComponent, CatalogoSelectComponent, TablaDinamicaComponent, NotificacionesComponent, ModalModule],
})
export class CapturarFacturasComponent implements OnInit, OnDestroy {
  /** Título del modal */
  @Input() titulo: string = '';
  /**Variable para mostrar el modal */
  public mostrarModal: boolean = false;
  /** Referencia al modal */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  /** Indica si se debe abrir el modal */
  @Input() abrirModal: boolean = false;
  /** Evento que se emite al cerrar el modal */
  @Output() cerrar = new EventEmitter<void>();
  /**  Getter para exponer el FormGroup principal como 'formGroup' para integración con el padre.*/
  public get formGroup(): FormGroup { return this.facturaForm; }
  /** @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado. */
  @Input()
  formularioDeshabilitado: boolean = false;
  /** @property {FormGroup} facturaForm - El grupo de formularios para capturar los datos de las facturas. */
  facturaForm!: FormGroup;
  /**
 * @property {string} formularioAlertaError
 * @description
 * Mensaje HTML que se muestra cuando el formulario no es válido y faltan campos requeridos por capturar.
 * Se utiliza para mostrar una alerta visual al usuario en la interfaz.
 * Vacío cuando el formulario es válido.
 */
  public formularioAlertaError: string = '';

  /**
   * @property {boolean} esFormaValido
   * @description
   * Bandera booleana que indica si el formulario tiene errores de validación.
   * Si es `true`, se muestra el mensaje de error; si es `false`, el formulario es válido y no se muestra la alerta.
   */
  public esFormaValido: boolean = false;

  /**
   * @property {EventEmitter<boolean>} mostrarTabs - Emite un valor booleano para mostrar las pestañas adicionales.
   * EventEmitter que comunica al componente padre cuándo debe mostrar las pestañas de navegación.
   * Se activa cuando el usuario completa exitosamente el proceso de guardado o validación.
   * Permite la coordinación entre componentes para la navegación de la interfaz.
   */
  @Output() mostrarTabs: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** @property {string[]} selectRangoDias - Array de rangos de días seleccionables. */
  selectRangoDias: string[] = [];

  /**
   * @property {boolean} colapsable - Booleano para controlar el estado colapsable de la interfaz.
   * Permite mostrar u ocultar secciones de la interfaz de usuario.
   */
  colapsable: boolean = false;

  /**
   * @property {FormGroup} ConstanciaDelRegistro - El grupo de formularios para datos de la constancia de registro.
   * Contiene los controles del formulario relacionados con la constancia del registro.
   */
  ConstanciaDelRegistro!: FormGroup;

  /**
   * @property {CapturarColumns[]} facturas - Array de datos de facturas para mostrar en la tabla.
   * Contiene la información de todas las facturas capturadas que se visualizan en la tabla dinámica.
   */
  facturas: FacturasTplCapturaResponse[] = [];
  /**
   *  @property {CapturarColumns[]} facturaSeleccionada - Array de facturas seleccionadas en la tabla. 
   */
  facturaSeleccionada: FacturasTplCapturaResponse[] = [];
  /**  
   * @property {CapturasColumns} facturaModificar - Objeto que contiene los datos de la factura a modificar. 
   */
  facturaModificar?: FacturasTplCapturaResponse;
  /**
   * @property {Subject<void>} destroyNotifier$ - Notificador para cancelar suscripciones y evitar fugas de memoria.
   * Utilizado con operadores como `takeUntil`.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**  @property {TextilesState} capturarState - Estado actual relacionado con la captura de datos textiles. */
  private capturarState!: TextilesState;

  /**  @property {SeccionLibState} seccionState - Estado actual de la sección en el módulo de librerías. */
  private seccionState!: SeccionLibState;

  /**
     * @property {Solicitud120301State} solicitudState - Estado de la solicitud en el store de Akita.
     * Almacena el estado completo de la solicitud según la arquitectura Akita,
     * incluyendo todos los datos relevantes para el manejo del estado de la aplicación.
     * Se actualiza mediante los correspondientes stores y queries de Akita.
     */
  public solicitudState!: Solicitud120301State;
  /**
   * @property {TablaSeleccion} TablaSeleccion - Referencia a la enumeración o constante `TablaSeleccion`
   * para su uso en la plantilla o lógica del componente.
   * Utilizada para configurar opciones de selección en las tablas dinámicas.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @property {ConfiguracionColumna<CapturarColumns>[]} tableColumns - Array de configuración de columnas de la tabla.
   * Define la estructura, encabezados y orden de las columnas que se mostrarán en la tabla de facturas.
   * Cada elemento especifica el encabezado, la clave de acceso a los datos y el orden de visualización.
   */
  tableColumns = CONFIGURACION_ENCABEZADO_FACTURAS;

  /**
     * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
     * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
     */
  nuevaNotificacion!: Notificacion;
  /**
  * @property {boolean} showFechaExpedicionFactura
  * @description
  * Controla la visualización del campo de fecha de expedición de la factura en el formulario.
  * Se utiliza principalmente en el método limpiarFacturaForm() para forzar el reinicio visual del componente de fecha,
  * asegurando que el campo se limpie correctamente y se actualice en la interfaz de usuario.
  * Es útil cuando el componente de fecha necesita ser reseteado completamente, ya que Angular no siempre actualiza los controles visuales solo con cambios en el valor del formulario.
  */
  showFechaExpedicionFactura: boolean = true;

  /**
   * @property {'agregar' | 'modificar'} modalMode
   * @description
   * Estado actual del modal de facturas, indica si el formulario está en modo "agregar" (nueva factura)
   * o en modo "modificar" (edición de factura existente). Se utiliza para controlar la lógica de guardado
   * y la visualización de los datos en el formulario modal.
   */
  modalMode: 'agregar' | 'modificar' = 'agregar';

  /** Variable para controlar la visibilidad del modal de agregar agente */
  agregarAgentemodal = false;
  eliminarFacturaModal = false;

  /**
  * @property {Catalogo[]} unidadDeMedida - Configuración para el select de unidad de medida.
  * Array que contiene las opciones disponibles para el campo de unidad de medida en el formulario.
  * Se carga dinámicamente desde el servicio al inicializar el componente.
  */
  unidadDeMedida!: Catalogo[];

  /**
   * @property {InputFecha} fechaInicioInputs - Configuración para el input de fecha de expedición de la factura.
   * Contiene la configuración específica para el campo de fecha, incluyendo formato,
   * validaciones y restricciones de fechas permitidas.
   */
  fechaInicioInputs: InputFecha = EXPEDICION_FACTURA_FECHA;
  facturaRequerida: boolean = true;

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para el funcionamiento del componente.
   * Se inyectan todas las dependencias requeridas para el manejo de formularios, peticiones HTTP,
   * gestión de estado y consultas de datos relacionados con la elegibilidad de textiles.
   * @param {ElegibilidadTextilesService} ElegibilidadTextilesService - Servicio para manejar la lógica de elegibilidad de textiles.
   * @param {HttpClient} httpServicios - Cliente HTTP de Angular para realizar peticiones HTTP.
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular para crear y gestionar formularios.
   * @param {ElegibilidadDeTextilesStore} ElegibilidadDeTextilesStore - Store para gestionar el estado de elegibilidad de textiles.
   * @param {ElegibilidadDeTextilesQuery} ElegibilidadDeTextilesQuery - Query para recuperar el estado de elegibilidad de textiles.
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado relacionado con secciones.
   * @param {SeccionLibQuery} seccionQuery - Query para recuperar el estado relacionado con secciones.
   * @param {ChangeDetectorRef} cdr - ChangeDetectorRef para detectar cambios en la vista.
   */
  constructor(
    private readonly fb: FormBuilder,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private ElegibilidadDeTextilesQuery: ElegibilidadDeTextilesQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private unidadMedidaService: UnidadMedidaService,
    private cdr: ChangeDetectorRef,
    private facturasAsociadasService: FacturasAsociadasService,
    private tramite120301Query: Tramite120301Query,
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   * Configura las suscripciones a los observables del estado, inicializa el formulario,
   * obtiene las listas desplegables, recupera los datos de las facturas y establece
   * la validación del formulario. También maneja el estado de habilitación/deshabilitación del formulario.
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.tramite120301Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.ElegibilidadDeTextilesQuery.selectTextile$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.capturarState = state as TextilesState;
        })
      )
      .subscribe();
    this.initActionFormBuild();
    this.obtenerListasDesplegables();
    this.recuperarDatos();
    this.seccionStore.establecerFormaValida([false]);
    this.facturaForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.facturaForm.valid) {
            this.ElegibilidadDeTextilesStore.setFormaValida([
              ...this.capturarState.formaValida,
              { id: 2, descripcion: 'Valida' },
            ]);
          }
        })
      )
      .subscribe();
    if (
      this.capturarState.formaValida &&
      this.capturarState.formaValida[0] &&
      this.capturarState.formaValida[0].descripcion === VALIDO
    ) {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([true]);
    } else {
      this.seccionStore.establecerFormaValida([false]);
    }
    if (this.formularioDeshabilitado) {
      this.facturaForm.disable();
    }
  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo para capturar los datos de las facturas.
   * Crea todos los controles del formulario con sus validadores correspondientes,
   * incluyendo campos para número de factura, cantidad total, unidad de medida,
   * valor en dólares, información del proveedor y datos de dirección.
   * Los valores iniciales se obtienen del estado actual almacenado.
   * @returns {void} No retorna ningún valor.
   */
  initActionFormBuild(): void {
    this.facturaForm = this.fb.group({
      numeroFactura: [{ value: this.capturarState.numeroFactura }, [Validators.required, Validators.maxLength(50)]],
      cantidadTotal: [
        { value: this.capturarState.cantidadTotal },
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)],
      ],
      unidadDeMedida: [{ value: this.capturarState.unidadDeMedida, disabled: true }, Validators.required],
      valorDolares: [
        { value: this.capturarState.valorDolares },
        [Validators.required],
      ],
      taxId: [{ value: this.capturarState.taxId }, [Validators.maxLength(35)]],
      razonSocial: [{ value: this.capturarState.razonSocial }, [Validators.required, Validators.maxLength(70)]],
      calle: [{ value: this.capturarState.calle }, [Validators.required, Validators.maxLength(70)]],
      ciudad: [{ value: this.capturarState.ciudad }, [Validators.required, Validators.maxLength(35)]],
      cp: [
        { value: this.capturarState.cp },
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(9)],
      ],
      pais: [{ value: this.solicitudState.pais_origen_destino || this.capturarState.pais, disabled: true }, Validators.required],
      fechaExpedicionFactura: [{ value: this.capturarState.fechaExpedicionFactura }, Validators.required],
    });
  }
  onInputUppercase(fieldName: string, event: Event): void {
    const TARGET = event.target as HTMLInputElement | null;
    const VALUE = (TARGET?.value ?? '').toString().toUpperCase();
    this.facturaForm.get(fieldName)?.setValue(VALUE);
  }
  /**
   * @method obtenerListasDesplegables
   * @description Obtiene las listas desplegables necesarias para el formulario.
   * Método coordinador que ejecuta la carga de todos los catálogos y listas
   * requeridas para poblar los campos de selección del formulario.
   * @returns {void} No retorna ningún valor.
   */
  obtenerListasDesplegables(): void {
    this.unidadMedidaService.getUnidadMedida()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (data) => {
          if (data.codigo === '00') {
            this.unidadDeMedida = data.datos || [];
            if (this.solicitudState?.unidadMedida) {
              const MATCH = this.unidadDeMedida.find(
                (item) => item.descripcion?.toLowerCase() === this.solicitudState.unidadMedida.toLowerCase()
              );
              if (MATCH) {
                this.facturaForm.get('unidadDeMedida')?.setValue(MATCH.clave || '');
                this.ElegibilidadDeTextilesStore.setUnidadDeMedida(MATCH.clave || '');
              }
            }
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
          this.unidadDeMedida = [];
        }
      });
  }

  /**
   * @method setValoresStore
   * @description Establece los valores en el store de textiles.
   * Método utilitario que extrae el valor de un campo específico del formulario
   * y lo almacena en el store utilizando el método especificado.
   * @param {FormGroup} form - El formulario del cual extraer el valor.
   * @param {string} campo - El nombre del campo del formulario a extraer.
   * @param {keyof ElegibilidadDeTextilesStore} metodoNombre - El nombre del método del store a ejecutar.
   * @returns {void} No retorna ningún valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof ElegibilidadDeTextilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.ElegibilidadDeTextilesStore[metodoNombre] as (value: string) => void)(
      VALOR
    );
  }

  /**
   * @method recuperarDatos
   * @description Obtiene los datos de las facturas desde el servicio.
   * Realiza una petición HTTP para cargar los datos de las facturas desde un archivo JSON
   * y los asigna a la propiedad facturas para su visualización en la tabla.
   * Incluye validación para asegurar que la respuesta sea un array válido.
   * @returns {void} No retorna ningún valor.
   */
  recuperarDatos(): void {
    this.facturasAsociadasService
      .getFacturasTplAll(
        "AAL0409235E6",
        this.solicitudState.idExpedicion,
        this.solicitudState.identificadorRegimen
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === '00' && response.datos) {
            this.facturas = response.datos;
          } else {
            this.facturas = [];
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
          this.facturas = [];
        }
      });
  }

  /**
   * Método para continuar al siguiente paso, validando el campo cantidadFacturas.
   * Si el formulario es inválido, muestra el mensaje de error y no permite continuar.
   * Si es válido, limpia el error y permite continuar.
   */
  continuar(): void {
    this.facturaForm.markAllAsTouched();
    this.facturaForm.updateValueAndValidity();
    this.cdr.detectChanges();
    if (!this.facturaForm.valid) {
      this.formularioAlertaError = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      window.scrollTo(0, 0);
      return;
    }
    this.esFormaValido = false;
    this.formularioAlertaError = '';
    this.mostrarTabs.emit(true);
  }

  /**
   * @method ngOnDestroy
   * @description Método que se ejecuta cuando el componente es destruido.
   * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
   * todas las suscripciones activas mediante el subject destroyNotifier$.
   * Es una implementación estándar del patrón de limpieza en Angular.
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @method VisualizarAgregar
   * @description Método para cambiar la vista y permitir la captura de una nueva factura.
   * Cambia las banderas internas para mostrar el formulario de captura y ocultar la tabla de facturas.
   * @returns {void} No retorna ningún valor.
   */
  VisualizarAgregarFactura(): void {
    this.modalMode = 'agregar';
    this.facturaModificar = undefined;
    this.facturaForm.reset();
    this.facturaForm.get('unidadDeMedida')?.setValue('1');
    this.facturaForm.get('pais')?.enable();
    this.facturaForm.get('pais')?.setValue('ESTADOS UNIDOS DE AMERICA');
    setTimeout(() => {
      this.facturaForm.get('pais')?.disable();
    });
    this.agregarAgentemodal = true;
  }

  /**
   * @method agregarFactura
   * @description Método para cambiar la vista y permitir la captura de una nueva factura.
   * Cambia las banderas internas para mostrar el formulario de captura y ocultar la tabla de facturas.
   * @returns {void} No retorna ningún valor.
   */
  agregarModificarFactura(): void {
    this.facturaForm.markAllAsTouched();
    this.facturaForm.updateValueAndValidity();
    this.cdr.detectChanges();
    if (!this.facturaForm.valid) {
      this.formularioAlertaError = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      return;
    }
    this.formularioAlertaError = '';
    this.esFormaValido = false;
    const RAWFECHA = this.facturaForm.get('fechaExpedicionFactura')?.value;
    let fechaFormateada = '';
    if (RAWFECHA) {
      const PARTES = RAWFECHA.split('/');
      if (PARTES.length === 3) {
        const [DIA, MES, ANIO] = PARTES;
        fechaFormateada = `${ANIO}-${MES.padStart(2, '0')}-${DIA.padStart(2, '0')}`;
      } else {
        const FECHAOBJ = new Date(RAWFECHA);
        fechaFormateada = FECHAOBJ.toISOString().split('T')[0];
      }
    }

    // Get values from disabled controls - use getRawValue() to get all values including disabled ones
    const FORMVALUES = this.facturaForm.getRawValue();

    const FACTURA: FacturaTplCapturaRequest = {
      id_factura_expedicion: this.facturaModificar?.id_factura_expedicion || null,
      num_factura: FORMVALUES.numeroFactura,
      fecha_expedicion: fechaFormateada,
      razon_social_consig_emisor: FORMVALUES.razonSocial,
      ide_regimen: this.solicitudState.identificadorRegimen ?? '',
      cantidad: FORMVALUES.cantidadTotal,
      importe_dolares: FORMVALUES.valorDolares,
      domicilio: FORMVALUES.calle,
      cve_unidad_medida: FORMVALUES.unidadDeMedida,
      tax_id: FORMVALUES.taxId,
      ciudad: FORMVALUES.ciudad,
      cp: FORMVALUES.cp,
      pais: FORMVALUES.pais,
    };
    this.facturasAsociadasService.postFacturasTplAgregar(this.solicitudState.idSolicitud, FACTURA).subscribe({
      next: (response) => {
        if (response.codigo === '00') {
          this.ElegibilidadDeTextilesStore.setRequiereFacturas(true);
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: this.modalMode === 'agregar' ? 'Factura agregada correctamente.' : 'Factura modificada correctamente.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.recuperarDatos();
          this.cerrarModal()
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: `El número de factura [${this.facturaModificar?.num_factura}], ya se encuentra asociada a una expedición y no puede ser modificada. Favor de verificar.`,
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          this.nuevaNotificacion = { ...this.nuevaNotificacion };
          this.formularioAlertaError = `No se pudo ${this.modalMode === 'agregar' ? 'agregar' : 'modificar'} la factura: ${response.mensaje}`;
          this.esFormaValido = true;
        }
      },
      error: (error) => {
        console.error('Error al agregar la factura:', error);
        this.formularioAlertaError = `Error inesperado al ${this.modalMode === 'agregar' ? 'agregar' : 'modificar'} la factura.`;
        this.esFormaValido = true;
      }
    });
  }
  /**
   * @method modificarFactura
   * @description Método para cambiar la vista y permitir la modificación de una factura existente.
   * Cambia las banderas internas para mostrar el formulario de captura y ocultar la tabla de facturas.
   * @returns {void} No retorna ningún valor.
   */
  visualizarModificarFactura(): void {
    if (!this.facturaSeleccionada || this.facturaSeleccionada.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.facturaSeleccionada.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar solo un registro.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const FACTURA_SELECCIONADA = this.facturaSeleccionada[0];
    this.facturaModificar = FACTURA_SELECCIONADA;
    this.modalMode = 'modificar';
    let unidadClave: string | null = null;
    if (FACTURA_SELECCIONADA.descripcion && this.unidadDeMedida?.length > 0) {
      const MATCH = this.unidadDeMedida.find(
        (item) => item.descripcion?.toLowerCase() === FACTURA_SELECCIONADA.descripcion.toLowerCase()
      );
      if (MATCH) {
        unidadClave = MATCH.clave || null;
      }
    }
    let fechaFormateada = '';
    if (FACTURA_SELECCIONADA.fecha_expedicion) {
      const PARTES = FACTURA_SELECCIONADA.fecha_expedicion.split(' ')[0].split('-'); // ["DD", "MM", "YYYY"]
      if (PARTES.length === 3) {
        fechaFormateada = `${PARTES[2]}/${PARTES[1]}/${PARTES[0]}`;
      }
    }
    this.facturaForm.patchValue({
      numeroFactura: FACTURA_SELECCIONADA.num_factura,
      razonSocial: FACTURA_SELECCIONADA.razon_social_consig_emisor,
      calle: FACTURA_SELECCIONADA.direccion_consig_emisor,
      fechaExpedicionFactura: FACTURA_SELECCIONADA.fecha_expedicion ? fechaFormateada : '',
      cantidadTotal: FACTURA_SELECCIONADA.cantidad,
      unidadDeMedida: unidadClave,
      valorDolares: FACTURA_SELECCIONADA.imp_dls,
      taxId: FACTURA_SELECCIONADA.tax_id_consig_emisor,
      ciudad: FACTURA_SELECCIONADA.ciudad_consig_emisor,
      cp: FACTURA_SELECCIONADA.cp_consig_emisor,
      pais: FACTURA_SELECCIONADA.pais_consig_emisor,
    });
    this.agregarAgentemodal = true;
  }

  /**
   * @method eliminarSeleccionados
   * @description Método para cancelar la acción de agregar o modificar facturas.
   * Cambia las banderas internas para ocultar el formulario de captura y mostrar la tabla de facturas.
   * @returns {void} No retorna ningún valor.
   */
  eliminarSeleccionados(): void {
    const IDS_A_ELIMINAR = this.facturaSeleccionada.map(factura => factura.id_factura_expedicion).filter(id => id !== null) as number[];
    const NUM_FACTURAS = this.facturaSeleccionada.map(factura => factura.num_factura).filter(id => id !== null) as string[];
    if (IDS_A_ELIMINAR.length === 0) {
      return;
    }

    // Use forkJoin to handle multiple concurrent deletions
    const DELETEOBSERVABLES = IDS_A_ELIMINAR.map(id =>
      this.facturasAsociadasService.deleteFactura(id)
    );

    forkJoin(DELETEOBSERVABLES).subscribe({
      next: (responses) => {
        const ALLSUCCESS = responses.every(response => response.codigo === '00');
        if (ALLSUCCESS) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: 'Factura(s) eliminada(s) correctamente.',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          this.recuperarDatos();
          this.facturaSeleccionada = [];
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: `El número de factura [${NUM_FACTURAS.join(', ')}], ya se encuentra asociado a una expedición y no puede ser eliminada. Favor de verificar.`,
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          this.recuperarDatos();
          this.facturaSeleccionada = [];
        }
      },
      error: (error) => {
        console.error('Error al eliminar facturas:', error);
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: 'Error inesperado al eliminar la(s) factura(s).',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
      }
    });
  }

  /**
   * @method limpiarFormulario
   * @description Método para limpiar el formulario de captura de facturas.
   * Resetea todos los campos del formulario y limpia cualquier mensaje de error o estado de validación.
   * @returns {void} No retorna ningún valor.
   */
  limpiarFormulario(): void {
    const PAISES_VALUE = this.facturaForm.get('pais')?.value || 'ESTADOS UNIDOS DE AMERICA';
    const UNIDAD_DE_MEDIDA_VALUE = this.facturaForm.get('unidadDeMedida')?.value || '1';
    this.facturaForm.reset();
    this.facturaForm.get('pais')?.enable();
    this.facturaForm.get('pais')?.setValue(PAISES_VALUE);
    this.facturaForm.get('unidadDeMedida')?.setValue(UNIDAD_DE_MEDIDA_VALUE);
    setTimeout(() => {
      this.facturaForm.get('pais')?.disable();
    });
  }

  /**
   * @method abrirModalEliminar
   * @description Método para abrir el modal de confirmación de eliminación de facturas.
   * Muestra el modal y prepara la interfaz para que el usuario confirme o cancele la eliminación.
   */
  abrirModalEliminar(): void {
    if (!this.facturaSeleccionada || this.facturaSeleccionada.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione factura a eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.eliminarFacturaModal = true;
  }

  /**
   * @method cerrarModal
   * @description Método para cerrar el modal de captura de facturas.
   * Oculta el modal y emite un evento al componente padre para notificar el cierre.
   */
  cerrarModal(): void {
    // Cierra la modal si la referencia está disponible
    this.modal?.hide();
    this.agregarAgentemodal = false;
    this.modalMode = 'agregar';
    // Reset form to clear any modifications
    this.facturaModificar = undefined;
    // Emite el evento de cierre para notificar al padre
    this.cerrar.emit();
    // Detecta cambios en la UI
    this.cdr.detectChanges();
  }

  /**
   * @method abrirEliminarModal
   * @description Método para abrir el modal de confirmación de eliminación de facturas.
   * Muestra el modal y prepara la interfaz para que el usuario confirme o cancele la eliminación.
   */
  aceptarEliminarFacturas(): void {
    this.eliminarSeleccionados();
    this.cerrarEliminarModal();
  }

  /**
   * @method cerrarEliminarModal
   * @description Método para cerrar el modal de confirmación de eliminación de facturas.
   * Oculta el modal y emite un evento al componente padre para notificar el cierre.
   */
  cerrarEliminarModal(): void {
    this.modal?.hide();
    this.eliminarFacturaModal = false;
    this.cerrar.emit();
    this.cdr.detectChanges();
  }

  /**
  * Método que se ejecuta al ocultar el modal.
  */
  onHidden(): void {
    this.mostrarModal = false;
  }
}