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

  Judul:string;
  Isi:string;
  Nilai:string;
  paten:string
  Tanggal:Date
  isiDataColl : AngularFirestoreCollection<data>;
  constructor(afs:AngularFirestore) {
    this.isiDataColl = afs.collection('dataNote');
    this.isiData = this.isiDataColl.valueChanges();
  }
  kliked(ganti:string,si:string,Nil:string,tgl:Date){
    this.Judul=ganti
    this.Isi=si
    this.Nilai=Nil
    this.paten=ganti
    this.Tanggal=tgl
  }
  simpan(){
    this.isiDataColl.doc(this.paten).set({
      judul:this.Judul,
      isi:this.Isi,
      tanggal:this.Tanggal,
      nilai:this.Nilai
    });
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
