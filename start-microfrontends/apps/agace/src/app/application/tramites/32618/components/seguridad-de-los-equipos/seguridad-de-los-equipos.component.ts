
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
// eslint-disable-next-line sort-imports
import { ALMACENAJE_DEL_EQUIPO, INSPECCION_DE_LOS_EQUIPOS, SEGURIDAD_EN_VIAS_FERREAS, USO_DE_SELLADOS_Y_O_CANDADOS } from '../../constants/constantes32618.enum';
import { RubroTransporteFerrovario32618State, Tramite32618Store } from '../../estados/tramite32618.store';
import { Tramite32618Query } from '../../estados/tramite32618query';


/**
 * Componente para gestionar el formulario dinámico de seguridad de los equipos ferroviarios en el trámite 32618.
 * Permite la visualización y edición de las secciones de uso de sellos y candados, inspección, almacenaje y seguridad en vías férreas,
 * integrando plantillas personalizadas y sincronizando el estado con el store.
 */
@Component({
  selector: 'seguridad-de-los-equipos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
  ],
  templateUrl: './seguridad-de-los-equipos.component.html',
  
})

export class SeguridadDeLosEquiposComponent implements AfterViewInit, OnInit, OnDestroy {

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate2 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate3 utilizada en el componente. */
  @ViewChild('customTemplate3') customTemplate3!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate4 utilizada en el componente. */
  @ViewChild('customTemplate4') customTemplate4!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate5 utilizada en el componente. */
  @ViewChild('customTemplate5') customTemplate5!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate6 utilizada en el componente. */
  @ViewChild('customTemplate6') customTemplate6!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate7 utilizada en el componente. */
  @ViewChild('customTemplate7') customTemplate7!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate8 utilizada en el componente. */
  @ViewChild('customTemplate8') customTemplate8!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate9 utilizada en el componente. */
  @ViewChild('customTemplate9') customTemplate9!: TemplateRef<unknown>;

  /** Arreglo con la configuración dinámica de los campos para el formulario de uso de sellos y/o candados. */
  public usoDeSellosYOCandadosFormData = USO_DE_SELLADOS_Y_O_CANDADOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de inspección de los equipos. */
  public inspeccionDeLosEquiposFormData = INSPECCION_DE_LOS_EQUIPOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de inspección de los equipos. */
  public almacenajeDelEquipoFormData = ALMACENAJE_DEL_EQUIPO;

  /** Arreglo con la configuración dinámica de los campos para el formulario de inspección de los equipos. */
  public seguridadEnViasFerreasFormData = SEGURIDAD_EN_VIAS_FERREAS;

  /** Inicializa el formulario principal y los grupos anidados para la seguridad de los equipos ferroviarios. */
  public seguridadDeLosEquiposForm: FormGroup = new FormGroup({
    usoDeSellosYOCandadosFormGroup: new FormGroup({}),
    inspeccionDeLosEquiposFormGroup: new FormGroup({}),
    almacenajeDelEquipoFormGroup: new FormGroup({}),
    seguridadEnViasFerreasFormGroup: new FormGroup({}),
  })

  /** Este getter devuelve el grupo de formularios anidado llamado `usoDeSellosYOCandadosFormGroup`*/
  get usoDeSellosYOCandadosFormGroup(): FormGroup {
    return this.seguridadDeLosEquiposForm.get('usoDeSellosYOCandadosFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `inspeccionDeLosEquiposFormGroup`. */
  get inspeccionDeLosEquiposFormGroup(): FormGroup {
    return this.seguridadDeLosEquiposForm.get('inspeccionDeLosEquiposFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `inspeccionDeLosEquiposFormGroup`. */
  get almacenajeDelEquipoFormGroup(): FormGroup {
    return this.seguridadDeLosEquiposForm.get('almacenajeDelEquipoFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `inspeccionDeLosEquiposFormGroup`. */
  get seguridadEnViasFerreasFormGroup(): FormGroup {
    return this.seguridadDeLosEquiposForm.get('seguridadEnViasFerreasFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `inspeccionDeLosEquiposFormGroup`. */
  public templateMap: Record<string, TemplateRef<unknown>> = {};

  /** Estado de la solicitud de la tramite 32618.*/
  public rubroTransporteFerrovariostate!: RubroTransporteFerrovario32618State;
  
  /** Subject para notificar la destrucción del componente.*/
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;
  
  /** Constructor que inyecta los servicios necesarios para gestionar el estado y las consultas del trámite 32618. */
  constructor(
    private tramite32618Store: Tramite32618Store,
    private tramite32618Query: Tramite32618Query,
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

    this.tramite32618Query.selectRubroTransporteFerrovario$
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
        customSection1: this.customTemplate1,
        customSection2: this.customTemplate2,
        customSection3: this.customTemplate3,
        customSection4: this.customTemplate4,
        customSection5: this.customTemplate5,
        customSection6: this.customTemplate6,
        customSection7: this.customTemplate7,
        customSection8: this.customTemplate8,
        customSection9: this.customTemplate9
      };
    });
  }

  /** Actualiza el valor dinámico de un campo en el store cuando ocurre un cambio en el formulario. */
  establecerCambioDeValor(event: {campo: string, valor: string | number | object}): void {
    if (event) {
      this.tramite32618Store.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Este método es parte del ciclo de vida del componente y se ejecuta automáticamente cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria en la aplicación.*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
