import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { NuevoProgramaIndustrialService } from '../../services/nuevo-programa-industrial.service';
import { SECCIONES_TRAMITE_80101 } from '../../constantes/nuevo-programa.enum';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import mostrar from '@libs/shared/theme/assets/json/shared/mostrar.json';
/**
 * Componente Angular para gestionar el primer paso del proceso de autorización de un nuevo programa industrial.
 * Este componente se encarga de mostrar y gestionar las secciones del formulario, así como de manejar el estado
 * de la consulta relacionada con el trámite 80101.
 *
 * @remarks
 * Este componente utiliza el servicio `NuevoProgramaIndustrialService` para obtener datos y actualizar el estado del formulario.
 * También utiliza `SeccionLibStore` para gestionar las secciones del formulario y su validez.
 */
@Component({
  selector: 'app-paso-uno-cs',
  templateUrl: './paso-uno-cs.component.html',
})
export class PasoUnoCsComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  public esFormularioUpdate: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$ - Subject para notificar la destrucción del componente.
   * Utilizado para cancelar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice utilizado para representar el número actual o posición en un flujo o proceso.
   *
   * @type {number} - Valor inicializado en 1.
   */
  indice: number = 1;

  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  public consultaState!: ConsultaioState;

  private mostrarDummyData = mostrar;

  /**
   * Constructor de la clase PasoUnoCsComponent.
   *
   * @param seccionStore - Inyección de dependencia del servicio `SeccionLibStore`
   *                       utilizado para gestionar el estado de las secciones.
   *
   * Este constructor inicializa el componente y llama al método `asignarSecciones`
   * para configurar las secciones necesarias al cargar el componente.
   */
  constructor(
    private seccionStore: SeccionLibStore,
    private consultaQuery: ConsultaioQuery,
    private autorizacionProgrmaNuevoService: NuevoProgramaIndustrialService
  ) {
    this.asignarSecciones();
  }
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = {...seccionState, id_solicitud: '202734892', idSolicitudSeleccionada: "67890"};
          this.formularioDeshabilitado = seccionState.readonly;
          this.esFormularioUpdate = seccionState.update;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          }
        })
      )
      .subscribe();
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
   /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */

  guardarDatosFormulario(): void {
    this.autorizacionProgrmaNuevoService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.autorizacionProgrmaNuevoService.actualizarEstadoFormulario(resp.datos);
        }
      });
  }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_80101;
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (
        Object.prototype.hasOwnProperty.call(
          PREDETERMINADO.PASO_1,
          LLAVE_SECCION
        )
      ) {
        const KEY = LLAVE_SECCION as keyof typeof PREDETERMINADO.PASO_1;
        SECCIONES.push(PREDETERMINADO.PASO_1[KEY]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela suscripciones activas mediante `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
