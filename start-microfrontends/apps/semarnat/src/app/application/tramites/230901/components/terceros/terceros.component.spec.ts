import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosComponent } from './terceros.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite230901Store } from '../../estados/store/tramite230901.store';
import { Tramite230901Query } from '../../estados/query/tramite230901.query';
import { AutorizacionesDeVidaSilvestreService } from '../../services/autorizaciones-de-vida-silvestre.service';
import { of } from 'rxjs';
import { DESTINATARIO_TABLE_ENTRY } from '../../enum/destinatario-tabla.enum';

describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;
  let tramiteStore: Tramite230901Store;
  let tramiteQuery: Tramite230901Query;
  let autorizacionesService: AutorizacionesDeVidaSilvestreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TercerosComponent],
      providers: [
        FormBuilder,
        {
          provide: Tramite230901Store,
          useValue: {
            establecerDatos: jest.fn(),
            setTercerosPopupState: jest.fn()
          }
        },
        {
          provide: Tramite230901Query,
          useValue: {
            selectSolicitud$: of({ entidadFederativa: 'MX' })
          }
        },
        {
          provide: AutorizacionesDeVidaSilvestreService,
          useValue: {
            inicializaTercerosDatosCatalogos: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    tramiteStore = TestBed.inject(Tramite230901Store);
    tramiteQuery = TestBed.inject(Tramite230901Query);
    autorizacionesService = TestBed.inject(AutorizacionesDeVidaSilvestreService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and subscriptions on ngOnInit', () => {
    const spyCatalogos = jest.spyOn(autorizacionesService, 'inicializaTercerosDatosCatalogos');
    component.ngOnInit();
    expect(spyCatalogos).toHaveBeenCalled();
    expect(component.formularioDestinatario).toBeDefined();
    expect(component.estadoSolicitud.entidadFederativa).toBe('MX');
  });

  it('should create form with correct initial value', () => {
    component.estadoSolicitud = { entidadFederativa: 'CDMX' } as any;
    component.crearFormularioDestinatario();
    expect(component.formularioDestinatario.get('entidadFederativa')?.value).toBe('CDMX');
  });

  it('should handle entity change and update store + table data', () => {
    component.estadoSolicitud = { entidadFederativa: 'CDMX' } as any;
    component.crearFormularioDestinatario();
    component.datosTabla = [];

    component.manejarCambioEntidadFederativa();

    expect(tramiteStore.establecerDatos).toHaveBeenCalledWith({ entidadFederativa: 'CDMX' });
    expect(component.datosTabla.length).toBe(1);
    expect(component.datosTabla[0]).toEqual(DESTINATARIO_TABLE_ENTRY);
  });

  it('should enable modify button when row is selected', () => {
    component.manejarFilaSeleccionada([DESTINATARIO_TABLE_ENTRY]);
    expect(component.botonModificarHabilitado).toBe(true);
  });

  it('should open popup only if modify button is enabled', () => {
    component.botonModificarHabilitado = true;
    component.abrirPopup();
    expect(component.popupAbierto).toBe(true);
    expect(tramiteStore.setTercerosPopupState).toHaveBeenCalledWith(true);
  });

  it('should close popup and update state', () => {
    component.cerrarPopup();
    expect(component.popupAbierto).toBe(false);
    expect(component.popupCerrado).toBe(false);
    expect(tramiteStore.setTercerosPopupState).toHaveBeenCalledWith(false);
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const completeSpy = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});