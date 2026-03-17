import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

/**
 * Servicio de navegación para el MFE privados.
 *
 * Detecta automáticamente si el MFE está corriendo dentro del shell (dashboard)
 * o en modo standalone, y ajusta las rutas de navegación apropiadamente.
 *
 * - En el shell: la URL base ya es '/privados' (Module Federation)
 * - En standalone: la URL base es '/'
 */
@Injectable({ providedIn: 'root' })
export class RoutingService {
  private readonly router = inject(Router);

  /** Prefijo del MFE cuando corre dentro del shell */
  private readonly MFE_PREFIX = 'privados';

  /**
   * Navega a una ruta dentro del MFE.
   * Detecta automáticamente el contexto (shell vs standalone) y construye
   * la ruta correcta.
   *
   * @param url - Array de segmentos de ruta o string de ruta
   * @param extras - Opciones adicionales de navegación
   * @returns Promise que resuelve a true si la navegación fue exitosa
   *
   * @example
   * // Navega a /privados/consultas/consulta-aereo-detalle/123 (en shell)
   * // o a /consultas/consulta-aereo-detalle/123 (en standalone)
   * this.routingService.navigate(['consultas', 'consulta-aereo-detalle', '123']);
   */
  navigate(url: string | any[], extras: NavigationExtras = {}): Promise<boolean> {
    const commands = Array.isArray(url) ? url : [url];

    // Detectar si estamos dentro del shell verificando la URL actual
    const currentUrl = this.router.url;
    const isInsideShell = currentUrl.startsWith(`/${this.MFE_PREFIX}`);

    // Construir la ruta con o sin prefijo según el contexto
    const finalCommands = isInsideShell
      ? ['/', this.MFE_PREFIX, ...commands]
      : ['/', ...commands];

    return this.router.navigate(finalCommands, extras);
  }
}
