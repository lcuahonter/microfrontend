import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudPageComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call atras on wizardComponent for unknown action', () => {
    component.wizardComponent = new MockWizardComponent() as any;
    const event = { valor: 2, accion: 'unknown' };
    component.getValorIndice(event);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent if valor is out of range', () => {
    component.wizardComponent = new MockWizardComponent() as any;
    component.indice = 1;
    const event = { valor: 10, accion: 'cont' };
    component.getValorIndice(event);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not call wizardComponent if wizardComponent is undefined', () => {
    const event = { valor: 2, accion: 'cont' };
    expect(() => component.getValorIndice(event)).not.toThrow();
  });
});
