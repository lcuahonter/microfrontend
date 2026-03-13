import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Output, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// Componente mock para firma-electronica
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
      declarations: [FirmarSolicitudComponent, MockFirmaElectronicaComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'servicios-extraordinarios/acuse', redirectTo: '' },
        ]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el componente firma-electronica', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firmaElectronicaElement = compiled.querySelector('firma-electronica');
    expect(firmaElectronicaElement).toBeTruthy();
  });

  it('debe navegar a "servicios-extraordinarios/acuse" cuando obtieneFirma es llamado con una firma válida', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockFirma = 'firmaValida';

    component.obtieneFirma(mockFirma);

    expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debe navegar cuando obtieneFirma es llamado con una firma vacía', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockFirma = '';

    component.obtieneFirma(mockFirma);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});