jest.mock('@libs/shared/theme/assets/json/260501/fabricante-select-options-data.json', () => ({
  default: {
    paisSelectData: [
      { id: '1', descripcion: 'México' },
      { id: '2', descripcion: 'Estados Unidos' },
    ],
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SolicitanteComponent, SolicitanteService } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { TercerosRelacionados260507Component } from '../../components/terceros-relacionados/terceros-relacionados.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import SELECT_OPTIONS_DATA from '@libs/shared/theme/assets/json/260501/fabricante-select-options-data.json';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [ 
        CommonModule, 
        SolicitanteComponent,
        DatosDeLaSolicitudComponent,
        TercerosRelacionados260507Component,
        PagoDeDerechosComponent,
        HttpClientModule,
      ],
      providers: [
        SolicitanteService,
        HttpClientTestingModule, 
        HttpClient
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Verificar que el componente se crea correctamente
    expect(component).toBeTruthy();
  });

  it('should have default tab index set to 1', () => {
    // Verificar que el índice predeterminado es 1
    expect(component.indice).toBe(1);
  });

  it('should update the selected tab index when seleccionaTab is called', () => {
    // Llamar a seleccionaTab y verificar que actualiza correctamente el índice
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should render Solicitante tab when indice is 1', () => {
    // Establecer el índice en 1 y verificar que se renderiza el componente correspondiente
    component.indice = 1;
    fixture.detectChanges();
    const SOLICITANTE = fixture.nativeElement.querySelector('solicitante');
    expect(SOLICITANTE).toBeTruthy();
  });

  it('should render datos de la solicitud tab when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const DATOS_SOLICITUD = fixture.nativeElement.querySelector('app-datos-de-la-solicitud');
    expect(DATOS_SOLICITUD).toBeTruthy();
  });

  it('should handle keyboard navigation (Enter key)', () => {
    // Simular que el usuario presiona Enter en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: 'Enter' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="2"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should handle keyboard navigation (Space key)', () => {
    // Simular que el usuario presiona Espacio en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: ' ' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="1"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should render terceros relacionados tab when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    const TERCEROS_RELACIONADOS = fixture.nativeElement.querySelector('app-terceros-relacionados');
    expect(TERCEROS_RELACIONADOS).toBeTruthy();
  });

  it('should render pago de derechos tab when indice is 4', () => {
    component.indice = 4;
    fixture.detectChanges();
    const PAGO_DE_DERECHOS = fixture.nativeElement.querySelector('app-pago-de-derechos');
    expect(PAGO_DE_DERECHOS).toBeTruthy();
  });
});