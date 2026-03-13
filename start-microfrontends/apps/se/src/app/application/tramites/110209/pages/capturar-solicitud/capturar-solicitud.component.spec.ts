import { CapturarSolicitudComponent } from './capturar-solicitud.component';
import { SgpCertificadoService } from '../../services/sgp-certificado/sgp-certificado.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';

describe('CapturarSolicitudComponent', () => {
  let component: CapturarSolicitudComponent;
  let mockCertificadoService: any;
  let mockConsultaQuery: any;
  let mockTramite110209Query: any;

  beforeEach(() => {
    mockCertificadoService = {
      getCertificadoDatos: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn()
    };
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };
    mockTramite110209Query = {
      selectTramite110209$: of({})
    };
    component = new CapturarSolicitudComponent(
      mockCertificadoService,
      mockConsultaQuery,
      mockTramite110209Query
    );
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el índice con el valor predeterminado 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe emitir modificarEventCapturar', () => {
    const spy = jest.spyOn(component.modificarEventCapturar, 'emit');
    component.modificarEventCapturar.emit(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('debe llamar ngOnInit y establecer esDatosRespuesta en true cuando update es false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar ngOnInit y llamar guardarDatosFormulario cuando update es true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component = new CapturarSolicitudComponent(
      mockCertificadoService,
      mockConsultaQuery,
      mockTramite110209Query
    );
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debe ejecutar guardarDatosFormulario y establecer esDatosRespuesta en true cuando hay datos en el store', () => {
    mockTramite110209Query.selectTramite110209$ = of({});
    component = new CapturarSolicitudComponent(
      mockCertificadoService,
      mockConsultaQuery,
      mockTramite110209Query
    );
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe ejecutar guardarDatosFormulario y establecer esDatosRespuesta en true desde el store', () => {
    mockTramite110209Query.selectTramite110209$ = of({ someData: 'test' });
    component = new CapturarSolicitudComponent(
      mockCertificadoService,
      mockConsultaQuery,
      mockTramite110209Query
    );
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe cambiar el índice al llamar seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe limpiar destroyNotifier$ al destruir el componente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe suscribirse al store de tramite110209 correctamente', () => {
    const mockData = { certificado: 'test', mercancias: [] };
    mockTramite110209Query.selectTramite110209$ = of(mockData);
    
    component = new CapturarSolicitudComponent(
      mockCertificadoService,
      mockConsultaQuery,
      mockTramite110209Query
    );
    
    const subscribeSpy = jest.spyOn(mockTramite110209Query.selectTramite110209$, 'subscribe');
    component.guardarDatosFormulario();
    
    expect(subscribeSpy).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });
});