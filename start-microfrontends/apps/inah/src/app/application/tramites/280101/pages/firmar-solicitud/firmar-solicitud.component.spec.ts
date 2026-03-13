import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// Mock firma-electronica component
@Component({
  selector: 'firma-electronica',
  template: '<div></div>',
})
class MockFirmaElectronicaComponent {
  @Output() firma = new EventEmitter<string>();
}

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirmarSolicitudComponent, MockFirmaElectronicaComponent], // Include the mock component
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'servicios-extraordinarios/acuse', redirectTo: '' }, // Mock route
        ]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inject the router
    fixture.detectChanges(); // Detect initial changes in the template
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the firma-electronica component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firmaElectronicaElement = compiled.querySelector('firma-electronica');
    expect(firmaElectronicaElement).toBeTruthy(); // Verify that the element exists
  });

  it('should navigate to "servicios-extraordinarios/acuse" when obtieneFirma is called with a valid signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate'); // Spy on the router's navigate method
    const mockFirma = 'validSignature';

    component.obtieneFirma(mockFirma);

    expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate'); // Spy on the router's navigate method
    const mockFirma = '';

    component.obtieneFirma(mockFirma);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});