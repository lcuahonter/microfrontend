import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { seComponent } from "./se/se.component";

const ROUTES : Routes = [
    {
        path: 'se',
        component: seComponent
    }
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class tramitesRoutingModule {}