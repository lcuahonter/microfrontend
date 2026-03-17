/**
 * @class RepresentacionFederalComponent
 * @description
 * Este componente gestiona la representación federal dentro de un formulario.
 * Permite al usuario seleccionar una entidad federativa y su respectiva representación federal.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-representacion-federal
 * @standalone true
 * @requires CommonModule
 * @requires ReactiveFormsModule
 * @requires CatalogoSelectComponent
 * @requires TituloComponent
 *
 * @templateUrl ./representacion-federal.component.html
 * @styleUrls ['./representacion-federal.component.scss']
 */

import { doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';

import {
  Catalogo,
  ConsultaioQuery,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Observable,Subject,map,takeUntil } from 'rxjs';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { Tramite120401Query } from '../../estados/queries/tramite120401.query';
import { Tramite120401Store } from '../../estados/tramites/tramite120401.store';

/**
 * @class RepresentacionFederalComponent
 * @description
 * Componente de Angular encargado de manejar la representación federal dentro de un formulario.
 */
@Component({
  selector: 'app-representacion-federal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
  ],
  templateUrl: './representacion-federal.component.html',
  styleUrls: ['./representacion-federal.component.scss'],
})
export class RepresentacionFederalComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} representacionForm
   * @description
   * Formulario reactivo que maneja la selección de entidad federativa y representación federal.
   * Se inicializa en `ngOnInit()`.
   *
   * @access public
   */
  public representacionForm!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * @property {Catalogo[]} entidad
   * @description
   * Lista de entidades federativas cargadas desde un archivo JSON.
   * Se usa para poblar el select de entidades en el formulario.
   *
   * @access public
   */
  public entidad: Catalogo[] = [];

  /**
   * @property {Catalogo[]} representacion
   * @description
   * Lista de representaciones federales cargadas desde un archivo JSON.
   * Se usa para poblar el select de representaciones en el formulario.
   *
   * @access public
   */
  public representacion: Catalogo[] = [];

  /**
   * @property {Observable<Catalogo | null>} entidad$
   * @description
   * Observable que emite la entidad federativa seleccionada desde el store.
   * Se utiliza para sincronizar el estado de la entidad en el formulario.
   *
   * @access public
   */
  entidad$: Observable<string | null> = this.tramite120401Query.entidad$;

   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**  * Indica si el formulario ha sido tocado.
   */
  public formTouched: boolean = false;

  /**  * Indica si el formulario es válido.
   */
  public federal:boolean =false;

  /**
   * Observable que emite un objeto de tipo `Catalogo` o `null`,
   * representando la información de la representación federal asociada.
   *
   * Se obtiene a través de la consulta `tramite120401Query.representacion$`.
   */
  representacion$: Observable<string | null> =
    this.tramite120401Query.representacion$;

  /**
   * @constructor
   * @description
   * Constructor que inyecta `FormBuilder` para la creación del formulario reactivo.
   *
   * @param {FormBuilder} fb - Servicio de Angular para construir formularios reactivos.
   * @access public
   */
  constructor(
    private fb: FormBuilder,
    private service: AsignacionDirectaCupoPersonasFisicasPrimeraVezService,
    private tramite120401Store: Tramite120401Store,
    private tramite120401Query: Tramite120401Query,
    private consultaQuery: ConsultaioQuery,
  ) {
   
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a `initializeForm()` para configurar el formulario.
   *
   * @returns {void}
   * @access public
   */
  public ngOnInit(): void {
    this.initializeForm();
    this.loadEntidad();

    /**
     * Suscribe al estado del trámite desde `tramiteState$` y actualiza los valores
     * del formulario reactivo `representacionForm` con los datos del estado.
     *
     * Si el estado contiene valores para `entidad` y `representacion`, estos
     * se asignan automáticamente a los campos correspondientes del formulario.
     */
    this.tramite120401Query.tramiteState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        if (state) {
          this.representacionForm.patchValue({
            entidad: state.entidad,
            representacion: state.representacion,
          });
        }
      });

      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  
        /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
     inicializarEstadoFormulario(): void {
      if(!this.representacionForm){
        this.initializeForm();
      }
      if (this.esFormularioSoloLectura) {
          this.representacionForm.disable();
      }
    }
    /**
    * Valida el formulario de representación federal.
    * Marca todos los campos como tocados si el formulario es inválido.
    */
    public validarFormulario(): boolean {
      let isValid = true;
      if (this.representacionForm.invalid) {
        this.representacionForm.markAllAsTouched();
        this.formTouched = this.representacionForm.get('entidad')?.touched ?? false;
        this.federal = this.representacionForm.get('representacion')?.touched ?? false;
        isValid = false;
      }
      return isValid;
    }
 

  /**
   * @method initializeForm
   * @description
   * Inicializa el formulario reactivo con los campos requeridos.
   * Se establecen valores vacíos por defecto.
   *
   * @returns {void}
   * @access private
   */
  private initializeForm(): void {
    this.representacionForm = this.fb.group({
      /**
       * @property {string} entidad
       * @description
       * Campo del formulario para la selección de la entidad federativa.
       * Se inicializa como una cadena vacía.
       */
      entidad: ['', [Validators.required]],

      /**
       * @property {string} representacion
       * @description
       * Campo del formulario para la selección de la representación federal.
       * Se inicializa como una cadena vacía.
       */
      representacion: ['', [Validators.required]],
    });
  }

  /**
   * Carga la información de la entidad desde el servicio y la asigna al formulario.
   */
  loadEntidad(): void {
    this.service
      .getEntidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if(esValidObject(data)) {
          const RESPONSE = doDeepCopy(data);
          if(esValidArray(RESPONSE.datos)) {
            this.entidad = RESPONSE.datos;
          }
        }
      });
  }

  /**
   * Carga la información de la representacion desde el servicio y la asigna al formulario.
   */
  loadRepresentacion(entidad: string): void {
    this.service
      .getRepresentacion(entidad)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if(esValidObject(data)) {
          const RESPONSE = doDeepCopy(data);
          if(esValidArray(RESPONSE.datos)) {
            this.representacion = RESPONSE.datos;
          }
        }
      });
  }

  /**
   * Obtiene el valor seleccionado del campo de entidad federativa y lo establece en el store.
   */
  getEntidad(): void {
    const SELECTED_ENTIDAD = this.representacionForm.get('entidad')?.value;
    this.tramite120401Store.setEntidad(SELECTED_ENTIDAD);
    this.loadRepresentacion(SELECTED_ENTIDAD);
  }

  /**
   * Obtiene el valor seleccionado del campo de representación federal y lo establece en el store.
   */
  getRepresentacionValor(): void {
    const SELECTED_REPRESENTACION =
      this.representacionForm.get('representacion')?.value;
    this.tramite120401Store.setRepresentacion(SELECTED_REPRESENTACION);
  }

  
  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
