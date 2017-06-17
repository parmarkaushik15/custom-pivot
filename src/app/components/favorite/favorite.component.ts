import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClientService} from "../../services/http-client.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  showLayout: boolean = false;
  favorites:any = [];
  newFavoriteArea:boolean = false;
  loadingFavorite:boolean = true;
  @Input() dataDimensions:any = {};
  @Input() options: any= {};
  @Input() layout: any = {};
  @Input() allDimensionAvailable: boolean = false;
  @Output() onFavoriteSelect = new EventEmitter()
  newFavName:string = "";
  showDelete:boolean[] = [];
  deleting:boolean[] = [];
  deleteSuccess:boolean[] = [];
  deleteFalure:boolean[] = [];
  showEdit:boolean[] = [];
  editing:boolean[] = [];
  editSuccess:boolean[] = [];
  editFalure:boolean[] = [];
  constructor(private http:HttpClientService) { }

  ngOnInit() {
    this.getAllFavorite().subscribe((favs) => {
      this.favorites = favs;
      this.loadingFavorite = false;
    },error=>{
      console.log(error)
      this.loadingFavorite = false;
    })
  }

  // opening a favorite
  openFavorite(favorite){
    this.onFavoriteSelect.emit(favorite);
    this.showLayout =  false;
  }

  saving:boolean = false;
  savingSuccess:boolean = false;
  savingFalure:boolean = false;
  addFavorite(){
   let favorite = {
     id:this.makeid(),
     name:this.newFavName,
     dataDimensions:this.dataDimensions,
     options:this.options,
     layout:this.layout
   };
   this.saving = true;
    this.saveMapping(favorite.id,favorite).subscribe((fav)=>{
     this.saving = false;
     this.favorites.push(fav);
     this.savingSuccess = true;
     this.newFavoriteArea = false;
     this.newFavName = "";
     setTimeout(()=>{
       this.savingSuccess = false;
     },2000)
    },error=>{
      this.savingFalure = true;
      this.saving = false;
      setTimeout(()=>{
        this.savingFalure = false;
      },3000)
    })
  }

  enableAddFavorite(){
    this.newFavoriteArea = true;
  }

  // showing favorite edit area
  editText:string = "";
  enableEdit(favorite){
    this.editText = favorite.name;
    this.showEdit = [];
    this.showEdit[favorite.id] = true
  }

  // showing delete confirmation
  enableDelete(favorite){
      this.showDelete = [];
      this.showDelete[favorite.id] = true
    }

  // deleting a favorite
  deleteFavorite(favorite){
    this.deleting[favorite.id] = true;
    this.deleteMapping(favorite.id, favorite).subscribe((fav) => {
      this.deleteSuccess[favorite.id] = true;
      this.favorites.splice(this.favorites.indexOf(favorite),1);
      setTimeout(()=>{
        this.deleteSuccess[favorite.id] = false;
      },2000);
      this.deleting[favorite.id] = false;
    }, (error)=>{
      this.deleteFalure[favorite.id] = true;
      setTimeout(()=>{
        this.deleteFalure[favorite.id] = false;
      },3000);
      this.deleting[favorite.id] = false;
    })
  }

  // Updating a favorite
  editFavorite(favorite){
    this.editing[favorite.id] = true;
    favorite.name = this.editText;
    this.updateMapping(favorite.id, favorite).subscribe((fav) => {
      this.editSuccess[favorite.id] = true;
      this.favorites.splice(this.favorites.indexOf(favorite),1,fav);
      setTimeout(()=>{
        this.editSuccess[favorite.id] = false;
      },2000);
      this.editing[favorite.id] = false;
      this.showEdit[favorite.id] = false;
    }, (error)=>{
      this.editFalure[favorite.id] = true;
      setTimeout(()=>{
        this.editFalure[favorite.id] = false;
      },3000);
      this.deleting[favorite.id] = false;
      this.showEdit[favorite.id] = false;
    })
  }
  // generate a random list of Id for use as scorecard id
  makeid(): string{
    let text = "";
    let possible_combinations = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 11; i++ )
      text += possible_combinations.charAt(Math.floor(Math.random() * possible_combinations.length));
    return text;
  }


  getAllFavorite(){
    return new Observable((observ)=>{
      this.http.get("dataStore/pivotFavorite").subscribe((results)=>{
        let observable = [];
        results.forEach((id)=>{
          observable.push(this.http.get("dataStore/pivotFavorite/" + id))
        });
        Observable.forkJoin(observable).subscribe((responses:any)=>{
          let functions = [];
          responses.forEach((response,index)=>{
            functions.push(response);
          });
          observ.next(functions);
          observ.complete();
        },(error)=>{
          observ.error();
        })
      },(error)=>{
        observ.error();
      })
    })

  }

  saveMapping(favoriteId,favorite){
    return new Observable((observable)=>{
      this.http.post("dataStore/pivotFavorite/" + favoriteId,favorite).subscribe((results)=>{
        observable.next(favorite);
        observable.complete();
      },(error) => {
        console.log("something went wrong while adding mapping")
        observable.error("something went wrong while adding mapping")
      })
    });
  }

  updateMapping(favoriteId,favorite){
    return new Observable((observable)=>{
      this.http.put("dataStore/pivotFavorite/" + favoriteId,favorite).subscribe((results)=>{
        observable.next(favorite);
        observable.complete();
      },(error) => {
        observable.error("something went wrong while adding mapping")
      })
    });
  }

  deleteMapping(favoriteId,favorite){
    return new Observable((observable)=>{
      this.http.delete("dataStore/pivotFavorite/" + favoriteId).subscribe((results)=>{
        observable.next(favorite);
        observable.complete();
      },(error) => {
        observable.error("something went wrong while adding mapping")
      })
    });
  }


}
