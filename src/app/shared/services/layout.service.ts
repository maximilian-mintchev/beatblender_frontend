import { NavigationService } from './navigation.service';
import { Injectable, Renderer2 } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { getQueryParam } from '../helpers/url.helper';
import { ThemeService } from './theme.service';

export interface ILayoutConf {
  navigationPos?: string; // side, top
  sidebarStyle?: string; // full, compact, closed
  sidebarCompactToggle?: boolean; // sidebar expandable on hover
  sidebarColor?: string; // Sidebar background color http://demos.ui-lib.com/egret-doc/#egret-colors
  dir?: string; // ltr, rtl
  isMobile?: boolean; // updated automatically
  useBreadcrumb?: boolean; // Breadcrumb enabled/disabled
  breadcrumb?: string; // simple, title
  topbarFixed?: boolean; // Fixed header
  footerFixed?: boolean; // Fixed Footer
  topbarColor?: string; // Header background color http://demos.ui-lib.com/egret-doc/#egret-colors
  footerColor?: string; // Header background color http://demos.ui-lib.com/egret-doc/#egret-colors
  matTheme?: string; // material theme. egret-blue, egret-navy, egret-dark-purple, egret-dark-pink
  perfectScrollbar?: boolean;
}
export interface ILayoutChangeOptions {
  duration?: number;
  transitionClass?: boolean;
}
interface IAdjustScreenOptions {
  browserEvent?: any;
  route?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public layoutConf: ILayoutConf = {};
  layoutConfSubject = new BehaviorSubject<ILayoutConf>(this.layoutConf);
  layoutConf$ = this.layoutConfSubject.asObservable();
  public isMobile: boolean;
  public currentRoute: string;
  public fullWidthRoutes = ['shop'];

  constructor(private themeService: ThemeService, private router: Router, private navigationService: NavigationService) {

    this.router.events.subscribe((routerEvent: RouterEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        // setTimeout(() => {
          if(routerEvent.urlAfterRedirects.startsWith('/sample-market')) {
            this.navigationService.publishNavigationChange('sample-market-menu');
          } else if (routerEvent.urlAfterRedirects.startsWith('/profile')) {
            this.navigationService.publishNavigationChange('account-menu');
      
          } else if (routerEvent.urlAfterRedirects.startsWith('/listen')) {
            this.navigationService.publishNavigationChange('listen-menu');
          } 
        
        // },1000);
        // else {
        //   this.navigationService.publishNavigationChange(null);
        // }

        switch (routerEvent.urlAfterRedirects) {
          case '/sample-market':
            this.layoutConf.footerFixed = true;
            break;
          case '/docs/introduction':
            this.layoutConf.footerFixed = true;
            break;
          case '/listen/all-music':
            this.layoutConf.footerFixed = true;
            break;
          case '/listen/find':
            this.layoutConf.footerFixed = true;
            break;
          case '/listen/playlists':
            this.layoutConf.footerFixed = true;
            break;
          case '/profile/upload-audio':
            this.layoutConf.footerFixed = true;
            break;
          case '/profile/manage-audio':
            this.layoutConf.footerFixed = true;
            break;
          case '/profile/overview':
            this.layoutConf.footerFixed = true;
            break;
          case '/profile/my-licenses/extended-licenses':
            this.layoutConf.footerFixed = true;
            break;
          case '/profile/my-licenses/basic-licenses':
            this.layoutConf.footerFixed = true;
            break;
            // case '/profile/my-licenses/basic-licenses':
            //   this.layoutConf.footerFixed = true;
            //   break;
            // case '/sample-market/download':
            // this.layoutConf.footerFixed = true;
            // break;
          default:
            this.layoutConf.footerFixed = false;
        }
        if(routerEvent.urlAfterRedirects.startsWith('/audio/details')) {
          this.layoutConf.footerFixed = true;
        }
      }

    });

    this.setAppLayout(
      // ******** SET YOUR LAYOUT OPTIONS HERE *********
      {
        navigationPos: 'top', // side, top
        sidebarStyle: 'full', // full, compact, closed
        sidebarColor: 'slate', // http://demos.ui-lib.com/egret-doc/#egret-colors
        sidebarCompactToggle: false, // applied when "sidebarStyle" is "compact"
        dir: 'ltr', // ltr, rtl
        useBreadcrumb: true,
        topbarFixed: false,
        footerFixed: true,
        topbarColor: 'white', // http://demos.ui-lib.com/egret-doc/#egret-colors
        footerColor: 'slate', // http://demos.ui-lib.com/egret-doc/#egret-colors
        matTheme: 'egret-navy', // egret-blue, egret-navy, egret-light-purple, egret-dark-purple, egret-dark-pink
        breadcrumb: 'simple', // simple, title
        perfectScrollbar: false,
      }
    );
  }

  setAppLayout(layoutConf: ILayoutConf) {
    this.layoutConf = { ...this.layoutConf, ...layoutConf };
    console.log(this.layoutConf);
    this.applyMatTheme(this.layoutConf.matTheme);

    // ******* Only for demo purpose ***
    this.setLayoutFromQuery();
    // **********************
  }

  publishLayoutChange(lc: ILayoutConf, opt: ILayoutChangeOptions = {}) {
    if (this.layoutConf.matTheme !== lc.matTheme && lc.matTheme) {
      this.themeService.changeTheme(this.layoutConf.matTheme, lc.matTheme);
    }

    this.layoutConf = Object.assign(this.layoutConf, lc);
    this.layoutConfSubject.next(this.layoutConf);
  }

  applyMatTheme(theme) {
    this.themeService.applyMatTheme(this.layoutConf.matTheme);
  }

  setLayoutFromQuery() {
    const layoutConfString = getQueryParam('layout');
    const prevTheme = this.layoutConf.matTheme;
    try {
      this.layoutConf = JSON.parse(layoutConfString);
      this.themeService.changeTheme(prevTheme, this.layoutConf.matTheme);
    } catch (e) { }
  }

  adjustLayout(options: IAdjustScreenOptions = {}) {
    let sidebarStyle: string;
    this.isMobile = this.isSm();
    this.currentRoute = options.route || this.currentRoute;
    sidebarStyle = this.isMobile ? 'closed' : 'full';

    if (this.currentRoute) {
      this.fullWidthRoutes.forEach((route) => {
        if (this.currentRoute.indexOf(route) !== -1) {
          sidebarStyle = 'closed';
        }
      });
    }

    this.publishLayoutChange({
      isMobile: this.isMobile,
      sidebarStyle,
    });
  }
  isSm() {
    return window.matchMedia(`(max-width: 959px)`).matches;
  }

  toggleSidenav(): void {
    console.log('Toggle');
    console.log(this.layoutConf);
    if (this.layoutConf.sidebarStyle === 'full') {
      this.layoutConf.sidebarStyle = 'closed';
    } else if (this.layoutConf.sidebarStyle === 'closed') {
      this.layoutConf.sidebarStyle = 'full';
    } else {
      throw new Error("Sidenav has wrong state");
    }
    // this.publishLayoutChange(this.layoutConf);
    console.log('Toggle Sidenav');
  }


}
