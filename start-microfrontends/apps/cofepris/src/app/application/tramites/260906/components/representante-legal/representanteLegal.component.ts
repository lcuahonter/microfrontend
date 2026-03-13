import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260906State, Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoginQuery, TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import { SanitarioService } from '../../services/sanitario.service';

/**
 * Componente para gestionar la información del representante legal en la solicitud.
 * Permite capturar y actualizar los datos del representante legal asociado al trámite.
 */
@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule
  ],
  templateUrl: './representanteLegal.component.html',
  styleUrl: './representanteLegal.component.css',
})
export class RepresentanteLegalComponent implements OnInit, OnDestroy {
  /** Indica si el componente está en modo solo lectura */
  @Input() soloLectura: boolean = false;
  
  /** Estado actual de la solicitud */
  public solicitudState!: Solicitud260906State;
  
  /** Notificador para gestionar la destrucción de suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /** Grupo de formularios para el representante legal */
  representante!: FormGroup;

  loginRfc: string = '';

  /**
   * Constructor del componente
   * @param fb Constructor de formularios reactivos
   * @param tramite260906Store Store para gestionar estado del trámite
   * @param tramite260906Query Query para obtener estado de la solicitud
   */
  constructor(
    public readonly fb: FormBuilder,
    private tramite260906Store: Tramite260906Store,
    private tramite260906Query: Tramite260906Query,
    private loginQuery: LoginQuery,
    private sanitarioService: SanitarioService
  ) { 
    this.loginQuery.selectLoginState$.pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.loginRfc = seccionState.rfc;
      })).subscribe();
   }

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
   * Inicializa el formulario de representante legal
   * @private
   */
  private inicializarFormulario(): void {
    this.representante = this.fb.group({
      rfc: [
        this.solicitudState?.rfc, 
        Validators.required
      ],
      nombre: [
        { value: this.solicitudState?.nombre, disabled: true }, 
        Validators.required
      ],
      apellidoPaterno: [
        { value: this.solicitudState?.apellidoPaterno, disabled: true }, 
        Validators.required
      ],
      apellidoMaterno: [
        { value: this.solicitudState?.apellidoMaterno, disabled: true }
      ],
    });
  }

  /**
   * Simula la obtención de nuevos valores y actualiza el formulario
   * @remarks
   * Este método es de demostración y debería ser reemplazado con lógica real
   */
  obtenerValor(): void {
    const PAYLOAD = {
      rfcRepresentanteLegal: this.loginRfc,
    }
    this.sanitarioService.buscar(PAYLOAD).subscribe((response) => {
      // Suponiendo que la respuesta contiene los datos del representante legal
      this.representante.patchValue({
        nombre: 47875, // Nota: Esto debería ser una cadena, considera ajustar si es necesario.
        apellidoPaterno: 'Paterno',
        apellidoMaterno: 'Materno',
      });
    });
  }

  /**
   * Establece valores en el store desde el formulario
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
      this.representante?.disable();
    } else {
      this.representante?.enable();
    }
  }
}