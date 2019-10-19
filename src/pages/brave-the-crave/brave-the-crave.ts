import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ActivityListPage } from '../activity-list/activity-list';
import { AddReasonPage } from '../add-reason/add-reason';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the BraveTheCravePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-brave-the-crave',
    templateUrl: 'brave-the-crave.html',
})
export class BraveTheCravePage {

    shownGroup:any = null;
    reason: any[] = [
        {
            cat : 'Emotional',
            list : [
                {
                    cat: 'Emotional',
                    name: 'Stressed'
                },
                {
                    cat: 'Emotional',
                    name: 'Anxious'
                },
                {
                    cat: 'Emotional',
                    name: 'Excited'
                },
                {
                    cat: 'Emotional',
                    name: 'Bored'
                },
                {
                    cat: 'Emotional',
                    name: 'Sad'
                },
                {
                    cat: 'Emotional',
                    name: 'Happy'
                },
                {
                    cat: 'Emotional',
                    name: 'Lonely'
                }, 
            ]
            
        },
        {
            cat : 'Social',
            list : [
                {
                    cat: 'Social',
                    name: 'Saw someone else vaping'
                },
                {
                    cat: 'Social',
                    name: 'Smelling another vape pen'
                },
                {
                    cat: 'Social',
                    name: 'Hanging out with friends who vape'
                },
                {
                    cat: 'Social',
                    name: 'At party or other social event'
                },
                {
                    cat: 'Social',
                    name: 'Studying with friends'
                },
                {
                    cat: 'Social',
                    name: 'Offered vape or a new flavor'
                },
                {
                    cat: 'Social',
                    name: 'Seeing vaping on social media'
                },
            ]
            
        },
        {
            cat : 'Withdrawal',
            list : [
                {
                    cat: 'Withdrawal',
                    name: 'Have the crave to vape'
                },
                {
                    cat: 'Withdrawal',
                    name: 'Smelling a vape pen'
                },
                {
                    cat: 'Withdrawal',
                    name: 'Handling a vape pen'
                },
                {
                    cat: 'Withdrawal',
                    name: 'Needing to do something with your hands or mouth'
                },
                {
                    cat: 'Withdrawal',
                    name: 'Feeling restless or having other withdrawal symptoms'
                }
            ]
            
        }
    ]
    reasonCategory: any[] = ['Emotional', 'Social', 'Withdrawal'];

    imagePath: any = [ 'assets/imgs/stressed.png', 'assets/imgs/anxiouus.png', 'assets/imgs/excited.png', 'assets/imgs/bored.png', 'assets/imgs/sad.png', 'assets/imgs/happy.png', 'assets/imgs/lonely.png'];
    allReason: any[];
    selectedReason: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private sqlite: SQLite,
        public zone: NgZone,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        this.getPageInfo();
        this.selectedReason = '';
    }
    gotoActivity(categoryID) {
        this.navCtrl.push(ActivityListPage, 
            {
                categoryID : categoryID,
                reasonID : this.selectedReason
            }
        );
        console.log(categoryID, this.selectedReason);
    }

    activityGateway(categoryID, reasonID) {
        this.navCtrl.push(ActivityListPage, 
            {
                categoryID : categoryID,
                reasonID : reasonID
            }
        );
        // console.log(categoryID, this.selectedReason);
    }

    // gotoActivity() {
    //     this.navCtrl.push(ActivityListPage);
    // }
    gotoAddReason() {
        this.navCtrl.push(AddReasonPage);
    }

    getPageInfo() {
        this.allReason = [];
        this.selectedReason = '';
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('SELECT * from reason_category ORDER BY id', [])
                    .then((data) => {
                        for (let i = 0; i < data.rows.length; i++) {
                            let reason = [];

                            db.executeSql('SELECT * from reason WHERE reason_cat_id=?', [data.rows.item(i).id])
                                .then((res) => {
                                    let j, image;
                                    let x = 0;
                                    for (j = 0; j < res.rows.length; j++) {
                                        if(data.rows.item(i).id === 1){
                                            image = this.imagePath[x++];
                                        }
                                        reason.push({ id: res.rows.item(j).id, reason_name: res.rows.item(j).reason_name, reason_cat_id: res.rows.item(j).reason_cat_id, image : image })

                                    }
                                })
                                .catch(e => console.log('Select Error' + JSON.stringify(e)));
                            setTimeout(() => {
                                this.allReason.push({ id: data.rows.item(i).id, category_name: data.rows.item(i).reason_cat_name, allReasons: reason })
                            }, 100);
                        }
                    })
                    .catch(e => console.log('Select Error' + JSON.stringify(e)));
            })
            .catch(e => console.log(e));

        setTimeout(() => {
            console.log(this.allReason);
        }, 1000)
    }

    addOwn() {
        const prompt = this.alertCtrl.create({
            title: 'Add your own reason',
            // message: "Enter reason",
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'reason',
                    placeholder: 'Enter reason'
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
                        if(res.reason === undefined || res.reason === ''){
                            const toast = this.toastCtrl.create({
                                message: 'Please enter reason',
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
                                db.executeSql('SELECT * FROM reason_category WHERE reason_cat_name=?', ['My personal reason']).then((data) => {
                                    if(data.rows.length > 0){
                                        let id = data.rows.item(0).id;
                                        console.log(id)
                                        db.executeSql('INSERT INTO reason( reason_name, reason_cat_id ) VALUES(?, ?)', [res.reason, id]).then(() => {
                                            const toast = this.toastCtrl.create({
                                                message: 'Reason successfully added',
                                                duration: 3000
                                            });
                                            toast.present();
                                            this.getPageInfo();
                                         }) .catch(e =>  {
                                            console.log('Insert Error' + JSON.stringify(e))
                                            if(e.code === 6){
                                                const toast = this.toastCtrl.create({
                                                    message: 'Reason already exists',
                                                    duration: 3000
                                                });
                                                toast.present();
                                                this.addOwn();
                                            }
                                        });
                                    }
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

    deleteReason(reason){
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
                            db.executeSql('DELETE from reason WHERE id=?', [reason.id])
                                .then((data) => {
                                    this.getPageInfo();
                                    const toast = this.toastCtrl.create({
                                        message: 'Reason deleted successfully',
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


    updateReason(reason) {
        const prompt = this.alertCtrl.create({
            title: 'Update reason',
            message: "Enter reason",
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'reason',
                    placeholder: 'Enter reason',
                    value: reason.reason_name
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
                        if(res.reason === undefined || res.reason === ''){
                            const toast = this.toastCtrl.create({
                                message: 'Please enter reason',
                                duration: 3000
                            });
                            toast.present();
                            this.updateReason(reason);
                        }
                        else{
                            this.sqlite.create({
                                name: 'brave_db.db',
                                location: 'default'
                            })
                            .then((db: SQLiteObject) => {
                                db.executeSql('UPDATE reason SET reason_name=? WHERE id=?', [res.reason, reason.id]).then((data) => {
                                    const toast = this.toastCtrl.create({
                                        message: 'Reason updated successfully',
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

    toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    };
    isGroupShown(group) {
        return this.shownGroup === group;
    };
}

