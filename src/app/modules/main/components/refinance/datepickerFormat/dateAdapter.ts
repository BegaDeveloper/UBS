import { Injectable } from '@angular/core';
import { NativeDateAdapter, DateAdapter } from '@angular/material/core';

@Injectable({
    providedIn: 'root',
})
export class MyDateAdapter extends NativeDateAdapter {
    override parse(value: string): any {
        let it = value.split('.');
        if (it.length == 3) return new Date(+it[2], +it[1] - 1, +it[0], 12);
    }

    override format(date: Date, displayFormat: Object) {
        if (date.getFullYear() < 1000) {
            date.setFullYear(date.getFullYear() + 2000);
        } else if (date.getFullYear() < 1970) {
            date.setFullYear(date.getFullYear() + 100);
        }

        return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    }
}
