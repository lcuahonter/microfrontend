import { RouterModule, Routes } from '@angular/router';
import { AgregarDestinatarioFinalContenedoraComponent } from './components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarFabricanteContenedoraComponent } from './components/agregar-fabricante-contenedora/agregar-fabricante-contenedora.component';
import { AgregarFacturadorContenedoraComponent } from './components/agregar-facturador-contenedora/agregar-facturador-contenedora.component';
import { AgregarProveedorContenedoraComponent } from './components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { DatosMercanciaContenedoraComponent } from './components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { ScianTablaContenedoraComponent } from './components/scian-tabla-contenedora/scian-tabla-contenedora.component';


const ROUTES: Routes = [
  {
    path: 'contenedor-de-pasos',
    component: ContenedorDePasosComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'scian-selecion',
    component: ScianTablaContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'mercancia-datos',
    component: DatosMercanciaContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'agregar-fabricante',
    component: AgregarFabricanteContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'agregar-destinatario-final',
    component: AgregarDestinatarioFinalContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'agregar-proveedor',
    component: AgregarProveedorContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: 'agregar-facturador',
    component: AgregarFacturadorContenedoraComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260209'
      }
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos',
  },
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ImportacionDestinadosDonacioRoutingModule {}
