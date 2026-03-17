import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosGeneralesComponent } from './datos-generales.component';
import { RevisionService } from '../../services/revision.service';
import { Solicitud220501Store } from '../../estados/tramites220501.store';
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let revisionService: RevisionService;
  let solicitudStore: Solicitud220501Store;
  let solicitudQuery: Solicitud220501Query;
  let validacionesService: ValidacionesFormularioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: RevisionService,
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
          provide: Solicitud220501Store,
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
          provide: Solicitud220501Query,
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
    revisionService = TestBed.inject(RevisionService);
    solicitudStore = TestBed.inject(Solicitud220501Store);
    solicitudQuery = TestBed.inject(Solicitud220501Query);
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
    component.rows = [{ Partida: '1' }, { Partida: '2' }, { Partida: '3' }] as any;
    component.currentIndex = 0;

    component.rotateRow(1);
    expect(component.currentIndex).toBe(1);

    component.rotateRow(1);
    expect(component.currentIndex).toBe(2);

    component.rotateRow(1);
    expect(component.currentIndex).toBe(0);

    component.rotateRow(-1);
    expect(component.currentIndex).toBe(2);
  });

  it('should validate form fields correctly', () => {
    const form = component.forma;
    const field = 'aduanaIngreso';
    expect(component.isValid(form, field)).toBe(true);
    expect(validacionesService.isValid).toHaveBeenCalledWith(form, field);
  });

  it('should call revisionService methods for data fetching', () => {
    component.getAduanaIngreso();
    expect(revisionService.getAduanaIngreso).toHaveBeenCalled();

    component.getOficianaInspeccion();
    expect(revisionService.getOficianaInspeccion).toHaveBeenCalled();

    component.getPuntoInspeccion();
    expect(revisionService.getPuntoInspeccion).toHaveBeenCalled();

    component.getEstablecimiento();
    expect(revisionService.getEstablecimiento).toHaveBeenCalled();

    component.getRegimenDestinaran();
    expect(revisionService.getRegimenDestinaran).toHaveBeenCalled();

    component.getMovilizacionNacional();
    expect(revisionService.getMovilizacionNacional).toHaveBeenCalled();

    component.getPuntoVerificacion();
    expect(revisionService.getPuntoVerificacion).toHaveBeenCalled();

    component.getEmpresaTransportista();
    expect(revisionService.getEmpresaTransportista).toHaveBeenCalled();
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

  it('should update capturaDatosMercancia in store', () => {
    component.setCapturaDatosMercancia('test');
    expect(solicitudStore.setCapturaDatosMercancia).toHaveBeenCalledWith('test');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});