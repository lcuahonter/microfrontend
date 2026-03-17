import { LoginState, LoginStore } from '../estados/login.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'any' })
export class LoginQuery extends Query<LoginState> {
    /**
     * Selecciona el estatdo completo del login
     */
    selectLoginState$ = this.select(state => {
        return state;
    });

    /**
     * Selecciona el RFC del estado de login.
     */
    selectRfc$ = this.select(state => state.rfc);

    /**
     * Constructor de la clase LoginQuery.
     * @param store - Instancia del store de login.
     */
    constructor(
        protected override store: LoginStore
    ) {
        super(store);
    }
}