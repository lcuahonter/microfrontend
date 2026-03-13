import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BajaUnidadComponent } from './unidad-de-arrastre/baja/baja-unidad.component';

import { CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { BajaVehiculoComponent } from './parque-vehicular/baja/baja-vehiculo.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ModificacionUnidadComponent } from './unidad-de-arrastre/modificacion/modificacion-unidad.component';
import { ModificacionVehiculoComponent } from './parque-vehicular/modificacion/modificacion-vehiculo.component';
import { UnidadDialogComponent } from './unidad-de-arrastre/dialog/unidad-dialog.component';
import { VehiculoDialogComponent } from './parque-vehicular/dialog/vehiculo-dialog.component';
import { VehiculosComponent } from './vehiculos.component';

@NgModule({
  declarations: [
    VehiculosComponent,
    ModificacionVehiculoComponent,
    BajaVehiculoComponent,
    ModificacionUnidadComponent,
    BajaUnidadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    TituloComponent,
    TooltipModule,
    VehiculoDialogComponent,
    UnidadDialogComponent
  ],
  exports: [VehiculosComponent]
})
export class VehiculosModule {}
