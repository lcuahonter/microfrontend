import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'tpl',
        pathMatch: 'full'
    },
    {
        path: 'mundial',
        loadChildren: () =>
            import('./mundial/mundial-routing.module').then((m) => m.MundialRouting)
    },
    {
        path: 'ganadores',
        loadChildren: () =>
            import('./ganadores/ganadores-routing.module').then((m) => m.GanadoresRoutingModule)
    },
    {
        path: 'tpl',
        loadComponent: () =>
            import('./tpl/components/inicio.component').then((c) => c.TPLComponent)
    }
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class CuposRoutingModule { }