import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserchangeworlflowComponent } from './userchangeworlflow.component';

describe('UserchangeworlflowComponent', () => {
  let component: UserchangeworlflowComponent;
  let fixture: ComponentFixture<UserchangeworlflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserchangeworlflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserchangeworlflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
