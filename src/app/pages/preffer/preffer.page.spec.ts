import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrefferPage } from './preffer.page';

describe('PrefferPage', () => {
  let component: PrefferPage;
  let fixture: ComponentFixture<PrefferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
