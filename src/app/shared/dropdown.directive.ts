import {Directive, HostBinding, HostListener} from "@angular/core";

@Directive({selector: '[appDropdown]'})
export class DropdownDirective {
  @HostBinding('class.open') clicked = false;

  @HostListener('click') toggleOpen() {
    this.clicked = !this.clicked;
  }

  // constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  // @HostListener('click') mouseClick() {
  //   if (this.clicked) {
  //     this.renderer.removeClass(this.elRef.nativeElement, 'open');
  //   } else {
  //     this.renderer.addClass(this.elRef.nativeElement, 'open');
  //   }
  //   this.clicked = !this.clicked;
  // }
}
