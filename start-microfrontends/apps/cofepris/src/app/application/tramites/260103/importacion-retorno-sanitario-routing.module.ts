import { RouterModule, Routes } from '@angular/router';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { IniciarTramiteResolver } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'contenedor-de-pasos',
    component: ContenedorDePasosComponent,
     canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260103'
          }
        },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos',
  }
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ImportacionRetornoSanitarioRoutingModule {}
