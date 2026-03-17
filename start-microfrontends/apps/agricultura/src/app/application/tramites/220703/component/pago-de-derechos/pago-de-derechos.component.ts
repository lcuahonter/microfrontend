import { Catalogo, CatalogoSelectComponent, CatalogosSelect, InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PagoDeDerechos, PagoDeDerechosRevision } from '../../modelos/acuicola.model';
import { map, takeUntil } from 'rxjs';
import { AcuicolaService } from '../../service/acuicola.service';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TramiteState } from '../../estados/tramite220703.store';
import { TramiteStore } from '../../estados/tramite220703.store';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';


@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputFechaComponent
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss'
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {


  /** Formulario reactivo para la captura y visualización de datos de pago de derechos. */
  pagosDeDerechosForm!: FormGroup;

  /** Catálogo de bancos para selección en el formulario. */
  banco: CatalogosSelect = {
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
   * Configuración para el campo de fecha de pago (versión estándar).
   * @type {InputFecha}
   */
  fachaDePago: InputFecha = {
    labelNombre: 'Fecha de pago*',
    required: false,
    habilitado: true,
  };

  /**
  * Configuración para el campo de fecha de pago (versión revisión).
  * Difiere de la estándar por no incluir asterisco en el label.
  * @type {InputFecha}
  */
  fachaDePagoRevision: InputFecha = {
    labelNombre: 'Fecha de pago',
    required: false,
    habilitado: true,
  };
  
  /** Subject utilizado para gestionar la desuscripción de observables. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor del componente.
   * @param fb Servicio para la creación de formularios reactivos.
   * @param acuicolaService Servicio para interactuar con la lógica de negocio relacionada con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de la consulta.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly acuicolaService: AcuicolaService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
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
   * Inicializa el formulario, carga los datos del banco y los datos de pago de derechos.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getBancoDatos();
    this.pagoDeCargarDatos();
    this.pagoDerechosRevision();

    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.pagosDeDerechosForm.patchValue({
          claveDeReferencia: datos.claveDeReferencia,
          cadenaDependencia: datos.cadenaDependencia,
          importeDePago: datos.importeDePago,
          banco: datos.banco,
          llaveDePago: datos.llaveDePago,
          fechaPagoDeDerechosRevision: datos.fechaPagoDeDerechosRevision,
        });
      })
    ).subscribe();
  }

  /**
   * Inicializa el formulario reactivo con los controles y validaciones necesarias.
   */
  iniciarFormulario(): void {
    this.pagosDeDerechosForm = this.fb.group({
      claveDeReferencia: [{ value: this.tramiteState.claveDeReferencia, disabled: true }, Validators.required],
      cadenaDependencia: [{ value: this.tramiteState.cadenaDependencia, disabled: true }, Validators.required],
      banco: [{ value: this.tramiteState.banco }, Validators.required],
      llaveDePago: [{ value: this.tramiteState.llaveDePago }, Validators.required],
      fechaPagoDeDerechos: [{ value: this.tramiteState.fechaPagoDeDerechos, disabled: true }, Validators.required],
      importeDePago: [{ value: this.tramiteState.importeDePago, disabled: true }, Validators.required],
      claveDeReferenciaRevision: [{ value: this.tramiteState.claveDeReferenciaRevision, disabled: true }, Validators.required],
      cadenaDependenciaRevision: [{ value: this.tramiteState.cadenaDependenciaRevision, disabled: true }, Validators.required],
      bancoRevision: [{ value: this.tramiteState.bancoRevision, disabled: true }, Validators.required],
      llaveDePagoRevision: [{ value: this.tramiteState.llaveDePagoRevision, disabled: true }, Validators.required],
      fechaPagoDeDerechosRevision: [{ value: this.tramiteState.fechaPagoDeDerechosRevision, disabled: true }, Validators.required],
      importeDePagoRevision: [{ value: this.tramiteState.importeDePagoRevision, disabled: true }, Validators.required],
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
      this.pagosDeDerechosForm.disable();
    } else {
      this.pagosDeDerechosForm.enable();
    }
  }

  /**
   * Maneja el cambio del banco seleccionado.
   * @param {Catalogo} event - El objeto de tipo `Catalogo` que contiene el ID del banco.
   * @returns {void}
   */
  selectBancoCatalogo(event: Catalogo): void {
    this.tramiteStore.setBanco(event.id);
  }

  /**
   * Actualiza la fecha de pago de derechos en el store.
   * @param {string} nuevo_valor - Nueva fecha de pago.
   */
  cambioFechaPagoDeDerechos(nuevo_valor: string): void {
    this.tramiteStore.setFechaPagoDeDerechos(nuevo_valor);
  }

  /**
  * Actualiza la fecha de pago de derechos (revisión) en el store.
  * @param {string} nuevo_valor - Nueva fecha de pago para revisión.
  */
  cambioFechaPagoDeDerechosRevision(nuevo_valor: string): void {
    this.tramiteStore.setFechaPagoDeDerechosRevision(nuevo_valor);
  }

  /**
  * Establece la llave de pago a partir del evento de input.
  * @param {Event} event - Evento del campo de entrada.
  */
  setllaveDePago(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.tramiteStore.setLlaveDePago(VALUE);
  }

  /**
   * Carga los datos de pago de derechos desde el servicio y los asigna al formulario.
   */
  pagoDeCargarDatos(): void {
    this.acuicolaService
      .pagoDeCargarDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechos) => {
        this.tramiteStore.setClaveDeReferencia(data.claveDeReferencia);
        this.tramiteStore.setCadenaDependencia(data.cadenaDependencia);
        this.tramiteStore.setImporteDePago(data.importeDePago);
      })
  }

  /**
   * Obtiene los datos del banco desde el servicio y los asigna al catálogo de bancos.
   */
  getBancoDatos(): void {
    this.acuicolaService.getBancoDatos()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.banco = {
            labelNombre: 'Banco*',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Carga los datos de revisión de pago de derechos desde el servicio y los asigna al formulario.
   */
  pagoDerechosRevision(): void {
    this.acuicolaService
      .getPagoDerechosRevision()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechosRevision) => {
        this.pagosDeDerechosForm.patchValue(data);
      })
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de desuscribir los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

}
