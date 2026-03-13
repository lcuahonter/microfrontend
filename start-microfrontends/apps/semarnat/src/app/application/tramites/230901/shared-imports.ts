import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    TituloComponent, InputRadioComponent, CatalogoSelectComponent, InputFechaComponent, UppercaseDirective,
    TablaDinamicaComponent, CrosslistComponent, AlertComponent, NotificacionesComponent
} from '@libs/shared/data-access-user/src';

export const SHARED_MODULES = [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    NotificacionesComponent,
    AlertComponent,

    // Agregar componentes propios aquí

    //Directives
    UppercaseDirective
] as const;
