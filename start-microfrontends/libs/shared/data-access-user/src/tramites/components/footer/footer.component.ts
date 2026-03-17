import { Component } from '@angular/core';
import { PiePaginaInformacionComponent } from '../pie-pagina-informacion/pie-pagina-informacion.component';
import { Router } from '@angular/router';
import pkg from '@package-json';
@Component({
  selector: 'c-footer',
  standalone: true,
  imports: [PiePaginaInformacionComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /**
   * @description Versión de la aplicación obtenida del package.json.
   * @remarks Esta propiedad se utiliza para mostrar la versión actual de la aplicación en el pie de página.
   */
  version = pkg.version;

  /**
   * @description Constructor del componente FooterComponent.
   * @param router Instancia del Router de Angular para manejar la navegación.
   */
  constructor(public router: Router) {}

  /**
   * @description Método que verifica si la ruta actual es la página de inicio de sesión.
   * @returns {boolean} Retorna true si la ruta es '/login' o comienza con '/login', de lo contrario false.
   */
  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url.startsWith('/login');
  }
}
