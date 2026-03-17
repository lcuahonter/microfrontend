import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { of, Subject } from 'rxjs';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramiteQueryMock = {
      getPagoDerechos$: of({ monto: 100, referencia: 'ABC123' })
    };

    tramiteStoreMock = {
      updatePagoDerechosFormState: jasmine.createSpy('updatePagoDerechosFormState')
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true })
    };

    await TestBed.configureTestingModule({
      imports: [PagoDeDerechosContenedoraComponent],
      providers: [
        { provide: 'Tramite240411Query', useValue: tramiteQueryMock },
        { provide: 'Tramite240411Store', useValue: tramiteStoreMock },
        { provide: 'ConsultaioQuery', useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer el formulario en solo lectura si el estado lo indica', () => {
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('debería cargar el estado del formulario de pago de derechos al inicializar', () => {
    expect(component.pagoDerechoFormState).toBeDefined();
  });

  it('debería actualizar el estado del formulario de pago de derechos en el store', () => {
    const nuevoEstado = { monto: 200, referencia: 'XYZ789' };
     expect(tramiteStoreMock.updatePagoDerechosFormState).toHaveBeenCalledWith(nuevoEstado);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spy = spyOn(component['unsubscribe$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['unsubscribe$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});