import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, TosterMessageType, TosterPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerIntercepterService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private sipinner:NgxSpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:

          const url = this.router.url;
          if (url == "/products") {
            this.toastrService.message("Seppete ürün eklemek için oturum açmanız gerekiyor","Oturum açınız!",{
              messageType:TosterMessageType.Warning,
              position:TosterPosition.TopRight
            })
          } 
          else 
            this.toastrService.message("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!", {
              messageType: TosterMessageType.Warning,
              position: TosterPosition.BottomFullWidth
            });
          
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken")).then(data => {

          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya erişilmiyor!", "Sunucu hatası!", {
            messageType: TosterMessageType.Warning,
            position: TosterPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Geçersiz istek yapıldı!", "Geçersiz istek!", {
            messageType: TosterMessageType.Warning,
            position: TosterPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa bulunamadı!", "Sayfa bulunamadı!", {
            messageType: TosterMessageType.Warning,
            position: TosterPosition.BottomFullWidth
          });
          break;
        default:
          this.toastrService.message("Beklenmeyen bir hata meydana gelmiştir!", "Hata!", {
            messageType: TosterMessageType.Warning,
            position: TosterPosition.BottomFullWidth
          });
          break;
      }
      this.sipinner.hide(SpinnerType.BallAtom)
      return of(error);
    }));
  }
}
