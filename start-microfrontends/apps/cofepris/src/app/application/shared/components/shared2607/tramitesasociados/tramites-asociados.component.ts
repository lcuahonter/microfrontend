import { Component, OnDestroy, OnInit} from '@angular/core';
import { Notificacion, NotificacionesComponent, Pedimento } from '@libs/shared/data-access-user/src';
import { Solicitud260702State, Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { map, takeUntil } from 'rxjs/operators';
import { DESTINATARIO_CONFIGURACION_TABLA2 } from '../../../constantes/column-config.enum';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { ReplaySubject } from 'rxjs';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TramitesAsociados } from '../../../models/destinatario.model';

@Component({
  selector: 'app-tramites-asociados',
  templateUrl: './tramites-asociados.component.html',
  styleUrls: ['./tramites-asociados.component.scss'],
  standalone: true,
  imports: [TablaDinamicaComponent, TituloComponent,NotificacionesComponent],
})
export class TramitesAsociadosComponent implements OnInit, OnDestroy {
  /** Arreglo que contiene los datos de las filas de la tabla */
  tablaFilaDatos: TramitesAsociados[] = [];

  /** Variable que controla la visibilidad del modal */
  esModalVisible = false;

  /** Sujeto que se utiliza para manejar la destrucción de suscripciones */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

   /** Configuración de las columnas de la tabla para los trámites asociados */
   destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA2;
   
/** 
 * Configuración para la notificación actual.
 */
  public nuevaNotificacion: Notificacion | null = null;

  /** 
 * Índice del elemento que se desea eliminar.
 */
  elementoParaEliminar!: number;

  /** 
 * Lista de pedimentos asociados a la solicitud.
 */
  pedimentos: Array<Pedimento> = [];

   /**
   * Estado actual de la solicitud de tipo `Solicitud260702State`.
   * 
   * Esta propiedad almacena la información relacionada con el estado de la solicitud
   * en el componente de terceros relacionados. Es utilizada para gestionar y reflejar
   * los cambios en la interfaz de usuario conforme avanza el proceso de la solicitud.
   */
   solicitudState!: Solicitud260702State;

  /**
   * Constructor de la clase
   * @param registrarsolicitudmcp Servicio para obtener los trámites asociados
   */
  constructor(private registrarsolicitudmcp: RegistrarSolicitudMcpService,private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,) {}

  /** Método que se ejecuta al inicializar el componente */
  ngOnInit(): void {
         this.solicitud260702Query.selectSolicitud$
          .pipe(
            takeUntil(this.destroyed$),
            map((seccionState) => {
              this.solicitudState = seccionState;
              if (seccionState.tablaFilaDatos.length) {
                this.tablaFilaDatos = seccionState.tablaFilaDatos;
              }
            }),
          )
          .subscribe();
    this.getTramitesAsociados();
  }

  /** Método para obtener los trámites asociados desde el servicio */
  getTramitesAsociados(): void {
    this.registrarsolicitudmcp
      .getTramitesAsociados()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tablaFilaDatos = data as TramitesAsociados[];
      });
  }

  /** Método para mostrar el modal */
  mostrarModal(): void {
    this.esModalVisible = true;
    this.abrirModal();
  }

  /** Método para ocultar el modal */
  ocultarModal(): void {
    this.esModalVisible = false;
  }
  /** Método para agregar un nuevo pedimento */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }
  /** Método para cerrar el modal */ 
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Está seguro que su solicitud no requiere los datos del pago de derechos?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    }
   
    this.elementoParaEliminar = i;
  }
  
  /** Método que se ejecuta al destruir el componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
