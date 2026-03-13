import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudContenedoraComponent } from '../../components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud.contenedora';

import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora';

import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';

import { CertificadosLicenciasPermisosService } from '../../services/certificados-licencias-permisos.service';

import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260302Store } from '../../estados/stores/tramites260302.store';

import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import { Tramites260302Query } from '../../estados/queries/tramites260302.query';

import { TercerosRelacionadosContenedoraComponent } from '../../../260303/components/terceros-relacionados-contenedora/terceros-relacionados.contenedora';
/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDeLaSolicitudContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit {
   /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
    /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosSolicitudComponent', { static: false }) datosSolicitudComponent!: DatosDeLaSolicitudContenedoraComponent;

  /** Referencia al componente 'TercerosRelacionadosFabricanteComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosFabricanteComponent', { static: false }) tercerosRelacionadosFabricanteComponent!: TercerosRelacionadosContenedoraComponent;

  /** Referencia al componente 'PagoDerechosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('PagoDerechosComponent', { static: false }) PagoDerechosComponent!: PagoDeDerechosContenedoraComponent;
    /**
   * Objeto que almacena el estado global recuperado del servicio Shared2605Service.
   * Contiene información relevante para la validación y manejo de los formularios del paso uno.
   */
  private state: Record<string, unknown> = {};
/**
 * Indica si el componente de "Datos de la Solicitud" ha sido validado correctamente.
 * Se utiliza para verificar que toda la información general de la solicitud
 * esté completa antes de avanzar al siguiente paso del trámite.
 */
private isDatosDeLaSolicitudComponentValid: boolean = false;
  /**
   * Indicador booleano que valida el estado del componente PagoDeDerechosBancoComponent.
   * Se utiliza para determinar si la sección de pago de derechos del banco es válida.
   */
  private isPagoDeDerechosBancoComponentValid: boolean = false;
  /**
 * Indica si el componente de "Terceros" es válido.
 * Permite confirmar que los datos correspondientes a terceros 
 * (personas físicas, morales o representantes) estén correctos y completos.
 */
private isTercerosComponentValid: boolean = false;
    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta obtenido del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param certificadosLicenciasPermisosService Servicio para manejar los datos del formulario de certificados, licencias y permisos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private certificadosLicenciasPermisosService: CertificadosLicenciasPermisosService,
     private store: Tramite260302Store,
    private query: Tramites260302Query,
    private _sharedSvc: DatosSolicitudService
  ) {}

    /**
     * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Se suscribe al estado de consulta y actualiza la variable local.
     * Si el estado indica que hay una actualización, guarda los datos del formulario.
     * De lo contrario, marca que ya existen datos de respuesta.
     */
    ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
        // Actualiza el estado local con el valor obtenido del store
        this.consultaState = seccionState;
        
        // Verifica si se debe actualizar el formulario o solo mostrar los datos existentes
        if (this.consultaState && this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
        })
      )
      .subscribe();
    }


     /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
   validarPasoUno(): boolean {
    const ESTABVALIDO = this.datosSolicitudComponent?.validarContenedor() ?? false;
   
    const ESTERCEROSVALIDO =this.tercerosRelacionadosFabricanteComponent.validarContenedor() ?? false;
     
      return (
        (ESTABVALIDO && ESTERCEROSVALIDO) ? true : false
  
      );
  }

 /**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean {
    this.getAllState();
    this.isDatosDeLaSolicitudComponentValid = 
      this.query.getValue().formValidity?.formSectionValid ?? false;
    this.isTercerosComponentValid = (this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.isotrosvalid) ?? false;

    this.isPagoDeDerechosBancoComponentValid = (
      this.state['claveDeReferencia'] !== '' && 
      this.state['cadenaDependencia'] !== '' && 
      this.state['banco'] !== '' && 
      this.state['llaveDePago'] !== '' && 
      this.state['fechaPago'] !== '' && 
      this.state['importePago'] !== ''
    );

    if (!this.isPagoDeDerechosBancoComponentValid) {
      this.PagoDerechosComponent.markTouched();
    }

    return this.isDatosDeLaSolicitudComponentValid 
          && this.isTercerosComponentValid 
          && this.isPagoDeDerechosBancoComponentValid

  }
 /**
   * Obtiene el estado global desde el servicio Shared2605Service y lo asigna a la propiedad local 'state'.
   * Este método se utiliza para recuperar información relevante para la validación de los formularios del paso uno.
   */
  getAllState(): void {
    this._sharedSvc.getAllState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.state = resp;
      });
  }
  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos del formulario desde el servicio y actualiza el estado si la respuesta es válida.
   */
  guardarDatosFormulario(): void {
    this.certificadosLicenciasPermisosService
      .getFormularioData().pipe(
        takeUntil(this.destroyNotifier$) // Cancela la suscripción al destruir el componente
      )
      .subscribe((resp) => {
        if (resp) {
          // Si la respuesta existe, marca que hay datos de respuesta y actualiza el estado del formulario
          this.esDatosRespuesta = true;
          this.certificadosLicenciasPermisosService.actualizarEstadoFormulario(resp);
        }
      });
  }


}
