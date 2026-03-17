import { ALERTA_PARA, FECHA_DE_FACTURA } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AfterViewInit,Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIA_TABLA, MercanciasFormInfo, MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/110208/certificado.model';
import { Solicitud110208State, Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Modal } from 'bootstrap';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';
import { ValidarInicalmenteService } from '../../services/validar-inicalmente/validar-inicalmente.service';
/**
 * Componente que gestiona la carga de mercancías.
 */
@Component({
  selector: 'app-carga-de-mercancias',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputFechaComponent,NotificacionesComponent
  ],
  templateUrl: './cargaDeMercancias.component.html',
  styleUrl: './cargaDeMercancias.component.css',
})
export class CargaDeMercanciasComponent implements OnInit, OnDestroy, AfterViewInit {
  /* Referencia al modal en la plantilla, obtenida con @ViewChild 
   después de que Angular renderice la vista. */
  @ViewChild('cargarArchivoModal', { static: false }) cargarArchivoModal!: ElementRef;
  /* Instancia privada del modal, inicializada en tiempo de ejecución 
   usando el elemento capturado. */
  private cargarArchivoInstance!: Modal;
   /**
   * Notificación para mostrar alertas al usuario.
   */
  alertaNotificacion!: Notificacion;
  /**
   * Notificación para mostrar alertas al usuario.
   */
  alertaNotificacionModal!:Notificacion;
  /**
   * Formulario reactivo para gestionar los datos de mercancías.
   */
  formMercancia!: FormGroup; 
  /**
   * Tipo de selección de tabla (RADIO).
   */
  tipoSeleccionTabla = TablaSeleccion.RADIO;
  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de la solicitud obtenido desde el store.
   */
  public solicitudState!: Solicitud110208State;

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Configuración del input de fecha de factura.
   */
  public fechaFacturaInput: InputFecha = FECHA_DE_FACTURA;

  /**
   * Alerta para el componente.
   */
  public alerta = ALERTA_PARA;

  /**
   * Configuración de las columnas de la tabla de mercancías.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIA_TABLA;

  /**
   * Datos de la tabla de mercancías.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Datos del formulario de mercancías.
   */
  mercanciasFormaDatos: MercanciasFormInfo[] = [];

  /**
   * Lista de catálogos de estados.
   */
  estado: Catalogo[] = [];

  /** Almacena la fila seleccionada de la tabla de mercancías. */
  public seleccionadoRow: MercanciasInfo | null = null;

  /** Instancia del modal utilizada para mostrar y ocultar el diálogo de mercancías. */
  private modalInstance!: Modal;

  /**
   * Constructor del componente.
   * @param fb Constructor del formulario reactivo.
   * @param service Servicio para validar inicialmente.
   * @param tramite110208Store Store del trámite 110208.
   * @param tramite110208Query Query del trámite 110208.
   */
  constructor(
    private fb: FormBuilder,
    private service: ValidarInicalmenteService,
    public tramite110208Store: Tramite110208Store,
    private tramite110208Query: Tramite110208Query,
    private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }
 /*  
 * Inicializa la instancia del modal una vez que la vista  
 * del componente está completamente renderizada.  
 * Permite controlar el modal de carga de archivo.  
 */    
ngAfterViewInit(): void {
  if (this.cargarArchivoModal) {
    this.cargarArchivoInstance = new Modal(this.cargarArchivoModal.nativeElement);
  }
}
/*  
 * Abre el modal de carga de archivo.  
 * Se asegura de que la instancia esté creada.  
 * Permite al usuario seleccionar y cargar un archivo.  
 */
cargarArchivo(): void {
  if (this.cargarArchivoInstance) {
    this.cargarArchivoInstance.show();
  }
}
/*  
 * Cierra el modal de carga de archivo.  
 * Verifica que la instancia del modal exista.  
 * Oculta la ventana de carga del usuario.  
 */
cerrar(): void {
  if (this.cargarArchivoInstance) {
    this.cargarArchivoInstance.hide();
  }
}
 /**
   * compo doc
   * @type {FormGroup}
   * @memberof PartidasDeLaMercanciaComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public archivoFormGroup: FormGroup = new FormGroup({
    archivo: new FormControl(''),
  });


  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void { 
    this.inicializarEstadoFormulario();
    this.obtenerTablaDatos();
    this.obtenerEstadoList();
    this.obtenerFormDatos();    
  }

  /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite110208Query
    .selectSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    )
    .subscribe();
    this.formMercancia = this.fb.group({
      fraccionArancelaria: [{ value: '', disabled: true }],
      nombreComercial: [{ value: '', disabled: true }],
      nombreTecnio: [{ value: '', disabled: true }],
      nombreEnIngles: [{ value: '', disabled: true }],
      criterioPara: [{ value: '', disabled: true }],
      marca: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      umc: [this.solicitudState?.umc],
      cantidad: [this.solicitudState?.cantidad,[Validators.required,CargaDeMercanciasComponent.numericValidator()]],
      valorDeLa: [this.solicitudState?.valorDeLa,[Validators.required,CargaDeMercanciasComponent.numericValidator()]],
      complementoDescripcion: [this.solicitudState?.complementoDescripcion,[Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z0-9\s.,-]*$/)]],
      nFactura: [this.solicitudState?.nFactura,[Validators.required,Validators.maxLength(20)]],
      tipoDeFactura: [this.solicitudState?.tipoDeFactura, Validators.required],
      fechaFactura: [this.solicitudState?.fechaFactura, Validators.required],
    });
    if (this.esFormularioSoloLectura) {
      Object.keys(this.formMercancia.controls).forEach((key) => {
        this.formMercancia.get(key)?.disable();
      });
  }
}

  /**
   * Obtiene los datos de la tabla de mercancías.
   */
  obtenerTablaDatos(): void {
    this.service.obtenerTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.mercanciasTablaDatos = DATOS;
      });
  }

  /**
   * Obtiene los datos del formulario de mercancías.
   */
  obtenerFormDatos(): void {
    this.service
      .obtenerFormDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.mercanciasFormaDatos = data?.data;
        this.formMercancia.patchValue({
          fraccionArancelaria: this.mercanciasFormaDatos[0].fraccionArancelaria,
          nombreComercial: this.mercanciasFormaDatos[0].nombreComercial,
          nombreTecnio: this.mercanciasFormaDatos[0].nombreTecnio,
          nombreEnIngles: this.mercanciasFormaDatos[0].nombreEnIngles,
          criterioPara: this.mercanciasFormaDatos[0].criterioPara,
        });
      });
  }

  /**
   * Abre el modal para agregar mercancías.
   */
  abrirDialogoMercancias(): void {
    if (this.seleccionadoRow) {
      if (this.modalElement) {
        this.modalInstance = new Modal(this.modalElement.nativeElement);
        this.modalInstance.show();
        this.formMercancia.patchValue({
          fraccionArancelaria: this.seleccionadoRow.fraccion_arancelaria,
          nombreComercial: 'TSB Door Latch ZV GL2 left',
          nombreTecnio: 'NOMBRE EN INGLES',
          nombreEnIngles: 'NOMBRE EN INGLES',
          criterioPara: this.seleccionadoRow.valor_mercancia,
        });
      }
    }
  }

  /**
   * Cierra el modal.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON.
   */
  obtenerEstadoList(): void {
    this.service
      .obtenerEstadoList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.estado = DATOS;
      });
  }

  /**
   * Cambia la fecha de la factura en el formulario.
   * @param nuevo_valor Nuevo valor de la fecha.
   * @param form Formulario reactivo.
   * @param campo Campo del formulario.
   * @param metodoNombre Método del store a ejecutar.
   */
  public cambioFechaFactura(
    nuevo_valor: string,
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110208Store
  ): void {
    this.formMercancia.get('fechaFactura')?.setValue(nuevo_valor);
    this.formMercancia.get('fechaFactura')?.markAsUntouched();
    const VALOR = form.get(campo)?.value;
    (this.tramite110208Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Establece valores en el store.
   * @param form Formulario reactivo.
   * @param campo Campo del formulario.
   * @param metodoNombre Método del store a ejecutar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110208Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110208Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
 * Asigna la fila seleccionada de la tabla de mercancías al atributo correspondiente.
 * @param event - Fila de mercancía seleccionada.
 */
  filaSeleccionadaEvento(event: MercanciasInfo): void {
    if (event) {
      this.seleccionadoRow = event; 
    }
  }

  /**
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param campo El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.formMercancia, campo);
  } 
 /**
   * Valida que el valor sea numérico, positivo y con hasta 15 enteros y 4 decimales.
   * Permite vacío, pero rechaza ceros o negativos.
   */
  static numericValidator(): ValidatorFn {
    const REGEX_VALUE = /^\d{1,15}(\.\d{1,4})?$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {return null} 
    if (!REGEX_VALUE.test(VALOR)) {
      return { invalidNumber: true };
    }    
    if (parseFloat(VALOR) <= 0) {
      return { greaterThanZero: true };
    } return null;
  };
}
/**
 * Formatea el valor de un control a 4 decimales.
 * Si el valor es válido y numérico, lo convierte con precisión fija.
 * No emite evento al actualizar el control.
 * Evita errores cuando el valor es nulo o vacío.
 */
formatearACuatroDecimales(controlName: string): void {
  const CONTROL = this.formMercancia.get(controlName);
  const VALOR = CONTROL?.value;
  if (VALOR !== null && VALOR !== undefined && VALOR !== '') {
    const NUMERO = parseFloat(VALOR);
    if (!isNaN(NUMERO)) {     
      CONTROL?.setValue(NUMERO.toFixed(4), { emitEvent: false });
    }
  }
}
/**
 * Muestra una notificación de alerta en pantalla.  
 * Advierte sobre las mercancías que cumplen con las condiciones establecidas.  
 * Configura los parámetros del mensaje y su visualización.  
 */
buscarAgregar(): void {
     this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };  
}
/*
 * Maneja el evento de cambio en el input de archivo.
 * Valida que el archivo sea de tipo TXT o CSV.
 * Muestra una notificación de alerta si el archivo no es válido.
 */
eventoDeCambioDeValor(event: Event, _controlName: string): void {
  const INPUT = event.target as HTMLInputElement;
  const FILE = INPUT.files?.[0];

  if (FILE) {
    const SELECT_TYPE = ['text/plain', 'text/csv'];
    if (!SELECT_TYPE.includes(FILE.type)) {
      this.alertaNotificacionModal = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debes seleccionar un archivo (txt o csv)',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'OK',
        txtBtnCancelar: ''
      };
      INPUT.value = ''; 
    }
  }
}

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}