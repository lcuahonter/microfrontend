import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CapacidadInstaladaComponent } from '../../shared/components/capacidad-instalada/capacidad-instalada.component';
import { ComplementarPlantaComponent } from '../../shared/components/complementar-planta/complementar-planta.component';
import { EmpleadosComponent } from '../../shared/components/empleados/empleados.component';
import { MontosDeInversionComponent } from '../../shared/components/montos-de-inversion/montos-de-inversion.component';

import { ComplementarFraccionVistaComponent } from './component/complementar-fraccion-vista/complementar-fraccion-vista.component';
import { ContenedorComplementarPlantasComponent } from './component/contenedor-complementar-plantas/contenedor-complementar-plantas.component';
import { ContenedorProveedorClienteComponent } from './component/contenedor-proveedor-cliente/contenedor-proveedor-cliente.component';
import { ProveedorPorArchivoVistaComponent } from './component/proveedor-por-archivo-vista/proveedor-por-archivo-vista.component';
import { ProyectoImmexVistaComponent } from './component/proyecto-immex-vista/proyecto-immex-vista.component';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'action',
  },
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80101'
      }
    },
    path: 'action',
    component: PasoCapturarSolicitudComponent,
  },
  {
    path: 'complementar-fraccion',
    component: ComplementarFraccionVistaComponent,
  },
  {
    path: 'proyecto-immex',
    component: ProyectoImmexVistaComponent,
  },
  {
    path: 'proveedor-por-archivo',
    component: ProveedorPorArchivoVistaComponent,
  },
  {
    path: 'contenedor-proveedor-cliente',
    component: ContenedorProveedorClienteComponent,
  },
  {
    path: 'complementar-plantas',
    component: ContenedorComplementarPlantasComponent,
  },
  {
    path: 'complementar-plantas-acciones',
    component: ComplementarPlantaComponent,
  },
  {
    path: 'montos-inversion-acciones',
    component: MontosDeInversionComponent,
  },
  {
    path: 'empleados-acciones',
    component: EmpleadosComponent,
  },
  {
    path: 'capacidad-instalada-acciones',
    component: CapacidadInstaladaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class NuevoProgramaIndustrialRoutingModule { }
