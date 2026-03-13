
import { Component, OnInit } from '@angular/core';
import { BandejaComponent } from "@libs/shared/data-access-user/src/tramites/components/consulta-generica/bandeja/bandeja.component";
import { CommonModule } from '@angular/common';
import { FolioStore } from '@libs/shared/data-access-user/src/core/estados/folio.store';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, BandejaComponent],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss',
})
export class ConsultaComponent implements OnInit {
  /**
   * Constructor del componente ConsultaComponent.
   * @param folioStore - Store para manejar el estado del folio.
   */
  constructor(private folioStore: FolioStore) {
  }
  
  /**
   * Método que se ejecuta al inicializar el componente.
   * Guarda un folio de ejemplo en el store.
   */
  ngOnInit(): void {
    // Guardar el folio en el store
    this.folioStore.update({ folio: '01010101010101010101010101010101' });
  }
}