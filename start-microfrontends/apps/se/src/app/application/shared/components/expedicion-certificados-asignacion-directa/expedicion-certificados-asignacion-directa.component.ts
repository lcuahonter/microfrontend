import { BuscarAsignacionResponse, BuscarAsignacionResponseItem, CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA, ExpedirMonto, StateExpedicionAsignacion, StoreValues } from '../../models/expedicion-asignacion.model';
import { Catalogo, CatalogoSelectComponent, FECHA_FINAL_VIGENCIA, FECHA_FINAL_VIGENCIA_DEL_CUPO, FECHA_INICIO_VIGENCIA, FECHA_INICIO_VIGENCIA_DEL_CUPO, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, REGEX_ALTO, REGEX_NUMEROS, REGEX_SOLO_NUMEROS, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService, formatearFechaDdMmYyyy } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ExpedicionCertificadosAsignacionService } from '../../services/expedicion-certificados-asignacio.service';

/**
 * Componente para la expedición de certificados de asignación directa.
 */
@Component({
  selector: 'app-expedicion-certificados-asignacion-directa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputFechaComponent,
    NotificacionesComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './expedicion-certificados-asignacion-directa.component.html',
  styleUrl: './expedicion-certificados-asignacion-directa.component.scss',
})

export class ExpedicionCertificadosAsignacionDirectaComponent implements OnInit, OnDestroy {
  /**
   * Formulario para la expedición de certificados de asignación.
   */
  expedicionCertificadosAsignacionForm!: FormGroup;

  /**
   * Emisor de eventos para actualizar la tienda con los valores del formulario.
   * @type {EventEmitter<StoreValues>}
   */
  @Output() updateStore = new EventEmitter<StoreValues>();

  /**
   * Catálogo de años de autorización.
   */
  autorizacion!: Catalogo[];

  /**
   * Mostrar detalle de la tabla.
   */
  mostrarDetalle: boolean = false;

  /**
   * Configuración para el encabezado de la tabla de expedición de monto.
   */
  configuracionParaEncabezadoDeTabla = CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA;

  /**
   * Configuración de la tabla dinámica.
   */
  cuerpoTabla: ExpedirMonto[] = [];

  /**
   * Configuración de la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Fecha inicio de entrada.
   */
  fechaInicioInput: InputFecha = FECHA_INICIO_VIGENCIA;

  /**
   * Fecha final de entrada.
   */
  fechaFinVigenciaAprobadaInput: InputFecha = FECHA_FINAL_VIGENCIA;

  /**
   * Fecha de inicio de vigencia del cupo.
   */
  fechaInicioVigenciaInput: InputFecha = FECHA_INICIO_VIGENCIA_DEL_CUPO;

  /**
   * Fecha final de vigencia del cupo.
   */
  fechaFinVigenciaInput: InputFecha = FECHA_FINAL_VIGENCIA_DEL_CUPO;

  /**
   * Montos seleccionados en la tabla de expedición de monto.
   * @type {ExpedirMonto[]}
   */
  public selectedMonto: ExpedirMonto[] = [];

  /**
   * Emisor de eventos para mostrar errores.
   * @type {EventEmitter<boolean>}
   * @description Emite un valor booleano para indicar si se debe mostrar un error.
   */
  @Output() mostrarError: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Indica si se debe mostrar el detalle de la consulta.
   * @type {boolean}
   */
  @Input() mostrarDetalleConsulta!: boolean;

  /**
   * Emisor de eventos para mostrar errores en el número de folio de asignación.
   * @type {EventEmitter<{mostrarError: boolean, valor: string}>}
   * @description Emite un valor booleano para indicar si se debe mostrar un error en el número de folio de asignación.
   */
  @Output() mostrarNumFolioAsignacionError: EventEmitter<{ mostrarError: boolean, valor: string }> = new EventEmitter<{ mostrarError: boolean, valor: string }>();

  /**
  * Identificador del procedimiento asociado al componente.
  *
  * @type {number}
  * @remarks
  * Este identificador se utiliza para enlazar el componente con un procedimiento específico.
  */
  @Input() idProcedimiento!: number;
  /**
   * Emisor de eventos para mostrar errores al agregar.
   * @type {EventEmitter<boolean>}
   * @description Emite un valor booleano para indicar si se debe mostrar un error al agregar.
   */
  @Output() mostrarAgregarError: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property {boolean} invalidoFolioAsignacion
   * @description Indica si el número de folio de asignación es inválido.
   */
  invalidoFolioAsignacion: boolean = false;

  /**
   * Estado de la expedición de certificados de asignación.
   */
  @Input() expedicionCertificadoAsignacionState!: StateExpedicionAsignacion;
  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si la tabla de montos a expedir es inválida.
   * @type {boolean}
   */
  tablaInvalidoError!: boolean;

  /** Indica si se debe mostrar el error de total a expedir.
   * @type {boolean}
   */
  mostrarTotalExpedirMonto: boolean = false;
  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();
  /**
 * Evento que se emite cuando se selecciona un país de destino
 * @type {EventEmitter<Catalogo>}
 */
  @Output() anoSeleccionEvent: EventEmitter<Catalogo> =
    new EventEmitter<Catalogo>();

  /**
   * Años de autorización disponibles.
   * @type {Catalogo[]}
   */
  @Input() anoAutorizacion!: Catalogo[];
  /**
   * Propiedad de salida que emite el valor del formulario cuando se actualiza.
   * @type {EventEmitter<undefined>}
   */
  @Output() formExpedicionEvent: EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: number | undefined;
    storeStateName: string;
  }> = new EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: number | undefined;
    storeStateName: string;
  }>();

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite120202Store - Store para gestionar el estado de la aplicación.
   * @param tramite120202Query - Query para consultar el estado de la aplicación.
   * @param consultaioQuery - Query para consultar el estado de la consulta.
   * @param expedicionCertificadosAsignacionService - Servicio para gestionar la expedición de certificados de asignación.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private expedicionCertificadosAsignacionService: ExpedicionCertificadosAsignacionService,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    // Inicializar el formulario principal
  }

  sendAllValues(): void {
    const DISTRIBUCION_VALUES = this.distribucionSaldoForm.getRawValue();
    const ASIGNACION_VALUES = this.asignacionOficioNumeroForm.getRawValue();
    const ASIGNACION_DATOS_FORM = this.asignacionDatosForm.getRawValue();

    const STORE_DATA: StoreValues = {
      ...DISTRIBUCION_VALUES,
      ...ASIGNACION_VALUES,
      ...ASIGNACION_DATOS_FORM,
      cuerpoTabla: this.cuerpoTabla,
      mostrarDetalle: this.mostrarDetalle,

    };

    this.updateStore.emit(STORE_DATA);
  }
  /**
 * Método del ciclo de vida ngOnInit. Se ejecuta al inicializar el componente.
 *
 * @remarks
 * Este método se utiliza para inicializar el estado del componente y realizar configuraciones iniciales.
 */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.crearExpedicionCertificadosAsignacionForm();

    if (this.expedicionCertificadoAsignacionState) {
      this.mostrarDetalle = this.expedicionCertificadoAsignacionState.mostrarDetalle || false;
      this.cuerpoTabla = this.expedicionCertificadoAsignacionState.cuerpoTabla || [];
    }
    this.aniosAutorizacionSeleccion();
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario `expedicionCertificadosAsignacionForm` basado en si el formulario está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilita el campo `expedicionCertificadosAsignacionForm`.
   * Si no está deshabilitado, se habilita el campo `expedicionCertificadosAsignacionForm`.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.expedicionCertificadosAsignacionForm?.disable();
    }
  }

  /**
   * Crea el formulario para la expedición de certificados de asignación.
   */
  crearExpedicionCertificadosAsignacionForm(): void {
    this.expedicionCertificadosAsignacionForm = this.fb.group({
      asignacionOficioNumeroForm: this.fb.group({
        cveAniosAutorizacion: [
          this.expedicionCertificadoAsignacionState?.asignacionOficioNumeroForm?.cveAniosAutorizacion,
          [Validators.required]
        ],
        numFolioAsignacionAux: [
          this.expedicionCertificadoAsignacionState?.asignacionOficioNumeroForm?.numFolioAsignacionAux,
          [
            Validators.required,
            Validators.pattern(REGEX_SOLO_NUMEROS)
          ]
        ]
      }),
      representacionFederalForm: this.fb.group({
        estado: [
          { value: this.expedicionCertificadoAsignacionState?.representacionFederalForm?.estado, disabled: true }
        ],
        representacionFederal: [
          { value: this.expedicionCertificadoAsignacionState?.representacionFederalForm?.representacionFederal, disabled: true }
        ]
      }),
      controlMontosAsignacionForm: this.fb.group({
        sumaAprobada: [
          { value: this.expedicionCertificadoAsignacionState?.controlMontosAsignacionForm?.sumaAprobada, disabled: true }
        ],
        sumaExpedida: [
          { value: this.expedicionCertificadoAsignacionState?.controlMontosAsignacionForm?.sumaExpedida, disabled: true }
        ],
        montoDisponible: [
          { value: this.expedicionCertificadoAsignacionState?.controlMontosAsignacionForm?.montoDisponible, disabled: true }
        ]
      }),
      asignacionDatosForm: this.fb.group({
        numOficio: [
          { value: this.expedicionCertificadoAsignacionState?.asignacionDatosForm?.numOficio, disabled: true }
        ],
        fechaInicio: [
          { value: this.expedicionCertificadoAsignacionState?.asignacionDatosForm?.fechaInicio, disabled: true }
        ],
        fechaFinVigenciaAprobada: [
          { value: this.expedicionCertificadoAsignacionState?.asignacionDatosForm?.fechaFinVigenciaAprobada, disabled: true }
        ]
      }),
      cupoDescripcionForm: this.fb.group({
        regimenAduanero: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.regimenAduanero, disabled: true }
        ],
        descripcionProducto: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.descripcionProducto, disabled: true }
        ],
        clasificaionSubproducto: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.clasificaionSubproducto, disabled: true }
        ],
        unidadMedidaOficialCupo: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.unidadMedidaOficialCupo, disabled: true }
        ],
        fechaInicioVigencia: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.fechaInicioVigencia, disabled: true }
        ],
        fechaFinVigencia: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.fechaFinVigencia, disabled: true }
        ],
        mecanismoAsignacion: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.mecanismoAsignacion, disabled: true }
        ],
        tratado: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.tratado, disabled: true }
        ],
        fraccionesArancelarias: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.fraccionesArancelarias, disabled: true }
        ],
        paisesCupo: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.paisesCupo, disabled: true }
        ],
        observaciones: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.observaciones, disabled: true }
        ],
        descripcionFundamento: [
          { value: this.expedicionCertificadoAsignacionState?.cupoDescripcionForm?.descripcionFundamento, disabled: true }
        ]
      }),
      distribucionSaldoForm: this.fb.group({
        montoDisponibleAsignacion: [
          { value: this.expedicionCertificadoAsignacionState?.montoDisponibleAsignacion, disabled: true }
        ],
        montoExpedir: [
          this.expedicionCertificadoAsignacionState?.distribucionSaldoForm?.montoExpedir,
          [
            Validators.required,
            Validators.pattern(REGEX_ALTO)
          ]
        ],
        totalExpedir: [
          { value: this.expedicionCertificadoAsignacionState?.distribucionSaldoForm?.totalExpedir, disabled: true }
        ]
      })
    });

    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    this.expedicionCertificadosAsignacionService.getAniosAutorizacionCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.autorizacion = data as Catalogo[];
    });
  }

  /**
   * Método para obtener el formulario de asignación de oficio y número.
   * @returns {FormGroup} - El formulario de asignación de oficio y número.
   */
  get asignacionOficioNumeroForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('asignacionOficioNumeroForm') as FormGroup;
  }

  /**
   * Método para obtener el formulario de representación federal.
   * @returns {FormGroup} - El formulario de representación federal.
   */
  get representacionFederalForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('representacionFederalForm') as FormGroup;
  }

  /**
   * Método para obtener el formulario de control de montos de asignación.
   * @returns {FormGroup} - El formulario de control de montos de asignación.
   */
  get controlMontosAsignacionForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('controlMontosAsignacionForm') as FormGroup;
  }

  /**
   * Método para obtener el formulario de asignación de datos.
   * @returns {FormGroup} - El formulario de asignación de datos.
   */
  get asignacionDatosForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('asignacionDatosForm') as FormGroup;
  }

  /**
   * Método para obtener el formulario de cupo y descripción.
   * @returns {FormGroup} - El formulario de cupo y descripción.
   */
  get cupoDescripcionForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('cupoDescripcionForm') as FormGroup;
  }

  /**
   * Método para obtener el formulario de distribución de saldo.
   * @returns {FormGroup} - El formulario de distribución de saldo.
   */
  get distribucionSaldoForm(): FormGroup {
    return this.expedicionCertificadosAsignacionForm.get('distribucionSaldoForm') as FormGroup;
  }

  /**
   * Anteriormente se llamaba `aniosAutorizacionSeleccion`.
   * Este método se encarga de establecer el año de autorización seleccionado en el store.
   * @returns {void}
   */
  aniosAutorizacionSeleccion(): void {
    // const ANIOS_AUTORIZACION = this.asignacionOficioNumeroForm.get('cveAniosAutorizacion')?.value;
    this.sendAllValues()
    // this.tramite120202Store.setAniosAutorizacion(ANIOS_AUTORIZACION);
  }

  /**
   * Maneja la selección de un país de destino
   * @param {Catalogo} estado - El país de destino seleccionado
   */
  anoSeleccion(estado: Catalogo): void {
    this.anoSeleccionEvent.emit(estado);
  }

  /**
   * Método para cambiar la fecha inicio de la asignación.
   * @param nuevo_valor Nuevo valor de la fecha de inicio de la asignación.
   * @returns {void}
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.asignacionDatosForm.patchValue({
      fechaInicio: new Date(nuevo_valor),
    });
    this.sendAllValues();
    // this.tramite120202Store.setFechaInicio(nuevo_valor);
  }

  /**
   * Método para cambiar la fecha de fin de vigencia aprobada.
   * @param nuevo_valor Nuevo valor de la fecha de fin de vigencia aprobada.
   * @returns {void}
   */
  cambioFechaFinVigenciaAprobada(nuevo_valor: string): void {
    this.asignacionDatosForm.patchValue({
      fechaFinVigenciaAprobada: new Date(nuevo_valor),
    });
    this.sendAllValues();
    // this.tramite120202Store.setFechaFinVigenciaAprobada(nuevo_valor);
  }

  /**
   * Método para cambiar la fecha de inicio de vigencia del cupo.
   * @param nuevo_valor Nuevo valor de la fecha de inicio de vigencia del cupo.
   * @returns {void}
   */
  cambioFechaInicioVigencia(nuevo_valor: string): void {
    this.cupoDescripcionForm.patchValue({
      fechaInicioVigencia: new Date(nuevo_valor),
    });
    this.sendAllValues()
    // this.tramite120202Store.setFechaInicioVigencia(nuevo_valor);
  }

  /**
   * Método para cambiar la fecha de fin de vigencia del cupo.
   * @param nuevo_valor Nuevo valor de la fecha de fin de vigencia del cupo.
   * @returns {void}
   */
  cambioFechaFinVigencia(nuevo_valor: string): void {
    this.cupoDescripcionForm.patchValue({
      fechaFinVigencia: new Date(nuevo_valor),
    });
    this.sendAllValues()
    // this.tramite120202Store.setFechaFinVigencia(nuevo_valor);
  }

  /**
   * Método para establecer el valor de alternancia en la tabla de montos a expedir.
   * @param row - Fila seleccionada de la tabla de montos a expedir.
   * @description Este método se utiliza para establecer el valor de alternancia en la tabla de montos a expedir.
   */
  valorDeAlternancia(row: ExpedirMonto[]): void {
    this.selectedMonto = row;
  }

  /**
   * Método para buscar el número de oficio de asignación.
   * @returns {void}
   */
  buscar(cveAniosAutorizacion: string, numFolioAsignacionAux: string): void {
    const ES_FOLIO_VACIO = !numFolioAsignacionAux || numFolioAsignacionAux.trim().length === 0;
    const ES_ANIO_VACIO = !cveAniosAutorizacion;
    const REGEX = new RegExp(REGEX_NUMEROS);

    const PAYLOAD = {
      "anioAutorizacion": this.asignacionOficioNumeroForm.get('cveAniosAutorizacion')?.value,
      "numFolioAsignacion": this.asignacionOficioNumeroForm.get('numFolioAsignacionAux')?.value,
      "rfcSolicitante": "AAL0409235E6"
    }

    if (ES_ANIO_VACIO || ES_FOLIO_VACIO) {
      this.invalidoFolioAsignacion = false;
      this.mostrarDetalle = false;
      this.sendAllValues()
      this.mostrarNumFolioAsignacionError.emit({ mostrarError: false, valor: '' });
      this.mostrarError.emit(true);
      this.asignacionOficioNumeroForm.markAllAsTouched();
      return;
    }

    if (REGEX.test(numFolioAsignacionAux)) {
      this.invalidoFolioAsignacion = true;
      this.mostrarDetalle = false;
      this.sendAllValues()
      this.asignacionOficioNumeroForm?.get('numFolioAsignacionAux')?.markAsTouched();
      this.mostrarError.emit(false);
      this.mostrarNumFolioAsignacionError.emit({ mostrarError: true, valor: numFolioAsignacionAux });
      return;
    }

    this.invalidoFolioAsignacion = false;
    this.mostrarError.emit(false);
    this.mostrarNumFolioAsignacionError.emit({ mostrarError: false, valor: '' });
    this.asignacionOficioNumeroForm.reset({ cveAniosAutorizacion: null, numFolioAsignacionAux: '' });
    this.expedicionCertificadosAsignacionService.buscarAsignacion(this.idProcedimiento.toString(), PAYLOAD)
      .pipe(
        takeUntil(this.destruirNotificador$),
        map(resp => resp as unknown as BuscarAsignacionResponse)
      )
      .subscribe((resp: BuscarAsignacionResponse) => {
        const DATOS = resp.datos[0];
        if (DATOS) {
          this.representacionFederalForm.patchValue({
            estado: DATOS.mecanismoAsignacion?.entitadNombre ?? '',
            representacionFederal: DATOS.unidadAdministrativaRepresentacionFederal?.nombre
          });
          this.controlMontosAsignacionForm.patchValue({
            sumaAprobada: DATOS.asignacion?.impTotalAprobado,
            sumaExpedida: DATOS.asignacion?.impTotalExpedido,
            montoDisponible: DATOS.asignacion?.montoDisponible
          });
          this.asignacionDatosForm.patchValue({
            numOficio: DATOS.asignacion?.numFolioAsignacion,
            fechaInicio: formatearFechaDdMmYyyy(DATOS.asignacion?.fechaInicioVigencia ?? ''),
            fechaFinVigenciaAprobada: formatearFechaDdMmYyyy(DATOS.asignacion?.fechaFinVigenciaAprobada ?? '')
          });
          this.cupoDescripcionForm.patchValue({
            regimenAduanero: DATOS.mecanismoAsignacion?.regimen,
            descripcionProducto: DATOS.mecanismoAsignacion?.nombreProducto ?? null,
            clasificaionSubproducto: DATOS.mecanismoAsignacion?.descClasificacionProducto,
            unidadMedidaOficialCupo: DATOS.mecanismoAsignacion?.unidadMedidaDescripcion ?? null,
            fechaInicioVigencia: formatearFechaDdMmYyyy(DATOS.mecanismoAsignacion?.fechaInicioVigencia ?? '') ?? null,
            fechaFinVigencia: formatearFechaDdMmYyyy(DATOS.mecanismoAsignacion?.fechaFinVigencia ?? '') ?? null,
            mecanismoAsignacion: DATOS.mecanismoAsignacion?.nombreMecanismoAsignacion ?? null,
            tratado: DATOS.mecanismoAsignacion?.nombreTratado ?? null,
            fraccionesArancelarias: [...(DATOS.fraccionArancelaria ?? [])],
            paisesCupo: DATOS.mecanismoAsignacion?.paisesCupo?.map(({ pais }: { pais: { nombre: string } }) => pais.nombre) ?? [],
            observaciones: DATOS.mecanismoAsignacion?.observaciones ?? null,
            descripcionFundamento: DATOS.mecanismoAsignacion?.descripcionFundamento ?? null,
          });
          this.distribucionSaldoForm.patchValue({
            montoDisponibleAsignacion: DATOS.asignacion?.montoDisponible
          });
          this.mostrarDetalle = true;
          this.sendAllValues();
          this.setEstablecerDatosCampo(DATOS);
        }
        else {
          this.mostrarDetalle = false;
          this.sendAllValues();
        }
      });
  }

  /**
   * Método para establecer los datos en el campo del formulario y en el store.
   * @returns {void}
   */
  setEstablecerDatosCampo(datos: BuscarAsignacionResponseItem): void {
    this.setValoresStore('representacionFederalForm', 'estado', 'setEstado');
    this.setValoresStore('representacionFederalForm', 'representacionFederal', 'setRepresentacionFederal');

    this.setValoresStore('controlMontosAsignacionForm', 'sumaAprobada', 'setSumaAprobada');
    this.setValoresStore('controlMontosAsignacionForm', 'sumaExpedida', 'setSumaExpedida');
    this.setValoresStore('controlMontosAsignacionForm', 'montoDisponible', 'setMontoDisponible');

    this.setValoresStore('asignacionDatosForm', 'numOficio', 'setNumOficio');
    this.setValoresStore('asignacionDatosForm', 'fechaInicio', 'setFechaInicio');
    this.setValoresStore('asignacionDatosForm', 'fechaFinVigenciaAprobada', 'setFechaFinVigenciaAprobada');
    if (datos?.asignacion?.idAsignacion || datos?.asignacion?.idAsignacion) {
      this.formExpedicionEvent.emit({
        formGroupName: 'asignacionDatosForm',
        campo: 'idAsignacion',
        valor: datos.asignacion?.idAsignacion,
        storeStateName: 'asignacionDatosForm'
      });
    }
    if (datos?.asignacion?.idMecanismoAsignacion) {
      this.formExpedicionEvent.emit({
        formGroupName: 'asignacionDatosForm',
        campo: 'idMecanismoAsignacion',
        valor: datos.asignacion?.idMecanismoAsignacion,
        storeStateName: 'asignacionDatosForm'
      });
    }
    this.setValoresStore('cupoDescripcionForm', 'regimenAduanero', 'setRegimenAduanero');
    this.setValoresStore('cupoDescripcionForm', 'descripcionProducto', 'setDescripcionProducto');
    this.setValoresStore('cupoDescripcionForm', 'clasificaionSubproducto', 'setClasificaionSubproducto');
    this.setValoresStore('cupoDescripcionForm', 'unidadMedidaOficialCupo', 'setUnidadMedidaOficialCupo');
    this.setValoresStore('cupoDescripcionForm', 'fechaInicioVigencia', 'setFechaInicioVigencia');
    this.setValoresStore('cupoDescripcionForm', 'fechaFinVigencia', 'setFechaFinVigencia');
    this.setValoresStore('cupoDescripcionForm', 'mecanismoAsignacion', 'setMecanismoAsignacion');
    this.setValoresStore('cupoDescripcionForm', 'tratado', 'setTratado');
    this.setValoresStore('cupoDescripcionForm', 'fraccionesArancelarias', 'setFraccionesArancelarias');
    this.setValoresStore('cupoDescripcionForm', 'paisesCupo', 'setPaisesCupo');
    this.setValoresStore('cupoDescripcionForm', 'observaciones', 'setObservaciones');
    this.setValoresStore('cupoDescripcionForm', 'descripcionFundamento', 'setDescripcionFundamento');
    this.setValoresStore('distribucionSaldoForm', 'totalExpedir', 'setTotalExpedir');
    this.setValoresStore('distribucionSaldoForm', 'montoDisponibleAsignacion', 'setMontoDisponibleAsignacion');
  }

  /**
   * Método para agregar un nuevo monto a la tabla.
   * @param valor - El valor a agregar.
   */
  agregar(valor: string): void {
    const REGEX = new RegExp(REGEX_ALTO);
    if (valor.length <= 0 || !REGEX.test(valor)) {
      this.mostrarAgregarError.emit(true);
    } else {
      this.mostrarAgregarError.emit(false);

      const MONTO_EXPEDIR_VALOR = parseInt(valor, 10);
      const MONTO_DISPONIBLE = this.distribucionSaldoForm.get('montoDisponibleAsignacion')?.value;
      let MONTO_TOTAL_EXPEDIR_VALOR: number = 0;

      if (MONTO_EXPEDIR_VALOR > MONTO_DISPONIBLE) {
        this.mostrarTotalExpedirMonto = true;
        this.mostrarAgregarError.emit(true);
        return;
      }

      this.mostrarTotalExpedirMonto = false;

      MONTO_TOTAL_EXPEDIR_VALOR = MONTO_DISPONIBLE - MONTO_EXPEDIR_VALOR;

      this.cuerpoTabla = [
        ...this.cuerpoTabla,
        { montoExpedir: MONTO_EXPEDIR_VALOR }
      ];

      const TOTAL_EXPEDIR = this.cuerpoTabla
        .reduce((sum, record) => sum + (record.montoExpedir ?? 0), 0);

      this.distribucionSaldoForm.get('totalExpedir')?.setValue(TOTAL_EXPEDIR);
        if (TOTAL_EXPEDIR) {
      this.formExpedicionEvent.emit({
        formGroupName: 'distribucionSaldoForm',
        campo: 'totalExpedir',
        valor: this.distribucionSaldoForm.get('totalExpedir')?.value,
        storeStateName: 'distribucionSaldoForm'
      });
    }
      this.distribucionSaldoForm.get('montoDisponibleAsignacion')?.setValue(MONTO_TOTAL_EXPEDIR_VALOR);
      // this.tramite120202Store.setMontoDisponibleAsignacion(MONTO_TOTAL_EXPEDIR_VALOR);
      this.distribucionSaldoForm.get('montoExpedir')?.setValue(null);
      this.distribucionSaldoForm.get('montoExpedir')?.markAsPristine();
      this.distribucionSaldoForm.get('montoExpedir')?.markAsUntouched();
      this.sendAllValues()
    }
  }



  /**
   * Elimina el monto seleccionado de la tabla.
   * @returns {void}
   */
  eliminar(): void {
    if (this.selectedMonto.length > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Está seguro que desea eliminar los registros marcados?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * Confirma la eliminación de los registros seleccionados.
   * @param {boolean} valor - Valor booleano que indica si se confirma la eliminación.
   * @returns {void}
   */
confirmacionModal(valor: boolean): void {
  if (!valor) {return}
  const INDICE = this.cuerpoTabla.findIndex((elemento) =>
    Object.entries(this.selectedMonto[0] || {}).every(
      ([key, value]) => elemento[key as keyof ExpedirMonto] === value
    )
  );

  if (INDICE === -1) {return}

  const MONTO_ELIMINADO = Number(this.cuerpoTabla[INDICE]?.montoExpedir) || 0;

  this.cuerpoTabla.splice(INDICE, 1);
  this.cuerpoTabla = [...this.cuerpoTabla];

  const MONTO_DISPONIBLE =
    Number(this.distribucionSaldoForm.get('montoDisponibleAsignacion')?.value) || 0;

  this.distribucionSaldoForm
    .get('montoDisponibleAsignacion')
    ?.setValue(MONTO_DISPONIBLE + MONTO_ELIMINADO);

  const TOTAL_EXPEDIR = this.cuerpoTabla.reduce(
    (sum, record) => sum + (Number(record.montoExpedir) || 0),
    0
  );

  this.distribucionSaldoForm.get('totalExpedir')?.setValue(TOTAL_EXPEDIR);

  this.sendAllValues();
  this.selectedMonto = [];
}



  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (!this.mostrarDetalle) {
      if (this.expedicionCertificadosAsignacionForm.invalid) {
        this.expedicionCertificadosAsignacionForm.markAllAsTouched();
      }
      return this.expedicionCertificadosAsignacionForm.valid;
    }
    if (this.cuerpoTabla.length > 0) {
      this.tablaInvalidoError = false;
      return true;
    }
    this.tablaInvalidoError = true;
    return false;
  }

  /**
   * Establece los valores en el store de tramite120202.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    formGroupName: string,
    campo: string,
    storeStateName: string
  ): void {
    const VALOR = this.expedicionCertificadosAsignacionForm
      .get(formGroupName)
      ?.get(campo)?.value;

    this.formExpedicionEvent.emit({
      formGroupName,
      campo,
      valor: VALOR,
      storeStateName,
    });
  }

  /**
   * Obtiene los años de autorización disponibles.
   * @returns {Catalogo[]} - Los años de autorización disponibles.
   */
  get aniosAutorizacion(): Catalogo[] {
    return this.autorizacion?.length
      ? this.autorizacion
      : this.anoAutorizacion;
  }
  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}