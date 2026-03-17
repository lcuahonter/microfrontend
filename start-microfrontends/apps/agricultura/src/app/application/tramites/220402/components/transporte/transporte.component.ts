import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, Subscription } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioQuery,
  ConsultaioState,
  TituloComponent,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';

import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';

import { Solicitud220402State, Solicitud220402Store } from '../../estados/tramites/tramites220402.store';


@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.scss',
})
export class TransporteComponent implements OnDestroy, OnInit {

  /**
  * @property {Solicitud220402State} transporteState
  * @description Estado actual del transporte, que contiene información relacionada con el trámite y el transporte.
  */
  public transporteState!: Solicitud220402State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Subscription} statusSubscription
   * @description Suscripción a los cambios de estado del formulario para actualizar el store.
   * @private
   */
  private statusSubscription!: Subscription;

  /**
   * @property {FormGroup} transporteForm
   * @description Formulario principal que contiene los datos del transporte.
   */
  transporteForm!: FormGroup;

  /**
   * @property {CatalogosSelect} tiposDocumentos
   * @description Catálogo que contiene información sobre los medios de transporte disponibles.
   */
  public tiposDocumentos: CatalogosSelect = {
    labelNombre: 'Medio de transporte',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Constructor de la clase TransporteComponent.
   *
   * @param {FormBuilder} fb - Constructor de formularios para crear y gestionar el FormGroup principal.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones comunes del formulario.
   * @param {MediodetransporteService} mediodetransporteService - Servicio para obtener los medios de transporte.
   * @param {Solicitud220402Store} solicitud220402Store - Store para gestionar el estado del trámite 220402.
   * @param {Solicitud220402Query} solicitud220402Query - Query para consultar el estado del trámite 220402.
   * @param {ConsultaioQuery} consultaioQuery - Query para consultar el estado de la consulta actual.
   * @param {ChangeDetectorRef} cdr - Servicio para detectar y aplicar cambios manualmente en la vista.
   *
   * @memberof TransporteComponent
   */
  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private mediodetransporteService: MediodetransporteService,
    private solicitud220402Store: Solicitud220402Store,
    private solicitud220402Query: Solicitud220402Query,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchTiposDocumentos();
  }

  /**
    * Método que se ejecuta al inicializar el componente.
    * 
    * Este método realiza las siguientes acciones:
    * 1. Inicializa los catálogos necesarios para el formulario.
    * 
    * @returns {void}
    */
  ngOnInit(): void {
    this.solicitud220402Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.transporteState = seccionState;
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    // Inicializar el formulario principal
    this.crearFormTransporte();

    // Suscripción a los cambios de estado del formulario para actualizar el store de Akita.
    this.statusSubscription = this.transporteForm.statusChanges.subscribe(() => {
        this.solicitud220402Store.updateFormStatus('transporte', this.transporteForm.valid);
    });

    // Comprueba si se debe marcar el formulario como 'touched' al iniciar.
    if (this.solicitud220402Query.getValue().markAllAsTouched) {
        this.mostrarErrores();
    }
  }

  /**
   * Este método se utiliza para crear la forma del transporte. - 220402
   */
  crearFormTransporte(): void {
    this.transporteForm = this.fb.group({
      mediodeTransporte: [this.transporteState?.mediodeTransporte, [Validators.required]],
      identificacionDelTransporte: [this.transporteState?.identificacionDelTransporte, [Validators.maxLength(50)]]
    });
    this.inicializarEstadoFormulario();
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Configura el estado del formulario `transporteForm` según el modo de solo lectura.
   * 
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles del formulario.
   * 
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.transporteForm?.disable();
    } else {
      this.transporteForm?.enable();
    }
  }
  /**
   * Este método se utiliza para validar la forma del transporte. - 220402
   * @param form: Forma del transporte
   * @param field: campo del formulario
   * @returns Validaciones del formulario
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Este método se utiliza para marcar los controles del formulario como tocados. - 220402
   */
  validarTransporteFormulario(): void {
    if (this.transporteForm.invalid) {
      this.transporteForm.markAllAsTouched();
    }
  }
  /**
   * Este método se utiliza para obtener los datos de los medios de transporte.
   */
  fetchTiposDocumentos(): void {
    this.mediodetransporteService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.tiposDocumentos.catalogos = data.datos as Catalogo[];
      });
  }

  /**
     * Establece los valores en el store de tramite5701.
     *
     * @param {FormGroup} form - El formulario del cual se obtiene el valor.
     * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
     * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     * @returns {void}
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud220402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud220402Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Este método se utiliza para destruir la suscripción.
   * @returns destroyNotifier$
   */
  ngOnDestroy(): void {
    // Asegura que el último estado de validez se guarde en el store antes de destruir el componente.
    this.solicitud220402Store.updateFormStatus('transporte', this.transporteForm.valid);

    // Cancela la suscripción a los cambios de estado para evitar fugas de memoria.
    if (this.statusSubscription) {
        this.statusSubscription.unsubscribe();
    }

    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Este método se utiliza para mostrar los errores del formulario.
   * Marca todos los controles del formulario como tocados para que se muestren los errores de validación.
   * 
   * @returns {void}
   */
  public mostrarErrores = ():void => {
    this.transporteForm?.markAllAsTouched?.();
    this.cdr.detectChanges();
  }
}