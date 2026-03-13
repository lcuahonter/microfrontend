import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  Tramite32617Store,
  Tramites32617State
} from '../../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS_GESTION_ADUANERA } from '../../../constants/texto-estatico.enum';
import { Tramite32617Query } from '../../../estados/tramites32617.query';



/**
 * Componente encargado de gestionar el formulario de Gestión Aduanera dentro del trámite 31616.
 * Se conecta al store y query personalizados para cargar y actualizar el estado de los campos relacionados.
 */
@Component({
  selector: 'app-gestion-aduanera',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './gestion-aduanera.component.html',
  styleUrl: './gestion-aduanera.component.scss'
})
export class GestionAduaneraComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_GESTION_ADUANERA
  /**
   * Formulario reactivo que contiene los campos de gestión aduanera.
   */
  gestionAduanera!: FormGroup;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Tramites32617State;
  
  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite32617Store Store personalizado del trámite 31616.
   * @param tramite32617Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32617Store: Tramite32617Store,
    private tramite32617Query: Tramite32617Query
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Suscribe al estado del query y genera el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramite32617Query.selectTramite32617$
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        if (!this.gestionAduanera) {
          this.crearFormularioDeGestión();
        } else {
          this.actualizarFormularioConEstado();
        }
      });
  }

  /**
   * Crea el formulario reactivo con los valores actuales del estado.
   * Los campos se inicializan con validadores requeridos.
   */
  crearFormularioDeGestión(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.gestionAduanera = this.fb.group({
      describaProcedimiento: [PERFILES['describaProcedimiento'] || '', Validators.required],
      indiqueLosCriterios: [PERFILES['indiqueLosCriterios'] || '', Validators.required],
      indiqueLosMetodos: [PERFILES['indiqueLosMetodos'] || '', Validators.required],
      describaLosIndicadores: [PERFILES['describaLosIndicadores'] || '', Validators.required],
      comercioExterior: [PERFILES['comercioExterior'] || '', Validators.required]
    });
  }

  /**
   * @method actualizarFormularioConEstado
   * @description
   * Actualiza los valores del formulario con los datos del estado actual.
   * Se ejecuta cuando el estado cambia después de la inicialización del formulario.
   */
  actualizarFormularioConEstado(): void {
    if (!this.gestionAduanera || !this.solicitudState?.perfiles) {
      return;
    }

    const PERFILES = this.solicitudState.perfiles;
    Object.keys(this.gestionAduanera.controls).forEach(fieldName => {
      const CONTROL = this.gestionAduanera.get(fieldName);
      const STATE_VALUE = PERFILES[fieldName as keyof typeof PERFILES];
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
      this.tramite32617Store.establecerDatos({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * Hook de destrucción del componente.
   * Emite y completa el `destroyNotifier$` para cancelar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
