import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { NgModule } from '@angular/core';
const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'certificados',
    loadChildren: () => import('./certificados/certificados-routing.module').then(
      (m) => m.CertificadosRoutingModule
    )
  },
  {
    path: 'cupos',
    loadChildren: () => import('./cupos/cupos-routing.module').then(
      (m) => m.GenerarCertificadoCuposRoutingModule
    )
  },
  {
    path: 'lda',
    loadChildren: () =>
      import('./LDA/LDA-routing.module').then(
        (m) => m.LDARoutingModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule { }