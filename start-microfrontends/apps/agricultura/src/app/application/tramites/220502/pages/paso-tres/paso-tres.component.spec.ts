import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        ToastrService,
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to acuse page when firma is provided', () => {
      component.obtieneFirma('firmaValida');
      expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not navigate when firma is empty', () => {
      component.obtieneFirma('');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when firma is null', () => {
      component.obtieneFirma(null as any);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});