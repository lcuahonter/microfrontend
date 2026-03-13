import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * @component
 * Componente para gestionar el criterio de dictamen y el esquema de regla.
 */
@Component({
  selector: 'app-criterio-dictamen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent],
  templateUrl: './CriterioDictamen.component.html',
  styleUrl: './CriterioDictamen.component.css',
})
export class CriterioDictamenComponent implements OnInit {
  
  /** Evento para notificar cambios en mercanciaEsquema. */
  @Output() mercanciaEsquemaChange = new EventEmitter<any>();
  /** Formulario reactivo para criterio de dictamen. */
  @Input() criterioDictamenForm!: FormGroup;
  /** Evento para actualizar valores en el store. */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string }>();
  /** Catálogo de esquemas de regla. */
  @Input() esquemaRegla: Catalogo[] = [];
  /** Bandera para modo solo lectura del formulario. */
  @Input() esFormularioSoloLectura!: boolean;

  /** Inicializa el componente y deshabilita el campo criterioDictamen. */
  ngOnInit() {
    this.criterioDictamenForm.get('criterioDictamen')?.disable();
  }

  /** Emite evento para actualizar valores en el store y notifica cambios en mercanciaEsquema. */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
    if (campo === 'mercanciaEsquema') {
      const value = form.get('mercanciaEsquema')?.value;
      this.mercanciaEsquemaChange.emit(value);
    }
  }

}
