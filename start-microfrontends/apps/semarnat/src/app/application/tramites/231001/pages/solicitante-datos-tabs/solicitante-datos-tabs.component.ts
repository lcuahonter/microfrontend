import { CatalogosTramite231001Service } from './../../services/catalogos-tramite-231001.service';
/**
 * Componente que representa las pestañas de detalles del solicitante.
 *
 * @selector app-solicitante-detos-tabs
 * @templateUrl ./solicitante-detos-tabs.component.html
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import {
  MateriaPrima231001,
  MercanciaDetalle231001,
} from '../../models/datos.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';
import { PantallasComponent } from '../../pages/pantallas/pantallas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite231001Store } from '../../estados/tramites/tramite231001.store';
import { ViewChild } from '@angular/core';

/**
 * Decorador que define un componente de Angular.
 *
 * @selector app-solicitante-detos-tabs - El selector CSS que identifica este componente en una plantilla.
 * @templateUrl ./solicitante-datos-tabs.component.html - La URL de la plantilla HTML del componente.
 */

@Component({
  standalone: true,
  selector: 'app-solicitante-datos-tabs',
  templateUrl: './solicitante-datos-tabs.component.html',
  imports: [
    SolicitanteComponent,
    PantallasComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SolicitanteDatosTabsComponent implements OnInit, OnDestroy {
  /**
   * RFC del solicitante.
   */
  @Input() rfc!: string;
  /**
   * Indica si el formulario es válido.
   */
  @Input() esFormValido!: boolean;

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Indica si se ha recibido una respuesta con datos.
   * Se utiliza para mostrar u ocultar información en la interfaz según el estado de la respuesta.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * Referencia al componente `solicitudComponent`.
   */
  @ViewChild('solicitudComponent', { static: false }) solicitudComponent:
    | PantallasComponent
    | undefined;

  /**

/**
 * Estado actual de la consulta, obtenido desde el store.
 * Almacena la información relevante para el paso del solicitante.
 */
  public consultaState!: ConsultaioState;
  /**
   * Constructor del componente.
   * Inyecta los servicios necesarios para la gestión de licitaciones y la consulta del estado.
   */
  /**
   * Subject utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria
   * cuando el componente se destruye.
   */
  private destroyed$ = new Subject<void>();
  constructor(
    private service: CatalogosTramite231001Service,
    private consultaQuery: ConsultaioQuery,
    private tramiteStore: Tramite231001Store
  ) {
    // constructor
  }
  /**
   * Selecciona una pestaña específica.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
   * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
   * decide si debe llamar a `guardarDatosFormulario()` para obtener y actualizar los datos,
   * o simplemente mostrar la información existente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaState.folioTramite) {
      this.guardarDatosFormulario(this.consultaState.folioTramite);
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Obtiene los datos vigentes de licitaciones mediante el servicio y actualiza el estado del formulario.
   *
   * Se suscribe al observable que retorna el servicio `getLicitationesVigentesData()`. Si la respuesta es válida,
   * actualiza la bandera `esDatosRespuesta` y llama al método del servicio para actualizar el estado del formulario.
   */
  guardarDatosFormulario(folioTramite: string): void {
    this.service
      .getDetalleSolicitud(folioTramite)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.tramiteStore.update({
            rfc_solicitante: resp.datos.rfc_solicitante,
            descripcionGenerica1: resp.datos.descripcion_generica_1,
            lectura: this.consultaState.readonly,
            aduana: resp.datos.aduana_solicitud.cve_aduana,
            numeroProgramaImmex: resp.datos.numero_programa_immex,
            numeroRegistroAmbiental: resp.datos.numero_registro_ambiental,
            mercancias: SolicitanteDatosTabsComponent.mapearMercancias(
              resp.datos.mercancias
            ),
          });
          this.tramiteStore.setIdSolicitud(resp.datos.id_solicitud);
        }
      });
  }

  static mapearMercancias(
    mercanciasDetalle: MercanciaDetalle231001[]
  ): MateriaPrima231001[] {
    const MERCANCIAS: MateriaPrima231001[] = mercanciasDetalle.map((item) => ({
      cantidadEnLetra: item.cantidad_en_letra,
      claveFraccion: item.cve_fraccion,
      clavePartida: item.cve_partida,
      claveSubPartida: '',
      capituloFraccion: item.cve_fraccion,
      descFraccion: item.desc_fraccion,
      descripcionMercancia: item.descripcion_mercancia,
      descUnidadMedida: item.desc_unidad_medida_comercial,
      generica1: item.cve_fraccion,
      generica2: item.cantidad.toString(),
      unidadMedidaComercialClave: item.cve_unidad_medida_comercial.toString(),
    }));
    return MERCANCIAS;
  }
  /**
   * Valida todos los formularios del paso uno.
   *
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   *
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
  public validarTodosLosFormularios(): boolean {
    let allFormsValid = false;

    // Validar el formulario de certificado de origen si existe y es visible
    if (this.indice >= 2 && this.solicitudComponent) {
      this.solicitudComponent?.solicitudComponent?.formularioParaRecuentoTotal.markAllAsTouched();
      this.solicitudComponent.datosComponent?.solicitudForm.markAllAsTouched();
      if (
        !this.solicitudComponent.solicitudComponent?.formularioParaRecuentoTotal
          .valid ||
        !this.solicitudComponent.datosComponent?.solicitudForm.valid
      ) {
        allFormsValid = false;
      } else {
        return true;
      }
    }
    return allFormsValid;
  }
  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Emite y completa el subject `destroyed$` para cancelar todas las suscripciones activas,
   * evitando fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
