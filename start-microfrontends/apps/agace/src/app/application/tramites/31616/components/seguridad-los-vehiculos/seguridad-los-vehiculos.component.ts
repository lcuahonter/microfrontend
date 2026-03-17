import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31616PerfilesMensajeriaState, Tramite31616PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite31616_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_VEHICULOS } from '../../constantes/texto-estatico.enum';
import { Tramite31616PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite31616_perfilesMensajeria.query';

/**
 * Componente encargado de la sección "Seguridad de los vehículos" del trámite 31616.
 * Administra un formulario reactivo con validaciones y sincroniza su estado con el store y query personalizados.
 */
@Component({
  selector: 'app-seguridad-los-vehiculos',
  standalone: true,
  imports: [
    InputRadioComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './seguridad-los-vehiculos.component.html',
  styleUrl: './seguridad-los-vehiculos.component.scss',
})
export class SeguridadLosVehiculosComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_VEHICULOS

  /**
   * Formulario reactivo que contiene los campos de seguridad vehicular.
   */
  seguridad!: FormGroup;

  /**
   * Opciones para los botones de radio, utilizadas en los campos del formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud31616PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite31616Store Store personalizado del trámite 31616.
   * @param tramite31616Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616PerfilesMensajeriaStore,
    private tramite31616Query: Tramite31616PerfilesMensajeriaQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Suscribe al estado del query y genera el formulario reactivo con valores precargados.
   */
  ngOnInit(): void {
    this.tramite31616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioDeGestión();
  }

  /**
   * Crea el formulario reactivo con los valores actuales del estado.
   * Todos los campos son requeridos y están ligados a los valores del estado de solicitud.
   */
  crearFormularioDeGestión(): void {
    this.seguridad = this.fb.group({
      candadosSeguridad: [this.solicitudState?.candadosSeguridad, Validators.required],
      proveedorExterno: [this.solicitudState?.proveedorExterno, Validators.required],
      susceptibleContaminacion: [this.solicitudState?.susceptibleContaminacion, Validators.required],
      encuentrenVacios: [this.solicitudState?.encuentrenVacios, Validators.required],
      semirremolquesVacios: [this.solicitudState?.semirremolquesVacios, Validators.required],
      utilizarCandado: [this.solicitudState?.utilizarCandado, Validators.required],
      seguridadMismas: [this.solicitudState?.seguridadMismas, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   * 
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31616PerfilesMensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Hook de destrucción del componente.
   * Emite y completa el `destroyNotifier$` para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
