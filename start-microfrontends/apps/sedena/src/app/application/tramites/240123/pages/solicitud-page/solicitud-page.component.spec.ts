import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '../../constants/exportacion-sustancias-quimicas.enum';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { TipoNotificacionEnum, CategoriaMensaje, Notificacion } from '@libs/shared/data-access-user/src';
import { AvisoDeExportacionModule } from '../../aviso-de-exportacion.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AvisoDeExportacionModule, ToastrModule.forRoot()], 
      declarations: [SolicitudPageComponent], 
      providers: [
        { provide: ToastrService, useClass: ToastrService }, // Mock ToastrService if needed
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el mensaje de título por defecto establecido en TITULOMENSAJE', () => {
    expect(component.tituloMensaje).toBe('Solicitud Aviso de exportación de sustancias químicas');
  });

  it('debe inicializar correctamente el arreglo de pasos', () => {
    expect(component.pasos).toEqual(PASOS);
  });

  it('debe actualizar el índice y el mensaje de título cuando se llame a getValorIndice con la acción "cont"', () => {
    const accionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(2);
    expect(component.tituloMensaje).toBe('Anexar requisitos');
  });

  it('debe actualizar el índice y el mensaje de título cuando se llame a getValorIndice con la acción "atras"', () => {
    const accionBoton = { valor: 3, accion: 'atras' };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(3);
    expect(component.tituloMensaje).toBe('Firmar');
  });

  it('debe llamar a wizardComponent.siguiente() cuando se active la acción "cont"', () => {
    const accionBoton = { valor: 2, accion: 'cont' };
    const spy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice(accionBoton);
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar a wizardComponent.atras() cuando se active la acción "atras"', () => {
    const accionBoton = { valor: 2, accion: 'atras' };
    const spy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice(accionBoton);
    expect(spy).toHaveBeenCalled();
  });
});
