import { Component, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SeccionLibStore, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';


/**
 * PasoUnoComponent
 *
 * Este componente gestiona la primera etapa del flujo de la solicitud. Permite la selección de diferentes 
 * secciones o pasos dentro del formulario y muestra los componentes correspondientes en función de la sección seleccionada.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy {
  /**
   * Indica el índice de la pestaña (o sección) seleccionada en el formulario.
   * Este valor controla qué sección se debe mostrar al usuario en la vista.
   */
  indice: number = 1;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @constructor
   * Inicializa el componente PasoUno, inyectando los servicios necesarios y configurando el estado inicial.
   * 
   * - Suscribe al observable `selectConsultaioState$` para actualizar el estado local `consultaState` cuando cambie el estado global.
   * - Si el `procedureId` es '230501' y la propiedad `update` está activa, guarda los datos del formulario automáticamente.
   * - En caso contrario, establece la bandera `esDatosRespuesta` en `true`.
   * 
   * @param seccionStore Servicio para manejar el estado de la sección.
   * @param consultaQuery Servicio para consultar el estado de la aplicación.
   * @param materialesPeligrososService Servicio para gestionar materiales peligrosos.
   * 
   * @remarks
   * Este constructor es fundamental para la inicialización y manejo del flujo de datos en el paso uno del trámite 230501.
   */
  constructor(private seccionStore: SeccionLibStore,
    private consultaQuery: ConsultaioQuery,
    public materialesPeligrososService: MaterialesPeligrososService
  ) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === '230501' &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }

  }

  /**
   * Método para seleccionar la pestaña o sección en el formulario.
   * 
   * Este método asigna el valor del índice de la pestaña seleccionada al atributo `indice` de la clase,
   * lo que cambia la vista a la sección correspondiente.
   * 
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(): void {
    this.materialesPeligrososService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;          
          this.materialesPeligrososService.actualizarEstadoFormulario(resp);
        }
      });
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
