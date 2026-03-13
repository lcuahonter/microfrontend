import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlesDeAccesoComponent } from './controles-de-acceso.component';
import { FormGroup } from '@angular/forms';

// Mocks for dependencies
class Tramite32612StoreMock {
  setDynamicFieldValue = jest.fn();
}
class Tramite32612QueryMock {
  selectSolicitude$ = {
    pipe: jest.fn(() => ({
      subscribe: jest.fn(),
    })),
  };
}
class ConsultaioQueryMock {
  selectConsultaioState$ = {
    pipe: jest.fn(() => ({
      subscribe: jest.fn(),
    })),
  };
}

describe('ControlesDeAccesoComponent', () => {
  let component: ControlesDeAccesoComponent;
  let fixture: ComponentFixture<ControlesDeAccesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlesDeAccesoComponent],
      providers: [
        { provide: 'Tramite32612Store', useClass: Tramite32612StoreMock },
        { provide: 'Tramite32612Query', useClass: Tramite32612QueryMock },
        { provide: 'ConsultaioQuery', useClass: ConsultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlesDeAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial FormGroup structure', () => {
    expect(component.forma.get('personalFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('identificacionFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('entregasFormGroup')).toBeInstanceOf(FormGroup);
  });

  it('should return correct FormGroup getters', () => {
    expect(component.personalFormGroup).toBe(component.forma.get('personalFormGroup'));
    expect(component.identificacionFormGroup).toBe(component.forma.get('identificacionFormGroup'));
    expect(component.entregasFormGroup).toBe(component.forma.get('entregasFormGroup'));
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
