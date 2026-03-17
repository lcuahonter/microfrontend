import { RouterModule, Routes } from "@angular/router";
import { ConsultarComponent } from "./consultar/components/consultar.component";
import { NgModule } from "@angular/core";
import { RegistrarComponent } from "./registrar/registrar.component";

const ROUTES: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'consultar'
    },
    {
        path: 'consultar',
        component: ConsultarComponent
    },
    {
        path: 'registrar',
        component: RegistrarComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class InmexRoutingModule { }