import { AgregarAgenteComponent } from './components/agregar-agente/agregar-agente.component';
import { AgregarFusionEscisionComponent } from './components/agregar-fusion-escision/agregar-fusion-escision.component';
import { AvisoDeModificacionComponent } from './pages/aviso-de-modificacion/aviso-de-modificacion.component';
import { ModificarAgenteComponent } from './components/modificar-agente/modificar-agente.component';
import { ModificarFusionEscisionComponent } from './components/modificar-fusion-escision/modificar-fusion-escision.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'aviso',
    component: AvisoDeModificacionComponent,
  },
  {
    path:'agregar-fusion-escision',
    component: AgregarFusionEscisionComponent
  },
  {
    path:'agregar-agente',
    component: AgregarAgenteComponent
  },
 {
    path:'modificar-fusion-escision',
    component: ModificarFusionEscisionComponent

  },
  {
    path:'modificar-agente',
    component: ModificarAgenteComponent

  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AvisoDeModificationRoutingModule {}
