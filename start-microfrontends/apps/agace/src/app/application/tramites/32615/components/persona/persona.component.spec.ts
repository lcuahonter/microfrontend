import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaComponent } from './persona.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecintoFiscalizadoService } from '../../services/recinto-fiscalizado.service';
import { of } from 'rxjs';

describe('PersonaComponent', () => {
  let component: PersonaComponent;
  let fixture: ComponentFixture<PersonaComponent>;
  let mockService: Partial<RecintoFiscalizadoService>;

  beforeEach(async () => {
    mockService = {
      obtenerPersonaTablaDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Test Persona' }] })),
    };

    await TestBed.configureTestingModule({
      imports: [PersonaComponent, HttpClientTestingModule],
      providers: [
        { provide: RecintoFiscalizadoService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar personasTablaDatos al iniciar', () => {
    expect(component.personasTablaDatos).toEqual([{ id: 1, nombre: 'Test Persona' }]);
  });

  it('debería llamar a obtenerPersonaTablaDatos del servicio cuando se ejecuta obtenerTablaDatos', () => {
    const serviceSpy = jest.spyOn(mockService, 'obtenerPersonaTablaDatos');
    component.obtenerTablaDatos();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('debería cancelar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});