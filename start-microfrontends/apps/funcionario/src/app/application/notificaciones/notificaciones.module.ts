import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { EncabezadoRequerimientoComponent } from '@ng-mf/data-access-user';
import { NotificacionPageComponent } from './notificacion-page/notificacion-page.component';
import { NotificacionesRoutingModule } from './notificaciones-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [],
    imports:[
        CommonModule,
        NotificacionPageComponent,
        NotificacionesRoutingModule,
        RouterModule,
        forwardRef( () => EncabezadoRequerimientoComponent ),
        ToastrModule.forRoot(),
    ],
    exports:[],
    providers:[
        ToastrService
    ]
})

export class NotificacionesModule {}