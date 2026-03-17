import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PasoUnoComponent],
  declarations: [SolicitantePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideHttpClient(),
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        })]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos and datosPasos on ngOnInit', () => {
    expect(component.pasos.length).toBe(3);
    expect(component.datosPasos.nroPasos).toBe(3);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should update paso title on ngOnInit', () => {
    const paso = component.pasos.find(p => p.indice === 2);
    expect(paso?.titulo).toBe('Anexar necesarios');
  });

  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras on getValorIndice with accion "prev"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.getValorIndice({ accion: 'prev', valor: 1 });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call getValorIndice on continuar', () => {
    const getValorIndiceSpy = jest.spyOn(component, 'getValorIndice');
    const expectedValor = component.indice + 1;
    component.continuar();
    expect(getValorIndiceSpy).toHaveBeenCalledWith({ accion: 'cont', valor: expectedValor });
  });

  it('should render paso-uno component when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    // The template uses a custom switch syntax; assert the compiled HTML contains the tag
    expect(fixture.nativeElement.innerHTML).toContain('app-paso-uno');
  });

  it('should render paso-tres component when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    // The template uses a custom switch syntax; assert the compiled HTML contains the tag
    expect(fixture.nativeElement.innerHTML).toContain('paso-firma');
  });

  it('should render app-paso-dos component when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    // The template uses a custom switch syntax; assert the compiled HTML contains the tag
    expect(fixture.nativeElement.innerHTML).toContain('app-paso-carga-documento');
  });

  it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('onCargaEnProgreso should set cargaEnProgreso', () => {
    component.cargaEnProgreso = false;
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('cargaRealizada should toggle seccionCargarDocumentos correctly', () => {
    component.seccionCargarDocumentos = true;
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('manejaEventoCargaDocumentos sets activarBotonCargaArchivos', () => {
    component.activarBotonCargaArchivos = false;
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('siguiente calls wizardComponent.siguiente and updates indice/datosPasos', () => {
    component.wizardComponent = { siguiente: jest.fn(), indiceActual: 1 } as any;
    component.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('anterior calls wizardComponent.atras and updates indice/datosPasos', () => {
    component.wizardComponent = { atras: jest.fn(), indiceActual: 2 } as any;
    component.anterior();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    component.ngOnDestroy();
    // After complete(), the subject should be stopped/closed
    expect((component.destroyNotifier$ as any).isStopped || (component.destroyNotifier$ as any).closed).toBeTruthy();
  });

  it('getValorIndice with out-of-range value does nothing', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const prevIndice = component.indice;
    component.getValorIndice({ accion: 'cont', valor: 99 });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    expect(component.indice).toBe(prevIndice);
  });

  it('guardar should call solicitudService.guardar and set guardarIdSolicitud and store id', (done) => {
    const mockResponse = { datos: { id_solicitud: 456 } };
    const mockSolicitudService: any = {
      guardar: jest.fn(() => of(mockResponse))
    };
    const mockStore: any = { setIdSolicitud: jest.fn() };
    // inject mocks into component
    (component as any).solicitudService = mockSolicitudService;
    (component as any).tramite80302Store = mockStore;

    const testData: any = {
      modificacionDatos: [],
      datosComplimentaria: [],
      datosFederetarios: [],
      datosOperacions: [],
      datosAnexo: [],
      datosImportacion: [],
      certificacionSAT: null
    };

    component.guardar(testData).subscribe(() => {
      expect(mockSolicitudService.guardar).toHaveBeenCalled();
      expect(component.guardarIdSolicitud).toBe(456);
      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(456);
      done();
    });
  });

  it('shouldNavigate$ should return true when guardar completes', (done) => {
    const mockData = { some: 'state' };
    const mockSolicitudService: any = {
      getAllState: jest.fn(() => of(mockData))
    };
    (component as any).solicitudService = mockSolicitudService;
    jest.spyOn(component as any, 'guardar').mockReturnValue(of({}));

    (component as any).shouldNavigate$().subscribe((val: boolean) => {
      expect(val).toBe(true);
      done();
    });
  });

  it('obtenerDatosDelStore should call guardar with data from solicitudService', () => {
    const mockData = { test: 1 };
    const mockSolicitudService: any = { getAllState: jest.fn(() => of(mockData)) };
    (component as any).solicitudService = mockSolicitudService;
    const guardarSpy = jest.spyOn(component, 'guardar');
    component.obtenerDatosDelStore();
    expect(guardarSpy).toHaveBeenCalledWith(mockData);
  });

  it('getValorIndice with shouldNavigate$ false should set indice to event.valor and not call siguiente', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.indice).toBe(2);
  });
});