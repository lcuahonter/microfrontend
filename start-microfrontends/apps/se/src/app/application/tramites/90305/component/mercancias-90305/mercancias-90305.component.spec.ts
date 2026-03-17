import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mercancias90305Component } from './mercancias-90305.component';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';

import { ReactiveFormsModule } from '@angular/forms';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

describe('Mercancias90305Component', () => {
  let component: Mercancias90305Component;
  let fixture: ComponentFixture<Mercancias90305Component>;
  let mockService: Partial<ProsecModificacionServiceTsService>;

  beforeEach(async () => {
    mockService = {
      getMercancias: () => of([
        {
          fraccionArancelaria: '1234.56.78',
          claveDelSector: 'Sector1',
          eStatus: 'Active',
        },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [Mercancias90305Component, CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent],
      providers: [{ provide: ProsecModificacionServiceTsService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Mercancias90305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call loadMercancias on ngOnInit', () => {
    const spy = jest.spyOn(component, 'loadMercancias');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should load mercancias and update mercanciasProd', () => {
    const spy = jest.spyOn(mockService, 'getMercancias');
    component.loadMercancias();
    expect(spy).toHaveBeenCalled();
    expect(component.mercanciasProd.length).toBe(1);
    expect(component.mercanciasProd[0].fraccionArancelaria).toBe('1234.56.78');
  });

  it('should have correct table configuration', () => {
    expect(component.configuracionTabla.length).toBe(3);
    expect(component.configuracionTabla[0].encabezado).toBe('Fracción arancelaria');
    expect(component.configuracionTabla[1].encabezado).toBe('Clave del sector');
    expect(component.configuracionTabla[2].encabezado).toBe('Estatus');
  });
});
