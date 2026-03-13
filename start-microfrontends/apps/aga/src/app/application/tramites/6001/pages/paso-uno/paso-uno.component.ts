import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, Subscription,map, takeUntil } from 'rxjs';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';

/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * Se suscribe al observable `componenteActual` de `RegistroCuentasBancariasService`
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit,OnDestroy {

  /**
   * Una instancia de Subscription que se utiliza para manejar la suscripción a eventos.
   * Esta instancia se utiliza para manejar la suscripción a eventos y liberar recursos cuando el componente se destruye.
   * @type {Subscription}
   */
  private subscription: Subscription = new Subscription();
  /**
   * Subject utilizado para emitir una señal que permite desuscribirse de los observables, típicamente en el ciclo de vida ngOnDestroy.
   * Cuando se emite un valor, todas las suscripciones que usan `takeUntil(this.destroyNotifier$)` serán desuscritas,
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el componente actual que se está mostrando.
   * Los valores posibles incluyen 'DatosGenerales'.
   */
  componenteActual: string = 'DatosGenerales';
  /**
   * Almacena el estado actual del proceso Consultaio para este componente.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor de PasoUnoComponent.
   * 
   * @param _registroCuentasBancariasSvc - Servicio para gestionar registros de cuentas bancarias.
   * 
   * Este constructor se suscribe al observable `componenteActual` del 
   * `RegistroCuentasBancariasService` para actualizar la propiedad `componenteActual` 
   * cada vez que el componente actual cambia.
   */
  constructor(
    private _registroCuentasBancariasSvc: RegistroCuentasBancariasService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.subscription.add(this._registroCuentasBancariasSvc.componenteActual.subscribe(component => {
      this.componenteActual = component;
    }));
  }

  /**
   * Método del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva han sido inicializadas.
   * - Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza la propiedad local `consultaState` con el valor emitido.
   * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite, evitando fugas de memoria.
   * - Si el `consultaState` actualizado tiene la bandera `update` en verdadero, se ejecuta el método `guardarDatosFormulario()` para guardar los datos del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
        if(this.consultaState.update) {
          this.guardarDatosFormulario();
        }
    })).subscribe();
   }

  /**
   * Recupera los datos actuales del formulario suscribiéndose al observable `getConsultaFormularioDatos`
   * del servicio `_registroCuentasBancariasSvc`. Una vez que se reciben los datos, actualiza el estado
   * del formulario llamando a `actualizarEstadoFormulario` con la respuesta. La suscripción se cancela
   * automáticamente cuando `destroyNotifier$` emite, evitando fugas de memoria.
   */
  public guardarDatosFormulario(): void {
    this._registroCuentasBancariasSvc.getConsultaFormularioDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      this._registroCuentasBancariasSvc.actualizarEstadoFormulario(response);
    })
   }

    /**
   * Maneja el evento para cancelar la firma.
   * Navega al componente anterior.
   */
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    } 
}
