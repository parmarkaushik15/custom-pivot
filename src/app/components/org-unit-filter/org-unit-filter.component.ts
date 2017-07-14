import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Response, Http} from "@angular/http";
import {TreeComponent, TREE_ACTIONS, IActionMapping} from "angular-tree-component";
import {Observable} from "rxjs";
import {OrgUnitService} from "./org-unit.service";
import {MultiselectComponent} from "./multiselect/multiselect.component";

@Component({
  selector: '[app-org-unit-filter]',
  templateUrl: './org-unit-filter.component.html',
  styleUrls: ['./org-unit-filter.component.css']
})
export class OrgUnitFilterComponent implements OnInit {
  // the object that will carry the output value you can send one from outside to config start values
  @Input() orgunit_model: any =  {
    selection_mode: "Usr_orgUnit",
    selected_levels: [],
    show_update_button:true,
    selected_groups: [],
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type:"report", // can be 'data_entry'
    selected_user_orgunit: []
  };
  initial_usr_orgunit = [];

  // The organisation unit configuration object This will have to come from outside.
  @Input() orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    multiple_key:"none", //can be control or shift
    placeholder: "Select Organisation Unit"
  };

  @Output() onOrgUnitUpdate : EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitInit : EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitModelUpdate : EventEmitter<any> = new EventEmitter<any>();

  orgUnit: any = {};
  root_url = '../../../';
  nodes: any[] = null;
  orgunit_levels:any[] = [];
  @ViewChild('orgtree')
  orgtree: TreeComponent;

  @ViewChild('period_selector')
  period_selector: MultiselectComponent;

  organisationunits: any[] = [];
  selected_orgunits: any[] = [];

  // this variable controls the visibility of of the tree
  showOrgTree:boolean = false;

  customTemplateStringOrgunitOptions: any;

  user_orgunits_types: Array<any> = [
    {id:'USER_ORGUNIT', name: 'User Admin Unit', shown: true},
    {id:'USER_ORGUNIT_CHILDREN', name: 'User sub-units', shown: true},
    {id:'USER_ORGUNIT_GRANDCHILDREN', name: 'User sub-x2-units', shown: true}
  ];
  constructor(
    private http: Http,
    private orgunitService: OrgUnitService
  ) {
     if(!this.orgunit_tree_config.hasOwnProperty("multiple_key")){
       this.orgunit_tree_config.multiple_key = "none";
     }
  }

  updateModelOnSelect(data){
    if(!this.orgunit_model.show_update_button){
      this.onOrgUnitUpdate.emit({name: 'ou', value: data.id});
      this.displayOrgTree()
    }
  }
  ngOnInit() {
    console.log("orgunitMOdel",this.orgunit_model)
    if(this.orgunit_tree_config.multiple) {
      if(this.orgunit_tree_config.multiple_key == "none"){
        let actionMapping:IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};

      }
      // multselect using control key
      else if(this.orgunit_tree_config.multiple_key == "control"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }
      // multselect using shift key
      else if(this.orgunit_tree_config.multiple_key == "shift"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }

    }else{
      let actionMapping:IActionMapping = {
        mouse: {
          dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        }
      };
      this.customTemplateStringOrgunitOptions = {actionMapping};
    }


    // if (this.orgunitService.nodes == null) {
      this.orgunitService.getOrgunitLevelsInformation()
        .subscribe(
          (data: any) => {
            // assign urgunit levels and groups to variables
            this.orgunit_model.orgunit_levels = data.organisationUnitLevels;
            // setting organisation groups
            this.orgunitService.getOrgunitGroups().subscribe( groups => {//noinspection TypeScriptUnresolvedVariable
              this.orgunit_model.orgunit_groups = groups;
            });

            // identify currently logged in usser
            this.orgunitService.getUserInformation(this.orgunit_model.type).subscribe(
              userOrgunit => {
                let level = this.orgunitService.getUserHighestOrgUnitlevel( userOrgunit );
                this.orgunit_model.user_orgunits = this.orgunitService.getUserOrgUnits( userOrgunit );
                console.log(this.orgunit_model.user_orgunits)
                this.orgunitService.user_orgunits = this.orgunitService.getUserOrgUnits( userOrgunit );
                if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
                  this.orgunit_model.selected_orgunits = this.orgunit_model.user_orgunits;
                }
                let all_levels = data.pager.total;
                let orgunits = this.orgunitService.getuserOrganisationUnitsWithHighestlevel( level, userOrgunit );
                let use_level = parseInt(all_levels) - (parseInt(level) - 1);
                //load inital orgiunits to speed up loading speed
                this.orgunitService.getInitialOrgunitsForTree(orgunits).subscribe(
                  (initial_data) => {
                    this.organisationunits = initial_data
                    this.orgunit_tree_config.loading = false;
                    // a hack to make sure the user orgunit is not triggered on the first time
                    this.initial_usr_orgunit = [{id:'USER_ORGUNIT', name: 'User org unit'}];
                    // after done loading initial organisation units now load all organisation units
                    let fields = this.orgunitService.generateUrlBasedOnLevels(use_level);
                    this.orgunitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                      items => {

                        items[0].expanded = true;
                        this.organisationunits = items;

                        //activate organisation units
                        for (let active_orgunit of this.orgunit_model.selected_orgunits) {
                          this.activateNode(active_orgunit.id, this.orgtree,true);

                        }


                        this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
                      },
                      error => {
                        console.log('something went wrong while fetching Organisation units');
                        this.orgunit_tree_config.loading = false;
                      }
                    )
                  },
                  error => {
                    console.log('something went wrong while fetching Organisation units');
                    this.orgunit_tree_config.loading = false;
                  }
                )

              }
            )
          }
        );
  }

  clearAll(){
    for (let active_orgunit of this.orgunit_model.selected_orgunits) {
      this.deActivateNode(active_orgunit.id, this.orgtree,null);
    }
  }

  setType(type: string){
    this.orgunit_model.selection_mode = type;
    if( type != 'orgUnit' ){
      this.orgunit_model.selected_user_orgunit = [];
    }
    if( type != 'Level' ){
      this.orgunit_model.selected_levels = [];
    }
    if( type != 'Group' ){
      this.orgunit_model.selected_groups = [];
    }
  }
  // display Orgunit Tree
  displayOrgTree(){
    // this.showOrgTree = !this.showOrgTree;
  }
  filterNodes(value,tree){
    tree.treeModel.filterNodes((node) => {
      return !node.data.name.startsWith(value);
    });
  }

  activateNode(nodeId:any, nodes,first){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.setIsActive(true, true);
      if(first){
        node.toggleExpanded()
      }
    }, 0);
  }

  // a method to activate the model
  deActivateNode(nodeId:any, nodes, event){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.setIsActive(false, true);
    }, 0);
    if( event != null){
      event.stopPropagation();
    }
  }

  // check if orgunit already exist in the orgunit display list
  checkOrgunitAvailabilty(orgunit, array): boolean{
    let checker = false;
    array.forEach((value) => {
      if( value.id == orgunit.id ){
        checker = true;
      }
    });
    return checker;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivateOrg ( $event ) {
    this.period_selector.reset();
    if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
      this.orgunit_model.selection_mode = "orgUnit";
      this.period_selector.reset();
    }
    this.orgunit_model.selected_orgunits.forEach((item,index) => {
      if( $event.node.data.id == item.id ) {
        this.orgunit_model.selected_orgunits.splice(index, 1);
      }
    });

    this.emit();

    // $event.node.isFocused = false;
  };

  // add item to array of selected items when item is selected
  activateOrg = ($event) => {
    this.period_selector.reset();
    if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
      this.orgunit_model.selection_mode = "orgUnit";
      this.period_selector.reset();
    }
    this.selected_orgunits = [$event.node.data];
    if(!this.checkOrgunitAvailabilty($event.node.data, this.orgunit_model.selected_orgunits)){
      this.orgunit_model.selected_orgunits.push($event.node.data);
    }
    this.orgUnit = $event.node.data;
    this.emit();
  };

  emit(){
    console.log("This Model:",this.orgunit_model.selected_orgunits);
    var mapper = {};
    this.orgunit_model.selected_orgunits.forEach(function(orgUnit){
      if(!mapper[orgUnit.level]){
        mapper[orgUnit.level] = [];
      }
      mapper[orgUnit.level].push(orgUnit);
    })
    var arrayed_org_units = [];
    Object.keys(mapper).forEach(function(orgUnits){
      arrayed_org_units.push(mapper[orgUnits])
    })
    this.onOrgUnitUpdate.emit({starting_name: this.getProperPreOrgunitName(),arrayed_org_units:arrayed_org_units,items: this.orgunit_model.selected_orgunits, name:'ou', value: this.getOrgUnitsForAnalytics(this.orgunit_model,false)});
    this.onOrgUnitModelUpdate.emit(this.orgunit_model);
  }
  // set selected groups
  setSelectedGroups( selected_groups ){
    this.orgunit_model.selected_groups = selected_groups;
    this.onOrgUnitModelUpdate.emit(this.orgunit_model);
  }

  // set selected groups
  setSelectedUserOrg( selected_user_orgunit ){
    this.orgunit_model.selected_user_orgunit = selected_user_orgunit;
    this.emit();
  }

  // set selected groups
  setSelectedLevels( selected_levels ){
    this.orgunit_model.selected_levels = selected_levels;
    this.emit();
  }

  prepareOrganisationUnitTree(organisationUnit,type:string='top') {
    if (type == "top"){
      if (organisationUnit.children) {
        organisationUnit.children.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        organisationUnit.children.forEach((child) => {
          this.prepareOrganisationUnitTree(child,'top');
        })
      }
    }else{
      organisationUnit.forEach((orgunit) => {
        if (orgunit.children) {
          orgunit.children.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          orgunit.children.forEach((child) => {
            this.prepareOrganisationUnitTree(child,'top');
          })
        }
      });
    }
  }

  updateOrgUnitModel() {
    this.displayOrgTree();
    this.emit();
  }

  // prepare a proper name for updating the organisation unit display area.
  getProperPreOrgunitName() : string{
    let name = "";
    if( this.orgunit_model.selection_mode == "Group" ){
      name = (this.orgunit_model.selected_groups.length == 0)?"":this.orgunit_model.selected_groups.map((group) => group.name).join(", ") + " in";
    }else if( this.orgunit_model.selected_user_orgunit.length != 0 ){
      name = (this.orgunit_model.selected_user_orgunit.length == 0)?"":this.orgunit_model.selected_user_orgunit.map((level) => level.name).join(", ")
    }else if( this.orgunit_model.selection_mode == "Level" ){
      name = (this.orgunit_model.selected_levels.length == 0)?"":this.orgunit_model.selected_levels.map((level) => level.name).join(", ") + " in";
    }else{
      name = "";
    }
    return name
  }

  // get user organisationunit name
  getOrgUnitName(id){
    let orgunit = this.orgtree.treeModel.getNodeById(id);
    return orgunit.name;
  }

  // a function to prepare a list of organisation units for analytics
  getOrgUnitsForAnalytics(orgunit_model:any, with_children:boolean): string{
    let orgUnits = [];
    let organisation_unit_analytics_string = "";
    // if the selected orgunit is user org unit
    if( orgunit_model.selected_user_orgunit.length != 0 ){
      // if(orgunit_model.user_orgunits.length == 1){
      //   let user_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.user_orgunits[0].id);
      //   orgUnits.push(user_orgunit.id);
      //   if(user_orgunit.hasOwnProperty('children') && with_children){
      //     for( let orgunit of user_orgunit.children ){
      //       orgUnits.push(orgunit.id);
      //     }
      //   }
      // }else{
        orgunit_model.selected_user_orgunit.forEach((orgunit) => {
          organisation_unit_analytics_string += orgunit.id+";";
        });

      // }
    }

    else{
      // if there is only one organisation unit selected
      if ( orgunit_model.selected_orgunits.length == 1 ){
        let detailed_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.selected_orgunits[0].id);
        orgUnits.push(detailed_orgunit.id);
        if(detailed_orgunit.hasOwnProperty('children') && with_children){
          for( let orgunit of detailed_orgunit.children ){
            orgUnits.push(orgunit.id);
          }
        }

      }
      // If there is more than one organisation unit selected
      else{
        orgunit_model.selected_orgunits.forEach((orgunit) => {
          orgUnits.push(orgunit.id);
        })
      }
      if(orgunit_model.selection_mode == "orgUnit"){

      }if(orgunit_model.selection_mode == "Level"){
        orgunit_model.selected_levels.forEach((level) => {
          organisation_unit_analytics_string += "LEVEL-" + level.level + ";";
        });
      }if(orgunit_model.selection_mode == "Group"){
        orgunit_model.selected_groups.forEach((group) => {
          organisation_unit_analytics_string += "OU_GROUP-"+group.id + ";";
        });
      }
    }
    return organisation_unit_analytics_string+orgUnits.join(";");
  }

  // Get system wide settings
  getOrgunitLevelsInformation () {
    return this.http.get(this.root_url + 'api/organisationUnitLevels.json?fields=id,name,level&order=level:asc')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Get organisation unit groups information
  getOrgunitGroups () {
    return this.http.get(this.root_url + 'api/organisationUnitGroups.json?fields=id,name&paging=false')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  handleError (error: any) {
    return Observable.throw( error );
  }

  // Get current user information
  getUserInformation () {
    return this.http.get(this.root_url + 'api/me.json?fields=dataViewOrganisationUnits[id,level],organisationUnits[id,level]')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  getUserHighestOrgUnitlevel(userOrgunits){
    let level: any;
    let orgunits = [];
    if(userOrgunits.dataViewOrganisationUnits.length == 0){
      level = userOrgunits.organisationUnits[0].level;
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if ( orgunit.level <= level ){
          level = orgunit.level;
        }
      })
    }else{
      level = userOrgunits.dataViewOrganisationUnits[0].level;
      userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
        if ( orgunit.level <= level ){
          level = orgunit.level;
        }
      })
    }
    return level;
  }

  getuserOrganisationUnitsWithHighestlevel(level,userOrgunits){
    let orgunits = [];
    if(userOrgunits.dataViewOrganisationUnits.length == 0){
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if ( orgunit.level == level ){
          orgunits.push(orgunit.id);
        }
      })
    }else{
      level = userOrgunits.dataViewOrganisationUnits[0].level;
      userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
        if ( orgunit.level == level ){
          orgunits.push(orgunit.id);
        }
      })
    }
    return orgunits;
  }

  getInitialOrgunitsForTree (orgunits) {
    return this.http.get(this.root_url + 'api/me.json?fields=organisationUnits[id,name,children[id,name]]&filter=id:in:['+orgunits.join(",")+']&paging=false')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Generate Organisation unit url based on the level needed
  generateUrlBasedOnLevels (level){
    let childrenLevels = "[]";
    for (let i = 1; i < level+1; i++) {
      childrenLevels = childrenLevels.replace("[]", "[id,name,children[]]")
    }
    let new_string = childrenLevels.substring(1);
    new_string = new_string.replace(",children[]]","");
    return new_string;
  }

  // Get orgunit for specific
  getAllOrgunitsForTree1 (fields,orgunits) {
    return this.http.get(this.root_url + 'api/organisationUnits.json?fields=' + fields +'&filter=id:in:['+orgunits.join(",")+']&paging=false')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }
}
