import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterVerifyUserNameComponent } from './after-verify-user-name.component';

describe('AfterVerifyUserNameComponent', () => {
  let component: AfterVerifyUserNameComponent;
  let fixture: ComponentFixture<AfterVerifyUserNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterVerifyUserNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterVerifyUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
