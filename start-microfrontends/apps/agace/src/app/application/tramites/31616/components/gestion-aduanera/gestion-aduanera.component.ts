import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31616PerfilesMensajeriaState, Tramite31616PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite31616_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS_GESTION_ADUANERA } from '../../constantes/texto-estatico.enum';
import { Tramite31616PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite31616_perfilesMensajeria.query';

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
   * Suscribe al estado del query y genera el formulario reactivo.
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
   * Los campos se inicializan con validadores requeridos.
   */
  crearFormularioDeGestión(): void {
    this.gestionAduanera = this.fb.group({
      describaProcedimiento: [this.solicitudState?.describaProcedimiento, Validators.required],
      indiqueLosCriterios: [this.solicitudState?.indiqueLosCriterios, Validators.required],
      indiqueLosMetodos: [this.solicitudState?.indiqueLosMetodos, Validators.required],
      describaLosIndicadores: [this.solicitudState?.describaLosIndicadores, Validators.required],
      comercioExterior: [this.solicitudState?.comercioExterior, Validators.required]
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
   * Emite y completa el `destroyNotifier$` para cancelar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
