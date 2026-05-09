import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MooToastService } from './toast.service';

describe('MooToastService', () => {
  let service: MooToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MooToastService);
  });

  afterEach(() => {
    service.clear();
  });

  it('adds and auto-dismisses timed toasts', fakeAsync(() => {
    const id = service.show({
      variant: 'success',
      title: 'Saved',
      message: 'Toast message',
      duration: 1000,
    });

    expect(service.toasts().map(toast => toast.id)).toContain(id);

    tick(1000);

    expect(service.toasts()).toEqual([]);
  }));

  it('keeps persistent toasts until dismissed', () => {
    const id = service.show({
      variant: 'info',
      message: 'Persistent',
      duration: 0,
    });

    expect(service.toasts().length).toBe(1);

    service.dismiss(id);

    expect(service.toasts()).toEqual([]);
  });
});
