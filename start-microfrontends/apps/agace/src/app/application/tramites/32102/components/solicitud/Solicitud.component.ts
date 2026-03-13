import {AbstractControl, FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,ValidationErrors,ValidatorFn} from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Solicitud32102State, Tramite32102Store } from '../../../../estados/tramites/tramite32102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud32102Enum } from '../../constants/solicitud32101.enum';
import {TituloComponent} from '@libs/shared/data-access-user/src';
import { Tramite32102Query } from '../../../../estados/queries/tramite32102.query';

/**
 * Componente que representa la solicitud en el contexto del trámite 32102.
 * Este componente utiliza un formulario reactivo para gestionar los datos
 * relacionados con el aviso de extensión y permite la interacción con el estado
 * del trámite a través de un store y un query.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule],
  providers: [],
  templateUrl: './Solicitud.component.html',
  styleUrl: './Solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario reactivo utilizado para gestionar los datos
   * relacionados con el aviso de extensión en el componente de solicitud.
   */
  formularioAvisoDeExtension!: FormGroup;

  /**
   * Enumeración que representa los valores posibles para la solicitud en el contexto del trámite 32102.
   */
  solicitudEnum = Solicitud32102Enum;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud32102State;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa la suscripción al estado de solo lectura y llama a la inicialización del formulario.
   * 
   * fb FormBuilder para crear el formulario reactivo.
   * tramite32102Store Store para actualizar el estado del trámite.
   * tramite32102Query Query para obtener el estado del trámite.
   * consultaioQuery Query para obtener el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    public tramite32102Store: Tramite32102Store,
    private tramite32102Query: Tramite32102Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable selectSolicitud$ del servicio tramite32102Query para obtener el estado de la solicitud
   * y lo asigna a la propiedad solicitudState. La suscripción se gestiona con takeUntil para evitar fugas de memoria.
   * Llama al método inicializarEstadoFormulario para configurar el formulario inicial del componente.
   */
  ngOnInit(): void {
    this.tramite32102Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, deshabilita los campos y ajusta la configuración de la fecha.
   * Si no, inicializa el formulario en modo editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   * Si el formulario está en modo solo lectura, lo deshabilita; si no, lo habilita.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formularioAvisoDeExtension.disable();
    } else {
      this.formularioAvisoDeExtension.enable();
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable destroyNotifier$ para notificar a los suscriptores
   * que deben limpiar recursos o cancelar suscripciones, y luego completa el observable.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario formularioAvisoDeExtension con un conjunto de controles reactivos.
   * Cada control está asociado a una propiedad del estado solicitudState y requiere que su valor sea verdadero.
   * Aplica el validador personalizado para que todos los checkboxes deban estar seleccionados.
   */
  inicializarFormulario(): void {
    this.tramite32102Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.formularioAvisoDeExtension = this.fb.group(
      {
        MANIFIESTO_1: [this.solicitudState?.MANIFIESTO_1 || false],
        MANIFIESTO_2: [this.solicitudState?.MANIFIESTO_2 || false],
        MANIFIESTO_3: [this.solicitudState?.MANIFIESTO_3 || false],
        MANIFIESTO_4: [this.solicitudState?.MANIFIESTO_4 || false],
      },
      { validators: SolicitudComponent.allCheckboxesSelectedValidator() }
    );
  }

  /**
   * Validador personalizado que verifica si todos los checkboxes en un formulario están seleccionados.
   * Devuelve null si todos los controles tienen el valor true, o un error si alguno no está seleccionado.
   */
  static allCheckboxesSelectedValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const CONTROLS = (formGroup as FormGroup).controls;
      const ARE_ALL_CHECKED = Object.values(CONTROLS).every(
        (control) => control.value === true
      );
      return ARE_ALL_CHECKED ? null : { notAllSelected: true };
    };
  }

  /**
   * Establece el valor de un campo en el store del trámite.
   * form Formulario reactivo.
   * campo Nombre del campo a actualizar.
   * metodoNombre Nombre del método en el store que se debe invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32102Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }
}
