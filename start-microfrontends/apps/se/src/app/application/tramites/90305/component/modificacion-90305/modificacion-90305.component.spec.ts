import { CommonModule } from '@angular/common';

import { BtnContinuarComponent, DatosPasos, PASOS } from '@ng-mf/data-access-user';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultadDomicilios90305Component } from '../consultad-domicilios-90305/consultad-domicilios-90305.component';
import { ListaDomicilios90305Component } from '../lista-domicilios-90305/lista-domicilios-90305.component';
import { Mercancias90305Component } from '../mercancias-90305/mercancias-90305.component';
import { ModificacionInfo90305Component } from '../modificacion-info-90305/modificacion-info-90305.component';
import { Modificacion90305Component } from './modificacion-90305.component';
import { Plantas90305Component } from '../plantas-90305/plantas-90305.component';
import { ProductorIndirecto90305Component } from '../productorIndirecto-90305/productorIndirecto-90305.component';
import { Sector90305Component } from '../sector-90305/sector-90305.component';
import { HttpClientModule } from '@angular/common/http';

describe('Modification90305Component', () => {
  let component: Modificacion90305Component;
  let fixture: ComponentFixture<Modificacion90305Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ConsultadDomicilios90305Component,
        ListaDomicilios90305Component,
        Plantas90305Component,
        Sector90305Component,
        Mercancias90305Component,
        ProductorIndirecto90305Component,
        ModificacionInfo90305Component,
        BtnContinuarComponent,
        Modificacion90305Component,
        HttpClientModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Modificacion90305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos with PASOS', () => {
    expect(component.pasos).toEqual(PASOS);
  });

  it('should initialize indice with 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    } as DatosPasos);
  });
});
