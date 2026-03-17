import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SociosComercialesComponent } from './socios-comerciales.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

describe('SociosComercialesComponent', () => {
  let component: SociosComercialesComponent;
  let fixture: ComponentFixture<SociosComercialesComponent>;
  let mockTramite32612Store: any;
  let mockTramite32612Query: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockTramite32612Store = { setDynamicFieldValue: jest.fn() };
    mockTramite32612Query = { selectSolicitude$: of({ test: 'state' }) };
    mockConsultaioQuery = { selectConsultaioState$: of({ test: 'consultaState' }) };

    await TestBed.configureTestingModule({
      imports: [SociosComercialesComponent],
      providers: [
        { provide: Tramite32612Store, useValue: mockTramite32612Store },
        { provide: Tramite32612Query, useValue: mockTramite32612Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SociosComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudeState on ngOnInit', () => {
    expect(component.solicitudeState).toEqual({ test: 'state' });
  });

  it('should initialize consultaState in constructor', () => {
    expect(component.consultaState).toEqual({ test: 'consultaState' });
  });

  it('should emit value change', () => {
    const event = { campo: 'field', valor: 'value' };
    component.emitirCambioDeValor(event);
    expect(mockTramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('field', 'value');
  });

  it('should return criteriosFormGroup and requerimientosFormGroup', () => {
    expect(component.criteriosFormGroup).toBeInstanceOf(FormGroup);
    expect(component.requerimientosFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
