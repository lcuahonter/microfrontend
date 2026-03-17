import {
  CLASIFICACION_NALADISA_1993_IDS,
  CLASIFICACION_NALADISA_1996_IDS,
  CLASIFICACION_NALADISA_2002_IDS,
  CLASIFICACION_NALADI_IDS,
  CONFIGURACION_INSUMOS_MERCANCIA_TABLA,
  CRITERIO_PARA_CLASIFICATION,
  CRITERIO_PARA_CONFERIR_ORIGEN_IDS,
  CRITERIO_PARA_TRATO_PREFERENCIAL_IDS,
  FECHA,
  FECHA_DE_PAGO,
  FECHA_FACTURA_IDS,
  FECHA_FACTURA_REFERENCIA,
  FECHA_FACTURA_REFERENCIA_IDS,
  FECHA_PAGO,
  FRACCION_ARANCELARIA_IDS,
  MARCA_BRUTA_IDS,
  MARCA_IDS,
  NOMBRE_EN_INGLES_IDS,
  NORMA_ORIGEN_IDS,
  NUMERO_DE_SERIE_IDS,
  N_FACTURA_IDS,
  N_FACTURA_REFERENCIA_IDS,
  OTRAS_INSTANCIAS_IDS,
  REQUIRED_CANTIDAD,
  REQUIRED_COMPLEMENTO_DESCRIPCION,
  REQUIRED_FECHA_FACTURA,
  REQUIRED_NUMERO_FACTURA,
  REQUIRED_TIPO_FACTURA,
  REQUIRED_UMC,
  REQUIRED_VALOR_MERCANCIA,
  TIPO_DE_FACTURA_IDS,
  TIPO_DE_FACTURA_REFERENCIA_IDS,
  UMC_IDS,
  UMC_MARCA_BRUTA_IDS,
  UNIDAD_MEDIDA_COMERCIALIZACION_IDS,
  VALOR_CONTENIDO_REGIONAL_IDS,
  VALOR_MERCANCIA_IDS
} from '../../constantes/mercancia.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_DESCRIPCION,
  SeccionLibQuery,
  SeccionLibState,
  TablaDinamicaComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  CatalogoServices,
  REGEX_PATRON_DECIMAL_15_4,
} from '@ng-mf/data-access-user';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InsumosDisponibles, Mercancia } from '../../models/modificacion.enum';
import { Subject, delay, of, takeUntil } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MercanciaService } from '../../services/mercancia.service';
import { Modal } from 'bootstrap';
import { ValidationErrors } from '@angular/forms';

export function validarCantidad(
  control: AbstractControl
): ValidationErrors | null {
  const VAL = control.value;

  if (VAL === null || VAL === undefined || VAL === '') {
    return null;
  }

  const REGEX = REGEX_PATRON_DECIMAL_15_4;

  return REGEX.test(VAL.toString()) ? null : { cantidadInvalida: true };
}

/**
 * @descripcion
 * El componente `MercanciaComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de mercancías en el módulo PERU.
 */
@Component({
  selector: 'app-datos-mercancia-model',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './mercancia.component.html',
  styleUrl: './mercancia.component.scss',
})
export class MercanciaComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @descripcion
   * Indica si se debe mostrar la alerta.
   */
  mostrarAlerta: boolean = false;

  /**
   * @descripcion
   * Mensaje de alerta que se muestra al usuario.
   */
  mensajeDeAlerta: string =
    'La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado/acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.';

  /**
   * @descripcion
   * Evento que se emite al cerrar el modal.
   */
  @Output() cerrarClicado = new EventEmitter();

  /**
   * @descripcion
   * Evento que se emite al seleccionar una fila en la tabla.
   */
  @Output() tablaSeleccionEvent = new EventEmitter();

  /**
   * @description
   * Evento que emite los datos relacionados con las mercancías al componente padre.
   * Se utiliza para notificar cambios o actualizaciones en la lista de mercancías.
   */
  @Output() EMITMERCANIAS = new EventEmitter();

  /**
   * @descripcion
   * Evento que se emite al guardar los datos del formulario.
   */
  @Output() guardarClicado = new EventEmitter();

  /**
   * @descripcion
   * Datos seleccionados para la mercancía.
   */
  @Input() datosSeleccionados!: Mercancia;

  /**
   * @description
   * Indica si el componente se está utilizando desde la sección de mercancías disponibles.
   * Este valor se recibe como entrada desde el componente padre y controla el comportamiento o la vista del componente.
   */
  @Input() fromMercanciasDisponibles: boolean = false;

  /**
   * @descripcion
   * Formulario para capturar los datos de la mercancía.
   */
  mercanciaForm!: FormGroup;

  insumosForm!: FormGroup;

  /**
   * @descripcion
   * Lista de unidades de medida y clasificación (UMC) disponibles.
   */
  umc: Catalogo[] = [];

  /**
   * @description
   * Lista de opciones disponibles para las Unidades de Medida Comercial (UMC).
   * Se utiliza para poblar menús desplegables o listas de selección en el formulario.
   */
  optionsUMC: Catalogo[] = [];

  /**
   * @descripcion
   * Lista de unidades de medida y clasificación (UMC) disponibles.
   */
  umcMedida: Catalogo[] = [];

  /**
   * @descripcion
   * Lista de facturas disponibles.
   */
  factura: Catalogo[] = [];

  /**
     * @descripcion
     * Lista de unidades de medida y clasificación (UMC) disponibles para la marca bruta.
     */
  umcMarcaBrutaCatalogo: Catalogo[] = [];

  /**
   * @descripcion
   * Fecha final para el formulario.
   */
  fechaFactura: InputFecha = FECHA;

  /**
   * @descripcion
   * Fecha final para el formulario.
   */
  fechaDePago: InputFecha = FECHA_PAGO;

  /**
   * @descripcion
   * Fecha final para el formulario.
   */
  fechaFacturaReferencia: InputFecha = FECHA_FACTURA_REFERENCIA;

  /**
   * @descripcion
   * Notificador para gestionar la destrucción de suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Estado actual de la sección.
   */
  private seccionState!: SeccionLibState;
  /**
   * @public
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva notificación que se utilizará en el componente.
   * @command Este campo debe ser inicializado antes de su uso.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @descripcion
   * Indica si el formulario de mercancía se encuentra en modo solo lectura.
   */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * @property idProcedimiento
   * @description Identificador del procedimiento asociado a este componente.
   * @type {number}
   */
  @Input() idProcedimiento!: number;

  /**
   * Contiene los identificadores de fracción arancelaria.
   * @type {number[]}
   */
  FRACCION_ARANCELARIA: number[] = FRACCION_ARANCELARIA_IDS;

  /**
   * Contiene los identificadores de clasificación NALADI.
   * @type {number[]}
   */
  CLASIFICACION_NALADI: number[] = CLASIFICACION_NALADI_IDS;

  /**
   * Contiene los identificadores de clasificación NALADISA 1993.
   * @type {number[]}
   */
  CLASIFICACION_NALADISA_1993: number[] = CLASIFICACION_NALADISA_1993_IDS;

  /**
   * Contiene los identificadores de clasificación NALADISA 1996.
   * @type {number[]}
   */
  CLASIFICACION_NALADISA_1996: number[] = CLASIFICACION_NALADISA_1996_IDS;

  /**
   * Contiene los identificadores de clasificación NALADISA 2002.
   * @type {number[]}
   */
  CLASIFICACION_NALADISA_2002: number[] = CLASIFICACION_NALADISA_2002_IDS;

  /**
   * Contiene los identificadores del número de factura de referencia.
   * @type {number[]}
   */
  N_FACTURA_REFERENCIA: number[] = N_FACTURA_REFERENCIA_IDS;

  /**
   * Contiene los identificadores del número de factura.
   * @type {number[]}
   */
  N_FACTURA: number[] = N_FACTURA_IDS;

  /**
   * Contiene los identificadores de la norma de origen.
   * @type {number[]}
   */
  NORMA_ORIGEN: number[] = NORMA_ORIGEN_IDS;

  /**
   * Contiene los identificadores del nombre en inglés.
   * @type {number[]}
   */
  NOMBRE_EN_INGLES: number[] = NOMBRE_EN_INGLES_IDS;

  /**
   * Contiene los identificadores de otras instancias relacionadas.
   * @type {number[]}
   */
  OTRAS_INSTANCIAS: number[] = OTRAS_INSTANCIAS_IDS;

  /**
   * Contiene los identificadores del criterio para conferir origen.
   * @type {number[]}
   */
  CRITERIO_PARA_CONFERIR_ORIGEN: number[] = CRITERIO_PARA_CONFERIR_ORIGEN_IDS;

  /**
   * Contiene los identificadores del criterio para trato preferencial.
   * @type {number[]}
   */
  CRITERIO_PARA_TRATO_PREFERENCIAL: number[] =
    CRITERIO_PARA_TRATO_PREFERENCIAL_IDS;

  /**
   * Contiene los identificadores del valor de la mercancía.
   * @type {number[]}
   */
  VALOR_MERCANCIA: number[] = VALOR_MERCANCIA_IDS;

  /**
   * Contiene los identificadores del valor de contenido regional.
   * @type {number[]}
   */
  VALOR_CONTENIDO_REGIONAL: number[] = VALOR_CONTENIDO_REGIONAL_IDS;

  /**
   * Contiene los identificadores de la fecha de la factura.
   * @type {number[]}
   */
  FECHA_FACTURA: number[] = FECHA_FACTURA_IDS;

  /**
   * Contiene los identificadores de la fecha de la factura de referencia.
   * @type {number[]}
   */
  FECHA_FACTURA_REFERENCIA: number[] = FECHA_FACTURA_REFERENCIA_IDS;

  /**
   * Contiene los identificadores del tipo de factura.
   * @type {number[]}
   */
  TIPO_DE_FACTURA: number[] = TIPO_DE_FACTURA_IDS;

  /**
   * Contiene los identificadores del tipo de factura de referencia.
   * @type {number[]}
   */
  TIPO_DE_FACTURA_REFERENCIA: number[] = TIPO_DE_FACTURA_REFERENCIA_IDS;

  /**
   * Contiene los identificadores del número de serie.
   * @type {number[]}
   */
  NUMERO_DE_SERIE: number[] = NUMERO_DE_SERIE_IDS;

  /**
   * Contiene los identificadores asociados a la marca.
   * @type {number[]}
   */
  MARCA: number[] = MARCA_IDS;

  /**
   * Contiene los identificadores asociados a la marca bruta.
   * @type {number[]}
   */
  MARCA_BRUTA: number[] = MARCA_BRUTA_IDS;

  /**
   * Contiene los identificadores en los que el campo "UMC Marca Bruta" es obligatorio.
   */
  UMC_MARCA_BRUTA: number[] = UMC_MARCA_BRUTA_IDS;
  /**
   * Contiene los identificadores en los que el campo "Cantidad" es obligatorio.
   */
  CRITERIO_PARA_CLASIFICATION: number[] = CRITERIO_PARA_CLASIFICATION;

  /**
   * Contiene los identificadores en los que el campo "Fecha de pago" es obligatorio.
   */
  FECHA_DE_PAGO: number[] = FECHA_DE_PAGO;

  /**
   * @description
   * Contiene los identificadores de las unidades de medida utilizadas para la comercialización.
   * Estos valores se obtienen de la constante `UNIDAD_MEDIDA_COMERCIALIZACION_IDS`
   * y se utilizan para filtrar o validar las unidades disponibles en el sistema.
   */
  UNIDAD_MEDIDA_COMERCIALIZACION: number[] = UNIDAD_MEDIDA_COMERCIALIZACION_IDS;

  /**
    * @descripcion
    * Referencia al elemento del modal de modificación.
    */
  @ViewChild('modifyModal', { static: true }) modifyModal!: ElementRef;

  /**
   * @descripcion
   * Instancia del modal de modificación.
   */
  modalInstance!: Modal;

  /**
   * @description
   * Contiene los identificadores de las unidades de medida de comercialización.
   * Se utiliza para referenciar las unidades válidas dentro del flujo de captura o validación.
   */
  UMC: number[] = UMC_IDS;

  isInsumosDisponiblesMercancia: boolean = false;

  configuracionInsumosMercanciaDisponible: ConfiguracionColumna<InsumosDisponibles>[] = CONFIGURACION_INSUMOS_MERCANCIA_TABLA;

  @Input() tableInsumosData: InsumosDisponibles[] = [];

  insumosDisponiblesSeleccionado!: InsumosDisponibles;

  /**
   * @descripcion
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param mercanciaService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de mercancías.
   * @param query - Consulta para obtener el estado del formulario.
   * @param seccionStore - Almacén para gestionar el estado de la sección.
   * @param seccionQuery - Consulta para obtener el estado de la sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    private mercanciaService: MercanciaService,
    private seccionQuery: SeccionLibQuery,
    public catalogoServices: CatalogoServices,
    private validacionesService: ValidacionesFormularioService
  ) { }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene los datos iniciales para el formulario.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((s) => (this.seccionState = s));
    if (this.UNIDAD_MEDIDA_COMERCIALIZACION.includes(this.idProcedimiento)) {
      this.getUmc();
    }
    if (this.UMC_MARCA_BRUTA.includes(this.idProcedimiento)) {
      this.getUumcMarcaBruta();
    }
    this.getUnidadesMedidaComercial();
    this.getTipoFactura();
    this.initActionFormBuild();
  }
  /** Método público para marcar todos los campos como tocados y mostrar errores */
  public markAllFieldsTouched(): void {
    if (this.mercanciaForm) {
      this.mercanciaForm.markAllAsTouched();
    }
  }

  /**
   * Detecta los cambios en las propiedades de entrada del componente y actualiza el estado en consecuencia.
   *
   * @param {SimpleChanges} changes - Objeto que contiene los cambios detectados en las propiedades @Input().
   * @returns {void}
   *
   * @description
   * Este método se ejecuta automáticamente cuando cambian las propiedades de entrada del componente:
   * - Si cambia `datosSeleccionados`, se actualiza su valor y se reconstruye el formulario llamando a `initActionFormBuild()`.
   * - Si cambia `fromMercanciasDisponibles`, se actualiza su valor en la propiedad correspondiente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosSeleccionados']?.currentValue) {
      this.datosSeleccionados = changes['datosSeleccionados']?.currentValue;
      this.initActionFormBuild();
    }
    if (changes['fromMercanciasDisponibles']?.currentValue) {
      this.fromMercanciasDisponibles =
        changes['fromMercanciasDisponibles']?.currentValue;
    }
    if (changes['tableInsumosData'] && changes['tableInsumosData']?.currentValue) {
      this.isInsumosDisponiblesMercancia = (this.tableInsumosData && this.tableInsumosData.length > 0) ? true : false;
    }
  }

  /**
   * @descripcion
   * Inicializa el formulario de mercancías con los valores actuales del estado.
   */
  initActionFormBuild(): void {
    this.insumosForm = this.fb.group({
      cantidad: ['', Validators.required]
    });
    this.mercanciaForm = this.fb.group({
      fraccionArancelaria: [
        { value: this.datosSeleccionados?.fraccionArancelaria, disabled: true },
      ],
      fraccionNaladi: [
        { value: this.datosSeleccionados?.fraccionNaladi, disabled: true },
      ],
      fraccionNaladiSa93: [
        { value: this.datosSeleccionados?.fraccionNaladiSa93, disabled: true },
      ],
      fraccionNaladiSa96: [
        { value: this.datosSeleccionados?.fraccionNaladiSa96, disabled: true },
      ],
      fraccionNaladiSa02: [
        { value: this.datosSeleccionados?.fraccionNaladiSa02, disabled: true },
      ],
      nombreComercialMercancia: [
        { value: this.datosSeleccionados?.nombreComercial, disabled: true },
      ],
      nombreTecnico: [
        { value: this.datosSeleccionados?.nombreTecnico, disabled: true },
      ],
      normaOrigen: [
        { value: this.datosSeleccionados?.normaOrigen, disabled: true },
      ],
      nombreIngles: [
        { value: this.datosSeleccionados?.nombreIngles, disabled: true },
      ],
      otrasInstancias: [
        { value: this.datosSeleccionados?.otrasInstancias, disabled: true },
      ],
      criterioParaConferirOrigen: [
        {
          value: this.datosSeleccionados?.criterioParaConferirOrigen,
          disabled: true,
        },
      ],
      criterioParaTratoPreferencial: [
        {
          value: this.datosSeleccionados?.criterioParaTratoPreferencial,
          disabled: true,
        },
      ],
      criterioParaClasificacion: [
        this.datosSeleccionados?.criterioParaClasificacion ?? null,
      ],
      fechaDePago: [this.datosSeleccionados?.fechaDePago ?? null],
      valorDeContenidoRegional: [
        {
          value: this.datosSeleccionados?.valorDeContenidoRegional,
          disabled: true,
        },
      ],
      fechaFactura: [
        this.datosSeleccionados?.fechaFactura ?? null,
        REQUIRED_FECHA_FACTURA.includes(this.idProcedimiento)
          ? [Validators.required]
          : null,
      ],
      marca: [this.datosSeleccionados?.marca ?? null],
      cantidad: [
        this.datosSeleccionados?.cantidad,
        [
          ...(REQUIRED_CANTIDAD.includes(this.idProcedimiento)
            ? [Validators.required]
            : []),
          Validators.pattern(REGEX_PATRON_DECIMAL_15_4),
        ],
      ],
      umc: [
        this.datosSeleccionados?.umc ? this.datosSeleccionados?.umc : '',
        REQUIRED_UMC.includes(this.idProcedimiento)
          ? [Validators.required]
          : null,
      ],
      marcaBruta: [
        this.datosSeleccionados?.marcaBruta ? this.datosSeleccionados?.marcaBruta : '',
        MARCA_BRUTA_IDS.includes(this.idProcedimiento)
          ? [Validators.required]
          : [],
      ],
      umcMarcaBruta: [
        this.datosSeleccionados?.umcMarcaBruta ? this.datosSeleccionados?.umcMarcaBruta : '',
        UMC_MARCA_BRUTA_IDS.includes(this.idProcedimiento)
          ? [Validators.required]
          : null,
      ],
      valorMercancia: [
        this.datosSeleccionados?.valorMercancia,
        [
          ...(REQUIRED_VALOR_MERCANCIA.includes(this.idProcedimiento)
            ? [Validators.required]
            : []),
          Validators.pattern(REGEX_PATRON_DECIMAL_15_4),
        ],
      ],
      complementoDescripcion: [
        this.datosSeleccionados?.complementoDescripcion,
        [
          ...(REQUIRED_COMPLEMENTO_DESCRIPCION.includes(this.idProcedimiento)
            ? [Validators.required]
            : []),
          Validators.maxLength(200),
        ],
      ],
      numeroFactura: [
        this.datosSeleccionados?.numeroFactura,
        [
          ...(REQUIRED_NUMERO_FACTURA.includes(this.idProcedimiento)
            ? [Validators.required]
            : []),
          Validators.maxLength(36),
        ],
      ],
      numeroDeSerie: [''],
      tipoFactura: [this.datosSeleccionados?.tipoFactura ? this.datosSeleccionados?.tipoFactura : '',
      REQUIRED_TIPO_FACTURA.includes(this.idProcedimiento)
        ? [Validators.required]
        : null,
      ],
    });
  }

  /**
   * @descripcion
   * Cierra el modal y oculta la alerta.
   */
  cerrarModal(): void {
    this.mercanciaForm.reset();
    this.cerrarClicado.emit();
    this.mostrarAlerta = false;
    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * @descripcion
   * Activa la alerta en el modal.
   */
  activarModal(): void {
    this.acceptar(false);
  }
  /*
   * @descripcion
   * Marca todos los campos del formulario como tocados para mostrar los errores de validación.
   * @param formGroup - El grupo de formulario que contiene los controles a marcar.
   */
  markAllFieldsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        const CHILD = control as FormGroup;
        this.markAllFieldsAsTouched(CHILD);
      }
    });
  }

  /**
   * @descripcion
   * Maneja la aceptación de los datos del formulario de mercancía y la lógica de cierre/alerta del modal.
   *
   * - Si el formulario es inválido y no es un agregado, la función retorna sin hacer nada.
   * - Para el procedimiento 110204:
   *   - Si `agregar` es verdadero, oculta la alerta, limpia la notificación y cierra el modal.
   *   - Si `agregar` es falso, guarda los datos, emite los eventos correspondientes, resetea el formulario,
   *     muestra la alerta y configura la notificación, pero NO cierra el modal hasta que el usuario acepte la alerta.
   * - Para otros procedimientos:
   *   - Si `agregar` es verdadero, guarda los datos, emite los eventos, resetea el formulario, oculta la alerta,
   *     limpia la notificación y cierra el modal.
   *   - Si `agregar` es falso, simplemente muestra la alerta y configura la notificación, sin cerrar el modal.
   *
   * @param {boolean} agregar - Indica si la acción es de agregar (true) o de aceptar (false).
   * @returns {void}
   */
  acceptar(agregar: boolean): void {
    this.mercanciaForm.markAllAsTouched();
    this.mercanciaForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: false,
    });

    if (!this.mercanciaForm.valid && !agregar) {
      return;
    }

    if (this.idProcedimiento === 110204) {
      if (agregar) {
        this.mostrarAlerta = false;
        this.nuevaNotificacion = {} as Notificacion;
        this.cerrarClicado.emit();
      } else {
        this.guardarClicado.emit(this.mercanciaForm.value);
        const MERCANIADATO = this.mercanciaForm.getRawValue();
        const MERCANIAS = this.buildMercancia(MERCANIADATO);
        this.EMITMERCANIAS.emit(MERCANIAS);
        this.tablaSeleccionEvent.emit(true);
        this.mercanciaForm.reset();
        this.mostrarAlerta = true;
        this.abrirModal();
      }
    } else {
      if (agregar) {
        this.guardarClicado.emit(this.mercanciaForm.value);
        const MERCANIADATO = this.mercanciaForm.getRawValue();
        const MERCANIAS = this.buildMercancia(MERCANIADATO);
        this.EMITMERCANIAS.emit(MERCANIAS);
        this.tablaSeleccionEvent.emit(true);
        this.mercanciaForm.reset();
        this.mostrarAlerta = false;
        this.nuevaNotificacion = {} as Notificacion;
        this.cerrarClicado.emit();
      } else {
        this.mostrarAlerta = true;
        this.abrirModal();
      }
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
   * Construye un objeto de tipo `Mercancia` a partir de los datos proporcionados,
   * aplicando valores predeterminados cuando sea necesario.
   *
   * @private
   * @param {Mercancia} MERCANIADATO - Objeto que contiene los datos originales de la mercancía.
   * @returns {Mercancia} Objeto `Mercancia` completamente estructurado y con valores de respaldo.
   *
   * @description
   * Este método genera un nuevo objeto `Mercancia` tomando como base los valores recibidos en `MERCANIADATO`.
   * Si alguna propiedad del objeto es `undefined` o `null`, se asigna el valor por defecto `'--'`.
   *
   * Además:
   * - Si la propiedad `fromMercanciasDisponibles` está activa, el campo `id` se inicializa en `0`.
   * - En caso contrario, el `id` se obtiene desde `datosSeleccionados`.
   *
   * El resto de las propiedades se completan con los valores del objeto recibido o con el valor de respaldo.
   */
  private buildMercancia(MERCANIADATO: Mercancia): Mercancia {
    const FALLBACK = (value?: string): string => value ?? '';
    const FACTURA_ENCONTRADA = this.factura?.find(
      item => item.clave === MERCANIADATO.tipoFactura
    );
    const UMC_DESCRIPTION: string =
      this.umcMedida?.find(item => item.clave === MERCANIADATO.umc)?.descripcion ??
      this.optionsUMC?.find(item => item.clave === MERCANIADATO.umc)?.descripcion ??
      '';

    return {
      id: this.fromMercanciasDisponibles ? 0 : this.datosSeleccionados?.id,
      fraccionArancelaria: FALLBACK(MERCANIADATO.fraccionArancelaria),
      numeroDeRegistrodeProductos: FALLBACK(
        MERCANIADATO.numeroDeRegistrodeProductos
      ),
      fechaExpedicion: FALLBACK(MERCANIADATO.fechaExpedicion),
      fechaVencimiento: FALLBACK(MERCANIADATO.fechaVencimiento),
      nombreTecnico: FALLBACK(MERCANIADATO.nombreTecnico),
      nombreComercial: FALLBACK(MERCANIADATO.nombreComercial),
      normaOrigen: FALLBACK(MERCANIADATO.normaOrigen),
      cantidad: FALLBACK(MERCANIADATO.cantidad),
      umc: FALLBACK(MERCANIADATO.umc),
      tipoFactura: FALLBACK(MERCANIADATO.tipoFactura),
      valorMercancia: FALLBACK(MERCANIADATO.valorMercancia),
      fechaFinalInput: FALLBACK(MERCANIADATO.fechaFinalInput),
      numeroFactura: FALLBACK(MERCANIADATO.numeroFactura),
      marcaBruta: FALLBACK(MERCANIADATO.marcaBruta),
      unidadMedidaMasaBruta: FALLBACK(MERCANIADATO.umcMarcaBruta),
      criterioParaConferirOrigen: FALLBACK(MERCANIADATO.criterioParaConferirOrigen),
      valorDeContenidoRegional: FALLBACK(MERCANIADATO.valorDeContenidoRegional),
      numeroDeSerie: FALLBACK(MERCANIADATO.numeroDeSerie),
      complementoClasificacion: FALLBACK(MERCANIADATO.complementoClasificacion),
      complementoDescripcion: FALLBACK(MERCANIADATO.complementoDescripcion),
      criterioParaClasificacion: FALLBACK(
        MERCANIADATO.criterioParaClasificacion
      ),
      fechaDePago: FALLBACK(MERCANIADATO.fechaDePago),
      fraccionNaladi: MERCANIADATO.fraccionNaladi,
      fraccionNaladiSa93: MERCANIADATO.fraccionNaladiSa93,
      fraccionNaladiSa96: MERCANIADATO.fraccionNaladiSa96,
      fraccionNaladiSa02: MERCANIADATO.fraccionNaladiSa02,
      nalad: MERCANIADATO.nalad,
      fechaFactura: MERCANIADATO.fechaFactura,
      marca: FALLBACK(MERCANIADATO.marca),
      umcDescription: UMC_DESCRIPTION,
      tipoDeFacturaDescription: FACTURA_ENCONTRADA?.descripcion || ''
    };
  }

  /**
   * @descripcion
   * Obtiene el catálogo de tipos de factura y actualiza las opciones del campo de formulario correspondiente.
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'tipoFactura' en `factura` con las opciones obtenidas.
   */
  conseguirUMCDescripcion(clave: string): string {
    const UMC = this.optionsUMC.find((item) => item.clave === clave);
    return UMC ? UMC.descripcion : '';
  }

  /**
   * Abre un modal con una notificación configurada.
   *
   * @command abrirModal
   * @description Este método configura y muestra un modal con una notificación de alerta.
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: this.mensajeDeAlerta,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama cuando el componente se destruye.
   * Limpia los recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @summary Actualiza `fechaFactura` y sincroniza con el store.
   * @description Setea el valor, marca el control como tocado/modificado y persiste vía `setFechaFactura`.
   * @param {string} nuevo_valor Fecha seleccionada (p. ej., '2025-09-04').
   * @returns {void}
   */
  public cambioFechaFactura(nuevo_valor: string): void {
    this.mercanciaForm.patchValue({
      fechaFactura: nuevo_valor,
    });
  }

  /**
   * @summary Actualiza `fechaDePago` y sincroniza con el store.
   * @description Setea el valor, marca el control como tocado/modificado y persiste vía `setFechaDePago`.
   * @param {string} nuevo_valor Fecha seleccionada (p. ej., '2025-09-04').
   * @returns {void}
   */
  public cambioFechaDePago(nuevo_valor: string): void {
    this.mercanciaForm.patchValue({
      fechaDePago: nuevo_valor,
    });
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.mercanciaForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @descripcion
   * Actualiza el valor del control 'tipoFactura' en el formulario reactivo
   * 'mercanciaForm' cuando el usuario selecciona un tipo de factura del catálogo.
   *
   * @param evento Objeto del tipo Catalogo que contiene la opción seleccionada.
   */
  selectionTipoFactura(evento: Catalogo): void {
    this.mercanciaForm.patchValue({
      tipoFactura: evento.clave,
    });
  }

  /**
   * @descripcion
   * Actualiza el valor del control 'marcaBruta' en el formulario reactivo
   * 'mercanciaForm' cuando el usuario selecciona una marca bruta del catálogo.
   * 
   * @param evento Objeto del tipo Catalogo que contiene la opción seleccionada.
   */
  selectionUmcMarcaBruta(evento: Catalogo): void {
    this.mercanciaForm.patchValue({
      umcMarcaBruta: evento.clave,
    });
  }

  /**
   * @descripcion
   * Actualiza el valor del control 'umc' en el formulario reactivo
   * 'mercanciaForm' cuando el usuario selecciona una unidad de medida del catálogo.
   *
   * @param evento Objeto del tipo Catalogo que contiene la opción seleccionada.
   */
  selectionUMC(evento: Catalogo): void {
    this.mercanciaForm.patchValue({
      umc: evento.clave,
    });
  }

  /**
   * Obtiene la lista de Unidades de Medida de la Cantidad (UMC) desde el servicio `catalogoServices`
   * y actualiza las opciones del campo de formulario correspondiente con los datos recibidos.
   *  Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'umc' en `optionsUMC` con las opciones obtenidas.
   */
  getUmc(): void {
    const TRAMITES_ID = this.idProcedimiento.toString();
    this.catalogoServices
      .unidadMasaBrutaCatalogo(TRAMITES_ID)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.umcMedida = res.datos ?? [];
      });
  }

  /**
   * @description
   * Obtiene el catálogo de unidades de medida comercial a partir del identificador del trámite actual.
   * Llama al servicio de catálogos y actualiza la lista `umcMedida` con los datos recibidos.
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   *
   * @returns {void}
   */
  getUnidadesMedidaComercial(): void {
    const TRAMITES_ID = this.idProcedimiento.toString();
    this.catalogoServices
      .unidadesMedidaComercialCatalogo(TRAMITES_ID)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.optionsUMC = res.datos ?? [];
      });
  }

  /**
   * @description
   * Obtiene el catálogo de tipos de factura a partir del identificador del trámite actual.
   * Llama al servicio de catálogos y actualiza la lista `factura` con los datos recibidos.
   * La suscripción se controla mediante `takeUntil` para liberar recursos correctamente.
   *
   * @returns {void}
   */
  getTipoFactura(): void {
    const TRAMITES_ID = this.idProcedimiento.toString();
    this.catalogoServices
      .tipoFacturaCatalogo(TRAMITES_ID)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.factura = res.datos ?? [];
      });
  }

  /**
   * @description
   * Obtiene el catálogo de Unidades de Medida de Masa Bruta (UUMC) para la marca bruta
   **/
  getUumcMarcaBruta(): void {
    const TRAMITES_ID = this.idProcedimiento.toString();
    this.catalogoServices
      .unidadMasaBrutaCatalogo(TRAMITES_ID)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.umcMarcaBrutaCatalogo = res.datos ?? [];
      });
  }

  /**
   *  @description
   * Valida y formatea el valor de un campo de entrada para asegurarse de que es un número decimal válido.
   * Si el valor es un número válido, se formatea a cuatro decimales y se actualiza el formulario reactivo.
   * Si el valor no es válido, se limpia el campo de entrada.
   * @param evento 
   */
  validarCantidadDecimal(evento: Event): void {
    const INPUT_ELEMENT = evento.target as HTMLInputElement;
    if (!isNaN(Number(INPUT_ELEMENT.value)) && INPUT_ELEMENT.value.trim() !== '') {
      const NUMERO_FORMATEADO = parseFloat(INPUT_ELEMENT.value).toFixed(4);
      INPUT_ELEMENT.value = NUMERO_FORMATEADO;
    } else {
      INPUT_ELEMENT.value = '';
    }
  }

  /**
   * @description
   * Valida y formatea el valor de un campo de entrada para mercancía, asegurándose de que es un número decimal válido.
   * Si el valor es un número válido, se formatea a cuatro decimales y se actualiza el campo de entrada.
   * Si el valor no es válido, se limpia el campo de entrada.
   * @param evento Evento que contiene el valor del campo de entrada a validar.
   */
  validarMercanciaDecimal(evento: Event): void {
    const INPUT_ELEMENT = evento.target as HTMLInputElement;
    if (!isNaN(Number(INPUT_ELEMENT.value)) && INPUT_ELEMENT.value.trim() !== '') {
      const NUMERO_FORMATEADO = parseFloat(INPUT_ELEMENT.value).toFixed(4);
      INPUT_ELEMENT.value = NUMERO_FORMATEADO;
    } else {
      INPUT_ELEMENT.value = '';
    }
  }

  insumosModal(evento: InsumosDisponibles): void {
    this.insumosDisponiblesSeleccionado = evento;
    this.insumosForm.patchValue({
      cantidad: evento.cantidad
    });
    this.modalInstance = new Modal(this.modifyModal?.nativeElement);
    this.modalInstance?.show();
  }

  agregarInsumos(): void {
    if (this.insumosForm.invalid) {
      this.insumosForm.markAllAsTouched();
      return;
    }
    const CANTIDAD_INSUMO = this.insumosForm.get('cantidad')?.value;
    this.tableInsumosData = this.tableInsumosData.map((insumo) => {
      if (insumo.id === this.insumosDisponiblesSeleccionado.id) {
        return {
          ...insumo,
          cantidad: CANTIDAD_INSUMO
        };
      }
      return insumo;
    });
    this.modalInstance?.hide();
  }

  cancelarModal(): void {
    this.modalInstance.hide();
  }
}
