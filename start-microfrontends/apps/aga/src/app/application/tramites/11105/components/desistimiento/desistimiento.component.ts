import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {ReplaySubject, Subject, map,takeUntil } from 'rxjs';
import { Solicitud11105State, Solicitud11105Store } from '../../estados/solicitud11105.store';
import { CommonModule } from '@angular/common';
import { Solicitud11105Query } from '../../estados/solicitud11105.query';
import { TituloComponent } from '@libs/shared/data-access-user/src';


/**
 * Componente para gestionar el formulario de desistimiento.
 */
@Component({
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  selector: 'app-desistimiento',
  templateUrl: './desistimiento.component.html',
  styleUrl: './desistimiento.component.scss',
})
export class DesistimientoComponent implements OnInit {
  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Evento de salida que emite un valor de tipo cadena.
   * Este evento se utiliza para notificar cuando se debe continuar con una acción específica.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Grupo de formulario para gestionar los datos del desistimiento.
   */
  desisitimientoForm!: FormGroup;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud11105State;

  /**
   * Constructor de la clase.
   * @param formBuilder Servicio FormBuilder para construir formularios reactivos.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    public formBuilder: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private store: Solicitud11105Store,
    private query: Solicitud11105Query,
    private validacionesService: ValidacionesFormularioService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.initializeFormalario();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.destinarioFormulario();
        })
      )
      .subscribe();
  }

  initializeFormalario(): void {
    this.desisitimientoForm = this.formBuilder.group({
      folioOriginal: [this.solicitudState?.folioOriginal,
      ],
      justificacionDelDesistimiento: [ this.solicitudState?.justificacionDelDesistimiento,
        [
          Validators.required,
          Validators.maxLength(1000)
        ],
      ],
    });
    this.destinarioFormulario();
  }

  /**
   * Configura el formulario del destinatario según el estado de la solicitud.
   *  Si el formulario está en modo solo lectura, deshabilita los campos del formulario.
   *  @returns {void}
   */
  destinarioFormulario(): void {
    if (this.soloLectura) {
      this.desisitimientoForm.disable();
    } else {
      this.desisitimientoForm.enable();
    }
  }

  
  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método del almacén para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud11105Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   *  @method get adaceForm
   * @description
   */
  get folioOriginal(): FormGroup {
    return this.desisitimientoForm.get('folioOriginal') as FormGroup;
  }

  /**
   * Emite un evento para continuar con el flujo del componente.
   *
   * Este método dispara el evento `continuarEvento` sin ningún valor asociado,
   * permitiendo que otros componentes o servicios reaccionen a esta acción.
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }
}
