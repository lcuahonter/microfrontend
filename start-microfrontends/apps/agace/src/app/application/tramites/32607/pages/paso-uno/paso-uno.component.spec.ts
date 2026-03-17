import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
        PasoUnoComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });


  it('should set esDatosRespuesta to true if consultaState.update is false on ngOnInit', () => {
    component.consultaState = { update: false } as any;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
    expect(guardarSpy).not.toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if consultaState.update is true on ngOnInit', () => {
    component.consultaState = { update: true } as any;
    jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    component.guardarDatosFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });
});
