import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bitacora90305Component } from './bitacora-90305.component';

import { of } from 'rxjs';

import { CommonModule } from '@angular/common';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { TituloComponent } from '@ng-mf/data-access-user';

import { AlertComponent } from '@ng-mf/data-access-user';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { BitacoraModel  } from '../../models/prosec-modificacion.model';

describe('Bitacora90305Component', () => {
  let component: Bitacora90305Component;
  let fixture: ComponentFixture<Bitacora90305Component>;
  let serviceMock: Partial<ProsecModificacionServiceTsService>; // ✅ Using Partial instead of SpyObj

  beforeEach(async () => {
    serviceMock = {
      getBitacora: () => of([]), // ✅ Providing a direct implementation
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, TablaDinamicaComponent, TituloComponent, AlertComponent],
      providers: [{ provide: ProsecModificacionServiceTsService, useValue: serviceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bitacora90305Component);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

it('should call loadBitacora on ngOnInit', () => {
  const spy = jest.spyOn(component as any, 'loadBitacora');
  component.ngOnInit();
  expect(spy).toHaveBeenCalled();
});


  it('should have default values for `infoAlert` and `TEXTO_ALERT`', () => {
    expect(component.infoAlert).toBe('alert-info');
    expect(component.TEXTO_ALERT).toBeDefined();
  });

  it('should initialize `configuracionTabla` with correct column settings', () => {
    expect(component.configuracionTabla.length).toBe(4);
    expect(component.configuracionTabla[0].encabezado).toBe('Tipo de modificación');
    expect(component.configuracionTabla[1].encabezado).toBe('Fecha de modificación');
    expect(component.configuracionTabla[2].encabezado).toBe('Valores anteriores');
    expect(component.configuracionTabla[3].encabezado).toBe('Valores nuevos');
  });

  it('should populate `bitacoraData` when `loadBitacora` is called', () => {
    const MOCK_DATA: BitacoraModel [] = [
      {
        tipoModificacion: 'Test Type',
        fechaModificacion: '2024-02-27',
        valoresAnteriores: 'Old Value',
        valoresNuevos: 'New Value',
      },
    ];

    serviceMock.getBitacora = () => of(MOCK_DATA); // ✅ Providing mock data dynamically

    component.loadBitacora();

    expect(component.bitacoraData).toEqual(MOCK_DATA);
  });

  it('should handle empty data when `getBitacora` returns an empty array', () => {
    serviceMock.getBitacora = () => of([]); // ✅ Returning an empty array

    component.loadBitacora();

    expect(component.bitacoraData.length).toBe(0);
  });
});
