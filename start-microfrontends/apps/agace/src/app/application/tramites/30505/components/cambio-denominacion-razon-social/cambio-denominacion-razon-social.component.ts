import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subject, map , takeUntil } from 'rxjs';

import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { CommonModule } from '@angular/common';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';

/**
 * Componente para gestionar el aviso de cambio de denominación o razón social.
 *
 * Este componente permite capturar y validar los datos relacionados con el trámite de cambio de denominación o razón social,
 * mostrando mensajes de error y sincronizando el estado del formulario con el store global.
 *
 * @remarks
 * Utiliza formularios reactivos y suscripciones a observables para mantener el estado actualizado y evitar fugas de memoria.
 *
 * @example
 * <app-cambio-denominacion-razon-social></app-cambio-denominacion-razon-social>
 *
 * @see Solicitud30505Store
 * @see Solicitud30505Query
 */
@Component({
  selector: 'app-cambio-denominacion-razon-social',
  templateUrl: './cambio-denominacion-razon-social.component.html',
  styleUrls: ['./cambio-denominacion-razon-social.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CambioDenominacionRazonSocialComponent implements OnDestroy,OnInit{


  /**
   * Formulario reactivo para gestionar el aviso de cambio de denominación o razón social.
   * Utilizado para capturar y validar los datos relacionados con el trámite correspondiente.
   */
  avisoCambioRazonSocialForm!: FormGroup;


  /**
   * Indica si se debe mostrar un mensaje en la interfaz de usuario.
   * 
   * Cuando es `true`, el mensaje se muestra; cuando es `false`, el mensaje permanece oculto.
   */
  mostrarMensaje: boolean = false;


  /**
   * Mensaje de error que se muestra cuando la razón social ingresada es igual a la anterior.
   * Se utiliza para informar al usuario que no se han realizado cambios en la razón social.
   */
  tblErrorRazonSocialIgual: string = '';


  /**
   * Mensaje de error relacionado con el folio del acuse.
   * Se utiliza para mostrar información de error al usuario cuando ocurre un problema
   * con el folio del acuse en el componente de cambio de denominación o razón social.
   */
  tblErrorFolioAcuse: string = '';


  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * 
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones a observables y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();


  /**
   * Representa el estado actual del aviso dentro del trámite de cambio de denominación o razón social.
   * 
   * @type {Solicitud30505State}
   */
  private avisoState!: Solicitud30505State;
 
    /**
     * Indica si el componente debe estar en modo solo lectura.
     * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
     * Valor predeterminado: `false`.
     */
    @Input() soloLectura: boolean = false;

  /**
   * Constructor de la clase.
   * 
   * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param tramiteStore - Instancia de Solicitud30505Store para manejar el estado de la solicitud.
   * @param tramiteQuery - Instancia de Solicitud30505Query para consultar el estado de la solicitud.
   */
  constructor(private fb: FormBuilder, private tramiteStore: Solicitud30505Store, private tramiteQuery: Solicitud30505Query) {
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `inicializarFormulario` para configurar el formulario inicial.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario de aviso de cambio de razón social.
   *
   * - Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud
   *   y asignarlo a la propiedad `AvisoState`.
   * - Crea el formulario reactivo `avisoCambioRazonSocialForm` con los campos necesarios,
   *   algunos de ellos deshabilitados y precargados con los valores de `AvisoState`.
   * - El campo `folioAcuse` es obligatorio.
   *
   * @remarks
   * Este método debe llamarse durante la inicialización del componente para asegurar
   * que el formulario se configure correctamente con los datos actuales de la solicitud.
   */

  inicializarFormulario(): void {

    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.avisoState = seccionState;
        })
      )
      .subscribe()

    this.avisoCambioRazonSocialForm = this.fb.group({
      rfcVucem: [{ value: this.avisoState?.rfcVucem, disabled: true }],
      razonSocialVucem: [{ value: this.avisoState?.razonSocialVucem, disabled: true }],
      rfcIdc: [{ value: this.avisoState?.rfcIdc, disabled: true }],
      razonSocialIdc: [{ value: this.avisoState?.razonSocialIdc, disabled: true }],
      folioAcuse: [this.avisoState?.folioAcuse, Validators.required]

    });
    if (this.soloLectura) {
      this.avisoCambioRazonSocialForm.disable();
    }
  }

  /**
   * Valida y establece el folio de acuse en el formulario de aviso de cambio de razón social.
   * 
   * Obtiene el valor del campo 'folioAcuse' del formulario `avisoCambioRazonSocialForm`
   * y lo asigna en el store `tramiteStore` mediante el método `setFolioAcuse`.
   * 
   * @remarks
   * Este método se utiliza para sincronizar el valor del folio de acuse ingresado por el usuario
   * con el estado global de la aplicación.
   */
  validarFolioAcuse(): void {
    const FOLIO_ACUSE = this.avisoCambioRazonSocialForm.get('folioAcuse')?.value;
    this.tramiteStore.setFolioAcuse(FOLIO_ACUSE);

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
     this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}