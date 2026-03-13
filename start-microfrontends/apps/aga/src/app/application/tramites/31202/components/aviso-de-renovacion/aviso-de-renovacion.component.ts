import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Catalogo, CatalogoSelectComponent, InputCheckComponent, InputFecha, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState, InputFechaComponent } from '@ng-mf/data-access-user';

import {AvisoValor, FECHA_DE_PAGO } from '../../models/aviso.model';

import { AvisoUnicoService } from '../../services/aviso-unico.service';

import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { PreOperativo } from '../../models/aviso.model';

import { UnicoState } from '../../estados/renovacion.store';
import { UnicoStore } from '../../estados/renovacion.store';

import { UnicoQuery } from '../../estados/queries/unico.query';

/**
 * Componente que representa el aviso de renovación.
 * Este componente es responsable de inicializar el formulario, cargar datos desde servicios y manejar el estado de la aplicación.
 */
@Component({
  selector: 'app-aviso-de-renovacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputFechaComponent, CatalogoSelectComponent, InputRadioComponent,InputCheckComponent],
  templateUrl: './aviso-de-renovacion.component.html',
  styleUrls: ['./aviso-de-renovacion.component.scss'],
})
export class AvisoDeRenovacionComponent implements OnInit, OnDestroy {
  /**
   * Fecha inicial para el campo de fecha.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Lista de localidades obtenidas desde el servicio.
   */
  public localidadList!: Catalogo[];

  /**
   * Observable para manejar la destrucción del componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Opciones de tipo de persona obtenidas desde el servicio.
   */
  tipoPersonaOptions: PreOperativo[] = [];

  /**
   * Formulario reactivo para el aviso de renovación.
   */
  avisoForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: UnicoState;

  /**
   * Representa el valor seleccionado por el usuario.
   * 
   * @type {string}
   */
  valorSeleccionado!: string;

    /**
   * Estado actual de la consulta obtenido desde el servicio.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  soloLectura: boolean = false;


  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param service Servicio para obtener datos relacionados con el aviso único.
   * @param unicoStore Almacén para manejar el estado de la aplicación.
   * @param unicoQuery Consultas para obtener el estado actual de la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private service: AvisoUnicoService,
    private unicoStore: UnicoStore,
    private unicoQuery: UnicoQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Inicializa el formulario reactivo y el estado de la solicitud.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga datos iniciales y suscribe al estado de la aplicación.
   */
  ngOnInit(): void {
    this.unicoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.initializeForm();
    this.loadLocalidad();
    this.loadAsignacionData();
    this.cargarRadio();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados.
   */
  private initializeForm(): void {
    this.avisoForm = this.fb.group({
      mapTipoTramite: [this.solicitudState?.mapTipoTramite],
      mapDeclaracionSolicitud: [this.solicitudState?.mapDeclaracionSolicitud],
      envioAviso: [this.solicitudState?.envioAviso],
      numeroAviso: [this.solicitudState?.numeroAviso],
      claveReferencia: [{ value: '', disabled: true }],
      numeroOperacion: [
              this.solicitudState?.numeroOperacion,
              [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
            ],
            cadenaDependencia: [{ value: '', disabled: true }],
            banco: [this.solicitudState?.banco],
            llavePago: [
              this.solicitudState?.llavePago,
              [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
            ],
      fechaPago: [this.solicitudState?.fechaPago],
      importePago: [{ value: '', disabled: true }],
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Carga datos de asignación desde el servicio y actualiza el formulario.
   */
  loadAsignacionData(): void {
    this.service.getSolicitante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: AvisoValor) => {
        this.avisoForm.patchValue({
            claveReferencia: data.claveReferencia,
            cadenaDependencia: data.cadenaDependencia,
            importePago: data.importePago,
          });
        
      });
  }

  /**
   * Carga la lista de localidades desde el servicio.
   */
  loadLocalidad(): void {
    this.service.obtenerDatosLocalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.localidadList = data as Catalogo[];
      });
  }

  /**
   * Carga las opciones de tipo de persona desde el servicio.
   */
  cargarRadio(): void {
    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }

  /**
   * Maneja el cambio de valor en el campo de fecha.
   * @param nuevo_valor Nuevo valor de la fecha.
   */
  public onFechaCambiada(nuevo_valor: string): void {
    this.avisoForm.get('fechaPago')?.setValue(nuevo_valor);
    this.avisoForm.get('fechaPago')?.markAsUntouched();
    this.unicoStore.setfechaPago(nuevo_valor);
  }

  /**
   * Resetea los datos relacionados con el pago en el formulario.
   */
  resetPagoDatos(): void {
    this.avisoForm.patchValue({
      numeroOperacion: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
    });
  }

  /**
   * Establece valores en el almacén desde el formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof UnicoStore): void {
    const VALOR = form.get(campo)?.value;
    (this.unicoStore[metodoNombre] as (value: string) => void)(VALOR);
  }
 
  /**
   * Método que se ejecuta al destruir el componente.
   * Libera recursos y cancela suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

    /**
   * Cambia el valor seleccionado del radio
   * @param value Valor seleccionado
   */
  cambiarRadio(value: string | number): void {
    this.valorSeleccionado = value as string;
    this.unicoStore.setValorSeleccionado(this.valorSeleccionado);
  }

    /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * @private
   */
  private inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.avisoForm?.disable();
    } else {
      this.avisoForm?.enable();
    }
  }

  /**
  * Verifica si un control del formulario es inválido, tocado o modificado.
  * @param nombreControl - Nombre del control a verificar.
  * @returns True si el control es inválido, de lo contrario false.
  */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.avisoForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
 * Maneja el evento blur (pérdida de foco) en los campos del formulario
 * para activar la validación visual.
 *
 * @param fieldName - Nombre del campo que perdió el foco.
 */
  public onFieldBlur(fieldName: string): void {
    const CONTROL = this.avisoForm.get(fieldName);
    if (CONTROL) {
      CONTROL.markAsTouched();
      CONTROL.markAsDirty();
    }
  }
}
