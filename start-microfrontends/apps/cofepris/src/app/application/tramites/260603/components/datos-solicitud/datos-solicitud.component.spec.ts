import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { Tramite260603Query } from '../../estados/tramite260603Query.query';
import { Tramite260603Store } from '../../estados/tramite260603Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import {
  TablaOpcionConfig,
  TablaScianConfig,
  TablaMercanciasDatos,
  DatosSolicitudFormState,
  DatosDeTablaSeleccionados,
} from '../../../../shared/models/shared2606/datos-solicitud.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-de-la-solicitud',
  template: '',
  standalone: true,
  inputs: ['datosSolicitudFormState']
})
class MockDatosDeLaSolicitudComponent {
  @Input() datosSolicitudFormState!: DatosSolicitudFormState;
  formularioSolicitudValidacion = jest.fn().mockReturnValue(true);
}

const mockToastr = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
}

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;

  let tramiteQueryMock: any;
  let tramiteStoreMock: any;
  let consultaQueryMock: any;
  let mockOpcionConfigDatos: TablaOpcionConfig[];

  beforeEach(async () => {
    mockOpcionConfigDatos = [
          {
            fechaCreacion: '2025-01-10',
            mercancia: 'Equipo médico',
            cantidad: '100',
            proveedor: 'Proveedor Internacional SA',

            rfcSanitario: 'ABC123456XYZ',
            denominacionRazon: 'Empresa Importadora S.A. de C.V.',
            correoElectronico: 'contacto@empresa.com',
            codigoPostal: '06700',
            estado: 'Ciudad de México',
            municipioAlcaldia: 'Cuauhtémoc',
            localidad: 'Roma Norte',
            colonia: 'Roma Norte',
            calleYNumero: 'Av. Insurgentes Sur 123',
            calle: 'Av. Insurgentes Sur',
            lada: '55',
            telefono: '55555555',

            aviso: 'Aviso sanitario vigente',
            licenciaSanitaria: 'LS-2025-001',
            regimen: 'Definitivo',
            adunasDeEntradas: 'Aduana del Aeropuerto Internacional',
            aeropuerto: true,
            aeropuertoDos: false,

            publico: 'Privado',

            representanteRfc: 'REP890123ABC',
            representanteNombre: 'Juan Carlos',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'López',

            regimenLaMercancia: 'Importación definitiva',
            aduana: 'Aduana AICM',

            mercancias: [] as TablaMercanciasDatos[],

            scian: [
              {
                clave: '621610',
                descripcion: 'Servicios de enfermería a domicilio',
              },
            ] as TablaScianConfig[],

            manifesto: 'Declaro bajo protesta de decir verdad',
            manifiestosCasillaDeVerificacion: true,

            id_solicitud: 260603001,
            fecha_creacion: '2025-01-10T10:30:00Z',
          } as TablaOpcionConfig,
        ];
    tramiteQueryMock = {
      selectTramiteState$: of({
        opcionConfigDatos: mockOpcionConfigDatos,
        scianConfigDatos: [{ clave: '10', descripcion: 'Descripción de Scian 10' }] as TablaScianConfig[],
        tablaMercanciasConfigDatos: [{ id: 3 }] as TablaMercanciasDatos[],
        datosSolicitudFormState: {
          rfcSanitario: 'ABC123456XYZ',
          denominacionRazon: 'Empresa Importadora S.A. de C.V.',
          correoElectronico: 'contacto@empresa.com',
          codigoPostal: '06700',
          estado: 'Ciudad de México',
          municipioAlcaldia: 'Cuauhtémoc',
          localidad: 'Roma Norte',
          colonia: 'Roma Norte',
          calleYNumero: 'Av. Insurgentes Sur 123',
          lada: '55',
          telefono: '55555555',
          aviso: 'Aviso sanitario vigente',
          licenciaSanitaria: 'LS-2025-001',
          regimen: 'Definitivo',
          adunasDeEntradas: 'Aduana del Aeropuerto Internacional',
          aeropuerto: true,
          aeropuertoDos: false,
          publico: 'Privado',
          representanteRfc: 'REP890123ABC',
          representanteNombre: 'Juan Carlos',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'López',
          regimenLaMercancia: 'Importación definitiva',
          aduana: 'Aduana AICM',
          manifesto: true,
          manifiestosCasillaDeVerificacion: true,
          calle: 'Av. Insurgentes Sur'
        } as DatosSolicitudFormState
      }),
    };

    tramiteStoreMock = {
      updateOpcionConfigDatos: jest.fn(),
      updateScianConfigDatos: jest.fn(),
      updateTablaMercanciasConfigDatos: jest.fn(),
      updateDatosSolicitudFormState: jest.fn(),
      update: jest.fn(),
      selectDatosSolicitudFormState$: of({
        rfcSanitario: 'ABC123456XYZ',
        denominacionRazon: 'Empresa Importadora S.A. de C.V.',
        correoElectronico: 'contacto@empresa.com',
        codigoPostal: '06700',
        estado: 'Ciudad de México',
        municipioAlcaldia: 'Cuauhtémoc',
        localidad: 'Roma Norte',
        colonia: 'Roma Norte',
        calleYNumero: 'Av. Insurgentes Sur 123',
        lada: '55',
        telefono: '55555555',
        aviso: 'Aviso sanitario vigente',
        licenciaSanitaria: 'LS-2025-001',
        regimen: 'Definitivo',
        adunasDeEntradas: 'Aduana del Aeropuerto Internacional',
        aeropuerto: true,
        aeropuertoDos: false,
        publico: 'Privado',
        representanteRfc: 'REP890123ABC',
        representanteNombre: 'Juan Carlos',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'López',
        regimenLaMercancia: 'Importación definitiva',
        aduana: 'Aduana AICM',
        manifesto: true,
        manifiestosCasillaDeVerificacion: true,
        calle: 'Av. Insurgentes Sur'
      } as DatosSolicitudFormState),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ readonly: true }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DatosSolicitudComponent,
        HttpClientModule,
        MockDatosDeLaSolicitudComponent
      ],
      providers: [
        { provide: Tramite260603Query, useValue: tramiteQueryMock },
        { provide: Tramite260603Store, useValue: tramiteStoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: ToastrService, useValue: mockToastr }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.datosDeLaSolicitudComponent = {
      formularioSolicitudValidacion: jest.fn().mockReturnValue(true),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set readonly state from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should load tramite state data on init', () => {
    component.ngOnInit();

    expect(component.opcionConfig.datos.length).toBe(1);
    expect(component.scianConfig.datos.length).toBe(1);
    expect(component.tablaMercanciasConfig.datos.length).toBe(1);
  });

  it('should update opcion config on opcionSeleccionado', () => {
    component.opcionSeleccionado(mockOpcionConfigDatos);

    expect(tramiteStoreMock.updateOpcionConfigDatos).toHaveBeenCalledWith(
      mockOpcionConfigDatos
    );
  });

  it('should update scian config on scianSeleccionado', () => {
    const event = [{ clave: '20', descripcion: 'Descripción de Scian 20' }] as TablaScianConfig[];

    component.scianSeleccionado(event);

    expect(tramiteStoreMock.updateScianConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should update mercancias config on mercanciasSeleccionado', () => {
    const event = [{ id: 30 }] as TablaMercanciasDatos[];

    component.mercanciasSeleccionado(event);

    expect(component.seleccionadoTablaMercanciasDatos).toEqual(event);
    expect(
      tramiteStoreMock.updateTablaMercanciasConfigDatos
    ).toHaveBeenCalledWith(event);
  });

  it('should update datos solicitud form state', () => {
    const event: DatosSolicitudFormState = {
      rfcSanitario: 'ABC123456XYZ',
      denominacionRazon: 'Empresa Importadora S.A. de C.V.',
      correoElectronico: 'contacto@empresa.com',
      codigoPostal: '06700',
      estado: 'Ciudad de México',
      municipioAlcaldia: 'Cuauhtémoc',
      localidad: 'Roma Norte',
      colonia: 'Roma Norte',
      calleYNumero: 'Av. Insurgentes Sur 123',
      lada: '55',
      telefono: '55555555',
      aviso: 'Aviso sanitario vigente',
      licenciaSanitaria: 'LS-2025-001',
      regimen: 'Definitivo',
      adunasDeEntradas: 'Aduana del Aeropuerto Internacional',
      aeropuerto: true,
      aeropuertoDos: false,
      publico: 'Privado',
      representanteRfc: 'REP890123ABC',
      representanteNombre: 'Juan Carlos',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'López',
      regimenLaMercancia: 'Importación definitiva',
      aduana: 'Aduana AICM',
      manifesto: true,
      manifiestosCasillaDeVerificacion: true,
      calle: ''
    };

    component.datasolicituActualizar(event);

    expect(tramiteStoreMock.updateDatosSolicitudFormState).toHaveBeenCalledWith(
      event
    );
  });

  it('should update selected table data in store', () => {
    const event: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [{
        fechaCreacion: '2025-01-10',
        mercancia: 'Equipo médico',
        cantidad: '100',
        proveedor: 'Proveedor Internacional SA',
        rfcSanitario: 'ABC123456XYZ',
        denominacionRazon: 'Empresa Importadora S.A. de C.V.',
        correoElectronico: 'contacto@empresa.com',
        codigoPostal: '06700',
        estado: 'Ciudad de México',
        municipioAlcaldia: 'Cuauhtémoc',
        localidad: 'Roma Norte',
        colonia: 'Roma Norte',
        calleYNumero: 'Av. Insurgentes Sur 123',
        calle: 'Av. Insurgentes Sur',
        lada: '55',
        telefono: '55555555',
        aviso: 'Aviso sanitario vigente',
        licenciaSanitaria: 'LS-2025-001',
        regimen: 'Definitivo',
        adunasDeEntradas: 'Aduana del Aeropuerto Internacional',
        aeropuerto: true,
        aeropuertoDos: false,
        publico: 'Privado',
        representanteRfc: 'REP890123ABC',
        representanteNombre: 'Juan Carlos',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'López',
        regimenLaMercancia: 'Importación definitiva',
        aduana: 'Aduana AICM',
        mercancias: [],
        scian: [
          {
            clave: '621610',
            descripcion: 'Servicios de enfermería a domicilio',
          }
        ],
        manifesto: 'Declaro bajo protesta de decir verdad',
        manifiestosCasillaDeVerificacion: true,
        id_solicitud: 260603001,
        fecha_creacion: '2025-01-10T10:30:00Z'
      }],
      scianSeleccionados: [{ clave: '2', descripcion: ''}],
      mercanciasSeleccionados: [],
      opcionesColapsableState: true,
    };

    component.datosDeTablaSeleccionados(event);

    expect(tramiteStoreMock.update).toHaveBeenCalled();
  });

  it('should validate container using child component', () => {
    component.datosDeLaSolicitudComponent = {
      formularioSolicitudValidacion: jest.fn().mockReturnValue(true),
    } as any;

    const result = component.validarContenedor();

    expect(result).toBe(true);
  });

  it('should return false if child component is undefined', () => {
    component.datosDeLaSolicitudComponent = undefined as any;

    expect(component.validarContenedor()).toBe(false);
  });

  it('should complete destroyNotifier$ on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
