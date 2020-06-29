import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterotpforgotpasswordComponent } from './enterotpforgotpassword.component';

describe('EnterotpforgotpasswordComponent', () => {
  let component: EnterotpforgotpasswordComponent;
  let fixture: ComponentFixture<EnterotpforgotpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterotpforgotpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterotpforgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
