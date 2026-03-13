import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'cupos',
        pathMatch: 'full'
    },
    {
        path: 'cupos',
        loadChildren: ()=> 
            import('./cupos/cupos-routing.module').then((m)=>m.CuposRoutingModule)
    },
    {
        path: 'programas',
        loadChildren: ()=> 
            import('./programas/programas-routing.module').then((m)=>m.ProgramasRoutingModule)
    },
    {
        path: 'certificados',
        loadChildren: ()=> 
            import('./certificados/certificados-routing.module').then((m)=>m.CertificadosRoutingModule)
    },
    {
        path: 'fracciones',
        loadChildren: () =>
            import('./fracciones/fracciones-routing.module').then((m) => m.FraccionesRoutingModule)
    }
]
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ConfigRoutingModule {}