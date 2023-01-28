import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, retry } from 'rxjs';
import { ActivateUserRequest, IUserDTO, NewUser } from '../models/user.model';
import { IPage } from '../models/common.model';
import { ForgotPasswordRequest } from '../models/forgot-password-reset.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _userInfo$ = new BehaviorSubject<IUserDTO>(null!);
    public userInfo$ = this._userInfo$.asObservable();

    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    getUserByKey(key: number, url: string) {
        return this.http.get<IUserDTO>(url + key).pipe(
            map(res => {
                return res;
            }),
        );
    }

    deleteUser(id: number) {
        return this.http.delete('');
    }

    activateUser(data: ActivateUserRequest) {
        return this.http.post<IUserDTO>('users/activate', data).pipe(
            map((res: IUserDTO) => {
                return res;
            }),
        );
    }

    //Get User details after login
    getUserDetails() {
        return this.http.get<IUserDTO>('users/authenticated-user').pipe(
            map(res => {
                return res;
            }),
        );
    }

    // Set user info in navbar on login
    setUserInfo(user: IUserDTO) {
        this._userInfo$.next(user);
    }

    getUserInfo() {
        return this._userInfo$.getValue();
    }

    // Delete user info in navbar on logout
    deleteUserInfo() {
        this._userInfo$.next(null!);
    }

    //Pagination for User Page
    getSearchUser(search: string, pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string) {
        let paramsObject: { [k: string]: any } = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search || '',
        };
        if (sortBy && sortDirection) {
            paramsObject['sortBy'] = sortBy;
            paramsObject['sortDirection'] = sortDirection;
        }
        let params = new HttpParams({ fromObject: paramsObject });
        return this.http.get<IPage<IUserDTO>>('users/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    resetPassword(body: ForgotPasswordRequest) {
        return this.http.post<ForgotPasswordRequest>('users/reset-password', body);
    }

    getForgotPasswordLink(login: string) {
        return this.http.post<any>('users/send-forgot-password-link', login);
    }

    //Post new user
    postNewUser(data: any) {
        return this.http.post('users', data).pipe(
            map(response => {
                return response;
            }),
        );
    }

    //Get user by id
    getUserId(id: number) {
        return this.http.get('users/' + id).pipe(
            retry(1),
            catchError(this.errorHandler.handleError),
            map(response => {
                return response;
            }),
        );
    }

    //Update user
    updateUser(data: any, id: number) {
        return this.http.put<NewUser>('users/' + id, data).pipe(
            map(response => {
                return response;
            }),
        );
    }

    //Activation link
    sendActivationLink(id: number, data: any) {
        return this.http.post('users/send-activation-link/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Change password
    changePassword(data: any) {
        return this.http.post('users/change-password', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Unlock user
    unlockUser(id: number, data: any) {
        return this.http.post('users/unlock/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }
}
