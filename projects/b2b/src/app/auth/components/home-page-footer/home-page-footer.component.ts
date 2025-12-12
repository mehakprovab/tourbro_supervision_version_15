import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth.service';

const log = new Logger('auth/HomePageFooterComponent');
@Component({
    selector: 'app-home-page-footer',
    templateUrl: './home-page-footer.component.html',
    styleUrls: ['./home-page-footer.component.scss']
})

export class HomePageFooterComponent implements OnInit, OnDestroy {

    protected subSunk = new SubSink();
    domainInfo: any;
    staticContentData: any;
    aboutUsData: any;
    errorMessage: any;

    @Output()
    changeContent: EventEmitter<any> = new EventEmitter<any>();
    currentYear: number;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.currentYear = new Date().getFullYear();
        this.loadStaticContent();
    }

    loadStaticContent() {
        let title = { page_title: "" }
        this.subSunk.sink = this.authService.getStaticContent(title)
            .subscribe(res => {
                if (res.statusCode == 200) {
                    this.staticContentData = res.data;
                    this.aboutUsData = res.data.find(el => (el.page_title).toLocaleLowerCase() == 'About Us'.toLocaleLowerCase());
                }
            }, (err) => {
                this.errorMessage = err.error.Message;
            });
    }

    onStaticContent(content) {
        if (this.router.url == "/auth/cms") {
            this.authService.getStaticContent(content.page_title).subscribe(res => {
                if (res.statusCode == 200) {
                    sessionStorage.setItem('static_title', content.page_title);
                    let contentDesc = res.data.filter((ele) => ele.page_title === content.page_title);
                    this.changeContent.emit(contentDesc);
                    const url = this.router.serializeUrl(
                        this.router.createUrlTree(['auth/cms'])
                    );
                   window.open('#'+url, '_blank');
                }
            }, (err) => {
                console.log(err);
            });
        } else {
            sessionStorage.setItem('static_title', content.page_title);
            const url = this.router.serializeUrl(
                this.router.createUrlTree(['auth/cms'])
            );
           window.open('#'+url, '_blank');
        }
    }

    onAgentSelect() {
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/faq'])
      );
        window.open('#'+url, '_blank');
      }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
