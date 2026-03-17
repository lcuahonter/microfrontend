import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query';
import { DatosProcedureState } from '../../../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
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
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState: { readonly: boolean }) => {
        this.esFormularioSoloLectura = seccionState.readonly;
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
    aduanas: [
      {
        value: this.seccionState?.aduanas || '',
        disabled: false,
      },
    ],
    informacionConfidencial: [
      {
        value: this.seccionState?.informacionConfidencial || '',
        disabled: false,
      },
    ],
    Si: [{ value: '', disabled: false }],
  });
  if (this.esFormularioSoloLectura) {
    this.Aduana.disable();
  } else {
    this.Aduana.enable();
  }
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
 * Inicializa el estado del formulario.
 * 
 * Este método realiza las siguientes acciones:
 * 
 * 1. Llama al método `obtenerDatosFormulario` para cargar los datos del estado actual.
 * 2. Si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
 *    - Deshabilita el formulario reactivo `Aduana` utilizando el método `disable`.
 * 3. Si el formulario no está en modo solo lectura:
 *    - Habilita el formulario reactivo `Aduana` utilizando el método `enable`.
 *    - Llama nuevamente al método `obtenerDatosFormulario` para asegurarse de que los datos estén actualizados.
 *    - Llama al método `mercanciasData` para cargar los datos relacionados con las mercancías.
 * 
 * Este método es útil para configurar el estado inicial del formulario y sincronizarlo
 * con los datos del estado global de la aplicación.
 * 
 * @returns {void}
 */
  inicializarEstadoFormulario(): void {
    this.obtenerDatosFormulario();
    if (this.esFormularioSoloLectura) {
      this.Aduana.disable();
    } else {
      this.Aduana.enable();
      this.obtenerDatosFormulario();
      this.mercanciasData();
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
