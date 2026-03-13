/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Componente para la gestión del formulario de solicitante.
 * Este componente maneja la lógica y la presentación del formulario de solicitante,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module SolicitantetabComponent
 */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListaPasosWizard, PASOS, TituloComponent, ValidacionesFormularioService, WizardComponent } from '@ng-mf/data-access-user';
import { Tramite120404State,Tramite120404Store} from '../../estados/store/tramite120404.store';
import { CommonModule } from '@angular/common';
import { SolicitanteasigncionserviceService } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { Tramite120404Query } from '../../estados/queries/tramite120404.query';
import { takeUntil } from 'rxjs/operators';
/**
 * Componente para la gestión del formulario de solicitante.
 * @selector app-solicitantetab
 * @standalone true
 * @imports [CommonModule, TituloComponent, AlertComponent, ReactiveFormsModule, BtnContinuarComponent]
 * @templateUrl ./solicitantetab.component.html
 * @styleUrl ./solicitantetab.component.scss
 */
@Component({
  selector: 'app-solicitantetab',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './solicitantetab.component.html',
  styleUrls: ['./solicitantetab.component.scss'],
})
export class SolicitantetabComponent implements OnInit, OnDestroy {
  /**
   * Formulario de asignación.
   */
  formasignacion!: FormGroup;

  /**
   * Sujeto para manejar la destrucción del componente.
   * @private
   */
  private destroyed$ = new Subject<void>();

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
 * Estado de la solicitud.
 * Este estado se obtiene del store `Tramite120404Query`.
 */
  public solicitudState!: Tramite120404State;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación del formulario.
   * @param service Servicio para obtener los datos de asignación.
   */
  @Input() isContinuarTriggered: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación del formulario.
   * @param service Servicio para obtener los datos de asignación.
   */

  constructor(private fb: FormBuilder, private service: SolicitanteasigncionserviceService, private validacionesService: ValidacionesFormularioService,
    private tramite120404Store: Tramite120404Store,
    private tramite120404Query: Tramite120404Query
  ) { }

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
   * Método de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.initForm();
    this.loadAsignacionData();
    if (this.isContinuarTriggered) {
      this.validarFormularios();
    }
  }

  /**
   * Inicializa el formulario de asignación.
   */
  initForm(): void {
    this.tramite120404Query.selectTramite120404$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite120404State) => {
        this.solicitudState = data;
        this.loadAsignacionData();

      });
    this.formasignacion = this.fb.group({
      especie: [{ value: '', disabled: true }],
      funcionZootecnica: [{ value: '', disabled: true }],
      autorizado: [{ value: '', disabled: true }],
      expendido: [{ value: '', disabled: true }],
      disponible: [{ value: '', disabled: true }],
      ampliar: [
        this.solicitudState.ampliar ?? '',
        Validators.required
      ]
    });


  }

  /**
  * Obtiene el valor de un control en el formulario y lo pasa a un método del store para actualizar el estado.
  */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite120404Store.establecerDatos({ [campo]: VALOR });
    const CONTROL = form.get(campo);
    if (CONTROL) {
      CONTROL.updateValueAndValidity();
    }
    if (this.isContinuarTriggered) {
      this.validarFormularios();
    }
  }
  /**
   * Carga los datos de asignación.
   */
  loadAsignacionData(): void {
    const { disponible: DISPONIBLE, expendido: EXPENDIDO, autorizado: AUTORIZADO, funcionZootecnica: FUNCION_ZOOTECNICA, especie: ESPECIE } = this.solicitudState;

    this.formasignacion.patchValue({
      disponible: DISPONIBLE ?? '',
      expendido: EXPENDIDO ?? '',
      autorizado: AUTORIZADO ?? '',
      funcionZootecnica: FUNCION_ZOOTECNICA ?? '',
      especie: ESPECIE ?? '',
    });
  }
  /**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Método para manejar el envío del formulario.
   */
  enviarFormulario(): void {
    // eslint-disable-next-line no-empty
    if (this.formasignacion.valid) {

      // eslint-disable-next-line no-empty
    } else {

    }
  }
  /**
   * Valida los formularios y actualiza el estado de validez en la tienda.
   * @returns 
   */
  validarFormularios(): boolean {
    const SOLICITANTEFORM = this.formasignacion.valid;
    if (!SOLICITANTEFORM) {
      this.formasignacion.markAllAsTouched();
    }
    this.tramite120404Store.setFormValidity('solicitante', SOLICITANTEFORM);
    return SOLICITANTEFORM;
  }
}