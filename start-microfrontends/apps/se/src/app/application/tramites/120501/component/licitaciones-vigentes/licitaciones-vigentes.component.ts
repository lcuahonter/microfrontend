import { AccionBoton, AlertComponent, Catalogo, CatalogoSelectComponent, DatosPasos, JSONResponse, ListaPasosWizard, LoginQuery, PASOS, TablaDinamicaComponent, TablaSeleccion, TableData, TituloComponent, WizardComponent, convertirFechaDdMmYyyyAMoment, formatDateToDDMMYYYY } from '@libs/shared/data-access-user/src';
import { CONFIGURACION_ACCIONISTAS, CONFIGURACION_ACCIONISTAS_TABLA, ID_PROCEDIMIENTO } from '../../constantes/cupos-constantes.enum';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JSONLicitacionesResponse, LicitacionResponse, LicitacionesResponse, ParticipanteLicitacion, ParticipantesData } from '../../models/solicitud.model';
import { Solicitud120501State, Tramite120501Store } from '../../estados/tramites/tramite120501.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { LicitacionesDisponiblesService } from '../../services/licitaciones-disponibles.service';
import { Tramite120501Query } from '../../estados/queries/tramite120501.query';
/**
 * Componente para mostrar las licitaciones vigentes.
 *
 * Este componente maneja la visualización y la lógica de las licitaciones vigentes,
 * incluyendo la interacción con un formulario, tablas de datos y un asistente (wizard).
 */
@Component({
  selector: 'app-licitaciones-vigentes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, AlertComponent, TablaDinamicaComponent],
  templateUrl: './licitaciones-vigentes.component.html',
  styleUrls: ['./licitaciones-vigentes.component.scss'],
})
export class LicitacionesVigentesComponent implements OnInit, OnDestroy {
  /**
   * Datos del encabezado de la tabla.
   */
  tableHeaderData: string[] = [];
  /**
   * Datos del cuerpo de la tabla.
   */
  tableBodyData: { tbodyData: string[] }[] = [];
  /**
   * Indica si la barra de desplazamiento está habilitada.
   */
  enableScrollbar: boolean = false;
  /**
   * Lista de pasos para el asistente (wizard).
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * Índice actual del paso en el asistente.
   */
  indice: number = 1;
  /**
   * Opciones para la tabla.
   */
  tableOptions = {
    checkbox: false
  };
  /**
   * Texto de mensaje.
   */
  texto: string = 'La solicitud ha quedado registrada con el número temporal 202758644. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';
  /**
   * Estado de la selección de radio en la tabla.
   */
  tableRadio = TablaSeleccion.UNDEFINED;
  /**
   * Fila seleccionada en la tabla.
   */
  selectedRow = 1;
  /**
   * Configuración para la tabla de accionistas.
   */
  configTableArray = CONFIGURACION_ACCIONISTAS_TABLA;

  /**
   * Configuración para la tabla de accionistas.
   */
  configParticipantesTable = CONFIGURACION_ACCIONISTAS;

  /**
   * Datos de ejemplo para la tabla.
   */
  licitacionTablaDatos: LicitacionResponse[] = [];

  /**
  * Datos de ejemplo para la tabla.
  */
  datosParticipantes: ParticipanteLicitacion[] = []

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Formulario para el recuento total de filas.
   */
  formForTotalCount!: FormGroup;
  /**
   * Formulario principal.
   */
  formulario!: FormGroup;
  /**
   * Formulario para el detalle de la licitación.
   */
  detalledelaLicitacionForm!: FormGroup;
  /**
   * Formulario para el adquiriente.
   */
  adquiriente!: FormGroup;
  /**
   * Catálogo de entidades federativas.
   */
  entidadFederativaOptions: Catalogo[] = [];
  /**
   * Catálogo de representaciones federales.
   */
  representacionFederalOptions: Catalogo[] = [];
  /**
   * Datos de la tabla.
   */
  public tableData!: TableData;

  /**
   * Lista de entidades federativas.
   *  LicitacionesVigentesComponent
   * 
   */
  entidadFederativa: Catalogo[] = [];

  /**
   * Lista de representaciones federales.
   * LicitacionesVigentesComponent
   * 
   */
  representacionFederal: Catalogo[] = [];

  /**
   * Subject para la destrucción del componente.
   */
  private destroyed$ = new Subject<void>();
  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Indica si se muestra la representación federal.
   */
  showRepresentacionFederal: boolean = false;

  /**
  * Indica si se muestra la selección de participante.
  */
  showSeleccionarParticipante: boolean = false;

  /**
   * Identificador del procedimiento.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando se establece en `true`, todos los controles del formulario y elementos interactivos
 * se deshabilitan, impidiendo que el usuario realice cambios. Esta propiedad normalmente se
 * configura según el estado de la aplicación, por ejemplo, al visualizar una solicitud enviada
 * o cuando el usuario no tiene permisos de edición.
 */
  esFormularioSoloLectura: boolean = false;

  /**
 * Estado actual de la sección del trámite 120501.
 * Esta propiedad almacena los datos del estado de la sección, obtenidos generalmente
 * desde el store o desde una consulta al backend. Se utiliza para inicializar y actualizar
 * los formularios del componente con los valores correspondientes a la solicitud en curso.
 */
  private seccionState!: Solicitud120501State;
  /**
   * RFC del usuario logueado.
   * Esta propiedad almacena el RFC (Registro Federal de Contribuyentes) del usuario logueado.
   */
  loginRfc: string = '';
  /**
   * Constructor del componente.
   * Servicio para obtener datos de licitaciones disponibles.
   */
  constructor(private service: LicitacionesDisponiblesService,
    private fb: FormBuilder,
    private tramite120501Store: Tramite120501Store,
    private tramite120501Query: Tramite120501Query,
    private consultaioQuery: ConsultaioQuery,
    private loginQuery: LoginQuery) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
    this.tramite120501Query.selectSolicitud$?.pipe(
      takeUntil(this.destroyed$),
      map((state) => {
        this.seccionState = state;
        this.datosParticipantes = this.seccionState?.datosParticipantes || [];
        this.licitacionTablaDatos = this.seccionState.licitacionTablaDatos;
      })
    ).subscribe();
  }
  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getEntidadFederativa();
    this.obtenerDatosDeTabla();
  }
  /**
 * Inicializa los formularios principales del componente con los valores actuales del estado.
 */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.formulario = this.fb.group({
      entidadFederativa: [this.seccionState?.entidadFederativa, Validators.required],
      representacionFederal: [this.seccionState?.representacionFederal, Validators.required],
    });
    this.detalledelaLicitacionForm = this.fb.group({
      numeraDelicitacion: [{ value: this.seccionState?.numeraDelicitacion, disabled: true }, Validators.required],
      fechaDelEventoDelicitacion: [{ value: this.seccionState?.fechaDelEventoDelicitacion, disabled: true }, Validators.required],
      descripcionDelProducto: [{ value: this.seccionState?.descripcionDelProducto, disabled: true }, Validators.required],
      unidadTarifaria: [{ value: this.seccionState?.unidadTarifaria, disabled: true }, Validators.required],
      regimenAduanero: [{ value: this.seccionState?.regimenAduanero, disabled: true }, Validators.required],
      fraccionArancelaria: [{ value: this.seccionState?.fraccionArancelaria, disabled: true }, Validators.required],
      fechaDeiniciodeVigenciadelCupo: [{ value: this.seccionState?.fechaDeiniciodeVigenciadelCupo, disabled: true }, Validators.required],
      fechaDefindeVigenciadelCupo: [{ value: this.seccionState?.fechaDefindeVigenciadelCupo, disabled: true }, Validators.required],
      obserVaciones: [{ value: this.seccionState?.obserVaciones, disabled: true }, Validators.required],
      bloqueComercial: [{ value: this.seccionState?.bloqueComercial, disabled: true }, Validators.required],
      paises: [{ value: this.seccionState?.paises, disabled: true }, Validators.required],
      montoadJudicado: [{ value: this.seccionState?.montoadJudicado, disabled: true }, Validators.required],
      montoDisponible: [{ value: this.seccionState?.montoDisponible, disabled: true }, Validators.required],
      montoMaximo: [{ value: this.seccionState?.montoMaximo, disabled: true }, Validators.required],
    })
    this.adquiriente = this.fb.group({
      rfc: [{ value: this.seccionState?.rfc, disabled: false }, Validators.required],
      adquirienteMontoDisponible: [{ value: this.seccionState?.adquirienteMontoDisponible, disabled: true }],
      montoRecibir: [this.seccionState?.montoRecibir, Validators.required],
      rfc1: [this.seccionState?.rfc1],
    })
  }


  /**
   * Suscribe al observable `selectSolicitud$` del query `tramite120501Query` para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite120501Query.selectSolicitud$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Solicitud120501State) => {
        this.seccionState = data;
      });
  }
  /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }
  /**
 * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
 *
 * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
 * o los habilita si está en modo edición.
 */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
      this.detalledelaLicitacionForm.disable();
      this.adquiriente.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formulario.enable();
      this.detalledelaLicitacionForm.enable();
      this.adquiriente.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Obtiene la lista de entidades federativas.
   */
  getEntidadFederativa(): void {
    this.service.entidadesFederativasCatalogo(ID_PROCEDIMIENTO.toString()).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data) => {
        if (data.codigo === "00") {
          this.entidadFederativaOptions = data.datos as Catalogo[];
        }
      }
    );

  }
  /**
     * Obtiene la lista de representaciones federales.
     */
  getRepresentacionFederal(cveEntidad: string): void {
    this.service.representacionFederalCatalogo(ID_PROCEDIMIENTO.toString(), cveEntidad).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data) => {
        if (data.codigo === "00") {
          this.representacionFederalOptions = data.datos as Catalogo[];
        }
      }
    );
  }

  /**
   * Verifica si un control del formulario 'adquiriente' es inválido.
   */
  isInvalid(id: string): boolean | null {
    const CONTROL = this.adquiriente.get(id);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Método de destrucción del componente.
   *
   * Limpia las suscripciones al Subject `destroyed$`.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  /**
   * Maneja el valor del índice del asistente (wizard) basado en la acción del botón.
   *
   * Objeto que contiene la acción y el valor del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (this.wizardComponent) {
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
  * Obtiene los datos de la tabla desde el servicio.
  *
  * LicitacionesVigentesComponent
  * 
  */
  obtenerDatosDeTabla(): void {
    this.service.getLicitacionesDisponiblesData(this.loginRfc).pipe(
      takeUntil(this.destroyed$)).subscribe((response: JSONResponse) => {
        if (response.codigo === '00') {
          this.licitacionTablaDatos = ((response.datos as unknown) as Record<string, unknown[]>)?.['licitaciones'] as LicitacionResponse[] || [];
          this.tramite120501Store.actualizarEstado({ licitacionTablaDatos: this.licitacionTablaDatos });
        }
      });
  }

  /**
   *  Llena el formulario de detalles de la licitación con los datos obtenidos del servicio.
   * @param idAsignacion  - Identificador de la asignación.
   */
  fillFormLicitacionesFormData(idAsignacion: number): void {
    const REQUEST_DATA = {
      rfc: this.loginRfc,
      idAsignacion: idAsignacion
    }
    this.service.getLicitacionesFormData(REQUEST_DATA).pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        if (response.codigo === '00') {
          this.tramite120501Store.actualizarEstado({ licitacionesDatos: (response as unknown as JSONLicitacionesResponse).datos as LicitacionesResponse });
          this.showRepresentacionFederal = true;
          this.tramite120501Store.actualizarEstado({ idAsignacion: idAsignacion });
          const LICITACION = (response as unknown as JSONLicitacionesResponse).datos;
          this.tramite120501Store.actualizarEstado({ idLicitacion: LICITACION?.idLicitacion || 0 });
          this.tramite120501Store.actualizarEstado({ idMecanismo: LICITACION?.licitacionPublica?.idMecanismoAsignacion || 0 });
          this.datosParticipantes = LICITACION?.participantesLicitacion;
          this.tramite120501Store.actualizarEstado({ datosParticipantes: LICITACION?.participantesLicitacion || [] });
          this.detalledelaLicitacionForm.patchValue({
            numeraDelicitacion: LICITACION?.licitacionPublica.numeroLicitacion,
            fechaDelEventoDelicitacion: LICITACION?.licitacionPublica.fechaConcurso,
            descripcionDelProducto: LICITACION?.licitacionPublica.producto,
            unidadTarifaria: LICITACION?.licitacionPublica.unidadMedidaTarifaria,
            regimenAduanero: LICITACION?.regimen,
            fraccionArancelaria: LICITACION?.fraccionArancelaria,
            fechaDeiniciodeVigenciadelCupo: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION?.licitacionPublica.fechaInicioVigencia)),
            fechaDefindeVigenciadelCupo: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION?.licitacionPublica.fechaFinVigencia)),
            obserVaciones: LICITACION?.licitacionPublica.fundamento,
            bloqueComercial: LICITACION?.licitacionPublica.bloqueComercial,
            paises: LICITACION?.licitacionPublica.paises,
            montoadJudicado: LICITACION?.maximoTransferir,
            montoDisponible: LICITACION?.montoTransferir,
            montoMaximo: LICITACION?.licitacionPublica.cantidadMaxima
          });
        }
      });
  }

  /**
       * Establece los valores en el store del trámite 120501.
       *
       * LicitacionesVigentesComponent
       * El formulario que contiene los valores.
       * El nombre del campo en el formulario.
       * El nombre del método en el store a invocar.
       * 
       */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite120501Store.actualizarEstado({ [campo]: VALOR });
    if (campo === 'entidadFederativa' && this.formulario.get('entidadFederativa')?.value) {
      const CVE_ENTIDAD = this.formulario.get('entidadFederativa')?.value;
      this.getRepresentacionFederal(CVE_ENTIDAD);
    }
  }

  /**
   * Abre el modal para modificar la información.
   *
   * LicitacionesVigentesComponent
   * 
   */
  abrirModificarModal(evento: LicitacionResponse): void {
    if (this.esFormularioSoloLectura) {
      return
    }
    if (evento.idAsignacion) {
      this.fillFormLicitacionesFormData(evento.idAsignacion);
    }
  }

  /**
   * Muestra la sección para seleccionar un participante.
   * Cambia el valor de la propiedad `showSeleccionarParticipante` a `true`,
   * lo que habilita la visualización de la interfaz correspondiente.
   */
  seleccionarParticipante(): void {
    this.showSeleccionarParticipante = true;
  }

  /**
   * Agrega el valor del campo 'rfc1' al array 'datos1'.
   * Si el campo está vacío, no realiza ninguna acción.
   */
  agregarRFC1(): void {
    const RFC1VALUE = this.adquiriente.get('rfc1')?.value;
    if (RFC1VALUE) {
      this.service.fetchRFCData(RFC1VALUE, this.seccionState?.idLicitacion || 0).pipe(takeUntil(this.destroyed$)).subscribe((response: JSONResponse) => {
        if (response.codigo === '00') {
          const DATO = (response.datos as unknown) as ParticipantesData;
          const NEW_PARTICIPANTE: ParticipanteLicitacion = { rfc: DATO.rfc, montoDisponible: DATO.montoAdjudicado };
          const DATOS_PARTICIPANTES = [...this.datosParticipantes, NEW_PARTICIPANTE];
          this.tramite120501Store.actualizarEstado({ datosParticipantes: DATOS_PARTICIPANTES });
        }
      });
    }
  }
  /**
   * Mueve el valor seleccionado de 'datos1' al campo 'rfc'.
   * Índice del elemento seleccionado en el array 'datos1'.
   */
  seleccionarUnoParticipante(selectedEntry: ParticipanteLicitacion): void {
    if (selectedEntry.rfc) {
      this.adquiriente.get('rfc')?.setValue(selectedEntry.rfc);
      this.adquiriente.get('adquirienteMontoDisponible')?.setValue(selectedEntry.montoDisponible)
      this.tramite120501Store.actualizarEstado({ rfc: selectedEntry.rfc });
      this.tramite120501Store.actualizarEstado({ montoDisponible: (selectedEntry.montoDisponible).toString() });
    }
  }

  /**
   *  Valida los formularios principales del componente.
   * @returns  boolean - `true` si todos los formularios son válidos, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    let valid = true;
    if (this.adquiriente.invalid || this.formulario.invalid) {
      this.adquiriente.markAllAsTouched();
      this.formulario.markAllAsTouched();
      valid = false;
    }
    return valid;
  }
}