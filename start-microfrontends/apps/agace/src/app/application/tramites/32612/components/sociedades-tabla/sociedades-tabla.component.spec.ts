import { SociedadesTablaComponent } from './sociedades-tabla.component';
import { EsquemaDeCertificacionService } from '../../services/esquema-de-certificacion.service';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

describe('SociedadesTablaComponent', () => {
  let component: SociedadesTablaComponent;
  let esquemaDeCertificacionSvc: any;
  let tramite32612Store: any;
  let tramite32612Query: any;
  let consultaioQuery: any;
  let modalService: any;

  beforeEach(() => {
    esquemaDeCertificacionSvc = {
      getSociedadesTablaDatos: jest.fn(),
      getDatosDeLasInstalaciones: jest.fn()
    };
    tramite32612Store = {
      setDynamicFieldValue: jest.fn()
    };
    tramite32612Query = {
      selectSolicitude$: jest.fn()
    };
    consultaioQuery = {
      selectConsultaioState$: jest.fn().mockReturnValue(of({ readonly: false }))
    };
    modalService = {
      show: jest.fn()
    };

    component = new SociedadesTablaComponent(
      esquemaDeCertificacionSvc,
      tramite32612Store,
      tramite32612Query,
      consultaioQuery,
      modalService
    );
    // Simulate ngOnInit if needed
    component.ngOnInit?.();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSociedadesTabla and set sociedadesDatos', () => {
    const mockSociedades = [{ id: 1, nombre: 'Sociedad 1' }];
    esquemaDeCertificacionSvc.getSociedadesTablaDatos.mockReturnValue(of(mockSociedades));
    component.getSociedadesTabla();
    expect(component.sociedadesDatos).toEqual(mockSociedades);
  });

  it('should call getDatosDeLasInstalacionesDatos and set instalacionesDatos', () => {
    const mockInstalaciones = [{ id: 1, nombre: 'Instalacion 1' }];
    esquemaDeCertificacionSvc.getDatosDeLasInstalaciones.mockReturnValue(of(mockInstalaciones));
    component.getDatosDeLasInstalacionesDatos();
    expect(component.instalacionesDatos).toEqual(mockInstalaciones);
  });

  it('should open modal when abrirModal is called', () => {
    const template = {} as TemplateRef<void>;
    modalService.show.mockReturnValue({} as BsModalRef);
    component.abrirModal(template);
    expect(modalService.show).toHaveBeenCalledWith(template, { class: 'modal-lg' });
    expect(component.modalRef).toBeDefined();
  });

  it('should emit value change', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should clean up on destroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should return agregarSociedadesFormGroup', () => {
    expect(component.agregarSociedadesFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should return agregarFormGroup', () => {
    expect(component.agregarFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should return indiqueSiDatos', () => {
    expect(component.indiqueSiDatos).toBeInstanceOf(FormGroup);
  });

  it('should return modificarFormGroup', () => {
    expect(component.modificarFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should set seleccionarlistaSociedades when seleccionarlistaSeccionSociedades is called', () => {
    const sociedades = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }];
    component.seleccionarlistaSeccionSociedades(sociedades as any);
    expect(component.seleccionarlistaSociedades).toEqual(sociedades as any);
  });

  it('should reset agregarSociedadesFormGroup when limpiarAgregarSociedadesFormulario is called', () => {
    const spy = jest.spyOn(component.agregarSociedadesFormGroup, 'reset');
    component.limpiarAgregarSociedadesFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove selected sociedades when eliminarSociedades is called', () => {
    const sociedad = { rfc: 'RFC1', denominacion: 'Den', aduanaEnLaQueActua: 'Actua', fiscales: 'Fisc' };
    component.sociedadesDatos = [sociedad as any, { rfc: 'RFC2', denominacion: 'Den2', aduanaEnLaQueActua: 'A2', fiscales: 'F2' } as any];
    component.seleccionarlistaSociedades = [sociedad as any];
    component.eliminarSociedades();
    expect(component.sociedadesDatos.length).toBe(1);
    expect(component.seleccionarlistaSociedades.length).toBe(0);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('Sociedades', component.sociedadesDatos);
  });

  it('should patch agregarSociedadesFormGroup when buscarEvento is called and resigtro exists', () => {
    component.agregarSociedadesFormGroup.addControl('resigtro', { value: 'something', setValue: () => {}, patchValue: jest.fn() } as any);
    component.agregarSociedadesFormGroup.get('resigtro')!.setValue('something');
    component.agregarSociedadesFormGroup.patchValue = jest.fn();
    component.buscarEvento();
    expect(component.agregarSociedadesFormGroup.patchValue).toHaveBeenCalledWith({
      rfc: 'RFT453DF998',
      denominacion: 'CDY YTRWQ SAHCH'
    });
  });

  it('should call modificarSociedades when abrirModal called with Valor=modificarSociedades', () => {
    const spy = jest.spyOn(component, 'modificarSociedades');
    const template = {} as TemplateRef<void>;
    modalService.show.mockReturnValue({} as BsModalRef);
    component.abrirModal(template, 'modificarSociedades');
    expect(spy).toHaveBeenCalled();
  });

  it('should call modificarMandatarios when abrirModal called with Valor=modificarMandatarios', () => {
    const spy = jest.spyOn(component, 'modificarMandatarios');
    const template = {} as TemplateRef<void>;
    modalService.show.mockReturnValue({} as BsModalRef);
    component.abrirModal(template, 'modificarMandatarios');
    expect(spy).toHaveBeenCalled();
  });

  it('should call modificarInstalaciones when abrirModal called with Valor=modificarInstalaciones', () => {
    const spy = jest.spyOn(component, 'modificarInstalaciones');
    const template = {} as TemplateRef<void>;
    modalService.show.mockReturnValue({} as BsModalRef);
    component.abrirModal(template, 'modificarInstalaciones');
    expect(spy).toHaveBeenCalled();
  });

  it('should set seleccionarlistaInstalaciones when seleccionarlistaSeccionInstalaciones is called', () => {
    const instalaciones = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }];
    component.seleccionarlistaSeccionInstalaciones(instalaciones as any);
    expect(component.seleccionarlistaInstalaciones).toEqual(instalaciones as any);
  });

  it('should set seleccionarlistaMandatarios when seleccionarlistaSeccionMandatarios is called', () => {
    const mandatarios = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }];
    component.seleccionarlistaSeccionMandatarios(mandatarios as any);
    expect(component.seleccionarlistaMandatarios).toEqual(mandatarios as any);
  });

  it('should patch mandatariosDelAgenteFormGroup when buscarMandatariosEvento is called and rfcRegistro exists', () => {
    component.mandatariosDelAgenteFormGroup.addControl('rfcRegistro', { value: 'something', setValue: jest.fn(), patchValue: jest.fn() } as any);
    component.mandatariosDelAgenteFormGroup.get('rfcRegistro')!.setValue('something');
    component.mandatariosDelAgenteFormGroup.patchValue = jest.fn();
    component.buscarMandatariosEvento();
    expect(component.mandatariosDelAgenteFormGroup.patchValue).toHaveBeenCalledWith({
      rfc: 'AC3453DF998',
      razonSocial: 'AAD FDYUSADY HGDAYUDGYW'
    });
  });

  it('should add new mandatario when aceptarMandatarios called with no selection', () => {
    component.seleccionarlistaMandatarios = [];
    component.mandatariosDelAgenteFormGroup.addControl('rfc', { value: 'RFCX', valueChanges: of('RFCX'), setValue: () => {} } as any);
    component.mandatariosDelAgenteFormGroup.addControl('razonSocial', { value: 'RSX', valueChanges: of('RSX'), setValue: () => {} } as any);
    component.mandatariosDelAgenteFormGroup.addControl('fiscales', { value: 'FX', valueChanges: of('FX'), setValue: () => {} } as any);
    component.mandatariosDatos = [];
    component.modalRef = { hide: jest.fn() } as any;
    component.aceptarMandatarios();
    expect(component.mandatariosDatos.length).toBe(1);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('MandatariosDeAgenteAduanal', component.mandatariosDatos);
  });

  it('should update mandatario when aceptarMandatarios called with selection', () => {
    const mandatario = { rfc: 'RFCX', razonSocial: 'RSX', fiscales: 'FX' };
    component.mandatariosDatos = [mandatario as any];
    component.seleccionarlistaMandatarios = [mandatario as any];
    component.mandatariosDelAgenteFormGroup.addControl('rfcRegistro', { value: 'RFCY', setValue: () => {} } as any);
    component.mandatariosDelAgenteFormGroup.addControl('razonSocial', { value: 'RSY', setValue: () => {} } as any);
    component.mandatariosDelAgenteFormGroup.addControl('fiscales', { value: 'FY', setValue: () => {} } as any);
    component.modalRef = { hide: jest.fn() } as any;
    component.aceptarMandatarios();
    expect(component.mandatariosDatos[0].rfc).toBe('RFCY');
    expect(component.mandatariosDatos[0].razonSocial).toBe('RSY');
    expect(component.mandatariosDatos[0].fiscales).toBe('FY');
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('MandatariosDeAgenteAduanal', component.mandatariosDatos);
  });

  it('should reset mandatariosDelAgenteFormGroup when limpiarMandatariosFormulario is called', () => {
    const spy = jest.spyOn(component.mandatariosDelAgenteFormGroup, 'reset');
    component.limpiarMandatariosFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove selected mandatarios when eliminarMandatarios is called', () => {
    const mandatario = { rfc: 'RFC1', razonSocial: 'RS1', fiscales: 'F1' };
    component.mandatariosDatos = [mandatario as any, { rfc: 'RFC2', razonSocial: 'RS2', fiscales: 'F2' } as any];
    component.seleccionarlistaMandatarios = [mandatario as any];
    component.eliminarMandatarios();
    expect(component.mandatariosDatos.length).toBe(1);
    expect(component.seleccionarlistaMandatarios.length).toBe(0);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('MandatariosDeAgenteAduanal', component.mandatariosDatos);
  });

  it('should add new instalaciones when aceptarAgregar is called', () => {
    component.agregarFormGroup.addControl('rfcDelAgente', { value: 'RFCI', setValue: () => {} } as any);
    component.agregarFormGroup.addControl('entidadFederativa', { value: 'EFI', setValue: () => {} } as any);
    component.instalacionesDatos = [];
    component.modalRef = { hide: jest.fn() } as any;
    component.aceptarAgregar();
    expect(component.instalacionesDatos.length).toBe(1);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('Instalaciones', component.instalacionesDatos);
  });

  it('should remove selected instalaciones when eliminarInstalaciones is called', () => {
    const instalacion = { rfc: 'RFC1', entidadFederativa: 'EF1' };
    component.instalacionesDatos = [instalacion as any, { rfc: 'RFC2', entidadFederativa: 'EF2' } as any];
    component.seleccionarlistaInstalaciones = [instalacion as any];
    component.eliminarInstalaciones();
    expect(component.instalacionesDatos.length).toBe(1);
    expect(component.seleccionarlistaInstalaciones.length).toBe(0);
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('Instalaciones', component.instalacionesDatos);
  });

  it('should set agregarFormGroup values when modificarInstalaciones is called with selection', () => {
    const instalacion = { rfc: 'RFC1', entidadFederativa: 'EF1' };
    component.seleccionarlistaInstalaciones = [instalacion as any];
    component.agregarFormGroup.addControl('rfc', { setValue: jest.fn() } as any);
    component.agregarFormGroup.addControl('entidadFederativa', { setValue: jest.fn() } as any);
    component.modificarInstalaciones();
    expect(component.agregarFormGroup.get('rfc')!.setValue).toHaveBeenCalledWith('RFC1');
    expect(component.agregarFormGroup.get('entidadFederativa')!.setValue).toHaveBeenCalledWith('EF1');
  });

  it('should set agregarSociedadesFormGroup values when modificarSociedades is called with selection', () => {
    const sociedad = { rfc: 'RFC1', denominacion: 'Den', aduanaEnLaQueActua: 'Actua', fiscales: 'Fisc' };
    component.seleccionarlistaSociedades = [sociedad as any];
    component.agregarSociedadesFormGroup.addControl('rfc', { setValue: jest.fn() } as any);
    component.agregarSociedadesFormGroup.addControl('denominacion', { setValue: jest.fn() } as any);
    component.agregarSociedadesFormGroup.addControl('aduanaEnLaQueActua', { setValue: jest.fn() } as any);
    component.agregarSociedadesFormGroup.addControl('fiscales', { setValue: jest.fn() } as any);
    component.modificarSociedades();
    expect(component.agregarSociedadesFormGroup.get('rfc')!.setValue).toHaveBeenCalledWith('RFC1');
    expect(component.agregarSociedadesFormGroup.get('denominacion')!.setValue).toHaveBeenCalledWith('Den');
    expect(component.agregarSociedadesFormGroup.get('aduanaEnLaQueActua')!.setValue).toHaveBeenCalledWith('Actua');
    expect(component.agregarSociedadesFormGroup.get('fiscales')!.setValue).toHaveBeenCalledWith('Fisc');
  });

  it('should set mandatariosDelAgenteFormGroup values when modificarMandatarios is called with selection', () => {
    const mandatario = { rfc: 'RFC1', razonSocial: 'RS1', fiscales: 'F1' };
    component.seleccionarlistaMandatarios = [mandatario as any];
    component.mandatariosDelAgenteFormGroup.addControl('rfc', { setValue: jest.fn() } as any);
    component.mandatariosDelAgenteFormGroup.addControl('razonSocial', { setValue: jest.fn() } as any);
    component.mandatariosDelAgenteFormGroup.addControl('fiscales', { setValue: jest.fn() } as any);
    component.modificarMandatarios();
    expect(component.mandatariosDelAgenteFormGroup.get('rfc')!.setValue).toHaveBeenCalledWith('RFC1');
    expect(component.mandatariosDelAgenteFormGroup.get('razonSocial')!.setValue).toHaveBeenCalledWith('RS1');
    expect(component.mandatariosDelAgenteFormGroup.get('fiscales')!.setValue).toHaveBeenCalledWith('F1');
  });
});
