/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DomicilioTablaComponent } from './domicilio-tabla.component';

import { DOMICILIO_TABLA_COLUMNAS, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { DomicilioTablaService } from '../../services/domicilio-tabla/domicilioTabla.service';
import { HttpClientModule } from '@angular/common/http';

describe('DomicilioTablaComponent', () => {
  let component: DomicilioTablaComponent;
  let fixture: ComponentFixture<DomicilioTablaComponent>;
  let service: DomicilioTablaService;

  beforeEach(async () => {
    const SERVICE_MOCK = {
      getData: jest.fn().mockReturnValue(of([['value']])),
    };

    await TestBed.configureTestingModule({
      imports: [DomicilioTablaComponent, CommonModule, TablaDinamicaComponent,HttpClientModule],
      providers: [{ provide: DomicilioTablaService, useValue: SERVICE_MOCK }],
    }).compileComponents();

    service = TestBed.inject(DomicilioTablaService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomicilioTablaComponent);
    component = fixture.componentInstance;
    component.datosTabla = []; 
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializarse con valores por defecto', () => {
    expect(component.configuracionTabla).toEqual(DOMICILIO_TABLA_COLUMNAS);
    expect(component.seleccionTabla).toEqual(TablaSeleccion.UNDEFINED);
  });

  it('debería obtener datos al inicializar', () => {
    component.ngOnInit();
    expect(service.getData).toHaveBeenCalled();
    expect(component.datosTabla).toEqual([['value']]);
  });

  it('debería completar el subject destroyed$ al destruirse', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});