import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'proveedores' },
    {
        path: 'proveedores',
    }
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ProveedoresModule { }