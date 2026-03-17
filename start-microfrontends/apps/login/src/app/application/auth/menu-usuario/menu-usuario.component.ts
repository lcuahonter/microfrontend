import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from '../../core/models/menu-item.model';
import { MenuItemComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './menu-usuario.component.html',
  styleUrl: './menu-usuario.component.scss',
})
export class MenuUsuarioComponent {
  /**
 * Constructor del componente MenuUsuarioComponent.
 * Inyecta el servicio Router de Angular para permitir la navegación
 * programática cuando el usuario selecciona una opción del menú.
 * @param router Servicio de enrutamiento de Angular para gestionar la navegación.
 */
  constructor(private router: Router) { }

  /**
   * Estructura jerárquica del menú de administración de usuarios.
   */
  menu: MenuItem[] = [
    {
      label: 'Usuarios',
      expanded: false,
      children: [
        {
          label: 'Administración de los usuarios',
          expanded: false,
          children: [
            {
              label: 'Datos generales',
              expanded: false,
              children: [
                { label: 'Modificar correo', path: 'login/modificar-correo' },
                { label: 'Cambio de contraseña', path: 'login/cambio-contrasena' },
              ]
            },
            {
              label: 'Personas relacionadas',
              expanded: false,
              children:
                [
                  { label: 'Registro de capturista privado', path: 'login/registro-capturista-privado' },
                  { label: 'Registro de notificadores', path: 'login/registro-notificadores' },
                  { label: 'Registrar Socios / Accionistas', path: 'login/registro-socio-accionista' },
                ]
            }
          ]
        }
      ]
    },
  ];

  /**
 * Navega a la ruta especificada cuando se selecciona una opción del menú.
 * @param path Ruta a la que se debe navegar.
 */
  onMenuClick(path: string): void {
    this.router.navigate([path]);
  }
}
