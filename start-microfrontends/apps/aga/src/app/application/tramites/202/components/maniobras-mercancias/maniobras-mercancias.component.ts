import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Manifiestos, ManifiestosRespuesta } from '../../models/prestadores-servicio.model';
import { ManiobrasMercancias202State, Tramite202Store } from '../../../../core/estados/tramites/tramite202.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PrestadoresServicioService } from '../../services/prestadores-servicio/prestadores-servicio.service';
import { Tramite202Query } from '../../../../core/queries/tramite202.query';

/**
 * Componente para gestionar maniobras y mercancías.
 */
@Component({
  selector: 'app-maniobras-mercancias',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ],
  templateUrl: './maniobras-mercancias.component.html',
  styleUrl: './maniobras-mercancias.component.scss',
})
export class ManiobrasMercanciasComponent implements OnDestroy {
  /**
   * Formulario de maniobras y mercancías.
   */
  maniobrasMercanciasForm!: FormGroup;

  /**
   * Aduana seleccionada por el usuario.
   * @type {Catalogo[]}
   */
  aduana!: Catalogo[];

  /**
   * Lista de manifiestos obtenidos desde el servicio.
   */
  manifiestos: Manifiestos[] = [];

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Estado de la sección de maniobras y mercancías.
   * Se utiliza para almacenar el estado de la sección de maniobras y mercancías.
   */
  public maniobrasMercanciasState!: ManiobrasMercancias202State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();


  /**
   * Constructor del componente.
   * @param fb FormularioBuilder para crear formularios reactivos.
   * @param tramite202Store Tienda para gestionar el estado del trámite 202. 
   * @param tramite202Query Consulta para obtener datos del trámite 202.
   * @param prestadoresServicioService Servicio para obtener datos de manifiestos y aduanas.
   * @param consultaioQuery - Query para gestionar el estado de la consulta.
   */
  constructor(
    public fb: FormBuilder,
    private tramite202Store: Tramite202Store,
    private tramite202Query: Tramite202Query,
    private prestadoresServicioService: PrestadoresServicioService,
    public consultaioQuery: ConsultaioQuery
  ) { 
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.inicializaCatalogos();

    this.obtenerManifiestos();

    this.tramite202Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.maniobrasMercanciasState = seccionState;
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearManiobrasMercanciasForm();

    this.aduanaSeleccion();
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según si está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilitan todos los campos.
   * Si no, se habilitan todos los campos.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.maniobrasMercanciasForm?.disable();
    } else if (!this.formularioDeshabilitado) {
      this.maniobrasMercanciasForm?.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearManiobrasMercanciasForm(): void {
    this.maniobrasMercanciasForm = this.fb.group({
      seleccionadaManifiesto:
        this.fb.array(this.maniobrasMercanciasState?.seleccionadaManifiesto),
      aduana: [
        this.maniobrasMercanciasState?.aduana,
        [Validators.required]
      ]
    });

    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa los catálogos de países y documentos de residencia.
   * @returns {void}
   */
  inicializaCatalogos(): void {
    const ADUANA$ = this.prestadoresServicioService
      .getAduana()
      .pipe(
        map((resp) => {
          this.aduana = resp.data;
        })
      );

    merge(
      ADUANA$
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Obtiene el FormArray correspondiente a 'seleccionadaManifiesto' dentro del formulario de registro de donación.
   * 
   * @returns {FormArray} El FormArray de 'seleccionadaManifiesto'.
   */
  get seleccionadaManifiesto(): FormArray {
    return this.maniobrasMercanciasForm.get('seleccionadaManifiesto') as FormArray;
  }

  /**
   * Método para seleccionar la aduana.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.maniobrasMercanciasForm.get('aduana')?.value;
    this.tramite202Store.setAduana(ADUANA);
  }

  /**
   * Obtiene los manifiestos y los guarda en `manifiestos`.
   * Inicializa `manifiestosSeleccionados` con valores `false`.
   */
  obtenerManifiestos(): void {
    this.prestadoresServicioService.getManifiestos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (result: ManifiestosRespuesta) => {
          this.manifiestos = result?.data;
        }
      });
  }

  /**
   * Cambia el estado de la casilla de verificación según el índice.
   * 
   * @param event - El evento que se dispara al cambiar el estado del checkbox.
   * @param {number} index - Índice de la casilla de verificación.
   * 
   * @returns {void}
   */
  onManifiestoCheckboxCambiar(event: Event, index: number): void {
    const VALOR_ENTRADA = event.target as HTMLInputElement;
    this.seleccionadaManifiesto.controls[index].setValue(VALOR_ENTRADA.checked);
    this.setValoresStore(this.maniobrasMercanciasForm, 'seleccionadaManifiesto', 'setSeleccionadaManifiesto');
  }

  /**
   * Establece los valores en el store de tramite202.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite202Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite202Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}