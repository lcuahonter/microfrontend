import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DatosestablecimientoComponent } from './datos-establecimiento.component';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('DatosestablecimientoComponent', () => {
  let component: DatosestablecimientoComponent;
  let fixture: ComponentFixture<DatosestablecimientoComponent>;

  let mockStore: Partial<DatosProcedureStore>;
  let mockQuery: Partial<DatosProcedureQuery>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;

  beforeEach(async () => {
    mockStore = {
      establecerDatos: jest.fn()
    };

    mockQuery = {
      selectProrroga$: of({
        denominacion: 'Valor Store'
      } as any)
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({
        readonly: true
      } as any)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosestablecimientoComponent],
      providers: [
        FormBuilder,
        { provide: DatosProcedureStore, useValue: mockStore },
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosestablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debería llamar a establecerDatos en el store al ejecutar setValoresStore', () => {
    component.seccionState = { denominacion: 'Valor Test' } as any;
    component.crearFormulario();
    component.setValoresStore(component.datosdelestablecimiento, 'denominacion');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ denominacion: 'Valor Test' });
  });

  it('debería llamar a inicializarEstadoFormulario en ngOnInit', () => {
    const spy = jest.spyOn(component as any, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroy$'], 'next');
    const spyComplete = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
