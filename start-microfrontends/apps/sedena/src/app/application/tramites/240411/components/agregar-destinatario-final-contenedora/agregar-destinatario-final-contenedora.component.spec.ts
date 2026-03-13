import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: ComponentFixture<AgregarDestinatarioFinalContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AgregarDestinatarioFinalContenedoraComponent, 
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
