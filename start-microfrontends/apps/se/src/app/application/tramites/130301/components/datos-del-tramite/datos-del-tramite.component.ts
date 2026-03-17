import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  OPCIONES_PRODUCTO_RADIO,
  OPCIONES_SOLICITUD_DE_RADIO,
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud130301State } from '../../../../estados/tramites/tramite130301.store';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar los datos del trámite.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
  ],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy {
  /**
   * Opciones de botón de radio para la solicitud.
   */
  radioOpcions = OPCIONES_SOLICITUD_DE_RADIO;

  /**
   * Opciones de botón de radio para el producto.
   */
  productoRadioOpcions = OPCIONES_PRODUCTO_RADIO;

  /**
   * Formulario reactivo para los datos del trámite.
   */
  datosDelTramite!: FormGroup;

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Solicitud del estado actual del trámite 130301.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramiteQuery Query para obtener el estado del trámite 130301.
   */
  constructor(
    private fb: FormBuilder,
    private tramiteQuery: Tramite130301Query
  ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.crearFormulario();
  }

  /**
   * Crea y configura un formulario reactivo para gestionar los datos del trámite con campos deshabilitados.
   */
  crearFormulario(): void {
    this.datosDelTramite = this.fb.group({
      numeroFolioTramiteOriginal: [
        {
          value: this.solicitudState?.numeroFolioTramiteOriginal,
          disabled: true,
        },
      ],
      solicitudOpcion: [
        { value: this.solicitudState?.solicitudOpcion, disabled: true },
      ],
      regimen: [{ value: this.solicitudState?.regimen, disabled: true }],
      clasificacionDelRegimen: [
        { value: this.solicitudState?.clasificacionDelRegimen, disabled: true },
      ],
      productoOpcion: [
        { value: this.solicitudState?.productoOpcion, disabled: true },
      ],
      descripcionMercancia: [
        { value: this.solicitudState?.descripcionMercancia, disabled: true },
      ],
      fraccionArancelaria: [
        { value: this.solicitudState?.fraccionArancelaria, disabled: true },
      ],
      umt: [{ value: this.solicitudState?.umt, disabled: true }],
      cantidad: [{ value: this.solicitudState?.cantidad, disabled: true }],
      valorFactura: [
        { value: this.solicitudState?.valorFactura, disabled: true },
      ],
    });
  }

  /**
   * Obtiene los datos del formulario desde el servicio.
   */
  obtenerFormDatos(): void {
    this.datosDelTramite.patchValue({
      numeroFolioTramiteOriginal: this.solicitudState?.numeroFolioTramiteOriginal,
      solicitudOpcion: this.solicitudState?.solicitudOpcion,
      regimen: this.solicitudState?.regimen,
      clasificacionDelRegimen: this.solicitudState?.clasificacionDelRegimen,
      productoOpcion: this.solicitudState?.productoOpcion,
      descripcionMercancia: this.solicitudState?.descripcionMercancia,
      fraccionArancelaria: this.solicitudState?.fraccionArancelaria,
      umt: this.solicitudState?.umt,
      cantidad: this.solicitudState?.cantidad,
      valorFactura: this.solicitudState?.valorFactura,
    });    
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos y destruye los observables activos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores de validación.
   */
  public markAllAsTouched(): void {
    if (this.datosDelTramite) {
      this.datosDelTramite.markAllAsTouched();
    }
  }
}
