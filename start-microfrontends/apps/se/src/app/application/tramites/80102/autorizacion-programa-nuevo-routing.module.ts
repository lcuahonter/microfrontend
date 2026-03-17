import { RouterModule, Routes } from '@angular/router';
import { CapacidadInstaladaComponent } from '../../shared/components/capacidad-instalada/capacidad-instalada.component';
import { ComplementarFraccionVistaComponent } from './components/complementar-fraccion-vista/complementar-fraccion-vista.component';
import { ComplementarPlantaComponent } from '../../shared/components/complementar-planta/complementar-planta.component';
import { ContenedorComplementarPlantasComponent } from './components/contenedor-complementar-plantas/contenedor-complementar-plantas.component';
import { ContenedorProveedorClienteComponent } from './components/contenedor-proveedor-cliente/contenedor-proveedor-cliente.component';
import { EmpleadosComponent } from '../../shared/components/empleados/empleados.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { MontosDeInversionComponent } from '../../shared/components/montos-de-inversion/montos-de-inversion.component';
import { NgModule } from '@angular/core';
import { ProveedorPorArchivoVistaComponent } from './components/proveedor-por-archivo-vista/proveedor-por-archivo-vista.component';
import { ProyectoImmexVistaComponent } from './components/proyecto-immex-vista/proyecto-immex-vista.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
   {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '80102'
          }
        },
      path: 'solicitud',
      component: SolicitudPageComponent,
    },
    {
      path: 'complementar-plantas',
      component: ContenedorComplementarPlantasComponent,
    },
    {
      path: 'complementar-fraccion',
      component: ComplementarFraccionVistaComponent,
    },
    {
  
      path: 'proyecto-immex',
      component: ProyectoImmexVistaComponent
    },
    {
      path: 'proveedor-por-archivo',
      component: ProveedorPorArchivoVistaComponent
    },
    {
      path: 'contenedor-proveedor-cliente',
      component: ContenedorProveedorClienteComponent,
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
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'solicitud',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AutorizacionProgrmaNuevoRoutingModule { }


