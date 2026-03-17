// @ts-nocheck
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ComponenteDeActualizacionComponent } from './componente-de-actualizacion.component';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Tramite32101Query } from '../../../../estados/queries/tramite32101.query';
import { DatosDeLaTabla } from '../../models/datos-tramite.model';
import { Catalogo } from '../../models/catalogo.model';

@Injectable()
class MockConsultaAvisoAcreditacionService {
  getListaDeDocumentos = jest.fn().mockReturnValue(of({ 
    data: [
      { id: 1, descripcion: 'Test Item 1' },
      { id: 2, descripcion: 'Test Item 2' }
    ] 
  }));
  setUpdatedRow = jest.fn();
}

@Injectable()
class MockTramite32101Store {
  setDatosDelContenedor = jest.fn();
}

@Injectable()
class MockTramite32101Query {
  selectSolicitud$ = of({ 
    abc: { 
      id: 1,
      tipoDeInversion: 'Test Tipo',
      descripcionGeneral: 'Test Description',
      valorEnPesos: '1000',
      formaAdquisicion: 'Test Forma',
      comprobante: 'Test Comprobante'
    } 
  });
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

// Mock global bootstrap
declare global {
  interface Window {
    bootstrap: {
      Modal: new (element: HTMLElement) => {
        show(): void;
        hide(): void;
      };
      getInstance: (element: HTMLElement) => {
        hide(): void;
      } | null;
    };
  }
}

// Set up global mock
(global as any).window = {
  bootstrap: {
    Modal: jest.fn().mockImplementation(() => ({
      show: jest.fn(),
      hide: jest.fn()
    })),
    getInstance: jest.fn().mockReturnValue({
      hide: jest.fn()
    })
  }
};

describe('ComponenteDeActualizacionComponent', () => {
  let fixture: ComponentFixture<ComponenteDeActualizacionComponent>;
  let component: ComponenteDeActualizacionComponent;
  let router: Router;
  let mockService: MockConsultaAvisoAcreditacionService;
  let mockStore: MockTramite32101Store;
  let mockQuery: MockTramite32101Query;

  beforeEach(async () => {
    // Set up global window mock before TestBed configuration
    Object.defineProperty(window, 'bootstrap', {
      value: {
        Modal: {
          getInstance: jest.fn()
        }
      },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [ComponenteDeActualizacionComponent, FormsModule, ReactiveFormsModule],
      declarations: [MyCustomDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: ConsultaAvisoAcreditacionService, useClass: MockConsultaAvisoAcreditacionService },
        { provide: Tramite32101Store, useClass: MockTramite32101Store },
        { provide: Tramite32101Query, useClass: MockTramite32101Query },
        {
          provide: Router,
          useValue: {
            url: '/agace/consulta-aviso-acreditacion/solicitud',
            navigate: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteDeActualizacionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockService = TestBed.inject(ConsultaAvisoAcreditacionService) as MockConsultaAvisoAcreditacionService;
    mockStore = TestBed.inject(Tramite32101Store) as MockTramite32101Store;
    mockQuery = TestBed.inject(Tramite32101Query) as MockTramite32101Query;

    component.configuracionTablaDatos = [];
    component.modalRef = {
      nativeElement: document.createElement('div')
    } as ElementRef<HTMLElement>;

    component.tramiteList = {
      catalogos: [],
      labelNombre: 'Tipo de inversión',
      primerOpcion: 'Seleccione una opción'
    };
    component.aduana = {
      catalogos: [],
      labelNombre: 'Forma de adquisición',
      primerOpcion: 'Seleccione una opción'
    };
    component.comprobante = {
      catalogos: [],
      labelNombre: 'Comprobante',
      primerOpcion: 'Seleccione una opción'
    };
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.configuracionTablaDatos).toEqual([]);
      expect(component.tramiteList.labelNombre).toBe('Tipo de inversión');
      expect(component.aduana.labelNombre).toBe('Forma de adquisición');
      expect(component.comprobante.labelNombre).toBe('Comprobante');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize component and call required methods', fakeAsync(() => {
      const initFormSpy = jest.spyOn(component, 'initForm');
      const fetchDocumentosSpy = jest.spyOn(component, 'fetchListaDeDocumentos');
      const fetchInversionSpy = jest.spyOn(component, 'fetchListaDeInversion');
      const fetchComprobanteSpy = jest.spyOn(component, 'fetchListaDeComprobante');

      component.ngOnInit();
      tick();

      expect(initFormSpy).toHaveBeenCalled();
      expect(fetchDocumentosSpy).toHaveBeenCalled();
      expect(fetchInversionSpy).toHaveBeenCalled();
      expect(fetchComprobanteSpy).toHaveBeenCalled();
    }));

    it('should set solicitudState from query', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.solicitudState).toEqual({
        abc: {
          id: 1,
          tipoDeInversion: 'Test Tipo',
          descripcionGeneral: 'Test Description',
          valorEnPesos: '1000',
          formaAdquisicion: 'Test Forma',
          comprobante: 'Test Comprobante'
        }
      });
    }));
  });

  describe('initForm', () => {
    it('should initialize form with solicitudState values', () => {
      component.solicitudState = {
        abc: {
          id: 1,
          tipoDeInversion: 'Test Tipo',
          descripcionGeneral: 'Test Description',
          valorEnPesos: '1000',
          formaAdquisicion: 'Test Forma',
          comprobante: 'Test Comprobante'
        }
      };

      component.initForm();

      expect(component.modificarFormulario).toBeDefined();
      expect(component.modificarFormulario.get('tipoDeInversion')?.value).toBe('Test Tipo');
      expect(component.modificarFormulario.get('descripcionGeneral')?.value).toBe('Test Description');
      expect(component.modificarFormulario.get('valorEnPesos')?.value).toBe('1000');
      expect(component.modificarFormulario.get('formaAdquisicion')?.value).toBe('Test Forma');
      expect(component.modificarFormulario.get('comprobante')?.value).toBe('Test Comprobante');
    });
  });

  describe('fetchListaDeDocumentos', () => {
    it('should fetch documentos and update form', fakeAsync(() => {
      component.solicitudState = {
        abc: { tipoDeInversion: 'Test Item 1' }
      };
      component.initForm();

      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ];

      mockService.getListaDeDocumentos.mockReturnValue(of({
        data: mockData
      }));

      component.fetchListaDeDocumentos();
      tick();

      expect(mockService.getListaDeDocumentos).toHaveBeenCalledWith('listaDeInversion');
      expect(component.tramiteList.catalogos).toEqual(mockData);
      expect(component.modificarFormulario.get('tipoDeInversion')?.value).toBe(1);
    }));

    it('should handle case when tipo de inversion not found', fakeAsync(() => {
      component.solicitudState = {
        abc: { tipoDeInversion: 'No Existe' }
      };
      component.initForm();

      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ];

      mockService.getListaDeDocumentos.mockReturnValue(of({
        data: mockData
      }));

      component.fetchListaDeDocumentos();
      tick();

      expect(component.modificarFormulario.get('tipoDeInversion')?.value).toBeUndefined();
    }));
  });

  describe('fetchListaDeInversion', () => {
    it('should fetch inversion list and update form', fakeAsync(() => {
      component.solicitudState = {
        abc: { formaAdquisicion: 'Test Item 1' }
      };
      component.initForm();

      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ];

      mockService.getListaDeDocumentos.mockReturnValue(of({
        data: mockData
      }));

      component.fetchListaDeInversion();
      tick();

      expect(mockService.getListaDeDocumentos).toHaveBeenCalledWith('listaDeDocumentos');
      expect(component.aduana.catalogos).toEqual(mockData);
      expect(component.modificarFormulario.get('formaAdquisicion')?.value).toBe(1);
    }));

    it('should handle case when forma adquisicion not found', fakeAsync(() => {
      component.solicitudState = {
        abc: { formaAdquisicion: 'No Existe' }
      };
      component.initForm();

      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ];

      mockService.getListaDeDocumentos.mockReturnValue(of({
        data: mockData
      }));

      component.fetchListaDeInversion();
      tick();

      expect(component.modificarFormulario.get('formaAdquisicion')?.value).toBeUndefined();
    }));
  });

  describe('fetchListaDeComprobante', () => {
    it('should fetch comprobante list and update form', fakeAsync(() => {
      component.solicitudState = {
        abc: { comprobante: 'Test Item 1' }
      };
      component.initForm();

      const mockData: Catalogo[] = [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ];

      mockService.getListaDeDocumentos.mockReturnValue(of({
        data: mockData
      }));

      component.fetchListaDeComprobante();
      tick();

      expect(mockService.getListaDeDocumentos).toHaveBeenCalledWith('listaDeComprobante');
      expect(component.comprobante.catalogos).toEqual(mockData);
      expect(component.modificarFormulario.get('comprobante')?.value).toBe(1);
    }));
  });

  describe('getDropdownLabel static method', () => {
    it('should return correct label when item found', () => {
      const catalog: Catalogo[] = [
        { id: 1, descripcion: 'Item 1' },
        { id: 2, descripcion: 'Item 2' }
      ];

      const result = ComponenteDeActualizacionComponent.getDropdownLabel(2, catalog);
      expect(result).toBe('Item 2');
    });

    it('should return empty string when item not found', () => {
      const catalog: Catalogo[] = [
        { id: 1, descripcion: 'Item 1' },
        { id: 2, descripcion: 'Item 2' }
      ];

      const result = ComponenteDeActualizacionComponent.getDropdownLabel(99, catalog);
      expect(result).toBe('');
    });

    it('should return empty string when catalog is empty', () => {
      const result = ComponenteDeActualizacionComponent.getDropdownLabel(1, []);
      expect(result).toBe('');
    });
  });

  describe('onGuardarCambios', () => {
    it('should save changes and call service methods', () => {
      component.solicitudState = {
        abc: { id: 123 }
      };
      
      component.tramiteList.catalogos = [
        { id: 1, descripcion: 'Inversión Test' }
      ];
      
      component.aduana.catalogos = [
        { id: 2, descripcion: 'Adquisición Test' }
      ];

      component.initForm();
      component.modificarFormulario.patchValue({
        tipoDeInversion: 1,
        descripcionGeneral: 'Test Description',
        valorEnPesos: '1500',
        formaAdquisicion: 2
      });

      const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');

      component.onGuardarCambios();

      const expectedRow: DatosDeLaTabla = {
        id: 123,
        tipoDeInversion: 'Inversión Test',
        descripcionGeneral: 'Test Description',
        formaAdquisicion: 'Adquisición Test',
        valorEnPesos: '1500',
        comprobante: 'N/A'
      };

      expect(mockService.setUpdatedRow).toHaveBeenCalledWith([expectedRow]);
      expect(cerrarModalSpy).toHaveBeenCalled();
    });

    it('should handle case when solicitudState.abc.id is undefined', () => {
      component.solicitudState = {
        abc: { id: undefined }
      };
      
      component.tramiteList.catalogos = [];
      component.aduana.catalogos = [];
      component.initForm();

      const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');

      component.onGuardarCambios();

      expect(mockService.setUpdatedRow).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 0
        })
      ]);
      expect(cerrarModalSpy).toHaveBeenCalled();
    });
  });

  describe('Modal Methods', () => {
    beforeEach(() => {
      component.solicitudState = {
        abc: {
          id: 1,
          tipoDeInversion: 'Tipo Test',
          descripcionGeneral: 'Test Desc',
          valorEnPesos: '1000',
          formaAdquisicion: 'Forma Test',
          comprobante: 'Test Comprobante'
        }
      };
      component.tramiteList.catalogos = [
        { id: 1, descripcion: 'Tipo Test' }
      ];
      component.aduana.catalogos = [
        { id: 2, descripcion: 'Forma Test' }
      ];
      component.initForm();
    });

    describe('abrirModal', () => {
      it('should handle case when modalRef is undefined', () => {
        component.modalRef = undefined as any;
        const selectedRow: DatosDeLaTabla = {
          id: 1,
          tipoDeInversion: 'Test',
          descripcionGeneral: 'Test',
          valorEnPesos: '1000',
          formaAdquisicion: 'Test',
          comprobante: 'Test'
        };

        expect(() => component.abrirModal(selectedRow)).not.toThrow();
      });
    });

    describe('cerrarModal', () => {
      it('should close modal when modal instance exists', () => {
        const mockHide = jest.fn();
        const mockBootstrap = window.bootstrap as any;
        mockBootstrap.Modal.getInstance = jest.fn().mockReturnValue({
          hide: mockHide
        });

        component.cerrarModal();

        expect(mockBootstrap.Modal.getInstance).toHaveBeenCalledWith(component.modalRef.nativeElement);
        expect(mockHide).toHaveBeenCalled();
      });

      it('should handle case when modal instance does not exist', () => {
        const mockBootstrap = window.bootstrap as any;
        mockBootstrap.Modal.getInstance = jest.fn().mockReturnValue(null);

        expect(() => component.cerrarModal()).not.toThrow();
      });

      it('should handle case when modalRef is undefined', () => {
        component.modalRef = undefined as any;

        expect(() => component.cerrarModal()).not.toThrow();
      });
    });

    describe('onCancelar', () => {
      it('should call cerrarModal', () => {
        const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');

        component.onCancelar();

        expect(cerrarModalSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Component Properties and Services', () => {
    it('should have proper service injections', () => {
      expect(component.consultaAvisoAcreditacionService).toBeDefined();
      expect(component.tramite32101Store).toBeDefined();
    });

    it('should manage destroyNotifier$ properly', () => {
      const destroyNotifier = (component as any).destroyNotifier$;
      expect(destroyNotifier).toBeDefined();
      expect(destroyNotifier).toBeInstanceOf(Subject);
    });

    it('should initialize catalogs with correct structure', () => {
      expect(component.tramiteList).toHaveProperty('catalogos');
      expect(component.tramiteList).toHaveProperty('labelNombre');
      expect(component.tramiteList).toHaveProperty('primerOpcion');
      
      expect(component.aduana).toHaveProperty('catalogos');
      expect(component.aduana).toHaveProperty('labelNombre');
      expect(component.aduana).toHaveProperty('primerOpcion');
      
      expect(component.comprobante).toHaveProperty('catalogos');
      expect(component.comprobante).toHaveProperty('labelNombre');
      expect(component.comprobante).toHaveProperty('primerOpcion');
    });
  });

  describe('Private Methods', () => {
    describe('getIdFromDescription', () => {
      it('should return correct id when description found', () => {
        const catalog = [
          { id: 1, descripcion: 'Test 1' },
          { id: 2, descripcion: 'Test 2' }
        ];

        const result = (component as any).getIdFromDescription('Test 2', catalog);
        expect(result).toBe(2);
      });

      it('should return null when description not found', () => {
        const catalog = [
          { id: 1, descripcion: 'Test 1' },
          { id: 2, descripcion: 'Test 2' }
        ];

        const result = (component as any).getIdFromDescription('Not Found', catalog);
        expect(result).toBeNull();
      });

      it('should return null when catalog is empty', () => {
        const result = (component as any).getIdFromDescription('Test', []);
        expect(result).toBeNull();
      });
    });
  });
});
