import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Tramite260213State, Tramite260213Store } from '../../estados/tramite260213Store.store';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260213 } from '../../adapters/guardar-payload.adapter';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PermisoSanitarioMedicosUsoPersonalService } from '../../services/permiso-sanitario-medicos-uso-personal.service';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260213Query } from '../../estados/tramite260213Query.query';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnDestroy, OnInit, OnChanges {
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
  
      @ViewChild(PagoDeDerechosContenedoraComponent)
      pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
  
      @ViewChild(TercerosRelacionadosVistaComponent)
      tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
  /**
   * Índice que representa la posición actual o seleccionada.
   * Puede ser un número o indefinido si no se ha establecido.
   *
   * @type {number | undefined}
   */
  indice: number | undefined = 1;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar observables y evitar fugas de memoria.
   * 
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  
  /**
   * Subject utilizado para notificar la destrucción del componente y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  public formularioDeshabilitado: boolean = false;

    /**
     * @property {number} confirmarSinPagoDeDerechos
     * @description
     * Indica si se ha confirmado la continuación sin pago de derechos.
     */
    @Input() confirmarSinPagoDeDerechos: number = 0;
  /**
   * Constructor de la clase PasoUnoComponent.
   * 
   * @param Tramite260213Query - Servicio para consultar el estado del trámite 260213.
   * @param Tramite260213Store - Almacén para gestionar el estado del trámite 260213.
   * @param consultaQuery - Servicio para consultar el estado de la sección de consulta.
   * 
   * Al inicializar el componente, se suscribe al observable `selectConsultaioState$` para actualizar el estado local
   * (`consultaState`) y la propiedad `formularioDeshabilitado` según el estado de solo lectura (`readonly`) de la sección.
   */
  constructor(
    private Tramite260213Query: Tramite260213Query,
    private Tramite260213Store: Tramite260213Store,
    private consultaQuery: ConsultaioQuery,
    private permisoSanitarioMedicosUsoPersonalService: PermisoSanitarioMedicosUsoPersonalService,
     private registroSolicitudService: RegistroSolicitudService,
  ) {
      // Suscripción para actualizar el estado del formulario según la sección de consulta
    }

  ngOnInit(): void {
     this.Tramite260213Query.getTabSeleccionado$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((tab) => {
            this.indice = tab;
          });
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState && this.consultaState.procedureId === '260213' &&
          this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      });  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.More actions
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260213,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260213.patchToStore(res.datos, this.Tramite260213Store);
      }
    });
    this.esDatosRespuesta=true;
  }


  /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado de la solicitud `Tramite260213State` con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
actualizarEstadoFormulario(DATOS: Tramite260213State): void {
  this.Tramite260213Store.update((state) => ({
    ...state,
    ...DATOS
  }))

}

/**
* Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
* 
* @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
*          cargados desde el archivo JSON especificado en la ruta de `assets`.
*/
getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260213State> {
  return this.permisoSanitarioMedicosUsoPersonalService.getRegistroTomaMuestrasMercanciasData();
}

  /**
   * Selecciona una pestaña específica en el flujo del trámite.
   *
   * @param i - Índice de la pestaña que se desea seleccionar.
   * 
   * Llama al método `updateTabSeleccionado` del store para actualizar el estado de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.Tramite260213Store.updateTabSeleccionado(i);
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
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }
}
