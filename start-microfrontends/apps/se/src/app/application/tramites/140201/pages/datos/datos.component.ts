import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
 * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
 */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;


  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual, que contiene información sobre el trámite y su estado.
   * Se inicializa como una instancia de ConsultaioState.
   */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   * @param consultaQuery - Instancia de ConsultaioQuery utilizada para consultar datos relacionados.
   * @param solicitudService - Servicio para gestionar las solicitudes asociadas al trámite.
   * 
   * @description
   * Constructor de la clase. Se encarga de inyectar las dependencias necesarias para la gestión de datos y solicitudes.
   * 
   * @author
   * Compodoc
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudService: SolicitudService
  ) {
    // Constructor vacío: las dependencias se inyectan mediante la inyección de dependencias de Angular
  }
  /**
    * @inheritdoc
    * 
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * 
    * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
    * - Si la propiedad `update` de `consultaState` es verdadera, llama al método `guardarDatosFormulario()` para guardar los datos del formulario.
    * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se trata de una respuesta de datos.
    * 
    * @returns {void}
    */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();

    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  // ngAfterViewInit(): void {
  //   this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  //}

  /**
   * Índice actual del subtítulo seleccionado en la interfaz.
   */
  indice: number = 1;

  /**
   * Método para actualizar el índice del subtítulo seleccionado.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(): void {
    this.solicitudService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Destruye las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
