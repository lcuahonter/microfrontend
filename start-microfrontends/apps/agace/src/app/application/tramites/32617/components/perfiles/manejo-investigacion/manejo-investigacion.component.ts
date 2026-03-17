import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite32617Store, Tramites32617State } from '../../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS_MANEJO_INVESTIGACION } from '../../../constants/texto-estatico.enum';
import { Tramite32617Query } from '../../../estados/tramites32617.query';

/**
 * Componente encargado de gestionar la sección de "Manejo e Investigación de Incidentes"
 * dentro del trámite 31616. Construye un formulario reactivo con los datos obtenidos
 * desde el estado de la solicitud y permite su sincronización con el store.
 */
@Component({
  selector: 'app-manejo-investigacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './manejo-investigacion.component.html',
  styleUrl: './manejo-investigacion.component.scss'
})
export class ManejoInvestigacionComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_MANEJO_INVESTIGACION

  /**
   * Formulario reactivo que contiene los campos relacionados con el manejo e investigación de incidentes.
   */
  manejo!: FormGroup;

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
   *
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
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite32617Query.selectTramite32617$
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
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    this.manejo = this.fb.group({
      relacionadosSeguridad: [PERFILES['relacionadosSeguridad'] || '', Validators.required],
      reportarIncidentes: [PERFILES['reportarIncidentes'] || '', Validators.required],
      actividadesSospechosas: [PERFILES['actividadesSospechosas'] || '', Validators.required],
      brevementeSonsiste: [PERFILES['brevementeSonsiste'] || '', Validators.required],
      incidenteSeguridad: [PERFILES['incidenteSeguridad'] || '', Validators.required],
      caboInvestigacion: [PERFILES['caboInvestigacion'] || '', Validators.required],
      operacionCaboInvestigacion: [PERFILES['operacionCaboInvestigacion'] || '', Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite utilizando el método actualizarEstado.
   *
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   */
  public setValoresStore(form: FormGroup | null, campo: string): void {
    const CONTROL = form?.get(campo);
    if (CONTROL) {
      this.tramite32617Store.establecerDatos({ perfiles: { [campo]: CONTROL.value } });
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
