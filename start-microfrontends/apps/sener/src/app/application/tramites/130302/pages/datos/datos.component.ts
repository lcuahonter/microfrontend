import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Service130302Service } from '../../services/service130302.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy, AfterViewInit {

   /**
    * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
    */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property
   * @description Estado actual de la consulta para el trámite 130302.
   * @type {ConsultaioState}
   * @memberof Datos130302Component
   */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   * @param consultaQuery - Servicio para realizar consultas relacionadas con la aplicación.
   * @param service130302Service - Servicio específico para manejar la lógica del trámite 130302.
   * @description Inyecta los servicios necesarios para la gestión de datos en el componente de datos del trámite 130302.
   */
  constructor(private consultaQuery: ConsultaioQuery,
    private service130302Service: Service130302Service) { }
  /**
     * @inheritdoc
     * @method ngOnInit
     * @description
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Suscribe al estado de consulta y actualiza la propiedad `consultaState` con el estado recibido.
     * Si el estado indica que se debe actualizar (`update` es verdadero), guarda los datos del formulario.
     * En caso contrario, establece la bandera `esDatosRespuesta` en verdadero.
     *
     * @returns {void}
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
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  /**
   * Índice de la pestaña actualmente seleccionada.
   * Inicializado a 1 por defecto.
   */


   /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
export class DatosPageComponent {
  /**
  * Esta variable se utiliza para almacenar el índice del subtítulo.
  */
   public indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * @method
   * @description
   * Obtiene los datos del registro de toma de muestras de mercancías a través del servicio,
   * y si la respuesta es válida, actualiza el estado del formulario y marca que se recibió una respuesta.
   * 
   * @returns {void}
   * 
   * @memberof Datos130302Component
   */
  guardarDatosFormulario(): void {
    this.service130302Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        
        if (resp) {
          this.esDatosRespuesta = true;
          this.service130302Service.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
    * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
    * Libera recursos y cancela suscripciones.
    * @returns {void}
    */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
