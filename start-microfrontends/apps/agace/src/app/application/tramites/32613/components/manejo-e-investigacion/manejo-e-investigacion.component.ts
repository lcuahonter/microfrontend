import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INVESTIGACION_ANALISIS, REPORTE_DE_ANOMALIAS } from '../../constantes/constantes32613.enum';
import { RubroTransporteFerrovario32613State, Tramite32613Store } from '../../../../estados/tramites/tramite32613.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite32613Query } from '../../../../estados/queries/tramite32613.query';

/** Componente para gestionar el formulario dinámico de manejo e investigación de anomalías en el trámite 32613. */
@Component({
  selector: 'manejo-e-investigacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './manejo-e-investigacion.component.html',
  styleUrls: ['./manejo-e-investigacion.component.scss'],
})

export class ManejoEInvestigacionComponent implements AfterViewInit, OnInit, OnDestroy {

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Arreglo con la configuración dinámica de los campos para el formulario de reporte de anomalías. */
  public reporteDeAnomaliasFormData = REPORTE_DE_ANOMALIAS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de investigación y análisis de anomalías. */
  public investigacionAnalisisFormData = INVESTIGACION_ANALISIS;

  /** Inicializa el formulario principal y los grupos anidados para el manejo e investigación de anomalías. */
  public manejoOInvestigacionForm: FormGroup = new FormGroup({
    reporteDeAnomaliasFormGroup: new FormGroup({}),
    investigacionAnalisisFormGroup: new FormGroup({}),
  });

  /** Este getter devuelve el grupo de formularios anidado llamado `reporteDeAnomaliasFormGroup`*/
  get reporteDeAnomaliasFormGroup(): FormGroup {
    return this.manejoOInvestigacionForm.get('reporteDeAnomaliasFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `reporteDeAnomaliasFormGroup`*/
  get investigacionAnalisisFormGroup(): FormGroup {
    return this.manejoOInvestigacionForm.get('investigacionAnalisisFormGroup') as FormGroup;
  }

  /** Mapa que asocia claves de sección con sus respectivas plantillas personalizadas. */
  public templateMap: Record<string, TemplateRef<unknown>> = {}; 

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

  /** Inicializa los estados necesarios del componente, suscribiéndose a los observables de consulta y rubro de transporte ferroviario. */
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

  /** Asigna las referencias de las plantillas personalizadas al mapa después de la inicialización de la vista. */
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.templateMap = {
        customSection1: this.customTemplate1
      };
    });
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
