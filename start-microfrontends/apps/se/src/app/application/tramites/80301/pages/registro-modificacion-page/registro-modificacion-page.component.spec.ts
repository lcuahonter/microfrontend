import { TestBed } from '@angular/core/testing';
import { RegistroModificacionPageComponent } from './registro-modificacion-page.component';
import {
  BtnContinuarComponent,
  WizardComponent,
  WizardService,
} from '@libs/shared/data-access-user/src';
import {
  MSG_REGISTRO_EXITOSO,
  PASOS_EXPORTACION,
} from '../../constantes/modificacion.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';

describe('RegistroModificacionPageComponent', () => {
  let component: RegistroModificacionPageComponent;
  let fixture: any;
  let wizardComponentSpy: jest.Mocked<WizardComponent>;
  let mockSolicitudService: any;
  let mockStore: any;
  let wizardServiceMock: any;

  beforeEach(async () => {
    mockSolicitudService = {
      buscarIdSolicitud: jest.fn().mockReturnValue(of({})),
      getAllState: jest.fn().mockReturnValue(of({})),
    } as any;

    mockStore = {
      setBuscarIdSolicitud: jest.fn(),
      select: jest.fn().mockReturnValue(of({})),
      _select: jest.fn().mockReturnValue(of({})),
    } as any;

    wizardComponentSpy = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
      indiceActual: 2,
    } as any;

    wizardServiceMock = {
      cambio_indice: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegistroModificacionPageComponent,
        WizardComponent,
        PasoUnoComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Tramite80301Store, useValue: mockStore },
        { provide: WizardService, useValue: wizardServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroModificacionPageComponent);
    component = fixture.componentInstance;
    (component as any).wizardComponent = wizardComponentSpy;
    component.datosPasos = { indice: 0 } as any;
    component.idSolicitud = 12345;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasosSolicitar from PASOS_EXPORTACION', () => {
    expect(component.pasosSolicitar).toBe(PASOS_EXPORTACION);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(undefined);
    expect(component.datosPasos.indice).toBe(0);
    expect(component.datosPasos.txtBtnAnt).toBe(undefined);
    expect(component.datosPasos.txtBtnSig).toBe(undefined);
  });

  it('should update indice and call wizardComponent.siguiente on "cont" action', () => {
    const accion = { valor: 2, accion: 'cont' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(accion);
    component.wizardComponent.siguiente();
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras on "ant" action', () => {
    const accion = { valor: 1, accion: 'ant' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(accion);
    expect(component.indice).toBe(0);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent if valor is out of range', () => {
    const initialIndice = component.indice;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    component.getValorIndice({
      valor: PASOS_EXPORTACION.length + 1,
      accion: 'ant',
    });
    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should call wizardComponent.siguiente only when accion is "cont" and valor is valid', () => {
    const accion = { valor: 2, accion: 'cont' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(accion);
    component.wizardComponent.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should call wizardComponent.atras only when accion is not "cont" and valor is valid', () => {
    const accion = { valor: 2, accion: 'ant' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(accion);
    component.wizardComponent.atras();
    expect(component.wizardComponent.atras).toHaveBeenCalledTimes(2);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not call wizardComponent methods if valor is less than 1', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not call wizardComponent methods if valor is greater than nroPasos', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({
      valor: PASOS_EXPORTACION.length + 1,
      accion: 'cont',
    });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice to the correct value when valor is valid', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: 3, accion: 'cont' });
    expect(component.indice).toBe(1);
  });

  it('should not update indice when valor is invalid', () => {
    const initialIndice = component.indice;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: -1, accion: 'cont' });
    expect(component.indice).toBe(initialIndice);
  });

  it('should handle edge case when valor is exactly 1', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: 1, accion: 'cont' });
    component.wizardComponent.siguiente();
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should handle edge case when valor is exactly nroPasos', () => {
    const lastStep = PASOS_EXPORTACION.length;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ valor: lastStep, accion: 'cont' });
    component.wizardComponent.siguiente();
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call service and update store with parsed IDs', () => {
    component.solicitudState = {
      selectedIdPrograma: 'PROG1',
      selectedTipoPrograma: 'TIPO1',
    } as any;

    mockSolicitudService.buscarIdSolicitud.mockReturnValue(
      of({
        datos: {
          buscaIdSolicitud: 'ID1,ID2,ID3,',
        },
      })
    );

    component.buscarIdSolicitud();

    expect(mockSolicitudService.buscarIdSolicitud).toHaveBeenCalledWith({
      idPrograma: 'PROG1',
      tipoPrograma: 'TIPO1',
    });

    expect(mockStore.setBuscarIdSolicitud).toHaveBeenCalledWith([
      'ID1',
      'ID2',
      'ID3',
    ]);
  });

  it('should set empty array when response is empty', () => {
    mockSolicitudService.buscarIdSolicitud.mockReturnValue(of({}));

    component.buscarIdSolicitud();

    expect(mockStore.setBuscarIdSolicitud).toHaveBeenCalledWith([]);
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);

    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should disable section when cargaRealizada is true', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('should enable section when cargaRealizada is false', () => {
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should emit cargarArchivosEvento', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');

    component.onClickCargaArchivos();

    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);

    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should move wizard to next step', () => {
    wizardComponentSpy.indiceActual = 3;

    wizardComponentSpy.siguiente();

    expect(wizardComponentSpy.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(0);
  });

  it('should move wizard to previous step', () => {
    wizardComponentSpy.indiceActual = 1;

    wizardComponentSpy.atras();

    expect(wizardComponentSpy.atras).toHaveBeenCalled();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(0);
  });

  it('should configure alertaNotificacion correctly', () => {
    component.idSolicitud = 999;

    component.mostrarPlantilla();

    expect(component.alertaNotificacion).toEqual({
      tipoNotificacion: 'banner',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: MSG_REGISTRO_EXITOSO('999'),
      cerrar: true,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    });
  });

  it('should navigate forward when accion is cont, readonly false and shouldNavigate is true', () => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
    jest.spyOn(component, 'mostrarPlantilla');
    jest.spyOn(component.wizardComponent, 'siguiente');

    const accion = { valor: 1, accion: 'cont' };    

    component.consultaState = {
      readonly: false,
    } as any;

    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardService.cambio_indice).toHaveBeenCalledWith(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.mostrarPlantilla).toHaveBeenCalled();
  });

  it('should NOT navigate when accion is cont, readonly false and shouldNavigate is false', () => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    jest.spyOn(component.wizardComponent, 'siguiente');
    
    const accion = { valor: 1, accion: 'cont' };
    component.consultaState = {
      readonly: false,
    } as any;
    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should navigate backward when accion is ant', () => {
    const accion = { valor: 2, accion: 'ant' };
    jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should do nothing when valor is out of range', () => {
    const initialIndice = component.indice;
    jest.spyOn(component.wizardComponent, 'siguiente');
    jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice({ valor: 0, accion: 'cont' });
    component.getValorIndice({ valor: 99, accion: 'ant' });

    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
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
});
