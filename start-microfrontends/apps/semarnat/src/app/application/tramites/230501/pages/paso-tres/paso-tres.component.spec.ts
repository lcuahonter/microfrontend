import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService, TOAST_CONFIG, provideToastr } from 'ngx-toastr';
import { TramiteFolioService } from '@libs/shared/data-access-user/src';
import { InjectionToken } from '@angular/core';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },provideToastr({
          positionClass: 'toast-top-right',
        })
      ],

      
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    TestBed.inject(ToastrService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
