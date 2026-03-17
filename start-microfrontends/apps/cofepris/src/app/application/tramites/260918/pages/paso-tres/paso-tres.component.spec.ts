import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoTresComponent', (): void => {
  let componente: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: { navigate: jest.Mock };

  beforeEach(async (): Promise<void> => {
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', (): void => {
    expect(componente).toBeTruthy();
  });

  it('debería navegar si se proporciona una firma válida', (): void => {
    const FIRMA_VALIDA = 'firma123';
    componente.obtieneFirma(FIRMA_VALIDA);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar si la firma está vacía', (): void => {
    componente.obtieneFirma('');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
