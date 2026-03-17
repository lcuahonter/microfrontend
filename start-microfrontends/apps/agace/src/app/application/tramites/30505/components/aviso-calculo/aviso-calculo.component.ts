import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AVISO_CALCULO_OPCIONES, AVISO_PORCENTAJE_OPCIONES } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
/**
 * Componente encargado de gestionar el formulario y la lógica relacionada con el aviso de cálculo
 * para el trámite 30505. Permite la visualización y validación de los campos requeridos, así como
 * la actualización del estado de la solicitud a través del store correspondiente.
 *
 * @remarks
 * Este componente utiliza formularios reactivos para el manejo de datos y validaciones, y controla
 * la visibilidad de ciertos campos en función de las selecciones del usuario. Además, implementa
 * mecanismos para evitar fugas de memoria mediante la gestión adecuada de suscripciones.
 *
 * @example
 * <app-aviso-calculo></app-aviso-calculo>
 */
@Component({
  selector: 'app-aviso-calculo',
  templateUrl: './aviso-calculo.component.html',
  styleUrl: './aviso-calculo.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InputRadioComponent],
})
export class AvisoCalculoComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} avisoDeCalForm
   * @description
   * Formulario reactivo utilizado para gestionar y validar los datos del aviso de cálculo
   * en el componente correspondiente. Permite el manejo de los controles y validaciones
   * asociadas a la funcionalidad del aviso de cálculo.
   */
  avisoDeCalForm!: FormGroup;

  /**
   * Indica si el monto de la contribución es visible en la interfaz de usuario.
   * 
   * Cuando es `true`, el monto de la contribución se muestra al usuario.
   * Cuando es `false`, el monto permanece oculto.
   */
  montoContribuVisible: boolean = false;

  /**
   * Indica si el monto total de las contribuciones es visible en la interfaz de usuario.
   * 
   * Cuando es `true`, el monto total de las contribuciones se muestra al usuario.
   * Cuando es `false`, el monto total permanece oculto.
   */
  montoTotalContribucionesVisible: boolean = false;

  /**
   * Almacena el mensaje de error relacionado con el cálculo en la tabla.
   * 
   * Esta propiedad contiene una cadena que representa el mensaje de error
   * que se muestra cuando ocurre un problema durante el proceso de cálculo.
   * Si no hay errores, el valor será una cadena vacía.
   */
  tblErrorCalculo: string = '';

  /**
   * Representa el estado actual de la solicitud para el trámite 30505.
   * 
   * @type {Solicitud30505State}
   * @public
   */
  private solicitudState!: Solicitud30505State;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * Se emite un valor y se completa cuando el componente es destruido, permitiendo limpiar recursos y evitar fugas de memoria.
   * 
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Opciones disponibles para el aviso de cálculo.
   * 
   * Esta propiedad contiene las opciones que pueden ser seleccionadas
   * en el componente de aviso de cálculo. Las opciones son importadas
   * desde la constante `AVISO_CALCULO_OPCIONES`.
   */
  avisoCalculoOpciones = AVISO_CALCULO_OPCIONES;

  /**
   * Opciones disponibles para seleccionar el porcentaje en el aviso de cálculo.
   * 
   * Esta propiedad utiliza la constante `AVISO_PORCENTAJE_OPCIONES` para poblar
   * las opciones que el usuario puede elegir en el componente.
   */
  porcentajeOpciones = AVISO_PORCENTAJE_OPCIONES;

  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
   * Valor predeterminado: `false`.
   */
  @Input() soloLectura: boolean = false;

  /**
   * Constructor del componente AvisoCalculoComponent.
   * 
   * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param solicitud30505Store - Servicio para gestionar el estado de la solicitud 30505.
   * @param solicitud30505Query - Servicio para consultar el estado de la solicitud 30505.
   */
  constructor(private fb: FormBuilder,
    private solicitud30505Store: Solicitud30505Store,
    private solicitud30505Query: Solicitud30505Query,
  ) { }

/**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud y actualizar la propiedad `solicitudState`.
   * - Inicializa el formulario reactivo `avisoDeCalForm` con los valores obtenidos de `solicitudState` y aplica las validaciones requeridas.
   * - Llama al método `validaRadioCalculo()` para realizar validaciones adicionales relacionadas con los radios de cálculo.
   *
   * @remarks
   * Este método asegura que el formulario se inicialice correctamente con los datos actuales de la solicitud y que las validaciones necesarias estén configuradas.
   */
  
  ngOnInit(): void {

    this.solicitud30505Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.avisoDeCalForm = this.fb.group({
      capacidadAlmacenamiento: [this.solicitudState?.capacidadAlmacenamiento, Validators.required],
      tipoSolicitudPexim: [this.solicitudState?.tipoSolicitudPexim, Validators.required],
      actividadProductiva: [this.solicitudState?.actividadProductiva, Validators.required],
      tipoCaat: [this.solicitudState?.tipoCaat, Validators.required],
      tipoProgFomExp: [this.solicitudState?.tipoProgFomExp, Validators.required],
      tipoTransito: [this.solicitudState?.tipoTransito, Validators.required],
      numeroEstablecimiento: [this.solicitudState?.numeroEstablecimiento, Validators.required],
      medioTransporte: [this.solicitudState?.medioTransporte, Validators.required],
      nombreBanco: [this.solicitudState?.nombreBanco, Validators.required],
      nomOficialAutorizado: [this.solicitudState?.nomOficialAutorizado, Validators.required],
      observaciones: [this.solicitudState?.observaciones, Validators.required],
      empresaControladora: [this.solicitudState?.empresaControladora, Validators.required],
      descripcionLugarEmbarque: [this.solicitudState?.descripcionLugarEmbarque,Validators.required]
    });

    this.validaRadioCalculo();
    if(this.soloLectura) {
      this.avisoDeCalForm.disable();
    }
  }

  /**
   * Establece un valor en el store `solicitud30505Store` utilizando el método especificado.
   *
   * @param form - El formulario reactivo (`FormGroup`) del cual se obtiene el valor.
   * @param campo - El nombre del campo dentro del formulario cuyo valor se va a extraer.
   * @param metodoNombre - El nombre del método del store `Solicitud30505Store` que será invocado para actualizar el valor.
   *
   * @remarks
   * Este método obtiene el valor del campo especificado en el formulario y lo pasa como argumento
   * al método correspondiente del store, permitiendo así actualizar el estado de la solicitud.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud30505Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud30505Store[metodoNombre] as (value: string | number) => void)(VALOR);
  }


  /**
   * Valida el valor seleccionado en los radios de "capacidadAlmacenamiento" y "empresaControladora"
   * del formulario `avisoDeCalForm` y actualiza la visibilidad de los campos relacionados.
   *
   * - Si "capacidadAlmacenamiento" es igual a '1', muestra el campo de monto de contribución.
   * - Si "empresaControladora" es igual a '1', muestra el campo de monto total de contribuciones.
   *
   * @remarks
   * Este método se utiliza para controlar la visibilidad de los campos en el formulario
   * según la selección del usuario en los radios correspondientes.
   */
  validaRadioCalculo(): void {
    const CAPACIDAD = this.avisoDeCalForm.get('capacidadAlmacenamiento')?.value;
    this.montoContribuVisible = CAPACIDAD === '1';

    const EMPRESA = this.avisoDeCalForm.get('empresaControladora')?.value;
    this.montoTotalContribucionesVisible = EMPRESA === '1';
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}