
import { AL_DAR, AlertComponent, Notificacion, NotificacionesComponent, TituloComponent } from '@libs/shared/data-access-user/src';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Solicitud260211State,
  Tramite260211Store
} from '../../../../estados/tramites/tramite260211.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomicilloComponent } from '../domicillo/domicillo.component';
import { ManifiestosComponent } from '../manifiestos/manifiestos.component';
import { RepresentanteLegalComponent } from '../representanteLegal/representanteLegal.component';
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';
 
/**
 * @component
 * @name DatosDeLaComponent
 * @description
 * Componente responsable de gestionar y mostrar los datos principales del formulario,
 * incluyendo domicilio, manifiestos y representante legal.
 */
@Component({
  selector: 'app-datos-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    DomicilloComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,NotificacionesComponent
  ],
  templateUrl: './datosEstablecimiento.component.html',
  styleUrls: ['./datosEstablecimiento.component.scss'],
})
export class DatosEstablecimientoComponent implements OnInit, OnDestroy {
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
 public esFormularioSoloLectura: boolean = false; 
  /**
   * Estado de la solicitud.
   * @type {Solicitud260211State}
   */
  public solicitudState!: Solicitud260211State;
 
  /**
   * Notificador para destruir observables y evitar memory leaks.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
 
  /**
   * Grupo de formularios principal.
   * @type {FormGroup}
   */
  public forma!: FormGroup;
 
  /**
   * Indica si la sección es colapsable.
   * @type {boolean}
   * @default true
   */
  public colapsable: boolean = true;
 
  /**
   * Constantes importadas desde el archivo de enumeración que contienen textos importantes y advertencias.
   * @type {typeof AL_DAR}
   */
  public TEXTOS = AL_DAR;
 /**
* @constructor
* Inicializa el componente y gestiona la inyección de dependencias necesarias.
*
* @param {FormBuilder} fb - Servicio para construir formularios reactivos.
* @param {Tramite260211Store} tramite260211Store - Store para gestionar el estado del trámite.
* @param {Tramite260211Query} tramite260211Query - Consulta para obtener datos del estado del trámite.
*/
constructor(
  public readonly fb: FormBuilder,
  private tramite260211Store: Tramite260211Store,
  private tramite260211Query: Tramite260211Query,
   private consultaioQuery: ConsultaioQuery
) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
       .subscribe();
}
  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Obtiene datos del estado de la solicitud y configura el formulario.
   * @returns {void}
   */
  ngOnInit(): void {
     this.inicializarEstadoFormulario();
   

  }
   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
    
  }
  /**
   * Inicializa el formulario con los datos de la solicitud.
   * Se suscribe al estado de la solicitud para obtener los valores iniciales.
   * Los campos del formulario se configuran como deshabilitados o requeridos según sea necesario.
   */
  inicializarFormulario():void{
 this.tramite260211Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
 
    this.forma = this.fb.group({
      /**
       * RFC del solicitante, campo deshabilitado.
       */
      rfcResponsableSanitario: [{ value: this.solicitudState?.rfcResponsableSanitario, disabled: true }],
 
      /**
       * Denominación del solicitante, campo requerido.
       */
      denominacion: [
        { value: this.solicitudState?.denominacion, disabled: true },
        Validators.required,
      ],
 
      /**
       * Correo electrónico del solicitante, campo requerido.
       */
      correo: [
        { value: this.solicitudState?.correo, disabled: true },
        Validators.required,
      ],
    });
  }
    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.forma.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.forma.enable();
      }
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @returns {void}
   */
  public mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }
   /**
   * @description
   * Notificación actual que se muestra en el componente.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Habilita todos los controles del formulario si están deshabilitados.
   * @returns {void}
   */
  public toggleFormControls(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    Object.keys(this.forma.controls).forEach((controlName) => {
      const CONTROL = this.forma.get(controlName);
      if (CONTROL?.disabled) {
        CONTROL.enable();
      }
    });
  }
 
  /**
   * Establece el valor de un campo en el store de Tramite260211.
   *
   * @param {FormGroup} form - El grupo de formularios que contiene el campo.
   * @param {string} campo - El nombre del campo cuyo valor se va a establecer.
   * @param {keyof Tramite260211Store} metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   * @returns {void}
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260211Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260211Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
 
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable `destroyNotifier$` para cancelar las suscripciones activas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
 