import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/shared/components/confirmation-modal/confirmation-modal.component';
import { CONTENT_NAMES } from 'app/shared/constants/content-names';
import { FormMetaData } from 'app/shared/interfaces/form-meta-data.interface';
import { PortCallDetailsModel } from 'app/shared/models/port-call-details-model';
import { ContentService } from 'app/shared/services/content.service';
import { PortCallService } from 'app/shared/services/port-call.service';
import { PrevAndNextPocService } from 'app/shared/services/prev-and-next-poc.service';
import { LocationModel } from 'app/shared/models/location-model';
import { DateTime } from 'app/shared/interfaces/dateTime.interface';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { Subscription } from 'rxjs/Subscription';

const RESULT_SUCCES = 'This port call has been activated, and is now awaiting clearance.';
const RESULT_FAILURE = 'There was a problem when trying to activate this port call. Please try again later.';

@Component({
  selector: 'app-activate-port-call',
  templateUrl: './activate-port-call.component.html',
  styleUrls: ['./activate-port-call.component.css']
})
export class ActivatePortCallComponent implements OnInit, OnDestroy {
  prevAndNextPortCallDataIsPristine = true;

  detailsDataIsPristine = true;
  detailsIdentificationModel: any;
  crewPassengersAndDimensionsModel: any;
  purposeModel: any;
  reportingModel: any;
  otherPurposeName = '';
  detailsMeta: FormMetaData;
  detailsModel: PortCallDetailsModel = new PortCallDetailsModel();

  prevLocationModel: LocationModel;
  nextLocationModel: LocationModel;
  etdModel: DateTime = null;
  etaModel: DateTime = null;
  portCallId: number;

  portCallStatus: string;
  portCallIsActive = false;
  portCallIsDraft = false;
  STATUS_ACTIVE = 'Active';
  STATUS_DRAFT = 'Draft';

  dataIsPristineSubscription: Subscription;
  prevPortOfCallDataSubscription: Subscription;
  nextPortOfCallDataSubscription: Subscription;
  prevPortOfCallEtdSubscription: Subscription;
  nextPortOfCallEtaSubscription: Subscription;
  detailsPristineSubscription: Subscription;
  detailsIdentificationSubscription: Subscription;
  crewPassengersAndDimensionsDataSubscription: Subscription;
  reportingForThisPortCallDataSubscription: Subscription;
  portCallPurposeDataSubscription: Subscription;
  otherPurposeNameSubscription: Subscription;
  crewPassengersAndDimensionsMetaSubscription: Subscription;
  portCallStatusDataSubscription: Subscription;

  constructor(
    private contentService: ContentService,
    private portCallService: PortCallService,
    private prevAndNextPocService: PrevAndNextPocService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.dataIsPristineSubscription = this.prevAndNextPocService.dataIsPristine$.subscribe(
      pristineData => {
        this.prevAndNextPortCallDataIsPristine = pristineData;
      }
    );
    this.prevPortOfCallDataSubscription = this.prevAndNextPocService.prevPortOfCallData$.subscribe(
      prevLocationData => {
        this.prevLocationModel = prevLocationData;
      }
    );
    this.nextPortOfCallDataSubscription = this.prevAndNextPocService.nextPortOfCallData$.subscribe(
      nextLocationData => {
        this.nextLocationModel = nextLocationData;
      }
    );
    this.prevPortOfCallEtdSubscription = this.prevAndNextPocService.prevPortOfCallEtdData$.subscribe(
      etdData => {
        if (etdData) {
          this.etdModel = {
            date: new NgbDate(etdData.getFullYear(), etdData.getMonth() + 1, etdData.getDate()),
            time: new NgbTime(etdData.getHours(), etdData.getMinutes(), 0)
          };
        } else {
          this.etdModel = null;
        }
      }
    );
    this.nextPortOfCallEtaSubscription = this.prevAndNextPocService.nextPortOfCallEtaData$.subscribe(
      etaData => {
        if (etaData) {
          this.etaModel = {
            date: new NgbDate(etaData.getFullYear(), etaData.getMonth() + 1, etaData.getDate()),
            time: new NgbTime(etaData.getHours(), etaData.getMinutes(), 0)
          };
        } else {
          this.etaModel = null;
        }
      }
    );
    this.detailsPristineSubscription = this.portCallService.detailsPristine$.subscribe(detailsDataIsPristine => {
      this.detailsDataIsPristine = detailsDataIsPristine;
    });
    this.detailsIdentificationSubscription = this.portCallService.detailsIdentificationData$.subscribe(
      detailsIdentificationData => {
        if (detailsIdentificationData) {
          this.detailsIdentificationModel = detailsIdentificationData;
          this.portCallId = detailsIdentificationData.portCallId;
        }
      }
    );
    this.crewPassengersAndDimensionsDataSubscription = this.portCallService.crewPassengersAndDimensionsData$.subscribe(
      cpadData => {
        if (cpadData) {
          this.crewPassengersAndDimensionsModel = cpadData;
        }
      }
    );
    this.reportingForThisPortCallDataSubscription = this.portCallService.reportingForThisPortCallData$.subscribe(
      reportingData => {
        if (reportingData) {
          this.reportingModel = reportingData;
        }
      }
    );
    this.portCallPurposeDataSubscription = this.portCallService.portCallPurposeData$.subscribe(purposeData => {
      if (purposeData) {
        this.purposeModel = purposeData;
      }
    });
    this.otherPurposeNameSubscription = this.portCallService.otherPurposeName$.subscribe(otherPurposeNameData => {
      if (otherPurposeNameData) {
        this.otherPurposeName = otherPurposeNameData;
      }
    });
    this.crewPassengersAndDimensionsMetaSubscription = this.portCallService.crewPassengersAndDimensionsMeta$.subscribe(
      metaData => {
        this.detailsMeta = metaData;
      }
    );
    this.portCallStatusDataSubscription = this.portCallService.portCallStatusData$.subscribe(statusData => {
      if (statusData) {
        if (statusData === this.STATUS_DRAFT) {
          this.portCallIsDraft = true;
        } else {
          this.portCallIsDraft = false;
        }
        this.portCallStatus = statusData;
      }
    });
  }

  ngOnDestroy() {
    this.dataIsPristineSubscription.unsubscribe();
    this.prevPortOfCallDataSubscription.unsubscribe();
    this.nextPortOfCallDataSubscription.unsubscribe();
    this.prevPortOfCallEtdSubscription.unsubscribe();
    this.nextPortOfCallEtaSubscription.unsubscribe();
    this.detailsPristineSubscription.unsubscribe();
    this.detailsIdentificationSubscription.unsubscribe();
    this.crewPassengersAndDimensionsDataSubscription.unsubscribe();
    this.reportingForThisPortCallDataSubscription.unsubscribe();
    this.portCallPurposeDataSubscription.unsubscribe();
    this.otherPurposeNameSubscription.unsubscribe();
    this.crewPassengersAndDimensionsMetaSubscription.unsubscribe();
    this.portCallStatusDataSubscription.unsubscribe();
  }

  savePrevAndNextPortCall() {
    const prevDate = new Date(this.etdModel.date.year, this.etdModel.date.month - 1, this.etdModel.date.day, this.etdModel.time.hour, this.etdModel.time.minute);
    const nextDate = new Date(this.etaModel.date.year, this.etaModel.date.month - 1, this.etaModel.date.day, this.etaModel.time.hour, this.etaModel.time.minute);
    this.portCallService.savePrevAndNextPortCall(this.portCallId, this.prevLocationModel, this.nextLocationModel, prevDate, nextDate);
  }

  saveDetails() {
    this.detailsModel.portCallDetailsId = this.detailsIdentificationModel.portCallDetailsId;
    this.detailsModel.portCallId = this.detailsIdentificationModel.portCallId;
    this.detailsModel.numberOfCrew = this.crewPassengersAndDimensionsModel.numberOfCrew;
    this.detailsModel.numberOfPassengers = this.crewPassengersAndDimensionsModel.numberOfPassengers;
    this.detailsModel.airDraught = this.crewPassengersAndDimensionsModel.airDraught;
    this.detailsModel.actualDraught = this.crewPassengersAndDimensionsModel.actualDraught;
    this.detailsModel.reportingCargo = this.reportingModel.reportingCargo;
    this.detailsModel.reportingCrew = this.reportingModel.reportingCrew;
    this.detailsModel.reportingDpg = this.reportingModel.reportingDpg;
    this.detailsModel.reportingPax = this.reportingModel.reportingPax;
    this.detailsModel.reportingShipStores = this.reportingModel.reportingShipStores;
    this.portCallService.saveDetails(
      this.detailsModel,
      this.purposeModel,
      this.otherPurposeName
    );
    console.log(
      'META: ',
      this.detailsMeta.valid,
      '\nPRISTINE: ',
      this.detailsDataIsPristine
    );
  }

  send() {
    this.portCallService
      .updatePortCallStatusActive(this.detailsIdentificationModel.portCallId)
      .subscribe(
        updateStatusResponse => {
          console.log('Status successfully updated.');
          this.openConfirmationModal(
            ConfirmationModalComponent.TYPE_SUCCESS,
            RESULT_SUCCES
          );
        },
        error => {
          console.log(error);
          this.openConfirmationModal(
            ConfirmationModalComponent.TYPE_FAILURE,
            RESULT_FAILURE
          );
        }
      );
  }

  goBack() {
    this.contentService.setContent(CONTENT_NAMES.VIEW_PORT_CALLS);
  }

  private openConfirmationModal(modalType: string, bodyText: string) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.modalType = modalType;
    modalRef.componentInstance.bodyText = bodyText;
    modalRef.result.then(
      result => {
        if (modalType !== ConfirmationModalComponent.TYPE_FAILURE) {
          this.goBack();
        }
      },
      reason => {
        if (modalType !== ConfirmationModalComponent.TYPE_FAILURE) {
          this.goBack();
        }
      }
    );
  }
}
