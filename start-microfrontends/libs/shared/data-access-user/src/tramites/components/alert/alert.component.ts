import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  host: {}
})
export class AlertComponent implements OnInit {
  @Input() CONTENIDO!: string;
  @Input() CUSTOMECLASS!: string;

  textoHTML: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) { 
    // EL construtor inyecta dependencias necesarias para el componente.
  }

  /**
   * Método del ciclo de vida de Angular que se llama una vez que el componente ha sido inicializado.
   * Aquí se establece el contenido HTML del componente utilizando el método `setHTML` y la propiedad `CONTENIDO`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.setHTML(this.CONTENIDO);
  }

  /**
   * Establece el contenido HTML de manera segura.
   * 
   * @param html - El contenido HTML a establecer.
   * @returns void
   */
  setHTML(html: string): void {
    this.textoHTML = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
