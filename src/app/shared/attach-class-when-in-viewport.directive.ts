import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[attachClassWhenInViewport]',
})
export class AttachClassWhenInViewportDirective {
  hasScrolledIntoView = false;

  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.elementRef) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        this.hasScrolledIntoView = true;
      }
    }
  }

  @HostBinding('class.scrolled-into-viewport') get scrolledIntoViewPort() {
    return this.hasScrolledIntoView;
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.isScrolledIntoView();
  }
}
