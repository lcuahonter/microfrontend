import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaComponent } from './persona.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudDeRegistroInvocarService } from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
import { of } from 'rxjs';

describe('PersonaComponent', () => {
  let component: PersonaComponent;
  let fixture: ComponentFixture<PersonaComponent>;
  let mockService: Partial<SolicitudDeRegistroInvocarService>;

  beforeEach(async () => {
    mockService = {
      obtenerPersonaTablaDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Test Persona' }] })),
    };

    await TestBed.configureTestingModule({
      imports: [PersonaComponent, HttpClientTestingModule],
      providers: [
        { provide: SolicitudDeRegistroInvocarService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize personasTablaDatos on init', () => {
    expect(component.personasTablaDatos).toEqual([{ id: 1, nombre: 'Test Persona' }]);
  });

  it('should call obtenerPersonaTablaDatos on service when obtenerTablaDatos is called', () => {
    const serviceSpy = jest.spyOn(mockService, 'obtenerPersonaTablaDatos');
    component.obtenerTablaDatos();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
