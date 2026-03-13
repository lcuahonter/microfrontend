import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente `AltaPlantaComponent` utilizado para gestionar la funcionalidad de alta de plantas.
 * Este componente es independiente (standalone) y utiliza varios módulos y servicios.
 */
@Component({
  selector: 'app-alta-planta',
  templateUrl: './alta-planta.component.html',
  styleUrls: ['./alta-planta.component.scss'],
  standalone: true,
  imports: [
    ComplementariaImmexComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [ToastrService],
})
export class AltaPlantaComponent {}
