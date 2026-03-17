import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260202 } from '../../adapters/guardar-payload.adapter';
import { HttpClient } from '@angular/common/http';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260202Query } from '../../estados/tramite260202Query.query';
import { Tramite260202State } from '../../estados/tramite260202Store.store';
import { Tramite260202Store } from '../../estados/tramite260202Store.store';



/**
 * @component PasoUnoComponent
 * 
 * @description Componente Angular que representa el primer paso en el flujo de trámites.
 * Este componente se encarga de gestionar la lógica y el estado relacionado con la pestaña seleccionada,
 * así como de interactuar con los servicios para obtener y actualizar datos del formulario.
 * 
 * @selector app-paso-uno
 * 
 * @templateUrl ./paso-uno.component.html
 * 
 * @styleUrl ./paso-uno.component.scss
 * 
 * @remarks
 * - Este componente utiliza los servicios `Tramite260202Query` y `Tramite260202Store` para manejar el estado del flujo del trámite.
 * - También interactúa con el servicio `ConsultaioQuery` para obtener el estado de consulta y actualizar el formulario según sea necesario.
 * - Implementa los ciclos de vida de Angular `OnInit` y `OnDestroy` para inicializar y limpiar recursos respectivamente.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$ - Subject para notificar la destrucción del componente.
   * Utilizado para cancelar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * The index of the currently selected tab.
   *
   * @type {number | undefined}
   * @default 1
   */
  indice: number | undefined = 1;
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  public consultaState!: ConsultaioState;

  @ViewChild('solicitante') solicitante!: SolicitanteComponent;

  @ViewChild('datosSolicitud') datosSolicitud!: ContenedorDeDatosSolicitudComponent;

  @ViewChild('tercerosRelacionados') tercerosRelacionados!: TercerosRelacionadosVistaComponent;

  @ViewChild('pagoDeDerechos') pagoDeDerechos!: PagoDeDerechosContenedoraComponent

  /**
   * Constructor de la clase PasoUnoComponent.
   *
   * Este constructor inyecta las dependencias necesarias para el funcionamiento del componente.
   *
   * @param tramite260202Query - Servicio que proporciona acceso a las consultas relacionadas con el flujo del trámite.
   * @param tramite260202Store - Servicio que gestiona el estado del flujo del trámite.
   */
  constructor(
    private tramite260202Query: Tramite260202Query,
    private tramite260202Store: Tramite260202Store,
    private consultaQuery: ConsultaioQuery,
    private readonly http: HttpClient,
    private registroSolicitudService: RegistroSolicitudService,
  ) {
    // El constructor necesita inyectar las dependencias.
  }

  /**
   * @override
   * @method ngOnInit
   * @description Este método se ejecuta al inicializar el componente. Se suscribe al observable `getTabSeleccionado$`
   * del servicio `tramite260202Query` para obtener el índice de la pestaña seleccionada y lo asigna a la propiedad `indice`.
   * También utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria,
   * deteniéndola cuando se emite un valor en el observable `destroyNotifier$`.
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite260202Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.formularioDeshabilitado = false;
            this.guardarDatosFormulario();
          } else if (this.consultaState.readonly) {
            this.formularioDeshabilitado = true;
          }
        })
      )
      .subscribe();
  }
  /**More actions
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con los datos del estado de la solicitud `Tramite260202State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260202State> {
    return this.http.get<Tramite260202State>(
      'assets/json/260202/respuestaDeActualizacionDe.json'
    );
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.More actions
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260202,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260202.patchToStore(res.datos, this.tramite260202Store);
      }
    });
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite260202State): void {
    this.tramite260202Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }
  /**
   * Selecciona una pestaña específica en el flujo del trámite.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.tramite260202Store.updateTabSeleccionado(i);
  }

  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosSolicitud) {
      if (!this.datosSolicitud.validarFormularioDatos()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.tercerosRelacionados) {
      if (!this.tercerosRelacionados.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.pagoDeDerechos) {
      if (!this.pagoDeDerechos.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
   validarPasoUno(): boolean {
    const ES_TAB_VALIDO = this.datosSolicitud?.validarFormularioDatos() ?? false;
    const ES_TERCEROS_VALIDO = this.tercerosRelacionados?.validarFormulario() ?? false;
    return (
      (ES_TAB_VALIDO && ES_TERCEROS_VALIDO) ? true : false

    );
  }

  /**
   * Valida todos los pasos del formulario.
   *
   * Invoca los métodos de validación de los componentes hijos:
   * - ContenedorDeDatosSolicitudComponent
   * - TercerosRelacionadosVistaComponent
   * - PagoDeDerechosContenedoraComponent
   *
   * @returns {boolean}
   * - `true` si todos los componentes son válidos.
   * - `false` si alguno no es válido o no está disponible.
   */
  validarTodosLosPasos(): boolean {
    const ESTABVALIDO = this.datosSolicitud?.validarFormularioDatos() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionados?.validarFormulario() ?? false;
    const PAGOVALIDO = this.pagoDeDerechos?.validarFormulario() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
