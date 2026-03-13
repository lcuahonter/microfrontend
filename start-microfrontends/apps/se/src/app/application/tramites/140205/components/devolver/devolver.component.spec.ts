import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevolverComponent } from './devolver.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tramite140103Store } from '../../../../estados/tramites/tramite140103.store';
import { Tramite140103Query } from '../../../../estados/queries/tramite140103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DevolverComponent', () => {
  let component: DevolverComponent;
  let fixture: ComponentFixture<DevolverComponent>;
  let tramite140103StoreMock: any;
  let tramite140103QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite140103StoreMock = {
      setRegimen: jest.fn(),
      setMecanismo: jest.fn(),
      setTratado: jest.fn(),
      setProducto: jest.fn(),
      setSubproducto: jest.fn(),
      setRepresentacion: jest.fn(),
    };
    tramite140103QueryMock = {
      selectSolicitud$: of({
        cantidad: 5,
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [DevolverComponent, ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite140103Store, useValue: tramite140103StoreMock },
        { provide: Tramite140103Query, useValue: tramite140103QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DevolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es true en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.devolverForm.enable();
    component.guardarDatosFormulario();
    expect(component.devolverForm.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es false en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.devolverForm.disable();
    component.guardarDatosFormulario();
    expect(component.devolverForm.enabled).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si devolverForm existe y esFormularioSoloLectura es true en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar al método correcto del store en setValoresStore', () => {
    const form = component.devolverForm;
    form.get('cantidad')?.setValue(10);
    component.setValoresStore(form, 'cantidad', 'setRegimen');
    expect(tramite140103StoreMock.setRegimen).toHaveBeenCalledWith(10);
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});

