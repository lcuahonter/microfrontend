import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlesDeAccesoFisicaComponent } from './controles-de-acceso-fisica.component';

describe('ControlesDeAccesoFisicaComponent', () => {
  let component: ControlesDeAccesoFisicaComponent;
  let fixture: ComponentFixture<ControlesDeAccesoFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlesDeAccesoFisicaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlesDeAccesoFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
