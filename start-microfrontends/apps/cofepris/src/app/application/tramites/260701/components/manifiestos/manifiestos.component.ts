import { AlertComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject,map , takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MENSAJE_DE_ALERTA } from '../../services/certificados-licencias.enum';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';

/**
 * Componente `ManifiestosComponent` que gestiona la visualización y funcionalidad
 * de los manifiestos en la aplicación. Este componente incluye un formulario reactivo
 * para capturar datos relacionados con los manifiestos y opciones de selección mediante
 * botones de radio.
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
  styleUrl: './manifiestos.component.scss',
})
export class ManifiestosComponent implements OnInit,OnDestroy {

   /**
     * Mensaje de alerta para el usuario.
     */
    public mensaje: string = MENSAJE_DE_ALERTA;
   
    /**
     * Grupo de formularios principal para gestionar los manifiestos.
     */
    manifiestos!: FormGroup;

  /**
    * Opciones de radio.
    */
   public radioOpcions = [
     { label: 'No', value: 'no' },
     { label: 'Sí', value: 'sí' }
   ];

    /**
     * Valor seleccionado del radio.
     */
    public valorSeleccionado!: string;
    /**
     * Subject para notificar la destrucción del componente.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
     * Representa el estado de la Solicitud 260701.
     * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
     * Se espera que se inicialice con una instancia de `Solicitud260701State`.
     */
    public solicitudState!: Solicitud260701State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
    public esFormularioSoloLectura: boolean = false;
   
    /**
     * Constructor del componente.
     * @param fb - FormBuilder para la creación de formularios.
     */
    constructor(
      private fb: FormBuilder,
      private tramite260701Store: Tramite260701Store,
      private tramite260701Query: Tramite260701Query,
      private consultaioQuery: ConsultaioQuery
    ) {
      this.consultaioQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    }
   
    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Obtiene el estado de la solicitud y crea el formulario de manifiestos.
     */
    ngOnInit(): void {
      this.inicializarFormulario();
    }

    /**
     * Inicializa el formulario de manifiestos y se suscribe al estado de la solicitud.
     *
     * Este método configura una suscripción al observable `selectSolicitud$` de `tramite260701Query`
     * para mantener actualizado el `solicitudState` local. También inicializa el grupo de formularios
     * `manifiestos` con el valor actual de `cumplimiento` del `solicitudState`.
     *
     * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor.
     */
    public inicializarFormulario(): void {
      this.tramite260701Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.solicitudState = seccionState;
      })).subscribe();
   
      /**
       * Inicialización del formulario de manifiestos.
       */
      this.manifiestos = this.fb.group({
        cumplimiento: [this.solicitudState?.cumplimiento],
      });

  }

  /**
   * Cambia el valor seleccionado del radio.
   * @param value Valor seleccionado.
   */
  public cambiarRadio(value: string | number):void {
    this.valorSeleccionado = value as string;
  }

    /**
     * Establece el valor de un campo en el store de Tramite31601.
     * @param form - El grupo de formularios que contiene el campo.
     * @param campo - El nombre del campo cuyo valor se va a establecer.
     * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
     */
      public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260701Store): void {
        const VALOR = form.get(campo)?.value;
        (this.tramite260701Store[metodoNombre] as (value: unknown) => void)(VALOR);
      }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); 
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario y alterna su estado habilitado/deshabilitado según la bandera de solo lectura.
   *
   * - Llama a `inicializarFormulario()` para reiniciar o configurar el formulario.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), deshabilita el grupo de formularios `manifiestos` después de un breve retraso.
   * - Si no está en modo solo lectura, habilita el grupo de formularios `manifiestos`.
   */
  public guardarDatosFormulario(): void {
      this.inicializarFormulario();
      Promise.resolve().then(() => {
        if (this.esFormularioSoloLectura) {
          this.manifiestos.disable();
        } else if (!this.esFormularioSoloLectura) {
          this.manifiestos.enable();
        }
      });
    }
    
    /**
     * Método para actualizar el banco seleccionado.
     * @param e {Catalogo} Banco seleccionado.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
