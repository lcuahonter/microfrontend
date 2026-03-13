import { Notificacion, NotificacionesComponent, Pedimento } from '@libs/shared/data-access-user/src';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DESTINATARIO_CONFIGURACION_TABLA2 } from '../../constants/column-config.enum';
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';

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
  constructor(private importarDeRemediosHerbals: ImportarDeRemediosHerbalsService) {}

  /** Método que se ejecuta al inicializar el componente */
  ngOnInit(): void {
    this.getTramitesAsociados();
  }

  /** Método para obtener los trámites asociados desde el servicio */
  getTramitesAsociados(): void {
    this.importarDeRemediosHerbals
      .getTramitesAsociados()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tablaFilaDatos = data as TramitesAsociados[];
      });
  }
  /** Método que se ejecuta al destruir el componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
