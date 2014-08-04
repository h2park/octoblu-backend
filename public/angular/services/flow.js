'use strict';
angular.module('octobluApp')
    .service('FlowService', function ($http, $q) {
        var service = this;

        this.designerToFlows = function (designerNodes) {
            var workspaces = _.where(designerNodes, {type: 'tab'});

            return _.map(workspaces, function (workspace) {
                return {
                    id: workspace.id,
                    name: workspace.label,
                    nodes: service.extractNodesByWorkspaceId(designerNodes, workspace.id),
                    links: service.extractLinksByWorkspaceId(designerNodes, workspace.id)
                };
            });
        };

        this.extractNodesByWorkspaceId = function (designerNodes, workspaceId) {
            var justNodes = _.where(designerNodes, {z: workspaceId});

            return _.map(justNodes, function (designerNode) {
                return _.omit(designerNode, 'z', 'wires');
            });
        };

        this.extractLinksByWorkspaceId = function (designerNodes, workspaceId) {
            var workspaceNodes = _.where(designerNodes, {z: workspaceId});

            var links = [];
            _.each(workspaceNodes, function (workspaceNode) {
                _.each(_.first(workspaceNode.wires), function (wire) {
                    links.push({from: workspaceNode.id, to: wire});
                });
            });
            return links;
        };

        this.saveAllFlows = function (designerNodes) {
            var flows, promises;

            flows = service.designerToFlows(designerNodes);

            promises = _.map(flows, function (flow) {
                return $http.put("/api/flows/" + flow.id, flow);
            });

            return $q.all(promises);
        };

        this.saveAllFlowsAndDeploy = function (designerNodes) {
            return service.saveAllFlows(designerNodes).then(function () {
                return $http.post("/api/flow_deploys");
            });
        };

        this.getAllFlows = function () {
            var defer = $q.defer();
            defer.resolve(
                [
                    {
                        name: 'Flow 1',
                        nodes: [
                            {
                                "id": "7b8f181f.8470e8",
                                "type": "inject",
                                "name" : "Inject Node",
                                "x": 440.8888854980469,
                                "y": 181.88888549804688,
                                "z": "9eb9aa60.614658"
                            },
                            {
                                "id": "d71fffc9.28e",
                                "type": "debug",
                                "name": "Wait a sec",
                                "phoneNumber": "aasdsadsad",
                                "plivoAuthId": "dsa",
                                "plivoAuthToken": "asd",
                                "x": 252.888916015625,
                                "y": 251.10415649414062,
                                "z": "9eb9aa60.614658"
                            }
                        ],
                        links : [
                            { "from": '7b8f181f.8470e8', "to": "d71fffc9.28e"  }
                        ]
                    }
                ]
            );

            return defer.promise;
        };

    });
