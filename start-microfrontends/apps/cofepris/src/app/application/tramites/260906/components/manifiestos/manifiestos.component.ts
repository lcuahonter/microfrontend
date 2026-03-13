import { AlertComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260906State, Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MENSAJE_DE_ALERTA } from '@libs/shared/data-access-user/src/core/enums/260906/manifiestos.enum';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import radioButtonMexicana from '@libs/shared/theme/assets/json/260906/radioButtonMexicana.json';

/**
 * Componente para gestionar los manifiestos de la solicitud.
 * Permite al usuario indicar si desea presentar manifiestos y gestionar información confidencial.
 */
@Component({
  selector: 'app-manifiestos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    ReactiveFormsModule,
    InputRadioComponent
  ],
  templateUrl: './manifiestos.component.html',
  styleUrl: './manifiestos.component.css',
})
export class ManifiestosComponent implements OnInit, OnDestroy {
  /** Indica si el componente está en modo solo lectura */
  @Input() soloLectura: boolean = false;
  
  /** Mensaje de alerta para el usuario */
  public mensaje: string = MENSAJE_DE_ALERTA;
  
  /** Estado actual de la solicitud */
  public solicitudState!: Solicitud260906State;
  
  /** Notificador para gestionar la destrucción de suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /** Grupo de formularios para gestionar manifiestos */
  manifiestos!: FormGroup;
  
  /** Opciones para los radio buttons */
  radioOptions = radioButtonMexicana;

  /**
   * Constructor del componente
   * 
   * @param fb Constructor de formularios reactivos
   * @param tramite260906Store Store para gestionar estado del trámite
   * @param tramite260906Query Query para obtener estado de la solicitud
   */
  constructor(
    private fb: FormBuilder,
    private tramite260906Store: Tramite260906Store,
    private tramite260906Query: Tramite260906Query
  ) { }

  /**
   * Método de inicialización del componente
   * Configura suscripciones e inicializa formulario
   */
  ngOnInit(): void {
    this.tramite260906Query.selectSolicitud$
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
   * Inicializa el formulario de manifiestos
   * @private
   */
  private inicializarFormulario(): void {
    this.manifiestos = this.fb.group({
      manifesto: [this.solicitudState.manifesto],
      informacionConfidencial: [
        this.solicitudState?.informacionConfidencial, 
        [Validators.required]],
    });
  }

  /**
   * Establece valores en el store desde el formulario
   * 
   * @param form Grupo de formulario que contiene el campo
   * @param campo Nombre del campo a actualizar
   * @param metodoNombre Nombre del método en el store que actualiza el valor
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260906Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Actualiza el indicador de manifiesto en el store
   * 
   * @param evento Evento que contiene el valor del checkbox
   */
  setManifesto(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).checked;
    this.tramite260906Store.setManifesto(VALOR);
  }

  /**
   * Actualiza el valor de información confidencial en el store
   * 
   * @param evento Valor seleccionado para la propiedad
   */
  setInformacionConfidencial(evento: string | number): void {
    this.tramite260906Store.setInformacionConfidencial(evento);
  }

  /**
   * Método de limpieza al destruir el componente
   * Libera las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el estado del formulario según modo solo lectura
   * @private
   */
  private inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.manifiestos?.disable();
    } else {
      this.manifiestos?.enable();
    }
  }
}