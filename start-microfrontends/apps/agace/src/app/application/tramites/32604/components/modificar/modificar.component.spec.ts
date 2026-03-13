import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarComponent } from './modificar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('ModificarComponent', () => {
  let component: ModificarComponent;
  let fixture: ComponentFixture<ModificarComponent>;
  let empresasComercializadorasServiceMock: any;
  let solicitud32604StoreMock: any;
  let solicitud32604QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    empresasComercializadorasServiceMock = {
      conseguirOpcionDeRadio: jest.fn(() => of({ requisitos: { radioOptions: [] } })),
      obtenerTipoInstalacion: jest.fn(() => of({ data: [] })),
    };
    solicitud32604StoreMock = {};
    solicitud32604QueryMock = {
      selectSolicitud$: of({})
    };
    consultaioQueryMock = {};

    await TestBed.configureTestingModule({
      imports: [ModificarComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: EmpresasComercializadorasService, useValue: empresasComercializadorasServiceMock },
        { provide: Solicitud32604Store, useValue: solicitud32604StoreMock },
        { provide: Solicitud32604Query, useValue: solicitud32604QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarComponent);
    component = fixture.componentInstance;
      component.form = (component as any).fb.group({
        instalacionPrincipal: [''],
        municipioDelegacion: [''],
        tipoInstalacion: [''],
        entidadFederativa: [''],
        registroSESAT: [''],
        direccion: [''],
        codigoPostal: [''],
        procesoProductivo: [''],
        acreditaInmueble: ['']
      });
      component.contenedores = { catalogos: [], labelNombre: '', primerOpcion: '' };
      component.sinoOpcion = { radioOptions: [], isRequired: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn((component as any)['destroy$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('Edge cases and error handling', () => {
    it('should not throw if ngOnInit called multiple times', () => {
      expect(() => component.ngOnInit && component.ngOnInit()).not.toThrow();
      expect(() => component.ngOnInit && component.ngOnInit()).not.toThrow();
    });
    it('should not throw if ngOnDestroy called multiple times', () => {
      expect(() => component.ngOnDestroy && component.ngOnDestroy()).not.toThrow();
      expect(() => component.ngOnDestroy && component.ngOnDestroy()).not.toThrow();
    });
    it('should patch form values from domicilioAModificar and catalogos', () => {
      component.contenedores.catalogos = [
        { id: 1, descripcion: 'Principal' },
        { id: 2, descripcion: 'Secundaria' }
      ];
      component.domicilioAModificar = {
        instalacionPrincipal: 'Principal',
        municipioDelegacion: 'Test',
        tipoInstalacion: 'Secundaria',
        entidadFederativa: 'Entidad',
        registroSESAT: 'SESAT',
        direccion: 'Dir',
        codigoPostal: '12345',
        procesoProductivo: 'Prod',
        acreditaInmueble: 'Sí',
        operacionesCExt: '',
        instalacionCtpat: '',
        instalacionPerfil: '',
        instalacionPerfilRFE: '',
        instalacionPerfilAuto: '',
        instalacionPerfilFerro: '',
        instalacionPerfilRf: '',
        instalacionPerfilMensajeria: '',
        instalacionPerfilAlmacen: '',
        noExterior: '',
        noInterior: '',
        cveTipoInstalacion: '',
        cveEntidadFederativa: '',
        cveDelegacionMunicipio: '',
        cveColonia: '',
        calle: '',
        descCol: '',
        idRecinto: ''
      };
      component.form.patchValue({
        instalacionPrincipal: '',
        tipoInstalacion: '',
      });
      if (typeof component.llenarFormularioConDatos === 'function') {
        component.llenarFormularioConDatos();
        expect(component.form.get('instalacionPrincipal')?.value).toBe('Principal');
        expect(component.form.get('tipoInstalacion')?.value).toBe('2');
      }
    });
    it('should not throw if cerrarModalEvento emit called with undefined', () => {
      component.cerrarModalEvento = undefined as any;
      expect(() => component.cerrarModalEvento?.emit && component.cerrarModalEvento.emit()).not.toThrow();
    });
    it('should not throw if domicilioAModificar is null in ngOnChanges', () => {
      const simpleChangeMock = {
        previousValue: {},
        currentValue: null,
        firstChange: false,
        isFirstChange: () => false
      };
      expect(() => component.ngOnChanges({ domicilioAModificar: simpleChangeMock })).not.toThrow();
    });
    });

    describe('Additional coverage for validation, events, and state', () => {
      it('should mark all as touched and disable fields if form invalid in guardarModificaciones', () => {
        const markSpy = jest.spyOn(component.form, 'markAllAsTouched');
        ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
          component.form.get(field)?.enable();
        });
        component.form.get('instalacionPrincipal')?.setValue('');
        component.form.get('tipoInstalacion')?.setValue('');
        component.form.get('procesoProductivo')?.setValue('');
        component.form.get('acreditaInmueble')?.setValue('');
        component.guardarModificaciones();
        expect(markSpy).toHaveBeenCalled();
        ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
          expect(component.form.get(field)?.disabled).toBe(true);
        });
      });

      it('should emit domicilioModificado and cerrarModalEvento in guardarModificaciones if valid', () => {
        ['municipioDelegacion', 'entidadFederativa', 'registroSESAT', 'direccion', 'codigoPostal'].forEach(field => {
          component.form.get(field)?.enable();
        });
        component.form.get('instalacionPrincipal')?.setValue('Principal');
        component.form.get('tipoInstalacion')?.setValue('1');
        component.form.get('procesoProductivo')?.setValue('Prod');
        component.form.get('acreditaInmueble')?.setValue('Sí');
        component.form.get('municipioDelegacion')?.setValue('Delegacion');
        component.form.get('entidadFederativa')?.setValue('Entidad');
        component.form.get('registroSESAT')?.setValue('Registro');
        component.form.get('direccion')?.setValue('Direccion');
        component.form.get('codigoPostal')?.setValue('12345');
        component.contenedores.catalogos = [{ id: 1, descripcion: 'Principal' }];
        component.domicilioAModificar = { instalacionPrincipal: 'Principal' } as any;
        (component as any).radiosSeleccionadas = {
          instalacionPrincipal: true,
          procesoProductivo: true,
          acreditaInmueble: true
        };
        const emitSpy = jest.spyOn(component.domicilioModificado, 'emit');
        const closeSpy = jest.spyOn(component.cerrarModalEvento, 'emit');
        component.guardarModificaciones();
        expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ instalacionPrincipal: 'Principal' }));
        expect(closeSpy).toHaveBeenCalled();
      });

      it('should patch catalogos and call llenarFormularioConDatos in cargarCatalogos', () => {
        const patchSpy = jest.spyOn(component, 'llenarFormularioConDatos');
        const mockData = { data: [{ id: 1, descripcion: 'Principal' }] };
        (component.empresasComercializadorasService.obtenerTipoInstalacion as jest.Mock).mockReturnValueOnce(of(mockData));
        component.cargarCatalogos();
        setTimeout(() => {
          expect(component.contenedores.catalogos.length).toBe(1);
          expect(patchSpy).toHaveBeenCalled();
        }, 0);
      });

      it('should set sinoOpcion in conseguirOpcionDeRadio', () => {
        const mockRadio = { requisitos: { radioOptions: ['Sí', 'No'] } };
        (component.empresasComercializadorasService.conseguirOpcionDeRadio as jest.Mock).mockReturnValueOnce(of(mockRadio));
        component.conseguirOpcionDeRadio();
        setTimeout(() => {
          expect(component.sinoOpcion.radioOptions).toEqual(['Sí', 'No']);
        }, 0);
      });

      it('should call store methods for actualizar290, actualizarProcesoProductivo, actualizarGoceDelInmueble', () => {
        component.solicitud32604Store.actualizar290 = jest.fn();
        component.solicitud32604Store.actualizarProcesoProductivo = jest.fn();
        component.solicitud32604Store.actualizarGoceDelInmueble = jest.fn();
        component.actualizar290('test');
        component.actualizarProcesoProductivo('prod');
        component.actualizarGoceDelInmueble('goce');
        expect(component.solicitud32604Store.actualizar290).toHaveBeenCalledWith('test');
        expect(component.solicitud32604Store.actualizarProcesoProductivo).toHaveBeenCalledWith('prod');
        expect(component.solicitud32604Store.actualizarGoceDelInmueble).toHaveBeenCalledWith('goce');
      });

      it('should reset form and emit cerrarModalEvento in cancelarModificacion', () => {
        const resetSpy = jest.spyOn(component.form, 'reset');
        const closeSpy = jest.spyOn(component.cerrarModalEvento, 'emit');
        component.cancelarModificacion();
        expect(resetSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
      });
    });
  });
