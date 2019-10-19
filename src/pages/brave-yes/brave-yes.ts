import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../home/home';

/**
 * Generated class for the BraveYesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-brave-yes',
    templateUrl: 'brave-yes.html',
})
export class BraveYesPage {

    message:any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite) {
    }

    ionViewWillEnter(){
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql('SELECT * from random_message WHERE type=? ORDER BY RANDOM() LIMIT 1', ['motivate'])
                .then((data) => {
                    this.message = data.rows.item(0).message;
                })
                .catch(e => console.log('Select Error' + JSON.stringify(e)));
        })
        .catch(e => console.log(e));
    }

    goHome(){
        this.navCtrl.setRoot(HomePage);
    }
}
