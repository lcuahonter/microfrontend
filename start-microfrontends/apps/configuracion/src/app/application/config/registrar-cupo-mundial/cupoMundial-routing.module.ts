import { RouterModule, Routes } from "@angular/router";
import { MundialComponent } from "./inicio/components/inicio.component";
import { NgModule } from "@angular/core";
import { SubCupoComponent } from "./sub-cupo/components/inicio.component";

const ROUTES: Routes = [
    {
        path: '',
        component: MundialComponent
    },
    {
        path:'sub-cupo',
        component: SubCupoComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class CupoMundialRoutingModule {}