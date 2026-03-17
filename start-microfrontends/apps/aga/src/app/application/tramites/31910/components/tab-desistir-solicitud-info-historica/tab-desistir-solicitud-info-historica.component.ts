import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud31910State,
  Tramite31910Store,
} from '../../estados/stores/tramite31910.store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Tramite31910Query } from '../../estados/queries/tramite31910.query';
import { TituloComponent } from "@libs/shared/data-access-user/src";

/**
 * Componente que gestiona la información histórica de la solicitud de desistimiento.
 * Permite la creación y gestión de un formulario reactivo para capturar observaciones.
 */
@Component({
  selector: 'app-tab-desistir-solicitud-info-historica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './tab-desistir-solicitud-info-historica.component.html',
  styleUrl: './tab-desistir-solicitud-info-historica.component.scss',
})
export class TabDesistirSolicitudInfoHistoricaComponent
  implements OnInit, OnDestroy {
  /**
   * solicitud reactivo para capturar las observaciones del usuario.
   */
  solicitud!: FormGroup;

  /**
   * Estado actual de la solicitud 31910.
   */
  private seccionState!: Solicitud31910State;

  /**
   * Sujeto utilizado para manejar la destrucción de suscripciones.
   */
  private destroy$ = new Subject<void>();

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Folio del trámite actual.
   */
  folioTramitePadre: string = '';

  /**
   * Constructor que inicializa los servicios necesarios para el componente.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31910Store: Tramite31910Store,
    private tramite31910Query: Tramite31910Query
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura las suscripciones y crea el formulario.
   */
  ngOnInit(): void {
    this.crearFormulario();
    this.tramite31910Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Solicitud31910State) => {
        if (data.esLecutra) {
          this.esFormularioSoloLectura = true;
          this.solicitud.get('justificacion')?.setValue(data.justificacion || '');
          this.solicitud.disable();
          this.folioTramitePadre = data.folioTramitePadre || '';
        }
      });

  }

  /**
   * Crea el solicitud reactivo con los campos necesarios.
   */
  crearFormulario(): void {
    this.solicitud = this.fb.group({
      justificacion: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }

  /**
   * Actualiza el estado de la solicitud en el store con los valores del formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite31910Store.actualizarEstado({ [campo]: VALOR });
  }

  /**
   * * Verifica si el formulario es válido.
   * @returns {boolean} - Retorna `true` si el formulario es válido, de lo contrario `false`.
   */
  esFormValido(): boolean {
    return this.solicitud.valid;
  }

  /**
   * Marca todos los campos del formulario como tocados para activar las validaciones.
   * Esto es útil para mostrar mensajes de error cuando el usuario intenta enviar un formulario incompleto o inválido.
   */
  marcarCamposComoTocados(): void {
    this.solicitud.markAllAsTouched();
  }

  validarFormulario(): boolean {
    return this.solicitud.valid;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
