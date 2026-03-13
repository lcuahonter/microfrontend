import { CapturarElTextoLibreComponent } from './components/capturar-el-texto-libre/capturar-el-texto-libre.component';
import { FirmarComponent } from './components/firmar/firmar.component';
import { NgModule } from '@angular/core';
import { RequirementoComponent } from './components/requiremento/requiremento.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitarRequerimientoComponent } from './pages/solicitar-requerimiento/solicitar-requerimiento.component';

const ROUTES: Routes = [
  {
    path: 'solicitar-requiremento',
    component: SolicitarRequerimientoComponent,
  },
  {
    path: 'requiremento',
    component: RequirementoComponent,
  },
  {
    path: 'capturar-el-texto-libre',
    component: CapturarElTextoLibreComponent
  },
  {
    path: 'firmar',
    component: FirmarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})

/**
 * Este módulo se utiliza para configurar las rutas del módulo 32401.
 * Importar las rutas del módulo.
 */
export class ManifiestoAereoRoutingModule {}
