/**
 * compo doc
 * @component Sector90305Component
 * @description
 * Este componente muestra la información de los sectores registrados en el trámite 90305.
 * Utiliza una tabla dinámica para visualizar la información de los sectores.
 */
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TituloComponent } from '@ng-mf/data-access-user';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';


import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { SectorModel } from '../../models/prosec-modificacion.model';

import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

/**
 * compo doc
 * @selector app-sector-90305
 * @standalone true
 */
@Component({
  selector: 'app-sector-90305',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent ,ReactiveFormsModule],
  templateUrl: './sector-90305.component.html',
  styleUrl: './sector-90305.component.scss',
})
export class Sector90305Component implements OnInit {
  sectorDataForm!: FormGroup;
  /** Enum para la selección de la tabla */
  TablaSeleccion = TablaSeleccion;
  
  /** Lista de sectores obtenidos del servicio */
  sectorData: SectorModel [] = [];
  /*
  *constructor
  */
  constructor(private listaDomicilios: ProsecModificacionServiceTsService) {
    //constructor
  }
  
  /**
   * Método de inicialización del componente.
   * Carga la información de los sectores al iniciar.
   */
  ngOnInit():void {
    this.loadSector();
  }
  
  /** Configuración de la tabla de sectores */
  configuracionTabla: ConfiguracionColumna<SectorModel >[] = [
    { encabezado: 'Lista de sectores', clave: (item: SectorModel ) => item.listaDeSectores, orden: 1 },
    { encabezado: 'Clave del sector', clave: (item: SectorModel ) => item.claveDelSector, orden: 2 },
    { encabezado: 'Estatus', clave: (item: SectorModel ) => item.estatus, orden: 3 }
  ];
  
  /**
   * Método para obtener la lista de sectores desde el servicio.
   */
  loadSector() :void{
    this.listaDomicilios.getSector().subscribe((resp) => {
      this.sectorData = resp;
    });
  }
}
