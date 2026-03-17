import { RouterModule, Routes } from "@angular/router";
import { AgriculturaComponent } from "./agricultura/agricultura.component";
import { AlianzaPacificoComponent } from "./alianza-pacifico/inicio/inicio.component";
import { NgModule } from "@angular/core";
import { OrigenComponent } from "./origen/inicio/inicio.component";

const ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'agricultura' },
    {
        path: 'agricultura',
        component: AgriculturaComponent
    },
    {
        path: 'alianza-pacifico',
        component: AlianzaPacificoComponent
    },
    {
        path: 'origen',
        component: OrigenComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class CertificadosRoutingModule { }