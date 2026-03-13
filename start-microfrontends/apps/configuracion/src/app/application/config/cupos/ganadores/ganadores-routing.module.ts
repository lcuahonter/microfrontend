import { RouterModule, Routes } from "@angular/router";
import { ConsultarGanadoresComponent } from "./consultar/consultar.component";
import { NgModule } from "@angular/core";

const ROUTES : Routes = [
    {
        path: '',
        redirectTo: 'consultar',
        pathMatch: 'full'
    },
    {
        path: 'consultar',
        component: ConsultarGanadoresComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class GanadoresRoutingModule {}