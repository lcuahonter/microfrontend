import { RouterModule, Routes } from '@angular/router';
import { ActualizarFraccionComponent } from './tigie/components/actualizar-fraccion/actualizar-fraccion.component';
import { AgregarCorrelacionComponent } from './tigie/components/agregar-correlacion/agregar-correlacion.component';
import { AltaFraccionComponent } from './tigie/components/alta-fraccion/alta-fraccion.component';
import { ConsultaEspecificaComponent } from './tigie/components/consulta-especifica/consulta-especifica.component';
import { ConsultaHistoricaComponent } from './tigie/components/consulta-historica/consulta-historica.component';
import { DisgregarCorrelacionComponent } from './tigie/components/disgregar-correlacion/disgregar-correlacion.component';
import { FraccionesInicioComponent } from './tigie/inicio/fracciones-inicio.component';
import { NgModule } from '@angular/core';
import { RouterOutletComponent } from './tigie/router-outlet.component';

const ROUTES: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'tigie'
  },
  {
    path: 'tigie',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        component: FraccionesInicioComponent
      },
      {
        path: 'alta',
        component: AltaFraccionComponent
      },
      {
        path: 'actualizar',
        component: ActualizarFraccionComponent
      },
      {
        path: 'correlacion/agregar',
        component: AgregarCorrelacionComponent
      },
      {
        path: 'correlacion/disgregar',
        component: DisgregarCorrelacionComponent
      },
      {
        path: 'consulta/especifica',
        component: ConsultaEspecificaComponent
      },
      {
        path: 'consulta/historica',
        component: ConsultaHistoricaComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class FraccionesRoutingModule { }
