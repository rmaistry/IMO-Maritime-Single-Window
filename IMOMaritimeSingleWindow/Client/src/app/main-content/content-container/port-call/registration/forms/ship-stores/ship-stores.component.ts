import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PortCallShipStoresModel } from 'app/shared/models/port-call-ship-stores-model';
import { LocalDataSource } from 'ng2-smart-table';
import { FalShipStoresService } from 'app/shared/services/fal-ship-stores.service';
import { DeleteButtonComponent } from '../shared/delete-button/delete-button.component';
import { PortCallService } from 'app/shared/services/port-call.service';
import { Observable } from 'rxjs/Observable';
import { MeasurementTypeModel } from 'app/shared/models/measurement-type-model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-ship-stores',
  templateUrl: './ship-stores.component.html',
  styleUrls: ['./ship-stores.component.css']
})
export class ShipStoresComponent implements OnInit, OnDestroy {

  @Input() portCallId: number;

  portCallShipStoresList: PortCallShipStoresModel[];

  portCallShipStoresModel: PortCallShipStoresModel = new PortCallShipStoresModel();

  measurementTypeList: Observable<any>;
  selectedMeasurementType: MeasurementTypeModel;
  measurementTypeSelected: boolean;

  listIsPristine: Boolean = true;

  @ViewChild(NgForm) form: NgForm;

  shipStoresDataSource: LocalDataSource = new LocalDataSource();

  tableSettings = {
    actions: false,
    attr: {
      class: 'table table-bordered'
    },
    editor: {
      config: {
        completer: {
          descriptionField: 'Search here'
        }
      }
    },
    noDataMessage: 'There are no ship stores in this list.',
    columns: {
      sequenceNumber: {
        title: 'Sequence Number',
      },
      articleName: {
        title: 'Article Name'
      },
      articleCode: {
        title: 'Article Code'
      },
      quantity: {
        title: 'Quantity'
      },
      measurementType: {
        title: 'Measurement Type'
      },
      locationOnBoard: {
        title: 'Location Onboard'
      },
      locationOnBoardCode: {
        title: 'Location Onboard Code'
      },
      delete: {
        title: 'Delete',
        // deleteButtonContent: 'Delete',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: DeleteButtonComponent,
      },
    }
  };

  constructor(
    private shipStoresService: FalShipStoresService,
    private portCallService: PortCallService
  ) { }

  ngOnInit() {
    this.shipStoresService.getMeasurementTypeList().subscribe(
      results => {
        this.measurementTypeList = results;
      },
      error => {
        console.log('Failed to retrieve measurement types from database.');
      },
      () => {
        // This will change when the port calls list changes in the database
        this.shipStoresService.getShipStoresByPortCallId(this.portCallId).subscribe(
          list => {
            if (list && this.portCallShipStoresList == null) {
              this.portCallShipStoresList = [];
              this.shipStoresService.setShipStoresInformationData(list);
            }
          }
        );

        this.shipStoresService.shipStoresList$.subscribe(
          list => {
            if (list) {
              this.portCallShipStoresList = list;
              this.shipStoresDataSource.load(this.generateSmartTable());
            }
          }
        );
      }
    );

  }

  ngOnDestroy() {
  }

  // Generate list that will be sent to shipStoresDataSource that is connected to the smart table
  generateSmartTable(): any[] {
    const list = [];
    if (this.portCallShipStoresList) {
      this.portCallShipStoresList.forEach(element => {
        let measureMentTypeName: string;
        this.measurementTypeList.forEach(measurementType => {
          if (measurementType.measurementTypeId === element.measurementTypeId) {
            measureMentTypeName = measurementType.name;
          }
        });

        list.push(
          {
            sequenceNumber: element.sequenceNumber,
            articleName: element.articleName,
            articleCode: element.articleCode,
            quantity: element.quantity,
            measurementType: measureMentTypeName,
            locationOnBoard: element.locationOnBoard,
            locationOnBoardCode: element.locationOnBoardCode,
          }
        );
      });
    }
    return list;
  }

  // Set measurement type and id of model
  selectMeasurementType(measurementType) {
    if (measurementType) {
      this.portCallShipStoresModel.measurementTypeId = measurementType.measurementTypeId;
      this.measurementTypeSelected = true;
    } else {
      this.measurementTypeSelected = false;
    }
  }

  persistData() {
    this.listIsPristine = false;
    this.shipStoresService.setDataIsPristine(false);

    this.portCallShipStoresModel.portCallId = this.portCallId;

    // Add sequence number for model to be submitted
    if (this.portCallShipStoresList.length > 0) {
      this.portCallShipStoresModel.sequenceNumber = this.portCallShipStoresList[this.portCallShipStoresList.length - 1].sequenceNumber + 1;
    } else {
      this.portCallShipStoresModel.sequenceNumber = 1;
    }

    // Add this ship store to local model and create new model
    this.portCallShipStoresList.push(this.portCallShipStoresModel);
    this.portCallShipStoresModel = new PortCallShipStoresModel();
    this.selectedMeasurementType = null;

    // Update value in service
    this.shipStoresService.setShipStoresInformationData(
      this.portCallShipStoresList
    );
  }

  isValid(valid: boolean): boolean {
    this.sendMetaData();
    return valid;
  }

  private sendMetaData(): void {
    this.shipStoresService.setShipStoresInformationMeta({ valid: this.form.valid });
  }

}
