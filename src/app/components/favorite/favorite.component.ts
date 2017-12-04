import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClientService} from '../../services/http-client.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  showLayout = false;
  favorites: any = {favorites: []};
  favoritesList: any = [];
  newFavoriteArea = false;
  loadingFavorite = true;
  @Input() dataDimensions: any = {};
  @Input() options: any = {};
  @Input() layout: any = {};
  @Input() user: any = null;
  @Input() userGroups: any = null;
  @Input() allDimensionAvailable: boolean = false;
  @Output() onFavoriteSelect = new EventEmitter();
  @Output() onSharingSelect = new EventEmitter();
  newFavName = '';
  searchKey = '';
  showDelete: boolean[] = [];
  deleting: boolean[] = [];
  deleteSuccess: boolean[] = [];
  deleteFalure: boolean[] = [];
  showEdit: boolean[] = [];
  showSharing: boolean[] = [];
  editing: boolean[] = [];
  editSuccess: boolean[] = [];
  editFalure: boolean[] = [];
  k = 1;

  saving = false;
  savingSuccess = false;
  savingFalure = false;
  editText= '';

  constructor(private http: HttpClientService) {
  }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.getAllFavorite().subscribe((favs) => {
      this.favorites = favs;
      this.favoritesList = this.favorites['favorites'];
      this.loadingFavorite = false;
    }, error => {
      console.log(error);
      this.loadingFavorite = false;
    });
  }

  // opening a favorite
  openFavorite(favorite) {
    this.onFavoriteSelect.emit(favorite);
    this.showLayout = false;
    this.k = 1;
  }

  addFavorite() {
    // this.http.delete('dataStore/favorites/all').subscribe(() => {
      const favorite: any = {
        id: this.makeid(),
        name: this.newFavName,
        dataDimensions: this.dataDimensions,
        options: this.options,
        layout: this.layout,
        data: {
          user_groups: [],
          user: this.user
        }
      };
      this.saving = true;
      this.favorites['favorites'].push(favorite);
      this.saveMapping(favorite.id, this.favorites).subscribe((fav) => {
        this.saving = false;
        this.savingSuccess = true;
        this.favoritesList = this.favorites['favorites'];
        this.newFavoriteArea = false;
        this.newFavName = '';
        setTimeout(() => {
          this.savingSuccess = false;
        }, 2000);
      }, error => {
        this.savingFalure = true;
        this.saving = false;
        setTimeout(() => {
          this.savingFalure = false;
        }, 3000);
      });
    // });
  }

  enableAddFavorite() {
    this.newFavoriteArea = true;
  }

  // showing favorite edit area

  enableEdit(favorite) {
    this.editText = favorite.name;
    this.showEdit = [];
    this.showEdit[favorite.id] = true
  }

  // showing delete confirmation
  enableDelete(favorite) {
    this.showDelete = [];
    this.showDelete[favorite.id] = true
  }

  // deleting a favorite
  deleteFavorite(favorite) {
    const favoriteIndex = _.findIndex(this.favorites['favorites'], (fav: any) => fav.id === favorite.id);
    this.favorites['favorites'].splice(favoriteIndex, 1);
    this.deleting[favorite.id] = true;
    this.saveMapping(favorite.id, this.favorites).subscribe((fav) => {
      this.favoritesList = this.favorites['favorites'];
      this.deleteSuccess[favorite.id] = true;
      // _.remove(this.favorites, {id: favorite.id});
      // this.favorites.splice(this.favorites.indexOf(favorite),1);
      setTimeout(() => {
        this.deleteSuccess[favorite.id] = false;
      }, 2000);
      this.deleting[favorite.id] = false;
    }, (error) => {
      this.deleteFalure[favorite.id] = true;
      setTimeout(() => {
        this.deleteFalure[favorite.id] = false;
      }, 3000);
      this.deleting[favorite.id] = false;
    });
  }

  // Updating a favorite
  editFavorite(favorite) {
    const favoriteIndex = _.findIndex(this.favorites['favorites'], (fav:any) => fav.id === favorite.id);
    this.favorites['favorites'][favoriteIndex] = {
      id: favorite.id,
      name: this.editText,
      dataDimensions: this.dataDimensions,
      options: this.options,
      layout: this.layout
    };
    if (this.favorites['favorites'][favoriteIndex].hasOwnProperty('data')) {
      this.favorites['favorites'][favoriteIndex].data = favorite.data;
    }else {
      this.favorites['favorites'][favoriteIndex].data = {
        user_groups: [],
        user: this.user
      };
    }
    this.editing[favorite.id] = true;
    favorite.name = this.editText;
    this.saveMapping(favorite.id, this.favorites).subscribe((fav) => {
      this.editSuccess[favorite.id] = true;
      this.favoritesList = this.favorites['favorites'];
      setTimeout(() => {
        this.editSuccess[favorite.id] = false;
      }, 2000);
      this.editing[favorite.id] = false;
      this.showEdit[favorite.id] = false;
    }, (error) => {
      this.editFalure[favorite.id] = true;
      setTimeout(() => {
        this.editFalure[favorite.id] = false;
      }, 3000);
      this.deleting[favorite.id] = false;
      this.showEdit[favorite.id] = false;
    });
  }

  onSharingUpdate($event, favorite) {
    favorite.data.user_groups = $event;
  }

  saveSharing(favorite) {
    const favoriteIndex = _.findIndex(this.favorites['favorites'], (fav: any) => fav.id === favorite.id);
    this.favorites['favorites'][favoriteIndex] = favorite;
    this.saveMapping(favorite.id, this.favorites).subscribe((fav) => {});
    this.showSharing = [];
  }

  // generate a random list of Id for use as scorecard id
  makeid(): string {
    let text = '';
    const possible_combinations = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 11; i++) {
      text += possible_combinations.charAt(Math.floor(Math.random() * possible_combinations.length));
    }
    return text;
  }


  getAllFavorite() {
    return new Observable((observ) => {
      this.http.get('dataStore/favorites/all').subscribe((results) => {
        const favorites = results;
        observ.next(favorites);
        observ.complete();
      }, (error) => {
        observ.error();
      });
    });

  }

  saveMapping(favoriteId, favorite) {
    return new Observable((observable) => {
      if (this.favorites['favorites'].length === 0) {
        this.http.post('dataStore/favorites/all', favorite).subscribe((results) => {
          observable.next(favorite);
          observable.complete();
        }, (error) => {
          console.log('something went wrong while adding mapping');
          observable.error('something went wrong while adding mapping');
        });
      }else {
        this.http.put('dataStore/favorites/all', favorite).subscribe((results) => {
          observable.next(favorite);
          observable.complete();
        }, (error) => {
          observable.error('something went wrong while adding mapping');
        });
      }
    });
  }

  updateMapping(favoriteId, favorite) {
    return new Observable((observable) => {
      this.http.put('dataStore/favorites/all', favorite).subscribe((results) => {
        observable.next(favorite);
        observable.complete();
      }, (error) => {
        observable.error('something went wrong while adding mapping');
      });
    });
  }

  deleteMapping(favoriteId, favorite) {
    return new Observable((observable) => {
      this.http.delete('dataStore/pivotFavorite/' + favoriteId).subscribe((results) => {
        observable.next(favorite);
        observable.complete();
      }, (error) => {
        observable.error('something went wrong while adding mapping');
      });
    });
  }


  enableSharing( favorite ) {
    this.showSharing = [];
    if (!favorite.hasOwnProperty('data'))
    {
      favorite.data = {
        user_groups: [],
        user: this.user
      };
    }
    this.showSharing[favorite.id] = true;
  }

}
