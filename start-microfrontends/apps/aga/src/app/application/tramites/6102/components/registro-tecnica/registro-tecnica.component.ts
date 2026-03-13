import {AprovechamientoTextos,RADIO_PARCIAL} from '../../constantes/adace6102.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import {InputRadioComponent,TituloComponent} from '@libs/shared/data-access-user/src';
import {Solicitud6102State,Solicitud6102Store} from '../../estados/solicitud6102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Solicitud6102Query } from '../../estados/solicitud6102.query';
@Component({
  selector: 'app-registro-tecnica',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    InputRadioComponent,
  ],
  templateUrl: './registro-tecnica.component.html',
  styleUrl: './registro-tecnica.component.scss',
})
export class RegistroTecnicaComponent implements OnInit, OnDestroy {
  /**
   * Variable que almacena el texto relacionado con la pregunta de reunión.
   * Se obtiene de la enumeración `AprovechamientoTextos.PREGUNTA_DE_REUNION`.
   */
  textos = AprovechamientoTextos.PREGUNTA_DE_REUNION;

  /**
   * Valor seleccionado en los radios.
   */
  valorSeleccionado: string = '';

  /**
   * Opciones para el radio relacionado con la disminución parcial.
   */
  radioParcial = RADIO_PARCIAL;

  /**
   * Formulario reactivo para gestionar los datos del aviso.
   */
  reunionForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud6102State;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de la clase RegistroTecnicaComponent.
   * 
   * @param fb - Instancia de FormBuilder para manejar formularios reactivos.
   * @param store - Servicio de estado para gestionar la información de la solicitud 6102.
   * @param query - Servicio de consulta para obtener datos relacionados con la solicitud 6102.
   * @param router - Servicio de enrutamiento para la navegación entre rutas.
   */
  constructor(
    public fb: FormBuilder,
    private store: Solicitud6102Store,
    private query: Solicitud6102Query,
    public router: Router
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `seleccionarSolicitud$` para obtener el estado de la solicitud
   *   y lo asigna a la propiedad `solicitudState`. La suscripción se gestiona con `takeUntil`
   *   para evitar fugas de memoria al destruir el componente.
   * - Llama al método `inicializarFormulario` para configurar el formulario inicial del componente.
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
    this.inicializarFormulario();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable `destroyNotifier$` para notificar a los suscriptores
   * que deben limpiar recursos o cancelar suscripciones, y luego completa el observable.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario `reunionForm` con los controles y validaciones necesarios.
   * 
   * Este método configura el formulario utilizando `FormBuilder` y asigna valores iniciales
   * basados en el estado actual de `solicitudState`. También aplica las validaciones requeridas
   * para los controles del formulario.
   * 
   * Controles del formulario:
   * - `radioParcial`: Campo obligatorio que toma su valor inicial de `solicitudState.radioParcial`.
   */
  inicializarFormulario(): void {
    this.reunionForm = this.fb.group({
      radioParcial: [this.solicitudState?.radioParcial, [Validators.required]],
    });
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
    metodoNombre: keyof Solicitud6102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Maneja el evento de clic en el botón "Siguiente".
   * 
   * Este método verifica la URL actual para determinar la ruta de navegación
   * adecuada. Si la URL contiene 'aga', redirige al usuario a la página 
   * '/aga/junta-tecnica-registro/solicitud'. Si la URL contiene 'pago', 
   * redirige al usuario a la página '/pago/junta-tecnica-registro/solicitud'.
   * 
   * @remarks
   * Este método utiliza el servicio de enrutamiento Angular para realizar 
   * la navegación basada en la URL actual.
   */
  onSiguienteClick(): void {
    const URL = this.router.url;
    if (URL.includes('aga')) {
      this.router.navigate(['/aga/junta-tecnica-registro/solicitud']);
    }
    if (URL.includes('pago')) {
      this.router.navigate(['/pago/junta-tecnica-registro/solicitud']);
    }
  }
}
