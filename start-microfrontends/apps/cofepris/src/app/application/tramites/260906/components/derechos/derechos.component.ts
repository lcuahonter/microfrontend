import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { InputFecha, InputFechaComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FECHA_DE_PAGO } from '../../models/solicitud-datos.model';
import { IMPORTE } from '@libs/shared/data-access-user/src';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { SanitarioService } from '../../services/sanitario.service';
import { Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente que gestiona la sección de derechos en el trámite 260906.
 * Permite la visualización y edición de los datos relacionados con los derechos.
 */
@Component({
  selector: 'app-derechos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputFechaComponent
  ],
  templateUrl: './derechos.component.html',
  styleUrls: ['./derechos.component.css'],
})
export class DerechosComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para gestionar los datos de derechos */
  derechosForm!: FormGroup;

  /** Notificador para gestionar la destrucción de suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Lista de derechos obtenida desde el servicio */
  public derechosList!: Catalogo[];

  /** Estado actual de la solicitud */
  public solicitudState!: Solicitud260906State;

  /** Configuración inicial para el componente de fecha */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;
  
  /** Estado actual de la consulta */
  consultaDatos!: ConsultaioState;
  
  /** Indica si el formulario está en modo solo lectura */
  soloLectura: boolean = false;

  /**
   * Constructor del componente
   * 
   * @param fb Constructor de formularios reactivos
   * @param service Servicio para obtener datos de derechos
   * @param sanitario260906Store Almacén de estado para el trámite
   * @param permiso260906Query Consulta para obtener el estado de la solicitud
   * @param consultaioQuery Consulta para obtener el estado de la consulta
   */
  constructor(
    private fb: FormBuilder,
    private service: SanitarioService,
    private sanitario260906Store: Sanitario260906Store,
    private permiso260906Query: Permiso260906Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Inicialización adicional si es necesario
  }

  /**
   * Método de inicialización del componente
   * Configura el formulario, suscripciones y carga datos iniciales
   */
  ngOnInit(): void {
    this.permiso260906Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.inicializarFormulario();
    this.cargarUnidadesMedida();
    
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
   * Inicializa el formulario con valores por defecto
   * @private
   */
  private inicializarFormulario(): void {
    this.derechosForm = this.fb.group({
      referencia: [
        this.solicitudState?.referencia,
        [ Validators.minLength(10), Validators.maxLength(30) ],
      ],
      cadenaDependencia: [this.solicitudState?.cadenaDependencia,
        [ Validators.minLength(10), Validators.maxLength(50) ]
      ],
      llave: [this.solicitudState?.llave],
      banco: [this.solicitudState?.banco],
      tipoFetch: [this.solicitudState?.tipoFetch,
        [DerechosComponent.validateFechaMenorIgualHoy.bind(this)],
      ],
      importe: [this.solicitudState?.importe, [
        Validators.pattern(IMPORTE),
        Validators.maxLength(16)
      ]],
    });
  }

  /**
   * Establece valores en el store desde el formulario
   * 
   * @param form Grupo de formulario que contiene el campo
   * @param campo Nombre del campo a actualizar
   * @param metodoNombre Nombre del método en el store que actualiza el valor
   */
  setValoresStore(
    form: FormGroup, 
    campo: string, 
    metodoNombre: keyof Sanitario260906Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.sanitario260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Carga la lista de unidades de medida desde el servicio
   * @private
   */
  private cargarUnidadesMedida(): void {
    this.service.getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.derechosList = data as Catalogo[];
      });
  }

  /**
   * Maneja el cambio de fecha en el formulario
   * @param fecha Nueva fecha seleccionada
   */
  onFechaCambiada(fecha: string): void {
    this.derechosForm.patchValue({ tipoFetch: fecha });
  }

  /**
   * Método de limpieza al destruir el componente
   * Libera las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.derechosForm?.disable();
    } else {
      this.derechosForm?.enable();
    }
  }

  /**
  * Validador personalizado para verificar si la fecha es menor o igual a la fecha actual 
  */
  static validateFechaMenorIgualHoy(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let fechaSeleccionada: Date;
    if (typeof control.value === 'string' && control.value.includes('/')) {
      const PARTES = control.value.split('/');
      if (PARTES.length === 3) {
        const DIA = parseInt(PARTES[0], 10);
        const MES = parseInt(PARTES[1], 10);
        const ANIO = parseInt(PARTES[2], 10);
        fechaSeleccionada = new Date(ANIO, MES - 1, DIA);
      } else {
        fechaSeleccionada = new Date(control.value);
      }
    } else {
      fechaSeleccionada = new Date(control.value);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(fechaSeleccionada.getTime())) {
      return { fechaInvalida: true }; // Retorna error para fechas inválidas
    }
    
    const FECHA_ACTUAL = new Date();
    
    // Restablecer la hora para comparar solo las fechas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    FECHA_ACTUAL.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > FECHA_ACTUAL) {
      return { fechaInvalida: true }; // Retorna un objeto de error para fechas futuras
    }
    
    return null; // Retorna null si la fecha es válida (hoy o pasada)
  }

    /**
  * Verifica si un control del formulario es inválido, tocado o modificado.
  * @param nombreControl - Nombre del control a verificar.
  * @returns True si el control es inválido, de lo contrario false.
  */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.derechosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

    /**
   * Cambia la fecha de ingreso en el formulario.
   *
   * @param nuevo_valor - El nuevo valor de la fecha en formato de cadena.
   *
   * Este método actualiza el campo 'fechaInicialInput' del formulario con el nuevo valor proporcionado
   * y marca el campo como no modificado (untouched).
   */
  public cambioFechaIngreso(nuevo_valor: string): void {
    this.derechosForm.get('tipoFetch')?.setValue(nuevo_valor);
    this.derechosForm.get('tipoFetch')?.markAsUntouched();
    this.sanitario260906Store.settipoFetch(nuevo_valor);
  }

  /**
   * Borra todos los datos del formulario de pago
   * Limpia todos los campos del formulario y actualiza el store con valores vacíos
   */
  public borrarDatosPago(): void {
    // Resetear todos los campos del formulario
    this.derechosForm.reset();
    
    // Actualizar el store con valores vacíos
    this.sanitario260906Store.setreferencia('');
    this.sanitario260906Store.setcadenaDependencia('');
    this.sanitario260906Store.setLlave('');
    this.sanitario260906Store.setbanco('');
    this.sanitario260906Store.settipoFetch('');
    this.sanitario260906Store.setimporte('');
    
    // Marcar todos los campos como no tocados para limpiar los mensajes de error
    Object.keys(this.derechosForm.controls).forEach(key => {
      this.derechosForm.get(key)?.markAsUntouched();
      this.derechosForm.get(key)?.markAsPristine();
    });
  }
}
