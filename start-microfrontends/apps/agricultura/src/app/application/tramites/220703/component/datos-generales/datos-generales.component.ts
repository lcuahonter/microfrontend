import { Catalogo, CatalogoSelectComponent, CatalogosSelect, ConfiguracionColumna, InputFecha, SeccionLibQuery, SeccionLibState, SeccionLibStore, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIA_SERVICIO, MercanciaInfo } from '../../constantes/acuicola.enum';
import { TramiteState, TramiteStore } from '../../estados/tramite220703.store';
import { AcuicolaService } from '../../service/acuicola.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de inspección',
  required: true,
  habilitado: true,
};

@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss'
})
export class DatosGeneralesComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para capturar los datos generales de la solicitud.
   * @type {FormGroup}
   */
  datosGeneralesForm!: FormGroup;

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
   * Catálogo de regímenes a los que se destina la mercancía.
   * @type {CatalogosSelect}
   */
  regimenAlQueDestina: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de datos para movilización nacional.
   * @type {CatalogosSelect}
   */
  datosParaMovilizacion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de puntos de verificación federal.
   * @type {CatalogosSelect}
   */
  puntoDeVerificacion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
    * @type {TramiteState}
    * @description Variable que almacena el estado inicial de un trámite. Se inicializa como un objeto vacío y se fuerza su tipo a TramiteState.
    */
  tramiteState: TramiteState = {} as TramiteState;

  /**
   * Configuración de columnas para la tabla de mercancías.
   * @type {ConfiguracionColumna<MercanciaInfo>[]}
   */
  mercanciaTabla: ConfiguracionColumna<MercanciaInfo>[] = MERCANCIA_SERVICIO;

  /**
   * Datos de la mercancía para la tabla.
   * @type {MercanciaInfo[]}
   */
  mercanciaTablaDatos: MercanciaInfo[] = [];

  /**
   * Tipo de selección en la tabla (checkbox).
   * @type {TablaSeleccion}
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Controlador de entrada para la fecha de inicio/pago.
   * @type {InputFecha}
   */
  public fechaInicioInput: InputFecha = FECHA_DE_PAGO;

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
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {AcuicolaService} acuicolaService - Servicio para obtener datos relacionados con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   * @param {SeccionLibQuery} seccionQuery - Query para acceder al estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de la sección.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de la consulta.
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
          this.inicializarEstadoFormulario();
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
    this.inicializarEstadoFormulario();
    this.iniciarFormulario();
    this.getAduanaDeIngreso();
    this.getOficinaDeInspeccion();
    this.getPuntoDeInspeccion();
    this.getRegimenAlQueSeDestinara();
    this.getPuntoDeVerificacion();
    this.getDatosParaMovilizacion();
    this.getMercanciaTablaDatos();

    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.datosGeneralesForm.patchValue({
          aduanaDeIngreso: datos.aduanaDeIngreso,
          oficinaDeInspeccion: datos.oficinaDeInspeccion,
          puntoDeInspeccion: datos.puntoDeInspeccion,
          regimenAlQueDestina: datos.regimenAlQueDestina,
          datosParaMovilizacion: datos.datosParaMovilizacion,
          puntoDeVerificacion: datos.puntoDeVerificacion,
          numeroDeGuia: datos.numeroDeGuia,
          identificacionDelTransporte: datos.identificacionDelTransporte,
          nombreDeLaEmpresaTransportista: datos.nombreDeLaEmpresaTransportista,
          folioDelTramite: datos.folioDelTramite,
        });
      })
    )
      .subscribe();

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
      this.datosGeneralesForm.disable();
    } else {
      this.datosGeneralesForm.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   * @method iniciarFormulario
   * @returns {void}
   */
  iniciarFormulario(): void {
    this.datosGeneralesForm = this.fb.group({
      folioDelTramite: [{ value: this.tramiteState.folioDelTramite, disabled: true }, Validators.required],
      aduanaDeIngreso: [{ value: this.tramiteState.aduanaDeIngreso }, Validators.required],
      oficinaDeInspeccion: [{ value: this.tramiteState.oficinaDeInspeccion }, Validators.required],
      puntoDeInspeccion: [{ value: this.tramiteState.puntoDeInspeccion }, Validators.required],
      numeroDeGuia: [{ value: this.tramiteState.numeroDeGuia, disabled: true }],
      regimenAlQueDestina: [{ value: this.tramiteState.regimenAlQueDestina }, Validators.required],
      datosParaMovilizacion: [{ value: this.tramiteState.datosParaMovilizacion }, Validators.required],
      puntoDeVerificacion: [{ value: this.tramiteState.puntoDeVerificacion }, Validators.required],
      identificacionDelTransporte: [{ value: this.tramiteState.identificacionDelTransporte, disabled: true }, Validators.required],
      nombreDeLaEmpresaTransportista: [{ value: this.tramiteState.nombreDeLaEmpresaTransportista, disabled: true }, Validators.required],
    });
  }

  /**
   * Maneja el cambio de la aduana de ingreso seleccionada.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID de la aduana de ingreso.
   * @returns {void}
   */
  cambioAduanaDeIngreso(event: Catalogo): void {
    this.tramiteStore.setAduanaDeIngreso(event.id);
  }

  /**
   * Maneja el cambio de la oficina de inspección seleccionada.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID de la oficina de inspección.
   * @returns {void}
   */
  cambioOficinaDeInspeccion(event: Catalogo): void {
    this.tramiteStore.setOficinaDeInspeccion(event.id);
  }

  /**
   * Maneja el cambio del punto de inspección seleccionado.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID del punto de inspección.
   * @returns {void}
   */
  cambioPuntoDeInspeccion(event: Catalogo): void {
    this.tramiteStore.setPuntoDeInspeccion(event.id);
  }

  /**
   * Maneja el cambio del régimen al que se destina.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID del régimen.
   * @returns {void}
   */
  cambioRegimenAlQueDestina(event: Catalogo): void {
    this.tramiteStore.setRegimenAlQueDestina(event.id);
  }

  /**
   * Maneja el cambio de los datos para la movilización.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID de los datos para la movilización.
   * @returns {void}
   */
  cambioDatosParaMovilizacion(event: Catalogo): void {
    this.tramiteStore.setDatosParaMovilizacion(event.id);
  }

  /**
   * Maneja el cambio del punto de verificación seleccionado.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID del punto de verificación.
   * @returns {void}
   */
  cambioPuntoDeVerificacion(event: Catalogo): void {
    this.tramiteStore.setPuntoDeVerificacion(event.id);
  }

  /**
   * Obtiene las aduanas de ingreso desde el servicio.
   * @method getMercanciaDatos
   * @returns {void}
   */
  getMercanciaTablaDatos(): void {
    this.acuicolaService.getMercanciaDatos()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
        this.mercanciaTablaDatos = data;
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
   * Obtiene los regímenes a los que se destina la mercancía desde el servicio.
   * @method getRegimenAlQueSeDestinara
   * @returns {void}
   */
  getRegimenAlQueSeDestinara(): void {
    this.acuicolaService.getRegimenAlQueSeDestinara()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.regimenAlQueDestina = {
            labelNombre: 'Régimen al que se destinara la mercancía',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los datos para movilización nacional desde el servicio.
   * @method getDatosParaMovilizacion
   * @returns {void}
   */
  getDatosParaMovilizacion(): void {
    this.acuicolaService.getDatosParaMovilizacion()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosParaMovilizacion = {
            labelNombre: 'Datos para movilización nacional',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los puntos de verificación federal desde el servicio.
   * @method getPuntoDeVerificacion
   * @returns {void}
   */
  getPuntoDeVerificacion(): void {
    this.acuicolaService.getPuntoDeVerificacion()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.puntoDeVerificacion = {
            labelNombre: 'Punto de verificación federal',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
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
