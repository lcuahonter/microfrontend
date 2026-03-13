import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../estados/tramites261103.query';
import { DatosProcedureState } from '../../estados/tramites261103.store';
import { DatosProcedureStore } from '../../estados/tramites261103.store';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { MANIFIESTOS_DECLARACION } from '../../../../shared/constantes/aviso-de-funcionamiento.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-manifiestos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent],
  templateUrl: './manifiestos.component.html',
  styleUrl: './manifiestos.component.scss',
})
export class ManifiestosComponent implements OnInit, OnDestroy {
  /**
   * @description
   * Texto de los manifiestos.
   */
  manifiestosText: string = '';
  /**
   * Texto ingresado en el cuadro para motivo de desistimiento.
   * @public
   */
  public motivoDesistimientotextBox: string = '';

  /**
   * Texto de confirmación de veracidad.
   * @public
   */
  public confirmarVeracidad: string = '';

  /**
   * Indica si la casilla de declaración fue marcada.
   * @public
   */
  public declaracionEstaMarcado: boolean = false;

  /**
   * Formulario reactivo para datos del establecimiento.
   * @public
   */
  public domicilioEstablecimiento!: FormGroup;

  /**
   * Formulario reactivo de la sección de aduanas.
   * @public
   */
  public Aduana!: FormGroup;

  /**
 * Estado de la sección que contiene los datos del procedimiento.
 * 
 * Esta propiedad almacena el estado actual de los datos relacionados con el procedimiento.
 * Se inicializa a través de un observable en el método `obtenerDatosFormulario`, 
 * que suscribe a los cambios en el estado y actualiza esta propiedad con los datos más recientes.
 * 
 * Tipo: `DatosProcedureState`
 * 
 * @private
 */
  private seccionState!: DatosProcedureState;

  /**
   * Opciones del componente de radio input.
   * @public
   */
  public radioOptions: { label: string; value: string }[] = [
    { label: 'No', value: 'No' },
    { label: 'Si', value: 'Si' },
  ];

 
  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Getter que determina si los campos deben estar deshabilitados.
   * 
   * Los campos deben deshabilitarse cuando:
   * - El formulario está en modo solo lectura (esFormularioSoloLectura = true), O
   * - El valor de ideGenerica1 es nulo, undefined, vacío, o no es 'Modificacion'
   * 
   * @returns {boolean} true si los campos deben estar deshabilitados, false si deben estar habilitados
   */
  public get debeEstarDeshabilitado(): boolean {
    // Return true if seccionState is not initialized yet
    if (!this.seccionState) {
      return true;
    }
    
    const IDE_GENERICA_1 = this.seccionState.ideGenerica1;
    const ES_IDE_GENERICA_1_VALIDO = IDE_GENERICA_1 && IDE_GENERICA_1.trim() !== '' && IDE_GENERICA_1 === 'Modificacion';
    
    return this.esFormularioSoloLectura || !ES_IDE_GENERICA_1_VALIDO;
  }
  /**
   * Constructor del componente.
   * @param fb FormBuilder para construir formularios reactivos.
   * @param store Servicio de almacenamiento de estado.
   * @param query Servicio de consulta del estado.
   */
  constructor(
    private fb: FormBuilder,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor del componente
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState: { readonly: boolean }) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        // Apply state after form exists
        if (this.Aduana) {
          this.aplicarEstadoFormulario();
        }
      })
    )
    .subscribe()
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al observable `selectProrroga$` y configura el formulario.
   */
  public ngOnInit(): void {
    this.manifiestosText = MANIFIESTOS_DECLARACION.MANIFIESTOS;
    this.obtenerDatosFormulario();
  }

/**
 * Inicializa el formulario reactivo `Aduana` con los valores del estado actual.
 * 
 * Este método configura un grupo de controles de formulario con los siguientes campos:
 * - `aduanas`: Campo que representa las aduanas, inicializado con el valor de `seccionState?.aduanas` o una cadena vacía.
 * - `informacionConfidencial`: Campo que representa la información confidencial, inicializado con el valor de `seccionState?.informacionConfidencial` o una cadena vacía.
 * - `Si`: Campo adicional inicializado con una cadena vacía.
 * 
 * Todos los campos están habilitados por defecto.
 * 
 * @returns {void}
 */
public mercanciasData(): void {
  this.query.selectProrroga$
  .pipe(
    takeUntil(this.destroyNotifier$),
    map((seccionState) => {
      this.seccionState = seccionState;
    })
  )
  .subscribe()
  this.Aduana = this.fb.group({
    aduanas: [this.seccionState?.aduanas || ''],
    informacionConfidencial: [this.seccionState?.informacionConfidencial || ''],
    Si: [''],
  });
  
  // Apply the correct disable/enable state after form creation
  this.aplicarEstadoFormulario();
}

  /**
   * Establece un valor en la tienda a partir de un campo del formulario.
   * @param form Formulario reactivo del cual se extrae el valor.
   * @param campo Nombre del campo que se va a guardar.
   * @public
   */
  public setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
  }

/**
 * Obtiene los datos del formulario desde el estado almacenado y los configura en el componente.
 * 
 * Este método realiza las siguientes acciones:
 * - Se suscribe al observable `selectProrroga$` para obtener los datos del estado actual.
 * - Asigna los datos obtenidos a la propiedad `seccionState`.
 * - Determina si la declaración está marcada basándose en el valor de `aduanas`.
 * - Llama al método `mercanciasData` para inicializar el formulario reactivo `Aduana` con los datos obtenidos.
 * 
 * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria al destruir el componente.
 * 
 * @returns {void}
 */
  obtenerDatosFormulario(): void {
    this.query.selectProrroga$
      ?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosProcedureState) => {
        this.seccionState = data;
        this.declaracionEstaMarcado = Boolean(this.seccionState?.aduanas);
        this.mercanciasData();
      });
  }

  /**
   * Aplica el estado de habilitación/deshabilitación al formulario.
   * 
   * Este método verifica si el formulario existe y aplica la lógica unificada
   * que considera tanto `esFormularioSoloLectura` como `ideGenerica1` para
   * determinar si los campos deben estar habilitados o deshabilitados.
   * 
   * @returns {void}
   */
  public aplicarEstadoFormulario(): void {
    if (!this.Aduana || !this.seccionState) {
      return;
    }
    
    // Obtener el valor de ideGenerica1 del estado
    const IDE_GENERICA_1 = this.seccionState.ideGenerica1;
    
    // Determinar si los campos deben estar habilitados
    const DEBE_ESTAR_HABILITADO = !this.esFormularioSoloLectura && (IDE_GENERICA_1 === 'Modificacion');
    
    if (DEBE_ESTAR_HABILITADO) {
      this.Aduana.enable();
    } else {
      this.Aduana.disable();
    }
  }
  /**
   * Hook de destrucción del componente.
   * Finaliza las subscripciones.
   * @public
   */
  public ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
