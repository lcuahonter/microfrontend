import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosGeneralesComponent } from './datos-generales.component';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Solicitud220502Store } from '../../estados/tramites220502.store';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let solicitudPantallasService: SolicitudPantallasService;
  let solicitudStore: Solicitud220502Store;
  let solicitudQuery: Solicitud220502Query;
  let validacionesService: ValidacionesFormularioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: SolicitudPantallasService,
          useValue: {
            getAduanaIngreso: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getOficianaInspeccion: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getPuntoInspeccion: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getEstablecimiento: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getRegimenDestinaran: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getMovilizacionNacional: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getPuntoVerificacion: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getEmpresaTransportista: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
            getDatosDelaSolicitud: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: Solicitud220502Store,
          useValue: {
            setFoliodel: jest.fn(),
            setClaveUCON: jest.fn(),
            setEstablecimientoTIF: jest.fn(),
            setNombre: jest.fn(),
            setNumeroguia: jest.fn(),
            setCoordenadas: jest.fn(),
            setTransporte: jest.fn(),
            setNombreEmpresa: jest.fn(),
            setAduanaIngreso: jest.fn(),
            setOficinaInspeccion: jest.fn(),
            setPuntoInspeccion: jest.fn(),
            setRegimen: jest.fn(),
            setMovilizacion: jest.fn(),
            setCapturaDatosMercancia: jest.fn(),
            setPunto: jest.fn(),
          },
        },
        {
          provide: Solicitud220502Query,
          useValue: {
            selectSolicitud$: of({}),
          },
        },
        {
          provide: ValidacionesFormularioService,
          useValue: {
            isValid: jest.fn().mockReturnValue(true),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    solicitudPantallasService = TestBed.inject(SolicitudPantallasService);
    solicitudStore = TestBed.inject(Solicitud220502Store);
    solicitudQuery = TestBed.inject(Solicitud220502Query);
    validacionesService = TestBed.inject(ValidacionesFormularioService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    jest.spyOn(component, 'getAduanaIngreso');
    jest.spyOn(component, 'getOficianaInspeccion');
    jest.spyOn(component, 'getPuntoInspeccion');
    jest.spyOn(component, 'getEstablecimiento');
    jest.spyOn(component, 'getRegimenDestinaran');
    jest.spyOn(component, 'getMovilizacionNacional');
    jest.spyOn(component, 'getPuntoVerificacion');
    jest.spyOn(component, 'getEmpresaTransportista');
    jest.spyOn(component, 'actualizarDatosDelaSolicitud');

    component.inicializarFormulario();

    expect(component.getAduanaIngreso).toHaveBeenCalled();
    expect(component.getOficianaInspeccion).toHaveBeenCalled();
    expect(component.getPuntoInspeccion).toHaveBeenCalled();
    expect(component.getEstablecimiento).toHaveBeenCalled();
    expect(component.getRegimenDestinaran).toHaveBeenCalled();
    expect(component.getMovilizacionNacional).toHaveBeenCalled();
    expect(component.getPuntoVerificacion).toHaveBeenCalled();
    expect(component.getEmpresaTransportista).toHaveBeenCalled();
    expect(component.actualizarDatosDelaSolicitud).toHaveBeenCalled();
  });

  it('should toggle colapsable state', () => {
    expect(component.colapsable).toBe(false);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('should rotate rows correctly', () => {
    component.mercanciasLista = [{ Partida: '1' }, { Partida: '2' }, { Partida: '3' }] as any;
    component.indiceActual = 0;

    component.rotarFila(1);
    expect(component.indiceActual).toBe(1);

    component.rotarFila(1);
    expect(component.indiceActual).toBe(2);

    component.rotarFila(1);
    expect(component.indiceActual).toBe(0);

    component.rotarFila(-1);
    expect(component.indiceActual).toBe(2);
  });

  it('should validate form fields correctly', () => {
    const form = component.forma;
    const field = 'aduanaIngreso';
    expect(component.isValid(form, field)).toBe(true);
    expect(validacionesService.isValid).toHaveBeenCalledWith(form, field);
  });

  it('should call solicitudPantallasService methods for data fetching', () => {
    component.getAduanaIngreso();
    expect(solicitudPantallasService.getAduanaIngreso).toHaveBeenCalled();

    component.getOficianaInspeccion();
    expect(solicitudPantallasService.getOficianaInspeccion).toHaveBeenCalled();

    component.getPuntoInspeccion();
    expect(solicitudPantallasService.getPuntoInspeccion).toHaveBeenCalled();

    component.getEstablecimiento();
    expect(solicitudPantallasService.getEstablecimiento).toHaveBeenCalled();

    component.getRegimenDestinaran();
    expect(solicitudPantallasService.getRegimenDestinaran).toHaveBeenCalled();

    component.getMovilizacionNacional();
    expect(solicitudPantallasService.getMovilizacionNacional).toHaveBeenCalled();

    component.getPuntoVerificacion();
    expect(solicitudPantallasService.getPuntoVerificacion).toHaveBeenCalled();

    component.getEmpresaTransportista();
    expect(solicitudPantallasService.getEmpresaTransportista).toHaveBeenCalled();
  });

  it('should update solicitud store on seleccionar methods', () => {
    const mockCatalogo = { id: 1 } as any;

    component.seleccionarAduanaIngreso(mockCatalogo);
    expect(solicitudStore.setAduanaIngreso).toHaveBeenCalledWith(1);

    component.seleccionarOficianaInspeccion(mockCatalogo);
    expect(solicitudStore.setOficinaInspeccion).toHaveBeenCalledWith(1);

    component.seleccionarPuntoInspeccion(mockCatalogo);
    expect(solicitudStore.setPuntoInspeccion).toHaveBeenCalledWith(1);

    component.seleccionarRegimen(mockCatalogo);
    expect(solicitudStore.setRegimen).toHaveBeenCalledWith(1);

    component.seleccionarMovilizacionNacional(mockCatalogo);
    expect(solicitudStore.setMovilizacion).toHaveBeenCalledWith(1);

    component.seleccionarPuntoVerificacion(mockCatalogo);
    expect(solicitudStore.setPunto).toHaveBeenCalledWith(1);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});