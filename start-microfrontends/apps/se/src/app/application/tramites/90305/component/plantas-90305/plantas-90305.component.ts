/**
 * compo doc
 * @component Plantas90305Component
 * @description
 * Este componente muestra la información de las plantas registradas en el trámite 90305.
 * Utiliza una tabla dinámica para visualizar la información y obtiene los datos desde un servicio.
 */

import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TituloComponent } from '@ng-mf/data-access-user';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';

import { TablaSeleccion } from '@ng-mf/data-access-user';


import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { PLANTAS } from '../../models/prosec-modificacion.model';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

/**
 * compo doc
 * @selector app-plantas-90305
 * @standalone true
 */
@Component({
  selector: 'app-plantas-90305',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent,ReactiveFormsModule],
  templateUrl: './plantas-90305.component.html',
  styleUrl: './plantas-90305.component.scss',
})
export class Plantas90305Component implements OnInit {
  plantasForm!: FormGroup;
  /** Enum para la selección de la tabla */
  TablaSeleccion = TablaSeleccion;
  /** Lista de plantas obtenidas del servicio */
  personaparas: PLANTAS[] = [];
  
  /** Configuración de la tabla de plantas */
  configuracionTabla: ConfiguracionColumna<PLANTAS>[] = [
    { encabezado: 'Calle', clave: (item: PLANTAS) => item.calle, orden: 1 },
    { encabezado: 'Número exterior', clave: (item: PLANTAS) => item.numeroExterior, orden: 2 },
    { encabezado: 'Número interior', clave: (item: PLANTAS) => item.numeroInterior, orden: 3 },
    { encabezado: 'Código postal', clave: (item: PLANTAS) => item.codigoPostal, orden: 4 },
    { encabezado: 'Colonia', clave: (item: PLANTAS) => item.colonia, orden: 5 },
    { encabezado: 'Municipio o alcaldía', clave: (item: PLANTAS) => item.municipioOAlcaldia, orden: 6 },
    { encabezado: 'Entidad Federativa', clave: (item: PLANTAS) => item.entidadFederativa, orden: 7 },
    { encabezado: 'País', clave: (item: PLANTAS) => item.pais, orden: 8 },
    { encabezado: 'Teléfono', clave: (item: PLANTAS) => item.telefono, orden: 9 },
  ];
 
  /*
 constructor
  */

  constructor(private listaDomicilios: ProsecModificacionServiceTsService) {
    //construstor
  }
  
  /**
   * Método que se ejecuta al inicializar el componente y carga la información de las plantas.
   */
  ngOnInit() :void{
    this.loadPlantaComplementaria();
  }

  /**
   * Método para obtener la lista de plantas desde el servicio.
   */
  loadPlantaComplementaria(): void {
    this.listaDomicilios.getPlantaComplementaria().subscribe((resp) => {
      this.personaparas = resp;
    });
  }
}
