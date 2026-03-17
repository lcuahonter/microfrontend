import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260216Query } from '../../estados/tramite260216Query.query';
import { Tramite260216Store } from '../../estados/tramite260216Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportacionDispositivosMedicosDonacionService } from '../../services/importacion-dispositivos-medicos-donacion.service';
import { of, Subject } from 'rxjs';

jest.mock('../../estados/tramite260216Query.query');
jest.mock('../../estados/tramite260216Store.store');
jest.mock('@ng-mf/data-access-user');
jest.mock('../../services/importacion-dispositivos-medicos-donacion.service');

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let tramite260216QueryMock: jest.Mocked<Tramite260216Query>;
  let tramite260216StoreMock: jest.Mocked<Tramite260216Store>;
  let consultaQueryMock: jest.Mocked<ConsultaioQuery>;
  let importacionServiceMock: jest.Mocked<ImportacionDispositivosMedicosDonacionService>;

  beforeEach(() => {
    tramite260216QueryMock = {
      selectTramiteState$: of({}),
      getTabSeleccionado$: of(1),
    } as any;

    tramite260216StoreMock = {
      update: jest.fn(),
      updateTabSeleccionado: jest.fn(),
    } as any;

    consultaQueryMock = {
      selectConsultaioState$: of({ procedureId: '260216', update: true, readonly: false }),
    } as any;

    importacionServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Tramite260216Query, useValue: tramite260216QueryMock },
        { provide: Tramite260216Store, useValue: tramite260216StoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ImportacionDispositivosMedicosDonacionService, useValue: importacionServiceMock },
      ],
    });

    component = new PasoUnoComponent(
      tramite260216QueryMock,
      tramite260216StoreMock,
      consultaQueryMock,
      importacionServiceMock
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize and call guardarDatosFormulario if procedureId is 260216 and update is true', () => {
      const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
      component.ngOnInit();
      expect(guardarDatosFormularioSpy).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('should set indice from tramite260216Query', () => {
      component.ngOnInit();
      expect(component.indice).toBe(1);
    });
  });

  describe('guardarDatosFormulario', () => {
    it('should call getRegistroTomaMuestrasMercanciasData and actualizarEstadoFormulario', (done) => {
      const mockData = { campo: 'valor' } as any;
      const actualizarEstadoFormularioSpy = jest.spyOn(component, 'actualizarEstadoFormulario');
      importacionServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockData));

      component.guardarDatosFormulario();

      setTimeout(() => {
        expect(importacionServiceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
        expect(actualizarEstadoFormularioSpy).toHaveBeenCalledWith(mockData);
        expect(component.esDatosRespuesta).toBe(true);
        done();
      });
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should update tramite260216Store with provided data', () => {
      const mockData = { campo: 'valor' } as any;
      component.actualizarEstadoFormulario(mockData);
      expect(tramite260216StoreMock.update).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('seleccionaTab', () => {
    it('should call updateTabSeleccionado with the provided index', () => {
      component.seleccionaTab(2);
      expect(tramite260216StoreMock.updateTabSeleccionado).toHaveBeenCalledWith(2);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$', () => {
      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      component.ngOnDestroy();
      expect(destroyNotifierSpy).toHaveBeenCalled();
      expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
    });
  });
});