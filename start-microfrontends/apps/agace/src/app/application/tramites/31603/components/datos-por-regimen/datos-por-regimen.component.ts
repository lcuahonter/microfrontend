import { ConsultaioState, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { CONFIGURACION_DATOS } from '../../constantes/datos-por-regimen.enum';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConceptosComponent } from '../conceptos/conceptos.component';
import { DEPOSITO_FISCAL } from '../../constantes/datos-por-regimen.enum';
import { ELABORACION } from '../../constantes/datos-por-regimen.enum';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { IMPORTACION_TEMPORAL } from '../../constantes/datos-por-regimen.enum';
import { Input } from '@angular/core';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { RECINTO_FISCALIZADO } from '../../constantes/datos-por-regimen.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud31603State } from '../../estados/stores/tramite31603.store';
import { Subject } from 'rxjs';
import { Tramite31603Query } from '../../estados/queries/tramite31603.query';
import { Tramite31603Store } from '../../estados/stores/tramite31603.store';
import { map } from 'rxjs';
import radio_si_no from '@libs/shared/theme/assets/json/31601/radio_si_no.json';
import { takeUntil } from 'rxjs';

/**
 * Este componente es responsable de gestionar y mostrar los datos relacionados con los diferentes regímenes
 * dentro de la aplicación. Utiliza formularios reactivos para capturar y validar la entrada del usuario,
 * y se integra con un store y un query para manejar el estado y las consultas relacionadas con el Trámite 31603.
 */
@Component({
  selector: 'app-datos-por-regimen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    InputRadioComponent,
    ConceptosComponent,
  ],
  templateUrl: './datos-por-regimen.component.html',
  styleUrl: './datos-por-regimen.component.scss',
})
export class DatosPorRegimenComponent implements OnInit, OnDestroy {
  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * Un subject utilizado para notificar y completar cualquier suscripción activa cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que todas las suscripciones vinculadas a este notifier
   * se desuscriban correctamente durante el ciclo de vida del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar los datos relacionados con las importaciones.
   * Se espera que este grupo de formulario contenga controles para capturar la entrada del usuario y realizar validaciones
   * específicas para el componente "datos por régimen".
   */
  public importacionesForm!: FormGroup;
  /**
   * Contiene las opciones para un grupo de botones de radio, típicamente representando una elección de "Sí" o "No".
   * Se espera que la variable `radio_si_no` contenga las opciones predefinidas para este componente.
   */
  public radioOpcions = radio_si_no;
  /**
   * Almacena el valor seleccionado, que puede ser una cadena o un número.
   * Esta propiedad se inicializa como una cadena vacía por defecto.
   */
  public valorSeleccionado: string | number = '';
  /**
   * Representa un grupo de formulario reactivo para gestionar los datos relacionados con la sección "indique si".
   */
  public indiqueSiForma: FormGroup = new FormGroup({
    importacionTemporalFormGroup: new FormGroup({}),
  });
  /**
   * Representa el grupo de formulario principal para la funcionalidad de "Depósito Fiscal".
   * Contiene un grupo de formulario anidado `depositoFiscalFormGroup` para gestionar
   * controles específicos relacionados con "Depósito Fiscal".
   */
  public depositoFiscalForma: FormGroup = new FormGroup({
    depositoFiscalFormGroup: new FormGroup({}),
  });
  /**
   * Representa la estructura del grupo de formularios para el formulario "elaboracionForma".
   * Este grupo de formularios contiene un grupo de formularios anidado llamado "elaboracionFormGroup".
   */
  public elaboracionForma: FormGroup = new FormGroup({
    elaboracionFormGroup: new FormGroup({}),
  });
  /**
   * Representa una estructura de grupo de formularios para gestionar datos relacionados con "recinto".
   *
   * @property recintoFiscalizadoFormGroup - Un grupo de formularios anidado destinado a manejar
   * controles y validaciones específicas para "recinto fiscalizado".
   */
  public recintoForma: FormGroup = new FormGroup({
    recintoFiscalizadoFormGroup: new FormGroup({}),
  });
  /**
   * Representa los datos del formulario para indicar si se realiza una acción específica.
   * Esta propiedad se inicializa con la constante `CONFIGURACION_DATOS`.
   */
  public indiqueSiFormDatos = CONFIGURACION_DATOS;
  /**
   * Contiene los datos relacionados con la importación temporal.
   * Esta propiedad se inicializa con la constante `IMPORTACION_TEMPORAL`.
   * Se utiliza para gestionar y mostrar información específica de la importación temporal
   * dentro del contexto del componente.
   */
  public importacionTemporalDatos: ModeloDeFormaDinamica[] = IMPORTACION_TEMPORAL;
  /**
   * Contiene los datos relacionados con el régimen de "Depósito Fiscal".
   * Esta propiedad se inicializa con la constante `DEPOSITO_FISCAL`.
   */
  public depositoFiscalDatos = DEPOSITO_FISCAL;
  /**
   * Representa los datos de elaboración utilizados en el componente.
   * Esta propiedad se inicializa con la constante `ELABORACION`.
   */
  public elaboracionDatos = ELABORACION;
  /**
   * Contiene los datos para el "Recinto Fiscalizado".
   * Esta propiedad se inicializa con la constante `RECINTO_FISCALIZADO`.
   * Se utiliza para gestionar y mostrar información relacionada con recintos fiscalizados
   * dentro de la aplicación.
   */
  public recintoFiscalizadoDatos = RECINTO_FISCALIZADO;
  /**
   * Representa el estado del proceso de Solicitud31602.
   * Esta propiedad se utiliza para gestionar y almacenar el estado actual
   * de la solicitud dentro del componente DatosPorRegimen.
   */
  public solicitudState!: Solicitud31603State;
  /**
  * Indica si deben mostrarse solo las importaciones.
  * Valor por defecto: false.
  */
  @Input() mostrarSoloImportaciones: boolean = false;
  /**
  * Indica si deben mostrarse solo los depósitos fiscales.
  * Valor por defecto: false.
  */
  @Input() mostrarSoloDepositoFiscal: boolean = false;
  /**
  * Indica si deben mostrarse solo los registros en elaboración.
  * Valor por defecto: false.
  */
  @Input() mostrarSoloElaboracion: boolean = false;
  /**
  * Indica si deben mostrarse solo los registros del recinto.
  * Valor por defecto: false.
  */
  @Input() mostrarSoloRecinto: boolean = false;

  /**
   * Constructor del componente DatosPorRegimenComponent.
   *
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param tramite31603Store - Un servicio de store para gestionar el estado del Trámite 31602.
   * @param tramite31603Query - Un servicio de consulta para recuperar datos relacionados con el Trámite 31602.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31603Store: Tramite31603Store,
    private tramite31603Query: Tramite31603Query
  ) {
    //
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   *
   * En esta implementación:
   * - Se suscribe al observable `selectSolicitud$` de `tramite31602Query` para actualizar la propiedad `solicitudState`.
   *   La suscripción se desuscribe automáticamente cuando `destroyNotifier$` emite un valor, evitando fugas de memoria.
   * - Inicializa el formulario de importaciones llamando al método `cerarImportacionesForm`.
   */
  ngOnInit(): void {
    this.tramite31603Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.cerarImportacionesForm();
  }

  /**
   * Inicializa el FormGroup `importacionesForm` con valores predeterminados.
   * El formulario contiene un único control llamado `importaciones` inicializado con una cadena vacía.
   * Este método se utiliza típicamente para configurar la estructura del formulario para gestionar datos de importación.
   */
  public cerarImportacionesForm(): void {
    this.importacionesForm = this.fb.group({
      importaciones: [''],
    });
    Promise.resolve().then(() => {
      if (this.consultaState.readonly) {
        this.importacionesForm.get('importaciones')?.disable();
      } else {
        this.importacionesForm.get('importaciones')?.enable();
      }
      if (this.consultaState.readonly || this.consultaState.update) {
        this.valorSeleccionado = 'Si';
      }
    });
  }

  /**
   * Getter para la propiedad `importacionTemporalFormGroup`.
   * Esto recupera la instancia de `FormGroup` asociada con el
   * control 'importacionTemporalFormGroup' del grupo de formularios principal (`indiqueSiForma`).
   */
  get importacionTemporalFormGroup(): FormGroup {
    return this.indiqueSiForma.get('importacionTemporalFormGroup') as FormGroup;
  }

  /**
   * Getter para la propiedad 'depositoFiscalFormGroup'.
   * Esto recupera el 'depositoFiscalFormGroup' como un FormGroup
   * desde el FormGroup principal 'depositoFiscalForma'.
   */
  get depositoFiscalFormGroup(): FormGroup {
    return this.depositoFiscalForma.get('depositoFiscalFormGroup') as FormGroup;
  }

  /**
   * Getter para la propiedad `elaboracionFormGroup`.
   * Recupera la instancia de `FormGroup` asociada con la clave 'elaboracionFormGroup'
   * desde el grupo de formularios principal `elaboracionForma`.

   */
  get elaboracionFormGroup(): FormGroup {
    return this.elaboracionForma.get('elaboracionFormGroup') as FormGroup;
  }

  /**
   * Recupera la instancia de `FormGroup` asociada con el control 'recintoFiscalizadoFormGroup'
   * desde el grupo de formularios principal `recintoForma`.
   */
  get recintoFiscalizadoFormGroup(): FormGroup {
    return this.recintoForma.get('recintoFiscalizadoFormGroup') as FormGroup;
  }

  /**
   * Maneja los cambios en la selección de importaciones.
   * Actualiza la propiedad `valorSeleccionado` con el valor proporcionado.
   */
  public onImportacionesCambio(value: string | number): void {
    this.valorSeleccionado = value;
    if (value === 'No') {
        const INDEX = this.importacionTemporalDatos.findIndex(item => item.campo === 'captureElValorTotal');
        if (INDEX !== -1) {
          this.importacionTemporalDatos[INDEX] = { ...this.importacionTemporalDatos[INDEX], mostrar: false };
        }
      }
  }

  /**
   * Maneja el cambio de valor para un campo específico y actualiza el store en consecuencia.
   *
   * @param event - Un objeto que contiene el nombre del campo (`campo`) y el nuevo valor (`valor`).
   *   - `campo`: El nombre del campo a actualizar.
   *   - `valor`: El nuevo valor para el campo. Si el valor es un objeto con una propiedad `id`,
   *     se extrae el `id` y se utiliza como el valor; de lo contrario, se utiliza el valor en sí.
   * Actualiza el `tramite31602Store` con el nuevo valor para el campo especificado.
   */
  public establecerCambioDeValor(event: { campo: string; valor: unknown }): void {
    if (
      event &&
      typeof event.valor === 'object' &&
      event.valor !== null &&
      'id' in event.valor
    ) {
      const VALOR = event.valor.id;
      this.tramite31603Store.setDynamicFieldValue(event.campo, VALOR as string | number | boolean);
    } else if (event) {
      this.tramite31603Store.setDynamicFieldValue(event.campo, event.valor as string | number | boolean);
    }
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Limpia los recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a cualquier suscripción que debe desuscribirse.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
