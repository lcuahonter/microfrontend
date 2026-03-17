import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { HttpClientModule } from '@angular/common/http';
import { TramiteFolioService } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let tramiteFolioServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona when obtenerTipoPersona is called', () => {
    component.obtenerTipoPersona(1);
    expect(component.tipoPersona).toBe(1);
  });

  it('should call obtenerTramite and navigate to acuse page when obtieneFirma is called with a valid signature', () => {
    const mockTramite = { data: { id: 123 } };
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('valid-signature');

    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(routerMock.navigate).toHaveBeenCalledWith(['pago/tecnologicos/acuse']);
  });

  it('should handle error when obtieneFirma is called and obtenerTramite fails', () => {
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(throwError(() => new Error('Error occurred')));

    component.obtieneFirma('valid-signature');

    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});