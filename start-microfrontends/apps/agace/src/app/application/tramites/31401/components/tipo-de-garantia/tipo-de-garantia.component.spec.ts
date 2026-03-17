import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDeGarantiaComponent } from './tipo-de-garantia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TipoDeGarantiaComponent', () => {
  let component: TipoDeGarantiaComponent;
  let fixture: ComponentFixture<TipoDeGarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoDeGarantiaComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDeGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
