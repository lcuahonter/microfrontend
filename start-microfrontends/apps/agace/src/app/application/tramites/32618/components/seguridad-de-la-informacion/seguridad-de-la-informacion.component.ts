import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';
import { CLASIFICACION_Y_MANEJO } from '../../constants/constantes32618.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import {
  RubroTransporteFerrovario32618State,
  Tramite32618Store,
} from '../../estados/tramite32618.store';
import { SEGURIDAD_DE_LA_TECNOLOGIA } from '../../constants/constantes32618.enum';
import { Tramite32618Query } from '../../estados/tramite32618query';

/**
 * Componente para gestionar el formulario dinámico de seguridad de la información en el trámite 32618.
 * Permite la visualización y edición de las secciones de clasificación, manejo y tecnología de la información,
 * integrando plantillas personalizadas y sincronizando el estado con el store.
 */
@Component({
  selector: 'seguridad-de-la-informacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent],
  templateUrl: './seguridad-de-la-informacion.component.html',
 
})
export class SeguridadDeLaInformacionComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate2 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate3 utilizada en el componente. */
  @ViewChild('customTemplate3') customTemplate3!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate4 utilizada en el componente. */
  @ViewChild('customTemplate4') customTemplate4!: TemplateRef<unknown>;

  /** Arreglo con la configuración dinámica de los campos para el formulario de clasificación y manejo de la información. */
  public clasificacionYManejoFormData = CLASIFICACION_Y_MANEJO;

  /** Arreglo con la configuración dinámica de los campos para el formulario de clasificación y manejo de la información. */
  public seguridadDeLaTecnologiaFormData = SEGURIDAD_DE_LA_TECNOLOGIA;

  /** Inicializa el formulario principal y los grupos anidados para la seguridad de la información. */
  public seguridadDeLaInformacionFormGroup: FormGroup = new FormGroup({
    clasificacionYManejoFormGroup: new FormGroup({}),
    seguridadDeLaTecnologiaFormGroup: new FormGroup({}),
  });

  /** Este getter devuelve el grupo de formularios anidado llamado `clasificacionYManejoFormGroup`*/
  get clasificacionYManejoFormGroup(): FormGroup {
    return this.seguridadDeLaInformacionFormGroup.get(
      'clasificacionYManejoFormGroup'
    ) as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `seguridadDeLaTecnologiaFormGroup`*/
  get seguridadDeLaTecnologiaFormGroup(): FormGroup {
    return this.seguridadDeLaInformacionFormGroup.get(
      'seguridadDeLaTecnologiaFormGroup'
    ) as FormGroup;
  }

  /** Mapa que asocia claves de sección con sus respectivas plantillas personalizadas. */
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
    private consultaQuery: ConsultaioQuery
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
      };
    });
  }

  /** Actualiza el valor dinámico de un campo en el store cuando ocurre un cambio en el formulario. */
  establecerCambioDeValor(event: {
    campo: string;
    valor: string | number | object;
  }): void {
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
