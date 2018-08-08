import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from 'app/shared/services/content.service';
import { PortCallService } from 'app/shared/services/port-call.service';
import { PrevAndNextPocService } from 'app/shared/services/prev-and-next-poc.service';
import { FalShipStoresService } from 'app/shared/services/fal-ship-stores.service';
import { FORM_NAMES } from 'app/shared/constants/form-names';
import { Subscription } from 'rxjs/Subscription';
import { PortCallDetailsService } from 'app/shared/services/port-call-details.service';
import { FalCargoService } from '../../../../../shared/services/fal-cargo.service';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  formNames = FORM_NAMES;

  iconPath = 'assets/images/icons/128x128/white/';
  baseMenuEntries: any[] = [
    {
      name: this.formNames.PREV_AND_NEXT_POC,
      icon: 'voyage.png',
      checked: true,
      hasError: false,
      hasUnsavedData: false
    },
    {
      name: this.formNames.PORT_CALL_DETAILS,
      icon: 'verification-clipboard.png',
      checked: true,
      hasError: false,
      hasUnsavedData: false
    }
  ];
  finalMenuEntries: any[] = [
    {
      name: this.formNames.CONFIRM_PORT_CALL,
      icon: 'checkmark.png',
      checked: true,
      hasError: false,
      hasUnsavedData: false
    }
  ];

  menuEntries: any[];

  selectedPortCallForm: string;

  reportingForThisPortCallDataSubscription: Subscription;
  portCallFormNameSubscription: Subscription;
  crewPassengersAndDimensionsMetaSubscription: Subscription;
  voyagesDataIsPristineSubscription: Subscription;
  voyagesMetaSubscription: Subscription;
  portCallDetailsPristineSubscription: Subscription;
  shipStoresDataIsPristineSubscription: Subscription;
  cargoDataIsPristineSubscription: Subscription;

  constructor(
    private portCallService: PortCallService,
    private portCallDetailsService: PortCallDetailsService,
    private prevAndNextPortCallService: PrevAndNextPocService,
    private contentService: ContentService,
    private shipStoresService: FalShipStoresService,
    private cargoService: FalCargoService
  ) { }

  ngOnInit() {
    this.menuEntries = this.baseMenuEntries.concat(this.finalMenuEntries);

    this.reportingForThisPortCallDataSubscription = this.portCallDetailsService.reportingForThisPortCallData$.subscribe(
      reportingData => {
        if (reportingData != null) {
          const falForms = [
            {
              name: this.formNames.DPG,
              icon: 'hazard.png',
              checked: reportingData.reportingDpg || false,
              hasError: false,
              hasUnsavedData: false
            },
            {
              name: this.formNames.CARGO,
              icon: 'cargo.png',
              checked: reportingData.reportingCargo || false,
              hasError: false,
              hasUnsavedData: false
            },
            {
              name: this.formNames.SHIP_STORES,
              icon: 'alcohol.png',
              checked: reportingData.reportingShipStores || false,
              hasError: false,
              hasUnsavedData: false
            },
            {
              name: this.formNames.CREW,
              icon: 'crew.png',
              checked: reportingData.reportingCrew || false,
              hasError: false,
              hasUnsavedData: false
            },
            {
              name: this.formNames.PAX,
              icon: 'pax.png',
              checked: reportingData.reportingPax || false,
              hasError: false,
              hasUnsavedData: false
            }
          ];
          this.menuEntries = this.baseMenuEntries
            .concat(falForms)
            .concat(this.finalMenuEntries);

          // Set checked in services for FAL forms
          this.shipStoresService.setCheckedInProgressBar(reportingData.reportingShipStores);
        }
      }
    );

    this.portCallFormNameSubscription = this.contentService.portCallFormName$.subscribe(
      portCallFormName => {
        this.selectedPortCallForm = portCallFormName;
      }
    );

    this.crewPassengersAndDimensionsMetaSubscription = this.portCallDetailsService.crewPassengersAndDimensionsMeta$.subscribe(
      metaData => {
        this.menuEntries.find(
          p => p.name === this.formNames.PORT_CALL_DETAILS
        ).hasError = !metaData.valid;
      }
    );

    this.voyagesDataIsPristineSubscription = this.prevAndNextPortCallService.dataIsPristine$.subscribe(
      pristineData => {
        this.menuEntries.find(
          p => p.name === this.formNames.PREV_AND_NEXT_POC
        ).hasUnsavedData = !pristineData;
      }
    );

    this.voyagesMetaSubscription = this.prevAndNextPortCallService.prevAndNextPortOfCallMeta$.subscribe(
      metaData => {
        this.menuEntries.find(
          p => p.name === this.formNames.PREV_AND_NEXT_POC
        ).hasError = !metaData.valid;
      }
    );

    this.portCallDetailsPristineSubscription = this.portCallDetailsService.detailsPristine$.subscribe(
      detailsDataIsPristine => {
        this.menuEntries.find(
          p => p.name === this.formNames.PORT_CALL_DETAILS
        ).hasUnsavedData = !detailsDataIsPristine;
      }
    );

    this.shipStoresDataIsPristineSubscription = this.shipStoresService.dataIsPristine$.subscribe(shipStoresDataIsPristine => {
      const shipStores = this.menuEntries.find(
        p => p.name === this.formNames.SHIP_STORES
      );
      if (shipStores) {
        shipStores.hasUnsavedData = !shipStoresDataIsPristine;
      }
    });

    this.cargoDataIsPristineSubscription = this.cargoService.dataIsPristine$.subscribe(
      cargoDataIsPristine => {
        const cargo = this.menuEntries.find(
          p => p.name === this.formNames.CARGO
        );
        if (cargo) {
          cargo.hasUnsavedData = !cargoDataIsPristine;
        }
      }
    );
  }

  ngOnDestroy() {
    this.reportingForThisPortCallDataSubscription.unsubscribe();
    this.portCallFormNameSubscription.unsubscribe();
    this.crewPassengersAndDimensionsMetaSubscription.unsubscribe();
    this.voyagesDataIsPristineSubscription.unsubscribe();
    this.portCallDetailsPristineSubscription.unsubscribe();
    this.shipStoresDataIsPristineSubscription.unsubscribe();
    this.cargoDataIsPristineSubscription.unsubscribe();
  }

  setPortCallForm(contentName: string) {
    this.contentService.setPortCallForm(contentName);
  }
}
