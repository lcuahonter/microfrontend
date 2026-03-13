import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatosTramiteService } from '../../services/datos-tramite.service';

import { Tramite40402Store, Tramitenacionales40402State } from '../../estados/tramite40402.store';
import { map, takeUntil } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { Tramite40402Query } from '../../estados/tramite40402.query';
import { Tramite40402Service } from '../../estados/tramite40402.service';

/**
 * Componente para la gestión de datos del trámite
 * 
 * @remarks
 * Este componente maneja la captura y visualización de información relacionada con trámites de transporte aéreo
 */
@Component({
  selector: 'app-datos-tramite',
  templateUrl: './datos-tramite.component.html',
  styleUrls: ['./datos-tramite.component.scss'],
})
export class DatosTramiteComponent implements OnInit, OnDestroy {
  /**
   * Método público para marcar todos los controles como tocados (para que los padres llamen antes de la validación)
   */
  public marcarTodoComoTocado(): void {
    if (this.formulario) {
      Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  /**
   * Valida el formulario y retorna si es válido
   */
  public validarFormularios(): boolean {
    if (!this.formulario) { 
      return false; 
    }
    Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    const CAMPOS_REQUIRED = ['tipoDeCaatAerea', 'ideCodTransportacionAerea', 'codIataIcao'];
    for (const FIELD of CAMPOS_REQUIRED) {
      const CONTROL = this.formulario.get(FIELD);
      if (!CONTROL || CONTROL.invalid || CONTROL.value === null || CONTROL.value === undefined || CONTROL.value === '') {
        return false;
      }
    }
    const VALID = this.formulario.valid;
    return VALID;
  }
  /**
   * Verifica si al menos un campo del formulario está lleno
   * @returns true si algún campo tiene valor, false si todos están vacíos
   */
  hayCamposLlenos(): boolean {
    if (!this.formulario) {
      return false;
    }
    const CAMPOS = ['tipoDeCaatAerea', 'ideCodTransportacionAerea', 'codIataIcao'];
    return CAMPOS.some(campo => {
      const VALOR = this.formulario.get(campo)?.value;
      return VALOR !== null && VALOR !== undefined && VALOR !== '';
    });
  }
  /**
   * Resetea el formulario a su estado inicial
   */
  limpiarFormulario(): void {
    this.formulario.reset();
    this.formulario.get('codIataIcao')?.markAsTouched();
  }

  /**
   * Constructor del componente DatosTramiteComponent.
   * Inicializa las dependencias necesarias para la gestión y validación de los datos del trámite.
   *
   * @param datosTramiteService Servicio compartido para la gestión del formulario de datos del trámite.
   * @param fb Constructor de formularios reactivos.
   * @param tramite40402Service Servicio para operaciones específicas del trámite 40402.
   * @param consultaioQuery Consulta de estado global del trámite.
   * @param tramite40402Query Consulta de estado específico del trámite 40402.
   * @param store Almacenamiento y gestión de estado del trámite.
   * @param cdr ChangeDetectorRef para la detección y actualización de cambios en la vista.
   */
  constructor(
    private datosTramiteService: DatosTramiteService,
    private fb: FormBuilder,
    private tramite40402Service: Tramite40402Service,
    private consultaioQuery: ConsultaioQuery,
    private tramite40402Query: Tramite40402Query,
    private store: Tramite40402Store,
    private cdr: ChangeDetectorRef
  ) {}

  get formulario(): FormGroup {
    return this.datosTramiteService.formulario;
  }
  
  /**
   * Lista de códigos de transportación
   */
  codigoTransportacion: unknown[] = [];
  
  /**
   * Lista de tipos de CAAT aéreo
   */
  tipoCaatAereo: unknown[] = [];
  
  /**
   * Catálogo de tipos de CAAT aéreo
   */
  public tipoDeCaatAerea!: Catalogo[];
  
  /**
   * Catálogo de códigos de transportación aérea
   */
  public ideCodTransportacionAerea!: Catalogo[];
  
  /**
   * Datos de consulta del trámite desde estado global
   */
  consultaDatos!: ConsultaioState;
  
  /**
   * Indica si se deben mostrar datos de respuesta directamente
   */
  public esDatosRespuesta: boolean = false;
  
  /**
   * Notificador para desuscripciones
   */
  private destroyNotifier$ = new Subject<void>();
  
  /**
   * Estado de transportación marítima
   */
  public transportacionMaritimaState!: Tramitenacionales40402State;
  
  /**
   * Indica si el formulario es de solo lectura
   */
  soloLectura: boolean = false;

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    this.tramite40402Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.inicializarFormulario();
          this.cargarCodigoTransportacion();
          this.cargarTipoCaatAereo();
          this.tipoDeCaatAereaData();
          this.ideCodTransportacionAereaData();
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
  }

  /**
   * Inicializa el formulario reactivo
   */
  private inicializarFormulario(): void {
  this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene solicitudes CAAT como FormArray
   * 
   * @returns FormArray de solicitudes CAAT
   */
  get caatSolicitudes(): FormArray {
    return this.formulario.get('solicitud.caatSolicitudes') as FormArray;
  }

  /**
   * Carga códigos de transportación desde servicio
   */
  public cargarCodigoTransportacion(): void {
    this.tramite40402Service
      .geTideCodTransportacionAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.codigoTransportacion = datos;
      });
  }

  /**
   * Carga tipos de CAAT aéreo desde servicio
   */
  public cargarTipoCaatAereo(): void {
    this.tramite40402Service
      .getTipoDeCaatAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.tipoCaatAereo = datos;
      });
  }

  /**
   * Marca todos los controles de un formGroup como touched
   * 
   * @param formGroup - Grupo de formulario a marcar
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  /**
   * Carga datos de catálogo tipo CAAT aéreo
   */
  tipoDeCaatAereaData(): void {
    this.tramite40402Service
      .getTipoDeCaatAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tipoDeCaatAerea = data;
      });
  }

  /**
   * Carga datos de catálogo códigos transportación aérea
   */
  ideCodTransportacionAereaData(): void {
    this.tramite40402Service
      .geTideCodTransportacionAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.ideCodTransportacionAerea = data;
      });
  }

  /**
   * Establece valores en el store
   * 
   * @param form - Formulario origen
   * @param campo - Nombre del campo
   * @param metodoNombre - Método del store a invocar
   * @param valor - Valor a establecer
   * @remarks Convierte a mayúsculas el valor si el campo es 'codIataIcao'
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite40402Store): void {
    let valor = form.get(campo)?.value;
    if (campo === 'codIataIcao' && typeof valor === 'string') {
      valor = valor.toUpperCase();
      form.get(campo)?.setValue(valor, { emitEvent: false });
    }
    (this.store[metodoNombre] as (value: unknown) => void)(valor);
  }

  /**
   * Inicializa estado de habilitación del formulario
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.formulario?.disable();
    } else {
      this.formulario?.enable();
    }
  }

  /**
   * Este método se utiliza para mostrar los errores del formulario.
   * Marca todos los controles del formulario como tocados para que se muestren los errores de validación.
   * 
   * @returns {void}
   */
  public mostrarErrores(): void {
    this.cdr.detectChanges();
  }
  /**
   * Destrucción del componente
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}