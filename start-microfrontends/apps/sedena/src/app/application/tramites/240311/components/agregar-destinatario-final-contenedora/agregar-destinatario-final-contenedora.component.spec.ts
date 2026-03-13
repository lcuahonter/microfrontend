import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosMercanciaContenedoraComponent', () => {
  let componente: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: ComponentFixture<AgregarDestinatarioFinalContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarDestinatarioFinalContenedoraComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(componente).toBeTruthy();
  });
});
