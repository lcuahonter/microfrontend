import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject,map, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';

/**
 * Componente modal para gestionar asociaciones de terceros.
 * 
 * Este componente permite al usuario interactuar con un formulario reactivo
 * para capturar y validar información relacionada con terceros, como datos
 * personales, dirección e información de contacto. También incluye lógica
 * para manejar el tipo de persona (física o moral) y ajustar el estado del
 * formulario en consecuencia.
 */
@Component({
  selector: 'app-terceros-relacionados-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './terceros-relacionados-modal.component.html',
  styleUrl: './terceros-relacionados-modal.component.scss',
})
export class TercerosRelacionadosModalComponent implements OnInit,OnDestroy {

  /** Notificador para cerrar el modal y enviar datos al componente padre.
   * Este Subject se utiliza para emitir un evento cuando el modal se cierra,
   * permitiendo que el componente padre reciba los datos del formulario
   * si es necesario.
   */
  public onClose: Subject<unknown> = new Subject();
  /**
     * Representa el título del componente modal.
     */
    titulo: string;
    /**
     * Un grupo de formulario reactivo utilizado para gestionar y validar 
     * los datos relacionados con las asociaciones de terceros en el componente.
     */
    public tercerosRelacionadosForm!: FormGroup;

    /**
     * Representa el estado de los botones de opción para seleccionar entre entidades 
     * "física" (individual) y "moral" (corporativa). Cada propiedad indica si la opción 
     * correspondiente está seleccionada.
     * 
     * @property fisica - Un booleano que indica si la opción "física" está seleccionada.
     * @property moral - Un booleano que indica si la opción "moral" está seleccionada.
     */
    public radioObjeto = {
      fisica: false,
      moral: false,
    }
    /**
     * Notificador para destruir los observables al finalizar.
     */
    private destroyNotifier$: Subject<void> = new Subject();

      /**
       * Representa el estado de la Solicitud 260701.
       * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
       * Se espera que se inicialice con una instancia de `Solicitud260303State`.
       */
      public solicitudState!: Solicitud260701State;

    /**
     * Constructor del componente FabricanteModalComponent.
     * 
     * @param bsModalRef - Referencia a la instancia del modal de Bootstrap.
     * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
     */
    constructor(
      public bsModalRef: BsModalRef,
      private fb: FormBuilder,
      private tramite260701Store: Tramite260701Store,
      private tramite260701Query: Tramite260701Query
    ) {
      this.titulo = '';
    }
  
    /**
     * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
     * Este método se utiliza para realizar la lógica de inicialización del componente.
     * En esta implementación, invoca el método `cerrarTercerosRelacionadosForm` para reiniciar o cerrar
     * el formulario relacionado con las asociaciones de terceros.
     */
    ngOnInit(): void {
      this.tramite260701Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe();
      this.cerrarTercerosRelacionadosForm();
    }
  
    /**
     * Restablece el grupo de formulario `tercerosRelacionadosForm` con valores predeterminados vacíos.
     * Este método inicializa el formulario con controles para varios campos como
     * denominación social, RFC, CURP, detalles de dirección e información de contacto.
     * Cada control se establece con una cadena vacía como su valor predeterminado.
     *
     * @returns {void}
     */
    public cerrarTercerosRelacionadosForm(): void {
      this.tercerosRelacionadosForm = this.fb.group({
        denominacionSocial: [this.solicitudState?.denominacionSocial,Validators.required],
        terceroNombre: [this.solicitudState?.terceroNombre,Validators.required],
        primerApellido: [this.solicitudState?.primerApellido,Validators.required],
        nacional: [this.solicitudState?.nacional,Validators.required],
        extranjero: [this.solicitudState?.extranjero,Validators.required],
        tipoPersona: [this.solicitudState?.tipoPersona,Validators.required],
        rfc: [this.solicitudState?.tercerosRelacionadosRfc,Validators.required],
        curp: [this.solicitudState?.curp,Validators.required],
        razonSocial: [this.solicitudState?.razonSocial,Validators.required],
        pais: [this.solicitudState?.pais,Validators.required],
        estado: [this.solicitudState?.tercerosRelacionadosEstado,Validators.required],
        municipio: [this.solicitudState?.tercerosRelacionadosMunicipio,Validators.required],
        localidad: [this.solicitudState?.tercerosRelacionadosLocalidad,Validators.required],
        codigoPostal: [this.solicitudState?.tercerosRelacionadosCodigoPostal,Validators.required],
        colonia: [this.solicitudState?.tercerosRelacionadosColonia,Validators.required],
        calle: [this.solicitudState?.tercerosRelacionadosCalle,Validators.required],
        numeroExterior: [this.solicitudState?.numeroExterior,Validators.required],
        numeroInterior: [this.solicitudState?.numeroInterior,Validators.required],
        lada: [this.solicitudState?.tercerosRelacionadosLada],
        telefono: [this.solicitudState?.tercerosRelacionadosTelefono,Validators.required],
        correoElectronico: [this.solicitudState?.tercerosRelacionadosCorreoElectronico,Validators.required],
      });
    }

    /**
     * Maneja el evento de cambio para el campo "tipoPersona" en el formulario.
     * Actualiza las propiedades de `radioObjeto` (`fisica` y `moral`) según el valor seleccionado.
     * 
     * - Si el valor seleccionado es 'fisica', `radioObjeto.fisica` se establece en `true` y `radioObjeto.moral` en `false`.
     * - Si el valor seleccionado es 'moral', `radioObjeto.moral` se establece en `true` y `radioObjeto.fisica` en `false`.
     * 
     * @returns {void}
     */
    public onChangeTipoPersona(): void {
      this.setValoresStore(this.tercerosRelacionadosForm,'tipoPersona', 'setTipoPersona');
      const RADIO = this.tercerosRelacionadosForm.get('tipoPersona')?.value;
      this.radioObjeto.fisica = RADIO === 'fisica' ? true : false;
      this.radioObjeto.moral = RADIO === 'moral' ? true : false;
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
   * Limpia el formulario `tercerosRelacionadosForm`, reseteando sus valores y estado.
   * También restablece el objeto `radioObjeto` a su estado inicial con ambas opciones en `false`.
   */
  public limpiarFormulario(): void {
    this.tercerosRelacionadosForm.reset();
    this.tercerosRelacionadosForm.markAsUntouched();
    this.tercerosRelacionadosForm.updateValueAndValidity();
    this.radioObjeto = {
      fisica: false,
      moral: false,
    }
  }

  /** 
   * Guarda el formulario si es válido y cierra el modal.
   * Si el formulario es válido, emite los valores del formulario a través del Subject `onClose`
   * y luego oculta el modal utilizando `bsModalRef.hide()`.
   */
  public guardarFormulario(): void {
    if (!this.tercerosRelacionadosForm.invalid) {
      const FORM_VALOR = this.tercerosRelacionadosForm.value;
      this.onClose.next(FORM_VALOR);
      this.bsModalRef.hide();
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
