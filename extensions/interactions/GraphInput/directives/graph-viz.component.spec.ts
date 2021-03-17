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
import { InteractionsExtensionsConstants } from 'interactions/interactions-extension.constants';
import { PlayerPositionService } from 'pages/exploration-player-page/services/player-position.service';
import { Subscription } from 'rxjs';
import { DeviceInfoService } from 'services/contextual/device-info.service';
import { FocusManagerService } from 'services/stateful/focus-manager.service';
import { UtilsService } from 'services/utils.service';
import { EdgeCentre, GraphDetailService } from './graph-detail.service';
import { ElementRef } from '@angular/core';

describe('GraphVizComponent', () => {
  let component: GraphVizComponent;
  let fixture: ComponentFixture<GraphVizComponent>;
  let interactionsExtensionsConstants: InteractionsExtensionsConstants;
  let playerPositionService: PlayerPositionService;
  let deviceInfoService: DeviceInfoService;
  let focusManagerService: FocusManagerService;
  let utilsService: UtilsService;
  let graphDetailService: GraphDetailService;
  let element: ElementRef;
  let DELETE_COLOR = 'red';
  let HOVER_COLOR = 'aqua';
  let SELECT_COLOR = 'orange';
  let DEFAULT_COLOR = 'black';
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

  it('should return black color if interaction is not active', () => {
    component.interactionIsActive = false;
    expect(component.getEdgeColor(1)).toEqual(DEFAULT_COLOR);
  });

  it('should return red color if current mode is delete mode', () => {
    component.canDeleteEdge = true;
    component.state.currentMode = 3;
    component.state.hoveredEdge = 1;
    expect(component.getEdgeColor(1)).toEqual(DELETE_COLOR);
  });

  it('should return aqua color on hovering over edge', () => {
    component.state.hoveredEdge = 1;
    expect(component.getEdgeColor(1)).toEqual(HOVER_COLOR);
  });

  it('should return orange color if edge is selected', () => {
    component.state.selectedEdge = 1;
    expect(component.getEdgeColor(1)).toEqual(SELECT_COLOR);
  });

  it('should return black color in default case', () => {
    expect(component.getEdgeColor(1)).toEqual(DEFAULT_COLOR);
  });

  it('should return black color if interaction is not active', () => {
    component.interactionIsActive = false;
    expect(component.getVertexColor(1)).toEqual(DEFAULT_COLOR);
  });

  it('should return red color if current mode is delete mode', () => {
    component.canDeleteVertex = true;
    component.state.currentMode = 3;
    component.state.hoveredVertex = 1;
    expect(component.getVertexColor(1)).toEqual(DELETE_COLOR);
  });

  it('should return aqua color on dragging the vertex', () => {
    component.state.currentlyDraggedVertex = 1;
    expect(component.getVertexColor(1)).toEqual(HOVER_COLOR);
  });

  it('should return aqua color on hovering over vertex', () => {
    component.state.hoveredVertex = 1;
    expect(component.getVertexColor(1)).toEqual(HOVER_COLOR);
  });

  it('should return orange color if Vertex is selected', () => {
    component.state.selectedVertex = 1;
    expect(component.getVertexColor(1)).toEqual(SELECT_COLOR);
  });

  it('should return black color in default case', () => {
    expect(component.getVertexColor(1)).toEqual(DEFAULT_COLOR);
  });

  it('should get directed edge Arrow points', () => {
    component.graph = { vertices: [{
      x: 1.0,
      y: 1.0,
      label: 'a'
    }, {
      x: 4.0,
      y: 5.0,
      label: 'b'
    }],
    edges: [{
      src: 0,
      dst: 1,
      weight: 1
    }],
    isDirected: true,
    isWeighted: true,
    isLabeled: true
    };
    let arrowPoints = component.getDirectedEdgeArrowPoints(0);
    expect(arrowPoints).toBe('');
  });

  it('should mouse move graph svg', () => {
    component.mousemoveGraphSVG('click');
  });

  it('should add vertices to graph', () => {
    component.state.currentMode = 2;
    component.canAddVertex = true;
    component.state.mouseX = 1;
    component.state.mouseY = 1;
    component.onClickGraphSVG();
    expect(component.graph).toBe({vertices: [{
      x: 1,
      y: 1,
      label: ''
    }]});
    expect(component.state.selectedVertex).toBe(null);
    expect(component.state.selectedVertex).toBe(null);
  });

  it('should set component properties when initButtons() is called', () => {
    component.canMoveVertex = true;
    component.canAddEdge = true;
    component.canAddVertex = true;
    component.canDeleteVertex = true;
    component.canDeleteEdge = true;
    component.initButtons();
    expect(component.buttons).toBe([{
      text: '\uF0B2',
      description: 'I18N_INTERACTIONS_GRAPH_MOVE',
      mode: 0
    }, {
      text: '\uF0C1',
      description: 'I18N_INTERACTIONS_GRAPH_ADD_EDGE',
      mode: 1
    }, {
      text: '\uF067',
      description: 'I18N_INTERACTIONS_GRAPH_ADD_NODE',
      mode: 2
    }, {
      text: '\uF068',
      description: 'I18N_INTERACTIONS_GRAPH_DELETE',
      mode: 3
    }
    ]);
  });

  it('should set helptext in case of mobile device', () => {
    component.canMoveVertex = true;
    component.canAddEdge = true;
    component.canAddVertex = true;
    component.canDeleteVertex = true;
    component.canDeleteEdge = true;
    component.state.currentMode = 1;
    component.isMobile = true;
    component.init();
    expect(component.state.currentMode).toBe(0);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_EDGE_INITIAL_HELPTEXT');
    component.state.currentMode = null;
    component.state.currentMode = 0;
    component.init();
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_MOVE_INITIAL_HELPTEXT');
    component.state.currentMode = null;
    component.init();
    expect(component.helpText).toBe('');
  });

  it('should show helptext in case of mobile device', () => {
    component.canMoveVertex = true;
    component.canAddEdge = true;
    component.canAddVertex = true;
    component.canDeleteVertex = true;
    component.canDeleteEdge = true;
    component.state.currentMode = 1;
    component.init();
    expect(component.state.currentMode).toBe(0);
    expect(component.helpText).toBe('');
  });

  it('should toggle graph option', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }, {
        x: 3.0,
        y: 3.0,
        label: 'c'
      }],
      edges: [{
        src: 0,
        dst: 1,
        weight: 1
      }, {
        src: 1,
        dst: 2,
        weight: 2
      }, {
        src: 2,
        dst: 1,
        weight: 2
      }],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.toggleGraphOption('isDirected');
    expect(component.graph.edges).toBe([{
      src: 0,
      dst: 1,
      weight: 1
    }, {
      src: 1,
      dst: 2,
      weight: 2
    }]);
    expect(component.graph.isDirected).toBe(false);
    component.toggleGraphOption('isWeighted');
    expect(component.graph.isWeighted).toBe(false);
    component.toggleGraphOption('isLabeled');
    expect(component.graph.isLabeled).toBe(false);
  });

  // eslint-disable-next-line max-len
  it('should set current mode to ADD EDGE mode with helptext in mobile device', () => {
    component.isMobile = true;
    component.setMode(1);
    expect(component.state.currentMode).toBe(1);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_EDGE_INITIAL_HELPTEXT');
    expect(component.state.addEdgeVertex).toBe(null);
    expect(component.state.selectedVertex).toBe(null);
    expect(component.state.selectedEdge).toBe(null);
    expect(component.state.currentlyDraggedVertex).toBe(null);
    expect(component.state.hoveredVertex).toBe(null);
  });

  // eslint-disable-next-line max-len
  it('should set current mode to MOVE mode with helptext in mobile device', () => {
    component.isMobile = true;
    component.setMode(0);
    expect(component.state.currentMode).toBe(0);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_MOVE_INITIAL_HELPTEXT');
    expect(component.state.addEdgeVertex).toBe(null);
    expect(component.state.selectedVertex).toBe(null);
    expect(component.state.selectedEdge).toBe(null);
    expect(component.state.currentlyDraggedVertex).toBe(null);
    expect(component.state.hoveredVertex).toBe(null);
  });

  // eslint-disable-next-line max-len
  it('should set current mode to ADD VERTEX mode without helptext in mobile device', () => {
    component.isMobile = true;
    component.setMode(2);
    expect(component.state.currentMode).toBe(2);
    expect(component.helpText).toBe(null);
    expect(component.state.addEdgeVertex).toBe(null);
    expect(component.state.selectedVertex).toBe(null);
    expect(component.state.selectedEdge).toBe(null);
    expect(component.state.currentlyDraggedVertex).toBe(null);
    expect(component.state.hoveredVertex).toBe(null);
  });

  it('should set current mode in non-mobile device', () => {
    component.isMobile = false;
    component.setMode(1);
    expect(component.state.currentMode).toBe(1);
    expect(component.helpText).toBe(null);
    expect(component.state.addEdgeVertex).toBe(null);
    expect(component.state.selectedVertex).toBe(null);
    expect(component.state.selectedEdge).toBe(null);
    expect(component.state.currentlyDraggedVertex).toBe(null);
    expect(component.state.hoveredVertex).toBe(null);
  });

  it('should activate mode on clicking on mode', () => {
    component.onClickModeButton(1, {});
    component.interactionIsActive = true;
    expect(component.state.currentMode).toBe(1);
  });

  it('should delete vertex on click', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [{
        src: 0,
        dst: 1,
        weight: 1
      }],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.state.currentMode = 3;
    component.onClickVertex(1);
    expect(component.graph).toBe({
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    });
    expect(component.state.hoveredVertex).toBe(null);
  });

  it('should begin edit vertex label on selecting vertex', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [{
        src: 0,
        dst: 1,
        weight: 1
      }],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.state.currentMode = 2;
    component.canEditVertexLabel = true;
    component.onClickVertex(1);
    expect(component.state.selectedVertex).toBe(1);
    spyOn(focusManagerService, 'setFocus').and.callThrough();
    expect(focusManagerService.setFocus).toHaveBeenCalledWith(
      'vertexLabelEditBegun');
  });

  it('should begin add edge on selecting vertex in Mobile Devices', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.isMobile = true;
    component.state.currentMode = 1;
    component.canAddEdge = true;
    component.onClickVertex(1);
    expect(component.state.addEdgeVertex).toBe(1);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_EDGE_FINAL_HELPTEXT');
  });

  it('should begin move vertex in Mobile Devices', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.isMobile = true;
    component.state.currentMode = 0;
    component.canMoveVertex = true;
    component.onClickVertex(0);
    expect(component.state.currentlyDraggedVertex).toBe(0);
    expect(component.state.vertexDragStartX).toBe(1);
    expect(component.state.vertexDragStartY).toBe(1);
    expect(component.state.mouseDragStartX).toBe(2);
    expect(component.state.mouseDragStartY).toBe(2);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_MOVE_FINAL_HELPTEXT');
  });

  it('should not add edge if final vertex equals initial vertex', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.isMobile = true;
    component.state.addEdgeVertex = 1;
    component.state.currentlyDraggedVertex = 1;
    component.state.currentMode = 1;
    component.onClickVertex(1);
    expect(component.state.hoveredVertex).toBe(null);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_EDGE_INITIAL_HELPTEXT');
    expect(component.state.addEdgeVertex).toBe(null);
  });

  it('should add edge if final vertex is given', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.isMobile = true;
    component.state.addEdgeVertex = 1;
    component.state.currentMode = 1;
    component.onClickVertex(0);
    expect(component.graph.edges).toBe([{
      src: 1,
      dst: 0,
      weight: 1 }]);
    expect(component.state.hoveredVertex).toBe(null);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_EDGE_INITIAL_HELPTEXT');
    expect(component.state.addEdgeVertex).toBe(null);
  });

  it('should move vertex when dragged in mobile devices', () => {
    component.graph = {
      vertices: [{
        x: 1.0,
        y: 1.0,
        label: 'a'
      }, {
        x: 2.0,
        y: 2.0,
        label: 'b'
      }],
      edges: [],
      isDirected: true,
      isWeighted: true,
      isLabeled: true
    };
    component.isMobile = true;
    component.state.currentlyDraggedVertex = 1;
    component.state.currentMode = 0;
    component.state.mouseX = 3;
    component.state.mouseY = 3;
    component.state.vertexDragStartX = 2;
    component.state.vertexDragStartY = 2;
    component.state.mouseDragStartX = 2;
    component.state.mouseDragStartY = 2;
    component.onClickVertex(1);
    expect(component.state.currentlyDraggedVertex).toBe(null);
    expect(component.state.vertexDragStartX).toBe(0);
    expect(component.state.vertexDragStartY).toBe(0);
    expect(component.state.mouseDragStartX).toBe(0);
    expect(component.state.mouseDragStartY).toBe(0);
    expect(component.state.hoveredVertex).toBe(null);
    expect(component.helpText).toBe(
      'I18N_INTERACTIONS_GRAPH_MOVE_INITIAL_HELPTEXT');
  });

  
});
