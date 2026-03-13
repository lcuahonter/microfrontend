
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RubroTransporteFerrovario32613State, Tramite32613Store } from '../../../../estados/tramites/tramite32613.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite32613Query } from '../../../../estados/queries/tramite32613.query';

import { CRITERIO_DE_SELECCION, REQUERIMIENTOS_EN_SEGURIDAD, REVISIONS_OF_COMMERCIAL_PARTNERS } from '../../constants/constantes32618.enum';

/**
 * Componente para gestionar el formulario dinámico de seguridad de procesos en el trámite 32613.
 * Permite la visualización y edición de las secciones de entrega y recepción, procedimiento de seguimiento y procesamiento de información,
 * integrando plantillas personalizadas y sincronizando el estado con el store.
 */
@Component({
  selector: 'socios-comercials',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TituloComponent
  ],
  templateUrl: './socios-comercials.component.html',
 
})

export class SociosComercialsComponent implements OnInit, OnDestroy {

  /** Arreglo con la configuración dinámica de los campos para el formulario de criterios de selección. */
  public criteriosDeSeleccionFormData = CRITERIO_DE_SELECCION;

  /** Arreglo con la configuración dinámica de los campos para el formulario de requerimientos en seguridad. */
  public requerimientosEnSeguridadFormData = REQUERIMIENTOS_EN_SEGURIDAD;

  /** Arreglo con la configuración dinámica de los campos para el formulario de revisiones del socio comercial. */
  public revisionesDelSocioComercialFormData = REVISIONS_OF_COMMERCIAL_PARTNERS;

  /** Inicializa el formulario principal y los grupos anidados para los socios comerciales. */
  public sociosComericialsForm = new FormGroup({
    criteriosDeSeleccionFormGroup: new FormGroup({}),
    requerimientosEnSeguridadFormGroup: new FormGroup({}),
    revisionesDelSocioComercialFormGroup: new FormGroup({}),
  })

  /** Este getter devuelve el grupo de formularios anidado llamado `criteriosDeSeleccionFormGroup`*/
  get criteriosDeSeleccionFormGroup(): FormGroup {
    return this.sociosComericialsForm.get('criteriosDeSeleccionFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `requerimientosEnSeguridadFormGroup`*/
  get requerimientosEnSeguridadFormGroup(): FormGroup {
    return this.sociosComericialsForm.get('requerimientosEnSeguridadFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `revisionesDelSocioComercialFormGroup`*/
  get revisionesDelSocioComercialFormGroup(): FormGroup {
    return this.sociosComericialsForm.get('revisionesDelSocioComercialFormGroup') as FormGroup;
  }

  /** Estado de la solicitud de la tramite 32613.*/
  public rubroTransporteFerrovariostate!: RubroTransporteFerrovario32613State;
  
  /** Subject para notificar la destrucción del componente.*/
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Constructor que inyecta los servicios necesarios para gestionar el estado y las consultas del trámite 32613. */
  constructor(
    private tramite32613Store: Tramite32613Store,
    private tramite32613Query: Tramite32613Query,
    private consultaQuery: ConsultaioQuery,
  ) {
    //
  }

  /**
   * Inicializa los estados necesarios del componente, suscribiéndose a los observables de consulta y rubro de transporte ferroviario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    this.tramite32613Query.selectRubroTransporteFerrovario$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rubroTransporteFerrovariostate = seccionState;
        })
      )
      .subscribe();
  }

  /** Actualiza el valor dinámico de un campo en el store cuando ocurre un cambio en el formulario. */
  establecerCambioDeValor(event: {campo: string, valor: string | number | object}): void {
    if (event) {
      this.tramite32613Store.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Este método es parte del ciclo de vida del componente y se ejecuta automáticamente cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria en la aplicación.*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
