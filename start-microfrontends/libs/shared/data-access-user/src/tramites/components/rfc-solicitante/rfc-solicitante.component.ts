import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginQuery } from '../../../core/queries/login.query';
import { LoginStore } from '../../../core/estados/login.store';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component RfcSolicitanteComponent
 * @description Componente que muestra y permite actualizar el RFC del solicitante en el estado de sesión.
 *
 * Este componente:
 * - Se suscribe al estado de login para obtener el RFC actual.
 * - Muestra y permite editar el RFC en un control vinculado a rfcSolicitante.
 * - Al invocar Ahorrar() actualiza el LoginStore con el RFC proporcionado.
 *
 * @usage
 * <rfc-solicitante></rfc-solicitante>
 *
 * @public
 */
@Component({
  selector: 'rfc-solicitante',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rfc-solicitante.component.html',
})
export class RfcSolicitanteComponent implements OnInit, OnDestroy {
  /**
   * RFC del solicitante mostrado/edtable en el componente.
   *
   * @type {string}
   * @default ''
   */
  public rfcSolicitante: string = '';

  /**
   * Subject usado para cancelar subscripciones al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor
   * @param _loginStore Store para actualizar el RFC del login
   * @param loginQuery Query para leer el RFC del estado de login
   */
  constructor(
    private _loginStore: LoginStore,
    private loginQuery: LoginQuery,
  ) { }

  /**
   * Inicializa la suscripción al estado de login y sincroniza rfcSolicitante.
   * @returns void
   */
  ngOnInit(): void {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcSolicitante = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * Guarda el RFC actual en el LoginStore.
   * Llama a establecerLogin con el RFC y una bandera indicando persistencia.
   *
   * @returns void
   */
  ahorrar(): void {
    this._loginStore.establecerLogin(this.rfcSolicitante, true);
  }

  /**
   * Cancela las subscripciones abiertas y limpia recursos.
   * @returns void
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}