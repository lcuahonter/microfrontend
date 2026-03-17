import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80314Query } from '../../estados/tramite80314.query';
import { Tramite80314Store } from '../../estados/tramite80314.store';
import { TramiteState } from '../../estados/tramite80314.store';

@Component({
  selector: 'app-datos-certificacion',
  templateUrl: './datos-certificacion.component.html',
  styleUrl: './datos-certificacion.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TituloComponent],
})
export class DatosCertificacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la certificación.
   * @type {FormGroup}
   */
  certificionForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: TramiteState;

  /**
   * Notificador para limpiar suscripciones al destruir el componente.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente `DatosCertificacionComponent`.
   * Inicializa el formulario reactivo `certificionForm` con valores predeterminados y deshabilitados.
   * 
   * @param {FormBuilder} fb - Instancia de `FormBuilder` utilizada para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder, public immerModificacionService: ImmerModificacionService, 
      private tramite80314Store: Tramite80314Store, private consultaioQuery: ConsultaioQuery, private query: Tramite80314Query) {
    }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos de modificación y los datos de la tabla.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
    .subscribe();
    this.inicializarFormulario();
    this.inicializarEstadoFormulario();
  }

   /**
   * Inicializa el formulario reactivo.
   */
  inicializarFormulario(): void {
    this.certificionForm = this.fb.group({
      certificion: [{ value: this.solicitudState?.certificion|| 'Si', disabled: this.esFormularioSoloLectura }],
      fechaInicio: [{ value: this.solicitudState?.fechaInicio, disabled: this.esFormularioSoloLectura }],
      fechaVigencia: [{ value: this.solicitudState?.fechaVigencia, disabled: this.esFormularioSoloLectura }]
    });
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.certificionForm?.enable();
    } else {
      this.certificionForm?.disable();
    }
  }

  /**
   * Limpia las suscripciones activas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
}
