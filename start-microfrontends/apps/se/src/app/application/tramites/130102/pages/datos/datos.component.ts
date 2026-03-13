import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil} from 'rxjs';
import { FormularioRegistroService } from '../../services/octava-temporal.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html'
})
export class DatosComponent implements OnInit, OnDestroy {
      /**
 * Evento que emite un valor booleano al componente padre.
 * Se activa cuando el subíndice del child componente cambia.
 * - true: el subíndice es 3 (mostrar alerta)
 * - false: cualquier otro valor de subíndice
 */
   @Output() alertaEvento = new EventEmitter<boolean>();
    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /*
  * @description Notificador para destruir el componente y cancelar suscripciones.
  */
    private destroyNotifier$: Subject<void> = new Subject();
    /*
  * @description Estado actual de la consulta, obtenido desde el store.
    */
  public consultaState!: ConsultaioState;
  /**
   * Constructor del componente DatosComponent.
   * @param consultaQuery ConsultaQuery para obtener el estado de la consulta.
   * @param formularioRegistroService Servicio para manejar el registro del formulario.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private formularioRegistroService: FormularioRegistroService
  ){

  }
  /*
  * Método de inicialización del componente.
  * Se suscribe al estado de la consulta y actualiza la variable consultaState.
  */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if(this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        }
      )).subscribe();
  }
  /**
   * Este método inicializa el formulario con validaciones y carga datos de productos.
   */
  guardarDatosFormulario(): void {
    this.formularioRegistroService
      .getSolicitudData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.formularioRegistroService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.alertaEvento.emit(this.indice === 2);
  }
  /*
    * Método que se ejecuta al destruir el componente.
  */

   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
