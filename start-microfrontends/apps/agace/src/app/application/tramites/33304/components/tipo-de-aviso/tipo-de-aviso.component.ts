import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Solicitud33304State, Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud33304Enum } from '../../constants/solicitud33304.enum';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { TituloComponent } from '@libs/shared/data-access-user/src';



@Component({
  selector: 'app-tipo-de-aviso',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './tipo-de-aviso.component.html',
  styleUrl: './tipo-de-aviso.component.scss',
})
export class TipoDeAvisoComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario reactivo utilizado para gestionar los datos
   * relacionados con el aviso de extensión en el componente de solicitud.
   */
  formularioTipoDeAviso!: FormGroup;

  /**
   * Enumeración que representa los valores posibles para la solicitud en el contexto del trámite 33304.
   */
  solicitudEnum = Solicitud33304Enum;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud33304State;

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
   * Solicitud33304Store Store para actualizar el estado del trámite.
   * solicitud33304Query Query para obtener el estado del trámite.
   * consultaioQuery Query para obtener el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    public solicitud33304Store: Solicitud33304Store,
    private solicitud33304Query: Solicitud33304Query,
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
   * Suscribe al observable selectSolicitud$ del servicio solicitud33304Query para obtener el estado de la solicitud
   * y lo asigna a la propiedad solicitudState. La suscripción se gestiona con takeUntil para evitar fugas de memoria.
   * Llama al método inicializarEstadoFormulario para configurar el formulario inicial del componente.
   */
  ngOnInit(): void {
    this.solicitud33304Query.selectSolicitud$
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
      this.formularioTipoDeAviso.disable();
    } else {
      this.formularioTipoDeAviso.enable();
    }
  }

  /**
   * Inicializa el formulario formularioTipoDeAviso con un conjunto de controles reactivos.
   * Cada control está asociado a una propiedad del estado solicitudState y requiere que su valor sea verdadero.
   * Aplica el validador personalizado para que todos los checkboxes deban estar seleccionados.
   */
  inicializarFormulario(): void {
    this.solicitud33304Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.formularioTipoDeAviso = this.fb.group(
      {
        cambioDocumentoUsoGoce: [this.solicitudState?.cambioDocumentoUsoGoce || false],
        fusionEscisionEmpresas: [this.solicitudState?.fusionEscisionEmpresas || false],
        reestructuracion: [this.solicitudState?.reestructuracion || false], 
        transportistas: [this.solicitudState?.transportistas || false],
        BAJO_MANIFIESTO: [this.solicitudState?.BAJO_MANIFIESTO || false]
      }
    );
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud33304Store.actualizarEstado({
        [campo]: CONTROL.value,
      });
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
}
