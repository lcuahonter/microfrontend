import { INSTRUCCION_DOBLE_CLIC, MEDIO_SERVICIO, MercanciaDatosInfo } from '../../constantes/acuicola.enum';

import { AlertComponent, Catalogo, CatalogoSelectComponent, CatalogosSelect,InputFecha, InputFechaComponent,InputRadioComponent, SeccionLibState, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosDeLaSolicitudInt, InspeccionApiResponse} from '../../modelos/acuicola.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import{CertificadosResponse} from '../../modelos/acuicola.model';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../modelos/configuracion-columna.model';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TEXTOS_220702 } from '../../constantes/acuicola.enum';
import { TramiteState } from '../../estados/tramite220702.store';
import { TramiteStore } from '../../estados/tramite220702.store';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';

@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss'
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para capturar los datos de la solicitud.
   * @type {FormGroup}
   */
  datosDeLaSolicitudForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   * @type {DatosDeLaSolicitudInt}
   */
  solicitudState!: DatosDeLaSolicitudInt;

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
   * Tipo de selección en la tabla (casilla de verificación).
   * @type {TablaSeleccion}
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

    /**
   * Valor seleccionado del radio.
   */
    valorSeleccionado!: string|null;


  /**
   * Catálogo de horas de inspección.
   * @type {CatalogosSelect}
   */
  horaDeInspeccion: CatalogosSelect={
    labelNombre: '',
    required: true,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de aduanas de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaDeIngreso: CatalogosSelect={
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de oficinas de inspección.
   * @type {CatalogosSelect}
   */
  oficinaDeInspeccion: CatalogosSelect={
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de puntos de inspección.
   * @type {CatalogosSelect}
   */
  puntoDeInspeccion:CatalogosSelect={
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de tipos de contenedores.
   * @type {CatalogosSelect}
   */
  tipoContenedor: CatalogosSelect={
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de medios de transporte.
   * @type {CatalogosSelect}
   */
  medioDeTransporte: CatalogosSelect={
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };
  /**
   * Opciones para el campo de selección de radio.
   * @type {Array<{ label: string, value: string }>}
   */
  radioOpcions = [
    { label: 'Sí', value: 'sí' },
    { label: 'No', value: 'no' },
  ];

  /**
   * Cambia el valor seleccionado del radio.
   * @param value Valor seleccionado.
   */
  cambiarRadio(value: string | number):void {
    this.valorSeleccionado = value as string;
    this.tramiteStore.setEsSolicitudFerros(this.valorSeleccionado);
  }

  /**
   * Textos estáticos utilizados en el componente.
   * @type {Object}
   */
  TEXTOS = TEXTOS_220702;


  /**
   * Estado actual del trámite.
   * 
   * @remarks
   * Esta propiedad almacena la información relacionada con el estado del trámite en curso.
   * Se inicializa como un objeto vacío del tipo `TramiteState`.
   */
  tramiteState: TramiteState={} as TramiteState;

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
  
  fechaInicioInput: InputFecha = {
    labelNombre: 'Fecha de Inicio de Vigencia',
    required: false,
    habilitado: false,
  };
  /**
   * Configuración del campo de fecha de fin de vigencia.
   * @type {InputFecha}
   */
  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de inspección ',
    required: true,
    habilitado: true,
  };

  /**
   * Maneja los cambios en el campo de fecha de inicio.
   * @param nuevo_valor El nuevo valor de fecha seleccionado.
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.tramiteStore.setFechaDeInspeccion(nuevo_valor);
   
  }
  /**

  
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
   campoDeshabilitar:boolean= false;

   /**
    * Valor por defecto para esSolicitudFerros en modo consulta.
    * @property {string} defaultEsSolicitudFerros
    */
   defaultEsSolicitudFerros: string = 'no';
 
  

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {FitosanitarioService} fitosanitarioService - Servicio para obtener datos relacionados con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   * @param {SeccionLibQuery} seccionQuery - Query para acceder al estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de la sección.
   *
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly fitosanitarioService: FitosanitarioService,
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
          this.inicializarEstadoFormulario();
        })
      ).subscribe();
   }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.iniciarFormulario();
    }  

  }


  /**
   * Método que se ejecuta al inicializar el componente.
   * Aquí se configuran las suscripciones a los estados y se inicializa el formulario.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getHoraDeInspeccion();
    this.cargarDatos();
    this.getAduanaDeIngreso();
    this.getOficinaDeInspeccion();
    this.getPuntoDeInspeccion();
    this.getTipoContenedor();
    this.obtenerResponsableDatos();
    this.getMedioDeTransporte();
    this.getDatos();

     
    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.valorSeleccionado=datos.valorSeleccionado
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
          esSolicitudFerros: datos.esSolicitudFerros,
          fechaDeInspeccion: datos.fechaDeInspeccion
        });
      })
    )
    .subscribe();

  }

  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.iniciarFormulario();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
      this.datosDeLaSolicitudForm.disable();
    } else {
      this.campoDeshabilitar=false;
      this.datosDeLaSolicitudForm.enable();
      // El campo esSolicitudFerros debe permanecer deshabilitado en el flujo regular
      this.datosDeLaSolicitudForm.get('esSolicitudFerros')?.disable();
    }


}
  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   * @method iniciarFormulario
   * @returns {void}
   */
  iniciarFormulario(): void {
    // Establecer valor por defecto 'no' para esSolicitudFerros si no hay valor previo
    const ES_SOLICITUD_FERROS_VALUE = this.tramiteState.esSolicitudFerros || this.defaultEsSolicitudFerros;

    this.datosDeLaSolicitudForm = this.fb.group({
      justificacion: [{value:this.tramiteState.justificacion}, Validators.required],
      certificadosAutorizados: [{ value:this.tramiteState.certificadosAutorizados, disabled: true }, Validators.required],
      horaDeInspeccion: [{value:this.tramiteState.horaDeInspeccion}, Validators.required],
      aduanaDeIngreso: [{value:this.tramiteState.aduanaDeIngreso}, Validators.required],
      oficinaDeInspeccion: [{value:this.tramiteState.oficinaDeInspeccion}, Validators.required],
      puntoDeInspeccion: [{value:this.tramiteState.puntoDeInspeccion}, Validators.required],
      nombreInspector: [{value:this.tramiteState.nombreInspector, disabled: true }, Validators.required],
      primerApellido: [{ value:this.tramiteState.primerApellido, disabled: true }, Validators.required],
      segundoApellido: [{ value: this.tramiteState.segundoApellido, disabled: true }, Validators.required],
      cantidadContenedores: [{ value: this.tramiteState.cantidadContenedores, disabled: true }, Validators.required],
      tipoContenedor: [{value:this.tramiteState.tipoContenedor}, Validators.required],
      medioDeTransporte: [{value:this.tramiteState.medioDeTransporte}, Validators.required],
      identificacionTransporte: [{value:this.tramiteState.identificacionTransporte}, Validators.required],
      esSolicitudFerros: [{value: ES_SOLICITUD_FERROS_VALUE, disabled: true}, Validators.required],
      fechaDeInspeccion: [{value:this.tramiteState.fechaDeInspeccion}, Validators.required]
    });

    // Establecer 'no' como valor por defecto si no hay valor previo
    if (!this.tramiteState.esSolicitudFerros) {
      this.tramiteStore.setEsSolicitudFerros(this.defaultEsSolicitudFerros);
      this.valorSeleccionado = this.defaultEsSolicitudFerros;
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
   * Carga los datos de los certificados desde el servicio.
   * @method cargarDatos
   * @returns {void}
   */
  cargarDatos(): void {
    this.fitosanitarioService
      .obtenerDatosCertificados()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: CertificadosResponse) => {
      this.tramiteStore.setCertificadosAutorizados(data.data.certificadosAutorizados);
      })
  }

  /**
   * Obtiene las horas de inspección desde el servicio.
   * @method getHoraDeInspeccion
   * @returns {void}
   */
  getHoraDeInspeccion(): void {
    this.fitosanitarioService.getHoraDeInspeccion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.horaDeInspeccion = {
          labelNombre: 'Hora de inspección*',
          required: true,
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
    this.fitosanitarioService.getAduanaDeIngreso()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
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
   * Obtiene los datos de la mercancía desde el servicio.
   * @method getDatos
   * @returns {void}
   */

  getDatos(): void {
    this.fitosanitarioService.getDatosDeLaMercancia()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.mercanciaDatos = RESPONSE;
      }
    });
  }

  /**
   * Obtiene las oficinas de inspección desde el servicio.
   * @method getOficinaDeInspeccion
   * @returns {void}
   */
  getOficinaDeInspeccion(): void {
    this.fitosanitarioService.getOficinaDeInspeccion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
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
    this.fitosanitarioService.getPuntoDeInspeccion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
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
    this.fitosanitarioService.getTipoContenedor()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
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
    this.fitosanitarioService.getMedioDeTransporte()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
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
    this.fitosanitarioService
      .obtenerResponsableDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: InspeccionApiResponse) => {
        this.tramiteStore.setNombreInspector(data.data.nombreInspector);
        this.tramiteStore.setPrimerApellido(data.data.primerApellido);
        this.tramiteStore.setSegundoApellido(data.data.segundoApellido);
        this.tramiteStore.setCantidadContenedores(data.data.cantidadContenedores);
      })
  }

  /**
   * Maneja el cambio en la identificación del transporte.
   * @method cambioIdentificacionTransporte
   * @param {Event} event - Evento de cambio.
   * @returns {void}
   */
  cambioIdentificacionTransporte(event:Event):void{
    const IDENTIFICACION = (event.target as HTMLInputElement).value;
    this.tramiteStore.setIdentificacionTransporte(IDENTIFICACION);
  }
   
  /**
   * Maneja el cambio en el tipo de contenedor.
   * @method cambioTipoContenedor
   * @param {Catalogo} event - Evento de cambio.
   * @returns {void}
   */

  cambioTipoContenedor(event:Catalogo):void{
    this.tramiteStore.setTipoContenedor(event.id);
  }

  /**
   * Maneja el cambio en la justificación.
   * @method cambioJustificacion
   * @param {Event} event - Evento de cambio.
   * @returns {void}
   */
  cambioJustificacion(event:Event):void{
    const JUSTIFICACION = (event.target as HTMLInputElement).value;
    this.tramiteStore.setJustificacion(JUSTIFICACION);
  }

   /**
   * Maneja el cambio en la fecha de inicio.
   * @method cambioFechaInicio
   * @param {Event} event - Evento de cambio.
   * @returns {void}
   */

   
  /**
   * Maneja el cambio en la aduana de ingreso.
   * @method cambioAduanaDeIngreso
   * @param {Catalogo} event - Evento de cambio.
   * @returns {void}
   */
  cambioAduanaDeIngreso(event:Catalogo):void{
    this.tramiteStore.setAduanaDeIngreso(event.id);
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
