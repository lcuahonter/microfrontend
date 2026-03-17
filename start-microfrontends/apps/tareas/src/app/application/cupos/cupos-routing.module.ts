import { CertificadosCupoPorVigenciaComponent } from './cancelacion/certificados-cupo-por-vigencia/inicio/inicio.component';
import { GenerarCertificadoCuposComponent } from './generar-certificado-cupos/inicio.component';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'generar-certificado-cupos' },
  {
    path: 'generar-certificado-cupos',
    component: GenerarCertificadoCuposComponent
  },
  {
    path: 'cancelacion/certificados-cupo-por-vigencia',
    component: CertificadosCupoPorVigenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class GenerarCertificadoCuposRoutingModule {}