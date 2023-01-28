import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';

@Injectable()
export class NextActionDateStatusService {
    constructor() {}

    public checkDateStatus(date: Date | string): string {
        if (date) {
            const nextActiondDate = dayjs(date);
            const currentDate = dayjs();
            const threeHours = 10800; // in seconds
            const dateDiff = currentDate.diff(nextActiondDate, 'second');

            if (dateDiff > 0) {
                return 'critical';
            } else if (dateDiff < -threeHours) {
                return 'info';
            } else if (dateDiff >= -threeHours && dateDiff <= 0) {
                return 'warning';
            }
        }

        return '';
    }

    public transformDate(date: Date): string {
        const dateStatus = this.checkDateStatus(date);

        if (dateStatus === 'critical') {
            return `<span class="material-icons critical">report</span>`;
        } else if (dateStatus === 'info') {
            return `<span class="material-icons info">info</span>`;
        } else if (dateStatus === 'warning') {
            return `<span class="material-icons warning">warning</span>`;
        }
        return '';
    }
}