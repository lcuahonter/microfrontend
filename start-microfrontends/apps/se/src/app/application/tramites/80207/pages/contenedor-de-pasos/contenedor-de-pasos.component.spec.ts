import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';
import {
  BtnContinuarComponent,
  SolicitanteComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContenedorDePasosComponent', () => {
  let component: ContenedorDePasosComponent;
  let fixture: ComponentFixture<ContenedorDePasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenedorDePasosComponent, PasoUnoComponent],
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent],
      providers: [provideHttpClient(withInterceptorsFromDi())],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDePasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should perform simple arithmetic', () => {
    const sum = 2 + 2;
    expect(sum).toBe(4);
    expect(sum).toBeGreaterThan(3);
  });

  it('should have tramiteId property', () => {
    expect(component.tramiteId).toBeDefined();
    expect(component.tramiteId).toBe('80207');
  });

  it('should have indice property as number', () => {
    expect(typeof component.indice).toBe('number');
    expect(component.indice).toBeGreaterThan(0);
  });

  it('should have pasos array', () => {
    expect(Array.isArray(component.pasos)).toBe(true);
    expect(component.pasos.length).toBeGreaterThan(0);
  });

  it('should have basic methods defined', () => {
    expect(typeof component.ngOnInit).toBe('function');
    expect(typeof component.ngOnDestroy).toBe('function');
    expect(typeof component.getValorIndice).toBe('function');
  });
});
