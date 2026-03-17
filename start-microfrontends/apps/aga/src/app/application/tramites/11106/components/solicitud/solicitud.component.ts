import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud11106State, Solicitud11106Store } from '../../estados/solicitud11106.store';
import { Subject,map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud11106Query } from '../../estados/solicitud11106.query';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  selector: 'solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * @tipo {FormGroup}
   * @descripcion Representa el formulario reactivo utilizado en el componente de solicitud.
   * Este formulario se utiliza para gestionar y validar los datos de la solicitud.
   */
  solicitudForm!: FormGroup;

  esFormularioSoloLectura: boolean = false;

    /**
   * Estado de la solicitud de la sección 11106.
   */
  public solicitudState!: Solicitud11106State;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de la clase `SolicitudComponent`.
   *
   * @param formBuilder - Servicio de Angular utilizado para construir y gestionar formularios reactivos.
   * @param store - Store de Akita para gestionar el estado de la solicitud 11106.
   * @param query - Query de Akita para consultar el estado de la solicitud 11106.
   *
   * El constructor se utiliza para la inyección de dependencias necesarias en este componente.
   */
  constructor(
    public formBuilder: FormBuilder,
    private store: Solicitud11106Store,
    private query: Solicitud11106Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  
  /**
   * @override
   * @method ngOnInit
   * @description Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo `solicitudForm` con los controles necesarios y establece
   * los valores iniciales del formulario desde el store de Akita.
   * 
   */
  ngOnInit(): void {
    this.query.seleccionarAutorizacionEsNula$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }


  /**
   * @description
   * Inicializa el estado del formulario basado en si es de solo lectura o no.
   * Si es de solo lectura, guarda los datos del formulario; de lo contrario,
   * inicializa el formulario normalmente.
   * 
   * @method inicializarEstadoFormulario
   * @memberof SolicitudComponent
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {    
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }


  /**
   * @description
   * Guarda los datos del formulario e inicializa el formulario.
   * Después de inicializar, habilita o deshabilita el formulario
   * dependiendo del estado de solo lectura.
   * 
   * @method guardarDatosFormulario
   * @memberof SolicitudComponent
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.solicitudForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.solicitudForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * @description
   * Inicializa el formulario reactivo `solicitudForm` utilizando FormBuilder.
   * Configura el control `laAutorizacionEsNula` con el valor inicial del estado
   * de la solicitud.
   * 
   * @method inicializarFormulario
   * @memberof SolicitudComponent
   * @returns {void}
   */
  inicializarFormulario(): void {
     this.solicitudForm = this.formBuilder.group({
        laAutorizacionEsNula: [{ value: this.solicitudState?.laAutorizacionEsNula, disabled: false }],
    });
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param campo Nombre del campo a actualizar.
   */
  setValoresStore(
    campo: string
  ): void {
    const VALOR = this.solicitudForm.get(campo)?.value;
    this.store.setLaAutorizacionEsNula(VALOR);
  }

  /**
   * @description
   * Valida el formulario de destinatario en la solicitud. Si el formulario es inválido,
   * marca todos los campos como tocados para mostrar los errores de validación.
   *
   * @method validarDestinatarioFormulario
   * @memberof SolicitudComponent
   * @returns {void}
   */
  validarDestinatarioFormulario(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
    }
  }

  /**
   * @description
   * Emite un evento para continuar con el flujo de la solicitud.
   * Este método se utiliza para notificar a los componentes padres
   * que se debe proceder al siguiente paso.
   *
   * @method continuar
   * @memberof SolicitudComponent
   * @returns {void}
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * @override
   * @method ngOnDestroy
   * @description Método de ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
