import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32605State, Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';
import { TEXTOS_ESTATICOS_SEGURIDAD_VEHICULOS } from '../../../constants/texto-estatico.enum';

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
  public solicitudState!: Solicitud32605State;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite32605Store Store personalizado del trámite 31616.
   * @param tramite32605Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32605Store: Solicitud32605Store,
    private tramite32605Query: Solicitud32605Query
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Suscribe al estado del query y genera el formulario reactivo con valores precargados.
   */
  ngOnInit(): void {
    this.tramite32605Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        this.actualizarFormularioConEstado();
      });
  }

  /**
   * Actualiza el formulario con el estado actual si está disponible.
   */
  private actualizarFormularioConEstado(): void {
    if (this.solicitudState) {
      this.crearFormularioDeGestión();
    }
  }

  /**
   * Crea el formulario reactivo con los valores actuales del estado.
   * Todos los campos son requeridos y están ligados a los valores del estado de solicitud.
   */
  crearFormularioDeGestión(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    this.seguridad = this.fb.group({
      candadosSeguridad: [PERFILES['candadosSeguridad'] || '', Validators.required],
      proveedorExterno: [PERFILES['proveedorExterno'] || '', Validators.required],
      susceptibleContaminacion: [PERFILES['susceptibleContaminacion'] || '', Validators.required],
      encuentrenVacios: [PERFILES['encuentrenVacios'] || '', Validators.required],
      semirremolquesVacios: [PERFILES['semirremolquesVacios'] || '', Validators.required],
      utilizarCandado: [PERFILES['utilizarCandado'] || '', Validators.required],
      seguridadMismas: [PERFILES['seguridadMismas'] || '', Validators.required]
    });
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32605Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
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
