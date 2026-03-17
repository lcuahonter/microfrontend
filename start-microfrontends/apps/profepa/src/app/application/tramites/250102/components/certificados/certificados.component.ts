import { CERTIFICADO_MODAL_TABLA, CONFIGURACION_COLUMNA, CertificadoModal, ClavesDePermisos } from '../../models/flora-fauna.models';
import { Component, OnDestroy } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../modal/modal.component';


/**
 * @description
 * Componente para gestionar los permisos o certificados CITES o autorizaciones de vida silvestre.
 * Este componente utiliza el `TablaDinamicaComponent` para mostrar los datos en una tabla dinámica.
 *
 * @selector app-certificados
 * @standalone true
 * @imports [CommonModule, TablaDinamicaComponent, TituloComponent, ModalComponent]
 * @templateUrl ./certificados.component.html
 * @styleUrl ./certificados.component.scss
 */
@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent, ModalComponent],
  templateUrl: './certificados.component.html',
  styleUrl: './certificados.component.scss',
})
export class CertificadosComponent implements OnDestroy {
  
  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @description
   * Define el tipo de selección para la tabla dinámica.
   * Puede ser `CHECKBOX`, `RADIO`, etc.
   *
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @description
   * Configuración de las columnas de la tabla dinámica.
   * Define los nombres y campos que se mostrarán en la tabla.
   *
   * @type {ConfiguracionColumna<ClavesDePermisos>[]}
   */
  configuracionTabla: ConfiguracionColumna<ClavesDePermisos>[] = CONFIGURACION_COLUMNA;

  /**
   * @description
   * Datos que se mostrarán en la tabla dinámica.
   * Contiene los permisos o certificados que se cargarán en la tabla.
   *
   * @type {ClavesDePermisos[]}
   */
  permisosDatos: ClavesDePermisos[] = [];

  /**
   * @description
   * Indica si el modal de autorizaciones debe mostrarse o no.
   */
  showAutorizacionesModal = false;

  /**
   * @description
   * Configuración de las columnas para la tabla de certificados en el modal.
   * Solo tiene una columna llamada "Certificado".
   */
  configuracionTablaCertificados: ConfiguracionColumna<CertificadoModal>[] = CERTIFICADO_MODAL_TABLA;

  /**
   * @description
   * Datos para la tabla de certificados en el modal.
   */
  certificadosModalDatos: CertificadoModal[] = [];

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

   /**
     * Constructor.
     * @param fb Construye formularios reactivos.
     * @param tramite250102Store Almacén de estado del trámite.
     * @param tramite250102Query Consulta el estado del trámite.
     * @param destinatarioService Obtiene datos de países y entidades.
     * @param consultaioQuery Consulta el estado del usuario.
     */
    constructor(
      public consultaioQuery: ConsultaioQuery,
    ) {
      this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroy$),
          map((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;
          })
        )
        .subscribe();
    }
  

  /**
   * @method cambiarCertificadosAutorizaciones
   * @description
   * Alterna la visibilidad de la tabla principal y el modal de autorizaciones.
   */
  cambiarCertificadosAutorizaciones(): void {
    this.showAutorizacionesModal = !this.showAutorizacionesModal;
  }

  /**
   * @method agregarCertificadosSeleccionados
   * @description
   * Agrega los certificados seleccionados a la tabla principal y cierra el modal.
   */
  agregarCertificadosSeleccionados(): void {
    this.cambiarCertificadosAutorizaciones();
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
