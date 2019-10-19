import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';

import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the ResourcesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-resources',
    templateUrl: 'resources.html',
})
export class ResourcesPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private appAvailability: AppAvailability,
        private platform: Platform,
        private iab: InAppBrowser) {
    }

    gotoHome() {
        this.navCtrl.setRoot(HomePage);
    }

    openInstagram() {
        let app;
        if (this.platform.is('ios')) {
            app = 'instagram://';
        } 
        else if (this.platform.is('android')) {
            app = 'com.instagram.android';
        }

        this.appAvailability.check(app).then((yes: boolean) => {
            console.log(app + ' is available')
            const browser = this.iab.create('instagram://user?username=smokefreeus', '_system');
            // const browser = this.iab.create('instagram:/smokefreeus/?hl=en', '_system');
        },
        (no: boolean) => {
            console.log(app + ' is NOT available')
            const browser = this.iab.create('https://www.instagram.com/smokefreeus/?hl=en', '_system');
        });
    }
}
