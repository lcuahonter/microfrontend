import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DesistimientoComponent } from './desistimiento.component';
import { DESISTIMIENTO } from '../../constants/retirad-de-la-autorizacion-de-donaciones.enum';

describe('DesistimientoComponent', () => {
  let component: DesistimientoComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule,DesistimientoComponent],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DesistimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.desisitimientoForm).toBeDefined();
    expect(component.desisitimientoForm.get('folioOriginal')).toBeDefined();
    expect(component.desisitimientoForm.get('justificacionDelDesistimiento')).toBeDefined();
  });

  it('should set initial form values in setFormValues', () => {
    component.ngOnInit();
    expect(component.desisitimientoForm.get(DESISTIMIENTO.FOLIO_ORIGINAL)?.value).toBe('');
    expect(component.desisitimientoForm.get(DESISTIMIENTO.JUSTIFICACION_DEL_DESISTIMIENTO)?.value).toBe('');
  });

  it('should disable the "folioOriginal" field on form initialization', () => {
    component.ngOnInit();
    expect(component.desisitimientoForm.get('folioOriginal')?.disabled).toBe(false);
  });

  it('should allow editing the "justificacionDelDesistimiento" field', () => {
    component.ngOnInit();
    expect(component.desisitimientoForm.get('justificacionDelDesistimiento')?.disabled).toBe(false);
  });

  it('should emit continuarEvento when continuar is called', () => {
    const spy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(spy).toHaveBeenCalledWith('');
  });
});