import {
  CaracteristicasResiduos,
  DatosResiduos,
  ResiduoPeligroso,
} from '../../../231002/models/aviso-catalogo.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_DECIMAL,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  HABILITAR_CONTROL,
  MAX_DIGIT_VALIDATOR,
  NO_COMA_VALIDATOR,
} from '../../../../shared/helpers';
import {
  MATERIA_RESIDUO_TABLA,
  MateriaResiduo,
} from '../../../231002/models/materia-residuo.model';
import {
  RadioOpcion,
  SolicitudJson,
} from '@libs/shared/data-access-user/src/core/models/231003/solicitud.model';
import { LoginQuery } from '@ng-mf/data-access-user'
import { Subject, takeUntil } from 'rxjs';
import { CatalogoT231003Service } from '../../service/catalogo-t231003.service';
import { CommonModule } from '@angular/common';
import { ConvertNumberAmountToStringAmount } from '@libs/shared/data-access-user/src/core/utils/convertNumberAmountToStringAmount';
import { EstadoFormularioResiduo } from '../../models/datos-residuos.model';
import { FormularioResiduoQuery } from '../../estados/queries/datos-residuos.query';
import { FormularioResiduoStore } from '../../estados/tramites/datos-residuos.store';

import { Modal } from 'bootstrap';
import rawData from '@libs/shared/theme/assets/json/231003/solicitud.json';

/**
 * Constante que contiene las opciones de radio y demás datos del archivo JSON.
 * Se hace un cast del JSON importado al tipo `SolicitudJson`.
 */
const RADIO_OPCIONES = rawData as SolicitudJson;

/**
 * Componente encargado de manejar la sección de datos de residuos peligrosos.
 * Es un componente standalone que importa módulos y componentes necesarios para su funcionamiento.
 */

@Component({
  selector: 'app-datos-residuos-peligrosos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './datos-residuos-peligrosos.component.html',
  styleUrl: './datos-residuos-peligrosos.component.scss',
})
export class DatosResiduosPeligrososComponent implements OnInit, OnDestroy {




  /** Enum de tipos de selección de tabla para uso en template */
  TablaSeleccion = TablaSeleccion;

  /** Mensaje para formulario incompleti */
  FALTAN_DATOS = 'Faltan datos por capturar.';

  /**
   * Mensaje para materia prima faltante
   */
  MATERIA_FALTANTE = 'Debe agregar al menos una materia prima relacionada';

  /** Subject para gestionar la destrucción de suscripciones */
  private destroyed$ = new Subject<void>();

  /**
   * Catálogo de materias primas obtenido del servicio.
   */
  materiasPrimasCatalogo: Catalogo[] = [];

  /** Event emitter para enviar datos del residuo al componente padre */
  @Output() residuoAgregado = new EventEmitter<ResiduoPeligroso>();

  /** Formulario para los datos generales del residuo. */
  formularioDatos!: FormGroup;

  /** Formulario para los detalles del residuo peligroso. */
  formularioResiduo!: FormGroup;

  /** Opciones para el campo de selección de residuos peligrosos. */
  radioOptions: RadioOpcion[] = RADIO_OPCIONES?.radioOptions;

  /** Opciones de clasificación del residuo. */
  clasificacionRadioOptions: RadioOpcion[] =
    RADIO_OPCIONES?.clasificacionRadioOptions;

  /** Estructura de datos completa de etiquetas y opciones del JSON. */
  etiquetasForm = RADIO_OPCIONES;

  /** Control para mostrar/ocultar mensaje de error */
  esFormaValido = true;

  /** Mensaje de error a mostrar */
  alertaErrorFormulario = '';

  /** Objeto de notificación para mostrar popup */
  public nuevaNotificacion: Notificacion = {} as Notificacion;

  /** Lista de materias primas para la tabla */
  materiasPrimas: MateriaResiduo[] = [];

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

  /** Estado del botón borrar */
  borrarHabilitado = false;

  /**
   * Catálogo de fracciones arancelarias para el dropdown
   */
  fraccionesArancelariasCatalogo: Catalogo[] = [];

  /** Catálogo de NICO para el dropdown */
  nicosCatalogo: Catalogo[] = [];

  /** Catálogo de CRETI para el dropdown */
  cretiCatalogo: Catalogo[] = [];

  /** Catálogo de estado físico para el dropdown */
  estadoFisicoCatalogo: Catalogo[] = [];

  /** Catálogo de tipos de contenedor para el dropdown */
  tipoContenedorCatalogo: Catalogo[] = [];

  /** Catálogo de unidades de medida para el dropdown */
  unidadMedidaCatalogo: Catalogo[] = [];

  /** Catálogo de clave de residuo para el dropdown */
  cveResiducoCatalogo: Catalogo[] = [];

  /** Catalogo de nombre de residuo para el dropdown */
  nombreResiducoCatalogo: Catalogo[] = [];

  /** Catalogo de descripcion de residuo para el dropdown */
  descResiducoCatalogo: Catalogo[] = [];
  /**
   * Instancia del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  modalInstances: Modal | null = null;

  /** Estado de envío del formulario */
  submitted = false;

  /**
   * NICO seleccionado actualmente en el formulario.
   */
  nicoSeleccionado!: Catalogo | null;

  /** Getter para verificar si el botón Agregar debe estar habilitado */
  get agregarHabilitado(): boolean {
    const CANTIDAD = this.formularioDatos.get('cantidad')?.value;
    const CANTIDAD_LETRA = this.formularioDatos.get('cantidadLetra')?.value;
    const UNIDAD_MEDIDA = this.formularioDatos.get('unidadDeMedida')?.value;
    const FRACCION_ARANCELARIA = this.formularioDatos.get(
      'fraccionArancelaria'
    )?.value;

    return Boolean(
      CANTIDAD && CANTIDAD_LETRA && UNIDAD_MEDIDA && FRACCION_ARANCELARIA
    );
  }

  /** Getters para verificar el estado disabled de los dropdowns de clasificación */
  get claveResiduoDisabled(): boolean {
    return this.formularioResiduo?.get('claveResiduo')?.disabled ?? true;
  }

  /**
   * Getter para verificar si el campo 'nombre' del formulario de residuo está deshabilitado.
   */
  get nombreDisabled(): boolean {
    return this.formularioResiduo?.get('nombre')?.disabled ?? true;
  }

  /**
   * Getter para verificar si el campo 'descripcion' del formulario de residuo está deshabilitado.
   */
  get descripcionDisabled(): boolean {
    return this.formularioResiduo?.get('descripcion')?.disabled ?? true;
  }

  /** Getters para obtener los valores actuales de los dropdowns (para mostrar en disabled state) */
  get claveResiduoValue(): string {
    return this.formularioResiduo?.getRawValue()?.claveResiduo || '';
  }

  /**
   * Getter para verificar si el campo 'nombreValue' del formulario de residuo está deshabilitado.
   */
  get nombreValue(): string {
    return this.formularioResiduo?.getRawValue()?.nombre || '';
  }

  /**
   * Getter para verificar si el campo 'descripcionValue' del formulario de residuo está deshabilitado.
   */
  get descripcionValue(): string {
    return this.formularioResiduo?.getRawValue()?.descripcion || '';
  }

  /** Configuración de columnas para la tabla dinámica */
  configuracionTablaMaterias: ConfiguracionColumna<MateriaResiduo>[] =
    MATERIA_RESIDUO_TABLA;

  /** Datos para la tabla dinámica */
  materiasPrimasTabla: MateriaResiduo[] = [];

  /** Control para mostrar el combo de "Otro" en tipo de contenedor */
  mostrarComboOtroTipo: boolean = false;

  /** Control para mostrar el combo de "Otro" en estado físico */
  mostrarOtroEdoFisico: boolean = false;

  /** Control para mostrar el combo de "Otro" en tipo de contenedor */
  mostrarOtroTipoContenedor: boolean = false;

  /** Determina si el campo cantidad esta fijado */
  esCantidadFijada: boolean = false;

  /** RFC del usuario logueado */
  rfcLogueado: string = '';

  /**
   * Constructor del componente.
   *
   * @param fb - Servicio para construir formularios reactivos.
   * @param formularioStore - Store Akita que gestiona el estado del formulario.
   * @param formularioQuery - Query Akita para consultar el estado del formulario.
   * @param cdr - Change Detector Reference para forzar detección de cambios.
   */
  constructor(
    public fb: FormBuilder,
    private formularioStore: FormularioResiduoStore,
    private formularioQuery: FormularioResiduoQuery,
    private cdr: ChangeDetectorRef,
    private catalogosService: CatalogoT231003Service,
    private loginQuery: LoginQuery
  ) { }

  /**
   * Inicializa el componente cargando formularios y recuperando datos del store.
   */
  ngOnInit(): void {
    this.obtenerDatosRfc();
    this.inicializarFormulario();
    this.crearFormularioResiduo();
    this.recuperarValoresDesdeStore();
    this.obtenerFraccionesArancelarias();
    this.obtenerCRETI();
    this.obtenerEdoFisico();
    this.obtenerTipoContenedor();
    this.obtenerUnidadMedida();
    this.obtenerCveResiduo();
    this.obtenerNombreResiduo();
    this.obtenerDescResiduo();

    // Inicialmente dropdowns vacíos hasta que se haga búsqueda/selección
    this.etiquetasForm.nombre = [];
    this.etiquetasForm.nico = [];

    // Asegurar que los dropdowns de clasificación estén deshabilitados al inicializar
    this.formularioResiduo.get('claveResiduo')?.disable();
    this.formularioResiduo.get('nombre')?.disable();
    this.formularioResiduo.get('descripcion')?.disable();

    // Verificar estado después de la inicialización
    setTimeout(() => {
      this.verificarEstadoDropdowns();
    }, 100);
  }


  /**
    * Obtiene los datos IMMEX del solicitante.
    */
  obtenerDatosRfc(): void {
    this.loginQuery.selectRfc$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.rfcLogueado = res;
      });
  }

  /**
   * Inicializa el formulario de datos generales de la materia prima.
   */
  private inicializarFormulario(): void {
    this.formularioDatos = this.fb.group({
      origenResiduo: ['', Validators.required],
      idMercancia: [''],
      numero: ['', Validators.required],
      nombreMateriaPrima: ['', Validators.required],
      descripcionMateriaPrima: [''],
      cantidad: [{ value: '', disabled: true }],
      cantidadLetra: [{ value: '', disabled: true }],
      unidadDeMedida: [{ value: '', disabled: true }],
      fraccionArancelaria: [{ value: '', disabled: true }],
    });
  }

  /**
   * Crea el formulario de captura para datos del residuo peligroso.
   */
  private crearFormularioResiduo(): void {
    this.formularioResiduo = this.fb.group({
      fraccionArancelaria: ['', Validators.required],
      nico: ['', Validators.required],
      acotacion: [{ value: '', disabled: true }, Validators.required],
      residuoPeligroso: ['', Validators.required],
      cantidad: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX_DECIMAL),
          NO_COMA_VALIDATOR,
          MAX_DIGIT_VALIDATOR,
        ],
      ],
      cantidadLetra: [{ value: '', disabled: true }],
      unidadMedida: ['', Validators.required],
      clasificacion: ['', Validators.required],
      claveResiduo: [{ value: '', disabled: true }, Validators.required],
      nombre: [{ value: '', disabled: true }, Validators.required],
      descripcion: [{ value: '', disabled: true }, Validators.required],
      creti: ['', Validators.required],
      estadoFisico: ['', Validators.required],
      otroTipo: [''],
      otroEdoFisico: [''],
      otroContenedor: [''],
      tipoContenedor: ['', Validators.required],
      capacidad: ['', Validators.required],
    });
  }

  /**
   * Restaura los valores de los formularios a partir del estado en el store.
   */
  private recuperarValoresDesdeStore(): void {
    const ESTADO = this.formularioQuery.getValue();

    // Guardar el estado actual de disabled de los controles importantes
    const CLAVE_RESIDUO_DISABLED =
      this.formularioResiduo.get('claveResiduo')?.disabled;
    const NOMBRE_DISABLED = this.formularioResiduo.get('nombre')?.disabled;
    const DESCRIPCION_DISABLED =
      this.formularioResiduo.get('descripcion')?.disabled;

    this.formularioDatos.patchValue(ESTADO.formularioDatos, {
      emitEvent: false,
    });
    this.formularioResiduo.patchValue(ESTADO.formularioResiduo, {
      emitEvent: false,
    });

    // Restaurar el estado disabled después del patch si estaban deshabilitados
    if (CLAVE_RESIDUO_DISABLED) {
      this.formularioResiduo.get('claveResiduo')?.disable();
    }
    if (NOMBRE_DISABLED) {
      this.formularioResiduo.get('nombre')?.disable();
    }
    if (DESCRIPCION_DISABLED) {
      this.formularioResiduo.get('descripcion')?.disable();
    }

    // Asegurar que los dropdowns de clasificación permanezcan deshabilitados por defecto
    this.formularioResiduo.get('claveResiduo')?.disable();
    this.formularioResiduo.get('nombre')?.disable();
    this.formularioResiduo.get('descripcion')?.disable();
  }

  /**
   * Actualiza un campo del formulario de datos generales en el store.
   *
   * @param field - Campo del formulario a actualizar.
   */
  actualizarCampoFormularioDatos(
    field: keyof EstadoFormularioResiduo['formularioDatos']
  ): void {
    const VALOR = this.formularioDatos.get(field)?.value;
    this.formularioStore.actualizarFormularioDatos({
      ...this.formularioDatos.getRawValue(),
      [field]: VALOR,
    });
  }

  /**
   * Actualiza un campo del formulario de residuos peligrosos en el store.
   *
   * @param field - Campo del formulario a actualizar.
   */
  actualizarCampoFormularioResiduo(
    field: keyof EstadoFormularioResiduo['formularioResiduo']
  ): void {
    const VALOR = this.formularioResiduo.get(field)?.value;
    this.formularioStore.actualizarFormularioResiduo({
      ...this.formularioResiduo.getRawValue(),
      [field]: VALOR,
    });
  }

  /**
   * Busca materias primas por número de bitácora
   */
  buscarMateriaPrima(): void {
    const NUMERO = this.formularioDatos.get('numero')?.value;
    // Marcar el campo como touched para mostrar validaciones
    this.formularioDatos.get('numero')?.markAsTouched();

    if (NUMERO || this.formularioDatos.get('numero')?.valid) {
      // Verificar si ya existe una materia prima con el mismo número de bitácora en la tabla
      const MATERIA_EXISTENTE = this.materiasPrimasTabla.find(
        (materia) => materia.numeroBitacora === NUMERO
      );

      if (MATERIA_EXISTENTE) {
        return;
      }
      this.obtenerMateriasPrimasPorNoBitacora(NUMERO, this.rfcLogueado);
    }
  }

  /**
   * Maneja el cambio en el dropdown de nombre de materia prima
   */
  onNombreMateriaPrimaChange(): void {
    const NUMERO = this.formularioDatos.get('nombreMateriaPrima')?.value;
    this.obtenerMateriaPrimaPorId(NUMERO);
  }

  agregarMateriaPrima(): void {
    const NUEVA_MATERIA: MateriaResiduo = {
      id_mercancia: this.formularioDatos.get('idMercancia')?.value,
      descripcion_mercancia: this.formularioDatos.get('descripcionMateriaPrima')
        ?.value,
      cantidad: this.formularioDatos.get('cantidad')?.value,
      cantidad_letra: this.formularioDatos.get('cantidadLetra')?.value,
      descripcion_umc: this.formularioDatos.get('unidadDeMedida')?.value,
      cve_fraccion_arancelaria:
        this.formularioDatos.get('fraccionArancelaria')?.value || '',
      numeroBitacora: this.formularioDatos.get('numero')?.value,
      unidadMedidaComercial: this.formularioDatos.get('unidadDeMedida')?.value,
      descFraccion: this.formularioDatos.get('fraccionArancelaria')?.value,
    };

    this.materiasPrimas.push(NUEVA_MATERIA);
    // Actualizar los datos de la tabla dinámica
    this.materiasPrimasTabla = [...this.materiasPrimas];
    // Limpiar el formulario
    this.limpiarFormularioMateriasPrimas();
    this.materiasPrimasCatalogo = this.materiasPrimasCatalogo.filter(
      (m) => m.clave !== NUEVA_MATERIA.id_mercancia.toString()
    );
  }

  /**
   * Limpia el formulario de materias primas.
   */
  limpiarFormularioMateriasPrimas(): void {
    [
      'nombreMateriaPrima',
      'cantidad',
      'cantidadLetra',
      'unidadDeMedida',
      'fraccionArancelaria',
    ].forEach((field) => {
      this.formularioDatos.get(field)?.reset();
    });
  }

  /**
   * Maneja el cambio en el dropdown de Fracción Arancelaria
   */
  onFraccionArancelariaChange(): void {
    const FRACCION_SELECCIONADA = this.formularioResiduo.get(
      'fraccionArancelaria'
    )?.value;
    this.resetNico();
    this.resetAcotacion();
    if (FRACCION_SELECCIONADA) {
      this.obtenerNicoPorFraccion(FRACCION_SELECCIONADA);
    }
  }

  /**
   * Maneja el cambio en el dropdown de NICO
   */
  onNicoChange(): void {
    const FRACCION_SELECCIONADA = this.formularioResiduo.get(
      'fraccionArancelaria'
    )?.value;
    const NICO_SELECCIONADO = this.formularioResiduo.get('nico')?.value;
    this.nicoSeleccionado =
      this.nicosCatalogo.find((nico) => nico.clave === NICO_SELECCIONADO) ??
      null;

    if (FRACCION_SELECCIONADA && NICO_SELECCIONADO) {
      this.catalogosService
        .obtenerDescNico(NICO_SELECCIONADO, FRACCION_SELECCIONADA)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((nicosData) => {
          if (!nicosData.datos) {
            this.mostrarNotificacionFraccionInvalida();
          } else {
            this.formularioResiduo.get('acotacion')?.setValue(nicosData.datos);
          }
        });
    }
  }

  /**
   * Resetea el campo de NICO y limpia su catálogo asociado.
   */
  resetNico(): void {
    const NICO_CONTROL = this.formularioResiduo.get('nico');
    NICO_CONTROL?.reset(null);
    this.nicosCatalogo = [];
  }

  /**
   * Resetea el campo de acotación.
   */
  resetAcotacion(): void {
    const ACOTACION_CONTROL = this.formularioResiduo.get('acotacion');
    ACOTACION_CONTROL?.reset(null);
  }

  /**
   * Maneja el cambio en el campo cantidad para auto-llenar cantidad en letra
   */
  onCantidadChange(): void {
    this.esCantidadFijada = false;
    const CANTIDAD_VALUE = this.formularioResiduo.get('cantidad')?.value;
    if (CANTIDAD_VALUE && !isNaN(parseFloat(CANTIDAD_VALUE))) {
      const NUMERO = parseFloat(CANTIDAD_VALUE);
      const CANTIDAD_LETRA =
        ConvertNumberAmountToStringAmount.convierteNumerosALetra(NUMERO);

      // Auto-llenar el campo cantidad letra
      this.formularioResiduo.get('cantidadLetra')?.setValue(CANTIDAD_LETRA);
    } else {
      // Limpiar si no hay valor válido
      this.formularioResiduo.get('cantidadLetra')?.setValue('');
    }
  }

  /**
   * Maneja el cambio en el radio button de clasificación
   */
  onClasificacionChange(): void {
    const CLASIFICACION_SELECCIONADA =
      this.formularioResiduo.get('clasificacion')?.value;
    if (CLASIFICACION_SELECCIONADA) {
      this.manejarCambioClasificacion(CLASIFICACION_SELECCIONADA);
    } else {
      // Si no hay selección, deshabilitar todos
      this.formularioResiduo.get('claveResiduo')?.disable();
      this.formularioResiduo.get('nombre')?.disable();
      this.formularioResiduo.get('descripcion')?.disable();
    }
  }

  /**
   * Método para verificar y forzar el estado de los dropdowns (para debugging)
   */
  verificarEstadoDropdowns(): void {
    const CLASIFICACION_VALUE =
      this.formularioResiduo.get('clasificacion')?.value;

    // Forzar deshabilitación si no hay clasificación seleccionada
    if (!CLASIFICACION_VALUE) {
      this.formularioResiduo.get('claveResiduo')?.disable();
      this.formularioResiduo.get('nombre')?.disable();
      this.formularioResiduo.get('descripcion')?.disable();
    }
  }

  /**
   * Maneja la lógica de habilitar/deshabilitar dropdowns según la clasificación seleccionada
   */
  private manejarCambioClasificacion(clasificacionSeleccionada: string): void {
    // Guardar los valores actuales antes de hacer cambios
    const CLAVE_ACTUAL = this.formularioResiduo.get('claveResiduo')?.value;
    const NOMBRE_ACTUAL = this.formularioResiduo.get('nombre')?.value;
    const DESCRIPCION_ACTUAL = this.formularioResiduo.get('descripcion')?.value;

    // Deshabilitar todos los dropdowns primero (manteniendo sus valores)
    this.formularioResiduo.get('claveResiduo')?.disable();
    this.formularioResiduo.get('nombre')?.disable();
    this.formularioResiduo.get('descripcion')?.disable();

    // Restaurar los valores después de deshabilitar (algunos componentes los pierden)
    if (CLAVE_ACTUAL) {
      this.formularioResiduo.get('claveResiduo')?.setValue(CLAVE_ACTUAL);
    }
    if (NOMBRE_ACTUAL) {
      this.formularioResiduo.get('nombre')?.setValue(NOMBRE_ACTUAL);
    }
    if (DESCRIPCION_ACTUAL) {
      this.formularioResiduo.get('descripcion')?.setValue(DESCRIPCION_ACTUAL);
    }

    // Habilitar el dropdown correspondiente según la selección
    if (clasificacionSeleccionada === 'Clave de residuo') {
      this.formularioResiduo.get('claveResiduo')?.enable();
    } else if (clasificacionSeleccionada === 'Nombre') {
      this.formularioResiduo.get('nombre')?.enable();
    } else if (clasificacionSeleccionada === 'Descripción') {
      this.formularioResiduo.get('descripcion')?.enable();
    }

    // Forzar detección de cambios para actualizar la UI
    this.cdr.detectChanges();

    // Actualizar el store después de los cambios
    this.formularioStore.actualizarFormularioResiduo(
      this.formularioResiduo.getRawValue()
    );
  }

  /**
   * Muestra una notificación de error cuando se intenta agregar un residuo duplicado.
   */
  mostrarNotificacionDuplicado(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: '',
      mensaje:
        'Los datos proporcionados ya han sido agregados, por favor agregue datos diferentes',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Borra los elementos seleccionados de la tabla
   */
  borrarFilasSeleccionadas(): void {
    if (this.itemsSeleccionados.size === 0) {
      return;
    }
    // Convertir a array y ordenar de mayor a menor para eliminar correctamente
    const INDICES_A_ELIMINAR = Array.from(this.itemsSeleccionados).sort(
      (a, b) => b - a
    );

    INDICES_A_ELIMINAR.forEach((index) => {
      this.materiasPrimas.splice(index, 1);
    });
    // Limpiar selecciones
    this.itemsSeleccionados.clear();
    // Forzar actualización de la tabla
    this.materiasPrimasTabla = [...this.materiasPrimas];
  }

  /**
   * Maneja la selección de filas desde la tabla dinámica (checkbox selection)
   */
  onFilasSeleccionadas(filasSeleccionadas: MateriaResiduo[]): void {
    // Limpiar selecciones previas
    this.itemsSeleccionados.clear();
    // Agregar nuevas selecciones
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.materiasPrimas.findIndex(
        (m) => m.id_mercancia === materia.id_mercancia
      );
      if (INDEX !== -1) {
        this.itemsSeleccionados.add(INDEX);
      }
    });
    // Actualizar estado del botón borrar
    this.borrarHabilitado = this.itemsSeleccionados.size > 0;
  }

  /**
   * Agrega un residuo peligroso y emite el evento al componente padre
   */
  agregarResiduoPeligroso(): void {
    this.submitted = true;
    if (!this.validarForms()) {
      return;
    }

    // Crear el objeto con todos los datos del residuo según la interface ResiduoPeligroso
    const RESIDUO_DATA: ResiduoPeligroso = {
      ...this.getDatisResiduos(),
      ...this.getCaracteristicasResiduos(),
      origenResiduoGeneracion: 'Producción Industrial',
      nombreResiduo:
        this.formularioResiduo.get('residuoPeligroso')?.value || '',
      acotacion: this.formularioResiduo.get('acotacion')?.value || '',
      cantidad: this.formularioResiduo.get('cantidad')?.value || '',
      cantidadLetra: this.formularioResiduo.get('cantidadLetra')?.value || '',
      numeroManifiesto: this.formularioResiduo.get('manifiesto')?.value || '',
      capacidad: this.formularioResiduo.get('capacidad')?.value || '',
      tipoContenedorDesc: this.getTipoContenedor(),
      materiasPrimasRelacionadas: this.materiasPrimas,
    };
    // Emitir el evento con los datos
    this.residuoAgregado.emit(RESIDUO_DATA);

    this.resetFormularios();

    // Cerrar el modal usando Bootstrap's modal API
    DatosResiduosPeligrososComponent.cerrarModal();
  }

  /**
   * Valida el formulario de residuos peligrosos.
   * @returns Verdadero si el formulario es válido, falso en caso contrario.
   */
  validarForms(): boolean {
    const TIPO_CONTROL = this.formularioDatos.get('origenResiduo');
    const FORMS_DATOS_VALID =
      this.validarMateriasPrimas() && TIPO_CONTROL?.valid;
    if (!FORMS_DATOS_VALID) {
      this.esFormaValido = false;
      this.formularioDatos.get('origenResiduo')?.markAsTouched();
    }
    const FORMULARIO_RESIDUO_VALID = this.formularioResiduo.valid;
    if (!FORMULARIO_RESIDUO_VALID) {
      Object.keys(this.formularioResiduo.controls).forEach((key) => {
        const CONTROL = this.formularioResiduo.get(key);
        if (CONTROL) {
          CONTROL.markAsTouched();
        }
      });
    }
    DatosResiduosPeligrososComponent.scrollModalToTop();
    return (FORMS_DATOS_VALID && FORMULARIO_RESIDUO_VALID) ?? false;
  }

  /**
   * Limpia la pantalla del modal
   */
  resetFormularios(): void {
    // Limpiar formularios y datos relacionados
    this.formularioResiduo.reset();
    this.formularioDatos.reset();
    this.materiasPrimas = [];
    this.materiasPrimasTabla = [];
    this.itemsSeleccionados.clear();
    this.borrarHabilitado = false;
    this.submitted = false;
    // Limpiar mensaje de error si existe
    this.esFormaValido = true;
    this.alertaErrorFormulario = '';
  }

  /**
   * Valida las materias primas relacionadas.
   * @returns Verdadero si hay materias primas válidas, falso en caso contrario.
   */
  validarMateriasPrimas(): boolean {
    if (this.materiasPrimas.length === 0) {
      // Mostrar mensaje de error si no hay materias primas
      this.esFormaValido = false;
      return false;
    }
    this.esFormaValido = true;
    return true;
  }

  /**
   * Cierra el modal de forma segura
   */
  private static cerrarModal(): void {
    const MODAL_ELEMENT = document.getElementById(
      'modalDatosResiduosPeligrosos'
    );
    if (MODAL_ELEMENT) {
      const MODAL = Modal.getInstance(MODAL_ELEMENT);
      if (MODAL) {
        MODAL.hide();
      } else {
        // Si no hay instancia, crear una nueva y cerrarla
        const NEW_MODAL = new Modal(MODAL_ELEMENT);
        NEW_MODAL.hide();
      }
    } else {
      // Alternativa: usar el dismiss modal de Bootstrap directamente
      const CLOSE_BUTTON = document.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;
      if (CLOSE_BUTTON) {
        CLOSE_BUTTON.click();
      }
    }
  }

  /**
   * Obtiene el nombre/descripcion de la fracción arancelaria seleccionada.
   * Busca en `fraccionArancelariaData` por el id almacenado en el control 'fraccionArancelaria'.
   * @returns Nombre o descripción de la fracción; cadena vacía si no se encuentra.
   */
  private getFraccionName = (): string => {
    const FRACCION_ID = this.formularioResiduo.get(
      'fraccionArancelaria'
    )?.value;
    const FRACCION_DATA = this.fraccionesArancelariasCatalogo.find(
      (f) => f.clave === FRACCION_ID
    );
    return FRACCION_DATA ? FRACCION_DATA.descripcion : '';
  };

  /**
   * Obtiene el nombre/descripcion del NICO seleccionado.
   * Nota: el método intenta obtener la fracción asociada y devolver una descripción relacionada.
   * @returns Descripción del NICO o cadena vacía si no se encuentra.
   */
  private getNicoName = (): string => {
    const NICO_ID = this.formularioResiduo.get('nico')?.value;
    const FRACCION_DATA = this.nicosCatalogo.find((f) => f.clave === NICO_ID);
    return FRACCION_DATA ? FRACCION_DATA.descripcion : '';
  };

  /**
   * Devuelve la descripción de la unidad de medida seleccionada según las etiquetas cargadas.
   * @returns Descripción de la unidad de medida o cadena vacía si no se encuentra.
   */
  private getUnidadMedidaName = (): string => {
    const UNIDAD_CLAVE = this.formularioResiduo.get('unidadMedida')?.value;
    const UNIDAD_DATA = this.unidadMedidaCatalogo.find(
      (u) => u.clave === UNIDAD_CLAVE
    );
    return UNIDAD_DATA ? UNIDAD_DATA.descripcion : '';
  };

  /**
   * Obtiene la descripción correspondiente a la clave de clasificación seleccionada.
   * Busca en `etiquetasForm.residuo`.
   * @returns Descripción de la clave de clasificación o cadena vacía si no se encuentra.
   */
  private getClaveClasificacion = (): string => {
    const CLAVE = this.formularioResiduo.get('claveResiduo')?.value;
    const CLAVE_CLASIFICACION_DESC = this.cveResiducoCatalogo?.find(
      (c) => c.clave === CLAVE
    )?.descripcion;
    return CLAVE_CLASIFICACION_DESC || '';
  };

  /**
   * Obtiene el nombre asociado a la clasificación por nombre (si aplica).
   * Busca en `etiquetasForm.tipoNombre`.
   * @returns Nombre de la clasificación o cadena vacía si no se encuentra.
   */
  private getNameClasificacion = (): string => {
    const NOMBRE = this.formularioResiduo.get('nombre')?.value;
    const CLAVE_CLASIFICACION_NAME = this.nombreResiducoCatalogo.find(
      (c) => c.clave === NOMBRE
    )?.descripcion;
    return CLAVE_CLASIFICACION_NAME || '';
  };

  /**
   * Obtiene la descripción de la clasificación por descripción (si aplica).
   * Busca en `etiquetasForm.descripcion`.
   * @returns Descripción de la clasificación o cadena vacía si no se encuentra.
   */
  private getDescClasificacion = (): string => {
    const DESC = this.formularioResiduo.get('descripcion')?.value;
    const CLAVE_CLASIFICACION_DESC = this.descResiducoCatalogo?.find(
      (c) => c.clave === DESC
    )?.descripcion;
    return CLAVE_CLASIFICACION_DESC || '';
  };

  /**
   * Obtiene la descripción legible del CRETI seleccionado.
   * Busca en `etiquetasForm.creti`.
   * @returns Descripción del CRETI o cadena vacía si no se encuentra.
   */
  private getCreti = (): string => {
    const CRETI = this.formularioResiduo.get('creti')?.value;
    const CRETI_DESC = this.cretiCatalogo.find(
      (c) => c.clave === CRETI
    )?.descripcion;
    return CRETI_DESC || '';
  };

  /**
   * Obtiene la descripción legible del estado físico seleccionado.
   * Busca en `etiquetasForm.estadoFisico`.
   * @returns Descripción del estado físico o cadena vacía si no se encuentra.
   */
  private getEstadoFisico = (): string => {
    const ESTADO = this.formularioResiduo.get('estadoFisico')?.value;
    const ESTADO_DESC = this.estadoFisicoCatalogo.find(
      (e) => e.clave === ESTADO
    )?.descripcion;
    return ESTADO_DESC || '';
  };

  /**
   * Obtiene la descripción legible del tipo de contenedor seleccionado.
   * Busca en `etiquetasForm.tipoContenedor`.
   * @returns Descripción del tipo de contenedor o cadena vacía si no se encuentra.
   */
  private getTipoContenedor = (): string => {
    const TIPO = this.formularioResiduo.get('tipoContenedor')?.value;
    const TIPO_DESC = this.tipoContenedorCatalogo.find(
      (t) => t.clave === TIPO
    )?.descripcion;
    return TIPO_DESC || '';
  };

  /**
   * Obtiene las materias primas asociadas a un número de bitácora y RFC.
   * Actualiza el catálogo de materias primas con los datos obtenidos.
   *
   * @param noBitacora - Número de bitácora para la búsqueda.
   * @param rfc - RFC asociado para la búsqueda.
   */
  private obtenerMateriasPrimasPorNoBitacora(
    noBitacora: string,
    rfc: string
  ): void {
    this.formularioDatos.get('nombreMateriaPrima')?.reset(null);
    this.materiasPrimasCatalogo = [];
    this.catalogosService
      .obtenerMateriasPrimasPorNoBitacora(noBitacora, rfc)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.materiasPrimasCatalogo = data.datos;
        this.validaNoBitacora(data.datos.length > 0);
      });
  }

  /**
   *  Valida si existe la bitácora y muestra/oculta mensajes de error en consecuencia.
   * @param existeBitacora
   */
  private validaNoBitacora(existeBitacora: boolean): void {
    if (existeBitacora) {
      // Ocultar mensaje de error si existe
      this.esFormaValido = true;
      this.alertaErrorFormulario = '';
    } else {
      this.esFormaValido = false;
      this.alertaErrorFormulario = `<p class="text-danger fw-bold fst-italic">El número de bitácora no existe</p>`;
      // También limpiar los campos deshabilitados
      this.formularioDatos.get('cantidad')?.setValue('');
      this.formularioDatos.get('cantidadLetra')?.setValue('');
      this.formularioDatos.get('unidadDeMedida')?.setValue('');
      this.formularioDatos.get('fraccionArancelaria')?.setValue('');
    }
  }

  /**
   * Verifica si un control del formulario es válido.
   * @param control - Nombre del control a verificar.
   * @returns true si el control es válido, false en caso contrario.
   */
  esControlValido(form: FormGroup, control: string): boolean | undefined {
    if (!form || !control) {
      return false;
    }
    const CONTROL = form.get(control);
    return CONTROL?.invalid && (CONTROL?.dirty || CONTROL?.touched);
  }

  /**
   * Obtiene una materia prima por su ID.
   * @param materiaPrimaId - ID de la materia prima a obtener.
   */
  obtenerMateriaPrimaPorId(materiaPrimaId: string): void {
    this.catalogosService
      .obtenerMateriaPrimaPorId(materiaPrimaId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.setMateriaPrimaSeleccionada(data.datos);
      });
  }

  /**
   * Establece los valores del formulario de datos generales basados en la materia prima seleccionada.
   */
  setMateriaPrimaSeleccionada(materia: MateriaResiduo): void {
    this.formularioDatos.get('idMercancia')?.setValue(materia.id_mercancia);
    this.formularioDatos
      .get('descripcionMateriaPrima')
      ?.setValue(materia.descripcion_mercancia);
    this.formularioDatos.get('cantidad')?.setValue(materia.cantidad);
    this.formularioDatos.get('cantidadLetra')?.setValue(materia.cantidad_letra);
    this.formularioDatos
      .get('unidadDeMedida')
      ?.setValue(materia.descripcion_umc);
    this.formularioDatos
      .get('fraccionArancelaria')
      ?.setValue(materia.cve_fraccion_arancelaria);
  }

  /**
   * Desplaza el modal hacia arriba para asegurar que los mensajes de error sean visibles.
   */
  static scrollModalToTop(): void {
    const MODAL_ELEMENT = document.getElementById('modalAgregarMercancias');
    if (MODAL_ELEMENT) {
      // intenta el body del modal primero, luego modal-content, finalmente el propio elemento
      const MODAL_BODY = MODAL_ELEMENT.querySelector(
        '.modal-body'
      ) as HTMLElement | null;
      const MODAL_CONTENT = MODAL_ELEMENT.querySelector(
        '.modal-content'
      ) as HTMLElement | null;
      const SCROLL_TARGET =
        MODAL_BODY ?? MODAL_CONTENT ?? (MODAL_ELEMENT as HTMLElement);

      if (SCROLL_TARGET && typeof SCROLL_TARGET.scrollTo === 'function') {
        SCROLL_TARGET.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (SCROLL_TARGET) {
        (SCROLL_TARGET as HTMLElement).scrollTop = 0;
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio de catálogos.
   */
  obtenerFraccionesArancelarias(): void {
    this.catalogosService
      .obtenerFraccionesArancelarias()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.fraccionesArancelariasCatalogo = data.datos;
      });
  }

  /**
   * Obtiene la clave NICO asociada a una fracción arancelaria.
   * @param fraccionCve - Clave de la fracción arancelaria.
   */
  obtenerNicoPorFraccion(fraccionCve: string): void {
    this.catalogosService
      .obtenerClaveNico(fraccionCve)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.nicosCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de CRETI desde el servicio de catálogos.
   */
  obtenerCRETI(): void {
    this.catalogosService
      .obtenerCaracteristicaMateria('ENU_CARACTERISTICAS_PELIGROSA')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.cretiCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de estados físicos desde el servicio de catálogos.
   */
  obtenerEdoFisico(): void {
    this.catalogosService
      .obtenerCaracteristicaMateria('ENU_ESTADO_FISICO_MERCANCIA')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoFisicoCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de tipos de contenedor desde el servicio de catálogos.
   */
  obtenerTipoContenedor(): void {
    this.catalogosService
      .obtenerTipoContenedor()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoContenedorCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de unidades de medida desde el servicio de catálogos.
   */
  obtenerUnidadMedida(): void {
    this.catalogosService
      .obtenerUnidadMedida()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.unidadMedidaCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de claves de residuo desde el servicio de catálogos.
   */
  obtenerCveResiduo(): void {
    this.catalogosService
      .obtenerClaveResiduo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.cveResiducoCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de nombres de residuo desde el servicio de catálogos.
   */
  obtenerNombreResiduo(): void {
    this.catalogosService
      .obtenerNombreResiduo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.nombreResiducoCatalogo = data.datos;
      });
  }

  /**
   * Obtiene el catálogo de descripciones de residuo desde el servicio de catálogos.
   */
  obtenerDescResiduo(): void {
    this.catalogosService
      .obtenerDescResiduo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.descResiducoCatalogo = data.datos;
      });
  }

  /**
   * Maneja el cambio en el dropdown de clave de residuo
   */
  onCveResiduoChange(): void {
    const CLAVE_SELECCIONADA =
      this.formularioResiduo.get('claveResiduo')?.value;
    this.formularioResiduo.get('nombre')?.setValue(CLAVE_SELECCIONADA);
    this.formularioResiduo.get('descripcion')?.setValue(CLAVE_SELECCIONADA);
  }

  /**
   * Maneja el cambio en el dropdown de clave de residuo
   */
  onNombreResiduoChange(): void {
    const CLAVE_SELECCIONADA = this.formularioResiduo.get('nombre')?.value;
    this.formularioResiduo.get('claveResiduo')?.setValue(CLAVE_SELECCIONADA);
    this.formularioResiduo.get('descripcion')?.setValue(CLAVE_SELECCIONADA);
  }

  /**
   * Maneja el cambio en el dropdown de clave de residuo
   */
  onDescResiduoChange(): void {
    const CLAVE_SELECCIONADA = this.formularioResiduo.get('descripcion')?.value;
    const RESIDUO = this.descResiducoCatalogo.find(
      (residuo) => residuo.clave === CLAVE_SELECCIONADA
    );
    this.mostrarComboOtroTipo =
      CLAVE_SELECCIONADA === 'CVERES.000' ||
      (RESIDUO?.descripcion.toLowerCase().includes('otro') ?? false);
    HABILITAR_CONTROL(
      this.formularioResiduo.get('otroTipo'),
      this.mostrarComboOtroTipo
    );

    this.formularioResiduo.get('nombre')?.setValue(CLAVE_SELECCIONADA);
    this.formularioResiduo.get('claveResiduo')?.setValue(CLAVE_SELECCIONADA);
  }

  /**
   * Verifica si un control del formulario ha sido tocado.
   * @param form
   * @param control
   * @returns
   */
  controlEsTocado(form: FormGroup, control: string): boolean {
    if (!form || !control) {
      return false;
    }
    return form.get(control)?.touched || false;
  }

  /**
   * Maneja el cambio en el dropdown de estado físico
   */
  onChangeEdoFisico(): void {
    const EDO_FISICO_VALOR = this.formularioResiduo.get('estadoFisico')?.value;
    const CONTROL = this.formularioResiduo.get('otroEdoFisico');
    this.mostrarOtroEdoFisico = EDO_FISICO_VALOR === 'ESFIM.OTR';
    HABILITAR_CONTROL(CONTROL, this.mostrarOtroEdoFisico);
  }

  /**
   * Maneja el cambio en el dropdown de tipo de contenedor
   */
  onChangeTipoContenedor(): void {
    const CONTROL = this.formularioResiduo.get('otroContenedor');
    const CLAVE_SELECCIONADA =
      this.formularioResiduo.get('tipoContenedor')?.value;

    const TIPO_CONTENEDOR = this.tipoContenedorCatalogo.find(
      (tipo) => tipo.clave === CLAVE_SELECCIONADA
    );
    this.mostrarOtroTipoContenedor =
      CLAVE_SELECCIONADA === 'TPCONT.009' ||
      (TIPO_CONTENEDOR?.descripcion.toLowerCase().includes('otro') ?? false);
    HABILITAR_CONTROL(CONTROL, this.mostrarOtroTipoContenedor);
  }

  /**
   * Datos del residuo peligroso a enviar al componente padre
   */
  getDatisResiduos(): DatosResiduos {
    return {
      fraccionCve:
        this.formularioResiduo.get('fraccionArancelaria')?.value || '',
      fraccionDesc: this.getFraccionName() || '',
      nicoCve: this.formularioResiduo.get('nico')?.value || '',
      nicoDesc: this.getNicoName() || '',
      unidadMedidaCve: this.formularioResiduo.get('unidadMedida')?.value || '',
      unidadMedidaDesc: this.getUnidadMedidaName() || '',
      residuoCve: this.formularioResiduo.get('claveResiduo')?.value || '',
      residuoDesc: this.getClaveClasificacion() || '',
      residuoNombre: this.formularioResiduo.get('nombre')?.value || '',
      residuoNombreDesc: this.getNameClasificacion() || '',
      residuoDescCve: this.formularioResiduo.get('descripcion')?.value || '',
      residuoDescDesc: this.getDescClasificacion() || '',
      residuoOtro: this.formularioResiduo.get('otroTipo')?.value || '',
    };
  }

  /**
   * Características del residuo peligroso a enviar al componente padre
   */
  getCaracteristicasResiduos(): CaracteristicasResiduos {
    return {
      cretiCve: this.formularioResiduo.get('creti')?.value || '',
      cretiDesc: this.getCreti() || '',
      estadoFisicoCve: this.formularioResiduo.get('estadoFisico')?.value || '',
      estadoFisicoDesc: this.getEstadoFisico() || '',
      estadoFisicoOtro:
        this.formularioResiduo.get('otroEdoFisico')?.value || '',
      tipoContenedorCve:
        this.formularioResiduo.get('tipoContenedor')?.value || '',
      tipoContenedorDesc: this.getTipoContenedor() || '',
      tipoContenedorOtro:
        this.formularioResiduo.get('otroContenedor')?.value || '',
    };
  }

  /**
   * Muestra una notificación de fracción arancelaria inválida.
   */
  mostrarNotificacionFraccionInvalida(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: '',
      mensaje: 'el número no es valido',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Limpieza al destruir el componente:
   * - Completa los subjects de destrucción
   * - Cancela suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
