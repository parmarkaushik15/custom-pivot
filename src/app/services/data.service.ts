import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable, forkJoin} from 'rxjs';
import {Indicator} from '../model/indicator';
import {DataElement} from '../model/data-element';
import {CategoryCombo} from '../model/category-combo';
import {OrganisationUnit} from '../model/organisation-unit';
import {
  LocalStorageService, DATAELEMENT_KEY, INDICATOR_KEY,
  ORGANISATION_UNIT_KEY, CATEGORY_COMBOS_KEY, INDICATOR_GROUP_KEY, DATAELEMENT_GROUP_KEY, DATASET_KEY, PROGRAM_KEY
} from './local-storage.service';
import {DataelementGroup} from '../model/dataelement-group';
import {IndicatorGroup} from '../model/indicator-group';
import {DataSet} from '../model/dataset';
import {AutoGrowing} from '../model/auto-growing';
import {HttpClientService} from './http-client.service';

@Injectable()
export class DataService {

  metaData = {
    organisationUnits: [],
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
  };

  constructor(private http: HttpClientService, private localDbService: LocalStorageService) {
  }

  getIndicators(): Observable<Indicator[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/indicators.json?fields=id,name,dataSets[periodType]&paging=false').subscribe(
        (data: any) => {
          observ.next(data.indicators || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getDataElements(): Observable<DataElement[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/dataElements.json?fields=,id,name,valueType,categoryCombo,dataSetElements[dataSet[periodType]&paging=false&filter=domainType:eq:AGGREGATE&filter=valueType:ne:TEXT&filter=valueType:ne:LONG_TEXT')
        .subscribe(
        (data: any) => {
          observ.next(data.dataElements || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getDataSets(): Observable<DataSet[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/dataSets.json?paging=false&fields=id,name,periodType').subscribe(
        (data: any) => {
          observ.next(data.dataSets || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getCategoryCombos(): Observable<CategoryCombo[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/categoryCombos.json?fields=id,name,categoryOptionCombos[id,name]&paging=false').subscribe(
        (data: any) => {
          observ.next(data.categoryCombos || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getOrganisationUnits(): Observable<OrganisationUnit[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/organisationUnits.json?fields=id,name,children,parent,path&paging=false').subscribe(
        (data: any) => {
          observ.next(data.organisationUnits || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getDataElementGroups(): Observable<DataelementGroup[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/dataElementGroups.json?paging=false&fields=id,name,dataElements[id,name,categoryCombo,dataSetElements[dataSet[periodType]]')
        .subscribe(
        (data: any) => {
          observ.next(data.dataElementGroups || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getIndicatorGroups(): Observable<IndicatorGroup[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/indicatorGroups.json?paging=false&fields=id,name,indicators[id,name,dataSets[periodType]]').subscribe(
        (data: any) => {
          observ.next(data.indicatorGroups || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }

  getPrograms(): Observable<AutoGrowing[]> {
    return new Observable((observ) => {
      this.http.get('../../../api/programs.json?paging=false&fields=id,name,programType').subscribe(
        (data: any) => {
          observ.next(data.programs || []);
          observ.complete();
        }, error1 => {
          observ.error(error1);
          observ.complete();
        }
      )
    });
  }


  initiateData() {
    return forkJoin(
      this.getDataFromLocalDatabase(DATAELEMENT_KEY),
      this.getDataFromLocalDatabase(INDICATOR_KEY),
      this.getDataFromLocalDatabase(INDICATOR_GROUP_KEY),
      this.getDataFromLocalDatabase(DATAELEMENT_GROUP_KEY),
      this.getDataFromLocalDatabase(DATASET_KEY),
      this.getDataFromLocalDatabase(CATEGORY_COMBOS_KEY),
      this.getDataFromLocalDatabase(PROGRAM_KEY)
    );

  }

  getFunctions() {
    return new Observable((observ) => {
      this.http.get('../../../api/dataStore/functions').subscribe((results) => {
        const observables = [];
        results.forEach((id) => {
          observables.push(this.http.get('../../../api/dataStore/functions/' + id));
        });
        forkJoin(observables).subscribe((responses: any) => {
          const functions = [];
          responses.forEach((response, index) => {
            functions.push(response);
          });
          observ.next(functions);
          observ.complete();
        }, (error) => {

        })
      }, (error) => {

      })
    })

  }

  // Get the data-elements mappings to match with functions
  getAllMappings() {
    return new Observable((observ) => {
      this.http.get('../../../api/dataStore/functionMapper1').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      })
    })

  }

  // Get the data-elements mappings to match with functions
  getASytemInfo() {
    return new Observable((observ) => {
      this.http.get('../../../api/system/info.json').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      })
    })

  }

  // get a list of data-elements to hide because of grey fields in data-elements/otherwise
  getHiddenDataElements(): any {
    return new Observable((observ) => {
      this.http.get('../../../api/dataStore/dataElementsHiddenInPivot').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      })
    })
  }

  getRenamedDataElements() {
    return new Observable((observ) => {
      this.http.get('../../../api/dataStore/renamedDataElementsInPivot/items').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      })
    });

  }

  getMapping(id): any {
    return new Observable((observ) => {
      this.http.get('../../../api/dataStore/functionMapper1/' + id).subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      })
    })
  }

  /**
   * This function will be used to return all needed metadata either from offline or if not available the online
   * @param key
   * @returns {any}
   */
  getDataFromLocalDatabase(key: string): Observable<any> {
    return Observable.create(observer => {
      this.localDbService.getAll(key).subscribe(
        (items) => {
          if (items.length !== 0) {
            observer.next(items);
            observer.complete();
          } else {
            let dataStream$ = null;
            switch (key) {
              case DATAELEMENT_KEY:
                dataStream$ = this.getDataElements();
                break;
              case DATASET_KEY:
                dataStream$ = this.getDataSets();
                break;
              case ORGANISATION_UNIT_KEY:
                dataStream$ = this.getOrganisationUnits();
                break;
              case CATEGORY_COMBOS_KEY:
                dataStream$ = this.getCategoryCombos();
                break;
              case INDICATOR_KEY:
                dataStream$ = this.getIndicators();
                break;
              case INDICATOR_GROUP_KEY:
                dataStream$ = this.getIndicatorGroups();
                break;
              case DATAELEMENT_GROUP_KEY:
                dataStream$ = this.getDataElementGroups();
                break;
              case PROGRAM_KEY:
                dataStream$ = this.getPrograms();
                break;
              default:
                console.error('The key passed is not recognized');
                break;

            }
            dataStream$.subscribe(
              (data) => {
                data.forEach((val) => {
                  this.localDbService.add(key, val).subscribe((v) => null);
                });
                observer.next(data);
                observer.complete();
              },
              (error) => observer.error(error)
            )
          }
        },
        error => observer.error(error)
      )
    });
  }

  /**
   * This function will be used to return all needed metadata either from offline or if not available the online
   * @param key
   * @returns {any}
   */
  addDataToLocalDatabase(key: string): Observable<any> {
    return Observable.create(observer => {
      this.localDbService.getAll(key).subscribe(
        (items) => {
          let dataStream$ = null;
          switch (key) {
            case DATAELEMENT_KEY:
              dataStream$ = this.getDataElements();
              break;
            case DATASET_KEY:
              dataStream$ = this.getDataSets();
              break;
            case ORGANISATION_UNIT_KEY:
              dataStream$ = this.getOrganisationUnits();
              break;
            case CATEGORY_COMBOS_KEY:
              dataStream$ = this.getCategoryCombos();
              break;
            case INDICATOR_KEY:
              dataStream$ = this.getIndicators();
              break;
            case INDICATOR_GROUP_KEY:
              dataStream$ = this.getIndicatorGroups();
              break;
            case DATAELEMENT_GROUP_KEY:
              dataStream$ = this.getDataElementGroups();
              break;
            case PROGRAM_KEY:
              dataStream$ = this.getPrograms();
              break;
            default:
              console.error('The key passed is not recognized');
              break;

          }
          dataStream$.subscribe(
            (data) => {
              data.forEach((val) => {
                this.localDbService.add(key, val).subscribe((v) => null, error => {
                });
              });
              observer.next(data);
              observer.complete();
            },
            (error) => observer.error(error)
          )
        },
        error => observer.error(error)
      )
    });
  }


  getUser() {
    return new Observable((observ) => {
      this.http.get('../../../api/me.json?fields=id,name,userGroups,userCredentials[userRoles[authorities]]').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      });
    });

  }

  getUserGroups() {
    return new Observable((observ) => {
      this.http.get('../../../api/userGroups.json?fields=id,name&paging=false').subscribe((results) => {
        observ.next(results);
        observ.complete();
      }, (error) => {
        observ.error();
      });
    });

  }


}
