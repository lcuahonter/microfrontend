import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifestacionesDeCancelacionComponent } from './manifestaciones-de-cancelacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManifestacionesDeCancelacionComponent', () => {
  let component: ManifestacionesDeCancelacionComponent;
  let fixture: ComponentFixture<ManifestacionesDeCancelacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestacionesDeCancelacionComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifestacionesDeCancelacionComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
