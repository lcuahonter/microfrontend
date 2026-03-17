import { Component, OnInit } from '@angular/core';
import { AMBIENTES } from '@ng-mf/data-access-user';
import pkg from '@package-json';

@Component({
  selector: 'app-seleccion-tramite',
  templateUrl: './seleccion-tramite.component.html',
})
export class SeleccionTramiteComponent implements OnInit {

  /**
   * Variable para asingar el endpoint de la ruta
   */
  public ruta = '';
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