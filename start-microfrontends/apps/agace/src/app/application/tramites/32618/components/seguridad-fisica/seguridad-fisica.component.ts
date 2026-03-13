import { ACCESO_EN_PUERTAS, ALUMBRADO, APARATOS, BARDAS_PERIMETRALES, CONTROL_DE_LLAVES, ESTACIONAMIENTOS, INSTALACIONES, SISTEMAS_DE_ALARMA } from '../../constants/constantes32618.enum';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { RubroTransporteFerrovario32618State } from '../../estados/tramite32618.store';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite32618Query } from '../../estados/tramite32618query';
import { Tramite32618Store } from '../../estados/tramite32618.store';


/**
 * Componente para gestionar el formulario dinámico de seguridad de procesos en el trámite 32618.
 * Permite la visualización y edición de las secciones de entrega y recepción, procedimiento de seguimiento y procesamiento de información,
 * integrando plantillas personalizadas y sincronizando el estado con el store.
 */
@Component({
  selector: 'seguridad-fisica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TituloComponent
  ],
  templateUrl: './seguridad-fisica.component.html',
  
})

export class SeguridadFisicaComponent implements AfterViewInit, OnInit, OnDestroy {

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate2 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public instalacionesFormData = INSTALACIONES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public accesosEnPuertasFormData = ACCESO_EN_PUERTAS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public bardasPerimetralesFormData = BARDAS_PERIMETRALES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public estacionamientosFormData = ESTACIONAMIENTOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public controlDeLlavesFormData = CONTROL_DE_LLAVES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public alumbradoFormData = ALUMBRADO;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public aparatosFormData = APARATOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de instalaciones. */
  public sistemasDeAlarmaFormData = SISTEMAS_DE_ALARMA;

  /** Inicializa el formulario principal y los grupos anidados para la seguridad física. */
  public seguridadFisicaForm: FormGroup = new FormGroup({
    instalacionesFormGroup: new FormGroup({}),
    accesosEnPuertasFormGroup: new FormGroup({}),
    bardasPerimetralesFormGroup: new FormGroup({}),
    estacionamientosFormGroup: new FormGroup({}),
    controlDeLlavesFormGroup: new FormGroup({}),
    alumbradoFormGroup: new FormGroup({}),
    aparatosFormGroup: new FormGroup({}),
    sistemasDeAlarmaFormGroup: new FormGroup({}),
  })

  /** Este getter devuelve el grupo de formularios anidado llamado `instalacionesFormGroup`*/
  get instalacionesFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('instalacionesFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `accesosEnPuertasFormGroup`*/
  get accesosEnPuertasFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('accesosEnPuertasFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `bardasPerimetralesFormGroup`*/
  get bardasPerimetralesFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('bardasPerimetralesFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `estacionamientosFormGroup`*/
  get estacionamientosFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('estacionamientosFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `controlDeLlavesFormGroup`*/
  get controlDeLlavesFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('controlDeLlavesFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `alumbradoFormGroup`*/
  get alumbradoFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('alumbradoFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `aparatosFormGroup`*/
  get aparatosFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('aparatosFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `sistemasDeAlarmaFormGroup`*/
  get sistemasDeAlarmaFormGroup(): FormGroup {
    return this.seguridadFisicaForm.get('sistemasDeAlarmaFormGroup') as FormGroup;
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
        customSection2: this.customTemplate2
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
