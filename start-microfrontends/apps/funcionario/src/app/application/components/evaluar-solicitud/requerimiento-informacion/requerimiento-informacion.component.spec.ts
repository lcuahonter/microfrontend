import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequerimientoInformacionComponent } from './requerimiento-informacion.component';

describe('RequerimientoInformacionComponent', () => {
  let component: RequerimientoInformacionComponent;
  let fixture: ComponentFixture<RequerimientoInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequerimientoInformacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequerimientoInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
