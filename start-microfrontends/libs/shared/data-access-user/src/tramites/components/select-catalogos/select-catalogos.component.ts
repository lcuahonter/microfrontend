import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogosSelect } from '../../../core/models/shared/components.model';
import { CommonModule } from '@angular/common';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';

@Component({
  selector: 'select-catalogos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './select-catalogos.component.html',
  styleUrl: './select-catalogos.component.scss',
  host: {}
})
export class SelectCatalogosComponent implements OnChanges {
  @Input() catalogosDatos!: CatalogosSelect;

  @Output() valorSeleccion = new EventEmitter<Catalogo>();

  itemSeleccionado: FormControl = new FormControl(0);

  constructor(private validacionesService: ValidacionesFormularioService) { 
    // Lógica de inicialización si es necesario
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catalogosDatos'].currentValue) {
      this.catalogosDatos = changes['catalogosDatos'].currentValue;
      if (this.catalogosDatos.required) {
        this.itemSeleccionado.setValidators([
          Validators.required,
          this.validacionesService.noCeroValidator(),
        ]);
        this.itemSeleccionado.updateValueAndValidity();
      }
    }
  }

  isValid(): boolean | null {
    return this.itemSeleccionado.errors && this.itemSeleccionado.touched;
  }

  seleccion():void {
    const OPCION_SELECCIONADA = parseInt(this.itemSeleccionado.value, 10);

    let seleccion: Catalogo;

    this.catalogosDatos.catalogos.forEach((el: Catalogo) => {
      el.id = (typeof (el.id) === 'string') ? parseInt(el.id, 10) : el.id;
      if (el.id === OPCION_SELECCIONADA) {
        seleccion = el;
        this.valorSeleccion.emit(seleccion);
      }
    });
  }
}
