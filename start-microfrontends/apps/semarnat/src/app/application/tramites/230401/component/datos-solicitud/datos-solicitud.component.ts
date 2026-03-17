/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ALERTA_DE_MATERIAL,
  Catalogo,
  CatalogoPaises,
  ConsultaioQuery,
  CrossListLable,
  Notificacion,
  Pedimento,
  REGEX_SOLO_DIGITOS,
  SeccionLibQuery,
  TablaSeleccion,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import {
  CONFIGURACION_SUSTANCIAS_SENSIBLES,
  CONTINUAR,
  CROSLISTA_DE_PAISES,
  LISTA_DE_ENTRADA_PERSONALIZADA,
} from '../../enum/pantallas-constante.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Solicitud230401State,
  Tramite230401Store,
} from '../../estados/tramite230401.store';
import {
  delay,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { PantallasActionService } from '../../services/pantallas-action.service';
import { SeccionLibState } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Solicitud230401Query } from '../../estados/queries/solicitud230401.query';
import { Subject } from 'rxjs';
import { SustanciaSensible } from '../../models/tramies230401.model';

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {
  
  /**
   * @description
   * Objeto que representa una nueva notificación.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Controla la visibilidad del modal de alerta.
   */
  public mostrarAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de confirmación para eliminar.
   */
  public confirmacionAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de notificación de eliminación exitosa.
   */
  public mostrarNotificacion: boolean = false;

  /**
   * Objeto que representa una notificación para confirmación de eliminación.
   */
  public seleccionarFilaNotificacion: Notificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: '¿Estás seguro que deseas eliminar los registros seleccionados?',
    cerrar: true,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar',
  };

  /**
   * Configuración para el modal de eliminación exitosa.
   */
  public notificacionEliminacionExitosa: Notificacion = {
    tipoNotificacion: 'alert',
    categoria: 'success',
    modo: 'info',
    titulo: '',
    mensaje: 'El registro fue eliminado correctamente',
    cerrar: true,
    tiempoDeEspera: 3000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };

  /**
   * Formulario reactivo para capturar datos de la solicitud.
   */
  formSolicitud!: FormGroup;
  
  /**
   * Identificador del tipo de solicitud seleccionada.
   */
  tipoSolicitudSeleccionada!: number;
  
  /**
   * Lista de países de origen.
   */
  paisesOrigen!: CatalogoPaises[];

  /**
   * Lista de países de procedencia.
   */
  paisesProcedencia!: CatalogoPaises[];

  /**
   * Lista de aduanas disponibles.
   */
  aduanas!: Catalogo[];

  /**
   * Lista de secciones aduaneras.
   */
  seccionAduanera!: Catalogo[];

  /**
   * Lista de tipos de operación.
   */
  tipoOperacion!: Catalogo[];

  /**
   * Lista cruzada de países.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Notificador para destruir suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud230401State;

  /**
   * Etiquetas para selección cruzada.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionado(s)*:',
    showUnoTitulo: false,
    showDosTitulo: false
  };
  /** Etiquetas para el país de procedencia */
public paisDelProductoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País donde se elabora el producto:',
    derecha: 'País(es) seleccionado(s)*:',
    showUnoTitulo: false,
    showDosTitulo: false
  };
  /**
   * Etiquetas para las aduanas de entrada
   */
  public aduanasDeEntradaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Aduanas de entrada disponibles:',
    derecha: 'Aduanas de entrada seleccionadas*:',
    showUnoTitulo: false,
    showDosTitulo: false
  };

  /**
   * Configuración de tabla.
   */
  public tablaSeleccion = TablaSeleccion.CHECKBOX;
  public configuracionSustanciasTabla = CONFIGURACION_SUSTANCIAS_SENSIBLES;
  public sustanciasSensiblesTablaDatos: SustanciaSensible[] = [];
  public sustanciasSensiblesSeleccionadas: SustanciaSensible[] = [];

  /**
   * Propiedades para cross-list de países de procedencia.
   */
  paisDeProcedenciaSeleccionadas: string[] = [];

  /**
   * Datos de los países de procedencia.
   */
  paisDeProcedenciaDatos: string[] = [];

  /**
   * Selección de origen del país.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /**
   * Fecha de los países de procedencia.
   */
  paisDeProcedenciaFecha: FormControl = new FormControl('');
/**
 * Fecha de los países de procedencia seleccionada.
 */
  
  paisDeProcedenciaFechaSeleccionada: FormControl = new FormControl('');

  /**
   * Botones para la selección de países de procedencia.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: () => this.agregar(''),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: () => this.agregar(CONTINUAR),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: () => this.quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: () => this.quitar(CONTINUAR),
    },
  ];

  /**
   * Propiedades para cross-list del país del producto.
   */
  paisDelProductoSeleccionadas: string[] = [];
  paisDelProductoDatos: string[] = [];
  listaPaisDelProducto: string[] = this.crosListaDePaises;
  paisDelProductoFecha: FormControl = new FormControl('');
  paisDelProductoFechaSeleccionada: FormControl = new FormControl('');

  paisDelProductoBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: () => this.agregarDos(''),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: () => this.agregarDos(CONTINUAR),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: () => this.quitarDos(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: () => this.quitarDos(CONTINUAR),
    },
  ];

  /**
   * Propiedades para cross-list de aduanas.
   */
  aduanasDeEntradaSeleccionadas: string[] = [];
  aduanasDeEntradaDatos: string[] = [];
  listaDeEntradaPersonalizada = LISTA_DE_ENTRADA_PERSONALIZADA;
  aduanasDeEntradaFecha: FormControl = new FormControl('');
  aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl('');

  aduanasDeEntradaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: () => this.agregarTres(''),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: () => this.agregarTres(CONTINUAR),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: () => this.quitarTres(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: () => this.quitarTres(CONTINUAR),
    },
  ];

  /**
   * Estado de la sección.
   */
  private seccion!: SeccionLibState;

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el componente está en modo modificación.
   */
  private modoModificacion: boolean = false;

  /**
   * Sustancia que está siendo modificada.
   */
  private sustanciaEnModificacion: SustanciaSensible | null = null;

  /**
   * Arreglo de pedimentos.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Índice del elemento a eliminar.
   */
  elementoParaEliminar!: number;

  /**
   * Textos y alertas.
   */
  TEXTOS = ALERTA_DE_MATERIAL;

  /**
   * Mensajes de error y advertencia.
   */
  public infoAlert = 'alert-info';

  /**
   * Indica si se ha seleccionado una fecha futura.
   */

  constructor(
    public pantallasActionService: PantallasActionService,
    public validacionesService: ValidacionesFormularioService,
    public tramite230401Store: Tramite230401Store,
    public fb: FormBuilder,
    public solicitud230401Query: Solicitud230401Query,
    private consultaQuery: ConsultaioQuery,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore
  ) {
    this.pantallasActionService.inicializaPasoUnoDatosCatalogos();
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se llama después de que el componente ha sido inicializado.
   * Se utiliza para configurar el estado inicial del componente, suscribirse a observables y preparar datos necesarios.
   */
  ngOnInit(): void {
    this.solicitud230401Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.sustanciasSensiblesTablaDatos = seccionState.sustanciasSensiblesTablaDatos;
        })
      ).subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (!seccionState.create && seccionState.procedureId === '230401') {
            this.esFormularioSoloLectura = seccionState.readonly;
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.formSolicitud.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          const SECCION: number = 1;
          const FORMAS_VALIDADAS = this.seccion.formaValida;
          const ES_VALIDO_EL_FORM = this.esFormValido();
          if (this.formSolicitud.valid || (ES_VALIDO_EL_FORM)) {
            FORMAS_VALIDADAS[SECCION] = true;
            this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
          } else {
            FORMAS_VALIDADAS[SECCION] = false;
            this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
          }
        })
      )
      .subscribe();
  }

/**
 * @inheritdoc
 * @description
 * Método del ciclo de vida de Angular que se llama justo antes de destruir el componente.
 * Se utiliza para limpiar recursos, cancelar suscripciones y evitar fugas de memoria.
 * En este caso, emite y completa el observable `destroyNotifier$` para notificar a los suscriptores que deben limpiar sus recursos.
 */
 ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el estado del formulario.
   */
  inicializarEstadoFormulario(): void {
    if (!this.formSolicitud) {
      this.creatformSolicitud();
    }
    if (this.esFormularioSoloLectura) {
      this.formSolicitud?.disable();
    } else {
      this.formSolicitud?.enable();
    }
  }

  /**
   * Verifica si el formulario es válido.
   */
  esFormValido(): boolean {
    for (const NOMBRE_DEL_CONTROL in this.formSolicitud.controls) {
      if (!NOMBRE_DEL_CONTROL) {
        continue;
      }
      const CONTROL = this.formSolicitud.get(NOMBRE_DEL_CONTROL);
      if (CONTROL && CONTROL.enabled && CONTROL.invalid) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verifica si un campo específico es válido.
   */
  isValid(form: FormGroup, field: string): boolean {
    // eslint-disable-next-line no-implicit-coercion
    return !!this.validacionesService.isValid(form, field);
  }

  /**
   * Verifica si la cantidad es mayor a 400.
   */
  isCantidadMayorA400(): boolean {
    const CANTIDAD = this.formSolicitud?.get('cantidad')?.value;
    if (!CANTIDAD) { 
      return false;
    }
    const CANTIDAD_NUMERICA = parseFloat(CANTIDAD);
    return !isNaN(CANTIDAD_NUMERICA) && CANTIDAD_NUMERICA > 400;
  }

  /**
   * Verifica si la cantidad es menor o igual a 400.
   */
  isCantidadMenorOIgualA400(): boolean {
    const CANTIDAD = this.formSolicitud?.get('cantidad')?.value;
    if (!CANTIDAD) {
      return false;
    }
    const CANTIDAD_NUMERICA = parseFloat(CANTIDAD);
    return !isNaN(CANTIDAD_NUMERICA) && CANTIDAD_NUMERICA <= 400;
  }

  /**
   * Cierra la notificación de eliminación.
   */
  cerrarNotificacionEliminacion(_evento: boolean): void {
    this.mostrarNotificacion = false;
  }

  /**
   * Custom validator to check if the value contains only numeric characters (including decimals)
   */
  static numericValidator(control: import('@angular/forms').AbstractControl): Record<string, boolean> | null {
    if (!control.value || control.value === '') {
      return null; 
    }
    
    const VALUE = control.value.toString().trim();
   
    const NUMERIC_REGEX = /^\d+(\.\d+)?$/;

    if (!NUMERIC_REGEX.test(VALUE)) {
      return { 'numeric': true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para verificar si el valor excede 12 dígitos y 3 decimales
   */
  static maxDigitsDecimalsValidator(control: import('@angular/forms').AbstractControl): { [key: string]: boolean } | null {
    if (!control.value || control.value === '') {
      return null;
    }
    
    const VALUE = control.value.toString();
    const PARTS = VALUE.split('.');

   
    if (PARTS[0] && PARTS[0].length > 12) {
      return { 'maxDigitsDecimals': true };
    }
    
   
    if (PARTS[1] && PARTS[1].length > 3) {
      return { 'maxDigitsDecimals': true };
    }
    
    return null;
  }

  /**
   * Busca RFC del representante y actualiza cantidadLetra.
   */
  buscarRepresentanteRfc(): void {
    const CANTIDAD = this.formSolicitud.get('cantidad')?.value;

    if (CANTIDAD) {
      const CANTIDAD_NUMERICA = parseFloat(CANTIDAD);
      const CONTROL_CANTIDAD_LETRA = this.formSolicitud.get('cantidadLetra');

      if (!isNaN(CANTIDAD_NUMERICA) && CANTIDAD_NUMERICA > 0) {
        if (CANTIDAD_NUMERICA > 400) {
          CONTROL_CANTIDAD_LETRA?.enable({ emitEvent: false });
          CONTROL_CANTIDAD_LETRA?.setValue('', { emitEvent: false });
          CONTROL_CANTIDAD_LETRA?.setValidators([Validators.required]);
          CONTROL_CANTIDAD_LETRA?.updateValueAndValidity();
        } else {
          CONTROL_CANTIDAD_LETRA?.setValue('EUROFOODS DE MEXICO', { emitEvent: false });
          CONTROL_CANTIDAD_LETRA?.disable({ emitEvent: false });
          CONTROL_CANTIDAD_LETRA?.clearValidators();
          CONTROL_CANTIDAD_LETRA?.updateValueAndValidity();
        }
      } else {
        CONTROL_CANTIDAD_LETRA?.disable({ emitEvent: false });
        CONTROL_CANTIDAD_LETRA?.setValue('', { emitEvent: false });
        CONTROL_CANTIDAD_LETRA?.clearValidators();
        CONTROL_CANTIDAD_LETRA?.updateValueAndValidity();
      }
    } else {
      const CONTROL_CANTIDAD_LETRA = this.formSolicitud.get('cantidadLetra');
      CONTROL_CANTIDAD_LETRA?.disable({ emitEvent: false });
      CONTROL_CANTIDAD_LETRA?.setValue('', { emitEvent: false });
      CONTROL_CANTIDAD_LETRA?.clearValidators();
      CONTROL_CANTIDAD_LETRA?.updateValueAndValidity();
    }
  }

  /**
   * Crea y configura el formulario principal.
   */
  creatformSolicitud(): void {
    this.formSolicitud = this.fb.group({
      tipoSolicitud: [
        this.solicitudState?.tipoSolicitud,
        [Validators.required],
      ],
      autorizacion: [this.solicitudState?.autorizada],
      noDePermisocoferprise: [
        this.solicitudState?.noDePermisocoferprise,
        [Validators.required],
      ],
      nombreComercial: [
        { value: this.solicitudState?.nombreComercial, disabled: true },
      ],
      cantidadAutorizada: [
        { value: this.solicitudState?.cantidadAutorizada, disabled: true },
      ],
      fraccionArancelaria: [
        this.solicitudState?.fraccionArancelaria,
        [Validators.required],
      ],
      descripcionDeLaFraccion: [
        { value: this.solicitudState?.descripcionDeLaFraccion, disabled: true },
      ],
      descripcionNoArancelaria: [
        {
          value: this.solicitudState?.descripcionNoArancelaria,
          disabled: true,
        },
      ],
      nombreQuimico: [
        { value: this.solicitudState?.nombreQuimico, disabled: true },
      ],
      numeroCas: [this.solicitudState?.numeroCas, [Validators.required]],
      nombreDeLaMercancia: [
        this.solicitudState?.nombreDeLaMercancia,
        [Validators.maxLength(50)],
      ],
      unNumero: [
        this.solicitudState?.unNumero,
        [Validators.required, Validators.maxLength(50), Validators.pattern(REGEX_SOLO_DIGITOS)],
      ],
      datosNombreComercial: [
        this.solicitudState?.datosNombreComercial,
        [Validators.maxLength(50)],
      ],
      datosNumeroComun: [
        this.solicitudState?.datosNumeroComun,
        [Validators.maxLength(50)],
      ],
      datosPorcentaje: [
        this.solicitudState?.datosPorcentaje,
        [Validators.required, Validators.maxLength(100)],
      ],
      datosComponentes: [
        this.solicitudState?.datosComponentes,
        [Validators.required, Validators.maxLength(250)],
      ],
      clasificacion: [
        this.solicitudState?.clasificacion,
        [Validators.required],
      ],
      estadoFisico: [this.solicitudState?.estadoFisico, [Validators.required]],
      datosObjecto: [this.solicitudState?.datosObjecto, [Validators.required]],
      especifique: [
        this.solicitudState?.especifique,
        [Validators.maxLength(200)],
      ],
      especifiqueDos: [
        this.solicitudState?.especifiqueDos,
        [Validators.maxLength(250)],
      ],
      cantidad: [
        this.solicitudState?.cantidad,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(999999999999.999),
          DatosSolicitudComponent.numericValidator,
          DatosSolicitudComponent.maxDigitsDecimalsValidator
        ],
      ],
      cantidadLetra: [
        { value: this.solicitudState?.cantidadLetra || '', disabled: true }
      ],
      unidadDeMedida: [
        this.solicitudState?.unidadDeMedida,
        [Validators.required],
      ],
    });
  }

  // Métodos para cross-list de países de procedencia
  agregar(tipo: string): void {
    if (tipo === CONTINUAR) {
      this.paisDeProcedenciaSeleccionadas = [...this.seleccionarOrigenDelPais];
      this.paisDeProcedenciaDatos = [];
    } else {
      const FECHAVALOR = this.paisDeProcedenciaFecha.value.map(Number);
      this.paisDeProcedenciaSeleccionadas.push(
        this.paisDeProcedenciaDatos[FECHAVALOR]
      );
      this.paisDeProcedenciaDatos.splice(FECHAVALOR, 1);
    }
  }

  quitar(tipo: string = ''): void {
    if (tipo === CONTINUAR) {
      this.paisDeProcedenciaDatos = [...this.paisDeProcedenciaSeleccionadas];
      this.paisDeProcedenciaSeleccionadas = [];
    } else {
      const FECHAVALOR =
        this.paisDeProcedenciaFechaSeleccionada.value.map(Number);
      this.paisDeProcedenciaDatos.push(
        this.paisDeProcedenciaSeleccionadas[FECHAVALOR]
      );
      this.paisDeProcedenciaSeleccionadas.splice(FECHAVALOR, 1);
    }
  }

  agregarDos(tipo: string): void {
    if (tipo === CONTINUAR) {
      this.paisDelProductoSeleccionadas = [...this.listaPaisDelProducto];
      this.paisDelProductoDatos = [];
    } else {
      const FECHAVALOR = this.paisDelProductoFecha.value?.map(Number);
      this.paisDelProductoSeleccionadas.push(
        this.paisDelProductoDatos[FECHAVALOR]
      );
      this.paisDelProductoDatos.splice(FECHAVALOR, 1);
    }
  }

  quitarDos(tipo: string = ''): void {
    if (tipo === CONTINUAR) {
      this.paisDelProductoDatos = [...this.paisDelProductoSeleccionadas];
      this.paisDelProductoSeleccionadas = [];
    } else {
      const FECHAVALOR =
        this.paisDeProcedenciaFechaSeleccionada.value?.map(Number);
      this.paisDelProductoDatos.push(
        this.paisDelProductoSeleccionadas[FECHAVALOR]
      );
      this.paisDelProductoSeleccionadas.splice(FECHAVALOR, 1);
    }
  }

  agregarTres(tipo: string): void {
    if (tipo === CONTINUAR) {
      this.aduanasDeEntradaSeleccionadas = [...this.seleccionarOrigenDelPais];
      this.aduanasDeEntradaDatos = [];
    } else {
      const FECHAVALOR = this.aduanasDeEntradaFecha.value.map(Number);
      this.aduanasDeEntradaSeleccionadas.push(
        this.aduanasDeEntradaDatos[FECHAVALOR]
      );
      this.aduanasDeEntradaDatos.splice(FECHAVALOR, 1);
    }
  }

  quitarTres(tipo: string = ''): void {
    if (tipo === CONTINUAR) {
      this.aduanasDeEntradaDatos = [...this.aduanasDeEntradaSeleccionadas];
      this.aduanasDeEntradaSeleccionadas = [];
    } else {
      const FECHAVALOR =
        this.aduanasDeEntradaFechaSeleccionada.value.map(Number);
      this.aduanasDeEntradaDatos.push(
        this.aduanasDeEntradaSeleccionadas[FECHAVALOR]
      );
      this.aduanasDeEntradaSeleccionadas.splice(FECHAVALOR, 1);
    }
  }

  // Store methods
  setValoresStore(form: FormGroup, campo: string): void {
    const VALRO = form.get(campo)?.value;
    if (campo === 'cantidad' && VALRO !== null && VALRO !== undefined) {
      const NUMERO_ACTIVO = String(VALRO);
      this.tramite230401Store.setCantidad(NUMERO_ACTIVO);
    }
  }

  // Selection methods
  tipoSolicitudSeleccion(): void {
    this.tipoSolicitudSeleccionada = parseInt(
      this.formSolicitud.get('tipoSolicitud')?.value,
      10
    );
    const TIPO_SOLICITUD = this.formSolicitud.get('tipoSolicitud')?.value;
    if (TIPO_SOLICITUD) {
      this.tramite230401Store.setTipoSolicitud(TIPO_SOLICITUD);
    }
  }

  noDePermisocoferpriseSeleccion(): void {
    const NO_DE_PERMISOCOFERPRISE = this.formSolicitud.get(
      'noDePermisocoferprise'
    )?.value;
    this.tramite230401Store.setNoDePermisocoferprise(NO_DE_PERMISOCOFERPRISE);
  }

  fraccionArancelariaSeleccion(): void {
    const FRACCION_ARANCELARIA = this.formSolicitud.get(
      'fraccionArancelaria'
    )?.value;
    const DESCRIPCION_DE_LA_FRACCION = `Descripción de la fracción arancelaria ${this.formSolicitud.get('fraccionArancelaria')?.value}`;
    this.formSolicitud.patchValue({
      descripcionDeLaFraccion: DESCRIPCION_DE_LA_FRACCION,
    })
    this.tramite230401Store.setDescripcionDeLaFraccion(DESCRIPCION_DE_LA_FRACCION);
    this.tramite230401Store.setFraccionArancelaria(FRACCION_ARANCELARIA);
  }

  seleccioneAutorizacion(): void {
    const AUTORIZACION = this.formSolicitud.get('autorizacion')?.value;
    this.tramite230401Store.setAutorizacion(AUTORIZACION);
  }

  numeroCasSeleccione(): void {
    const NUMERO_CAS = this.formSolicitud.get('numeroCas')?.value;
    const DESCRIPCION_NO_ARANCELARIA = `Descripción no arancelaria ${this.formSolicitud.get('numeroCas')?.value}`;
    const NOMBRE_QUIMICO = `Nombre químico ${this.formSolicitud.get('numeroCas')?.value}`;
    this.formSolicitud.patchValue({
      descripcionNoArancelaria: DESCRIPCION_NO_ARANCELARIA,
      nombreQuimico: NOMBRE_QUIMICO,
    })
    this.tramite230401Store.setDescripcionNoArancelaria(DESCRIPCION_NO_ARANCELARIA);
    this.tramite230401Store.setNombreQuimico(NOMBRE_QUIMICO);
    this.tramite230401Store.setNumeroCas(NUMERO_CAS);
  }

  clasificacionSeleccione(): void {
    const CLASIFICACION = this.formSolicitud.get('clasificacion')?.value;
    this.tramite230401Store.setClasificacion(CLASIFICACION);
  }

  estadoFisicoSeleccione(): void {
    const ESTADO_FISICO = this.formSolicitud.get('estadoFisico')?.value;
    this.tramite230401Store.setEstadoFisico(ESTADO_FISICO);
  }

  datosObjectoSeleccione(): void {
    const DAT_OS_OBJECTO = this.formSolicitud.get('datosObjecto')?.value;
    this.tramite230401Store.setDatosObjecto(DAT_OS_OBJECTO);
  }

  unidadDeMedidaSeleccione(): void {
    const UNIDAD_DE_MEDIDA = this.formSolicitud.get('unidadDeMedida')?.value;
    this.tramite230401Store.setUnidadDeMedida(UNIDAD_DE_MEDIDA);
  }

 /**
  * Método para modificar la lista de números
  */
  modificarListaDeNumeros(): void {
    
    if (this.sustanciasSensiblesSeleccionadas.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'info',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
      return;
    }

   
    if (this.sustanciasSensiblesSeleccionadas.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'info',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
      return;
    }

   
    this.modoModificacion = true;
    this.sustanciaEnModificacion = this.sustanciasSensiblesSeleccionadas[0];
    
   
    this.formSolicitud.patchValue({
      numeroCas: this.sustanciaEnModificacion.numeroCAS,
      descripcionNoArancelaria: this.sustanciaEnModificacion.descripcionNoArancelaria,
      nombreQuimico: this.sustanciaEnModificacion.nombreQuimico
    });
    
   
    this.tramite230401Store.setNumeroCas(this.sustanciaEnModificacion.numeroCAS || '');
    this.tramite230401Store.setDescripcionNoArancelaria(this.sustanciaEnModificacion.descripcionNoArancelaria || '');
    this.tramite230401Store.setNombreQuimico(this.sustanciaEnModificacion.nombreQuimico || '');
  }


  /**
   * Método para agregar un nuevo número CAS a la lista
   */
  agregarListaDeNumeros(): void {
    
    const NUMERO_CAS = this.formSolicitud.get('numeroCas')?.value;

    if (!NUMERO_CAS) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'info',
        titulo: '',
        mensaje: 'Es necesario agregar un número CAS',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
      return;
    }

    const SUSTANCIA_SENSIBLE: SustanciaSensible = {
      numeroCAS: this.formSolicitud.get('numeroCas')?.value,
      cas: '',
      descripcionNoArancelaria: this.formSolicitud.get('descripcionNoArancelaria')?.value || `Descripción no arancelaria ${this.formSolicitud.get('numeroCas')?.value}`,
      nombreQuimico: this.formSolicitud.get('nombreQuimico')?.value || `Nombre químico ${this.formSolicitud.get('numeroCas')?.value}`,
    };

    const UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS = [...this.sustanciasSensiblesTablaDatos];

    if (this.modoModificacion && this.sustanciaEnModificacion) {
      const EXISTING_INDEX = UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS.findIndex(
        (item) => item.numeroCAS === this.sustanciaEnModificacion?.numeroCAS
      );

      if (EXISTING_INDEX !== -1) {
        UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS[EXISTING_INDEX] = SUSTANCIA_SENSIBLE;
      }

      this.modoModificacion = false;
      this.sustanciaEnModificacion = null;
    } else {
      const EXISTING_INDEX = UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS.findIndex(
        (item) => item.numeroCAS === SUSTANCIA_SENSIBLE.numeroCAS
      );

      if (EXISTING_INDEX !== -1) {
        UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS[EXISTING_INDEX] = SUSTANCIA_SENSIBLE;
      } else {
        UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS.push(SUSTANCIA_SENSIBLE);
      }
    }

    this.tramite230401Store.setSustanciasSensiblesTablaDatos(UPDATED_SUSTANCIAS_SENSIBLES_TABLA_DATOS);

    this.formSolicitud.patchValue({
      numeroCas: '',
      descripcionNoArancelaria: '',
      nombreQuimico: ''
    });

    this.sustanciasSensiblesSeleccionadas = [];
  }

  /**
   * Método para eliminar un número CAS de la lista
   */
  eliminarListaDeNumeros(): void {
    if (this.sustanciasSensiblesSeleccionadas.length === 0) {
      return;
    }
    const LISTA_FILTRADA = this.sustanciasSensiblesTablaDatos.filter((elemento) => {
      return !this.sustanciasSensiblesSeleccionadas.some((elementoSeleccionado) => elementoSeleccionado.numeroCAS === elemento.numeroCAS);
    });
    if (LISTA_FILTRADA) {
      this.tramite230401Store.update((state) => ({
        ...state,
        sustanciasSensiblesTablaDatos: LISTA_FILTRADA,
      }));
      this.sustanciasSensiblesSeleccionadas = [];
    }
  }


eliminarPedimentoConfirmacion(borrar: boolean): void {
    if (borrar) {
      // Handle elimination logic if needed
    }
    this.confirmacionAlerta = false;
    if (borrar && this.pedimentos.length > 0) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  eliminarModal(): void {
    if (!this.sustanciasSensiblesSeleccionadas.length) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'info',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
      return;
    }
    
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros seleccionados?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmacionAlerta = true;
  }

  confirmarEliminacionSustancias(borrar: boolean): void {
    this.confirmacionAlerta = false;

    if (borrar) {
      this.eliminarListaDeNumeros();
      this.mostrarNotificacion = true;
    }
  }
}