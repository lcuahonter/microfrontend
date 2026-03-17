import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDomicilios90305Component } from './lista-domicilios-90305.component';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';

import { ReactiveFormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

describe('ListaDomicilios90305Component', () => {
  let component: ListaDomicilios90305Component;
  let fixture: ComponentFixture<ListaDomicilios90305Component>;
  let mockService: Partial<ProsecModificacionServiceTsService>;

  beforeEach(async () => {
    mockService = {
      getListaDomicilios: () => of([
        {
          calle: 'Av. Siempre Viva',
          numeroExterior: '742',
          numeroInterior: 'A',
          codigoPostal: '12345',
          colonia: 'Springfield',
          localidad: 'Centro',
          municipioOAlcaldia: 'Springfield',
          entidadFederativa: 'Illinois',
          pais: 'USA',
          telefono: '1234567890',
          razonSocial: 'Test Company',
          rfc: 'RFC123456789',
        },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [ListaDomicilios90305Component, CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent],
      providers: [{ provide: ProsecModificacionServiceTsService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDomicilios90305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load domicilios and update personaparas', () => {
    const spy = jest.spyOn(mockService, 'getListaDomicilios').mockReturnValue(of([
      {
        calle: 'Av. Siempre Viva',
        numeroExterior: '742',
        numeroInterior: 'A',
        codigoPostal: '12345',
        colonia: 'Springfield',
        localidad: 'Centro',
        municipioOAlcaldia: 'Springfield',
        entidadFederativa: 'Illinois',
        pais: 'USA',
        telefono: '1234567890',
        razonSocial: 'Test Company',
        rfc: 'RFC123456789',
      },
    ]));
    component.loadDomicilios();
    expect(mockService.getListaDomicilios).toHaveBeenCalled();
    expect(component.personaparas.length).toBe(1);
    expect(component.personaparas[0].calle).toBe('Av. Siempre Viva');
  });

  it('should toggle showSecondButton when toggleButtons is called', () => {
    expect(component.showSecondButton).toBe(false);
    component.toggleButtons();
    expect(component.showSecondButton).toBe(true);
    component.toggleButtons();
    expect(component.showSecondButton).toBe(false);
  });

  it('should have correct table configuration', () => {
    expect(component.configuracionTabla.length).toBe(11);
    expect(component.configuracionTabla[0].encabezado).toBe('Calle');
    expect(component.configuracionTabla[10].encabezado).toBe('Razón social');
  });
});
