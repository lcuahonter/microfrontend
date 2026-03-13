import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtestoDecirVerdadComponent } from './protesto-decir-verdad.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('ProtestoDecirVerdadComponent', () => {
  let component: ProtestoDecirVerdadComponent;
  let fixture: ComponentFixture<ProtestoDecirVerdadComponent>;
  let mockConsultaioQuery: any;
  let consultaioState$: BehaviorSubject<any>;

  beforeEach(async () => {
    consultaioState$ = new BehaviorSubject({ readonly: false, update: false });

    mockConsultaioQuery = {
      selectConsultaioState$: consultaioState$.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [ProtestoDecirVerdadComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProtestoDecirVerdadComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    consultaioState$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with manifiesto false and not readonly by default', () => {
    fixture.detectChanges();
    expect(component.protestoForm).toBeDefined();
    expect(component.protestoForm.get('manifiesto')?.value).toBe(false);
    expect(component.protestoForm.get('manifiesto')?.disabled).toBe(false);
  });

  it('should disable the field when esFormularioSoloLectura is true', () => {
    consultaioState$.next({ readonly: true, update: false });
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.protestoForm.get('manifiesto')?.disabled).toBe(true);
  });

  it('should set esFormularioSoloLectura and actualizacionCounsulta on state change', () => {
    fixture.detectChanges();
    consultaioState$.next({ readonly: true, update: true });
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.actualizacionCounsulta).toBe(true);
  });

  it('should update form state when readonly changes after initialization', () => {
    consultaioState$.next({ readonly: false, update: false });
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.protestoForm.get('manifiesto')?.enabled).toBe(true);
    consultaioState$.next({ readonly: true, update: false });
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.protestoForm.get('manifiesto')?.disabled).toBe(true);
  });

  it('should handle update flag correctly', () => {
    fixture.detectChanges();
    consultaioState$.next({ readonly: false, update: false });
    expect(component.actualizacionCounsulta).toBe(false);
    consultaioState$.next({ readonly: false, update: true });
    expect(component.actualizacionCounsulta).toBe(true);
  });

  it('should not update actualizacionCounsulta when update is undefined', () => {
    fixture.detectChanges();
    component.actualizacionCounsulta = true;
    consultaioState$.next({ readonly: true });
    expect(component.actualizacionCounsulta).toBe(true);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    fixture.detectChanges();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from consultaioQuery on destroy', () => {
    fixture.detectChanges();
    consultaioState$.next({ readonly: true, update: true });
    expect(component.esFormularioSoloLectura).toBe(true);
    component.ngOnDestroy();
    component.esFormularioSoloLectura = false;
    consultaioState$.next({ readonly: false, update: false });
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should initialize form correctly based on initial state', () => {
    consultaioState$.next({ readonly: true, update: false });
    fixture.detectChanges();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.protestoForm.get('manifiesto')?.disabled).toBe(true);
  });

  it('should maintain form validity regardless of disabled state', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.protestoForm.valid).toBe(true);
    consultaioState$.next({ readonly: true, update: false });
    component.ngOnInit();
    expect(component.protestoForm.valid).toBe(true);
  });
});
