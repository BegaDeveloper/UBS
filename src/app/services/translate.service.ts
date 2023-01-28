import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANG_SR_TRANS } from '../utils/sr-Latin';

@Injectable()
export class TranslateService {
    private _currentLang: string = 'sr-Latin';
    private _dictionary: any = {
        'sr-Latin': LANG_SR_TRANS,
    };

    constructor(private snackBar: MatSnackBar) {}

    private translate(key: string): string {
        if (this._dictionary[this._currentLang] && this._dictionary[this._currentLang][key]) {
            return this._dictionary[this._currentLang][key];
        } else {
            return key;
        }
    }

    public instant(key: string) {
        return this.translate(key);
    }

    public showMessage(message: string) {
        return this.snackBar.open(this.translate(message));
    }
}
