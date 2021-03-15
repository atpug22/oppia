// Copyright 2021 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the graph-viz.
 *
 * IMPORTANT NOTE: The naming convention for customization args that are passed
 * into the directive is: the name of the parameter, followed by 'With',
 * followed by the name of the arg.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphVizComponent } from './graph-viz.component';
import { GraphAnswer } from 'interactions/answer-defs';
import { InteractionsExtensionsConstants } from 'interactions/interactions-extension.constants';
import { PlayerPositionService } from 'pages/exploration-player-page/services/player-position.service';
import { Subscription } from 'rxjs';
import { DeviceInfoService } from 'services/contextual/device-info.service';
import { FocusManagerService } from 'services/stateful/focus-manager.service';
import { UtilsService } from 'services/utils.service';
import { EdgeCentre, GraphDetailService } from './graph-detail.service';
import { ElementRef } from '@angular/core';

interface GraphButton {
    text: string;
    description: string;
    mode: number
  }
  
  interface GraphOption {
    text: string;
    option: string;
  }

describe('GraphVizComponent', () => {
  let component: GraphVizComponent;
  let fixture: ComponentFixture<GraphVizComponent>;
  let interactionsExtensionsConstants: InteractionsExtensionsConstants;
  let playerPositionService: PlayerPositionService;
  let deviceInfoService: DeviceInfoService;
  let focusManagerService: FocusManagerService;
  let utilsService: UtilsService;
  let edgeCentre: EdgeCentre;
  let graphDetailService: GraphDetailService;
  let element: ElementRef;
  let graph: GraphAnswer;
  let canAddVertex: boolean;
  let canDeleteVertex: boolean;
  let canMoveVertex: boolean;
  let canEditVertexLabel: boolean;
  let canAddEdge: boolean;
  let canDeleteEdge: boolean;
  let canEditEdgeWeight: boolean;
  let interactionIsActive: boolean;
  let canEditOptions: boolean;
  let isMobile: boolean = false;
  let helpText: string = '';
  let _MODES = {
    MOVE: 0,
    ADD_EDGE: 1,
    ADD_VERTEX: 2,
    DELETE: 3
  };
  // Styling functions.
  let DELETE_COLOR = 'red';
  let HOVER_COLOR = 'aqua';
  let SELECT_COLOR = 'orange';
  let DEFAULT_COLOR = 'black';
  let state = {
    currentMode: _MODES.MOVE,
    // Vertex, edge, mode button, label currently being hovered over.
    hoveredVertex: null,
    hoveredEdge: null,
    hoveredModeButton: null,
    // If in ADD_EDGE mode, source vertex of the new edge, if it
    // exists.
    addEdgeVertex: null,
    // Currently dragged vertex.
    currentlyDraggedVertex: null,
    // Selected vertex for editing label.
    selectedVertex: null,
    // Selected edge for editing weight.
    selectedEdge: null,
    // Mouse position in SVG coordinates.
    mouseX: 0,
    mouseY: 0,
    // Original position of dragged vertex.
    vertexDragStartX: 0,
    vertexDragStartY: 0,
    // Original position of mouse when dragging started.
    mouseDragStartX: 0,
    mouseDragStartY: 0
  };
  let componentSubscriptions: Subscription = new Subscription();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphVizComponent],
      providers: [UtilsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    playerPositionService = TestBed.inject(PlayerPositionService);
    deviceInfoService = TestBed.inject(DeviceInfoService);
    focusManagerService = TestBed.inject(FocusManagerService);
    utilsService = TestBed.inject(UtilsService);
    element = TestBed.inject(ElementRef);
    graphDetailService = TestBed.inject(GraphDetailService);
    interactionsExtensionsConstants = TestBed.inject(
      InteractionsExtensionsConstants);
  });

  // eslint-disable-next-line max-len
  it('should successfully instantiate the component from beforeEach block', () => {
    expect(component).toBeDefined();
  });

  it('should set component properties when ngOnInit() is called', () => {
    component.ngOnInit();
    spyOn(componentSubscriptions, 'add').and.callThrough;
    expect(componentSubscriptions.add()).toHaveBeenCalled;
    expect(component.state.currentMode).toBe(null);
    expect(component.VERTEX_RADIUS).toBe(6);
    expect(component.EDGE_WIDTH).toBe(3);
    expect(component.selectedEdgeWeightValue).toBe(0);
    expect(component.shouldShowWrongWeightWarning).toBe(false);
    expect(component.isMobile).toBe(false);
    spyOn(deviceInfoService, 'isMobileDevice').and.callThrough;
    expect(deviceInfoService.isMobileDevice()).toHaveBeenCalled;
  });

  it('should set component properties when ngAfterViewInit() is called', () => {
    component.ngAfterViewInit();
    spyOn(element.nativeElement, 'querySelectorAll').and.callThrough;
    expect(element.nativeElement.querySelectorAll()).toHaveBeenCalled;
  });

  it('should return an edge color', () => {
    component.interactionIsActive = false;
    c
  });
});
