import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewElementComponent } from './new-element.component';

describe('NewElementComponent', () => {
  let component: NewElementComponent;
  let fixture: ComponentFixture<NewElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewElementComponent]
    });
    fixture = TestBed.createComponent(NewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
