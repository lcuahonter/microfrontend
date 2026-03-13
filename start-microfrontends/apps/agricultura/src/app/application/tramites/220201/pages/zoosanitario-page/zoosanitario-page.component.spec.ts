import { ZoosanitarioPageComponent } from './zoosanitario-page.component';

describe('ZoosanitarioPageComponent', () => {
  let component: ZoosanitarioPageComponent;

  beforeEach(() => {
    component = new ZoosanitarioPageComponent(
      { idSolicitud$: { subscribe: (fn: any) => fn('123') } } as any,
      { selectConsultaioState$: { pipe: () => ({ subscribe: () => {} }) } } as any
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tituloMensaje on enTabChange', () => {
    component.enTabChange(1);
    expect(component.tituloMensaje).toBe('Captura del certificado zoosanitario para importación');
  });

  it('sumarDiezNumeros should sum 10 numbers', () => {
    const result = ZoosanitarioPageComponent.sumarDiezNumeros([1,2,3,4,5,6,7,8,9,10]);
    expect(result).toBe(55);
  });

  it('sumarDiezNumeros should throw error if not 10 numbers', () => {
    expect(() => ZoosanitarioPageComponent.sumarDiezNumeros([1,2,3])).toThrow();
  });

  it('getValorIndice should update indice and datosPasos', () => {
    component.componenteWizard = { siguiente: () => {}, atras: () => {}, indiceActual: 1 } as any;
    component.indice = 1;
    component.pasos = [{}, {}, {}] as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('anterior should update indice', () => {
    component.componenteWizard = { atras: () => {}, indiceActual: 1 } as any;
    component.anterior();
    expect(component.indice).toBe(2);
  });

  it('siguiente should update indice', () => {
    component.componenteWizard = { siguiente: () => {}, indiceActual: 2 } as any;
    component.siguiente();
    expect(component.indice).toBe(3);
  });

  it('onClickCargaArchivos should emit cargarArchivosEvento', () => {
    spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('manejaEventoCargaDocumentos should set activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('cargaRealizada should update seccionCargarDocumentos', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBeFalsy();
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('onCargaEnProgresoPadre should set cargaEnProgreso', () => {
    component.onCargaEnProgresoPadre(false);
    expect(component.cargaEnProgreso).toBeFalsy();
  });
});