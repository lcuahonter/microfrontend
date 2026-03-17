import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { EstablecimientoService } from '../../../../shared/services/establecimiento.service'

/**
 * @description
 * Componente principal para gestionar la selección de subtítulos en la página de datos.
 * Este componente permite cambiar entre diferentes secciones o pestañas
 * utilizando un índice que representa el subtítulo seleccionado.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
   * @description
   * Variable que almacena el índice del subtítulo seleccionado.
   * Por defecto, el índice inicial es `1`.
   */
  indice: number = 1;
  /**
     * @property destroyNotifier$
     * @description
     * Subject utilizado para notificar la destrucción del componente y cancelar suscripciones activas.
     */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * @property esDatosRespuesta
   * @description
   * Indica si se han recibido datos de respuesta del servidor para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;
    /**
   * @property nuevaColumna
   * @description
   * Define una nueva columna que se puede agregar a la tabla de fabricantes relacionados.
   * Esta columna se utiliza para mostrar información adicional en la tabla.
   */
  public nuevaColumna = { encabezado: 'Colonia o equivalente', clave: 'coloniaEquivalente' };

  public tramiteID: string = '260913';

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se pueden realizar tareas de configuración inicial, como la obtención de datos necesarios.
   */
  constructor(
    private establecimientoService: EstablecimientoService,
    private consultaQuery: ConsultaioQuery,
  ) { }
  /**
    * @method ngOnInit
    * @description
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Suscribe al estado de la consulta y decide si se deben guardar los datos del formulario o mostrar los datos de respuesta.
    */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      })
    ).subscribe();

  }

  /**
   * @method guardarDatosFormulario
   * @description
   * Método encargado de obtener los datos del formulario desde el servicio y actualizar el estado correspondiente.
   * Si se reciben datos, se actualiza el estado del formulario y se marca que hay datos de respuesta.
   */
  guardarDatosFormulario(): void {
    this.establecimientoService
      .obtenerSolicitudDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.establecimientoService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @description
   * Método que establece el índice del subtítulo seleccionado.
   * Este método se utiliza para cambiar entre diferentes subtítulos o pestañas.
   * @param i Índice del subtítulo que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el subject para cancelar todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
