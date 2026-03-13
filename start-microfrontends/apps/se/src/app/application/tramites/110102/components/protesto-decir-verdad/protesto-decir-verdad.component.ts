import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';

import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion } from '@ng-mf/data-access-user';
import { ProtestoEvaluacionService } from '../../service/protesto-evaluacion.service';


@Component({
  selector: 'app-protesto-decir-verdad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './protesto-decir-verdad.component.html',
  styleUrl: './protesto-decir-verdad.component.scss',
})
export class ProtestoDecirVerdadComponent implements OnInit, OnDestroy {
  /**
   * Estado actual de la consulta.
   *
   * Almacena toda la información relacionada con la sección de consulta
   * que se obtiene desde el store `ConsultaioQuery`.
   */
   public consultaState!: ConsultaioState;
  
  /**
  * Notificación actual que se muestra en el componente.
  *
  * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
  * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion ;
  /**
    * **Subject utilizado para manejar la destrucción de suscripciones**
    * 
    * Este `Subject` se emite en `ngOnDestroy` para notificar y completar todas las
    * suscripciones activas, evitando posibles fugas de memoria en el componente.
    */
  private destroy$ = new Subject<void>();
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;
  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea del tipo 'FormGroup'.
   *
   * @property {FormGroup} protestoForm - El formulario del componente.
   */
  public protestoForm!: FormGroup;
  /**
  * Una constante que contiene el valor del objeto 'PROTESTA'.
  * Se utiliza para almacenar datos adicionales relacionados con el componente.
  */

  public TEXTOS: string = '';
  /**
   * Indica si se está realizando una actualización de la consulta.
   * 
   * @default false
   */
  public actualizacionCounsulta: boolean = false;

  constructor(private consultaioQuery: ConsultaioQuery,
    private protestoEvaluacionService: ProtestoEvaluacionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaState= seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (seccionState.update) {
            this.actualizacionCounsulta = seccionState.update;

          }
        })
      )
      .subscribe();
  }

  /**
 * Método del ciclo de vida `ngOnInit`.
 *
 * Inicializa el formulario reactivo y carga los datos de la declaración
 * de protesta llamando a `protesto()`.
 */
  ngOnInit(): void {
    this.protestoForm = this.fb.group({
      manifiesto: [{ value: false, disabled: this.esFormularioSoloLectura }]
    });
    this.protesto();
  }

/**
 * Obtiene la declaración bajo protesta de decir la verdad para la solicitud actual.
 *
 * Llama al servicio `ProtestoEvaluacionService` usando el `id_solicitud` del estado de la consulta.
 * - Si la respuesta es exitosa, llena `TEXTOS` y marca el checkbox según el valor de `acepto`.
 * - Si ocurre un error o la respuesta no es exitosa, muestra una notificación al usuario.
 */
  protesto(): void {
    this.protestoEvaluacionService.getProtestoEvaluacion(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO && response.datos) {
            const DECLARACION = response.datos[0];
            this.TEXTOS = DECLARACION.descripcion;
            this.protestoForm.get('manifiesto')?.setValue(DECLARACION.acepto === 1);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error obtener protesto.',
              mensaje: response.causa || response.mensaje || 'Error obtener protesto.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error obtener protesto.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * **Ciclo de vida: OnDestroy**
   * 
   * Este método se ejecuta cuando el componente se destruye. 
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   * 
   * - Envía un valor a `destroy$` para notificar a los observables que deben completarse.
   * - Completa `destroy$` para liberar los recursos asociados.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
