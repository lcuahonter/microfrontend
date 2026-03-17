import { Component, OnDestroy, OnInit} from '@angular/core';
import { Notificacion, NotificacionesComponent, Pedimento } from '@libs/shared/data-access-user/src';
import { DESTINATARIO_CONFIGURACION_TABLA2 } from '../../constants/column-config.enum';
import { RegistrarSolicitudMcpService } from '../../services/registrar-solicitud-mcp.service';
import { ReplaySubject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TramitesAsociados } from '../../models/destinatario.model';
import { takeUntil } from 'rxjs/operators';

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
   * Constructor de la clase
   * @param registrarsolicitudmcp Servicio para obtener los trámites asociados
   */
  constructor(private registrarsolicitudmcp: RegistrarSolicitudMcpService) {}

  /** Método que se ejecuta al inicializar el componente */
  ngOnInit(): void {
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
