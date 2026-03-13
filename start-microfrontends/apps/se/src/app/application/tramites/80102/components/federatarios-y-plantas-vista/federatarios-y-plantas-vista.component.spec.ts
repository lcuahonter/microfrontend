import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FederatariosYPlantasVistaComponent } from './federatarios-y-plantas-vista.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { of } from 'rxjs';
import { Tramite80102Store } from '../../estados/tramite80102.store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FederatariosYPlantasComponent } from '../../../../shared/components/federatarios-y-planta/federatarios-y-plantas.component';
import { FederatariosEncabezado, PlantasImmex } from '../../../../shared/models/federatarios-y-plantas.model';
import { MontoDeInversion } from '../../../../shared/constantes/complementar-planta.enum';
import { Directos } from '../../../../shared/constantes/empleados.enum';
import { ComplementoDePlanta, ComplementarPlantaState } from '../../../../shared/constantes/complementar-planta.enum';
import { CapacidadInstalada } from '../../../../shared/constantes/capacidad-instalada.enum';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';

  describe('FederatariosYPlantasVistaComponent', () => {
    let component: FederatariosYPlantasVistaComponent;
    let fixture: ComponentFixture<FederatariosYPlantasVistaComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FederatariosYPlantasVistaComponent, FederatariosYPlantasComponent, HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: {} },
          {
            provide: Tramite80102Query,
            useValue: {
              selectDatosFederatarios$: of([]),
            },
          },
          {
            provide: Tramite80102Store,
            useValue: {
              setFederatarios: jest.fn(),
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(FederatariosYPlantasVistaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería crear', () => {
      expect(component).toBeTruthy();
    });
  });
  describe('FederatariosYPlantasVistaComponent - Extended', () => {
    let component: FederatariosYPlantasVistaComponent;
    let fixture: ComponentFixture<FederatariosYPlantasVistaComponent>;
    let store: any;
    let query: any;
    let consultaQuery: any;
    let autorizacionProgrmaNuevoService: any;
    let _complimentoSvc: any;

    beforeEach(async () => {
      store = {
        setFederatarios: jest.fn(),
        setPlantasDisponiblesTablaLista: jest.fn(),
        setPlantasImmexTablaLista: jest.fn(),
        setMontosDeInversionTablaDatos: jest.fn(),
        setEmpleadosTablaDatos: jest.fn(),
        setComplementarPlantaDatos: jest.fn(),
        setComplementarPlantaState: jest.fn(),
        setFederatariosCatalogo: jest.fn(),
        setCapacidadInstaladaTableLista: jest.fn(),
      };
      query = {
        selectDatosFederatarios$: of([]),
        selectPlantasDisponiblesTablaLista$: of([]),
        selectplantasImmexTablaLista$: of([]),
        selectDatosFederatariosFormulario$: of({ estadoUno: 'JALISCO' }),
      };
      consultaQuery = {
        selectConsultaioState$: of({ readonly: true }),
      };
      autorizacionProgrmaNuevoService = {
        tieneDatosDeTabla$: of(true),
        getFederataiosyPlantaCatalogosData: jest.fn().mockReturnValue(of({})),
      };
      _complimentoSvc = {
        getPlantasDisponibles: jest.fn().mockReturnValue(of({ datos: [{}, {}] })),
        mapApiResponseToPlantasDisponibles: jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }]),
      };

      await TestBed.configureTestingModule({
        imports: [FederatariosYPlantasVistaComponent],
        providers: [
          { provide: Tramite80102Query, useValue: query },
          { provide: Tramite80102Store, useValue: store },
          { provide: ConsultaioQuery, useValue: consultaQuery },
          { provide: AutorizacionProgrmaNuevoService, useValue: autorizacionProgrmaNuevoService },
          { provide: ComplimentosService, useValue: _complimentoSvc },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(FederatariosYPlantasVistaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set federatarios data', () => {
      const datos: FederatariosEncabezado = { estadoUno: 'JALISCO' } as any;
      component.setFormaDatos(datos);
      expect(store.setFederatarios).toHaveBeenCalledWith(datos);
    });

    it('should set plantas disponibles data', () => {
      component.estadoValor = 'JALISCO';
      component.setPlantasDisponiblesDatos();
      expect(_complimentoSvc.getPlantasDisponibles).toHaveBeenCalled();
      expect(_complimentoSvc.mapApiResponseToPlantasDisponibles).toHaveBeenCalled();
      expect(store.setPlantasDisponiblesTablaLista).toHaveBeenCalled();
    });

    it('should set plantas immex data', () => {
      const datos: PlantasImmex[] = [{}, {}] as any;
      component.setPlantasImmexDatos(datos);
      expect(store.setPlantasImmexTablaLista).toHaveBeenCalledWith(datos);
    });

    it('should handle onAccionSeccion for complementar-plantas-acciones', () => {
      component.onAccionSeccion('../complementar-plantas-acciones');
      expect(component.mostrarComplementarPlantaPopup).toBe(true);
    });

    it('should handle onAccionSeccion for montos-inversion-acciones', () => {
      component.onAccionSeccion('../montos-inversion-acciones');
      expect(component.mostrarMontosDeInversionPopup).toBe(true);
    });

    it('should handle onAccionSeccion for empleados-acciones', () => {
      component.onAccionSeccion('../empleados-acciones');
      expect(component.mostrarEmpleadosPopup).toBe(true);
    });

    it('should handle onAccionSeccion for capacidad-instalada-acciones', () => {
      component.onAccionSeccion('../capacidad-instalada-acciones');
      expect(component.mostrarCapacidadInstaladaPopup).toBe(true);
    });

    it('should show proveedor por archivo popup if tieneDatosDeTabla is true', () => {
      component.tieneDatosDeTabla = true;
      component.onAccionSeccion('../proveedor-por-archivo');
      expect(component.mostrarProveedorPorArchivoPopup).toBe(true);
    });

    it('should show notification if proveedor por archivo and tieneDatosDeTabla is false', () => {
      component.tieneDatosDeTabla = false;
      component.onAccionSeccion('../proveedor-por-archivo');
      expect(component.nuevaUnoNotificacion).toBeDefined();
      expect(component.nuevaUnoNotificacion.mensaje).toContain('Debe ingresar las fracciones');
    });

    it('should close complementar planta popup', () => {
      component.mostrarComplementarPlantaPopup = true;
      component.cerrarComplementarPlanta();
      expect(component.mostrarComplementarPlantaPopup).toBe(false);
    });

    it('should close montos de inversion popup', () => {
      component.mostrarMontosDeInversionPopup = true;
      component.cerrarMontosDeInversion();
      expect(component.mostrarMontosDeInversionPopup).toBe(false);
    });

    it('should close empleados popup', () => {
      component.mostrarEmpleadosPopup = true;
      component.cerrarEmpleados();
      expect(component.mostrarEmpleadosPopup).toBe(false);
    });

    it('should close capacidad instalada popup', () => {
      component.mostrarCapacidadInstaladaPopup = true;
      component.cerrarCapacidadInstalada();
      expect(component.mostrarCapacidadInstaladaPopup).toBe(false);
    });

    it('should close proveedor por archivo popup', () => {
      component.mostrarProveedorPorArchivoPopup = true;
      component.cerrarProveedorPorArchivo();
      expect(component.mostrarProveedorPorArchivoPopup).toBe(false);
    });

    it('should update montos inversion list', () => {
      const event: MontoDeInversion[] = [{}, {}] as any;
      component.obtenerMontosInversionList(event);
      expect(store.setMontosDeInversionTablaDatos).toHaveBeenCalledWith(event);
    });

    it('should update empleados list', () => {
      const event: Directos[] = [{}, {}] as any;
      component.obtenerEmpleadosList(event);
      expect(store.setEmpleadosTablaDatos).toHaveBeenCalledWith(event);
    });

    it('should update complementar planta list', () => {
      const event: ComplementoDePlanta[] = [{}, {}] as any;
      component.obtenerComplementarPlantaList(event);
      expect(store.setComplementarPlantaDatos).toHaveBeenCalledWith(event);
    });

    it('should update firmantes list', () => {
      const event: ComplementarPlantaState[] = [{}, {}] as any;
      component.obtenerFirmantesList(event);
      expect(store.setComplementarPlantaState).toHaveBeenCalledWith(event);
    });

    it('should set datos federatarios and estadoValor', () => {
      const datos: FederatariosEncabezado = { estadoUno: 'JALISCO' } as any;
      component.setDatosFederatarios(datos);
      expect(component.estadoValor).toBe('JALISCO');
      expect(store.setFederatariosCatalogo).toHaveBeenCalledWith(datos);
    });

    it('should update capacidad instalada tabla list', () => {
      const event: CapacidadInstalada[] = [{}, {}] as any;
      component.obtenerCapacidadInstaladaTablaList(event);
      expect(store.setCapacidadInstaladaTableLista).toHaveBeenCalledWith(event);
    });

    it('should clean up on destroy', () => {
      const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
      const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });

    it('should initialize observables and subscriptions in ngOnInit', () => {
      component.ngOnInit();
      expect(component.datosFederatarios).toBeDefined();
      expect(component.estadoOptionsConfig).toBeDefined();
      expect(typeof component.tieneDatosDeTabla).toBe('boolean');
    });
  });
