import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Subject,map,takeUntil } from 'rxjs';
import { Tramite110212State,Tramite110212Store } from '../../../../estados/tramites/tramite110212.store';
import { CertificadoOrigenComponent } from "../../../110212/components/certificado-origen/certificado-origen.component";
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatarioTramiteComponent } from '../../components/destinatario/destinatario.component';
import { Tramite110212Query } from '../../../../estados/queries/tramite110212.query';
import { ValidacionPosterioriService } from '../../service/validacion-posteriori.service';

/**
 * Componente para gestionar el paso uno del trámite.
 *
 * Este componente permite al usuario navegar entre diferentes pestañas y gestionar
 * las secciones relacionadas con el trámite, como solicitante, destinatario, histórico
 * de productores y datos del certificado.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, DestinatarioTramiteComponent, DatosCertificadoComponent, CertificadoOrigenComponent]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente `SolicitanteComponent`.
   *
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * de solicitante dentro de la plantilla.
   */
  @ViewChild('solicitante') solicitante!: SolicitanteComponent;

    /**
   * @property {CertificadoOrigenComponent} certificadoOrigen
   * @description
   * Referencia al componente hijo `CertificadoOrigenComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de certificado de origen desde el componente padre.
   */
  @ViewChild('CertificadoOrigen') certificadoOrigen!: CertificadoOrigenComponent;

   /**
   * Referencia al componente `DestinatarioComponent`.
   */
  @ViewChild('destinatarioComp', { static: false }) destinatarioComp: DestinatarioTramiteComponent | undefined;

  /**
   * Referencia al componente `DatosCertificadoComponent`.
   */
  @ViewChild('datosCertificadoComp', { static: false }) datosCertificadoComp:
    | DatosCertificadoComponent
    | undefined;

  /**
   * Emite evento cuando se cambia de tab para ocultar error message.
   */
  @Output() cambioDePestana = new EventEmitter<void>();

  /**
   * Índice de la pestaña activa.
   *
   * Esta propiedad indica cuál pestaña está activa actualmente.
   */
  indice: number = 1;

  /**
   * Estado actual del trámite.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite110212State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  @ViewChild(DestinatarioTramiteComponent) destinatarioTramiteComponent?: DestinatarioTramiteComponent;

  /**
   * Constructor del componente.
   *
   * @param {Tramite110212Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110212Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la consulta.
   * @param {ValidacionPosterioriService} validacionPosterioriService - Servicio para la validación a posteriori.
   */
  constructor(
    public store: Tramite110212Store,
    public tramiteQuery: Tramite110212Query,
    private consultaioQuery: ConsultaioQuery,
    private validacionPosterioriService: ValidacionPosterioriService
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite y establece la pestaña activa
   * según el estado almacenado.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
     if (this.consultaDatos.update) {
            this.guardarDatosFormulario(this.consultaDatos?.id_solicitud);
            this.store.setIdSolicitud(Number(this.consultaDatos?.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
  }


    /**
 * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
 * También establece la bandera de datos cargados en verdadero.
 */
  guardarDatosFormulario(id_solicitud: string): void {
    this.validacionPosterioriService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            this.esDatosRespuesta = true;
            const MAPPED_DATA = this.validacionPosterioriService.reverseBuildSolicitud110212(DATOS as Record<string, unknown>);
            this.validacionPosterioriService.actualizarEstadoFormulario(MAPPED_DATA as unknown as Tramite110212State);
          }
        }
      });
  }
  
  /**
   * Delegates validation to PeruDestinatarioComponent
   */
  public validateAllForms(): boolean {
    return this.destinatarioTramiteComponent?.validateAllForms() ?? true;
  }
  /**
   * Método para seleccionar una pestaña específica.
   *
   * Este método actualiza el índice de la pestaña activa y almacena el valor
   * en el store.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
    // Ocultar mensaje de error al cambiar de pestaña
    this.cambioDePestana.emit();
  }
  /**
   * @method fetchGetDatosConsulta
   * @description Obtiene los datos de consulta desde el servicio `ValidacionPosterioriService` y actualiza el estado del trámite.
   *
   * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
   * Utiliza el operador `takeUntil` para cancelar las suscripciones cuando el componente se destruye, evitando fugas de memoria.
   *
   * @returns {void}
   */
  public fetchGetDatosConsulta(): void {
    this.validacionPosterioriService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.store.setTercerOperador(respuesta.datos.tercerOperador);
          this.store.setGrupoOperador(respuesta.datos.grupoOperador);
          this.store.setGrupoTratado(respuesta.datos.grupoTratado);
          this.store.setMercanciaDisponsiblesTablaDatos(
            respuesta.datos.mercanciaDisponsiblesTablaDatos
          );
          this.store.setObservaciones(respuesta.datos.observaciones);
          this.store.setIdioma(respuesta.datos.idioma);
          this.store.setEntidadFederativa(respuesta.datos.entidadFederativa);
          this.store.setRepresentacionFederal(
            respuesta.datos.representacionFederal
          );
          this.store.setGrupoReceptor(respuesta.datos.grupoReceptor);
          this.store.setGrupoDeDirecciones(respuesta.datos.grupoDeDirecciones);
          this.store.setGrupoRepresentativo(
            respuesta.datos.grupoRepresentativo
          );
        }
      });
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
    let allFormsValid = true;
    if (
      this.indice >= 3 &&
      this.destinatarioComp &&
      this.destinatarioComp.registroFormulario
    ) {
      this.destinatarioComp.registroFormulario.markAllAsTouched();
      if (!this.destinatarioComp.registroFormulario.valid) {
        allFormsValid = false;
      }
    }

    // Validar el formulario de datos del certificado si existe y es visible
    if (
      this.indice >= 4 &&
      this.datosCertificadoComp &&
      this.datosCertificadoComp.formDatosCertificado
    ) {
      this.datosCertificadoComp.formDatosCertificado.markAllAsTouched();
      if (!this.datosCertificadoComp.formDatosCertificado.valid) {
        allFormsValid = false;
      }
    }

    return allFormsValid;
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

    if (this.destinatarioComp) {
      if (!this.destinatarioComp.validateAllForms()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosCertificadoComp) {
      if (!this.datosCertificadoComp.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
