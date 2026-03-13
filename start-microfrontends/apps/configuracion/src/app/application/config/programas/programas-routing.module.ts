import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const ROUTES: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'inmex'
    },
    {
        path: 'inmex',
        loadChildren: () =>
            import('./inmex/inmex-routing.module').then((m) => m.InmexRoutingModule)
    },
    {
        path: 'prosec',
        loadChildren: () =>
            import('./prosec/prosec-routing.module').then((m) => m.ProsecRoutingModule)
    },
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ProgramasRoutingModule { }