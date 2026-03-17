import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarGanadoresComponent } from './consultar.component';
import { FormBuilder } from '@angular/forms';

describe('ConsultarGanadoresComponent (básico)', () => {
  let component: ConsultarGanadoresComponent;
  let fixture: ComponentFixture<ConsultarGanadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarGanadoresComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarGanadoresComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();

    expect(component.FormBusquedaTramite).toBeDefined();
    expect(component.FormBusquedaTramite.contains('licitacion')).toBe(true);
    expect(component.FormBusquedaTramite.contains('producto')).toBe(true);
    expect(component.FormBusquedaTramite.contains('clasificacion')).toBe(true);
  });
});
