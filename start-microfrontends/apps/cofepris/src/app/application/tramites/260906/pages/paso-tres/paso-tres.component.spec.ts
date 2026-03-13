import { PasotresComponent } from './paso-tres.component';
import { JSONResponse, TramiteFolioService, TramiteFolioStore } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('PasotresComponent', () => {
  let componente: PasotresComponent;
  let fixture: ComponentFixture<PasotresComponent>;
  let routerMock: jest.Mocked<Router>;
  let tramiteServiceMock: jest.Mocked<TramiteFolioService>;
  let tramiteStoreMock: jest.Mocked<TramiteFolioStore>;

  const TRAMITE_MOCK: JSONResponse = {
    id: 101,
    descripcion: 'Trámite exitoso',
    codigo: '2025-OK',
    data: JSON.stringify({
      folio: 'FOLIO123',
      fecha: '2025-05-07',
    }),
  };
  

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    tramiteServiceMock = {
      obtenerTramite: jest.fn()
    } as unknown as jest.Mocked<TramiteFolioService>;

    tramiteStoreMock = {
      establecerTramite: jest.fn()
    } as unknown as jest.Mocked<TramiteFolioStore>;

    await TestBed.configureTestingModule({
      declarations: [PasotresComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteServiceMock },
        { provide: TramiteFolioStore, useValue: tramiteStoreMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasotresComponent);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('no debería llamar al servicio si firma es vacía', () => {
    componente.obtieneFirma('');

    expect(tramiteServiceMock.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería manejar error sin lanzar excepción', () => {
    tramiteServiceMock.obtenerTramite.mockReturnValue(throwError(() => new Error('Error servicio')));

    expect(() => componente.obtieneFirma('FIRMA_ERROR')).not.toThrow();
  });
});
