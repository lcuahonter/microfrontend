import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  RegistroSolicitudService,
} from '@ng-mf/data-access-user';
import {
  Observable, 
  Subject,
  map,
  takeUntil
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tramite260604Query } from '../../estados/tramite260604Query.query';

import {
  Tramite260604State,
  Tramite260604Store
} from '../../estados/tramite260604Store.store';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { DatosSolicitudConsultaService } from '../../../../shared/services/datos-solicitud-consulta.service';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import {GuardarAdapter_260604} from '../../adapters/guardar-payload.adapter';
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {

  /**
     * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
     * @description
     * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
     * mediante el decorador `@ViewChild`.
     *
     * Esta propiedad permite invocar métodos públicos del contenedor y acceder
     * a sus propiedades, por ejemplo para delegar la validación del formulario
     * interno (`validarContenedor()`).
     *
     * > Nota: Angular inicializa esta referencia después de que la vista
     * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
     */
    @ViewChild(ContenedorDeDatosSolicitudComponent)
    contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

    /**
    * @property {TercerosRelacionadosVistaComponent} tercerosRelacionadosVistaComponent
    * @description
    * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
    * mediante el decorador `@ViewChild`.
    *
    * Esta propiedad permite invocar métodos públicos del componente y acceder
    * a sus propiedades.
    *
    * > Nota: Angular inicializa esta referencia después de que la vista
    * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
    */
    @ViewChild(TercerosRelacionadosVistaComponent)
    tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /**
   * Índice de la pestaña actualmente seleccionada.
   * 
   * @type {number | undefined}
   * @default 1
   */
  indice: number | undefined = 1;

  /**
   * Almacena el estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si el formulario está deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject utilizado para notificar la destrucción del componente.
   * Se usa para cancelar suscripciones y evitar fugas de memoria.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente PasoUnoComponent.
   * 
   * Inyecta los servicios necesarios para la gestión del estado y consultas del trámite.
   * 
   * @param tramite260604Query Servicio para consultar el estado del trámite.
   * @param tramite260604Store Servicio para actualizar el estado del trámite.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(
    private tramite260604Query: Tramite260604Query,
    private tramite260604Store: Tramite260604Store,
    private consultaQuery: ConsultaioQuery,
    private readonly http: HttpClient,
    private datosSolicitudConsultaService: DatosSolicitudConsultaService,
     private registroSolicitudService: RegistroSolicitudService,
    
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los observables para obtener el índice de la pestaña seleccionada y el estado de la consulta.
   * Gestiona la habilitación/deshabilitación del formulario y la carga de datos según el estado.
   */
  ngOnInit(): void {
    this.tramite260604Query.getTabSeleccionado$
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
            this.getDatosSolicitudData();
          } else if (this.consultaState.readonly) {
            this.formularioDeshabilitado = true;
          }
          if (!(this.consultaState && this.consultaState.procedureId === '260604' && this.consultaState.update)) {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe(); 
  }

  /**
   * Selecciona una pestaña específica en el flujo del trámite.
   *
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.tramite260604Store.updateTabSeleccionado(i);
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
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;    
    return (
      (ESTABVALIDO && ESTERCEROSVALIDO) ? true : false
    );
  }

  /**
   * Método del ciclo de vida de Angular que se llama antes de destruir el componente.
   * Emite una notificación para cancelar las suscripciones y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con los datos del estado del trámite cargados desde el archivo JSON.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260604State> {
    return this.http.get<Tramite260604State>(
      'assets/json/260604/respuestaDeActualizacionDe.json'
    );
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Posteriormente, actualiza el formulario con los valores del store.
   */
guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260604,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260604.patchToStore(res.datos, this.tramite260604Store);
      }
    });
    this.esDatosRespuesta=true;
  }
/**   * Obtiene los datos de la solicitud desde un archivo JSON y actualiza el estado del formulario
   * en el store utilizando el servicio DatosSolicitudConsultaService.
   * Si se reciben datos válidos, se actualiza el estado del formulario en el store.
   */
  public getDatosSolicitudData():void{
    this.datosSolicitudConsultaService.getDatosSolicitudData().pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.datosSolicitudConsultaService.actualizarEstadoFormulario(resp);
          }
        });
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param DATOS Estado del trámite con la información a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite260604State): void {
    this.tramite260604Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

}
