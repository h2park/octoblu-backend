angular.module('octobluApp')
    .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer) {
        return function (renderScope) {
            var dispatch = d3.dispatch('flowChanged', 'nodeSelected');
            var linkRenderer = new FlowLinkRenderer(renderScope),
                nodeRenderer = new FlowNodeRenderer(renderScope);
            this.render = function (flow) {
                nodeRenderer.render(flow.nodes)
                    .on('nodeMoved', function (flowNode) {
                        linkRenderer.updateLinksContaining(flowNode);
                    })
                    .on('nodeChanged', function (flowNode) {
                        dispatch.flowChanged(flow);
                    })
                    .on('nodeClicked', function(flowNode) {
                        dispatch.nodeSelected(flowNode);
                    });
                linkRenderer.render(flow.links);

                renderScope.on('click', function(){
                    if(d3.event.defaultPrevented){
                        return;
                    }
                    dispatch.nodeSelected(null);
                });
                return dispatch;
            };
            this.clear = function () {
                nodeRenderer.clear();
                linkRenderer.clear();
            };
        };
    });
