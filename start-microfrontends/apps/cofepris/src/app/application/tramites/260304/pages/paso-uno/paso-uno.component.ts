import { Component, Input, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadosLicenciasPermisosService } from '../../../../shared/services/shared2603/certificados-licencias-permisos.service';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudContenedoraComponent } from '../../components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud.contenedora';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados.contenedora';
import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import {mapBackendToSolicitud2603,mapPago} from '../../adapters/guardar-payload.adapter';
import {Tramite2603Store } from '../../../../shared/estados/stores/2603/tramite2603.store';
import { Tramite260304Store } from '../../estados/stores/tramite260304.store';
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

    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description Estado actual de la consulta para el componente 260304.
   */
  @Input() public consultaState!: ConsultaioState;

  private idProcediemento: number = 260304;

  private idSolicitud: number = 203011048;

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param certificadosLicenciasPermisosService Servicio para manejar los datos del formulario de certificados, licencias y permisos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private _sharedSvc: DatosSolicitudService,
     private tramite2603Store: Tramite2603Store,
     private tramitePro260304Store: Tramite260304Store,
    private certificadosLicenciasPermisosService: CertificadosLicenciasPermisosService
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
          //this.guardarDatosFormulario();
          this.fetchGetDatosConsulta();
        } else {
          this.esDatosRespuesta = true;
        }
        })
      )
      .subscribe();
     
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

   setFromBackend(response: any): void {
      const mappedState = mapBackendToSolicitud2603(response);
      this.tramite2603Store.update(mappedState);
      this.tramitePro260304Store.update({...mappedState});

      const pagoDerechos = mapPago(response);
      this.tramitePro260304Store.updatePagoDerechos(pagoDerechos);
    }


  public fetchGetDatosConsulta(): void {
    this._sharedSvc
      .fetchMostrarApi260301(this.idProcediemento, this.idSolicitud) 
      .pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (respuesta) => {
        console.log('Mostrar API raw response:', respuesta);
        if (respuesta['codigo'] === "00") {
          this.esDatosRespuesta = true;
         // const MAPPED_STATE = this.shared2603MostrarService.mapToState(respuesta['datos'] as Record<string, unknown>);
         // console.log('Mapped state:', MAPPED_STATE); 
         // this.store.update(MAPPED_STATE);
          this.setFromBackend(respuesta);
        }
      }, error: () => {
          // En caso de error, se intenta obtener los datos de consulta nuevamente
        }
      });
  }

}
