import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MercanciaSolicitudComponent } from './mercancia-solicitud.component';
import { provideHttpClient } from '@angular/common/http';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { of } from 'rxjs';

// Servicio simulado
const servicioSimulado = {
  obtenerDetallesDelCatalogo: jest.fn(() => of({ data: [] })),
  obtenerDatos: jest.fn(() => of({ selectedmercanciaGroupDatos: {} })),
};

describe('MercanciaSolicitudComponent', () => {
  let componente: MercanciaSolicitudComponent;
  let fixture: ComponentFixture<MercanciaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercanciaSolicitudComponent], // ✅ importar componente independiente aquí
      providers: [
        { provide: ImportacionDeAcuiculturaService, useValue: servicioSimulado },
        provideHttpClient(), // ✅ opcional si el componente usa HttpClient directamente
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MercanciaSolicitudComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario mercanciaGroup con los controles requeridos', () => {
    expect(componente.mercanciaGroup.contains('tipoRequisito')).toBeTruthy();
    expect(componente.mercanciaGroup.contains('requisito')).toBeTruthy();
  });
});
