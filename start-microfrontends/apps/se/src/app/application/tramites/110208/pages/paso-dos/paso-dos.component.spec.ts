import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteStore } from '../../../../estados/tramite.store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let routerMock: any;
  let serviciosPantallaServiceMock: any;
  let tramiteStoreMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    serviciosPantallaServiceMock = {
      obtenerTramite: jest.fn(),
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ServiciosPantallaService, useValue: serviciosPantallaServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a obtenerTramite y navegar a acuse con una firma válida', () => {
    const mockTramite = { data: { id: 1, name: 'Tramite Test' } };
    serviciosPantallaServiceMock.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('firma-valida');

    expect(serviciosPantallaServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).toHaveBeenCalledWith(mockTramite.data, 'firma-valida');
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('debe manejar el error cuando obtenerTramite falla', () => {
    serviciosPantallaServiceMock.obtenerTramite.mockReturnValue(throwError(() => new Error('Error')));

    component.obtieneFirma('firma-valida');

    expect(serviciosPantallaServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('no debe llamar a obtenerTramite si la firma es inválida', () => {
    component.obtieneFirma('');

    expect(serviciosPantallaServiceMock.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debe completar destroyed$ al destruir el componente', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
