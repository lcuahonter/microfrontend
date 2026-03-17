import { BasicRequerimientos, BasicRequerimientosRespuesta, Manifiestos, ManifiestosRespuesta } from '../../models/donaciones-extranjeras.model';
import { Catalogo, ConsultaioQuery, TableBodyData } from '@ng-mf/data-access-user';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FECHA_CADUCIDAD, GENERAL_TIPO_DE_MERCANCIA, MEDICAMENTOS_TIPO_DE_MERCANCIA, MEDICOS_EQUIPO_TIPO_DE_MERCANCIA, OPCIONES_DE_BOTON_DE_RADIO, PANELS, TEXTOS, VEHICULO_TIPO_DE_MERCANCIA } from '../../constantes/donaciones-extranjeras.enum';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroDeDonacion10303State, Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { InputFecha } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import mercanciaTable from '@libs/shared/theme/assets/json/10303/mercancia-table.json';

/**
 * Componente para gestionar el registro de donación.
 */
@Component({
  selector: 'app-registro-de-donacion',
  templateUrl: './registro-de-donacion.component.html',
  styleUrl: './registro-de-donacion.component.scss'
})
/*eslint class-methods-use-this: ["error", { "exceptMethods": ["cargarArchivo", "limpiarMercancias", "enCambioDeValor"] }] */
export class RegistroDeDonacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para el registro de donación.
   */
  registroDonacionForm!: FormGroup;

  /**
   * Formulario reactivo para agregar mercancías.
   */

  agregarMercanciasForm!: FormGroup;

  /**
   * Lista de manifiestos obtenidos desde el servicio.
   */
  manifiestos: Manifiestos[] = [];

  /**
   * Lista de requerimientos básicos obtenidos desde el servicio.
   */
  basicoRequerimientos: BasicRequerimientos[] = [];

  /**
   * Lista de estados de los manifiestos seleccionados.
   */
  manifiestosSeleccionados: boolean[] = [];

  /**
   * Lista de estados de los manifiestos seleccionados para mostrar.
   */
  manifiestoSeleccionado: boolean[] = [];

  /**
   * Lista de aduanas obtenida desde el servicio.
   */
  aduana!: Catalogo[];

  /**
   * Lista de destinos de donación obtenida desde el servicio.
   */
  destinoDonacion!: Catalogo[];

  /**
   * Lista de tipos de mercancía obtenida desde el servicio.
   */
  tipoDeMercancia!: Catalogo[];

  /**
   * Lista de unidades de medida obtenida desde el servicio.
   */
  unidadMedida!: Catalogo[];

  /**
   * Lista de unidades de medida de tarifa obtenida desde el servicio.
   */
  UMT!: Catalogo[];

  /**
   * Lista de países de procedencia obtenida desde el servicio.
   */
  paisProcedenciaOtro!: Catalogo[];

  /**
   * Lista de condiciones de mercancía obtenida desde el servicio.
   */
  condicionMercancia!: Catalogo[];

  /**
   * Lista de países de origen de medicamentos obtenida desde el servicio.
   */
  paisOrigenMedicamento!: Catalogo[];

  /**
   * Lista de países de procedencia de medicamentos obtenida desde el servicio.
   */
  paisProcedenciaMedicamento!: Catalogo[];

  /**
   * Lista de países de procedencia de medicamentos obtenida desde el servicio.
   */
  paisProcedencia!: Catalogo[];

  /**
   * Lista de países de origen de médicos obtenida desde el servicio.
   */
  paisMedicoOrigen!: Catalogo[];

  /**
   * Lista de años obtenida desde el servicio.
   */
  ano!: Catalogo[];

  /**
   * Lista de tipos de vehículos obtenida desde el servicio.
   */
  vehiculoTipo!: Catalogo[];

  /**
   * Encabezado de la tabla de mercancías.
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de mercancías.
   */
  public mercanciaBodyData: TableBodyData[] = [];

  /**
   * Datos de la tabla de mercancía.
   */
  public getMercanciaTableData: { mercanciaTable: { tableHeader: string[]; tableBody: TableBodyData[] } } = mercanciaTable;

  /**
   * Paneles de la interfaz de usuario.
   */
  panels = PANELS;

  /**
   * Estado del modal.
   */
  modal: string = 'modal';

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Archivo de medicamentos seleccionado.
   */
  archivoMedicamentos: File | null = null;

  /**
   *  Fecha de caducidad.
   */
  fechaCaducidad: InputFecha = FECHA_CADUCIDAD;

  /**
   * Etiqueta del archivo seleccionado.
   */
  etiquetaDeArchivo: string = TEXTOS.ETIQUETA_DE_ARCHIVO;

  /**
   * Indica si la sección es colapsable.
   * @property {boolean} colapsable
   */
  colapsable: boolean = false;

  /**
   * Estado de la registro de donacion.
   */
  public registroDeDonacionState!: RegistroDeDonacion10303State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Elemento de entrada de archivo HTML.
   * 
   * @type {HTMLInputElement}
   */
  entradaArchivo!: HTMLInputElement;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  formularioDeshabilitado!: boolean;

  /**
   * Índice de la mercancía seleccionada.
   */
  seleccionadaTipoDeMercancia!: number;

  /**
   * Constructor del componente RegistroDeDonacionComponent.
   * @param donacionesExtranjerasService donacionesExtranjerasService para manejar las donaciones extranjeras.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite10303Store tramite10303Store para manejar el estado del trámite 10303.
   * @param tramite10303Query tramite10303Query para consultar el estado del trámite 10303.
   * @param validacionesService validacionesService para validar formularios.
   * @param consultaioQuery consultaioQuery para consultar el estado de la consulta.
   */
  constructor(
    private donacionesExtranjerasService: DonacionesExtranjerasService,
    private fb: FormBuilder,
    private tramite10303Store: Tramite10303Store,
    private tramite10303Query: Tramite10303Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
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
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();

    if (this.formularioDeshabilitado) {
      this.registroDonacionForm.disable();
      this.agregarMercanciasForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.registroDonacionForm.enable();
      this.agregarMercanciasForm.enable();
    }
  }

  /**
   * Crea el formulario de registro de donación y lo inicializa con los valores del estado.
   * @returns {void}
   */
  crearFormulario(): void {
    this.inicializaCatalogos();

    this.obtenerBasicoRequerimientos();
    this.obtenerManifiestos();

    this.tramite10303Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.registroDeDonacionState = seccionState;
          this.mercanciaBodyData = seccionState.mercanciaTablaDatos || [];
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearDatosDelFabricanteForm();

    this.obtenerMercancia();

    this.aduanaSeleccion();
  }

  /**
   * Obtiene el grupo de formulario 'datosMercancia' del formulario principal 'RegistroDonacionForm'.
   */
  get datosMercancia(): FormGroup {
    return this.registroDonacionForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'datosCofepris' del formulario principal 'AgregarMercanciasForm'.
   */
  get datosCofepris(): FormGroup {
    return this.agregarMercanciasForm.get('datosCofepris') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'datosMedicosCofepris' del formulario principal 'AgregarMercanciasForm'.
   * 
   * @returns {FormGroup} El grupo de formulario 'datosMedicosCofepris'.
   */
  get datosMedicosCofepris(): FormGroup {
    return this.agregarMercanciasForm.get('datosMedicosCofepris') as FormGroup;
  }

  /**
   * Getter para obtener el control de formulario
   */
  get descripcionMercanciaOtro(): FormControl {
    return this.agregarMercanciasForm.get('datosMercancia.descripcionMercanciaOtro') as FormControl;
  }

  /**
   * Obtiene el FormArray correspondiente al campo 'seleccionadaBasicoRequerimiento' 
   * dentro del formulario de registro de donación.
   * 
   * @returns {FormArray} El FormArray del campo 'seleccionadaBasicoRequerimiento'.
   */
  get seleccionadaBasicoRequerimiento(): FormArray {
    return this.registroDonacionForm.get('manifiesto.seleccionadaBasicoRequerimiento') as FormArray;
  }

  /**
   * Obtiene el FormArray correspondiente a 'seleccionadaManifiesto' dentro del formulario de registro de donación.
   * 
   * @returns {FormArray} El FormArray de 'seleccionadaManifiesto'.
   */
  get seleccionadaManifiesto(): FormArray {
    return this.registroDonacionForm.get('manifiesto.seleccionadaManifiesto') as FormArray;
  }

  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearDatosDelFabricanteForm(): void {
    this.registroDonacionForm = this.fb.group({
      manifiesto: this.fb.group({
        seleccionadaManifiesto:
          this.fb.array(this.registroDeDonacionState?.seleccionadaManifiesto),
        aduana: [
          this.registroDeDonacionState?.aduana,
          [Validators.required]
        ],
        seleccionadaBasicoRequerimiento:
          this.fb.array(this.registroDeDonacionState?.seleccionadaBasicoRequerimiento)
      })
    });
    this.agregarMercanciasForm = this.fb.group({
      datosMercancia: this.fb.group({
        numeroConsecutivo: [
          { value: this.registroDeDonacionState?.numeroConsecutivo, disabled: true },
          [Validators.required, Validators.maxLength(5)]
        ],
        destinoDonacion: [
          this.registroDeDonacionState?.destinoDonacion,
          Validators.required
        ],
        posibleFraccion: [
          this.registroDeDonacionState?.posibleFraccion,
          [Validators.maxLength(10)]
        ],
        descripcionFraccion: [
          { value: this.registroDeDonacionState?.descripcionFraccion, disabled: true }
        ],
        solicitudDeInspeccion: [
          this.registroDeDonacionState?.solicitudDeInspeccion,
          [Validators.required]
        ],
        justificacionMerca: [
          this.registroDeDonacionState?.justificacionMerca,
          [
            Validators.required,
            Validators.maxLength(400)
          ]
        ],
        descripcionMercanciaOtro: [
          this.registroDeDonacionState?.descripcionMercanciaOtro,
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/),
            Validators.maxLength(400)
          ]
        ],
        tipoDeMercancia: [
          this.registroDeDonacionState?.tipoDeMercancia,
          Validators.required
        ],
        cantidadUMC: [
          this.registroDeDonacionState?.cantidadUMC,
          [Validators.required, Validators.maxLength(5)]
        ],
        cantidadUMT: [
          this.registroDeDonacionState?.cantidadUMT,
          [Validators.required, Validators.maxLength(5)]
        ],
        cantidadUMCVehiculo: [
          { value: this.registroDeDonacionState?.cantidadUMCVehiculo, disabled: true },
          Validators.required
        ],
        cantidadUMTVehiculo: [
          { value: this.registroDeDonacionState?.cantidadUMTVehiculo, disabled: true },
          Validators.required
        ],
        unidadMedida: [
          this.registroDeDonacionState?.unidadMedida,
          Validators.required
        ],
        UMT: [
          this.registroDeDonacionState?.UMT,
          Validators.required
        ],
        unidadMedidaVehiculo: [
          this.registroDeDonacionState?.unidadMedidaVehiculo,
          Validators.required
        ],
        UMTVehiculo: [
          this.registroDeDonacionState?.UMTVehiculo,
          Validators.required
        ],
        medicoDescripcion: [
          this.registroDeDonacionState?.medicoDescripcion,
          Validators.required
        ],
        paisProcedenciaOtro: [
          this.registroDeDonacionState?.paisProcedenciaOtro,
          Validators.required
        ],
        condicionMercancia: [
          this.registroDeDonacionState?.condicionMercancia,
          Validators.required
        ],
        marca: [
          this.registroDeDonacionState?.marca,
          [
            Validators.required
          ]
        ],
        ano: [
          this.registroDeDonacionState?.ano,
          Validators.required
        ],
        modelo: [
          this.registroDeDonacionState?.modelo,
          Validators.required
        ],
        serieNumero: [
          this.registroDeDonacionState?.serieNumero,
          Validators.required
        ],
        pasajerosNumero: [
          this.registroDeDonacionState?.pasajerosNumero,
          Validators.required
        ],
        cilindrada: [
          this.registroDeDonacionState?.cilindrada,
          Validators.required
        ],
        combustibleTipo: [
          this.registroDeDonacionState?.combustibleTipo,
          Validators.required
        ],
        vehiculoTipo: [
          this.registroDeDonacionState?.vehiculoTipo
        ],
        descripcion: [
          this.registroDeDonacionState?.descripcion
        ]
      }),
      datosCofepris: this.fb.group({
        fechaCaducidad: [
          this.registroDeDonacionState?.fechaCaducidad
        ],
        ingredienteActivo: [
          this.registroDeDonacionState?.ingredienteActivo,
          [
            Validators.required,
            Validators.maxLength(100)
          ],
        ],
        tipoMedicamento: [
          this.registroDeDonacionState?.tipoMedicamento,
          [
            Validators.required,
            Validators.maxLength(100)
          ]
        ],
        presentacionFarma: [
          this.registroDeDonacionState?.presentacionFarma,
          [Validators.required, Validators.maxLength(100)]
        ],
        paisOrigenMedicamento: [
          this.registroDeDonacionState?.paisOrigenMedicamento,
          Validators.required
        ],
        paisProcedenciaMedicamento: [
          this.registroDeDonacionState?.paisProcedenciaMedicamento,
          [
            Validators.required
          ]
        ]
      }),
      datosMedicosCofepris: this.fb.group({
        medicoDescripcion: [
          this.registroDeDonacionState?.medicoDescripcion,
          [
            Validators.required
          ]
        ],
        paisProcedencia: [
          this.registroDeDonacionState?.paisProcedencia,
          [
            Validators.required
          ]
        ],
        paisMedicoOrigen: [
          this.registroDeDonacionState?.paisMedicoOrigen,
          [
            Validators.required
          ]
        ]
      })
    });
  }

  /**
   * Inicializa los catálogos de países y documentos de residencia.
   * @returns {void}
   */
  private inicializaCatalogos(): void {
    const ADUANA$ = this.donacionesExtranjerasService
      .getAduana()
      .pipe(
        map((resp) => {
          this.aduana = resp.data;
        })
      );

    const DESTINO_DONACION$ = this.donacionesExtranjerasService
      .getDestinoDonacion()
      .pipe(
        map((resp) => {
          this.destinoDonacion = resp.data;
        })
      );

    const TIPO_DE_MERCANCIA$ = this.donacionesExtranjerasService
      .getTipoDeMercancia()
      .pipe(
        map((resp) => {
          this.tipoDeMercancia = resp.data;
        })
      );

    const UNIDAD_MEDIDA$ = this.donacionesExtranjerasService
      .getUnidadMedida()
      .pipe(
        map((resp) => {
          this.unidadMedida = resp.data;
        })
      );

    const UMT$ = this.donacionesExtranjerasService
      .getUmt()
      .pipe(
        map((resp) => {
          this.UMT = resp.data;
        })
      );

    const PAIS_PROCEDENCIA_OTRO$ = this.donacionesExtranjerasService
      .getProcedenciaOtro()
      .pipe(
        map((resp) => {
          this.paisProcedenciaOtro = resp.data;
        })
      );

    const CONDICION_MERCANCIA$ = this.donacionesExtranjerasService
      .getCondicionMercancia()
      .pipe(
        map((resp) => {
          this.condicionMercancia = resp.data;
        })
      );

    const PAIS_ORIGEN_MEDICAMENTO$ = this.donacionesExtranjerasService
      .getPaisOrigenMedicamento()
      .pipe(
        map((resp) => {
          this.paisOrigenMedicamento = resp.data;
        })
      );

    const PAIS_PROCEDENCIA_MEDICAMENTO$ = this.donacionesExtranjerasService
      .getPaisProcedenciaMedicamento()
      .pipe(
        map((resp) => {
          this.paisProcedenciaMedicamento = resp.data;
        })
      );

    const PAIS_PROCEDENCIA$ = this.donacionesExtranjerasService
      .getPaisProcedencia()
      .pipe(
        map((resp) => {
          this.paisProcedencia = resp.data;
        })
      );

    const PAIS_MEDICO_ORIGEN$ = this.donacionesExtranjerasService
      .getPaisMedicoOrigen()
      .pipe(
        map((resp) => {
          this.paisMedicoOrigen = resp.data;
        })
      );

    const ANO$ = this.donacionesExtranjerasService
      .getAno()
      .pipe(
        map((resp) => {
          this.ano = resp.data;
        })
      );

    const VEHICULO_TIPO$ = this.donacionesExtranjerasService
      .getVehiculoTipo()
      .pipe(
        map((resp) => {
          this.vehiculoTipo = resp.data;
        })
      );

    merge(
      ADUANA$,
      DESTINO_DONACION$,
      TIPO_DE_MERCANCIA$,
      UNIDAD_MEDIDA$,
      UMT$,
      PAIS_PROCEDENCIA_OTRO$,
      CONDICION_MERCANCIA$,
      PAIS_ORIGEN_MEDICAMENTO$,
      PAIS_PROCEDENCIA_MEDICAMENTO$,
      PAIS_PROCEDENCIA$,
      PAIS_MEDICO_ORIGEN$,
      ANO$,
      VEHICULO_TIPO$
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Método para seleccionar la aduana.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.registroDonacionForm.get('manifiesto.aduana')?.value;
    this.tramite10303Store.setAduana(ADUANA);
  }

  /**
   * Método para seleccionar la destino donacion.
   */
  destinoDonacionSeleccion(): void {
    const DESTINO_DONACION = this.agregarMercanciasForm.get('datosMercancia.destinoDonacion')?.value;
    this.tramite10303Store.setDestinoDonacion(DESTINO_DONACION);
  }

  /**
   * Método para seleccionar la tipo de mercancia.
   */
  tipoDeMercanciaSeleccion(): void {
    this.restablecerCampos();
    const TIPO_DE_MERCANCIA = this.agregarMercanciasForm.get('datosMercancia.tipoDeMercancia')?.value;
    this.seleccionadaTipoDeMercancia = Number(TIPO_DE_MERCANCIA);
    this.tramite10303Store.setSeleccionadaTipoDeMercancia(this.seleccionadaTipoDeMercancia);
    this.tramite10303Store.setTipoDeMercancia(TIPO_DE_MERCANCIA);
  }

  /**
   * Restablecer campos antes de seleccionar tipo de mercancia
   * @returns { void }
   */
  restablecerCampos(): void {
    this.agregarMercanciasForm.get('datosMercancia.cantidadUMC')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.cantidadUMT')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.unidadMedida')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.UMT')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.paisProcedenciaOtro')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.condicionMercancia')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.marca')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.ano')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.modelo')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.serieNumero')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.pasajerosNumero')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.cilindrada')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.combustibleTipo')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.vehiculoTipo')?.reset();
    this.agregarMercanciasForm.get('datosMercancia.descripcion')?.reset();
    this.agregarMercanciasForm.controls['datosCofepris'].reset();
    this.agregarMercanciasForm.controls['datosMedicosCofepris'].reset();
  }

  /**
   * Método para seleccionar la unidad medida.
   */
  unidadMedidaSeleccion(): void {
    const UNIDAD_MEDIDA = this.agregarMercanciasForm.get('datosMercancia.unidadMedida')?.value;
    this.tramite10303Store.setUnidadMedida(UNIDAD_MEDIDA);
  }

  /**
   * Método para seleccionar la umt.
   */
  umtSeleccion(): void {
    const UMT = this.agregarMercanciasForm.get('datosMercancia.UMT')?.value;
    this.tramite10303Store.setUMT(UMT);
  }

  /**
   * Método para seleccionar la pais procedencia otro.
   */
  paisProcedenciaOtroSeleccion(): void {
    const PAIS_PROCEDENCIAOTRO = this.agregarMercanciasForm.get('datosMercancia.paisProcedenciaOtro')?.value;
    this.tramite10303Store.setPaisProcedenciaOtro(PAIS_PROCEDENCIAOTRO);
  }

  /**
   * Método para seleccionar la condicion mercancia.
   */
  condicionMercanciaSeleccion(): void {
    const CONDICION_MERCANCIA = this.agregarMercanciasForm.get('datosMercancia.condicionMercancia')?.value;
    this.tramite10303Store.setCondicionMercancia(CONDICION_MERCANCIA);
  }

  /**
   * Método para seleccionar la pais origen medicamento.
   */
  paisOrigenMedicamentoSeleccion(): void {
    const PAIS_ORIGEN_MEDICAMENTO = this.agregarMercanciasForm.get('datosCofepris.paisOrigenMedicamento')?.value;
    this.tramite10303Store.setPaisOrigenMedicamento(PAIS_ORIGEN_MEDICAMENTO);
  }

  /**
   * Método para seleccionar la pais procedencia medicamento.
   */
  paisProcedenciaMedicamentoSeleccion(): void {
    const PAIS_PROCEDENCIA_MEDICAMENTO = this.agregarMercanciasForm.get('datosCofepris.paisProcedenciaMedicamento')?.value;
    this.tramite10303Store.setPaisProcedenciaMedicamento(PAIS_PROCEDENCIA_MEDICAMENTO);
  }

  /**
   * Método para seleccionar la pais procedencia.
   */
  paisProcedenciaSeleccion(): void {
    const PAIS_PROCEDENCIA = this.agregarMercanciasForm.get('datosMedicosCofepris.paisProcedencia')?.value;
    this.tramite10303Store.setPaisProcedencia(PAIS_PROCEDENCIA);
  }

  /**
   * Método para seleccionar la pais medico origen.
   */
  paisMedicoOrigenSeleccion(): void {
    const PAIS_MEDICO_ORIGEN = this.agregarMercanciasForm.get('datosMedicosCofepris.paisMedicoOrigen')?.value;
    this.tramite10303Store.setPaisMedicoOrigen(PAIS_MEDICO_ORIGEN);
  }

  /**
   * Método para seleccionar la ano.
   */
  anoSeleccion(): void {
    const ANO = this.agregarMercanciasForm.get('datosCofepris.ano')?.value;
    this.tramite10303Store.setAno(ANO);
  }

  /**
   * Método para seleccionar la vehiculo tipo.
   */
  vehiculoTipoSeleccion(): void {
    const VEHICULO_TIPO = this.agregarMercanciasForm.get('datosMercancia.vehiculoTipo')?.value;
    this.tramite10303Store.setVehiculoTipo(VEHICULO_TIPO);
  }

  /**
   * Actualiza la fecha de caducidad en el formulario de registro de donación y en el store de trámite 10303.
   *
   * @param {string} nuevo_valor - El nuevo valor de la fecha de caducidad.
   * @returns {void}
   */
  cambioFechaCaducidad(nuevo_valor: string): void {
    this.registroDonacionForm.get('fechaCaducidad')?.setValue(nuevo_valor);
    this.tramite10303Store.setFechaCaducidad(nuevo_valor);
  }

  /**
   * Verifica si un campo específico de un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite10303Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite10303Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Obtiene los manifiestos y los guarda en `manifiestos`.
   * Inicializa `manifiestosSeleccionados` con valores `false`.
   */
  obtenerManifiestos(): void {
    this.donacionesExtranjerasService.getManifiestos().subscribe({
      next: (result: ManifiestosRespuesta) => {
        this.manifiestos = result?.data;
      }
    });
  }

  /**
   * Obtiene los requerimientos básicos y los guarda en `basicoRequerimientos`.
   * @returns {void}
   */
  obtenerBasicoRequerimientos(): void {
    this.donacionesExtranjerasService.getBasicoRequerimientos().subscribe({
      next: (result: BasicRequerimientosRespuesta) => {
        this.basicoRequerimientos = result?.data;
      }
    });
  }

  /**
   * Maneja el evento de cambio de estado de un checkbox.
   *
   * @param event - El evento que se dispara al cambiar el estado del checkbox.
   * @param index - El índice del control en el formulario que se va a actualizar.
   */
  onBasicoRequirimentoCheckboxCambiar(event: Event, index: number): void {
    const VALOR_ENTRADA = event.target as HTMLInputElement;
    this.seleccionadaBasicoRequerimiento.controls[index].setValue(VALOR_ENTRADA.checked);
    this.setValoresStore(this.registroDonacionForm, 'manifiesto.seleccionadaBasicoRequerimiento', 'setSeleccionadaBasicoRequerimiento');
  }

  /**
   * Método para obtener los datos de las mercancías.
   * 
   * Este método asigna los datos del encabezado y del cuerpo de la tabla de mercancías
   * a las propiedades correspondientes del componente.
   * 
   * @returns {void}
   */
  public obtenerMercancia(): void {
    this.mercanciaHeaderData = this.getMercanciaTableData.mercanciaTable.tableHeader;
    this.mercanciaBodyData = this.getMercanciaTableData.mercanciaTable.tableBody;
  }

  /**
   * Cambia el estado de la casilla de verificación según el índice.
   * 
   * @param event - El evento que se dispara al cambiar el estado del checkbox.
   * @param {number} index - Índice de la casilla de verificación.
   * 
   * @returns {void}
   */
  onManifiestoCheckboxCambiar(event: Event, index: number): void {
    const VALOR_ENTRADA = event.target as HTMLInputElement;
    this.seleccionadaManifiesto.controls[index].setValue(VALOR_ENTRADA.checked);
    this.setValoresStore(this.registroDonacionForm, 'manifiesto.seleccionadaManifiesto', 'setSeleccionadaManifiesto');
  }

  /**
   * Muestra u oculta el panel colapsable.
   * 
   * @param index El índice del panel a mostrar u ocultar.
   * 
   * @returns {void}
   */
  mostrar_colapsable(index: number): void {
    const IS_CURRENTLY_OPEN = this.panels[index].isCollapsed;
    this.panels.forEach((panel, i) => {
      panel.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsable_fabricante
   * 
   * @returns {void}
   */
  mostrar_colapsable_fabricante(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Método para abrir dialogo mercancías.
   * 
   * @returns {void}
   */
  abrirDialogoMercancias(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Cierra el modal.
   * 
   * @returns {void}
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Agrega mercancías al formulario y cierra el modal.
   * @returns {void}
   */
  agregarMercancias(): void {
    let esFormValido = false;

    switch (this.registroDeDonacionState.seleccionadaTipoDeMercancia) {
      case 1:
        esFormValido = this.validarInvalidoCampos(VEHICULO_TIPO_DE_MERCANCIA);
        break;

      case 2:
        esFormValido = this.validarInvalidoCampos(MEDICAMENTOS_TIPO_DE_MERCANCIA);
        break;

      case 3:
        esFormValido = this.validarInvalidoCampos(MEDICOS_EQUIPO_TIPO_DE_MERCANCIA);
        break;

      default:
        esFormValido = this.validarInvalidoCampos(GENERAL_TIPO_DE_MERCANCIA);
        break;
    }

    if (esFormValido) {
      const MERCANCIA = this.agregarMercanciasForm.getRawValue();
      const SELECCIONADO_PAIS_PROCEDENCIA = this.paisProcedenciaOtro.find(x => x.id === MERCANCIA.datosMercancia.paisProcedenciaOtro)
      const SELECCIONADO_DESTINO_DONACION = this.destinoDonacion.find(x => x.id === MERCANCIA.datosMercancia.destinoDonacion);
      const SELECCIONADO_TIPO_DE_MERCANCIA = this.tipoDeMercancia.find(x => x.id === MERCANCIA.datosMercancia.tipoDeMercancia);
      const SELECCIONADO_UMC = this.unidadMedida.find(x => x.id === MERCANCIA.datosMercancia.unidadMedida);
      const SELECCIONADO_UMT = this.UMT.find(x => x.id === MERCANCIA.datosMercancia.UMT);
      const SELECCIONADO_CONDICION_MERCANCIA = this.condicionMercancia.find(x => x.id === MERCANCIA.datosMercancia.condicionMercancia);
      const SELECCIONADO_CUENTA_IMPORTACION = this.opcionDeBotonDeRadio.find(x => x.value === MERCANCIA.datosMercancia.cuentaImportacion);

      this.getMercanciaTableData.mercanciaTable.tableBody.push({
        tbodyData: [
          MERCANCIA.datosMercancia.numeroConsecutivo,
          SELECCIONADO_DESTINO_DONACION?.descripcion || '',
          SELECCIONADO_CUENTA_IMPORTACION?.label || '',
          MERCANCIA.datosMercancia.posibleFraccion,
          MERCANCIA.datosMercancia.descripcionFraccion,
          SELECCIONADO_PAIS_PROCEDENCIA?.descripcion || '',
          SELECCIONADO_UMC?.descripcion || '',
          SELECCIONADO_UMT?.descripcion || '',
          SELECCIONADO_CONDICION_MERCANCIA?.descripcion || '',
          SELECCIONADO_TIPO_DE_MERCANCIA?.descripcion || '',
        ]
      });

      this.mercanciaBodyData = this.getMercanciaTableData.mercanciaTable.tableBody;
      this.tramite10303Store.setMercanciaTablaDatos(this.mercanciaBodyData);
      this.agregarMercanciasForm.reset();
      this.cerrarModal();
    } else {
      switch (this.seleccionadaTipoDeMercancia) {
        case 1:
          this.validarModalCampos(VEHICULO_TIPO_DE_MERCANCIA);
          break;

        case 2:
          this.validarModalCampos(MEDICAMENTOS_TIPO_DE_MERCANCIA);
          break;

        case 3:
          this.validarModalCampos(MEDICOS_EQUIPO_TIPO_DE_MERCANCIA);
          this.agregarMercanciasForm.controls['datosMedicosCofepris'].markAllAsTouched();
          break;

        default:
          this.validarModalCampos(GENERAL_TIPO_DE_MERCANCIA);
          break;
      }
    }
  }

  /**
   * Marca los campos del formulario como tocados para mostrar los errores de validación.
   * 
   * @param campos Lista de nombres de campos a validar.
   * 
   * @returns {void}
   */
  validarModalCampos(campos: string[]): void {
    campos.forEach(x => {
      this.agregarMercanciasForm.get(x)?.markAsTouched();
    });
  }

  /**
   * Valida si todos los campos del formulario son válidos.
   * 
   * @param campos Lista de nombres de campos a validar.
   * 
   * @returns {boolean} Retorna `true` si todos los campos son válidos, de lo contrario `false`.
   */
  validarInvalidoCampos(campos: string[]): boolean {
    return campos.every(x => !this.agregarMercanciasForm.get(x)?.invalid);
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   * 
   * @param event Evento de cambio de archivo.
   * 
   * @returns {void}
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoMedicamentos = TARGET.files[0];
      this.etiquetaDeArchivo = this.archivoMedicamentos.name;
    } else {
      this.etiquetaDeArchivo = TEXTOS.ETIQUETA_DE_ARCHIVO;
    }
  }

  /**
   * Elimina el archivo de medicamento seleccionado.
   * @returns {void}
   */
  eliminacionMedicamento(): void {
    this.archivoMedicamentos = null;
    this.etiquetaDeArchivo = TEXTOS.ETIQUETA_DE_ARCHIVO;
  }

  /**
   * Activa la selección del archivo de medicamentos.
   * @returns {void}
   */
  activarSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById('archivoMedicamentos') as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }
  }

  /**
   * Carga el archivo de acuerdo al tipo especificado.
   * 
   * @param tipo Tipo de archivo a cargar.
   */
  cargarArchivo(): void {
    // Implementar la lógica para Tipo de archivo a cargar.
  }

  /**
   * Limpia la información de las mercancías.
   */
  limpiarMercancias(): void {
    // Implementar la lógica para limpiar las mercancías.
  }

  /**
   * Maneja el evento de cambio de valor.
   */
  enCambioDeValor(): void {
    // Implementar la lógica para evento de cambio de valor.
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