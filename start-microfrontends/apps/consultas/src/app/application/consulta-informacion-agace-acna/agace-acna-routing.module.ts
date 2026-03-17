import { RouterModule, Routes } from "@angular/router";
import { ConsultasIndustriaAutomotrizComponent } from "./industria-automotriz/inicio/inicio.component";
import { NgModule } from "@angular/core";
import { ProveedoresComponent } from "./proveedores/proveedores.component";

const ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'proveedores' },
    {
        path: 'proveedores',
        component: ProveedoresComponent
    },
    {
        path: 'industria-automotriz',
        component: ConsultasIndustriaAutomotrizComponent,
    }
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class AgaceAcnaModule { }