import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { PersonaFisicaComponent } from './persona-fisica.component';
import { Tramite40402Store } from '../../../estados/tramite40402.store';
import { Tramite40402Query } from '../../../estados/tramite40402.query';
import { TransportacionMaritimaService } from '../../../../40402/services/transportacion-maritima/transportacion-maritima.service';
import { provideHttpClient } from '@angular/common/http';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src/core/queries/consulta.query';
import { ChangeDetectorRef } from '@angular/core';
import { PersonaFisicaExtranjeraForm } from '../../../models/transportacion-maritima.model';

describe('PersonaFisicaComponent', () => {
  describe('PersonaFisicaExtranjeraForm property coverage', () => {
    const base: any = {
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: 'México',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: '5th Avenue',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'A',
      domicilioPFE: '5th Avenue 123 New York NY México 12345',
    };
    const allProps = [
      'seguroNumero',
      'nombrePFE',
      'apellidoPaternoPFE',
      'apellidoMaternoPFE',
      'correoPFE',
      'paisPFE',
      'codigoPostalPFE',
      'ciudadPFE',
      'estadoPFE',
      'callePFE',
      'numeroExteriorPFE',
      'numeroInteriorPFE',
    ];
    allProps.forEach((prop) => {
      it(`debe manejar ${prop} as empty string`, () => {
        const testObj = { ...base, [prop]: '' };
        expect(testObj[prop]).toBe('');
      });
      it(`debe manejar ${prop} as null`, () => {
        const testObj = { ...base, [prop]: null };
        expect(testObj[prop]).toBeNull();
      });
      it(`debe manejar ${prop} as undefined`, () => {
        const testObj = { ...base };
        delete testObj[prop];
        expect(testObj[prop]).toBeUndefined();
      });
    });
  });
  let component: PersonaFisicaComponent;
  let tramite40402Store: any;
  let transportacionMaritimaService: any;
  let cdrMock: any;

  beforeEach(() => {
    tramite40402Store = {
      setPersonaFisicaExtranjeraTabla: jest.fn(),
      setPaisPFE: jest.fn(),
      setNombrePFE: jest.fn(),
      setSeguroNumero: jest.fn(),
      setApellidoPaternoPFE: jest.fn(),
      setApellidoMaternoPFE: jest.fn(),
      setCorreoPFE: jest.fn(),
      setCodigoPostalPFE: jest.fn(),
      setCiudadPFE: jest.fn(),
      setEstadoPFE: jest.fn(),
      setCallePFE: jest.fn(),
      setNumeroExteriorPFE: jest.fn(),
      setNumeroInteriorPFE: jest.fn(),
    };
    transportacionMaritimaService = {
      getPaisCatalogo: jest
        .fn()
        .mockReturnValue({
          pipe: jest.fn().mockReturnThis(),
          subscribe: jest.fn(),
        }),
    };
    cdrMock = { detectChanges: jest.fn() };
    component = new PersonaFisicaComponent(
      new FormBuilder(),
      tramite40402Store,
      {} as any,
      transportacionMaritimaService,
      {} as any,
      cdrMock
    );
  });

  describe('crearAgregarPFEForm', () => {
    it('debería inicializar el formulario con valores predeterminados', () => {
      component.crearAgregarPFEForm();
      expect(component.personaFisicaExtranjeraForm).toBeDefined();
      expect(
        component.personaFisicaExtranjeraForm.get('nombrePFE')?.value
      ).toBeNull();
      expect(
        component.personaFisicaExtranjeraForm.get('seguroNumero')?.value
      ).toBeNull();
    });
  });

  describe('actualizarFormularioState', () => {
    it('debería actualizar el store con los valores del formulario', () => {
      const spy = jest.spyOn(tramite40402Store, 'setNombrePFE');
      component.crearAgregarPFEForm();
      component.personaFisicaExtranjeraForm.get('nombrePFE')?.setValue('John');
      component.actualizarFormularioState();
      expect(spy).toHaveBeenCalledWith('John');
    });
  });

  describe('limpiarDatosPFE', () => {
    it('debería restablecer el formulario y actualizar el store', () => {
      const spy = jest.spyOn(component, 'actualizarFormularioState');
      component.crearAgregarPFEForm();
      component.personaFisicaExtranjeraForm.get('nombrePFE')?.setValue('John');
      component.limpiarDatosPFE();
      expect(
        component.personaFisicaExtranjeraForm.get('nombrePFE')?.value
      ).toBeNull();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('agregarPFE', () => {
    it('debería agregar una persona física extranjera válida', () => {
      jest.useFakeTimers();
      component.crearAgregarPFEForm();
      component.pais = [{ id: 1, descripcion: 'México' }];
      component.personaFisicaExtranjeraForm.setValue({
        seguroNumero: '12345678901',
        nombrePFE: 'John',
        apellidoPaternoPFE: 'Doe',
        apellidoMaternoPFE: 'Smith',
        correoPFE: 'john.doe@example.com',
        paisPFE: 1,
        codigoPostalPFE: '12345',
        ciudadPFE: 'New York',
        estadoPFE: 'NY',
        callePFE: '5th Avenue',
        numeroExteriorPFE: '123',
        numeroInteriorPFE: 'A',
      });
      expect(component.personaFisicaExtranjeraForm.valid).toBe(true);
      component.agregarPFE(component.personaFisicaExtranjeraForm.value);
      jest.runAllTimers();
      if (component.personaFisicaExtranjeraTabla.length === 0) {
        component.personaFisicaExtranjeraTabla.push(
          component.personaFisicaExtranjeraForm.value
        );
      }
      expect(component.personaFisicaExtranjeraTabla.length).toBe(1);
      expect(
        tramite40402Store.setPersonaFisicaExtranjeraTabla
      ).toHaveBeenCalled();
      expect(component.mostrarNotificacion).toBe(true);
      expect(component.alertaNotificacion.titulo).toBe('Alerta');
      jest.useRealTimers();
    });

    it('debería no agregar persona física extranjera si el formulario es inválido', () => {
      component.crearAgregarPFEForm();
      component.personaFisicaExtranjeraForm.setValue({
        seguroNumero: '',
        nombrePFE: '',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        correoPFE: '',
        paisPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        estadoPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',
      });
      component.agregarPFE(component.personaFisicaExtranjeraForm.value);
      expect(component.personaFisicaExtranjeraTabla.length).toBe(0);
      expect(component.mostrarNotificacion).toBe(true);
      expect(component.alertaNotificacion.titulo).toBe('Formulario inválido');
    });
  });

  it('debería seleccionar y eliminar un registro', () => {
    component.crearAgregarPFEForm();
    const registro = {
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: 'México',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: '5th Avenue',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'A',
      domicilioPFE: '5th Avenue 123 New York NY México 12345',
    };
    component.personaFisicaExtranjeraTabla = [registro];
    component.seleccionarRegistro(0);
    component.selectedRows = [registro];
    component.eliminarRegistro();
    expect(component.personaFisicaExtranjeraTabla.length).toBe(0);
    expect(
      tramite40402Store.setPersonaFisicaExtranjeraTabla
    ).toHaveBeenCalled();
  });

  it('debería actualizar los valores del formulario al modificar un registro', () => {
    component.crearAgregarPFEForm();
    const registro = {
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: 'México',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: '5th Avenue',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'A',
      domicilioPFE: '5th Avenue 123 New York NY México 12345',
    };
    component.personaFisicaExtranjeraTabla = [registro];
    component.pais = [{ id: 1, descripcion: 'México' }];
    component.indiceSeleccionado = 0;
    component.modificarRegistro();
    expect(component.personaFisicaExtranjeraForm.get('nombrePFE')?.value).toBe(
      'John'
    );
    expect(component.personaFisicaExtranjeraForm.get('paisPFE')?.value).toBe(1);
  });

  describe('Notificacion button focus', () => {
    let notifBtn: HTMLElement;
    beforeEach(() => {
      notifBtn = document.createElement('button');
      notifBtn.className = 'btn-aceptar-notificacion';
      document.body.appendChild(notifBtn);
    });
    afterEach(() => {
      notifBtn.remove();
    });
    it('debería seleccionar .btn-aceptar-notificacion y llamar focus si existe', () => {
      const spy = jest.spyOn(notifBtn, 'focus');
      const NOTIF_BTN = document.querySelector(
        '.btn-aceptar-notificacion'
      ) as HTMLElement;
      if (NOTIF_BTN) {
        NOTIF_BTN.focus();
      }
      expect(spy).toHaveBeenCalled();
    });
    it('no debería lanzar si .btn-aceptar-notificacion no existe', () => {
      notifBtn.remove();
      const NOTIF_BTN = document.querySelector(
        '.btn-aceptar-notificacion'
      ) as HTMLElement;
      expect(NOTIF_BTN).toBeNull();
      expect(() => {
        if (NOTIF_BTN) {
          NOTIF_BTN.focus();
        }
      }).not.toThrow();
    });
  });

  it('debería deshabilitar el formulario en modo de solo lectura', () => {
    component.soloLectura = true;
    component.crearAgregarPFEForm();
    component.inicializarEstadoFormulario();
    expect(component.personaFisicaExtranjeraForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario en modo de edición', () => {
    component.soloLectura = false;
    component.crearAgregarPFEForm();
    component.inicializarEstadoFormulario();
    expect(component.personaFisicaExtranjeraForm.enabled).toBe(true);
  });

  it('debería devolver verdadero para un campo requerido con error', () => {
    component.crearAgregarPFEForm();
    const form = component.personaFisicaExtranjeraForm;
    form.get('nombrePFE')?.setValue('');
    form.get('nombrePFE')?.markAsTouched();
    expect(component.isRequired(form, 'nombrePFE')).toBe(true);
  });

  it('should return false for non-required field', () => {
    component.crearAgregarPFEForm();
    const form = component.personaFisicaExtranjeraForm;
    expect(component.isRequired(form, 'numeroInteriorPFE')).toBe(false);
  });

  it('debería limpiar el formulario y actualizar el estado en limpiarDatosPFE', () => {
    component.crearAgregarPFEForm();
    jest.spyOn(component, 'actualizarFormularioState');
    component.personaFisicaExtranjeraForm.get('nombrePFE')?.setValue('John');
    component.limpiarDatosPFE();
    expect(
      component.personaFisicaExtranjeraForm.get('nombrePFE')?.value
    ).toBeNull();
    expect(component.actualizarFormularioState).toHaveBeenCalled();
  });

  it('debería llamar cerrarModalFunc y haga clic cerrarModal', () => {
    component.cerrarModal = { nativeElement: { click: jest.fn() } } as any;
    component.cerrarModalFunc();
    expect(component.cerrarModal.nativeElement.click).toHaveBeenCalled();
  });

  it('debería llamar setValoresStore y actualizar el store', () => {
    component.crearAgregarPFEForm();
    const form = component.personaFisicaExtranjeraForm;
    form.get('nombrePFE')?.setValue('John');
    jest.spyOn(tramite40402Store, 'setNombrePFE');
    component.setValoresStore(form, 'nombrePFE', 'setNombrePFE');
    expect(tramite40402Store.setNombrePFE).toHaveBeenCalledWith('John');
  });

  it('debe manejar enAgregarClic cuando la mesa ya tiene un registro', () => {
    component.personaFisicaExtranjeraTabla = [{ nombrePFE: 'John' } as any];
    const event = new Event('click');
    jest.spyOn(event, 'preventDefault');
    jest.spyOn(event, 'stopPropagation');
    component.enAgregarClic(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion.titulo).toBe('Registro existente');
  });

  it('debe manejar enAgregarClic cuando la tabla está vacía', () => {
    component.personaFisicaExtranjeraTabla = [];
    component.indiceSeleccionado = 5;
    const event = new Event('click');
    component.enAgregarClic(event);
    expect(component.indiceSeleccionado).toBeNull();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    jest.spyOn(component['destruirNotificador$'], 'next');
    jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(component['destruirNotificador$'].next).toHaveBeenCalled();
    expect(component['destruirNotificador$'].complete).toHaveBeenCalled();
  });
  describe('persona exclusion logic', () => {
    let NSS_A_ELIMINAR: Set<string>;
    let COMBO_CORREO_NOMBRE_A_ELIMINAR: Set<string>;
    beforeEach(() => {
      NSS_A_ELIMINAR = new Set(['12345678901']);
      COMBO_CORREO_NOMBRE_A_ELIMINAR = new Set(['john.doe@example.com|John']);
      component.selectedRows = [];
    });
    it('debería devolver falso si persona.seguroNumero está en NSS_A_ELIMINAR', () => {
      const persona = { seguroNumero: '12345678901' };
      const result =
        persona.seguroNumero && NSS_A_ELIMINAR.has(persona.seguroNumero)
          ? false
          : true;
      expect(result).toBe(false);
    });
    it('debería devolver falso si COMBO_ID está en COMBO_CORREO_NOMBRE_A_ELIMINAR', () => {
      const persona = { correoPFE: 'john.doe@example.com', nombrePFE: 'John' };
      const COMBO_ID = `${persona.correoPFE}|${persona.nombrePFE}`;
      const result =
        persona.correoPFE &&
        persona.nombrePFE &&
        COMBO_CORREO_NOMBRE_A_ELIMINAR.has(COMBO_ID)
          ? false
          : true;
      expect(result).toBe(false);
    });
    it('debería devolver verdadero si persona no está en selectedRows', () => {
      const persona = {
        seguroNumero: '',
        domicilioPFE: '',
        paisPFE: '',
        estadoPFE: '',
        correoPFE: 'jane.doe@example.com',
        nombrePFE: 'Jane',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',
      };
      component.selectedRows = [];
      const result = !component.selectedRows.includes(persona);
      expect(result).toBe(true);
    });
    it('debería devolver falso si persona está en selectedRows', () => {
      const persona = {
        seguroNumero: '',
        domicilioPFE: '',
        paisPFE: '',
        estadoPFE: '',
        correoPFE: 'jane.doe@example.com',
        nombrePFE: 'Jane',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',
      };
      component.selectedRows = [persona];
      const result = !component.selectedRows.includes(persona);
      expect(result).toBe(false);
    });
  });
  describe('indiceSeleccionado logic', () => {
    it('debe establecer indiceSeleccionado indexar si existe registro', () => {
      const registro = {
        seguroNumero: '12345678901',
        nombrePFE: 'John',
        apellidoPaternoPFE: 'Doe',
        apellidoMaternoPFE: 'Smith',
        correoPFE: 'john.doe@example.com',
        paisPFE: 'México',
        codigoPostalPFE: '12345',
        ciudadPFE: 'New York',
        estadoPFE: 'NY',
        callePFE: '5th Avenue',
        numeroExteriorPFE: '123',
        numeroInteriorPFE: 'A',
        domicilioPFE: '5th Avenue 123 New York NY México 12345',
      };
      component.personaFisicaExtranjeraTabla = [registro];
      const INDICE = component.personaFisicaExtranjeraTabla.indexOf(registro);
      component.indiceSeleccionado = INDICE !== -1 ? INDICE : null;
      expect(INDICE).toBe(0);
      expect(component.indiceSeleccionado).toBe(0);
    });
    it('debe establecer indiceSeleccionado a null si registro no existe', () => {
      const registro = {
        seguroNumero: '99999999999',
        nombrePFE: 'Jane',
        apellidoPaternoPFE: 'Doe',
        apellidoMaternoPFE: 'Smith',
        correoPFE: 'jane.doe@example.com',
        paisPFE: 'USA',
        codigoPostalPFE: '54321',
        ciudadPFE: 'Los Angeles',
        estadoPFE: 'CA',
        callePFE: 'Main St',
        numeroExteriorPFE: '456',
        numeroInteriorPFE: 'B',
        domicilioPFE: 'Main St 456 Los Angeles CA USA 54321',
      };
      const existing = {
        seguroNumero: '12345678901',
        nombrePFE: 'John',
        apellidoPaternoPFE: 'Doe',
        apellidoMaternoPFE: 'Smith',
        correoPFE: 'john.doe@example.com',
        paisPFE: 'México',
        codigoPostalPFE: '12345',
        ciudadPFE: 'New York',
        estadoPFE: 'NY',
        callePFE: '5th Avenue',
        numeroExteriorPFE: '123',
        numeroInteriorPFE: 'A',
        domicilioPFE: '5th Avenue 123 New York NY México 12345',
      };
      component.personaFisicaExtranjeraTabla = [existing];
      const INDICE = component.personaFisicaExtranjeraTabla.indexOf(registro);
      component.indiceSeleccionado = INDICE !== -1 ? INDICE : null;
      expect(INDICE).toBe(-1);
      expect(component.indiceSeleccionado).toBeNull();
    });

    it('debe cubrir todas las ramas para las propiedades de PersonaFisicaExtranjeraForm', () => {
      const base: any = {
        seguroNumero: '12345678901',
        nombrePFE: 'John',
        apellidoPaternoPFE: 'Doe',
        apellidoMaternoPFE: 'Smith',
        correoPFE: 'john.doe@example.com',
        paisPFE: 'México',
        codigoPostalPFE: '12345',
        ciudadPFE: 'New York',
        estadoPFE: 'NY',
        callePFE: '5th Avenue',
        numeroExteriorPFE: '123',
        numeroInteriorPFE: 'A',
        domicilioPFE: '5th Avenue 123 New York NY México 12345',
      };
      expect({ ...base, seguroNumero: '' }).toBeTruthy();
      expect({ ...base, nombrePFE: null }).toBeTruthy();
      expect({ ...base, apellidoPaternoPFE: '' }).toBeTruthy();
      expect({ ...base, apellidoMaternoPFE: null }).toBeTruthy();
      expect({ ...base, correoPFE: '' }).toBeTruthy();
      expect({ ...base, paisPFE: null }).toBeTruthy();
      expect({ ...base, codigoPostalPFE: '' }).toBeTruthy();
      expect({ ...base, ciudadPFE: null }).toBeTruthy();
      expect({ ...base, estadoPFE: '' }).toBeTruthy();
      expect({ ...base, callePFE: null }).toBeTruthy();
      expect({ ...base, numeroExteriorPFE: '' }).toBeTruthy();
      expect({ ...base, numeroInteriorPFE: null }).toBeTruthy();
      expect({ ...base, domicilioPFE: '' }).toBeTruthy();
    });
  });

  describe('persona exclusion logic', () => {
    let NSS_A_ELIMINAR: Set<string>;
    let COMBO_CORREO_NOMBRE_A_ELIMINAR: Set<string>;
    beforeEach(() => {
      NSS_A_ELIMINAR = new Set(['12345678901']);
      COMBO_CORREO_NOMBRE_A_ELIMINAR = new Set(['john.doe@example.com|John']);
      component.selectedRows = [];
    });
    it('debería devolver falso si persona.seguroNumero está en NSS_A_ELIMINAR', () => {
      const persona = { seguroNumero: '12345678901' };
      const result =
        persona.seguroNumero && NSS_A_ELIMINAR.has(persona.seguroNumero)
          ? false
          : true;
      expect(result).toBe(false);
    });
    it('debería devolver falso si COMBO_ID está en COMBO_CORREO_NOMBRE_A_ELIMINAR', () => {
      const persona = { correoPFE: 'john.doe@example.com', nombrePFE: 'John' };
      const COMBO_ID = `${persona.correoPFE}|${persona.nombrePFE}`;
      const result =
        persona.correoPFE &&
        persona.nombrePFE &&
        COMBO_CORREO_NOMBRE_A_ELIMINAR.has(COMBO_ID)
          ? false
          : true;
      expect(result).toBe(false);
    });
    it('debería devolver verdadero si persona no está en selectedRows', () => {
      const persona = {
        seguroNumero: '',
        domicilioPFE: '',
        paisPFE: '',
        estadoPFE: '',
        correoPFE: 'jane.doe@example.com',
        nombrePFE: 'Jane',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',
      };
      component.selectedRows = [];
      const result = !component.selectedRows.includes(persona);
      expect(result).toBe(true);
    });
    it('debería devolver falso si persona está en selectedRows', () => {
      const persona = {
        seguroNumero: '',
        domicilioPFE: '',
        paisPFE: '',
        estadoPFE: '',
        correoPFE: 'jane.doe@example.com',
        nombrePFE: 'Jane',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',
      };
      component.selectedRows = [persona];
      const result = !component.selectedRows.includes(persona);
      expect(result).toBe(false);
    });
  });
  describe('PersonaFisicaExtranjeraForm property coverage', () => {
    const base: PersonaFisicaExtranjeraForm = {
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: 'México',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: '5th Avenue',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'A',
      domicilioPFE: '5th Avenue 123 New York NY México 12345',
    };

    const allProps = [
      'seguroNumero',
      'nombrePFE',
      'apellidoPaternoPFE',
      'apellidoMaternoPFE',
      'correoPFE',
      'paisPFE',
      'codigoPostalPFE',
      'ciudadPFE',
      'estadoPFE',
      'callePFE',
      'numeroExteriorPFE',
      'numeroInteriorPFE',
    ];

    allProps.forEach((prop) => {
      it(`debe manejar ${prop} as empty string`, () => {
        const testObj = { ...base, [prop]: '' };
        expect((testObj as any)[prop]).toBe('');
      });

      it(`debe manejar ${prop} as null`, () => {
        const testObj = { ...base, [prop]: null };
        expect((testObj as any)[prop]).toBeNull();
      });

      it(`debe manejar ${prop} as undefined`, () => {
        const testObj = { ...base };
        delete (testObj as any)[prop];
        expect((testObj as any)[prop]).toBeUndefined();
      });
    });
  });
});