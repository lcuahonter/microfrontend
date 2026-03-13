import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INFORMACION_GENERAL, OEA_TEMPLATE_ARRAY, OTROS_PROGRAMAS_TEMPLATE_ARRAY, PERFILES_ACCORDION_SECCIONES, PIP_TEMPLATE_ARRAY, TEMPLATE_1_ARRAY, TEMPLATE_2_ARRAY } from '../../constantes/constantes32613.enum';
import { RubroTransporteFerrovario32613State, Tramite32613Store } from '../../../../estados/tramites/tramite32613.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { RowTypeFormInput } from '../../../../shared/models/row-type-form-input.model';
import { RowTypeFormInputComponent } from '../../../../shared/components/row-type-form-input/row-type-form-input.component';
import { SeccionDinamica } from '@libs/shared/data-access-user/src/core/models/shared/seccion-dinamica.model';
import { SeccionDinamicaComponent } from '../../../../shared/components/seccion-dinamica/seccion-dinamica.component';
import { Tramite32613Query } from '../../../../estados/queries/tramite32613.query';

/** Componente para gestionar el formulario dinámico de perfiles ferroviarios en el trámite 32613. */
@Component({
  selector: 'perfiles-ferrovario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    RowTypeFormInputComponent,
    SeccionDinamicaComponent
  ],
  templateUrl: './perfiles-ferrovario.component.html',
  styleUrl: './perfiles-ferrovario.component.scss',
})

export class PerfilesFerrovarioComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate3') customTemplate3!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate4') customTemplate4!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate5') customTemplate5!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate6') customTemplate6!: TemplateRef<unknown>;

  /** Inicializa el formulario principal y los grupos anidados para los perfiles ferroviarios. */
  public perfilesFerrovarioForm!: FormGroup;

  /** Arreglo con la configuración dinámica de los campos para el formulario de información general. */
  public formDataInformacionGeneral = INFORMACION_GENERAL;

  /** Arreglo con la configuración dinámica de los campos para la plantilla personalizada 1. */
  public template1Array = TEMPLATE_1_ARRAY;

  /** Arreglo con la configuración dinámica de los campos para la plantilla personalizada 1. */
  public template2Array = TEMPLATE_2_ARRAY;

  /** Arreglo con la configuración dinámica de los campos para la plantilla personalizada 1. */
  public template3Array = PIP_TEMPLATE_ARRAY;

  /** Arreglo con la configuración dinámica de los campos para la plantilla personalizada 1. */
  public template4Array = OEA_TEMPLATE_ARRAY;

  /** Arreglo con la configuración dinámica de los campos para la plantilla personalizada 1. */
  public template5Array = OTROS_PROGRAMAS_TEMPLATE_ARRAY;

  /** Inicializa el formulario para la plantilla personalizada 1. */
  public customTemplate1Form: FormGroup = new FormGroup({});

  /** Inicializa el formulario para la plantilla personalizada 1. */
  public customTemplate2Form: FormGroup = new FormGroup({});

  /** Inicializa el formulario para la plantilla personalizada 1. */
  public customTemplate3Form: FormGroup = new FormGroup({});

  /** Inicializa el formulario para la plantilla personalizada 1. */
  public customTemplate4Form: FormGroup = new FormGroup({});

  /** Inicializa el formulario para la plantilla personalizada 1. */
  public customTemplate5Form: FormGroup = new FormGroup({});

  /** Mapa que asocia claves de sección con sus respectivas plantillas personalizadas. */
  public templateMap: Record<string, TemplateRef<unknown>> = {};

  /** Bandera para mostrar u ocultar la plantilla personalizada 2. */
  public mostarCustomtemplate2: boolean = false;

  /** Bandera para mostrar u ocultar la plantilla personalizada 3. */
  public mostarCustomtemplate3: boolean = false;

  /** Bandera para mostrar u ocultar la plantilla personalizada 4. */
  public mostarCustomtemplate4: boolean = false;

  /** Bandera para mostrar u ocultar la plantilla personalizada 5. */
  public mostarCustomtemplate5: boolean = false;

  /** Arreglo con la configuración de las secciones dinámicas y sus componentes para el formulario de perfiles ferroviarios. */
  public perfilesSecciones: SeccionDinamica[] = PERFILES_ACCORDION_SECCIONES;

  /** Estado de la solicitud de la tramite 32613.*/
  public rubroTransporteFerrovariostate!: RubroTransporteFerrovario32613State;

  /** Subject para notificar la destrucción del componente.*/
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Constructor que inyecta los servicios necesarios para gestionar el estado, las consultas y la creación de formularios en el trámite 32613. */
  constructor(
    private fb: FormBuilder,
    private tramite32613Store: Tramite32613Store,
    private tramite32613Query: Tramite32613Query,
    private consultaQuery: ConsultaioQuery,
  ) {
    //
  }

  /** Inicializa los estados necesarios del componente, configura los formularios dinámicos y asigna valores condicionales según el estado recibido. */
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
    this.initializeForm();
    Array.from({ length: 3 }).forEach(() => this.addOtrasCertificacionesGroup());
    this.initializeCustomTemplate1Form(this.template1Array, this.customTemplate1Form);
    this.initializeCustomTemplate1Form(this.template2Array, this.customTemplate2Form);
    this.initializeCustomTemplate1Form(this.template3Array, this.customTemplate3Form);
    this.initializeCustomTemplate1Form(this.template4Array, this.customTemplate4Form);
    this.initializeCustomTemplate1Form(this.template5Array, this.customTemplate5Form);
    this.asignarValorCondicional();
  }

  /** Asigna valores condicionales a los formularios y banderas de visualización según el estado recibido del rubro de transporte ferroviario. */
  asignarValorCondicional(): void {
    if (this.rubroTransporteFerrovariostate) {
      const CUSTOMS_TRADE_PARTNERSHIP = this.rubroTransporteFerrovariostate?.['customsTradePartnership'];
      const PIP = this.rubroTransporteFerrovariostate?.['pip'];
      const OEA = this.rubroTransporteFerrovariostate?.['oea'];
      const OTROS_PROGRAMAS = this.rubroTransporteFerrovariostate?.['otosProgramas'];

        if (CUSTOMS_TRADE_PARTNERSHIP === 'Si') {
          this.mostarCustomtemplate2 = true;
        } else {
          this.mostarCustomtemplate2 = false;
        }

        if (PIP === 'Si') {
          this.mostarCustomtemplate3 = true;
        } else {
          this.mostarCustomtemplate3 = false;
        }

        if (OEA === 'Si') {
          this.mostarCustomtemplate4 = true;
        } else {
          this.mostarCustomtemplate4 = false;
        }

        if (OTROS_PROGRAMAS === 'Si') {
          this.mostarCustomtemplate5 = true;
        } else {
          this.mostarCustomtemplate5 = false;
        }

        this.customTemplate1Form.patchValue({
          antiguedad: this.rubroTransporteFerrovariostate['antiguedad'],
          actividadPreponderante: this.rubroTransporteFerrovariostate['actividadPreponderante'],
          tipoDeServicio: this.rubroTransporteFerrovariostate['tipoDeServicio'],
          noDeEmbarquesEXP: this.rubroTransporteFerrovariostate['noDeEmbarquesEXP'],
          noDeEmbarquesIMP: this.rubroTransporteFerrovariostate['noDeEmbarquesIMP'],
          numeroDeEmpleados: this.rubroTransporteFerrovariostate['numeroDeEmpleados'],
          superficieDeLa: this.rubroTransporteFerrovariostate['superficieDeLa'],
        });

        this.customTemplate2Form.patchValue({
          nivel: this.rubroTransporteFerrovariostate['nivel'],
          ctpatAcc: this.rubroTransporteFerrovariostate['ctpatAcc'],
          tipoDeServicioCarga: this.rubroTransporteFerrovariostate['tipoDeServicioCarga'],
          mic: this.rubroTransporteFerrovariostate['mic'],
          fechaDeUltima: this.rubroTransporteFerrovariostate['fechaDeUltima']
        });

        this.customTemplate3Form.patchValue({
          numeroRegistro: this.rubroTransporteFerrovariostate['numeroRegistro']
        });

        this.customTemplate4Form.patchValue({
          nombreDelProgramaPais: this.rubroTransporteFerrovariostate['nombreDelProgramaPais'],
          oea_numeroRegistro: this.rubroTransporteFerrovariostate['oea_numeroRegistro']
        });

        this.customTemplate5Form.patchValue({
          nombreDelPrograma: this.rubroTransporteFerrovariostate['nombreDelPrograma'],
          otros_numeroRegistro: this.rubroTransporteFerrovariostate['otros_numeroRegistro'],
          vigencia: this.rubroTransporteFerrovariostate['vigencia']
        });

        if(this.rubroTransporteFerrovariostate?.['otrasCertificaciones']) {
          const VALORES = this.rubroTransporteFerrovariostate['otrasCertificaciones'];
          if (Array.isArray(VALORES)) {
            VALORES.forEach((item, index) => {
              const GRUPO = this.otrasCertificaciones.at(index);
              if (GRUPO) {
                GRUPO.patchValue({
                  nombre: item.nombre || '',
                  categoria: item.categoria || '',
                  vigencia: item.vigencia || ''
                });
              }
            });
          }
      }
    }
  }

  /** Inicializa el formulario dinámico para una plantilla personalizada, agregando controles según el arreglo recibido y deshabilitándolo si el estado es solo lectura. */
  initializeCustomTemplate1Form(array: RowTypeFormInput[], form: FormGroup): void {
    array.forEach(campo => {
      if (typeof campo.formControlName === 'string') {
        form.addControl(
          campo.formControlName,
          new FormControl('', campo.required ? Validators.required : [])
        );
      }
    });

    if (this.consultaState.readonly) {
      form.disable();
    }
  }

  /** Inicializa el formulario principal de perfiles ferroviarios con el grupo anidado 'ninoFormGroup' y el arreglo 'otrasCertificaciones'. */
  initializeForm(): void {
    this.perfilesFerrovarioForm = this.fb.group({
      ninoFormGroup: this.fb.group({}),
      otrasCertificaciones: this.fb.array([]),
    })
  }

  /** Crea y retorna un grupo de formulario para una certificación con los campos nombre, categoría y vigencia. */
  createOtrasCertificacionesGroup(): FormGroup {
    return this.fb.group({
      nombre: [''],
      categoria: [''],
      vigencia: ['']
    });
  }

  /** Agrega un nuevo grupo de certificación al arreglo 'otrasCertificaciones', deshabilitándolo si el estado es solo lectura. */
  addOtrasCertificacionesGroup(): void {
    const GRUPO = this.createOtrasCertificacionesGroup();
    if (this.consultaState?.readonly) {
      GRUPO.disable();
    }
    this.otrasCertificaciones.push(GRUPO);
  }

  /** Este getter devuelve el arreglo de grupos de certificaciones 'otrasCertificaciones' del formulario principal. */
  get otrasCertificaciones(): FormArray {
    return this.perfilesFerrovarioForm.get('otrasCertificaciones') as FormArray;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`*/
  get ninoFormGroup(): FormGroup {
    return this.perfilesFerrovarioForm.get('ninoFormGroup') as FormGroup;
  }

  /** Actualiza el valor dinámico de un campo en el store y gestiona la visualización de plantillas personalizadas según el campo y valor recibido. */
  establecerCambioDeValor(event: {campo: string, valor: string | number | object}): void {
    if (event.campo === 'customsTradePartnership') {
      if (event.valor === 'Si') {
        this.mostarCustomtemplate2 = true;
      } else {
        this.mostarCustomtemplate2 = false;
      }
    }

    if (event.campo === 'pip') {
      if (event.valor === 'Si') {
        this.mostarCustomtemplate3 = true;
      } else {
        this.mostarCustomtemplate3 = false;
      }
    }

    if (event.campo === 'oea') {
      if (event.valor === 'Si') {
        this.mostarCustomtemplate4 = true;
      } else {
        this.mostarCustomtemplate4 = false;
      }
    }

    if (event.campo === 'otosProgramas') {
      if (event.valor === 'Si') {
        this.mostarCustomtemplate5 = true;
      } else {
        this.mostarCustomtemplate5 = false;
      }
    }
    if (event) {
      this.tramite32613Store.setDynamicFieldValue(event.campo, event.valor);
    }
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
        customSection6: this.customTemplate6
      };
    });
  }

  /** Actualiza el valor dinámico de un campo en el store cuando ocurre un cambio en una plantilla personalizada. */
  customTemplateEvents(event: {campo: string, valor: string | number}): void {
    if (event) {
      this.tramite32613Store.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Actualiza el valor de un campo específico dentro del arreglo 'otrasCertificaciones' y sincroniza el arreglo completo en el store. */
  textValorCambio(event: Event, campo: string, index?: number): void {
    const OTRAS_ARRAY = this.perfilesFerrovarioForm.get('otrasCertificaciones') as FormArray;
    if (typeof index === 'number') {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      OTRAS_ARRAY.at(index).get(campo)?.setValue(INPUT_ELEMENT.value);
      const ARRAY_VALOR = OTRAS_ARRAY.getRawValue();
      this.tramite32613Store.setDynamicFieldValue('otrasCertificaciones', ARRAY_VALOR);
    }
  }

  /** Este método es parte del ciclo de vida del componente y se ejecuta automáticamente cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria en la aplicación.*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
