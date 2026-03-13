import { ModificarFusionEscisionComponent } from './modificar-fusion-escision.component';
import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('ModificarFusionEscisionComponent', () => {
  let component: ModificarFusionEscisionComponent;
  let locationMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let tercerosServiceMock: any;

  beforeEach(() => {
    locationMock = { back: jest.fn() };
    tramiteStoreMock = {
      setAvisoDatos: jest.fn(),
      updateFusionDatos: jest.fn()
    };
    tramiteQueryMock = {};
    tercerosServiceMock = {
      fusion$: of([
        {
          certificacionModal: '1',
          rfcBusquedaModal: 'RFCX',
          razonSocialFusionante: 'RSF',
          folioVucemFusionante: 'FOLIO',
          fechaInicioVigenciaFusionante: '2024-01-01',
          fechaFinVigenciaFusionante: '2024-12-31',
          rfcBusquedaModalSC: 'RFCSC',
          razonSocialFusionanteSC: 'RSSC'
        }
      ]),
      obtenerDatosPersona: jest.fn()
    };
    component = new ModificarFusionEscisionComponent(
      new FormBuilder(),
      locationMock,
      tramiteStoreMock,
      tramiteQueryMock,
      tercerosServiceMock
    );
    component.selectedFusion = {
      certificacionModal: '1',
      rfcBusquedaModal: 'RFCX',
      razonSocialFusionante: 'RSF',
      folioVucemFusionante: 'FOLIO',
      fechaInicioVigenciaFusionante: '2024-01-01',
      fechaFinVigenciaFusionante: '2024-12-31',
      rfcBusquedaModalSC: 'RFCSC',
      razonSocialFusionanteSC: 'RSSC'
    } as any;
  });

  it('should initialize form with selectedFusion on inicializarFormulario', () => {
    component.inicializarFormulario();
    expect(component.fusionEscisionForm).toBeDefined();
    expect(component.fusionEscisionForm.get('rfcBusquedaModal')?.value).toBe('RFCX');
    expect(component.fusionEscisionForm.get('razonSocialFusionante')?.value).toBe('RSF');
  });

  it('should set selectedFusion from fusion$ on ngOnInit', () => {
    component.selectedFusion = {} as any;
    component.ngOnInit();
    expect(component.selectedFusion.rfcBusquedaModal).toBe('RFCX');
  });

  it('should disable/enable fields on mostrarCertificacion', () => {
    component.inicializarFormulario();
    component.fusionEscisionForm.get('certificacionModal')?.setValue('1');
    component.mostrarCertificacion();
    expect(component.fusionEscisionForm.get('razonSocialFusionante')?.disabled).toBe(true);
    expect(component.fusionEscisionForm.get('razonSocialFusionanteSC')?.disabled).toBe(true);

    component.fusionEscisionForm.get('certificacionModal')?.setValue('0');
    component.mostrarCertificacion();
    expect(component.fusionEscisionForm.get('razonSocialFusionanteSC')?.enabled).toBe(true);
  });

  it('should patch form and call setAvisoDatos on cargarDatosPersonaFusionada', () => {
    component.inicializarFormulario();
    const datos = {
      razonSocial: 'RSX',
      numFolioTramite: 'FOLIOX',
      fechaInicioVigencia: '2024-02-01',
      fechaFinVigencia: '2024-12-01'
    };
    tercerosServiceMock.obtenerDatosPersona.mockReturnValue(of(datos));
    component.fusionEscisionForm.get('rfcBusquedaModal')?.setValue('RFCNEW');
    component.cargarDatosPersonaFusionada();

    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('razonSocialFusionante', 'RSX');
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('folioVucemFusionante', 'FOLIOX');
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('fechaInicioVigenciaFusionante', '2024-02-01');
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('fechaFinVigenciaFusionante', '2024-12-01');
  });

  it('should add fusionEscisionData, update store, reset form, and call back on agregarFusionEscision', () => {
    component.inicializarFormulario();
    component.fusionEscisionForm.patchValue({
      certificacionModal: '1',
      rfcBusquedaModal: 'RFCNEW',
      razonSocialFusionante: 'RSX',
      folioVucemFusionante: 'FOLIOX',
      fechaInicioVigenciaFusionante: '2024-02-01',
      fechaFinVigenciaFusionante: '2024-12-01',
      rfcBusquedaModalSC: 'RFCSCX',
      razonSocialFusionanteSC: 'RSSCX'
    });
    component.agregarFusionEscision();
    expect(component.fusionEscisionData.length).toBe(1);
    expect(tramiteStoreMock.updateFusionDatos).toHaveBeenCalledWith(component.fusionEscisionData);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call back on cerrarDialogoFusionEscision', () => {
    component.cerrarDialogoFusionEscision();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call setAvisoDatos on cambioRFC', () => {
    component.inicializarFormulario();
    component.fusionEscisionForm.get('rfcBusquedaModal')?.setValue('RFCVAL');
    component.cambioRFC();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('rfcBusquedaModal', 'RFCVAL');
  });

  it('should call setAvisoDatos on cambioRfcSC', () => {
    component.inicializarFormulario();
    component.fusionEscisionForm.get('rfcBusquedaModalSC')?.setValue('RFCSCVAL');
    component.cambioRfcSC();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith( 'rfcBusquedaModalSC', 'RFCSCVAL');

  });

  it('should call setAvisoDatos on cambioRazonSocialSC', () => {
    component.inicializarFormulario();
    component.fusionEscisionForm.addControl('razonSocialSC', component.fusionEscisionForm.get('razonSocialFusionanteSC')!);
    component.fusionEscisionForm.get('razonSocialSC')?.setValue('RSVAL');
    component.cambioRazonSocialSC();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('razonSocialSC', 'RSVAL');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
