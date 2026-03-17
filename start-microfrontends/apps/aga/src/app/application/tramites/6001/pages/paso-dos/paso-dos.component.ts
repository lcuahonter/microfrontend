/* eslint-disable sort-imports */
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Subscription } from 'rxjs';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';

/**
 * Componente PasoDosComponent.
 * 
 * Este componente maneja la lógica para la segunda etapa de un trámite específico.
 * 
 * @component
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnDestroy {

  /**
   * Una instancia de Subscription que se utiliza para manejar la suscripción a eventos.
   * Esta instancia se utiliza para manejar la suscripción a eventos y liberar recursos cuando el componente se destruye.
   * @type {Subscription}
   */
  private subscription: Subscription = new Subscription();


  /**
   * Construye una instancia de PasoDosComponent.
   * 
   * @param router - El servicio Angular Router utilizado para la navegación.
   * @param _registroCuentasBancariasSvc - Servicio para manejar registros de cuentas bancarias.
   */
  constructor(
    private router: Router,
    private _registroCuentasBancariasSvc: RegistroCuentasBancariasService,
  ) {
    //
   }


    /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
    obtieneFirma(ev: string): void {
      const FIRMA: string = ev;
      if (FIRMA) {
        // Obtiene el número de trámite
        this.subscription.add(this._registroCuentasBancariasSvc
          .obtenerTramite(19)
          .pipe(
            map(() => {
              this.router.navigate(['servicios-extraordinarios/acuse']);
            }),
            catchError((_error) => {
              return _error;
            })
          )
          .subscribe());
      }
    }


      /**
   * Maneja el evento para cancelar la firma.
   * Navega al componente anterior.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
