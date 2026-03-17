import { BtnContinuarComponent, FirmaElectronicaComponent, WizardComponent } from "@ng-mf/data-access-user";
import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr'
import { AtencionRequerimientosRoutingModule } from "./atencion-requerimientos-routing.module";
import { AtenderRequerimientosPageComponent } from "./atender-requerimientos-page/atender-requerimientos-page.component";
import { CommonModule } from "@angular/common";
import { EncabezadoRequerimientoComponent } from "@ng-mf/data-access-user";
import { RequerimientoInformacionComponent } from "@ng-mf/data-access-user";
import { RouterModule } from "@angular/router";
import { ServiciosExtraordinariosModule } from "../tramites/5701/servicios-extraordinarios.module";

@NgModule({
    declarations: [
        AtenderRequerimientosPageComponent,
    ],
    imports: [
        BtnContinuarComponent,
        CommonModule,
        RouterModule,
        WizardComponent,
        FirmaElectronicaComponent,
        AtencionRequerimientosRoutingModule,
        RequerimientoInformacionComponent,
        ServiciosExtraordinariosModule,
        ToastrModule.forRoot(),
        forwardRef(() => EncabezadoRequerimientoComponent),
        forwardRef(() => RequerimientoInformacionComponent)
    ],
    exports: [],
    providers: [
        ToastrService
    ]
})

export class AtencionRequerimientosModule { }