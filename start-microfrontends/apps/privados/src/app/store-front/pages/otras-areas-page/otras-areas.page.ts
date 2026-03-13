import { OTRAS_AREAS_ROUTES } from '@/features/otras-areas/otras-areas.routes.constants';
import { MenuItem } from '@/store-front/interfaces/menu-item.interface';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-otras-areas-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './otras-areas.page.html',
  styleUrls: ['./otras-areas.page.scss'],
})
export class OtrasAreasPage {
  menuItems: MenuItem[] = [
    {
      title: 'Otras areas',
      subitems: [
        {
          title: 'Registro de guías y manifiesto único aereo',
          route: OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
        },
      ],
      open: false,
    },
  ];

  toggle(item: MenuItem) {
    item.open = !item.open;
  }
}
