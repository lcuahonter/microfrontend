import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;
  let router: Router;

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirmarSolicitudComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    (mockRouter.navigate as jest.Mock).mockClear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "servicios-extraordinarios/acuse" if firma is provided', () => {
    component.obtieneFirma('FIRMA_VALIDADA');
    expect(router.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate if firma is an empty string', () => {
    component.obtieneFirma('');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
