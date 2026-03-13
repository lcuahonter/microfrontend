import { NotificacionesComponent, TipoNotificacionEnum, CategoriaMensaje, Notificacion } from './notificaciones.component';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

describe('NotificacionesComponent', () => {
  let component: NotificacionesComponent;
  let toastrServiceMock: jest.Mocked<ToastrService>;
  let sanitizerMock: jest.Mocked<DomSanitizer>;
  let bsModalServiceMock: jest.Mocked<BsModalService>;

  beforeEach(() => {
    toastrServiceMock = {
      warning: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    sanitizerMock = {
      bypassSecurityTrustHtml: jest.fn((html) => html),
    } as unknown as jest.Mocked<DomSanitizer>;

    bsModalServiceMock = {
      show: jest.fn(),
    } as unknown as jest.Mocked<BsModalService>;
    

    component = new NotificacionesComponent(toastrServiceMock, sanitizerMock, bsModalServiceMock);
    component.confirmacionModal = new EventEmitter<boolean>();
  });

  it('should initialize with default values', () => {
    expect(component.mostrarModal).toBe(false);
    expect(component.verBanner).toBe(false);
  });

});