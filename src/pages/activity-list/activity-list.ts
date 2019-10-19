import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DidYouBravePage } from '../did-you-brave/did-you-brave';
import { SetTimerPage } from '../set-timer/set-timer';
import { AddActivityPage } from '../add-activity/add-activity';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the ActivityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-activity-list',
    templateUrl: 'activity-list.html',
})
export class ActivityListPage {

    reasonID:any;
    categoryID:any;
    selectedActivity:any;

    allActivity:any[];
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite,
        public zone: NgZone,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController) {
            this.reasonID = navParams.get('reasonID');
            this.categoryID = navParams.get('categoryID');
    }

    gotoSetTimer(activityID) {
        console.log(this.categoryID, this.reasonID, activityID);
        this.navCtrl.push(SetTimerPage,
            {
                categoryID : this.categoryID,
                reasonID : this.reasonID,
                activityID : activityID
            }
        );
    }

    // gotoSetTimer() {
    //     this.navCtrl.push(SetTimerPage);
    // }

    // gotoAddActivity() {
    //     this.navCtrl.push(AddActivityPage);
    // }

    ionViewDidLoad(){
        this.getPageInfo();
    }

    getPageInfo() {
        this.allActivity = [];
        this.selectedActivity = '';
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql('SELECT * from activity ORDER BY id', [])
                .then((data) => {
                    console.log(data.rows.length, data)
                    for (let i = 0; i < data.rows.length; i++) {
                        this.zone.run(() => {
                            this.allActivity.push({ id: data.rows.item(i).id, activity_name: data.rows.item(i).activity_name, is_created_by_own:  data.rows.item(i).is_created_by_own })
                        })
                    }
                })
                .catch(e => console.log('Select Error' + JSON.stringify(e)));
        })
        .catch(e => console.log(e));
        console.log(this.allActivity);
    }

    addOwn() {
        const prompt = this.alertCtrl.create({
            title: 'Add your own activity',
            // message: "Enter activity",
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'activity',
                    placeholder: 'Enter activity'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: res => {
                        console.log('Saved clicked');
                        if(res.activity === undefined || res.activity === ''){
                            const toast = this.toastCtrl.create({
                                message: 'Please enter activity',
                                duration: 3000
                            });
                            toast.present();
                            this.addOwn();
                        }
                        else{
                            this.sqlite.create({
                                name: 'brave_db.db',
                                location: 'default'
                            })
                            .then((db: SQLiteObject) => {
                                db.executeSql('INSERT INTO activity( activity_name, is_created_by_own ) VALUES(?, ?)', [res.activity, 'yes']).then(() => {
                                    const toast = this.toastCtrl.create({
                                        message: 'Activity successfully added',
                                        duration: 3000
                                    });
                                    toast.present();
                                    this.getPageInfo();
                                 }) .catch(e =>  {
                                    console.log('Insert Error' + JSON.stringify(e))
                                    if(e.code === 6){
                                        const toast = this.toastCtrl.create({
                                            message: 'Activity already exists',
                                            duration: 3000
                                        });
                                        toast.present();
                                        this.addOwn();
                                    }
                                });
                            })
                            .catch(e => console.log(e));
                        }
                    }
                }
            ]
        });
        prompt.present();
    }


    deleteActivity(activity){
        const confirm = this.alertCtrl.create({
            title: 'Brave the crave',
            message: 'Do you want to delete the reason?',
            enableBackdropDismiss : false,
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.sqlite.create({
                            name: 'brave_db.db',
                            location: 'default'
                        })
                        .then((db: SQLiteObject) => {
                            db.executeSql('DELETE from activity WHERE id=?', [activity.id])
                                .then((data) => {
                                    this.getPageInfo();
                                    const toast = this.toastCtrl.create({
                                        message: 'Activity deleted successfully',
                                        duration: 3000
                                    });
                                    toast.present();
                                })
                                .catch(e => console.log('Select Error' + JSON.stringify(e)));
                        })
                        .catch(e => console.log(e));
                    }
                }
            ]
        });
        confirm.present();
    }


    updateActivity(activity) {
        const prompt = this.alertCtrl.create({
            title: 'Add your own',
            message: "Enter activity",
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'activity',
                    placeholder: 'Enter activity',
                    value: activity.activity_name
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: res => {
                        console.log('Saved clicked');
                        if(res.activity === undefined || res.activity === ''){
                            const toast = this.toastCtrl.create({
                                message: 'Please enter activity',
                                duration: 3000
                            });
                            toast.present();
                            this.updateActivity(activity);
                        }
                        else{
                            this.sqlite.create({
                                name: 'brave_db.db',
                                location: 'default'
                            })
                            .then((db: SQLiteObject) => {
                                db.executeSql('UPDATE activity SET activity_name=? WHERE id=?', [res.activity, activity.id]).then((data) => {
                                    const toast = this.toastCtrl.create({
                                        message: 'Activity updated successfully',
                                        duration: 3000
                                    });
                                    this.getPageInfo();
                                }).catch(e => console.log('Insert Error' + JSON.stringify(e)));
                            })
                            .catch(e => console.log(e));
                        }
                    }
                }
            ]
        });
        prompt.present();
    }
}
