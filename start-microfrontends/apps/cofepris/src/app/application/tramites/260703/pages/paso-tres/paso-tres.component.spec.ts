import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a la ruta de acuse si la firma es válida', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.obtieneFirma('FIRMA_VALIDA');
    expect(spy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar si la firma es vacía', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.obtieneFirma('');
    expect(spy).not.toHaveBeenCalled();
  });
});