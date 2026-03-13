import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { DatosSolicitudService } from '../../services/datoSolicitude.service';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
import { of } from 'rxjs';

describe('DatosSolicitudComponent', () => {
  let COMPONENT: DatosSolicitudComponent;
  let MOCK_DATOS_SOLICITUD_SERVICE: { isValid: jest.Mock };
  let MOCK_DATOS_PROCEDURE_STORE: { establecerDatos: jest.Mock };
  let MOCK_DATOS_PROCEDURE_QUERY: { selectideGenerica1$: jest.Mock };

  beforeEach(() => {
    MOCK_DATOS_SOLICITUD_SERVICE = {
      isValid: jest.fn() as jest.Mock,
    };

    MOCK_DATOS_PROCEDURE_STORE = {
      establecerDatos: jest.fn(),
    };

    MOCK_DATOS_PROCEDURE_QUERY = {
      selectideGenerica1$: jest.fn().mockReturnValue(
        of({
          ideGenerica1: 'ideGenerica1',
          observaciones: 'Alguna justificación',
        })
      ),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: MOCK_DATOS_SOLICITUD_SERVICE },
        { provide: DatosProcedureStore, useValue: MOCK_DATOS_PROCEDURE_STORE },
        { provide: DatosProcedureQuery, useValue: MOCK_DATOS_PROCEDURE_QUERY },
      ],
    }).compileComponents();

    const FIXTURE = TestBed.createComponent(DatosSolicitudComponent);
    COMPONENT = FIXTURE.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(COMPONENT).toBeTruthy();
  });

  it('debería llamar a establecerDatos en el store cuando se llama setValoresStore', () => {
    const FORM = new FormBuilder().group({
      ideGenerica1: ['ideGenerica1'],
    });
    COMPONENT.setValoresStore(FORM, 'ideGenerica1');
    expect(MOCK_DATOS_PROCEDURE_STORE.establecerDatos).toHaveBeenCalledWith({ ideGenerica1: 'ideGenerica1' });
  });

  it('debería emitir setValoresStoreEvent cuando se llama setValoresStore', () => {
    const FORM = new FormBuilder().group({
      observaciones: ['Alguna justificación'],
    });
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const DESTROY_SPY = jest.spyOn(COMPONENT['destroy$'], 'next');
    const COMPLETE_SPY = jest.spyOn(COMPONENT['destroy$'], 'complete');
    COMPONENT.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalledWith();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });

});
