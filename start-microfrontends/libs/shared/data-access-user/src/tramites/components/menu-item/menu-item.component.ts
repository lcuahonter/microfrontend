import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../core/models/menu-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  /** Menú que será recibido desde el componente padre */
  @Input() menu: MenuItem[] = [];
  /** Si deseas manejar la navegación externamente, emite el path del ítem seleccionado */
  @Output() itemClick = new EventEmitter<string>();
  desplega?: string;
  /**
 * Constructor del componente MenuUsuarioComponent.
 * Inyecta el servicio Router de Angular para permitir la navegación
 * programática cuando el usuario selecciona una opción del menú.
 * 
 * @param router Servicio de enrutamiento de Angular para gestionar la navegación.
 */
  constructor(private router: Router) { }

  /**
   * Cambia el estado expandido/colapsado de un elemento del menú.
   * @param item Elemento del menú al que se le alternará el estado expandido.
   * Si el elemento está expandido, lo colapsa; si está colapsado, lo expande.
   */
  
  /**toggleAll este metodo se usa solo para interactuar el expanded del menú por lo cual se deshabilita la regla eslint */
  //eslint-disable-next-line class-methods-use-this
  toggleAll(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  /** 
   * Navega al path o emite el evento para que lo maneje el padre 
   */
  navegar(path?: string): void {
    if (path) {
      this.router.navigate([path]);
    }
  }
}
