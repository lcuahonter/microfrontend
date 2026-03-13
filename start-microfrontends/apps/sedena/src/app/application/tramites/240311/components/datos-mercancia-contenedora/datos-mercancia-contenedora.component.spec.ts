import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';

describe('ComponenteDatosMercanciaContenedora', () => {
  let componente: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMercanciaContenedoraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(componente).toBeTruthy();
  });
});
