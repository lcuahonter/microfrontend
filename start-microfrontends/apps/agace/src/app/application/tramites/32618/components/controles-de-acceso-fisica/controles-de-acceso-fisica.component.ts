import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ENTREGAS_DE_MENSAJERIA, IDENTIFICACION_DE_LOS_EMPLEADOS, IDENTIFICACION_DE_LOS_EMPLEADOS_FORM_DATA} from '../../constants/constantes32618.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { PERSONAL_DE_SEGURIDAD} from '../../constants/constantes32618.enum';
import { RubroTransporteFerrovario32618State } from '../../estados/tramite32618.store';
import { SI_NO_OPCIONES } from '../../constants/constantes32618.enum';
import { Tramite32618Query } from '../../estados/tramite32618query';
import { Tramite32618Store } from '../../estados/tramite32618.store';


/** Componente para gestionar el formulario dinámico de controles de acceso físico en el trámite 32613. */
@Component({
  selector: 'controles-de-acceso-fisica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TituloComponent,
    InputRadioComponent
  ],
  templateUrl: './controles-de-acceso-fisica.component.html',
 
})

export class ControlesDeAccesoFisicaComponent implements AfterViewInit, OnInit, OnDestroy {

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate2 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Arreglo con la configuración dinámica de los campos para el formulario de personal de seguridad. */
  public personalDeSeguridadFormData = PERSONAL_DE_SEGURIDAD;

  /** Arreglo con la configuración dinámica de los campos para el formulario de identificación de los empleados. */
  public identificacionDeLosEmpleadosFormData = IDENTIFICACION_DE_LOS_EMPLEADOS;

  public identificacionDeLosProveedoresFormData = IDENTIFICACION_DE_LOS_EMPLEADOS_FORM_DATA;

  /** Arreglo con la configuración dinámica de los campos para el formulario de entregas de mensajería. */
  public entregasDeMensajeriaFormData = ENTREGAS_DE_MENSAJERIA;

  /** Inicializa el grupo principal de formularios para controles de acceso físico, incluyendo los formularios anidados y el registro de visitantes. */
  public controlesDeAccesoFormGroup: FormGroup = new FormGroup({
    personalDeSeguridadFormGroup: new FormGroup({}),
    identificacionDeLosEmpleadosFormGroup: new FormGroup({}),
    identificacionDeLosProveedoresFormGroup:new FormGroup({}),
    elRegistroDeVisitantes: new FormControl(''),
    entregasDeMensajeriaFormGroup: new FormGroup({}),
  })

  /** Este getter devuelve el grupo de formularios anidado llamado `personalDeSeguridadFormGroup`*/
  get personalDeSeguridadFormGroup(): FormGroup {
    return this.controlesDeAccesoFormGroup.get('personalDeSeguridadFormGroup') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `identificacionDeLosEmpleadosFormGroup`*/
  get identificacionDeLosEmpleadosFormGroup(): FormGroup {
    return this.controlesDeAccesoFormGroup.get('identificacionDeLosEmpleadosFormGroup') as FormGroup;
  }

  get identificacionDeLosProveedoresFormGroup():FormGroup{
    return this.controlesDeAccesoFormGroup.get('identificacionDeLosProveedoresFormGroup') as FormGroup;
  }
  /** Este getter devuelve el grupo de formularios anidado llamado `entregasDeMensajeriaFormGroup`*/
  get entregasDeMensajeriaFormGroup(): FormGroup {
    return this.controlesDeAccesoFormGroup.get('entregasDeMensajeriaFormGroup') as FormGroup;
  }

  /** Mapa que asocia claves de sección con sus respectivas plantillas personalizadas. */
  public templateMap: Record<string, TemplateRef<unknown>> = {};

  /** Modelo para la opción de tipo sí/no representado como radio button */
  public sinoOpciones = SI_NO_OPCIONES;

  /** Estado de la solicitud de la tramite 32613.*/
  public rubroTransporteFerrovariostate!: RubroTransporteFerrovario32618State;
  
  /** Subject para notificar la destrucción del componente.*/
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Constructor que inyecta los servicios necesarios para gestionar el estado y las consultas del trámite 32613. */
  constructor(
    private tramite32618Store: Tramite32618Store,
    private tramite32618Query: Tramite32618Query,
    private consultaQuery: ConsultaioQuery,
  ) {
    //
  }

  /** Inicializa los estados necesarios del componente, suscribiéndose a los observables de consulta y rubro de transporte ferroviario, y actualiza el formulario según el estado recibido. */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.readonly) {
            this.controlesDeAccesoFormGroup.get('elRegistroDeVisitantes')?.disable();
          }
        })
      )
      .subscribe();

    this.tramite32618Query.selectRubroTransporteFerrovario$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rubroTransporteFerrovariostate = seccionState;
          this.controlesDeAccesoFormGroup.patchValue({
            elRegistroDeVisitantes: seccionState['elRegistroDeVisitantes']
          });
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

  /** Actualiza el valor del registro de visitantes en el store cuando ocurre un cambio en el formulario. */
  cambioRegistroDeVisitantes(event: string | number, campo: string): void {
    if (event) {
      this.tramite32618Store.setDynamicFieldValue(campo, event);
    }
  }

  /** Este método es parte del ciclo de vida del componente y se ejecuta automáticamente cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria en la aplicación.*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}