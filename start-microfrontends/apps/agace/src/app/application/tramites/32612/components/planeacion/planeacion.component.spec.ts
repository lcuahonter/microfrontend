import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneacionComponent } from './planeacion.component';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';

// Mock dependencies
class MockConsultaioQuery {
  selectConsultaioState$ = of({});
}
class MockTramite32612Store {
  setDynamicFieldValue = jest.fn();
}
class MockTramite32612Query {
  selectSolicitude$ = of({});
}

describe('PlaneacionComponent', () => {
  let component: PlaneacionComponent;
  let fixture: ComponentFixture<PlaneacionComponent>;
  let tramite32612Store: MockTramite32612Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneacionComponent],
      providers: [
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        { provide: 'Tramite32612Store', useClass: MockTramite32612Store },
        { provide: 'Tramite32612Query', useClass: MockTramite32612Query },
      ],
    }).overrideComponent(PlaneacionComponent, {
      set: {
        providers: [
          { provide: MockConsultaioQuery, useClass: MockConsultaioQuery },
          { provide: MockTramite32612Store, useClass: MockTramite32612Store },
          { provide: MockTramite32612Query, useClass: MockTramite32612Query },
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initialized FormGroups', () => {
    expect(component.analisisDeRiesgoFormGroup).toBeInstanceOf(FormGroup);
    expect(component.politicasFormGroup).toBeInstanceOf(FormGroup);
    expect(component.auditoriasFormGroup).toBeInstanceOf(FormGroup);
    expect(component.contingenciaFormGroup).toBeInstanceOf(FormGroup);
    expect(component.revisionesFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should set consultaState from ConsultaioQuery observable', () => {
    expect(component.consultaState).toBeDefined();
  });

  it('should set solicitudeState from Tramite32612Query observable on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudeState).toBeDefined();
  });


});
