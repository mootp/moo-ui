import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { DropdownComponent, MooDropdownItem } from './dropdown.component';

describe('DropdownComponent', () => {
  let fixture: ComponentFixture<DropdownComponent>;
  let component: DropdownComponent;

  const items: ReadonlyArray<MooDropdownItem> = [
    { label: 'Edit', description: 'Update the record.' },
    { label: 'Archive', description: 'Hide it from active lists.' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  it('opens from keyboard interaction and selects the active item', fakeAsync(() => {
    const emitSpy = spyOn(component.itemSelected, 'emit');
    const trigger = fixture.nativeElement.querySelector('.moo-dropdown__trigger') as HTMLButtonElement | null;

    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.moo-dropdown__menu') as HTMLElement | null;
    expect(menu).not.toBeNull();

    menu?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(items[0]);
  }));

  it('closes when clicking outside the overlay', fakeAsync(() => {
    const trigger = fixture.nativeElement.querySelector('.moo-dropdown__trigger') as HTMLButtonElement | null;

    trigger?.click();
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.moo-dropdown__menu')).not.toBeNull();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.moo-dropdown__menu')).toBeNull();
  }));
});
