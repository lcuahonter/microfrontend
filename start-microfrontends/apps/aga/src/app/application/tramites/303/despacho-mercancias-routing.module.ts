import { RouterModule, Routes } from '@angular/router';
import { EnlaceOperativoComponent } from './components/enlace-operativo/enlace-operativo.component';
import { NgModule } from '@angular/core';
import { RegistroFiguraComponent } from './components/registro-figura/registro-figura.component';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { RegistroTrasportistaComponent } from './components/registro-trasportista/registro-trasportista.component';

export const ROUTES: Routes = [
  {
    path: 'registro',
    component: RegistroPageComponent,
    children: [
      {
        path: 'registro',
        component: RegistroPageComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'registro',
      },
    ]
  },
  {
    path: 'registro-figura',
    component: RegistroFiguraComponent
  },
  {
    path: 'registro-trasportista',
    component: RegistroTrasportistaComponent
  },
  {
    path: 'enlace-operativo',
    component: EnlaceOperativoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class DespachoMercanciasRoutingModule { }
