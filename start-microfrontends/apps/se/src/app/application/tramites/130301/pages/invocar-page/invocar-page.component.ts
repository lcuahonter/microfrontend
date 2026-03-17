import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solicitud130301State, Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para gestionar la página de invocación del trámite 130301.
 * 
 * Este componente permite al usuario ingresar un folio de permiso, validarlo y
 * navegar a la siguiente página del trámite. También incluye funcionalidades
 * para inicializar el formulario, manejar validaciones y limpiar los datos.
 */
@Component({
  selector: 'app-invocar',
  templateUrl: './invocar-page.component.html',
  styleUrl: './invocar-page.component.scss',
})
export class InvocarComponent implements OnInit, OnDestroy {
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
  public solicitudState!: Solicitud130301State;

  /**
   * Formulario reactivo para capturar el folio de permiso.
   * 
   * Este formulario incluye validaciones para asegurar que el campo `folioPermiso`
   * sea obligatorio.
   */
  folioFormulario!: FormGroup;

  /**
   * Constructor del componente.
   * 
   * @param {Tramite130301Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite130301Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public store: Tramite130301Store,
    public tramiteQuery: Tramite130301Query,
    public fb: FormBuilder,
    private router: Router,
    private validacionesService: ValidacionesFormularioService
  ) {
    // Constructor del componente
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
          this.solicitudState = seccionState;
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
      folioPermiso: [this.solicitudState?.folioPermiso, [Validators.required]],
    });
  }

  /**
   * Establece valores en el store desde el formulario.
   * 
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {keyof Tramite130301Store} metodoNombre - El método del store que se debe invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130301Store
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
   * si es válido, redirige al usuario a la página del solicitud.
   */
  buscar(): void {
    this.folioFormulario.markAllAsTouched();
    if (this.folioFormulario.valid) {
      this.router.navigate([this.router.url.replace('invocar', 'solicitud')]);
    }
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