import { AMBIENTES, TramiteDetails } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import pkg from '@package-json';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent implements OnInit {

  /**
   * Variable para asingar el endpoint de la ruta
   */
  public ruta: string = '';

   /**
   * Versión actual de la aplicación desde package.json
   */
  version = pkg.version;
  ngOnInit(): void {
    if (window.location.host.indexOf('localhost') !== -1) {
      this.ruta = AMBIENTES.LOCALHOST;
    } else {
      this.ruta = AMBIENTES.DESARROLLO
    }
  }
  
}
