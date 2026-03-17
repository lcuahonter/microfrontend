import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { DatosSolicitudState } from '../../estados/store/tramite140218.store';

import { TituloComponent } from '@libs/shared/data-access-user/src';
import renuncia from '@libs/shared/theme/assets/json/140218/renuncia.json';

import { MANIFIESTO_ACEPTACION_HTML } from '../../constantes/renuncia-de-permiso.enum';
import { Tramite140218Query } from '../../estados/query/tramite140218.query';
import { Tramite140218Store } from '../../estados/store/tramite140218.store';


/**
 * @class RenunciaDeDerechosComponent
 * @description Componente para gestionar la funcionalidad de renuncia de derechos en el trámite 140218.
 * Este componente utiliza un formulario reactivo para capturar y mostrar información relacionada
 * con la renuncia de derechos, además de interactuar con el estado del almacén y las consultas del trámite.
 * 
 * @remarks
 * Este componente implementa los ganchos de ciclo de vida `OnInit` y `OnDestroy` para inicializar
 * y limpiar los recursos utilizados, respectivamente. También incluye métodos para configurar
 * el formulario, establecer valores iniciales y actualizar el estado del almacén.
 * 
 * @example
 * <app-renuncia-de-derechos></app-renuncia-de-derechos>
 * 
 * @implements OnInit
 * @implements OnDestroy
 */
@Component({
  selector: 'app-renuncia-de-derechos',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './renuncia-de-derechos.component.html',
  styleUrl: './renuncia-de-derechos.component.scss',
})
export class RenunciaDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la renuncia de derechos.
   * Este formulario contiene los campos necesarios para capturar y mostrar
   * la información relacionada con la renuncia de derechos.
   */
  renunciaDerechosForm!: FormGroup;

  /**
   * Texto del manifiesto de aceptación en formato HTML.
   * Este texto se utiliza para mostrar el contenido del manifiesto
   * en la interfaz de usuario.
   */
  manifestoText = MANIFIESTO_ACEPTACION_HTML;

  /**
   * Notificador para destruir las suscripciones activas.
   * Este Subject se utiliza para gestionar la limpieza de las suscripciones
   * y evitar fugas de memoria en el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud.
   * Este objeto contiene la información relacionada con el estado actual
   * de la solicitud en el flujo del trámite.
   */
  public solicitudState!: DatosSolicitudState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * 
   * @type {boolean}
   * @memberof DatosDelTramiteComponent
   */
  @Input() public soloLectura: boolean = false;

  /**
   * Constructor de la clase RenunciaDeDerechosComponent.
   * 
   * @param formBuilder - Servicio para construir y gestionar formularios reactivos.
   * @param tramite140218Store - Almacén para gestionar el estado relacionado con el trámite 140218.
   * @param tramite140218Query - Servicio para consultar el estado del trámite 140218.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite140218Store: Tramite140218Store,
    private tramite140218Query: Tramite140218Query
  ) {
    //Reservado para futuras inyecciones de dependencias o inicializaciones.
    this.crearAgregarFormulario();
  }

  /**
   * Método de inicialización del componente.
   * Este método se ejecuta al inicializar el componente y se encarga
   * de crear y configurar el formulario reactivo para la renuncia de derechos.
   */
  ngOnInit(): void {
    this.crearAgregarFormulario();
  }

  /**
   * Método para crear y configurar el formulario reactivo de renuncia de derechos.
   * Este método inicializa el formulario con los valores actuales del estado de la solicitud
   * y deshabilita los campos que no deben ser editables por el usuario.
   */
  crearAgregarFormulario(): void {
    this.tramite140218Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as DatosSolicitudState;
           if (this.renunciaDerechosForm) {
         this.renunciaDerechosForm.get('motivoRenuncia')?.setValue(this.solicitudState['motivoRenuncia']);
         this.renunciaDerechosForm.get('manifesto')?.setValue(this.solicitudState['manifesto'])
        } 
        })
      )
      .subscribe();

    this.renunciaDerechosForm = this.formBuilder.group({
      folioTramite: [{ value: '', disabled: true }],
      tipoSolicitud: [{ value: '', disabled: true }],
      regimen: [{ value: '', disabled: true }],
      clasificacionRegimen: [{ value: '', disabled: true }],
      periodoVigencia: [{ value: '', disabled: true }],
      unidadMedida: [{ value: '', disabled: true }],
      fraccionArancelaria: [{ value: '', disabled: true }],
      cantidadAutorizada: [{ value: '', disabled: true }],
      valorAutorizado: [{ value: '', disabled: true }],
      nico: [{ value: '', disabled: true }],
      descripcionNico: [{ value: '', disabled: true }],
      acotacion: [{ value:'', disabled: true }],
      permisoDesde: [{ value: '', disabled: true }],
      permisoHasty: [{ value: '', disabled: true }],
      motivoRenuncia: [this.solicitudState['motivoRenuncia']], // este sí es editable
      manifesto:[this.solicitudState['manifesto']]
      
    });
    this.setRenunciaDerechosForm();

    // Actualizar el estado del almacén con los datos del formulario
    this.updateStoreWithFormData();

     if(this.soloLectura){
        this.renunciaDerechosForm.disable();
      }
  }


  /**
   * @method setRenunciaDerechosForm
   * @description Establece los valores iniciales en el formulario `renunciaDerechosForm` 
   * utilizando los datos proporcionados en `renuncia.formData`.
   * 
   * @remarks
   * Este método asigna valores a múltiples controles del formulario, asegurando que 
   * cada campo sea inicializado correctamente con los datos correspondientes.
   * 
   * @void
   * Este método no retorna ningún valor.
   */
  setRenunciaDerechosForm(): void {
    // Establecer valores iniciales en el formulario
    this.renunciaDerechosForm.get('permisoHasty')?.setValue(renuncia.formData.permisoHasty);
    this.renunciaDerechosForm.get('folioTramite')?.setValue(renuncia.formData.folioTramite);
    this.renunciaDerechosForm.get('tipoSolicitud')?.setValue(renuncia.formData.tipoSolicitud);
    this.renunciaDerechosForm.get('regimen')?.setValue(renuncia.formData.regimen);
    this.renunciaDerechosForm.get('clasificacionRegimen')?.setValue(renuncia.formData.clasificacionRegimen);
    this.renunciaDerechosForm.get('periodoVigencia')?.setValue(renuncia.formData.periodoVigencia);
    this.renunciaDerechosForm.get('unidadMedida')?.setValue(renuncia.formData.unidadMedida);
    this.renunciaDerechosForm.get('fraccionArancelaria')?.setValue(renuncia.formData.fraccionArancelaria);
    this.renunciaDerechosForm.get('cantidadAutorizada')?.setValue(renuncia.formData.cantidadAutorizada);
    this.renunciaDerechosForm.get('valorAutorizado')?.setValue(renuncia.formData.valorAutorizado);
    this.renunciaDerechosForm.get('nico')?.setValue(renuncia.formData.nico);
    this.renunciaDerechosForm.get('descripcionNico')?.setValue(renuncia.formData.descripcionNico);
    this.renunciaDerechosForm.get('acotacion')?.setValue(renuncia.formData.acotacion);
    this.renunciaDerechosForm.get('permisoDesde')?.setValue(renuncia.formData.permisoDesde);
    this.renunciaDerechosForm.get('motivoRenuncia')?.setValue(this.solicitudState['motivoRenuncia'])
    
  }

  /**
   * Método para actualizar el estado del almacén con los datos del formulario.
   * Este método toma los valores actuales del formulario reactivo y los utiliza
   * para actualizar el estado del almacén relacionado con el trámite 140218.
   */
  updateStoreWithFormData(): void {
    const UPDATE_PAGO_FORM: DatosSolicitudState = {
      ...this.solicitudState,
      permisoHasty: this.renunciaDerechosForm.get('permisoHasty')?.value,
      folioTramite: this.renunciaDerechosForm.get('folioTramite')?.value,
      tipoSolicitud: this.renunciaDerechosForm.get('tipoSolicitud')?.value,
      regimen: this.renunciaDerechosForm.get('regimen')?.value,
      clasificacionRegimen: this.renunciaDerechosForm.get('clasificacionRegimen')?.value,
      periodoVigencia: this.renunciaDerechosForm.get('periodoVigencia')?.value,
      unidadMedida: this.renunciaDerechosForm.get('unidadMedida')?.value,
      fraccionArancelaria: this.renunciaDerechosForm.get('fraccionArancelaria')?.value,
      cantidadAutorizada: this.renunciaDerechosForm.get('cantidadAutorizada')?.value,
      valorAutorizado: this.renunciaDerechosForm.get('valorAutorizado')?.value,
      nico: this.renunciaDerechosForm.get('nico')?.value,
      descripcionNico: this.renunciaDerechosForm.get('descripcionNico')?.value,
      acotacion: this.renunciaDerechosForm.get('acotacion')?.value,
      permisoDesde: this.renunciaDerechosForm.get('permisoDesde')?.value,
    };
    this.tramite140218Store.update(UPDATE_PAGO_FORM);
  }

    /**
     * @method eventoDeCambioDeValor
     * @description Maneja el evento de cambio de valor en un campo del formulario y actualiza el store.
     *
     * @param event - Evento de cambio proveniente del input.
     * @param campo - Nombre del campo que ha cambiado.
     *
     * @void
     * Este método no retorna ningún valor.
     */
    public eventoDeCambioDeValor(event: Event, campo: string): void {
      if (event.target) {
        const VALOR = (event.target as HTMLInputElement).value;
        const DATO = { campo: campo, valor: VALOR };
        this.establecerCambioDeValor(DATO);
      }
    }

    /**
     * @method establecerCambioDeValor
     * @description Actualiza el valor dinámico de un campo en el store según el evento recibido.
     * 
     * @param event - Objeto que contiene el nombre del campo y el valor a establecer.
     * Si el valor es un objeto con propiedad 'id', se utiliza dicho 'id' como valor.
     * En caso contrario, se utiliza el valor directamente.
     * 
     * @void
     * Este método no retorna ningún valor.
     */
    public establecerCambioDeValor(event: { campo: string; valor: unknown }): void {
      if (event && typeof event.valor === 'object' && event.valor !== null && 'id' in event.valor) {
        const VALOR = (event.valor as { id: string | number }).id;
        this.tramite140218Store.setDynamicFieldValue(event.campo, VALOR);
      } else if (event) {
        this.tramite140218Store.setDynamicFieldValue(event.campo, event.valor);
      }
    }

  /**
  * Gancho de ciclo de vida OnDestroy
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
