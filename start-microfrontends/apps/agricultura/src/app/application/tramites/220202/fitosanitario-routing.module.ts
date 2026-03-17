import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@ng-mf/data-access-user';
import { AgregarExportadorComponent } from './components/agregar-exportador/agregar-exportador.component';
import { AgregarMercanciaComponent } from './components/agregar-mercancia/agregar-mercancia.component';
import { AgregardestinatarioComponent } from './components/agregardestinatario/agregardestinatario.component';
import { AgriculturaComponent } from './pages/agricultura/agricultura.component';
import { MercanciaFormComponent } from './shared/mercancia-form/mercancia-form.component';
import { NgModule } from '@angular/core';
import { SubProductosContenedoraComponent } from './components/sub-productos-contenedora/sub-productos-contenedora.component';

export const ROUTES_FITOSANITARIO: Routes = [
  {
    path: 'registrofitosanitario',
    component: AgriculturaComponent,
  },
  {
    path: 'agregar-exportador',
    component: AgregarExportadorComponent,
  },
  {
    path: 'agregar-exportador/:id',
    component: AgregarExportadorComponent,
  },
  {
    path: 'agregar-destinatario-final',
    component: AgregardestinatarioComponent,
  },
  {
    path: 'agregar-destinatario-final/:id',
    component: AgregardestinatarioComponent,
  },
  {
    path: 'mercancia-form',
    component: AgregarMercanciaComponent,
  },
  {
    path: 'mercancia-form/:id',
    component: MercanciaFormComponent,
  },
  {
    path: 'sub-productos',
    component: SubProductosContenedoraComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registrofitosanitario',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_FITOSANITARIO)],
  exports: [RouterModule],
})
export class FitosanitarioRoutingModule {}
