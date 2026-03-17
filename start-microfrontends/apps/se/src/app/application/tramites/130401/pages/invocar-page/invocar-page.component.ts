import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginQuery, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { DatosSolicitud } from '../../models/modificacion-descripcion.model';
import { ModificacionDescripcionService } from '../../services/modificacion-descripcion.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { Tramite130401State } from '../../../../estados/tramites/tramite130401.store';
import { Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para gestionar la página de invocación del trámite 130401.
 * 
 * Este componente permite al usuario ingresar un folio de permiso, validarlo y
 * navegar a la siguiente página del trámite. También incluye funcionalidades
 * para inicializar el formulario, manejar validaciones y limpiar los datos.
 */
@Component({
  selector: 'app-invocar-page',
  templateUrl: './invocar-page.component.html',
  styleUrl: './invocar-page.component.scss',
})
export class InvocarPageComponent implements OnInit, OnDestroy {
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite130401State;

  /**
   * Formulario reactivo para capturar el folio de permiso.
   * 
   * Este formulario incluye validaciones para asegurar que el campo `folioPermiso`
   * sea obligatorio.
   */
  folioFormulario!: FormGroup;

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  /**
   * Constructor del componente.
   * 
   * @param {Tramite130401Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite130401Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public store: Tramite130401Store,
    public tramiteQuery: Tramite130401Query,
    public fb: FormBuilder,
    private router: Router,
    private validacionesService: ValidacionesFormularioService,
    private modificacionDescripcionService: ModificacionDescripcionService,
    private loginQuery: LoginQuery
  ) {
    this.loginQuery.selectLoginState$
            .pipe(
              takeUntil(this.destroyed$),
              map((seccionState) => {
                this.loginRfc = seccionState.rfc;
              })
            )
            .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite, inicializa el formulario y
   * configura las validaciones necesarias.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario reactivo para capturar el folio de permiso.
   * 
   * Configura el campo `folioPermiso` con una validación para que sea obligatorio.
   */
  inicializarFormulario(): void {
    this.folioFormulario = this.fb.group({
      folioPermiso: [this.tramiteState?.folioPermiso, [Validators.required]],
    });
  }

  /**
   * Establece valores en el store desde el formulario.
   * 
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {keyof Tramite130401Store} metodoNombre - El método del store que se debe invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130401Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Verifica si un campo del formulario es válido.
   * 
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Cancela la operación actual y limpia el formulario.
   * 
   * Este método reinicia el formulario y limpia el valor del folio en el store.
   */
  cancelar(): void {
    this.folioFormulario.reset();
    this.store.setFolioPermiso('');
  }

  /**
   * Busca el folio ingresado y navega a la siguiente página si el formulario es válido.
   * 
   * Este método marca todos los campos como tocados, valida el formulario y,
   * si es válido, redirige al usuario a la página del solicitante.
   */
  buscar(): void {
    const PAYLOAD = {
      numeroFolioResolucion: this.folioFormulario.get('folioPermiso')?.value,
      rfc: this.loginRfc,
    }
    if (this.folioFormulario.valid) {
      this.modificacionDescripcionService.buscar(PAYLOAD).pipe(
            takeUntil(this.destroyed$)
          ).subscribe(
            (data: { datos: DatosSolicitud }) => {
              this.store.setDatosSolicitud(data.datos);
            })
      this.router.navigate([this.router.url.replace('invocar-modulo', 'solicitante')]);
    }
    this.folioFormulario.markAllAsTouched();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}