export interface PasswordConfigModel {
    minLength: number;
    regex: string;
    activationLinkExpirationInMinutes: number;
    resetLinkExpirationInMinutes: number;
}
