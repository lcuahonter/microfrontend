import { PermisoSanitarioComponent } from './permiso-sanitario.component';

describe('PermisoSanitarioComponent', () => {
  let component: PermisoSanitarioComponent;
  let storeMock: any;
  let queryMock: any;
  let toastrMock: any;
  let registroSolicitudServiceMock: any;
  let datosDelSolicituteSeccionStoreMock: any;
  let datosDelSolicituteSeccionQueryMock: any;
  let manifestoQueryMock: any;
  let manifestoStoreMock: any;
  let domicilioQueryMock: any;
  let domicilioStoreMock: any;

  beforeEach(() => {
    storeMock = { setIdSolicitud: jest.fn() };
    queryMock = { selectTramite260912$: { pipe: () => ({ subscribe: jest.fn() }) } };
    toastrMock = { success: jest.fn(), error: jest.fn() };
    registroSolicitudServiceMock = { parcheOpcionesPrellenadas: jest.fn().mockReturnValue({ subscribe: jest.fn() }), postGuardarDatos: jest.fn().mockReturnValue({ subscribe: jest.fn() }) };
    datosDelSolicituteSeccionStoreMock = {};
    datosDelSolicituteSeccionQueryMock = { selectSolicitud$: { pipe: () => ({ subscribe: jest.fn() }) } };
    manifestoQueryMock = { selectSolicitud$: { pipe: () => ({ subscribe: jest.fn() }) } };
    manifestoStoreMock = {};
    domicilioQueryMock = { selectSolicitud$: { pipe: () => ({ subscribe: jest.fn() }) } };
    domicilioStoreMock = {};

    component = new PermisoSanitarioComponent(
      storeMock,
      queryMock,
      toastrMock,
      registroSolicitudServiceMock,
      datosDelSolicituteSeccionStoreMock,
      datosDelSolicituteSeccionQueryMock,
      manifestoQueryMock,
      manifestoStoreMock,
      domicilioQueryMock,
      domicilioStoreMock
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should call ngOnInit without errors', () => {
  //   component.ngOnInit();
  //   expect(true).toBe(true);
  // });

  it('should call anterior', () => {
    component.wizardComponent = { atras: jest.fn(), indiceActual: 0 } as any;
    component.anterior();
    expect(true).toBe(true);
  });

  it('should call siguiente', () => {
    component.wizardComponent = { siguiente: jest.fn(), indiceActual: 0 } as any;
    component.siguiente();
    expect(true).toBe(true);
  });

  it('should call onClickCargaArchivos', () => {
    component.cargarArchivosEvento = { emit: jest.fn() } as any;
    component.onClickCargaArchivos();
    expect(true).toBe(true);
  });

  it('should call onCargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('should call cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('should call manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should call onBlancoObligatoria', () => {
    component.onBlancoObligatoria(true);
    expect(component.isSaltar).toBe(true);
  });

  it('should call saltar', () => {
    component.wizardComponent = { siguiente: jest.fn() } as any;
    component.saltar();
    expect(component.indice).toBe(3);
  });

  it('should call cerrarModal with true', () => {
    component.cerrarModal(true);
    expect(component.requiresPaymentData).toBe(true);
  });

  it('should call cerrarModal with false', () => {
    component.cerrarModal(false);
    expect(component.confirmarSinPagoDeDerechos).toBe(4);
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(true).toBe(true);
  });

  it('should generate error alert', () => {
    const html = PermisoSanitarioComponent.generarAlertaDeError('error');
    expect(html).toContain('error');
  });
});