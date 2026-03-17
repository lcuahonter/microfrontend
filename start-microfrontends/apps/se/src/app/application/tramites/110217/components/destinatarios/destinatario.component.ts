import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';

import { CommonModule } from '@angular/common';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';

import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { RepresentanteLegalExportadorComponent } from '../../../../shared/components/representante-legal-exportador/representante-legal-exportador.component';

import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { DetallesDelTransporteComponent } from '../../../../shared/components/detalles-del-transporte/detalles-del-transporte.component';

/**
 * Componente para gestionar los datos del destinatario.
 * 
 * Este componente permite al usuario ingresar y gestionar información relacionada con el destinatario,
 * como datos personales, direcciones, información representativa y detalles de transporte.
 */
@Component({
  selector: 'app-destinatarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatosDelDestinatarioComponent,
    RepresentanteLegalExportadorComponent,
    DetallesDelTransporteComponent,
    DestinatarioComponent
  ],
  templateUrl: './destinatario.component.html',
  styleUrl: './destinatario.component.scss',
})
export class DestinatariosComponent implements OnInit, OnDestroy {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

/**
 * Valores actuales del formulario de datos del destinatario.
 */
formDestinatarioValues = {
  grupoReceptor: {},
  grupoDeDirecciones: {},
  grupoRepresentativo: {},
  grupoDeTransporte: {}
};

/**
 * Subject utilizado para gestionar el ciclo de vida del componente y cancelar las suscripciones.
 */
destroyNotifier$: Subject<void> = new Subject();

/**
 * Estado de consulta para verificar si está en modo solo lectura.
 */
consultaDatos!: ConsultaioState;

/**
 * Indica si el formulario está en modo solo lectura.
 */
soloLectura: boolean = false;

/**
 * Referencia al componente hijo DatosDelDestinatarioComponent
 */
@ViewChild(DatosDelDestinatarioComponent) datosDelDestinatarioRef!: DatosDelDestinatarioComponent;

/**
 * Referencia al componente hijo DestinatarioComponent
 */
@ViewChild(DestinatarioComponent) destinatarioRef!: DestinatarioComponent;

/**
 * Referencia al componente hijo RepresentanteLegalExportadorComponent
 */
@ViewChild(RepresentanteLegalExportadorComponent) representanteRef!: RepresentanteLegalExportadorComponent;

/**
 * Referencia al componente hijo DetallesDelTransporteComponent
 */
@ViewChild(DetallesDelTransporteComponent) transporteRef!: DetallesDelTransporteComponent;

  /**
 * Constructor del componente. Inicializa el formulario y las dependencias necesarias.
 * @param fb Instancia del FormBuilder para la creación del formulario.
 * @param store Instancia del store para el manejo de datos.
 * @param tramiteQuery Instancia del query para obtener datos de estado.
 * @param consultaQuery Consulta para obtener el estado de la consulta.
 */
constructor(
  private fb: FormBuilder,
  public store: Tramite110217Store,
  public tramiteQuery: Tramite110217Query,
  public consultaQuery: ConsultaioQuery
) {

  /**
   * Suscripción al estado del formulario para actualizar los valores del formulario al obtener datos.
   */
  this.tramiteQuery.selectSolicitud$.pipe(
    takeUntil(this.destroyNotifier$),
    map((state) => ({
      grupoReceptor: state.grupoReceptor,
      grupoDeDirecciones: state.grupoDeDirecciones,
      grupoRepresentativo: state.grupoRepresentativo,
      grupoDeTransporte: state.grupoDeTransporte
    }))
  ).subscribe((estado) => {
      this.formDestinatarioValues = estado;
  });
}

  /**
 * Método que se ejecuta al inicializar el componente.
 * 
 * Configura el componente y suscribe al estado de la consulta.
 */
ngOnInit(): void {
  this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
      })
    )
    .subscribe();
}

  /**
 * Método que se ejecuta al destruir el componente.
 * 
 * Libera los recursos y cancela las suscripciones activas.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

/**
 * Maneja los valores del store para los datos del destinatario.
 * @param event Evento del formulario con estructura específica
 */
setValoresStoreDatosDestinatario(event: { formGroupName: string; campo: string; valor: unknown; storeStateName: string }): void {
  const { valor: VALOR } = event;
  const METODO_STORE = this.store[event.storeStateName as keyof Tramite110217Store];
  if (typeof METODO_STORE === 'function') {
    (METODO_STORE as (value: unknown) => void).call(this.store, VALOR);
  }
}

/**
 * Maneja los valores del store para el destinatario.
 * @param event Evento del formulario con estructura específica
 */
setValoresStoreDestinatario(event: { formGroupName: string; campo: string; valor: unknown; storeStateName: string }): void {
  const { valor: VALOR } = event;
  const METODO_STORE = this.store[event.storeStateName as keyof Tramite110217Store];
  if (typeof METODO_STORE === 'function') {
    (METODO_STORE as (value: unknown) => void).call(this.store, VALOR);
  }
}

/**
 * Maneja los valores del store para el representante legal.
 * @param event Evento del formulario con estructura específica del representante
 */
setValoresStoreRepresentante(event: { formGroupName: string; campo: string; VALOR: unknown; METODO_NOMBRE: string }): void {
  const { VALOR } = event;
  const METODO_STORE = this.store[event.METODO_NOMBRE as keyof Tramite110217Store];
  if (typeof METODO_STORE === 'function') {
    (METODO_STORE as (value: unknown) => void).call(this.store, VALOR);
  }
}

/**
 * Maneja los valores del store para los detalles del transporte.
 * @param event Evento del formulario con estructura específica del transporte
 */
setValoresStoreTransporte(event: { formGroupName: string; campo: string; valor: unknown; storeStateName: string }): void {
  const { valor: VALOR } = event;
  const METODO_STORE = this.store[event.storeStateName as keyof Tramite110217Store];
  if (typeof METODO_STORE === 'function') {
    (METODO_STORE as (value: unknown) => void).call(this.store, VALOR);
  }
}

setFormValidaDatosDestinatario(esValido: boolean): void {
  this.store.setFormValidity('datosDestinatario', esValido);
}

setFormValidaDestinatario(esValido: boolean): void {
  this.store.setFormValidity('domicilioDestinatario', esValido);
}

setFormValidaRepresentanteLegal(esValido: boolean): void {
  this.store.setFormValidity('datosRepresentante', esValido);
}

setFormValidaTransporte(esValido: boolean): void {
  this.store.setFormValidity('detallesTransporte', esValido);
}

/**
 * Valida todos los formularios de los componentes compartidos.
 * @returns true si todos los formularios son válidos, false en caso contrario
 */
validateAllForms(): boolean {
  let esValido = true;
  
  // Validar datos del destinatario si existe
  if (this.datosDelDestinatarioRef?.formDatosDelDestinatario) {
    if (this.datosDelDestinatarioRef.formDatosDelDestinatario.invalid) {
      esValido = false;
    }
  }
  
  // Validar destinatario si existe
  if (this.destinatarioRef?.formDestinatario) {
    if (this.destinatarioRef.formDestinatario.invalid) {
      esValido = false;
    }
  }
  
  // Validar representante legal si existe
  if (this.representanteRef?.form) {
    if (this.representanteRef.form.invalid) {
      esValido = false;
    }
  }
  
  // Validar detalles del transporte si existe
  if (this.transporteRef?.formTransporte) {
    if (this.transporteRef.formTransporte.invalid) {
      esValido = false;
    }
  }
  
  return esValido;
}

/**
 * Marca todos los campos de los formularios como tocados para mostrar errores.
 */
markAllFormsAsTouched(): void {
  // Marcar datos del destinatario como tocado
  if (this.datosDelDestinatarioRef?.formDatosDelDestinatario) {
    this.datosDelDestinatarioRef.formDatosDelDestinatario.markAllAsTouched();
  }
  
  // Marcar destinatario como tocado
  if (this.destinatarioRef?.formDestinatario) {
    this.destinatarioRef.formDestinatario.markAllAsTouched();
  }
  
  // Marcar representante legal como tocado
  if (this.representanteRef?.form) {
    this.representanteRef.form.markAllAsTouched();
  }
  
  // Marcar detalles del transporte como tocado
  if (this.transporteRef?.formTransporte) {
    this.transporteRef.formTransporte.markAllAsTouched();
  }
}
}