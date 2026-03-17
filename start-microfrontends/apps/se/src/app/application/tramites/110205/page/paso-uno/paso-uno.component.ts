/**
 * @component PasoUnoComponent
 * @description Este componente es responsable de manejar el primer paso del trámite.
 * Incluye la lógica para seleccionar una pestaña y actualizar el índice.
 * 
 * @import { Component } from '@angular/core';
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110205State , Tramite110205Store } from '../../estados/tramite110205.store';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { PeruDatosCertificadoComponent } from '../../components/peru-datos-certificado/peru-datos-certificado.component';
import { PeruDestinatarioComponent } from '../../components/peru-destinatario/peru-destinatario.component';
import { PeruHistoricoProductoresComponent } from '../../components/peru-historico-productores/peru-historico-productores.component';
import {SolicitanteComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {number} indice - El índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado como notificador para destruir las suscripciones activas
   * Se utiliza junto con el operador takeUntil en las suscripciones de RxJS.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente SolicitanteComponent mediante ViewChild.
   * Se utiliza para invocar métodos o acceder a propiedades del componente hijo.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * @property {CertificadoOrigenComponent} certificadoOrigen
   * @description
   * Referencia al componente hijo `CertificadoOrigenComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de certificado de origen desde el componente padre.
   */
  @ViewChild('certificadoOrigen') certificadoOrigen!: CertificadoOrigenComponent;

  /**
   * @property {PeruDestinatarioComponent} peruDestinatarioComponent
   * @description Referencia al componente hijo `PeruDestinatarioComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del destinatario desde el componente padre.
   */
  @ViewChild(PeruDestinatarioComponent) peruDestinatarioComponent?: PeruDestinatarioComponent;

  /**
   * @property {DatosCertificadoComponent} datosCertificado
   * @description
   * Referencia al componente hijo `DatosCertificadoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos del certificado desde el componente padre.
   */
  @ViewChild('datosCertificado') datosCertificado!: PeruDatosCertificadoComponent;

  /**
   * Referencia al componente `PeruHistoricoProductoresComponent` dentro de la plantilla.
   * 
   * Permite acceder a las propiedades y métodos públicos del componente hijo `PeruHistoricoProductoresComponent`
   * desde el componente padre, facilitando la interacción y manipulación de su estado o comportamiento.
   * 
   * @see PeruHistoricoProductoresComponent
   */
  @ViewChild('peruHistoricoProductores') peruHistoricoProductores!: PeruHistoricoProductoresComponent;

  /**
   * @constructor
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado del trámite.
   * @param {PeruCertificadoService} peruCertificadoService - Servicio para gestionar los datos del certificado de Perú.
   * Inicializa las dependencias necesarias para el componente.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public peruCertificadoService: PeruCertificadoService,
    private tramite110205Store: Tramite110205Store,
  ) {}

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y, si corresponde, carga los datos del formulario.
   * Si no se requiere actualización, habilita la visualización de los datos de respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (
      this.consultaState &&
      this.consultaState.procedureId === '110205' &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario(this.consultaState?.id_solicitud);
      this.tramite110205Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Delegates validation to PeruDestinatarioComponent
   */
  public validateAllForms(): boolean {
    return this.peruDestinatarioComponent?.validateAllForms() ?? true;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.peruCertificadoService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          if (resp?.datos) {
            const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
            if (DATOS) {
              const MAPPED_DATA = this.peruCertificadoService.reverseBuildSolicitud110201(DATOS as Record<string, unknown>) as unknown as Tramite110205State;
              this.peruCertificadoService.actualizarEstadoFormulario(MAPPED_DATA);
            }
          this.esDatosRespuesta = true;
        }
      }
      });
  }

  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña y actualiza el índice.
   * @param {number} i - El índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios del paso uno: solicitante, certificado de origen y datos del certificado.
   * Marca los controles como tocados si algún formulario es inválido para mostrar los errores de validación.
   * Retorna `true` si todos los formularios son válidos, de lo contrario retorna `false`.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.certificadoOrigen) {
      if (!this.certificadoOrigen.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.peruDestinatarioComponent) {
      if (!this.peruDestinatarioComponent.validateAllForms()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosCertificado) {
      if (!this.datosCertificado.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Utiliza el Subject `destroyNotifier$` para notificar la destrucción y completar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}