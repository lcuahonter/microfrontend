// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { FusionOescisionComponent } from './fusion-oescision.component';
import { FormBuilder } from '@angular/forms';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockAvisoModifyService {}

@Injectable()
class MockTramite32301Store {}

@Injectable()
class MockTramite32301Query {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('FusionOescisionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,FusionOescisionComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AvisoModifyService, useClass: MockAvisoModifyService },
        { provide: Tramite32301Store, useClass: MockTramite32301Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(FusionOescisionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(FusionOescisionComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #fechaControl', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn();
    const fechaControl = component.fechaControl;
    expect(component.formulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #personaFusionEscisionDTO', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn();
    const personaFusionEscisionDTO = component.personaFusionEscisionDTO;
    expect(component.formulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #mpersonaFusionEscisionDTO', async () => {
    component.modelFormulario = component.modelFormulario || {};
    component.modelFormulario.get = jest.fn();
    const mpersonaFusionEscisionDTO = component.mpersonaFusionEscisionDTO;
    expect(component.modelFormulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #personaFusionEscisionModal', async () => {
    component.modelFormulario = component.modelFormulario || {};
    component.modelFormulario.get = jest.fn();
    const personaFusionEscisionModal = component.personaFusionEscisionModal;
    expect(component.modelFormulario.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.selectState$ = observableOf({
      fusionEscisionHeader: {},
      formulario: {}
    });
    component.mostrarFusionOEscision = jest.fn();
    component.formulario = component.formulario || {};
    component.formulario.patchValue = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.mostrarFusionOEscision).toHaveBeenCalled();
    expect(component.formulario.patchValue).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #cambioFechaInicio()', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      setValue: function() {}
    });
    component.cambioFechaInicio({});
    expect(component.formulario.get).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.formulario = component.formulario || {};
    component.formulario.disable = jest.fn();
    component.formulario.get = jest.fn().mockReturnValue({
      disable: function() {}
    });
    component.formulario.enable = jest.fn();
    component.modelFormulario = component.modelFormulario || {};
    component.modelFormulario.disable = jest.fn();
    component.modelFormulario.enable = jest.fn();
    component.mpersonaFusionEscisionDTO.disable = jest.fn();
    component.mpersonaFusionEscisionDTO.enable = jest.fn();
    component.personaFusionEscisionDTO.enable = jest.fn();
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.formulario.get).toHaveBeenCalled();
    expect(component.formulario.enable).toHaveBeenCalled();
    expect(component.modelFormulario.enable).toHaveBeenCalled();
    expect(component.mpersonaFusionEscisionDTO.enable).toHaveBeenCalled();
    expect(component.personaFusionEscisionDTO.enable).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.initializeForm = jest.fn();
    component.getGridsubFusionOescision = jest.fn();
    await component.inicializarFormulario();
    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.getGridsubFusionOescision).toHaveBeenCalled();
  });

  it('should run #initializeForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initializeForm();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ocultarEscicion()', async () => {

    component.ocultarEscicion({});

  });

  it('should run #mostrarFusionOEscision()', async () => {
    component.fechaInicioInput = component.fechaInicioInput || {};
    component.fechaInicioInput.labelNombre = 'labelNombre';
    component.mostrarFusionOEscision({});

  });

  it('should run #mostrarCertificacionFusionada()', async () => {

    component.mostrarCertificacionFusionada({}, {});

  });

  it('should run #seleccionDeFilas()', async () => {

    component.seleccionDeFilas({});

  });

  it('should run #modificarSeleccionada()', async () => {
    component.ModificarFusionEscisionInstance = component.ModificarFusionEscisionInstance || {};
    component.ModificarFusionEscisionInstance.show = jest.fn();
    component.personaFusionEscisionModal.patchValue = jest.fn();
    component.fusionEscisionHeader = component.fusionEscisionHeader || {};
    component.modificarSeleccionada({});
    expect(component.personaFusionEscisionModal.patchValue).toHaveBeenCalled();
  });

  it('should run #eliminarSeleccionada()', async () => {
    component.fusionEscisionHeader = component.fusionEscisionHeader || {};
    component.fusionEscisionHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.fusionEscisionHeader = ['fusionEscisionHeader'];
    component.store = component.store || {};
    component.store.setFusionEscisionHeader = jest.fn();
    component.eliminarSeleccionada({});
  });

  it('should run #cargarDatosPersonaFusion()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.cargarDatosPersonaFusion = jest.fn().mockReturnValue(observableOf({}));
    component.personaFusionEscisionDTO.patchValue = jest.fn();
    component.formatFechaToInputDate = jest.fn();
    component.store = component.store || {};
    component.store.SetpersonaFusionEscisionDTO = jest.fn();
    component.cargarDatosPersonaFusion();
    expect(component.AvisoModifyService.cargarDatosPersonaFusion).toHaveBeenCalled();
    expect(component.personaFusionEscisionDTO.patchValue).toHaveBeenCalled();
    expect(component.store.SetpersonaFusionEscisionDTO).toHaveBeenCalled();
  });

  it('should run #ModelcargarDatosPersonaFusion()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.cargarDatosPersonaFusion = jest.fn().mockReturnValue(observableOf({}));
    component.personaFusionEscisionModal.patchValue = jest.fn();
    component.formatFechaToInputDate = jest.fn();
    component.ModelcargarDatosPersonaFusion();
    expect(component.AvisoModifyService.cargarDatosPersonaFusion).toHaveBeenCalled();
    expect(component.personaFusionEscisionModal.patchValue).toHaveBeenCalled();
  });

  it('should run #getGridsubFusionOescision()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.gridsubFusionOescision = jest.fn().mockReturnValue(observableOf({
      tableHeader: {}
    }));
    component.getGridsubFusionOescision();
    expect(component.AvisoModifyService.gridsubFusionOescision).toHaveBeenCalled();
  });

  it('should run #onItemsPerPageChange()', async () => {
    component.updatePagination = jest.fn();
    component.onItemsPerPageChange({});
    expect(component.updatePagination).toHaveBeenCalled();
  });

  it('should run #onPageChange()', async () => {
    component.updatePagination = jest.fn();
    component.onPageChange({});
    expect(component.updatePagination).toHaveBeenCalled();
  });

  it('should run #updatePagination()', async () => {
    component.miembroDeLaEmpresaBodyData = component.miembroDeLaEmpresaBodyData || {};
    component.miembroDeLaEmpresaBodyData = ['miembroDeLaEmpresaBodyData'];
    component.updatePagination();

  });

  it('should run #abrirModalFusionEscision()', async () => {
    component.ModificarFusionEscisionInstance = component.ModificarFusionEscisionInstance || {};
    component.ModificarFusionEscisionInstance.show = jest.fn();
    component.abrirModalFusionEscision();
    expect(component.ModificarFusionEscisionInstance.show).toHaveBeenCalled();
  });

  it('should run #nuevaFusionEscisionModal()', async () => {
    component.seleccionadasFila = component.seleccionadasFila || {};
    component.seleccionadasFila.id = 'id';
    component.fusionEscisionHeader = component.fusionEscisionHeader || {};
    component.fusionEscisionHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.fusionEscisionHeader = ['fusionEscisionHeader'];
    component.store = component.store || {};
    component.store.setFusionEscisionHeader = jest.fn();
    component.ModificarFusionEscisionInstance = component.ModificarFusionEscisionInstance || {};
    component.ModificarFusionEscisionInstance.hide = jest.fn();
    component.personaFusionEscisionModal.reset = jest.fn();
    component.nuevaFusionEscisionModal({
      getRawValue: function() {
        return {
          fechaFinVigenciaUltimaCertificacion: {},
          fechaInicioVigenciaUltimaCertificacion: {},
          folioVucemUltimaCertificacion: {},
          denominacionORazonSocial: {},
          registroFederalDeContribuyentes: {},
          id: {}
        };
      }
    });
    expect(component.store.setFusionEscisionHeader).toHaveBeenCalled();
    expect(component.ModificarFusionEscisionInstance.hide).toHaveBeenCalled();
    expect(component.personaFusionEscisionModal.reset).toHaveBeenCalled();
  });

  it('should run #closeFusionEscisionModal()', async () => {
    component.ModificarFusionEscisionInstance = component.ModificarFusionEscisionInstance || {};
    component.ModificarFusionEscisionInstance.hide = jest.fn();
    component.closeFusionEscisionModal();
    expect(component.ModificarFusionEscisionInstance.hide).toHaveBeenCalled();
  });

  it('should run #openCorrectamenteModel()', async () => {

    component.openCorrectamenteModel();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

});