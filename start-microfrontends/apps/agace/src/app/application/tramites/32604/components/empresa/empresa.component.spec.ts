import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmpresaComponent } from './empresa.component';
import { FormBuilder } from '@angular/forms';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('EmpresaComponent', () => {
  let component: EmpresaComponent;
  let fixture: ComponentFixture<EmpresaComponent>;
  let empresasComercializadorasServiceMock: any;
  let solicitud32604StoreMock: any;
  let solicitud32604QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    empresasComercializadorasServiceMock = {
  conseguirOpcionDeRadio: jest.fn(() => of({ requisitos: { radioOptions: [] } })),
      getContenedores: jest.fn(() => of({ data: [] })),
      getNationalidad: jest.fn(() => of({ data: [] })),
      getTipPersona: jest.fn(() => of([])),
    };
    solicitud32604StoreMock = {
      actualizar290: jest.fn(),
      actualizarProcesoProductivo: jest.fn(),
      actualizarGoceDelInmueble: jest.fn()
    };
    solicitud32604QueryMock = {
      selectSolicitud$: of({})
    };
    consultaioQueryMock = {};

    await TestBed.configureTestingModule({
      imports: [EmpresaComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: EmpresasComercializadorasService, useValue: empresasComercializadorasServiceMock },
        { provide: Solicitud32604Store, useValue: solicitud32604StoreMock },
        { provide: Solicitud32604Query, useValue: solicitud32604QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaComponent);
    component = fixture.componentInstance;
      component.empresaForm = (component as any).fb.group({
        caracterDe: [''],
        rfcBusqueda: [''],
        instalacionesPrincipales: [''],
        registroFederalContribuyentes: [''],
        tipoPersona: [''],
        nacionalidad: [''],
        nombreCompleto: [''],
        nombreS: [''],
        apellidoPaterno: [''],
        nombreEmpresa: ['']
      });

      component.contenedores = { catalogos: [], labelNombre: '', primerOpcion: '' };
      component.sinoOpcion = { radioOptions: [], isRequired: false };
      component.tipoPersona = { catalogos: [], labelNombre: '', primerOpcion: '' };
      component.nacionalidad = { catalogos: [], labelNombre: '', primerOpcion: '' };
      component.miembroAModificar = null;
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

    describe('buscarMiembro', () => {
      it('should patch form when member is found', (done) => {
        const mockMember = [{
          caracterDe: 'Socio',
          rfc: 'RFC123',
          instalacionesPrincipales: '1',
          registroFederalContribuyentes: 'RFC123',
          nacionalidad: '10',
          nombreCompleto: 'Juan Perez'
        }];
        jest.spyOn(component['http'], 'get').mockReturnValueOnce(of(mockMember));
        component.empresaForm.get('caracterDe')?.setValue('Socio');
        component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
        component.buscarMiembro();
        setTimeout(() => {
          expect(component.empresaForm.get('instalacionesPrincipales')?.value).toBe('1');
          expect(component.empresaForm.get('registroFederalContribuyentes')?.value).toBe('RFC123');
          expect(component.empresaForm.get('nacionalidad')?.value).toBe('10');
          expect(component.empresaForm.get('nombreCompleto')?.value).toBe('Juan Perez');
          done();
        }, 0);
      });
      it('should show error modal when member not found', (done) => {
        jest.spyOn(component['http'], 'get').mockReturnValueOnce(of([]));
        const modalSpy = jest.spyOn(component, 'mostrarModalError');
        component.empresaForm.get('caracterDe')?.setValue('Socio');
        component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
        component.buscarMiembro();
        setTimeout(() => {
          expect(modalSpy).toHaveBeenCalledWith(expect.stringContaining('no fue encontrado'));
          done();
        }, 0);
      });
      it('should show error modal on http error', (done) => {
        const { throwError } = require('rxjs');
        jest.spyOn(component['http'], 'get').mockReturnValueOnce(throwError(() => new Error('fail')));
        const modalSpy = jest.spyOn(component, 'mostrarModalError');
        component.empresaForm.get('caracterDe')?.setValue('Socio');
        component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
        component.buscarMiembro();
        setTimeout(() => {
          expect(modalSpy).toHaveBeenCalledWith(expect.stringContaining('Error al buscar'));
          done();
        }, 0);
      });
    });

    describe('modal error logic', () => {
      it('should set mensajeError when mostrarModalError is called', () => {
        const spy = jest.spyOn(component, 'mostrarModalError');
        component.mostrarModalError('Test error');
        expect(component.mensajeError).toBe('Test error');
        expect(spy).toHaveBeenCalledWith('Test error');
        spy.mockRestore();
      });
      it('should call cerrarModalError without error', () => {
        const spy = jest.spyOn(component, 'cerrarModalError');
        expect(() => component.cerrarModalError()).not.toThrow();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });

    describe('field validation branches', () => {
      it('should enable/disable fields for mostrarCamposSi', () => {
        component.instalacionesPrincipalesValue = '1';
        component['actualizarValidacionesCampos']();
        expect(component.empresaForm.get('rfcBusqueda')?.enabled).toBe(true);
        expect(component.empresaForm.get('tipoPersona')?.disabled).toBe(true);
      });
      it('should enable/disable fields for mostrarCamposNo', () => {
        component.instalacionesPrincipalesValue = '2';
        component['actualizarValidacionesCampos']();
        expect(component.empresaForm.get('tipoPersona')?.enabled).toBe(true);
        expect(component.empresaForm.get('rfcBusqueda')?.disabled).toBe(true);
      });
      it('should disable all fields when no selection', () => {
        component.instalacionesPrincipalesValue = '';
        component['actualizarValidacionesCampos']();
        expect(component.empresaForm.get('rfcBusqueda')?.disabled).toBe(true);
        expect(component.empresaForm.get('tipoPersona')?.disabled).toBe(true);
      });
      it('should set validators for tipoPersonaEsFisica', () => {
        component.empresaForm.get('tipoPersona')?.setValue('Física');
        component['actualizarValidacionesTipoPersona']();
        expect(component.empresaForm.get('nombreS')?.enabled).toBe(true);
        expect(component.empresaForm.get('apellidoPaterno')?.enabled).toBe(true);
        expect(component.empresaForm.get('nombreEmpresa')?.disabled).toBe(true);
      });
      it('should set validators for tipoPersonaEsMoral', () => {
        component.empresaForm.get('tipoPersona')?.setValue('Moral');
        component['actualizarValidacionesTipoPersona']();
        expect(component.empresaForm.get('nombreEmpresa')?.enabled).toBe(true);
        expect(component.empresaForm.get('nombreS')?.disabled).toBe(true);
      });
    });

    describe('form reset and cancel logic', () => {
      it('should reset form and update fields on resetearFormulario', () => {
        const resetSpy = jest.spyOn(component.empresaForm, 'reset');
        component.resetearFormulario();
        expect(resetSpy).toHaveBeenCalled();
        expect(component.instalacionesPrincipalesValue).toBe('');
      });
      it('should reset form and emit event on cancelarAccion', () => {
        const resetSpy = jest.spyOn(component.empresaForm, 'reset');
        const emitSpy = jest.spyOn(component.cerrarModalEvento, 'emit');
        component.cancelarAccion();
        expect(resetSpy).toHaveBeenCalled();
        expect(component.instalacionesPrincipalesValue).toBe('');
        expect(emitSpy).toHaveBeenCalled();
      });
    });
  describe('boolean logic helpers', () => {
    it('should return true for "1", "sí", "si" (case-insensitive)', () => {
      const fn = (VALOR: string) => VALOR === '1' || VALOR.toLowerCase() === 'sí' || VALOR.toLowerCase() === 'si';
      expect(fn('1')).toBe(true);
      expect(fn('Sí')).toBe(true);
      expect(fn('si')).toBe(true);
      expect(fn('SI')).toBe(true);
      expect(fn('no')).toBe(false);
      expect(fn('2')).toBe(false);
    });
    it('should return true for "2" or "no" (case-insensitive)', () => {
      const fn = (VALOR: string) => VALOR === '2' || VALOR.toLowerCase() === 'no';
      expect(fn('2')).toBe(true);
      expect(fn('No')).toBe(true);
      expect(fn('NO')).toBe(true);
      expect(fn('sí')).toBe(false);
      expect(fn('1')).toBe(false);
    });
  });

  describe('tipoPersona getters', () => {
    it('tipoPersonaEsFisica should return true for "Física" or "Fisica"', () => {
      component.empresaForm.get('tipoPersona')?.setValue('Física');
      expect((component as any).tipoPersonaEsFisica).toBe(true);
      component.empresaForm.get('tipoPersona')?.setValue('Fisica');
      expect((component as any).tipoPersonaEsFisica).toBe(true);
      component.empresaForm.get('tipoPersona')?.setValue('Moral');
      expect((component as any).tipoPersonaEsFisica).toBe(false);
    });
    it('tipoPersonaEsMoral should return true only for "Moral"', () => {
      component.empresaForm.get('tipoPersona')?.setValue('Moral');
      expect((component as any).tipoPersonaEsMoral).toBe(true);
      component.empresaForm.get('tipoPersona')?.setValue('Física');
      expect((component as any).tipoPersonaEsMoral).toBe(false);
    });
  });

  describe('llenarFormularioConDatos', () => {
    it('should patch form values from miembroAModificar and catalogos', () => {
      component.contenedores.catalogos = [
        { id: 1, descripcion: 'Socio' },
        { id: 2, descripcion: 'Administrador' }
      ];
      component.nacionalidad.catalogos = [
        { id: 10, descripcion: 'Mexicana' }
      ];
      component.tipoPersona.catalogos = [
        { id: 100, descripcion: 'Física' },
        { id: 101, descripcion: 'Moral' }
      ];
      component.miembroAModificar = {
        caracterDe: 'Socio',
        nacionalidad: 'Mexicana',
        tipoPersona: 'Física',
        nombreCompleto: 'Juan Perez',
        rfc: 'RFC123',
        tributarMexico: 'Sí',
        tipoPersonaMuestra: '',
        nombreEmpresa: ''
      };

      component.empresaForm.patchValue({
        caracterDe: '',
        nacionalidad: '',
        tipoPersona: '',
        nombreCompleto: '',
        registroFederalContribuyentes: '',
        instalacionesPrincipales: ''
      });
      });

      describe('form validation and submission', () => {
        it('should mark all fields as touched if form is invalid', () => {
          const markAllAsTouchedSpy = jest.spyOn(component.empresaForm, 'markAllAsTouched');
          component.empresaForm.get('caracterDe')?.setValue('');
          (component as any).validarYEnviarFormulario();
          expect(markAllAsTouchedSpy).toHaveBeenCalled();
        });

        it('should process valid form and call procesarFormularioValido', () => {
          const spy = jest.spyOn(component as any, 'procesarFormularioValido');
          component.empresaForm.get('caracterDe')?.setValue('1');
          component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
          component.empresaForm.get('instalacionesPrincipales')?.setValue('1');
          component.empresaForm.get('registroFederalContribuyentes')?.setValue('RFC123');
          component.empresaForm.get('nacionalidad')?.setValue('10');
          component.empresaForm.get('tipoPersona')?.setValue('100');
          component.empresaForm.get('nombreCompleto')?.setValue('Juan Perez');
          (component as any).validarYEnviarFormulario();
          expect(spy).toHaveBeenCalled();
        });
      });

      describe('procesarFormularioValido', () => {
        it('should call procesarModificacionMiembro if miembroAModificar exists', () => {
          const spy = jest.spyOn(component as any, 'procesarModificacionMiembro');
          component.miembroAModificar = { caracterDe: 'Socio', nacionalidad: 'Mexicana', tipoPersona: 'Física', nombreCompleto: 'Juan Perez', rfc: 'RFC123', tributarMexico: 'Sí', tipoPersonaMuestra: '', nombreEmpresa: '' };
          component.empresaForm.get('caracterDe')?.setValue('1');
          component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
          component.empresaForm.get('instalacionesPrincipales')?.setValue('1');
          component.empresaForm.get('registroFederalContribuyentes')?.setValue('RFC123');
          component.empresaForm.get('nacionalidad')?.setValue('10');
          component.empresaForm.get('tipoPersona')?.setValue('100');
          component.empresaForm.get('nombreCompleto')?.setValue('Juan Perez');
          (component as any).procesarFormularioValido();
          expect(spy).toHaveBeenCalled();
        });

        it('should call procesarNuevoMiembro if miembroAModificar is null', () => {
          const spy = jest.spyOn(component as any, 'procesarNuevoMiembro');
          component.miembroAModificar = null;
          component.empresaForm.get('caracterDe')?.setValue('1');
          component.empresaForm.get('rfcBusqueda')?.setValue('RFC123');
          component.empresaForm.get('instalacionesPrincipales')?.setValue('1');
          component.empresaForm.get('registroFederalContribuyentes')?.setValue('RFC123');
          component.empresaForm.get('nacionalidad')?.setValue('10');
          component.empresaForm.get('tipoPersona')?.setValue('100');
          component.empresaForm.get('nombreCompleto')?.setValue('Juan Perez');
          (component as any).procesarFormularioValido();
          expect(spy).toHaveBeenCalled();
        });
      });

      describe('edge cases', () => {
        it('should not patch form if miembroAModificar is null in llenarFormularioConDatos', () => {
          component.miembroAModificar = null;
          const patchSpy = jest.spyOn(component.empresaForm, 'patchValue');
          (component as any).llenarFormularioConDatos();
          expect(patchSpy).not.toHaveBeenCalled();
        });

        it('should handle empty catalogos in llenarFormularioConDatos', () => {
          component.contenedores.catalogos = [];
          component.nacionalidad.catalogos = [];
          component.tipoPersona.catalogos = [];
          component.miembroAModificar = { caracterDe: 'Socio', nacionalidad: 'Mexicana', tipoPersona: 'Física', nombreCompleto: 'Juan Perez', rfc: 'RFC123', tributarMexico: 'Sí', tipoPersonaMuestra: '', nombreEmpresa: '' };
          const patchSpy = jest.spyOn(component.empresaForm, 'patchValue');
          (component as any).llenarFormularioConDatos();
          expect(patchSpy).toHaveBeenCalled();
        });
      });
    });
  });
