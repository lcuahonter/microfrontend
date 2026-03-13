import { AlertComponent, Catalogo, CatalogoSelectComponent, CatalogosSelect, InputFecha, InputFechaComponent, SeccionLibState, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosDelTramite, ResponsableInspeccion } from '../../modelos/acuicola.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INSTRUCCION_DOBLE_CLIC, MEDIO_SERVICIO, MercanciaDatosInfo } from '../../constantes/acuicola.enum';
import { map, takeUntil } from 'rxjs';
import { AcuicolaService } from '../../service/acuicola.service';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../modelos/configuracio-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TEXTOS_220703 } from '../../constantes/acuicola.enum';
import { TramiteState } from '../../estados/tramite220703.store';
import { TramiteStore } from '../../estados/tramite220703.store';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';

/**
 * Configuración del campo de fecha de inspección.
 * Define las propiedades para el componente de entrada de fecha, incluyendo
 * el nombre de la etiqueta, si es requerido y si está habilitado.
 * 
 * @constant {Object} FECHA_INSPECCION
 * @property {string} labelNombre - Texto que se muestra como etiqueta del campo
 * @property {boolean} required - Indica si el campo es obligatorio
 * @property {boolean} habilitado - Indica si el campo está habilitado para edición
 */
export const FECHA_INSPECCION = {
  labelNombre: 'Fecha de inspección',
  required: true,
  habilitado: true,
};

@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    InputFechaComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss'
})

export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
    * Configuración de las fechas de inicio y fin.
    * @type {InputFecha}
    */
  public fechaInspeccionInput: InputFecha = FECHA_INSPECCION;

  /**
   * Formulario reactivo para capturar los datos de la solicitud.
   * @type {FormGroup}
   */
  datosDeLaSolicitudForm!: FormGroup;

  /**
   * Indica si la sección colapsable está abierta o cerrada.
   * @type {boolean}
   */
  colapsable: boolean = false;

  /**
   * Instrucción para el usuario sobre cómo interactuar con la tabla.
   * @type {string}
   */
  instruccionDobleClic: string = INSTRUCCION_DOBLE_CLIC;

  /**
   * Tipo de selección en la tabla (checkbox).
   * @type {TablaSeleccion}
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Catálogo de horas de inspección.
   * @type {CatalogosSelect}
   */
  horaDeInspeccion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de aduanas de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaDeIngreso: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de oficinas de inspección.
   * @type {CatalogosSelect}
   */
  oficinaDeInspeccion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de puntos de inspección.
   * @type {CatalogosSelect}
   */
  puntoDeInspeccion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de tipos de contenedores.
   * @type {CatalogosSelect}
   */
  tipoContenedor: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de medios de transporte.
   * @type {CatalogosSelect}
   */
  medioDeTransporte: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Textos estáticos utilizados en el componente.
   * @type {Object}
   */
  TEXTOS = TEXTOS_220703;

  /**
   * @type {TramiteState}
   * @description Variable que almacena el estado inicial de un trámite. Se inicializa como un objeto vacío y se fuerza su tipo a TramiteState.
   */
  tramiteState: TramiteState = {} as TramiteState;

  /**
   * Configuración de columnas para la tabla de medios de servicio.
   * @type {ConfiguracionColumna<MercanciaDatosInfo>[]}
   */
  exportadorTabla: ConfiguracionColumna<MercanciaDatosInfo>[] = MEDIO_SERVICIO;

  /**
   * Datos de la mercancía para la tabla.
   * @type {MercanciaDatosInfo[]}
   */
  mercanciaDatos: MercanciaDatosInfo[] = [];

  /**
   * Configuración del campo de fecha de inicio.
   * @type {InputFecha}
   */

  /**
   * Subject para notificar la destrucción del componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la sección actual.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el campo debe ser deshabilitado.
   * @property {boolean} campoDeshabilitar
   */
  campoDeshabilitar: boolean = true;

  /**
   * Indica si la selección de la tabla debe ser deshabilitada.
   * @property {boolean} deshabilitarSeleccionTabla
   */
  deshabilitarSeleccionTabla: boolean = false;

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {AcuicolaService} acuicolaService - Servicio para obtener datos relacionados con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   * @param {SeccionLibQuery} seccionQuery - Query para acceder al estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de la sección.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de la consulta actual.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly acuicolaService: AcuicolaService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private readonly consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          // Aplicar modo después de que el formulario sea inicializado y los valores sean aplicados
          if (this.datosDeLaSolicitudForm) {
            this.aplicarModoFormulario();
          }
        })
      ).subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Aquí se configuran las suscripciones a los estados y se inicializa el formulario.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.iniciarFormulario(); // Inicializar formulario una vez
    this.getHoraDeInspeccion();
    this.cargarDatos();
    this.getAduanaDeIngreso();
    this.getOficinaDeInspeccion();
    this.getPuntoDeInspeccion();
    this.getTipoContenedor();
    this.obtenerResponsableDatos();
    this.getMedioDeTransporte();
    this.getMercanciaDatos();

    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.datosDeLaSolicitudForm.patchValue({
          justificacion: datos.justificacion,
          certificadosAutorizados: datos.certificadosAutorizados,
          horaDeInspeccion: datos.horaDeInspeccion,
          aduanaDeIngreso: datos.aduanaDeIngreso,
          oficinaDeInspeccion: datos.oficinaDeInspeccion,
          puntoDeInspeccion: datos.puntoDeInspeccion,
          nombreInspector: datos.nombreInspector,
          primerApellido: datos.primerApellido,
          segundoApellido: datos.segundoApellido,
          cantidadContenedores: datos.cantidadContenedores,
          tipoContenedor: datos.tipoContenedor,
          medioDeTransporte: datos.medioDeTransporte,
          identificacionTransporte: datos.identificacionTransporte,
          fechaDeInspeccion: datos.fechaDeInspeccion
        });
        // Siempre establecer esSolicitudFerros a "0" (No) y mantenerlo deshabilitado
        this.datosDeLaSolicitudForm.get('esSolicitudFerros')?.setValue("0");
        this.datosDeLaSolicitudForm.get('esSolicitudFerros')?.disable();
        
        // Aplicar configuraciones de modo solo lectura después de aplicar valores
        this.aplicarModoFormulario();
      })
    )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   * @method iniciarFormulario
   * @returns {void}
   */
  iniciarFormulario(): void {
    this.datosDeLaSolicitudForm = this.fb.group({
      justificacion: ['', Validators.required],
      certificadosAutorizados: [{ value: '', disabled: true }, Validators.required],
      horaDeInspeccion: ['', Validators.required],
      aduanaDeIngreso: ['', Validators.required],
      oficinaDeInspeccion: ['', Validators.required],
      puntoDeInspeccion: ['', Validators.required],
      nombreInspector: [{ value: '', disabled: true }, Validators.required],
      primerApellido: [{ value: '', disabled: true }, Validators.required],
      segundoApellido: [{ value: '', disabled: true }, Validators.required],
      cantidadContenedores: [{ value: '', disabled: true }, Validators.required],
      tipoContenedor: ['', Validators.required],
      medioDeTransporte: ['', Validators.required],
      identificacionTransporte: ['', Validators.required],
      esSolicitudFerros: [{ value: "0", disabled: true }, Validators.required],
      fechaDeInspeccion: [{ value: '', disabled: true }, Validators.required]
    });
  }

  /**
   * Aplica la configuración del modo de formulario (solo lectura o editable).
   * @method aplicarModoFormulario
   * @returns {void}
   */
  aplicarModoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar = true;
      this.deshabilitarSeleccionTabla = true; // Deshabilitar selección de tabla en modo consulta
      this.datosDeLaSolicitudForm.disable();
    } else {
      this.campoDeshabilitar = true; // Mantener fechaDeInspeccion deshabilitada por defecto
      this.deshabilitarSeleccionTabla = false; // Habilitar selección de tabla en modo edición
      this.datosDeLaSolicitudForm.enable();
      // Mantener campos específicos deshabilitados incluso cuando el formulario está habilitado
      this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.disable();
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    // Este método ahora está simplificado y solo aplica el modo del formulario
    // La inicialización del formulario ocurre una vez en ngOnInit()
    this.aplicarModoFormulario();
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.iniciarFormulario();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar = true;
      this.deshabilitarSeleccionTabla = true; // Deshabilitar selección de tabla en modo consulta
      this.datosDeLaSolicitudForm.disable();
    } else {
      this.campoDeshabilitar = true; // Mantener fechaDeInspeccion deshabilitada por defecto
      this.deshabilitarSeleccionTabla = false; // Habilitar selección de tabla en modo edición
      this.datosDeLaSolicitudForm.enable();
      // Mantener campos específicos deshabilitados incluso cuando el formulario está habilitado
      this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.disable();
    }
  }

  /**
   * Alterna la visibilidad de la sección colapsable.
   * @method mostrarColapsable
   * @returns {void}
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Actualiza la fecha de inspección en el formulario y store.
   * @param {string} nuevo_valor - Nueva fecha de inspección.
   */
  cambioFechaInspeccion(nuevo_valor: string): void {
    this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.setValue(nuevo_valor);
    this.tramiteStore.setFechaDeInspeccion(nuevo_valor);
    this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.markAsUntouched();
  }

  /**
   * Maneja el cambio de la aduana de ingreso seleccionada.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID de la aduana.
   * @returns {void}
   */
  cambioAduanaDeIngreso(event: Catalogo): void {
    this.tramiteStore.setAduanaDeIngreso(event.id);
  }

  /**
   * Maneja el cambio de la fecha de inicio y actualiza el store correspondiente.
   * @param {string} nuevo_valor - Nueva fecha de inicio seleccionada.
   * @returns {void}
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.tramiteStore.setFechaDeInspeccion(nuevo_valor);
  }

  /**
   * Maneja el cambio del punto de inspección seleccionado y actualiza el store.
   * @param {Catalogo} event - Objeto de tipo Catalogo que contiene el ID del punto de inspección.
   * @returns {void}
   */
  cambioPuntoDeInspeccion(event: Catalogo): void {
    this.tramiteStore.setPuntoDeInspeccion(event.id);
  }

  /**
   * Maneja el cambio del tipo de contenedor seleccionado.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID del tipo de contenedor.
   * @returns {void}
   */
  cambioTipoContenedor(event: Catalogo): void {
    this.tramiteStore.setTipoContenedor(event.id);
  }

  /**
   * Maneja el cambio en la identificación del transporte.
   * @param {Event} event - El evento de cambio generado por el input.
   * @returns {void}
   */
  cambioIdentificacionTransporte(event: Event): void {
    const IDENTIFICACION = (event.target as HTMLInputElement).value;
    this.tramiteStore.setIdentificacionTransporte(IDENTIFICACION);
  }

  /**
   * Maneja el cambio en la justificación proporcionada.
   * @param {Event} event - El evento de cambio generado por el input.
   * @returns {void}
   */
  cambioJustificacion(event: Event): void {
    const JUSTIFICACION = (event.target as HTMLInputElement).value;
    this.tramiteStore.setJustificacion(JUSTIFICACION);
  }

  /**
   * Maneja el cambio en la selección de si es una solicitud Ferros.
   * @param {Event} event - El evento de cambio generado por el input.
   * @returns {void}
   */
  cambioEsSolicitudFerros(event: Event): void {
    const ES_SOLICITUD_FERROS = (event.target as HTMLInputElement).value;
    this.tramiteStore.setEsSolicitudFerros(ES_SOLICITUD_FERROS);
  }

  /**
   * Carga los datos de los certificados desde el servicio.
   * @method cargarDatos
   * @returns {void}
   */
  cargarDatos(): void {
    this.acuicolaService
      .obtenerDatosCertificados()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosDelTramite) => {
        this.datosDeLaSolicitudForm.patchValue(data);
        // Asegurar que esSolicitudFerros siempre esté establecido a "0" (No) y deshabilitado
        this.datosDeLaSolicitudForm.get('esSolicitudFerros')?.setValue("0");
        this.datosDeLaSolicitudForm.get('esSolicitudFerros')?.disable();
      })
  }

  /**
   * Obtiene las aduanas de ingreso desde el servicio.
   * @method getMercanciaDatos
   * @returns {void}
   */
  getMercanciaDatos(): void {
    this.acuicolaService.getDatosMercancia()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
        this.mercanciaDatos = data;
      })
  }

  /**
   * Cambia la fecha de inicio de la inspección en el formulario y actualiza el store.
   * @method cambiarFechaInicio
   * @param {string} nuevo_valor - Nueva fecha de inicio a establecer.
   * @returns {void}
   */
  public cambiarFechaInicio(nuevo_valor: string): void {
    this.datosDeLaSolicitudForm.patchValue({
      fechaDeInspeccion: nuevo_valor,
    });
    this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.setValue(nuevo_valor);
    this.datosDeLaSolicitudForm.get('fechaDeInspeccion')?.markAsUntouched();
    // Actualizar el store con el nuevo valor de fechaDeInspeccion
    this.tramiteStore.setFechaDeInspeccion(nuevo_valor);
  }

  /**
   * Obtiene las horas de inspección desde el servicio.
   * @method getHoraDeInspeccion
   * @returns {void}
   */
  getHoraDeInspeccion(): void {
    this.acuicolaService.getHoraDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.horaDeInspeccion = {
            labelNombre: 'Hora de inspección*',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      })
  }

  /**
   * Obtiene las aduanas de ingreso desde el servicio.
   * @method getAduanaDeIngreso
   * @returns {void}
   */
  getAduanaDeIngreso(): void {
    this.acuicolaService.getAduanaDeIngreso()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.aduanaDeIngreso = {
            labelNombre: 'Aduana de ingreso',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene las oficinas de inspección desde el servicio.
   * @method getOficinaDeInspeccion
   * @returns {void}
   */
  getOficinaDeInspeccion(): void {
    this.acuicolaService.getOficinaDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.oficinaDeInspeccion = {
            labelNombre: 'Oficina de inspección de Sanidad Agropecuaria',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los puntos de inspección desde el servicio.
   * @method getPuntoDeInspeccion
   * @returns {void}
   */
  getPuntoDeInspeccion(): void {
    this.acuicolaService.getPuntoDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.puntoDeInspeccion = {
            labelNombre: 'Punto de inspección',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los tipos de contenedores desde el servicio.
   * @method getTipoContenedor
   * @returns {void}
   */
  getTipoContenedor(): void {
    this.acuicolaService.getTipoContenedor()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.tipoContenedor = {
            labelNombre: 'Tipo contenedor',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los medios de transporte desde el servicio.
   * @method getMedioDeTransporte
   * @returns {void}
   */
  getMedioDeTransporte(): void {
    this.acuicolaService.getMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.medioDeTransporte = {
            labelNombre: 'Medio de transporte*',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los datos del responsable de la inspección desde el servicio.
   * @method obtenerResponsableDatos
   * @returns {void}
   */
  obtenerResponsableDatos(): void {
    this.acuicolaService
      .obtenerResponsableDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: ResponsableInspeccion) => {
        this.datosDeLaSolicitudForm.patchValue(data);
      })
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Aquí se desuscriben los observables para evitar fugas de memoria.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }
}
