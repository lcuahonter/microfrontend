import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NormasResolucionesComponent } from "./normas-resoluciones/inicio/inicio.component";
import { NormasSgpComponent } from "./normas-sgp/inicio/inicio.component";
import { RegistrarComponent } from "./normas-resoluciones/registrar/registrar.component";
import { RouterOutletComponent } from "./normas-resoluciones/router-outlet/router-outlet.component";

const ROUTES: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'configuraciones'
    },
    {
        path: 'configuraciones',
        loadChildren: () =>
            import('./configuraciones/configuraciones-routing.module').then((m) => m.RegistrarRoutingModule)
    },
    {
        path: 'normas-sgp',
        component: NormasSgpComponent
    },
    {
        path: 'normas-resoluciones',
        component: RouterOutletComponent,
        children: [
            {
                path: '',
                component: NormasResolucionesComponent
            },
            {
                path: 'registrar',
                component: RegistrarComponent
            }
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class CertificadosRoutingModule { }