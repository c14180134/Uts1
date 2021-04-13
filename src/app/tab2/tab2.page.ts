import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isiData : Observable<data[]>;
  
  isiDataColl : AngularFirestoreCollection<data>;
  constructor(afs:AngularFirestore) {
    this.isiDataColl = afs.collection('dataNote');
    this.isiData = this.isiDataColl.valueChanges();
  }

  delete(i:string){
    console.log(i)
    
   this.isiDataColl.doc(i).delete();
  }
}

interface data{
  judul : string,
  isi :string,
  tanggal : Date,
  nilai : string
}
