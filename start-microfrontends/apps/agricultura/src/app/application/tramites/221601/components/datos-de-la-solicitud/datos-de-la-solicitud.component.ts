import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputFechaComponent, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CAPTURA_MERCANCIA, CONFIGURATION_TABLAS_MERCANCIASDELLATE, DATOS_SOLICITUD, MercanciaDellate, Mercancias, OPCIONES_DE_BOTON_DE_RADIO, PreOperativo } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';
import { Solicitud221601State, Tramite221601Store } from '../../../../estados/tramites/tramite221601.store';
import { CONFIGURATION_TABLAS_MERCANCIAS } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import realizar from '@libs/shared/theme/assets/json/221601/zoosanitario.json';

import { ModalComponent } from '../modal/modal.component';
import { ZoosanitarioService } from '../../service/zoosanitario.service';

import { INPUT_FECHA_CONFIGURACION } from '@libs/shared/data-access-user/src/core/enums/221601/fecha.enum';

import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente para la captura y gestión de datos de solicitud del trámite zoosanitario 221601.
 * 
 * Este componente maneja la información principal de la solicitud incluyendo:
 * - Datos generales de la solicitud
 * - Captura y gestión de mercancías
 * - Validación de formularios
 * - Notificaciones y alertas
 * 
 * @example
 * ```html
 * <app-datos-de-la-solicitud></app-datos-de-la-solicitud>
 * ```
 * 
 * @export
 * @class DatosDeLaSolicitudComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    AlertComponent,
    InputRadioComponent,
    ModalComponent,
    InputFechaComponent,
    NotificacionesComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss']
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  
  /**
   * Subject para manejar la destrucción de observables y evitar memory leaks
   * @private
   * @type {Subject<void>}
   * @memberof DatosDeLaSolicitudComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Opciones disponibles para el tipo de persona en formularios pre-operativos
   * @type {PreOperativo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  tipoPersonaOptions: PreOperativo[] = [];

  /**
   * Controla la visibilidad del modal de terceros
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  showtercerosModal = false;

  /**
   * Configuración para componentes de fecha
   * @type {any}
   * @memberof DatosDeLaSolicitudComponent
   */
  INPUT_FECHA_CONFIGURACION = INPUT_FECHA_CONFIGURACION;

  /**
   * Indica si el formulario está en modo solo lectura
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Catálogo de opciones para régimen
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  public regimen: Catalogo[] = realizar.regimen;

  /**
   * Catálogo de opciones para veterinario
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  public veterinario: Catalogo[] = realizar.veterinario;

  /**
   * Catálogo de opciones para establecimiento
   * @type {Catalogo[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  public establecimiento: Catalogo[] = realizar.establecimiento;

  /**
   * Estado actual de la solicitud 221601
   * @type {Solicitud221601State}
   * @memberof DatosDeLaSolicitudComponent
   */
  public solicitudState!: Solicitud221601State;

  /**
   * Formulario reactivo para los datos de la solicitud
   * @type {FormGroup}
   * @memberof DatosDeLaSolicitudComponent
   */
  datosSolicitudForm!: FormGroup;

  /**
   * Configuración para selección por checkbox en tablas
   * @type {TablaSeleccion}
   * @memberof DatosDeLaSolicitudComponent
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Texto para la sección de datos de solicitud
   * @type {string}
   * @memberof DatosDeLaSolicitudComponent
   */
  TEXTOS: string = DATOS_SOLICITUD;

  /**
   * Texto para la sección de captura de mercancía
   * @type {string}
   * @memberof DatosDeLaSolicitudComponent
   */
  MERCANCIA: string = CAPTURA_MERCANCIA;

  /**
   * Controla la visibilidad del contenido principal
   * @type {boolean}
   * @default true
   * @memberof DatosDeLaSolicitudComponent
   */
  showContent = true;

  /**
   * Lista de mercancías disponibles del archivo JSON
   * @type {Mercancias[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  mercancias: Mercancias[] = realizar.mercancias;

  /**
   * Lista de mercancías del late (detalle)
   * @type {MercanciaDellate[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  mercanciasdellate: MercanciaDellate[] = [];

  /**
   * Configuración de columnas para la tabla de mercancías
   * @type {ConfiguracionColumna<Mercancias>[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  configuracionTabla: ConfiguracionColumna<Mercancias>[] = CONFIGURATION_TABLAS_MERCANCIAS;

  /**
   * Configuración de columnas para la tabla de mercancías del late
   * @type {ConfiguracionColumna<MercanciaDellate>[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  configuracionTablaDelLate: ConfiguracionColumna<MercanciaDellate>[] = CONFIGURATION_TABLAS_MERCANCIASDELLATE;

  /**
   * Controla la visibilidad de opciones de prellenado
   * @type {boolean}
   * @default true
   * @memberof DatosDeLaSolicitudComponent
   */
  mostrarOpcionesDePrellenado: boolean = true;

  /**
   * Controla si las secciones son plegables
   * @type {boolean}
   * @default true
   * @memberof DatosDeLaSolicitudComponent
   */
  plegable: boolean = true;

  /**
   * Referencia al elemento modal para agregar mercancías
   * @type {ElementRef}
   * @memberof DatosDeLaSolicitudComponent
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Opciones disponibles para botones de radio
   * @type {any}
   * @memberof DatosDeLaSolicitudComponent
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Valor seleccionado por defecto para radio buttons
   * @type {string}
   * @default 'Productos y Subproductos'
   * @memberof DatosDeLaSolicitudComponent
   */
  valorSeleccionado: string = 'Productos y Subproductos';

  /**
   * Indica si la persona física está seleccionada
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  public fisica = false;

  /**
   * Indica si la persona moral está seleccionada
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  public moral = false;

  /**
   * Indica si se ha seleccionado una fecha futura
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  fechaFuturaSeleccionada = false;

  /**
   * Controla la visibilidad del modal de mercancía
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  showMercanciaModal = false;

  /**
   * Controla la visibilidad de la alerta de mercancía
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  public mostrarAlertaMercancia: boolean = false;

  /**
   * Controla la confirmación de la alerta de mercancía
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  public confirmacionAlertaMercancia: boolean = false;

  /**
   * Objeto de notificación para mercancía
   * @type {Notificacion}
   * @memberof DatosDeLaSolicitudComponent
   */
  public notificacionMercancia!: Notificacion;

  /**
   * Registros de mercancía seleccionados
   * @type {any[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedMercanciaRecords: any[] = [];

  /**
   * Registros de mercancía del late seleccionados
   * @type {MercanciaDellate[]}
   * @memberof DatosDeLaSolicitudComponent
   */
  public selectedMercanciaDelLateRecords: MercanciaDellate[] = [];

  /**
   * Opciones para el rango de fechas
   * @type {Array<{value: string, label: string}>}
   * @memberof DatosDeLaSolicitudComponent
   */
  opcionesRangoFecha = [
    { value: 'No', label: 'No' },
    { value: 'Si', label: 'Sí' }
  ];

  /**
   * Controla la visibilidad del rango de fechas
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  mostrarRangoFechas = false;

  /**
   * Indica si la opción "Sí" está seleccionada
   * @type {boolean}
   * @default false
   * @memberof DatosDeLaSolicitudComponent
   */
  opcionSiSeleccionada = false;

  /**
   * Formulario reactivo para la captura de mercancía
   * @type {FormGroup}
   * @memberof DatosDeLaSolicitudComponent
   */
  mercanciaForm = this.fb.group({
    paisOrigen: ['', Validators.required],
    regulacion: ['', Validators.required],
    nombreProducto: ['', [Validators.required, Validators.maxLength(50)]],
    fracciónArancelaria: ['', Validators.required],
    unidad2: ['', Validators.required],
    nico: ['', Validators.required],
    unidad1: [''], // Not required based on UI
    observaciones: [''], // Not required
    cantidadUmt: ['', Validators.required],
    umt: ['', Validators.required],
    cantidadUmc: ['', Validators.required],
    umc: ['', Validators.required],
    especie: ['', Validators.required],
    edadAnimal: ['', Validators.required],
    paisOrigen1: ['', Validators.required],
    paisdeprocedencia: ['', Validators.required],
    tipoProducto: [''],
    presentacion: [''], // Not required based on UI
    cantidadPresentacion: [''], // Not required based on UI
    tipoPresentacion: [''],
    tipoPlanta: [''],
    plantaAutorizadaOrigen: [''],
    nombreLote: [''], // Not required based on UI
    tipoPersona: ['fisica'],
    fechaElaboracion: [''],
    fechaProduccion: [''],
    fechaCaducidad: [''],
    tipoEspecie: [''],
    fecha: [''],
    numeroLote: [''],
    rangoFecha: ['No'],
    fechaDesde: [''],
    fechaHasta: [''],
    FechadeCaducidad: [''],
    FechadelCaducidad: [''],
    FechadeSacrificio: [''],
    FechadelSacrificio: ['']
  });

  /**
   * Constructor del componente
   * 
   * @param {FormBuilder} fb - Constructor de formularios reactivos
   * @param {Tramite221601Store} tramite221601Store - Store para el trámite 221601
   * @param {Tramite221601Query} tramite221601Query - Query para el trámite 221601
   * @param {ConsultaioQuery} consultaioQuery - Query para consultas
   * @param {ValidacionesFormularioService} validacionesService - Servicio de validaciones
   * @param {ZoosanitarioService} service - Servicio zoosanitario
   * @memberof DatosDeLaSolicitudComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite221601Store: Tramite221601Store,
    private tramite221601Query: Tramite221601Query,
    private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService, 
    private service: ZoosanitarioService 
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarCombinacionFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Alterna la visibilidad del contenido principal
   * 
   * @public
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  public toggleContent(): void {
    this.showContent = !this.showContent;
  }

  /**
   * Controla la visibilidad de las secciones colapsables
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  mostrarColapsable(): void {
    this.plegable = !this.plegable;
  }

  /**
   * Método de inicialización del componente
   * Configura el formulario y carga las opciones de radio
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  ngOnInit(): void {
    this.inicializarCombinacionFormulario();
    this.cargarRadio();
  }

  /**
   * Método de destrucción del componente
   * Limpia las suscripciones para evitar memory leaks
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa la combinación de formularios según el estado de solo lectura
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  inicializarCombinacionFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.inicializarFormulario()
    }  
  }

  /**
   * Inicializa el formulario principal con los datos del estado
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  inicializarFormulario(): void {
    this.tramite221601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud221601State;
        })
      )
      .subscribe();

    this.datosSolicitudForm = this.fb.group({
      justificacion: [this.solicitudState.justificacion, Validators.required],
      aduana: [this.solicitudState.aduana],
      oficina: [this.solicitudState.oficina],
      punto: [this.solicitudState.punto],
      guia: [this.solicitudState.guia,[Validators.maxLength(50)]],
      clave: [this.solicitudState.clave,[Validators.required, Validators.maxLength(15)]],
      establecimiento: [this.solicitudState.establecimiento, Validators.required],
      regimen: [this.solicitudState.regimen, Validators.required],
      veterinario: [this.solicitudState.veterinario, Validators.required, Validators.maxLength(50)],
      capturaMercancia: [this.solicitudState.capturaMercancia, Validators.required]
    });

    this.datosSolicitudForm.get('punto')?.disable();
    this.datosSolicitudForm.get('aduana')?.disable();
    this.datosSolicitudForm.get('oficina')?.disable();
    this.datosSolicitudForm.get('aduana')?.setValue(realizar.formData.aduana);
    this.datosSolicitudForm.get('oficina')?.setValue(realizar.formData.oficina);
    this.datosSolicitudForm.get('punto')?.setValue(realizar.formData.punto);
    this.datosSolicitudForm.get('capturaMercancia')?.setValue(this.valorSeleccionado);
    this.updateStoreWithFormData();
  }

  /**
   * Guarda los datos del formulario y maneja el estado de solo lectura
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosSolicitudForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosSolicitudForm.enable();
    }
  }

  /**
   * Carga las opciones de radio button desde el servicio
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cargarRadio(): void {
    this.service.obtenerRadiooption()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }

  /**
   * Actualiza el store con los datos del formulario
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  updateStoreWithFormData(): void {
    const UPDATED_FORM_DATA: Solicitud221601State = {
      ...this.solicitudState,
      aduana: this.datosSolicitudForm.get('aduana')?.value,
      oficina: this.datosSolicitudForm.get('oficina')?.value,
      punto: this.datosSolicitudForm.get('punto')?.value,     
      capturaMercancia: this.datosSolicitudForm.get('capturaMercancia')?.value,   
    };
    this.tramite221601Store.update(UPDATED_FORM_DATA);
  }

  /**
   * Maneja la selección de checkboxes para tipo de persona
   * 
   * @param {string} checkBoxName - Nombre del checkbox seleccionado
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  public inputChecked(checkBoxName: string): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
    } else {
      this.fisica = false;
      this.moral = true;
    }
  }

  /**
   * Cambia el valor del radio button para persona física
   * 
   * @param {string | number} value - Valor seleccionado
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cambiarRadioFisica(value: string | number): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO);
  }

  /**
   * Establece valores en el store usando métodos dinámicos
   * 
   * @param {FormGroup} form - Formulario de origen
   * @param {string} campo - Campo a actualizar
   * @param {keyof Tramite221601Store} metodoNombre - Método del store a ejecutar
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite221601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite221601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Maneja el cambio de fecha final con validación de fechas futuras
   * 
   * @param {string} nuevoValor - Nueva fecha seleccionada
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cambioFechaFinal(nuevoValor: string): void {
    this.mercanciaForm.patchValue({
      fechaCaducidad: nuevoValor
    });
    this.tramite221601Store.setFecha(nuevoValor);

    let seleccionada: Date | null = null;
    if (nuevoValor && nuevoValor.includes('/')) {
      const [DAY, MONTH, YEAR] = nuevoValor.split('/').map(Number);
      seleccionada = new Date(YEAR, MONTH - 1, DAY);
    } else {
      seleccionada = new Date(nuevoValor); 
    }

    const HOY = new Date();
    HOY.setHours(0, 0, 0, 0);

    if (seleccionada && seleccionada > HOY) {
      this.fechaFuturaSeleccionada = true;
      this.mercanciaForm.get('fechaCaducidad')?.setErrors({ futureDate: true });
    } else {
      this.fechaFuturaSeleccionada = false;
      this.mercanciaForm.get('fechaCaducidad')?.setErrors(null);
    }
  }

  /**
   * Abre el diálogo modal para agregar mercancías
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  abrirDialogoMercancias(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Cambia el valor de un radio button específico
   * 
   * @param {string} nombreControl - Nombre del control a cambiar
   * @param {string} valor - Nuevo valor
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cambioValorRadio(nombreControl: string, valor: string): void {
    this.datosSolicitudForm.patchValue({
      [nombreControl]: valor,
    });
    this.valorSeleccionado = valor;
  }

  /**
   * Cancela la operación del modal de destinatarios
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cancelarDestinatario(): void {
    this.showtercerosModal = !this.showtercerosModal;
  }

  /**
   * Abre el modal para agregar terceros
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  tercerosAgregar(): void {
    this.showtercerosModal = !this.showtercerosModal;
  }

  /**
   * Cierra el modal y resetea el formulario de mercancía
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cerrarModal(): void {
    this.showtercerosModal = false;
    this.resetMercanciaForm();
  }

  /**
   * Maneja el cambio de selección en la tabla de mercancías
   * 
   * @param {Mercancias[]} selectedItems - Items seleccionados
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  onMercanciaSelectionChange(selectedItems: Mercancias[]): void {
    this.selectedMercanciaRecords = selectedItems;
  }

  /**
   * Maneja el cambio de selección en la tabla de mercancías del late
   * 
   * @param {MercanciaDellate[]} selectedItems - Items seleccionados
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  onMercanciaDelLateSelectionChange(selectedItems: MercanciaDellate[]): void {
    this.selectedMercanciaDelLateRecords = selectedItems;
  }

  /**
   * Elimina los detalles de mercancía seleccionados
   * Muestra confirmación antes de proceder
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  eliminarDetalle(): void {
    if (!this.selectedMercanciaDelLateRecords || this.selectedMercanciaDelLateRecords.length === 0) {
      this.mostrarNotificacionMercancia(
        'Selecciona un registro.',
        false
      );
      return;
    }

    this.mostrarNotificacionMercancia(
      '¿Estás seguro que deseas eliminar los registros marcados?',
      true
    );
  }

  /**
   * Realiza la eliminación física de las mercancías seleccionadas
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  private realizarEliminacionMercancia(): void {
    this.mercanciasdellate = this.mercanciasdellate.filter(record => 
      !this.selectedMercanciaDelLateRecords.includes(record)
    );
    
    this.selectedMercanciaDelLateRecords = [];
  }

  /**
   * Muestra una notificación relacionada con mercancías
   * 
   * @private
   * @param {string} mensaje - Mensaje a mostrar
   * @param {boolean} [mostrarCancelar=false] - Si mostrar botón cancelar
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  private mostrarNotificacionMercancia(mensaje: string, mostrarCancelar: boolean = false): void {
    this.notificacionMercancia = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: mostrarCancelar ? 'Cancelar' : '',
    };
    
    if (mostrarCancelar) {
      this.confirmacionAlertaMercancia = true;
    } else {
      this.mostrarAlertaMercancia = true;
    }
  }

  /**
   * Maneja la confirmación de notificaciones de mercancía
   * 
   * @param {boolean} confirmar - Si el usuario confirmó la acción
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  onConfirmacionMercancia(confirmar: boolean): void {
    this.confirmacionAlertaMercancia = false;
    
    if (confirmar) {
      this.realizarEliminacionMercancia();
    }
  }

  /**
   * Maneja el cierre de alertas de mercancía
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  onAlertaMercancia() : void {
    this.mostrarAlertaMercancia = false;
  }

  /**
   * Guarda una nueva mercancía en la lista
   * Valida los datos y muestra notificaciones correspondientes
   * 
   * @param {Event} [event] - Evento del formulario (opcional)
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  guardarMercancia(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const GET_VALUE = (control: string, fallback: string) =>
      this.mercanciaForm.get(control)?.value || fallback;

    const GET_DISPLAY_FIELDS = () => ({
      numeroLote: GET_VALUE('numeroLote', `AUTO-${Date.now()}`),
      fechaElaboracion: GET_VALUE('fechaElaboracion', '10/09/2025'),
      fechaProduccion: GET_VALUE('fechaProduccion', '11/09/2025'),
      fechaCaducidad: GET_VALUE('fechaCaducidad', '18/09/2025'),
      fechaFinElaboracion: GET_VALUE('fechaHasta', ''),
      fechaFinProduccion: GET_VALUE('FechadelSacrificio', ''),
      fechaFinCaducidad: GET_VALUE('FechadelCaducidad', ''),
    });

    const GET_INTERFACE_FIELDS = () => ({
      noPartida: GET_VALUE('numeroLote', `AUTO-${Date.now()}`),
      fechaDesde: GET_VALUE('fechaDesde', '10/09/2025'),
      FechadeSacrificio: GET_VALUE('FechadeSacrificio', '11/09/2025'),
      FechadeCaducidad: GET_VALUE('FechadeCaducidad', '18/09/2025'),
      FechadefinElaboracion: GET_VALUE('fechaHasta', '12/09/2025'),
      FechafindeSacrificio: GET_VALUE('FechadelSacrificio', '14/09/2025'),
      FechafindeCaducidad: GET_VALUE('FechadelCaducidad', '20/09/2025'),
    });

    const GET_FORM_FIELDS = () => ({
      paisOrigen: GET_VALUE('paisOrigen', 'Default Country'),
      regulacion: GET_VALUE('regulacion', 'Default Regulation'),
      nombreProducto: GET_VALUE('nombreProducto', 'Default Product'),
      fraccionArancelaria: GET_VALUE('fracciónArancelaria', 'Default Fraction'),
      nico: GET_VALUE('nico', 'Default NICO'),
      especie: GET_VALUE('especie', 'Default Species'),
      uso: GET_VALUE('edadAnimal', 'Default Use'),
      paisOrigenDetalle: GET_VALUE('paisOrigen1', 'Default Origin'),
      paisProcedencia: GET_VALUE('paisdeprocedencia', 'Default Procedure'),
    });

    const NUEVA_MERCANCIA: MercanciaDellate = {
      ...GET_DISPLAY_FIELDS(),
      ...GET_INTERFACE_FIELDS(),
      ...GET_FORM_FIELDS(),
    };

    try {
      this.mercanciasdellate = [...this.mercanciasdellate, NUEVA_MERCANCIA];
      this.resetMercanciaForm();
      
      this.mostrarNotificacionMercancia(
        'Detalle agregado correctamente.',
        false
      );
    } catch (error) {
      console.error('Error al agregar mercancía:', error);
      this.mostrarNotificacionMercancia(
        'Error al agregar el detalle. Por favor, intenta nuevamente.',
        false
      );
    }
  }

  /**
   * Limpia todos los registros de mercancías
   * 
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  clearAllRecords(): void {
    this.mercanciasdellate = [];
  }

  /**
   * Resetea el formulario de mercancía a sus valores por defecto
   * 
   * @private
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  private resetMercanciaForm(): void {
    this.mercanciaForm.reset();
    this.mercanciaForm.patchValue({
      rangoFecha: 'No',
      tipoPersona: 'fisica'
    });
    
    this.mostrarRangoFechas = false;
    this.opcionSiSeleccionada = false;
  }

  /**
   * Cambia la opción del rango de fechas y actualiza la UI
   * 
   * @param {string} valor - Valor seleccionado ('Si' o 'No')
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  cambiarOpcionRangoFecha(valor: string): void {
    this.mercanciaForm.patchValue({
      rangoFecha: valor
    });
    
    if (valor === 'No') {
      this.mostrarRangoFechas = true;
      this.opcionSiSeleccionada = false;
    } else if (valor === 'Si') {
      this.mostrarRangoFechas = false;
      this.opcionSiSeleccionada = true;
    }
  }

  // Métodos para manejo de fechas específicas

  /**
   * Maneja el cambio de fecha desde
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechaDesde(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ fechaDesde: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha hasta
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechaHasta(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ fechaHasta: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha de sacrificio
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechadeSacrificio(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ FechadeSacrificio: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha del sacrificio
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechadelSacrificio(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ FechadelSacrificio: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha de caducidad
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechadeCaducidad(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ FechadeCaducidad: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha de la caducidad
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechadelCaducidad(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ FechadelCaducidad: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha de elaboración
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechaElaboracion(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ fechaElaboracion: nuevoValor });
  }

  /**
   * Maneja el cambio de fecha de producción
   * @param {string} nuevoValor - Nueva fecha
   * @returns {void}
   */
  cambioFechaProduccion(nuevoValor: string): void {
    this.mercanciaForm.patchValue({ fechaProduccion: nuevoValor });
  }
}