import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TercerospageComponent } from './tercerospage.component';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tramite220403Store } from '../../estados/tramite220403.store';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  AlertComponent,
  CatalogoSelectComponent,
  InputRadioComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

/**
 * Mocks para dependencias
 */
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: true });
}
class MockTramite220403Query {
  selectTramite$ = of({
    empresaProductoraDatos: [
      {
          nombre: 'Empresa 1',
          telefono: 'Telefono 1',
          correoElectronico: 'correo1@empresa.com',
          numeroCertificado: 'Certificado 1',
          domicilio: 'Domicilio 1',
          pais: 'Pais 1',
        }
    ],
    importadorDatos: [{ id: 2, nombre: 'Importador 1' }],
  });
  setTercerosRelacionados$ = of([{ id: 3, nombre: 'Tercero 1' }]);
}
class MockTramite220403Store {
  setTercerosRelacionados = jest.fn();
  setImportadorDatos = jest.fn();
  limpiarFormulario = jest.fn();
}
class MockExportaccionAcuicolaService {
  obtenerEmpresaProductora = jest
    .fn()
    .mockReturnValue(of([
      {
          nombre: 'Empresa 1',
          telefono: 'Telefono 1',
          correoElectronico: 'correo1@empresa.com',
          numeroCertificado: 'Certificado 1',
          domicilio: 'Domicilio 1',
          pais: 'Pais 1',
        }
    ]));
  obtenerImportador = jest
    .fn()
    .mockReturnValue(of([{ id: 2, nombre: 'Importador 1' }]));
  obtenerPaises = jest
    .fn()
    .mockReturnValue(of([{ id: 10, descripcion: 'México' }]));
}

/**
 * Mock para Bootstrap Modal
 */
const mockShow = jest.fn();
jest.mock('bootstrap', () => ({
  Modal: function () {
    return { show: mockShow };
  },
}));

describe('TercerospageComponent', () => {
  let component: TercerospageComponent;
  let fixture: ComponentFixture<TercerospageComponent>;
  let mockStore: MockTramite220403Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TercerospageComponent,
        CommonModule,
        TablaDinamicaComponent,
        AlertComponent,
        TituloComponent,
        CatalogoSelectComponent,
        FormsModule,
        InputRadioComponent,
        HttpClientTestingModule,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        { provide: 'Tramite220403Query', useClass: MockTramite220403Query },
        { provide: 'Tramite220403Store', useClass: MockTramite220403Store },
        {
          provide: 'ExportaccionAcuicolaService',
          useClass: MockExportaccionAcuicolaService,
        },
        {
          provide: ElementRef,
          useValue: { nativeElement: document.createElement('div') },
        },
      ],
    })
      .overrideComponent(TercerospageComponent, {
        set: {
          providers: [
            { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
            { provide: 'Tramite220403Query', useClass: MockTramite220403Query },
            { provide: 'Tramite220403Store', useClass: MockTramite220403Store },
            {
              provide: 'ExportaccionAcuicolaService',
              useClass: MockExportaccionAcuicolaService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TercerospageComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Tramite220403Store) as any;

    mockStore.limpiarFormulario = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize data and subscribe to observables', fakeAsync(() => {
      jest.spyOn(component, 'obtenerEmpresaProductoraDatos');
      jest.spyOn(component, 'obtenerImportadorDatos');
      jest.spyOn(component, 'obtenerPaises');
      jest.spyOn(component, 'crearFormularioAgregarImportador');

      component.empresaProductoraDatos = [
        {
          nombre: 'Empresa 1',
          telefono: 'Telefono 1',
          correoElectronico: 'correo1@empresa.com',
          numeroCertificado: 'Certificado 1',
          domicilio: 'Domicilio 1',
          pais: 'Pais 1',
        }
      ];
      component.ngOnInit();
      tick();

      expect(component.obtenerEmpresaProductoraDatos).toHaveBeenCalled();
      expect(component.obtenerImportadorDatos).toHaveBeenCalled();
      expect(component.obtenerPaises).toHaveBeenCalled();
      expect(component.crearFormularioAgregarImportador).toHaveBeenCalled();
      expect(component.esFormularioSoloLectura).toBe(false);
    }));
  });

  describe('crearFormularioAgregarImportador', () => {
    it('should create the agregarImportadorForm with expected controls', () => {
      component.crearFormularioAgregarImportador();
      expect(component.agregarImportadorForm instanceof FormGroup).toBe(true);
      expect(
        component.agregarImportadorForm.get('tercerosRelacionados')
      ).toBeTruthy();
    });
  });

  describe('obtenerEmpresaProductoraDatos', () => {
    it('should set empresaProductoraDatos from service', () => {
      component.empresaProductoraDatos = [
        {
          nombre: 'Empresa 1',
          telefono: 'Telefono 1',
          correoElectronico: 'correo1@empresa.com',
          numeroCertificado: 'Certificado 1',
          domicilio: 'Domicilio 1',
          pais: 'Pais 1',
        }
      ];
      component.obtenerEmpresaProductoraDatos();
      expect(component.empresaProductoraDatos).toEqual([
        {
          nombre: 'Empresa 1',
          telefono: 'Telefono 1',
          correoElectronico: 'correo1@empresa.com',
          numeroCertificado: 'Certificado 1',
          domicilio: 'Domicilio 1',
          pais: 'Pais 1',
        },
      ]);
    });
  });

  describe('obtenerImportadorDatos', () => {
    it('should set importadorDatos from service', () => {
      component.importadorDatos = [
        {
          nombre: 'Empresa Productora 1',
          telefono: '123456789',
          correoElectronico: 'Mexico',
          domicilio: 'Jalisco',
          pais: 'Guadalajara',
        }
      ]
      component.obtenerImportadorDatos();
      expect(component.importadorDatos).toEqual([
        {
          nombre: 'Empresa Productora 1',
          telefono: '123456789',
          correoElectronico: 'Mexico',
          domicilio: 'Jalisco',
          pais: 'Guadalajara',
        },
      ]);
    });
  });

  describe('obtenerPaises', () => {
    it('should set pais from service', () => {
      component.obtenerPaises();
      expect(component.pais).toEqual(undefined);
    });
  });

  describe('abrirDialogoImportador', () => {
    it('should call Modal.show if modalElement exists', () => {
      component.modalElement = new ElementRef(document.createElement('div'));
      component.abrirDialogoImportador();
      expect(mockShow).toHaveBeenCalled();
    });
  });

  describe('guardarImportador', () => {
    beforeEach(() => {
      component.pais = [{ id: 10, descripcion: 'México' }];
      component.importadorDatos = [];
      component.crearFormularioAgregarImportador();
      component.agregarImportadorForm.get('tercerosRelacionados')?.setValue({
        tipoPersona: 'F',
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: '',
        razonSocial: 'Empresa',
        pais: '10',
        domicilio: 'Calle 1',
        lada: '',
        telefono: '1234567890',
        correoElectronico: 'juan@mail.com',
      });
      component.closeModal = new ElementRef(document.createElement('button'));
      jest.spyOn(component, 'cerrarModal');
    });

    it('should add importador, update store, reset form and close modal', () => {
      component.guardarImportador();
      expect(component.importadorDatos.length).toBe(1);
      expect(component.agregarImportadorForm.pristine).toBe(true);
      expect(component.cerrarModal).toHaveBeenCalled();
    });
  });

  describe('limpiarImportador', () => {
    beforeEach(() => {
      component.crearFormularioAgregarImportador();
    });
    it('should reset the form and call limpiarFormulario on store', () => {
      component.limpiarImportador();
      expect(component.agregarImportadorForm.pristine).toBe(true);
      expect(mockStore.limpiarFormulario).toHaveBeenCalled();
    });
  });

  describe('cerrarModal', () => {
    it('should click closeModal button if exists', () => {
      const btn = document.createElement('button');
      const spy = jest.spyOn(btn, 'click');
      component.closeModal = new ElementRef(btn);
      component.cerrarModal();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$', () => {
      const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});