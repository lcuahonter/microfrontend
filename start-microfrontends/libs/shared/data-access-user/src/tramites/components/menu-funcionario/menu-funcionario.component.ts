import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuFuncionario } from '../../../core/models/lista-menu-funcionario.model';

@Component({
  selector: 'app-menu-funcionario',
  standalone: true,
  templateUrl: './menu-funcionario.component.html',
  styleUrls: ['./menu-funcionario.component.scss'],
  imports: [CommonModule]
})
export class MenuFuncionarioComponent implements OnInit {

  /**
   * Lista de elementos que conforman el menú del funcionario.
   * Cada elemento de la lista es de tipo `MenuFuncionario` y representa una opción o funcionalidad disponible en el menú.
   * 
   * @type {MenuFuncionario[]}
   */
  listaElementosMenu: MenuFuncionario[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.listaElementosMenu = this.generateMenuJson();
  }

  // eslint-disable-next-line class-methods-use-this
  generateMenuJson(): MenuFuncionario[] {
    return [
      {
        label: 'Inicio',
        icon: 'bi bi-house-door',
        route: '/inicio',
        classbutton: 'bg-primary'
      },
      {
        label: 'Consultas',
        icon: 'bi bi-search',
        route: '/consultas',
        classbutton: 'bg-light'
      },
      {
        label: 'Pendientes',
        icon: 'bi bi-hourglass-split',
        route: '/pendientes',
        classbutton: 'bg-secondary'
      },
      {
        label: 'Trámites',
        icon: 'bi bi-clipboard-data',
        route: '/tramites',
        classbutton: 'bg-primary'
      },
      {
        label: 'Usuarios',
        icon: 'bi bi-people',
        route: '/usuarios',
        classbutton: 'bg-light'
      },
      {
        label: 'Otras tareas',
        icon: 'bi bi-briefcase',
        route: '/otras-tareas',
        classbutton: 'bg-light'
      },
      {
        label: 'Configuración',
        icon: 'bi bi-gear',
        route: '/configuracion',
        classbutton: 'bg-info'
      }
    ];
  }

  irADetalle(ruta:string): void {
    console.warn('Navegando a:', ruta);
    this.router.navigate([ruta]);
  }

}
