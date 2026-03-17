/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CertificadoDisponiblesComponent } from './certificado-disponibles.component';

import { CERTIFICADO_DISPONIBLES_COLUMNAS, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { CertificadoDisponiblesService } from '../../services/certificado-disponibles/certificadoDisponibles.service';
import { HttpClientModule } from '@angular/common/http';

describe('CertificadoDisponiblesComponent', () => {
  let component: CertificadoDisponiblesComponent;
  let fixture: ComponentFixture<CertificadoDisponiblesComponent>;
  let service: CertificadoDisponiblesService;

  beforeEach(async () => {
    const SERVICE_MOCK = {
      getData: jest.fn().mockReturnValue(of([{ key: 'value' }])),
    };

    await TestBed.configureTestingModule({
      imports: [CertificadoDisponiblesComponent, CommonModule, TablaDinamicaComponent,HttpClientModule],
      providers: [{ provide: CertificadoDisponiblesService, useValue: SERVICE_MOCK }],
    }).compileComponents();

    service = TestBed.inject(CertificadoDisponiblesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con los valores por defecto', () => {
    expect(component.configuracionTabla).toEqual(CERTIFICADO_DISPONIBLES_COLUMNAS);
    expect(component.seleccionTabla).toEqual(TablaSeleccion.UNDEFINED);
  });

  it('debe completar el subject destroyed$ al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});