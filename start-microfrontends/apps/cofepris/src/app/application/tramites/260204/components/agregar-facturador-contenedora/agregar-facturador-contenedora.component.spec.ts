import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarFacturadorContenedoraComponent } from './agregar-facturador-contenedora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarFacturadorContenedoraComponent', () => {
  let component: AgregarFacturadorContenedoraComponent;
  let fixture: ComponentFixture<AgregarFacturadorContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarFacturadorContenedoraComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFacturadorContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
