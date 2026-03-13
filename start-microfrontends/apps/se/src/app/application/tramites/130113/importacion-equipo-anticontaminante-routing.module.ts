import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { ImportacionEquipoAnticontaminanteComponent } from './pages/importacion-equipo-anticontaminante/importacion-equipo-anticontaminante';
import { NgModule } from '@angular/core';


const ROUTES: Routes = [
  {
    path: 'equipo-anticontaminante',
    component :ImportacionEquipoAnticontaminanteComponent,
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130113',
          },
        },
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'equipo-anticontaminante'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionEquipoAnticontaminanteRoutingModule { }
