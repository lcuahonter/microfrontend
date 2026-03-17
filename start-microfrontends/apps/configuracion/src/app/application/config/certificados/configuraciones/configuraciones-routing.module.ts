import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegistrarConfiguracionesComponent } from "./registrar/registrar.component";

const ROUTES: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'registrar'
    },
    {
        path: 'registrar',
        component: RegistrarConfiguracionesComponent
    },
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class RegistrarRoutingModule { }