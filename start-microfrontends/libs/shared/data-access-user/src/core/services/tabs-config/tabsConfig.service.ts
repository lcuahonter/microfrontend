import { Injectable } from '@angular/core';
import { TabsConfiguracion } from '../../models/tabs-config/tabs-config.model';



@Injectable({
  providedIn: 'root'
})

/**
 * Servicio que centraliza la configuración por trámite.
 * 
 * Permite obtener tanto la configuración de la UI como la de servicios
 * en base al identificador del trámite (`tramiteId`).
 */
export class TabsConfigService {

  /**
   * Configuración de pestañas por trámite.
   * La clave corresponde al `tramiteId`.
   */
  private tabsConfiguarcion: Record<number, TabsConfiguracion> = {
    130120: { isFechasDetallesDictamen: true },
    130109: { isFechasDetallesDictamen: true },
  };

  /** * Obtiene la configuración de requerimientos para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de requerimientos del trámite correspondiente
   */
  getTabsConfiguracion(tramiteId: number): TabsConfiguracion {
    return this.tabsConfiguarcion[tramiteId] ?? {
      isFechasDetallesDictamen: false
    };
  }
}
