import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Solicitud32610State,
  Solicitud32610Store
} from '../../../estados/solicitud32610.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud32610Query } from '../../../estados/solicitud32610.query';
import { TEXTOS_ESTATICOS } from '../../../constants/texto-estatico.enum';


/**
 * Componente encargado de gestionar la sección de "Capacitación en Seguridad"
 * dentro del trámite 31616. Construye un formulario reactivo con los datos obtenidos
 * desde el estado de la solicitud y permite su sincronización con el store.
 */
@Component({
  selector: 'app-capacitacion-seguridad',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './capacitacion-seguridad.component.html',
  styleUrl: './capacitacion-seguridad.component.scss'
})
export class CapacitacionSeguridadComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS

  /**
   * Formulario reactivo que contiene los campos relacionados con la capacitación.
   */
  capacitacion!: FormGroup;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32610State;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param fb Constructor de formularios reactivos.
   * @param tramite32610Store Store personalizado del trámite 31616.
   * @param tramite32610Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32610Store: Solicitud32610Store,
    private tramite32610Query: Solicitud32610Query
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite32610Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        if (!this.capacitacion) {
          this.crearFormularioDeGestion();
        } else {
          this.actualizarFormularioConEstado();
        }
      });
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestion(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.capacitacion = this.fb.group({
      mediosTransporte: [PERFILES['mediosTransporte'] || '', Validators.required],
      estaDifusion: [PERFILES['estaDifusion'] || '', Validators.required],
      enunciativaLimitativa: [PERFILES['enunciativaLimitativa'] || '', Validators.required],
      procedimientosEmpresa: [PERFILES['procedimientosEmpresa'] || '', Validators.required],
      mediosDeTransporte: [PERFILES['mediosDeTransporte'] || '', Validators.required]
    });
  }

  /**
   * @method actualizarFormularioConEstado
   * @description
   * Actualiza los valores del formulario con los datos del estado actual.
   * Se ejecuta cuando el estado cambia después de la inicialización del formulario.
   */
  actualizarFormularioConEstado(): void {
    if (!this.capacitacion || !this.solicitudState?.perfiles) {
      return;
    }

    const PERFILES = this.solicitudState.perfiles;
    
    // Update form controls with current state values
    Object.keys(this.capacitacion.controls).forEach(fieldName => {
      const CONTROL = this.capacitacion.get(fieldName);
      const STATE_VALUE = PERFILES[fieldName as keyof typeof PERFILES];
      
      // Update control if state has a value and it's different from current form value
      if (CONTROL && STATE_VALUE !== undefined && STATE_VALUE !== null && STATE_VALUE !== '') {
        if (CONTROL.value !== STATE_VALUE) {
          CONTROL.setValue(STATE_VALUE, { emitEvent: false });
        }
      }
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
      this.tramite32610Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * Hook de destrucción del componente.
   * Cancela todas las suscripciones activas emitiendo y completando el `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
