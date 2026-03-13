import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Catalogo, CatalogoSelectComponent, InputCheckComponent, InputFecha, InputFechaComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';

import {AvisoValor, FECHA_DE_PAGO } from '../../models/aviso.model';

import { AvisoUnicoService } from '../../services/aviso-unico.service';

import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { PreOperativo } from '../../models/aviso.model';

import { UnicoState } from '../../estados/renovacion.store';
import { UnicoStore } from '../../estados/renovacion.store';

import { UnicoQuery } from '../../estados/queries/unico.query';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * Componente que representa el aviso de renovación.
 * Este componente es responsable de inicializar el formulario, cargar datos desde servicios y manejar el estado de la aplicación.
 */
@Component({
  selector: 'app-aviso-de-renovacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputFechaComponent, CatalogoSelectComponent, InputRadioComponent, InputCheckComponent],
  templateUrl: './aviso-de-renovacion.component.html',
  styleUrls: ['./aviso-de-renovacion.component.scss'],
})
export class AvisoDeRenovacionComponent implements OnInit, OnDestroy {
  /**
   * {string} defaultSelect - Valor predeterminado seleccionado en el menú desplegable.
   *  Esta propiedad almacena la opción seleccionada por defecto, que en este caso es 'Rubro A'.
   */
  defaultSelect: string = 'Rubro A';
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = true;
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
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.actualizarEstado();
  }

  /**
  * @method actualizarEstado
  * @description
  * Inicializa y actualiza el estado del formulario de aviso de renovación.
  * Obtiene el estado actual de la solicitud, configura el formulario reactivo con los valores correspondientes,
  * y realiza peticiones para obtener datos adicionales como el solicitante, la localidad y las opciones de tipo de persona.
  * Además, determina si el formulario debe estar en modo solo lectura según el estado de consulta.
  *
  * @memberof AvisoDeRenovacionComponent
  * @returns {void}
  */
  actualizarEstado(): void {
    this.unicoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.avisoForm = this.fb.group({
      mapTipoTramite: [this.solicitudState?.mapTipoTramite],
      mapDeclaracionSolicitud: [this.solicitudState?.mapDeclaracionSolicitud],
      envioAviso: [this.solicitudState?.envioAviso],
      numeroAviso: [this.solicitudState?.numeroAviso],
      claveReferencia: [{ value: '', disabled: true }],
      numeroOperacion: [this.solicitudState?.numeroOperacion],
      cadenaDependencia: [{ value: '', disabled: true }],
      banco: [this.solicitudState?.banco],
      llavePago: [this.solicitudState?.llavePago],
      fechaPago: [this.solicitudState?.fechaPago],
      importePago: [{ value: '', disabled: true }],
    });
    this.service.getSolicitante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: AvisoValor) => {
        this.avisoForm.patchValue({
          claveReferencia: data.claveReferencia,
          cadenaDependencia: data.cadenaDependencia,
          importePago: data.importePago,
        });

      });

    this.service.obtenerDatosLocalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.localidadList = data as Catalogo[];
      });

    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });

    if (this.esFormularioSoloLectura) {
      this.avisoForm.disable();
    } else {
      this.avisoForm.enable();
    }

  }
/**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.avisoForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.avisoForm, 'fechaPago', 'setfechaPago');
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
}
