/**
 * AuthPageComponent
 * 
 * Componente encargado de la autenticación de usuarios y la selección de pestañas en la página de login.
 * 
 * - Determina el ambiente de ejecución (localhost o desarrollo).
 * - Permite seleccionar la pestaña activa.
 * - Simula la validación de eFirma y establece un usuario de prueba en el store.
 * 
 * @author
 */

import * as uuid from 'uuid';
import { AMBIENTES, LoginDetalle,LoginStore, PerfilUsuario } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Rol } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TipoPersona } from '@ng-mf/data-access-user';
import { UsuarioStore } from '@libs/shared/data-access-user/src/core/estados/usuario.store';

@Component({
    selector: 'auth-page',
    templateUrl: './auth-page.component.html',
    styleUrl: './auth-page.component.scss',
    host: { 'hostID': uuid.v4().toString() }
})
export class AuthPageComponent implements OnInit,OnDestroy {
    /**
     * Un subject utilizado para notificar y completar todas las suscripciones cuando el componente es destruido.
     * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier suscripción activa vinculada a este notifier
     * se desuscriba cuando finalice el ciclo de vida del componente.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
     * Índice de la pestaña seleccionada.
     */
    indice: number = 1;

    /**
     * Ruta del ambiente actual (localhost o desarrollo).
     */
    public ruta: string = '';

    /**
     * variable para validar el primer acceso de un usuario
     */
    primerAcceso: boolean = false;

    /**
     * Constructor.
     * @param usuarioStore Servicio para gestionar el estado del usuario autenticado.
     */
    constructor(
        private usuarioStore: UsuarioStore,
        private router: Router,
        private _loginStore: LoginStore
    ) { }

    /**
     * Inicializa el componente y determina el ambiente de ejecución.
     */
    ngOnInit(): void {
        if (window.location.host.indexOf('localhost') !== -1) {
            this.ruta = AMBIENTES.LOCALHOST;
        } else {
            this.ruta = AMBIENTES.DESARROLLO
        }
    }

    /**
     * Selecciona la pestaña activa.
     * @param i Índice de la pestaña a seleccionar.
     */
    seleccionaTab(i: number): void {
        this.indice = i;
    }

    /**
     * Simula la validación de eFirma.
     * Si el login es exitoso, establece un usuario de prueba y redirige a la selección de trámite.
     * @param login Indica si el login fue exitoso.
     */
    validarEFirma(login: LoginDetalle) {
        if (login.tieneLogin) {
            const ROLES: Rol[] = [{ idRol: 1, codigoRol: '', nombre: '', descripcion: '' }];
            const PERFIL_USUARIO: PerfilUsuario = {
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                nombreCompleto: '',
                rfc: login.rfc,
                correoElectronico: '',
                tipoPersona: TipoPersona.FISICA
            }
            this._loginStore.establecerLogin(login.rfc, login.tieneLogin);
            this.usuarioStore.establecerUsuario('LEQI', PERFIL_USUARIO, ROLES, '');
            if (!this.primerAcceso) {
                this.router.navigate(['/bandeja-de-tareas-pendientes']);
            }
            else {
                this.router.navigate(['login/condiciones-uso']);
            }
        }
    }

    /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Este método emite un valor al subject `destroyNotifier$` y lo completa,
   * asegurando que cualquier suscripción vinculada a este notifier se limpie
   * adecuadamente para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}