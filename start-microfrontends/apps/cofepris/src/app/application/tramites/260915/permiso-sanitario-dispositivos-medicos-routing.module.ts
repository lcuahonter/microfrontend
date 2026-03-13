
import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PermisoSanitarioDispositivosMedicosComponent } from './pages/permiso-sanitario-dispositivos-medicos/permiso-sanitario-dispositivos-medicos.component';

const ROUTES: Routes = [
  {
    path: 'permiso-sanitario-dispositivos-medicos',
    component: PermisoSanitarioDispositivosMedicosComponent,
   
   canActivate: [IniciarTramiteResolver],
   resolve: { iniciarResolverData: IniciarTramiteResolver },
   data: {
   iniciarConfig: {
     procedureId: '260915'
   }
 }
}
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoSanitarioDispositivosMedicosRoutingModule { }
