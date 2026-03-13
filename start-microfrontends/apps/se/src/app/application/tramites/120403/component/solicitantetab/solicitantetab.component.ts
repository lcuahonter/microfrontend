/**
 * @fileoverview Componente para la gestión del formulario de solicitante.
 * Este componente maneja la lógica y la presentación del formulario de solicitante,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module SolicitantetabComponent
 */
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFechaComponent,ListaPasosWizard, PASOS, TituloComponent, ValidacionesFormularioService, WizardComponent } from '@ng-mf/data-access-user';
import { Tramite120403State,Tramite120403Store } from '../../estados/store/tramite120403.store';
import { AsignacionRootResponse } from '../../models/expedicion-certificados-frontera.models';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FECHA_FIN } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { SolicitanteasigncionserviceService } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';
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
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputFechaComponent],
  templateUrl: './solicitantetab.component.html',
  styleUrls: ['./solicitantetab.component.scss'],
  providers: [DatePipe]
})
export class SolicitantetabComponent implements OnInit, OnDestroy, OnChanges {
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
   * Valor seleccionado del grupo de botones de opción (radio) para la asignación.
   * 
   * Este valor se recibe como entrada desde el componente padre y determina la opción seleccionada
   * en el grupo de radio correspondiente a la asignación.
   */
  @Input() asignacionRadioValue!: string;

  /**
   * Recibe los datos de asignación del solicitante.
   * 
   * @remarks
   * Este input espera un objeto de tipo `AsignacionRootResponse` que contiene
   * la información relevante para la pestaña de solicitante en el trámite.
   * 
   * @see AsignacionRootResponse
   */
  private _formaDatos!: AsignacionRootResponse;

  @Input()
  set formaDatos(value: AsignacionRootResponse) {
    if(value) {
    this._formaDatos = value as AsignacionRootResponse;
    const ESPECIS = this.datePipe.transform(value.asignacionResponse.fechaFinVigenciaAprobada, 'dd/MM/yyyy');
    const FUNCION_ZOO = this.datePipe.transform(value.asignacionResponse.fechaInicioVigencia, 'dd/MM/yyyy');
    this.formasignacion.patchValue({
          especie: ESPECIS,
          funcionZootecnica: FUNCION_ZOO,
          autorizado: value.asignacionResponse?.impTotalExpedido,
          expendido: value.asignacionResponse?.montoExpedido,
          disponible: value.asignacionResponse?.montoDisponible,
        });
      } 
    // Puedes agregar aquí lógica adicional si necesitas reaccionar al cambio de formaDatos
  }
  get formaDatos(): AsignacionRootResponse {
    return this._formaDatos;
  }


  /**
   * Configuración de la fecha de fin.
   */
  fechaFinInput = FECHA_FIN;

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
 * Este estado se obtiene del store `Tramite120403Query`.
 */
  public solicitudState!: Tramite120403State;
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
    private tramite120403Store: Tramite120403Store,
    private tramite120403Query: Tramite120403Query,
   private datePipe: DatePipe
  ) { }

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
   * Identificador del trámite actual.
   * 
   * Esta propiedad almacena el código único que representa el trámite en curso.
   * En este caso, el valor predeterminado es "120403".
   */
  tramites:string="120403";

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
    if (this.isContinuarTriggered) {
      this.validarFormularios();
    }
  }

  
  ngOnChanges(): void {
    this.obtenerEstadoSolicitud();
  }

 /**
 * @method obtenerEstadoSolicitud
 * @description
 * Método que obtiene el estado actual de la solicitud almacenado en la tienda `Tramite120403Query`.
 * Se suscribe al observable `selectTramite120403$` para recibir actualizaciones en tiempo real.
 * La suscripción se gestiona con `takeUntil(this.destroyed$)` para evitar fugas de memoria.
 *
 * @returns {void}
 * No retorna ningún valor, pero actualiza la variable `solicitudState` con los datos obtenidos.
 */
   obtenerEstadoSolicitud(): void {
    this.tramite120403Query.selectTramite120403$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite120403State) => {
        this.solicitudState = data;
      });
  }

  /**
   * Inicializa el formulario de asignación.
   */
  initForm(): void { 
    this.tramite120403Query.selectTramite120403$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite120403State) => { 
        this.solicitudState = data;
      });
     
    this.formasignacion = this.fb.group({
      especie: [{ value: '', disabled: true }],
      funcionZootecnica: [{ value: '', disabled: true }],
      autorizado: [{ value: '', disabled: true }],
      expendido: [{ value: '', disabled: true }],
      disponible: [{ value: '', disabled: true }],
      ampliar:['',[Validators.required] ],
      fechaFin: [{ value: this.solicitudState?.fechaFin, }, [Validators.required]],
    });
    
    
  }



/**
     * Actualiza el valor de la fecha de fin en el formulario y en el estado global.
     * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
     */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.formasignacion.patchValue({
      fechaFin: nuevo_fechaPago,
    });
    this.setValoresStore(this.formasignacion, 'fechaFin',);
  }


  /**
  * Obtiene el valor de un control en el formulario y lo pasa a un método del store para actualizar el estado.
  */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite120403Store.establecerDatos({ [campo]: VALOR });
    const CONTROL = form.get(campo);
    if (CONTROL) {
      CONTROL.updateValueAndValidity();
    }
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
    this.tramite120403Store.setFormValidity('solicitante', SOLICITANTEFORM);
    return SOLICITANTEFORM;
  }
}