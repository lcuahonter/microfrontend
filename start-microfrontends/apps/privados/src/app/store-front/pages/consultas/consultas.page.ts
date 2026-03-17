import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { CONSULTAS_ROUTES } from '../../../routes.constants';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage {
  menuItems: MenuItem[] = [
    { title: 'Consulta Recintos', route: '/recintos' },
    { title: 'Consulta de Gafetes', route: '/gafetes' },
    {
      title: 'Manifiesto Aéreo',
      subitems: [
        { title: 'Consulta de Manifiestos', route: CONSULTAS_ROUTES.MANIFIESTO_AEREO },
        {
          title: 'Descargar Documento Consultado',
          route: CONSULTAS_ROUTES.DESCARGAR_DOCUMENTO_CONSULTADO,
        },
        {
          title: 'Consulta Guías Aereas',
          route: CONSULTAS_ROUTES.CONSULTA_GUIAS_AEREAS,
        },
        {
          title: 'Consulta de Estados de Guías Aereas',
          route: CONSULTAS_ROUTES.CONSULTA_GUIAS_AEREAS_ESTADOS,
        },
        {
          title: 'Consulta de Transbordo',
          route: CONSULTAS_ROUTES.CONSULTA_TRANSBORDO,
        },
      ],
      open: false,
    },
    { title: 'Consulta trámites de SEMARNAT', route: '/semarnat' },
    { title: 'Consulta trámites de COFEPRIS', route: '/cofepris' },
  ];

  toggle(item: MenuItem) {
    item.open = !item.open;
  }
}
