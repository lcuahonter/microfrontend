import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
 
import { PasotresComponent } from './paso-tres.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
 
describe('PasotresComponent', () => {
  let component: PasotresComponent;
  let fixture: ComponentFixture<PasotresComponent>;
  let routerMock: any;
  let serviciosMock: any;
  let storeMock: any;
 
  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    serviciosMock = { obtenerTramite: jest.fn() };
    storeMock = { establecerTramite: jest.fn() };
 
    await TestBed.configureTestingModule({
      declarations: [PasotresComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ServiciosPantallaService, useValue: serviciosMock },
        { provide: TramiteCofeprisStore, useValue: storeMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
 
    fixture = TestBed.createComponent(PasotresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
 
  it('debe llamar a establecerTramite y navegar si la FIRMA es válida', () => {
    const tramiteData = { data: { id: 1 } };
    serviciosMock.obtenerTramite.mockReturnValue(of(tramiteData));
    const firma = 'FIRMA_VALIDA';
 
    component.obtieneFirma(firma);
 
    expect(serviciosMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(storeMock.establecerTramite).toHaveBeenCalledWith(tramiteData.data, firma);
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });
 
  it('no debe llamar a obtenerTramite si la FIRMA es falsy', () => {
    component.obtieneFirma('');
    expect(serviciosMock.obtenerTramite).not.toHaveBeenCalled();
    expect(storeMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
 
  it('debe manejar errores en el observable de obtenerTramite', () => {
    serviciosMock.obtenerTramite.mockReturnValue(throwError(() => new Error('error')));
    const firma = 'FIRMA_VALIDA';
    expect(() => component.obtieneFirma(firma)).not.toThrow();
    expect(serviciosMock.obtenerTramite).toHaveBeenCalledWith(19);
  });
 
  it('debe limpiar destroyed$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});