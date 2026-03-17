import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroSolicitudComponent } from './registro-solicitud.component';

describe('RegistroSolicitudComponent', () => {
  let component: RegistroSolicitudComponent;
  let fixture: ComponentFixture<RegistroSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSolicitudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
