// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Service for detecting spamming behavior from the learner.
 */

// require(
//   'components/common-layout-directives/common-elements/' +
//   'confirm-or-cancel-modal.controller.ts');

// angular.module('oppia').factory('FatigueDetectionService', [
//   '$uibModal', function($uibModal) {
//     // 4 submissions in under 10 seconds triggers modal.
//     var SPAM_COUNT_THRESHOLD = 4;
//     var SPAM_WINDOW_MSEC = 10000;
//     var submissionTimesMsec = [];

//     return {
//       recordSubmissionTimestamp: function() {
//         submissionTimesMsec.push((new Date()).getTime());
//       },
//       isSubmittingTooFast: function() {
//         if (submissionTimesMsec.length >= SPAM_COUNT_THRESHOLD) {
//           var windowStartTime = submissionTimesMsec.shift();
//           var windowEndTime =
//             submissionTimesMsec[submissionTimesMsec.length - 1];
//           if (windowEndTime - windowStartTime < SPAM_WINDOW_MSEC) {
//             return true;
//           }
//         }
//         return false;
//       },
//       displayTakeBreakMessage: function() {
//         $uibModal.open({
//           template: require(
//             'pages/exploration-player-page/templates/' +
//             'take-break-modal.template.html'),
//           backdrop: 'static',
//           resolve: {},
//           controller: 'ConfirmOrCancelModalController'
//         }).result.then(function() {}, function() {
//           // Note to developers:
//           // This callback is triggered when the Cancel button is clicked.
//           // No further action is needed.
//         });
//       },
//       reset: function() {
//         submissionTimesMsec = [];
//       }
//     };
//   }]);

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})

export class FatigueDetectionService {
  private submissionTimesMsec: number[] = [];
  private SPAM_COUNT_THRESHOLD: number = 4;
  private SPAM_WINDOW_MSEC: number = 10000;
  private windowStartTime: number;
  private windowEndTime: number;

  constructor(private ngbModal: NgbModal) { }

  recordSubmissionTimestamp(): void {
    this.submissionTimesMsec.push((new Date()).getTime());
  }
  isSubmittingTooFast(): boolean {
    if (this.submissionTimesMsec.length >= this.SPAM_COUNT_THRESHOLD) {
      this.windowStartTime = this.submissionTimesMsec.shift();
      this.windowEndTime =
        this.submissionTimesMsec[this.submissionTimesMsec.length - 1];
      if (this.windowEndTime.valueOf() - this.windowStartTime.valueOf() <
         this.SPAM_WINDOW_MSEC) {
        return true;
      }
    }
    return false;
  }

  displayTakeBreakMessage(): void {
    this.ngbModal.open(
      'pages/exploration-player-page/templates/take-break-modal.template.html',
      {
        backdrop: 'static'
      }).result.then(() => { }, () => {
      // Note to developers:
      // This callback is triggered when the Cancel button is clicked.
      // No further action is needed.
    });
  }

  reset(): void {
    this.submissionTimesMsec = [];
  }
}

angular.module('oppia').factory(
  'FatigueDetectionService',
  downgradeInjectable(FatigueDetectionService));
