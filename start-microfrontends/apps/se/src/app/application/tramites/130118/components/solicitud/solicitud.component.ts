import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';

import { CATALOGOS_ID, Catalogo, Catalogos, CategoriaMensaje, ConsultaioQuery, ConsultaioState, EntidadesFederativasService, FECHA_SALIDA, FraccionArancelariaService, InputFecha, Notificacion, PaisesService, REGEX_ONCE_ENTEROS_DOS_DECIMALES, REGEX_ONCE_ENTEROS_TRES_DECIMALES, RegimenService, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Solicitud130118State, Tramite130118Store } from '../../estados/tramites/tramite130118.store';
import { PeximService } from '../../services/pexim.service';
import { Tramite130118Query } from '../../estados/queries/tramite130118.query';

import { GuardarService } from '../../services/guardar.service';

import { CatMolinoService } from '../../services/cat-molino.service';
import { ConsultaSolicitudResponse } from '../../model/response/consultar-solicitud-response.model';
import { ConsultaSolicitudService } from '../../services/consulta-solicitud.service';
import moment from 'moment';

/**
 * Componente para la vista de la solicitud de la sección de "130118".
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
  standalone: false,
})
/*eslint class-methods-use-this: ["error", { "exceptMethods": ["truncar"] }] */
export class SolicitudComponent implements OnInit, OnDestroy {

  /**
    * @property {ConsultaioState[]} consultaState
    * @description Consulta solicitud.
  */
  @Input() consultaState!: ConsultaioState;
  

  /**
   * Lista de catálogos de régimen de mercancía.
   */
  regimenMercancia!: Catalogos[];

  /**
   * Lista de catálogos de clasificación de régimen.
   */
  clasifiRegimen!: Catalogos[];

  /**
   * Lista de catálogos de fracción arancelaria.
   */
  fraccionArancelaria!: Catalogos[];

  /**
   * Lista de catálogos de NICO.
   */
  nico!: Catalogos[];

  /**
   * Indica si se deben mostrar los molinos de acero.
   */
  mostrarComboMolinos = false;

  /**
   * Lista de catálogos de molinos de acero.
   */
  molinos!: Catalogos[];

  /**
   * Lista de catálogos de país de origen.
   */
  paisOrigen!: Catalogo[];

  /**
   * Lista de catálogos de país de destino.
   */
  paisDestino!: Catalogos[];

  /**
   * Lista de catálogos de estado.
   */
  estado!: Catalogos[];

  /**
   * Lista de catálogos de unidad de medida tarifaria.
   */
  unidadMedidaTarifaria!: Catalogos[];

  /**
   * Lista de catálogos de representación federal.
   */
  representacionFederal!: Catalogos[];

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud130118State;

  /**
   * Indica si la persona física es visible.
   */
  isVisibleFisica: boolean = false;

  /**
   * Indica si la persona moral es visible.
   */
  isVisibleMoral: boolean = false;

  /**
   * Fecha final de entrada.
   */
  fechaFinalInput: InputFecha = FECHA_SALIDA;

  /**
   * Formulario principal de la solicitud.
   */
  FormSolicitud!: FormGroup;

  /**
   * Cadena utilizada para escapar comillas dobles en HTML.
   */
  escaparHtml!: string;

  /**
   * Estado de la consulta.
   */
  consultaDatos!: ConsultaioState;

  /**
    * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
    * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
    */
  nuevaNotificacion!: Notificacion;

  /**
   * Subject para destruir notificador y cancelar suscripciones.
   */
  destruirNotificador$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Máximo número de meses para el certificado de antigüedad.
   */
  certificadoAntiguedadMaximoMeses: number = 0;

  @Input() ocultarForm: boolean = false;
  /**
   * Constructor del componente.
   * @param peximService Servicio para obtener datos de PEXIM.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param validacionesService Servicio para validar formularios.
   * @param tramite130118Store Store para manejar el estado del trámite 130118.
   * @param tramite130118Query Query para consultar el estado del trámite 130118.
   * @param consultaioQuery Query para consultar datos de la consulta.
   * @param regimenService Servicio para obtener datos de régimen.
   * @param entidadesFederativasService Servicio para obtener datos de entidades federativas.
   * @param paisesService Servicio para obtener datos de países.
   * @param fraccionArancelariaService Servicio para obtener datos de fracción arancelaria.
   * @param guardarService Servicio para guardar datos del formulario.
   */
  constructor(
    private peximService: PeximService,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private tramite130118Store: Tramite130118Store,
    private tramite130118Query: Tramite130118Query,
    private consultaioQuery: ConsultaioQuery,
    private regimenService: RegimenService,
    private entidadesFederativasService: EntidadesFederativasService,
    private paisesService: PaisesService,
    private fraccionArancelariaService: FraccionArancelariaService,
    private guardarService: GuardarService,
    private cdr: ChangeDetectorRef,
    private catMolinoService: CatMolinoService,
    private consultaSolicitudService: ConsultaSolicitudService
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa catálogos, suscripciones y muestra los campos correspondientes a la persona seleccionada.
   */
  ngOnInit(): void {
    if (this.ocultarForm === true) {
      this.esFormularioSoloLectura = true;
      this.inicializaCatalogos();
      this.obtenerDataSolicitud();
      this.inicializarEstadoFormulario();
    } else if (this.consultaState.id_solicitud !== '' && this.consultaState.folioTramite === '') {
      this.inicializaCatalogos();
      this.obtenerConusltaBandejaSolicitud();
      this.inicializarEstadoFormulario();
    } else {
      this.inicializaCatalogos();

      this.tramite130118Query.selectSeccionState$
        .pipe(
          takeUntil(this.destruirNotificador$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        ).subscribe();

      this.inicializarEstadoFormulario();


      const REGIMEN_VALUE = this.datosRegimen.get('regimenMercancia')?.value;
      if (REGIMEN_VALUE && REGIMEN_VALUE !== '-1') {
        this.changeRegimen();
      }

      const FRACCION_GUARDADA = this.solicitudState?.fraccionArancelaria;
      if (FRACCION_GUARDADA && FRACCION_GUARDADA !== '-1') {
        this.datosMercancia.get('fraccionArancelaria')?.setValue(FRACCION_GUARDADA);
        this.fraccionArancelariaChange();
      }

      const ESTADO_GUARDADO = this.solicitudState?.estado;
      if (ESTADO_GUARDADO && ESTADO_GUARDADO !== '-1') {
        this.registroFederal.get('estado')?.setValue(ESTADO_GUARDADO);
        this.changeEntidad();
      }

      this.regimenMercanciaSeleccion();
      this.clasifiRegimenSeleccion();
      this.obtenerAntiguedadMaxima();
      this.fraccionArancelariaSeleccion();
      this.nicoSeleccion();
      this.paisOrigenSeleccion();
      this.paisDestinoSeleccion();
      this.estadoSeleccion();
      this.unidadMedidaTarifariaSeleccion();
      this.representacionFederalSeleccion();
      if (this.solicitudState?.nombre || this.solicitudState?.razonSocial) {
        this.muestraCamposPersona();
      }
    }
  }

  /**
   * Obtiene los datos de una solicitud mediante un folio específico y procesa la respuesta
   * para llenar un formulario y realizar diversas acciones basadas en los datos recibidos.
  */
  obtenerDataSolicitud(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetalleSolicitud(Number(this.consultaState.procedureId), FOLIO).subscribe({
      next: (response) => {
        if (response?.codigo === '00' && response?.datos) {
          this.llenarFormularioDesdeRespuesta(response.datos);
          this.changeRegimen(response.datos.cve_clasificacion_regimen)

          this.fraccionArancelariaChange(response.datos.mercancia.cve_unidad_medida_tarifaria,
            response.datos.mercancia.cve_subdivision, response.datos.productor.razon_social);
          this.changeEntidad(response.datos.representacion_federal.cve_unidad_administrativa);
          const NOMBRE = response.datos.productor?.nombre;
          const RAZON_SOCIAL = response.datos?.productor?.razon_social;
          if (NOMBRE || RAZON_SOCIAL) {
            this.muestraCamposPersona(response.datos.productor.nombre);
          }
        } else {
          console.error('Error en getCriterios:', response?.mensaje);
        }
      },
      error: (err) => {
        console.error('Error al obtener criterios:', err);
      }
    });
  }

  /**
   * Obtiene los datos de la bandeja de solicitudes mediante el ID de la solicitud
   */
   obtenerConusltaBandejaSolicitud(): void {
    const IDSOLICITUD = this.consultaState.id_solicitud;
    this.consultaSolicitudService.getConsultaDetalleBandejaSolicitudes(IDSOLICITUD).subscribe({
      next: (response) => {
        if (response?.codigo === '00' && response?.datos) {
          this.tramite130118Store.setIdSolicitud(response.datos.id_solicitud);
          this.llenarFormularioDesdeRespuesta(response.datos);
          this.changeRegimen(response.datos.cve_clasificacion_regimen)

          this.fraccionArancelariaChange(response.datos.mercancia.cve_unidad_medida_tarifaria,
            response.datos.mercancia.cve_subdivision, response.datos.productor.razon_social);
          this.changeEntidad(response.datos.representacion_federal.cve_unidad_administrativa);
          const NOMBRE = response.datos.productor?.nombre;
          const RAZON_SOCIAL = response.datos?.productor?.razon_social;
          if (NOMBRE || RAZON_SOCIAL) {
            this.muestraCamposPersona(response.datos.productor.nombre);
          }
        } else {
          console.error('Error en getCriterios:', response?.mensaje);
        }
      },
      error: (err) => {
        console.error('Error al obtener criterios:', err);
      }
    });
  }

  /**
   * Llena el formulario con los datos obtenidos de la respuesta de la consulta de solicitud.
   * @param datos Datos de la respuesta de la consulta de solicitud.
   */
  llenarFormularioDesdeRespuesta(datos: ConsultaSolicitudResponse): void {
    this.FormSolicitud?.patchValue({
      datosRegimen: {
        regimenMercancia: datos.cve_regimen,
        clasifiRegimen: datos.cve_clasificacion_regimen
      },
      datosMercancia: {
        valueTA: datos.mercancia.descripcion,
        fraccionArancelaria: datos.mercancia.cve_fraccion_arancelaria,
        nico: datos.mercancia.cve_subdivision,
        unidadMedidaTarifaria: datos.mercancia.cve_unidad_medida_tarifaria,
        cantidadTarifaria: datos.mercancia.cantidad_tarifaria,
        valorFacturaUSD: datos.mercancia.valor_factura_usd,
        precioUnitarioUSD: datos.mercancia.precio_unitario,
        paisOrigen: datos.mercancia.cve_pais_origen,
        paisDestino: datos.mercancia.cve_pais_destino,
        lote: datos.mercancia.lote,
        fechaSalida: SolicitudComponent.formatearFechaBackendAInput(datos.mercancia.fecha_salida),
        observaciones: datos.mercancia.observaciones,
        observacionMerc: datos.mercancia.observaciones
      },
      datosProducto: {
        tipoPersona: datos.productor.tipo_persona,
        nombre: datos.productor.nombre,
        apellidoPaterno: datos.productor.apellido_paterno,
        apellidoMaterno: datos.productor.apellido_materno,
        razonSocial: datos.productor.razon_social,
        domicilio: datos.productor.descripcion_ubicacion
      },
      registroFederal: {
        estado: datos.representacion_federal.cve_entidad_federativa,
        representacionFederal: datos.representacion_federal.cve_unidad_administrativa
      }
    });
  }

  /**
   * Formatea una fecha del backend al formato de entrada del formulario.
   * @param fecha Fecha en formato 'YYYY-MM-DD'.
   * @returns Fecha formateada al formato 'DD/MM/YYYY' o null si la fecha es inválida.
   */
  static formatearFechaBackendAInput(fecha?: string): string | null {
    if (!fecha) { return null; }

    const NUEVOFORMATO = moment(fecha, 'YYYY-MM-DD');
    if (!NUEVOFORMATO.isValid()) { return null; }

    return NUEVOFORMATO.format('DD/MM/YYYY');
  }

  /**
   * Obtiene el máximo número de meses de antigüedad permitido para el certificado.
   * Realiza una petición al servicio de guardar para obtener el valor.
   */
  obtenerAntiguedadMaxima(): void {
    this.guardarService.getCertificadoAntiguedad().subscribe({
      next: (response) => {
        if (response.codigo === '00') {
          this.certificadoAntiguedadMaximoMeses = Number(response.datos);
        } else {
          // Manejo si viene código distinto a "00"
          console.error('Error al obtener antigüedad:', response.mensaje);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormSolicitud();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormSolicitud();
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud.disable();
    } else {
      this.FormSolicitud.enable();
    }
  }

  /**
   * Obtiene el grupo de formulario 'datosRegimen' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'datosRegimen'.
   */
  get datosRegimen(): FormGroup {
    return this.FormSolicitud.get('datosRegimen') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'datosMercancia' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'datosMercancia'.
   */
  get datosMercancia(): FormGroup {
    return this.FormSolicitud.get('datosMercancia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'datosProducto' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'datosProducto'.
   */
  get datosProducto(): FormGroup {
    return this.FormSolicitud.get('datosProducto') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'registroFederal' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'registroFederal'.
   */
  get registroFederal(): FormGroup {
    return this.FormSolicitud.get('registroFederal') as FormGroup;
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
   * Método para crear el formulario principal de la solicitud.
   */
  crearFormSolicitud(): void {

    this.FormSolicitud = this.fb.group({
      datosRegimen: this.fb.group({
        regimenMercancia: [this.solicitudState?.regimenMercancia || null, Validators.required],
        clasifiRegimen: [this.solicitudState?.clasifiRegimen || null , Validators.required]
      }),
      datosMercancia: this.fb.group({
        valueTA: [this.solicitudState?.valueTA, [Validators.maxLength(4000), Validators.required, Validators.pattern(/^[^~`^]*$/)]],
        fraccionArancelaria: [this.solicitudState?.fraccionArancelaria || null, Validators.required],
        nico: [this.solicitudState?.nico || null, Validators.required],
        unidadMedidaTarifaria: [this.solicitudState?.unidadMedidaTarifaria || null, Validators.required],
        cantidadTarifaria: [this.solicitudState?.cantidadTarifaria, [Validators.min(0), Validators.required, Validators.max(99999999999.99), Validators.pattern(REGEX_ONCE_ENTEROS_DOS_DECIMALES)]],
        valorFacturaUSD: [this.solicitudState?.valorFacturaUSD, [Validators.min(0), Validators.max(99999999999.999), Validators.pattern(REGEX_ONCE_ENTEROS_TRES_DECIMALES), Validators.required]],
        precioUnitarioUSD: [{ value: this.solicitudState?.precioUnitarioUSD, disabled: true }],
        paisOrigen: [this.solicitudState?.paisOrigen || null, Validators.required],
        paisDestino: [this.solicitudState?.paisDestino || null, Validators.required],
        lote: [this.solicitudState?.lote, [Validators.maxLength(60), Validators.required]],
        fechaSalida: [this.solicitudState?.fechaSalida, [Validators.required]],
        observaciones: [this.solicitudState?.observaciones, [Validators.maxLength(4000)]],
        observacionMerc: this.solicitudState?.observacionMerc
      }),
      datosProducto: this.fb.group({
        tipoPersona: [this.solicitudState?.tipoPersona ?? null, [Validators.required]],
        nombre: [{ value: this.solicitudState?.nombre ?? '', disabled: true }, [Validators.required, Validators.maxLength(200)]],
        apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno ?? '', disabled: true }, [Validators.required, Validators.maxLength(200)]],
        apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno ?? '', disabled: true }, [Validators.maxLength(200)]],
        razonSocial: [{ value: this.solicitudState?.razonSocial, disabled: true }, [Validators.required, Validators.maxLength(250)]],
        domicilio: [this.solicitudState?.domicilio, [Validators.maxLength(4000), Validators.required]]
      }),
      registroFederal: this.fb.group({
        estado: [this.solicitudState?.estado || null, Validators.required],
        representacionFederal: [this.solicitudState?.representacionFederal || null , Validators.required]
      })
    });
  }

  /**
   * Obtiene el formulario principal de la solicitud.
   * @returns {FormGroup} El formulario principal de la solicitud.
   */
  get form(): FormGroup {
    return this.FormSolicitud;
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    const REGIMEN_MERCANCIA$ = this.regimenService
      .getRegimenes()
      .pipe(
        map((resp) => {
          this.regimenMercancia = resp.datos;
        })
      );

    const FRACCION_ARANCELARIA$ = this.fraccionArancelariaService
      .getFracciones()
      .pipe(
        map((resp) => {
          this.fraccionArancelaria = resp.datos;
        })
      );

    const PAIS_DESTINO$ = this.paisesService
      .getPaisesT130118()
      .pipe(
        map((resp) => {
          this.paisDestino = resp.datos;
        })
      );

    const ESTADO$ = this.entidadesFederativasService
      .getEntidades()
      .pipe(
        map((resp) => {
          this.estado = resp.datos;
        })
      );

    merge(
      REGIMEN_MERCANCIA$,
      FRACCION_ARANCELARIA$,
      PAIS_DESTINO$,
      ESTADO$,
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Establece los valores en el store de tramite130118.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite130118Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130118Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Selecciona el régimen de mercancía y lo actualiza en el store.
   */
  regimenMercanciaSeleccion(): void {
    const REGIMEN_MERCANCIA = this.FormSolicitud.get('datosRegimen.regimenMercancia')?.value;
    this.tramite130118Store.setRegimenMercancia(REGIMEN_MERCANCIA);
  }

  /**
   * Selecciona la clasificación de régimen y la actualiza en el store.
   */
  clasifiRegimenSeleccion(): void {
    const CLASIFI_REGIMEN = this.FormSolicitud.get('datosRegimen.clasifiRegimen')?.value;
    this.tramite130118Store.setClasifiRegimen(CLASIFI_REGIMEN);
  }

  /**
   * Selecciona la fracción arancelaria y la actualiza en el store.
   */
  fraccionArancelariaSeleccion(): void {
    const FRACCION_ARANCELARIA = this.FormSolicitud.get('datosMercancia.fraccionArancelaria')?.value;
    this.tramite130118Store.setFraccionArancelaria(FRACCION_ARANCELARIA);
  }

  /**
   * Selecciona el NICO y lo actualiza en el store.
   */
  nicoSeleccion(): void {
    const NICO = this.FormSolicitud.get('datosMercancia.nico')?.value;
    this.tramite130118Store.setNico(NICO);
  }

  /**
   * Selecciona la unidad de medida tarifaria y la actualiza en el store.
   */
  unidadMedidaTarifariaSeleccion(): void {
    const UNIDAD_MEDIDA_TARIFARIA = this.FormSolicitud.get('datosMercancia.unidadMedidaTarifaria')?.value;
    this.tramite130118Store.setUnidadMedidaTarifaria(UNIDAD_MEDIDA_TARIFARIA);
  }

  /**
   * Selecciona el país de origen y lo actualiza en el store.
   */
  paisOrigenSeleccion(): void {
    const PAIS_ORIGEN = this.FormSolicitud.get('datosMercancia.paisOrigen')?.value;
    this.tramite130118Store.setPaisOrigen(PAIS_ORIGEN);
  }

  /**
   * Selecciona el país de destino y lo actualiza en el store.
   */
  paisDestinoSeleccion(): void {
    const PAIS_DESTINO = this.FormSolicitud.get('datosMercancia.paisDestino')?.value;
    this.tramite130118Store.setPaisDestino(PAIS_DESTINO);
  }

  /**
   * Selecciona el estado y lo actualiza en el store.
   */
  estadoSeleccion(): void {
    const ESTADO = this.FormSolicitud.get('registroFederal.estado')?.value;
    this.tramite130118Store.setEstado(ESTADO);
  }

  /**
   * Selecciona la representación federal y la actualiza en el store.
   */
  representacionFederalSeleccion(): void {
    const REPRESENTACION_FEDERAL = this.FormSolicitud.get('registroFederal.representacionFederal')?.value;
    this.tramite130118Store.setRepresentacionFederal(REPRESENTACION_FEDERAL);
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    this.marcarFormularioComoTocado(this.FormSolicitud);
    this.cdr.detectChanges();
    return this.FormSolicitud.valid;
  }

  /**
   * Marca todos los controles del formulario como tocados y actualiza su validez.
   * Recorre recursivamente todos los controles, incluidos FormGroups y FormArrays.
   * @param formGroup El FormGroup a marcar como tocado.
   */
  private marcarFormularioComoTocado(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const CONTROL = formGroup.get(key);

      if (CONTROL instanceof FormControl) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      } else if (CONTROL instanceof FormGroup) {
        this.marcarFormularioComoTocado(CONTROL);
      } else if (CONTROL instanceof FormArray) {
        CONTROL.controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.marcarFormularioComoTocado(c);
          } else {
            c.markAsTouched();
            c.updateValueAndValidity();
          }
        });
      }
    });
  }

  /**
   * Método para escapar comillas dobles en una cadena.
   * @param value Cadena a escapar.
   * @returns {string} Cadena con comillas escapadas.
   */
  escapeHtmlQuotes(value: string): string {
    this.escaparHtml = '&#34;';
    return value ? value.replace(/"/g, this.escaparHtml) : '';
  }

  /**
   * Método para mostrar los campos correspondientes a la persona seleccionada.
   * Determina si se debe mostrar la sección de persona física o moral.
   */
  muestraCamposPersona(nombre?: string): void {
    const RAZONSOCIAL = this.FormSolicitud.get('datosProducto.razonSocial')?.value;
    const NOMBRE = this.FormSolicitud.get('datosProducto.nombre')?.value;

    if (RAZONSOCIAL) {
      this.personaMoral();
      this.FormSolicitud.get('datosProducto.tipoPersona')?.setValue('pmoral');
    } else if (NOMBRE) {
      this.personaFisica(nombre);
      this.FormSolicitud.get('datosProducto.tipoPersona')?.setValue('pfisica');
    }
  }

  /**
   * Método para mostrar los campos correspondientes a una persona moral.
   * Deshabilita y limpia los campos de persona física.
   */
  personaMoral(): void {
    this.isVisibleFisica = false;
    this.isVisibleMoral = true;

    const NOMBRE_CTRL = this.FormSolicitud.get('datosProducto.nombre');
    const AP_PATERNO_CTRL = this.FormSolicitud.get('datosProducto.apellidoPaterno');
    const AP_MATERNO_CTRL = this.FormSolicitud.get('datosProducto.apellidoMaterno');
    const RAZON_SOCIAL_CTRL = this.FormSolicitud.get('datosProducto.razonSocial');

    // Limpiar valores
    NOMBRE_CTRL?.setValue('');
    AP_PATERNO_CTRL?.setValue('');
    AP_MATERNO_CTRL?.setValue('');

    // Limpiar Akita
    this.tramite130118Store.setNombre('');
    this.tramite130118Store.setApellidoPaterno('');
    this.tramite130118Store.setApellidoMaterno('');

    // Quitar validadores
    NOMBRE_CTRL?.clearValidators();
    AP_PATERNO_CTRL?.clearValidators();
    AP_MATERNO_CTRL?.clearValidators();

    // Recalcular estado del control
    NOMBRE_CTRL?.updateValueAndValidity();
    AP_PATERNO_CTRL?.updateValueAndValidity();
    AP_MATERNO_CTRL?.updateValueAndValidity();

    // Deshabilitar campos de persona física
    NOMBRE_CTRL?.disable();
    AP_PATERNO_CTRL?.disable();
    AP_MATERNO_CTRL?.disable();

    // Habilitar razón social
    if (!this.esFormularioSoloLectura) {
      RAZON_SOCIAL_CTRL?.enable();
    }
  }

  /**
   * Método para mostrar los campos correspondientes a una persona física.
   * Habilita los campos de persona física y deshabilita los de persona moral.
   */
  personaFisica(nombre?: string): void {
    this.isVisibleFisica = true;
    this.isVisibleMoral = false;

    // Limpiar campo de razón social y desactivarlo
    this.FormSolicitud.get('datosProducto.razonSocial')?.setValue('');
    this.FormSolicitud.get('datosProducto.razonSocial')?.disable();

    // Limpiar razón social en Akita
    this.tramite130118Store.setRazonSocial('');

    // Habilitar campos de persona física
    if (!nombre) {
      this.FormSolicitud.get('datosProducto.nombre')?.enable();
      this.FormSolicitud.get('datosProducto.apellidoPaterno')?.enable();
      this.FormSolicitud.get('datosProducto.apellidoMaterno')?.enable();
    }

  }

  /**
   * Función para calcular el precio por unidad.
   */
  calcularUmtPrecioUnitario(): void {
    this.calcularPrecioUnitarioUSD();
  }

  /**
   * Función para calcular el precio unitario en USD.
   * Calcula el precio unitario a partir de la cantidad y el valor de la factura.
   */
  calcularPrecioUnitarioUSD(): void {
    const CANTIDAD_UMT = this.FormSolicitud.get('datosMercancia.cantidadTarifaria')?.value;
    const MERCANCIA_AVISO = this.FormSolicitud.get('datosMercancia.valorFacturaUSD')?.value;

    if (CANTIDAD_UMT !== null && CANTIDAD_UMT.toString().length >= 1 &&
      MERCANCIA_AVISO !== null && MERCANCIA_AVISO.toString().length >= 1) {

      if (CANTIDAD_UMT === 0 || CANTIDAD_UMT.toString().length === 0) {
        this.FormSolicitud.get('precioUnitarioAcero')?.setValue('0');
      } else {
        const FACTOR = 10000000;
        let resultPrecioUni: number;

        if ((MERCANCIA_AVISO * 1000) < CANTIDAD_UMT) {
          resultPrecioUni = 0;
        } else {
          const RESULT_PRECIO_UNIAUX = this.truncar(
            (MERCANCIA_AVISO * FACTOR) / CANTIDAD_UMT / FACTOR
          );
          resultPrecioUni = RESULT_PRECIO_UNIAUX;
        }
        this.FormSolicitud.get('datosMercancia.precioUnitarioUSD')?.setValue(resultPrecioUni);

        this.tramite130118Store.setPrecioUnitarioUSD(resultPrecioUni);
      }
    }
  }

  /**
   * Función para truncar la parte decimal a dos decimales.
   * @param num Número a truncar.
   * @returns {number} Número truncado.
   */
  truncar(num: number): number {
    const NUMSTR = num.toString();
    if (NUMSTR.indexOf('.') !== -1) {
      const NUMARR = NUMSTR.split('.');
      if (NUMARR.length === 1) {
        return Number(num);
      }
      return parseFloat(NUMARR[0] + '.' + NUMARR[1].slice(0, 3));
    }
    return Number(num);
  }

  /**
   * Método para cambiar la fecha final.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    const PARTES = nuevo_valor.split('/');
    if (PARTES.length !== 3) {
      this.datosMercancia.patchValue({ fechaSalida: null });
      return;
    }

    const DIA = parseInt(PARTES[0], 10);
    const MES = parseInt(PARTES[1], 10) - 1;
    const ANIO = parseInt(PARTES[2], 10);

    const FECHASALIDA = new Date(ANIO, MES, DIA);

    if (isNaN(FECHASALIDA.getTime())) {
      this.datosMercancia.patchValue({ fechaSalida: null });
      return;
    }

    const MESESANTIGUEDAD = this.certificadoAntiguedadMaximoMeses;

    const FECHALIMITE = new Date();
    FECHALIMITE.setMonth(FECHALIMITE.getMonth() - MESESANTIGUEDAD);


    if (FECHASALIDA < FECHALIMITE) {

      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: '',
        mensaje: `La fecha no puede tener más de ${MESESANTIGUEDAD} meses de antigüedad.`,
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      this.datosMercancia.patchValue({ fechaSalida: 'valor_temporal' });

      setTimeout(() => {
        this.datosMercancia.patchValue({ fechaSalida: null });
      }, 0);

      return;
    }

    this.datosMercancia.patchValue({ fechaSalida: nuevo_valor });
    this.tramite130118Store.setFechaSalida(nuevo_valor);
  }




  // eslint-disable-next-line class-methods-use-this
  isErrorNoMenosUno(form: FormGroup, field: string): boolean {
    const CONTROL = form.get(field) as FormControl;

    if (CONTROL) {
      const ERROR_NO_MENOS_UNO = CONTROL.hasError('noMenosUno');
      return ERROR_NO_MENOS_UNO && CONTROL.touched;
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  changeRegimen(cveRegimen?: string): void {
    const SELECTED_REGIMEN = this.datosRegimen.get('regimenMercancia')?.value;
    this.tramite130118Store.setRegimenMercancia(SELECTED_REGIMEN);

    const CLASIFI_CONTROL = this.datosRegimen.get('clasifiRegimen');

    if (SELECTED_REGIMEN !== null) {
      this.regimenService.getRegimenesCve(SELECTED_REGIMEN).subscribe({
        next: (response) => {
          this.clasifiRegimen = response.datos || [];

          
          const CLASIFI_GUARDADO = cveRegimen || this.solicitudState?.clasifiRegimen || null;
          CLASIFI_CONTROL?.setValue(CLASIFI_GUARDADO);
        },
        error: (error) => {
          console.error('Error al obtener clasificación de régimen:', error);
          this.clasifiRegimen = [];
         
          const CLASIFI_GUARDADO = this.solicitudState?.clasifiRegimen || null;
          CLASIFI_CONTROL?.setValue(CLASIFI_GUARDADO);
        }
      });
    } else {
      this.clasifiRegimen = [];
     
      CLASIFI_CONTROL?.setValue(null); // <- aquí también ajustas
    }
  }



  // eslint-disable-next-line class-methods-use-this
  changeEntidad(cveEntidad?: string): void {
    const SELECTED_ESTADO = this.registroFederal.get('estado')?.value;

    // Guarda el estado seleccionado en el store
    this.tramite130118Store.setEstado(SELECTED_ESTADO);

    const FEDERAL_CONTROL = this.registroFederal.get('representacionFederal');

    if (SELECTED_ESTADO && SELECTED_ESTADO !== null) {
      this.entidadesFederativasService.getEntidadesCve(SELECTED_ESTADO).subscribe({
        next: (response) => {
          this.representacionFederal = response.datos || [];

         
          // Obtener valor guardado (si existe)
          const REPRESENTACION_GUARDADA = cveEntidad || this.solicitudState?.representacionFederal;

          // Si hay una representación federal guardada, la establece; de lo contrario, la deshabilita
          if (REPRESENTACION_GUARDADA && REPRESENTACION_GUARDADA !== null) {
            FEDERAL_CONTROL?.setValue(REPRESENTACION_GUARDADA);
          } else {
            FEDERAL_CONTROL?.setValue(null);
          }
        },
        error: (error) => {
          console.error('Error al obtener representación federal:', error);
          this.representacionFederal = [];
          FEDERAL_CONTROL?.setValue(null);
        }
      });
    } else {
      this.representacionFederal = [];
      FEDERAL_CONTROL?.setValue(null);
    }
  }


  // eslint-disable-next-line class-methods-use-this
  fraccionArancelariaChange(cveUmt?: string, cveNico?: string, razonSocial?: string): void {
    const SELECTED_FRACCION = this.datosMercancia.get('fraccionArancelaria')?.value;

    // Guardar en el store
    this.tramite130118Store.setFraccionArancelaria(SELECTED_FRACCION);
    this.tramite130118Store.setNico(null);

    const NICO_CONTROL = this.datosMercancia.get('nico');
    const UMT_CONTROL = this.datosMercancia.get('unidadMedidaTarifaria');

    if (SELECTED_FRACCION && SELECTED_FRACCION !== null) {
      // 1. Verificar si se debe habilitar el combo de molinos
      this.guardarService.getMolinosHabilitar(SELECTED_FRACCION).subscribe({
        next: (response) => {
          const DEBE_HABILITAR_MOLINOS = response.datos === true;
          this.mostrarComboMolinos = DEBE_HABILITAR_MOLINOS;

          if (DEBE_HABILITAR_MOLINOS) {
            // Desactivar nombre completo
            this.FormSolicitud.get('datosProducto.nombre')?.disable();
            this.FormSolicitud.get('datosProducto.apellidoPaterno')?.disable();
            this.FormSolicitud.get('datosProducto.apellidoMaterno')?.disable();

            this.FormSolicitud.get('datosProducto.nombre')?.setValue(null);
            this.FormSolicitud.get('datosProducto.apellidoPaterno')?.setValue(null);
            this.FormSolicitud.get('datosProducto.apellidoMaterno')?.setValue(null);
            this.FormSolicitud.get('datosProducto.tipoPersona')?.setValue('');

            const TIPO_PERSONA_CTRL = this.FormSolicitud.get('datosProducto.tipoPersona');
            TIPO_PERSONA_CTRL?.clearValidators();
            TIPO_PERSONA_CTRL?.setValue(null);
            TIPO_PERSONA_CTRL?.updateValueAndValidity();
            this.tramite130118Store.setTipoPersona('');




            // Limpiar store (akita)
            this.tramite130118Store.setNombre('');
            this.tramite130118Store.setApellidoPaterno('');
            this.tramite130118Store.setApellidoMaterno('');

            // Activar razón social
            if (!razonSocial) {
              this.FormSolicitud.get('datosProducto.razonSocial')?.enable();
            }

            this.isVisibleFisica = false;
            this.isVisibleMoral = false;
            // 2. Obtener lista de molinos activos
            this.catMolinoService.getMolinosActivos().subscribe({
              next: (molinosResponse) => {
                this.molinos = molinosResponse.datos || [];
              },
              error: (err) => {
                console.error('Error al obtener molinos activos:', err);
                this.molinos = [];
              }
            });
          } else {

            this.mostrarComboMolinos = false;

            const TIPO_PERSONA_CTRL = this.FormSolicitud.get('datosProducto.tipoPersona');
            TIPO_PERSONA_CTRL?.setValidators([Validators.required]);
            TIPO_PERSONA_CTRL?.updateValueAndValidity();

            if (this.ocultarForm === false) {
              this.FormSolicitud.get('datosProducto.nombre')?.enable();
              this.FormSolicitud.get('datosProducto.apellidoPaterno')?.enable();
              this.FormSolicitud.get('datosProducto.apellidoMaterno')?.enable();
            }
          }
        },
        error: (err) => {
          console.error('Error al verificar habilitación de molinos:', err);
          this.mostrarComboMolinos = false;
        }
      });

      // 3. Obtener Nico
      this.fraccionArancelariaService.getNico(SELECTED_FRACCION).subscribe({
        next: (response) => {
          this.nico = response.datos || [];
          const VALOR = cveNico ?? this.solicitudState?.nico ?? null;
          const FORCE_DISABLE = Boolean(cveNico);
          this.toggleControl(NICO_CONTROL, this.nico.length > 0, VALOR, FORCE_DISABLE);
        },
        error: (error) => {
          console.error('Error al obtener Nico:', error);
          this.toggleControl(NICO_CONTROL, false, this.solicitudState?.nico || null);
        }
      });

      // 4. Obtener unidad medida tarifaria
      this.fraccionArancelariaService.getFraccionesCve(SELECTED_FRACCION).subscribe({
        next: (response) => {
          this.unidadMedidaTarifaria = response.datos || [];
          const VALOR = cveUmt ?? this.solicitudState?.unidadMedidaTarifaria ?? (this.unidadMedidaTarifaria.length > 0 ? this.unidadMedidaTarifaria[0].clave : null);
          const FORCE_DISABLE = Boolean(cveUmt);
          this.toggleControl(UMT_CONTROL, this.unidadMedidaTarifaria.length > 0, VALOR, FORCE_DISABLE);
        },
        error: (error) => {
          console.error('Error al obtener unidad medida:', error);
          this.toggleControl(UMT_CONTROL, false, this.solicitudState?.unidadMedidaTarifaria || null);
        }
      });

    } else {
      // Si no hay fracción seleccionada
      this.nico = [];
      this.unidadMedidaTarifaria = [];
      this.resetControl(NICO_CONTROL);
      this.resetControl(UMT_CONTROL);
      this.mostrarComboMolinos = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  toggleControl(control: AbstractControl | null, enable: boolean, value: any, forceDisable = false): void {
    if (!control) { return; }

    control.setValue(value);

    if (forceDisable) {
      control.setValue(value);
    } else {
      if (!enable) {
        control.setValue(null);
      } 
    }
  }

  // eslint-disable-next-line class-methods-use-this
  resetControl(control: AbstractControl | null): void {
    if (!control) { return; }
    control.setValue(null);
    control.disable();
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