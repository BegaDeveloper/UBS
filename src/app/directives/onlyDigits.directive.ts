import { Directive, ElementRef, HostListener, OnChanges } from '@angular/core';

@Directive({
    selector: '[digitOnly]',
})
export class DigitOnlyDirective implements OnChanges {
    private navigationKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'Clear',
        'Copy',
        'Paste',
    ];

    inputElement: HTMLInputElement;

    constructor(public el: ElementRef) {
        this.inputElement = el.nativeElement;
    }

    ngOnChanges(): void {}

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (
            this.navigationKeys.indexOf(e.key) > -1 ||
            (e.key === 'a' && e.ctrlKey === true) ||
            (e.key === 'c' && e.ctrlKey === true) ||
            (e.key === 'v' && e.ctrlKey === true) ||
            (e.key === 'x' && e.ctrlKey === true) ||
            (e.key === 'a' && e.metaKey === true) ||
            (e.key === 'c' && e.metaKey === true) ||
            (e.key === 'v' && e.metaKey === true) ||
            (e.key === 'x' && e.metaKey === true) ||
            e.key == '-' ||
            e.key === '.'
        ) {
            return;
        }

        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }
}
