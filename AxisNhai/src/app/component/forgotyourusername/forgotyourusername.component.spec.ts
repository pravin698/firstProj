import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotyourusernameComponent } from './forgotyourusername.component';

describe('ForgotyourusernameComponent', () => {
  let component: ForgotyourusernameComponent;
  let fixture: ComponentFixture<ForgotyourusernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotyourusernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotyourusernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
