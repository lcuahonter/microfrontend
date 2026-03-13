import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { DatosCertificadoComponent } from '../../components/datosCertificado/datosCertificado.component';
import { DestinatarioDeComponent } from '../../components/destinatario-de/destinatario-de.component';
import { Solocitud110201Service } from '../../services/service110201.service';
import { Tramite110201Store } from '../../state/Tramite110201.store';

/**
 * Componente que representa el primer paso de un trámite.
 * Este componente permite la interacción con el usuario para seleccionar pestañas
 * y gestionar el tipo de persona a través del componente `SolicitanteComponent`.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {

  /**
   * Índice para manejar la pestaña seleccionada.
   * Este valor determina cuál pestaña está activa en la interfaz de usuario.
   * 
   * @type {number}
   */
  indice: number = 1;

  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Observable para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Decorador `ViewChild` para acceder a la instancia del componente `SolicitanteComponent`.
   * Este componente se utiliza para gestionar información relacionada con el solicitante.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**  * Decorador `ViewChild` para acceder a la instancia del componente `DatosCertificadoComponent`.
   * Este componente se utiliza para gestionar información relacionada con los datos del certificado.
   */
  @ViewChild(DatosCertificadoComponent) datosCertificadoComponent!: DatosCertificadoComponent;

  /**  * Decorador `ViewChild` para acceder a la instancia del componente `DestinatarioDeComponent`.
   * Este componente se utiliza para gestionar información relacionada con el destinatario.
   */
  @ViewChild(DestinatarioDeComponent) destinatarioDe!: DestinatarioDeComponent;

  /**  * Decorador `ViewChild` para acceder a la instancia del componente `CertificadoOrigenComponent`. */
  @ViewChild(CertificadoOrigenComponent) certificadoOrigen!: CertificadoOrigenComponent;


  /**
  * Constructor del componente. Se inyectan servicios y queries necesarios para el flujo de datos.
  * @param consultaQuery Consulta a los datos del store.
  * @param solocitud110201Service Servicio para carga y actualización de datos del formulario.
  */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud110201Service: Solocitud110201Service,
    public tramite110201Store: Tramite110201Store,
  ) { }

  /**
  * Hook de inicialización del componente. Verifica el estado de actualización del store
  * y carga datos en caso necesario.
  */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario(this.consultaState?.id_solicitud);
            this.tramite110201Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
 * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
 * También establece la bandera de datos cargados en verdadero.
 */
  guardarDatosFormulario(id_solicitud: string): void {
    this.solocitud110201Service
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            this.esDatosRespuesta = true;
            const MAPPED_DATA = this.solocitud110201Service.reverseBuildSolicitud110201(DATOS as Record<string, unknown>);
            this.solocitud110201Service.actualizarEstadoFormulario(MAPPED_DATA);
          }
        }
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * En este método se llama al componente `SolicitanteComponent` para establecer el tipo de persona.
   */
  ngAfterViewInit(): void {
    // Llama al método para obtener el tipo de persona (en este caso, una persona moral nacional)
    if (this.solicitante) {
      setTimeout(() => {
        if (this.solicitante) {
          this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
        }
      }, 50);
    }
  }

  /**
   * Permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   * 
   * @param {number} indice El índice de la pestaña seleccionada.
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
  }

  /** Método público para validar todos los formularios del paso uno */
  public validateAll(): boolean {
    let isValid = true;
    if (this.certificadoOrigen) {
      if (!this.certificadoOrigen.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.datosCertificadoComponent) {
      if (!this.datosCertificadoComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.destinatarioDe) {
      if (!this.destinatarioDe.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }
  /**
   * Hook de destrucción del componente. Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}