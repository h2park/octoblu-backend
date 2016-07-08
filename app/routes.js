module.exports = function(app, passport, config, meshbluJSON){
    // setting env to app.settings.env
    var env = app.settings.env;
    var SecurityController = require('./controllers/middleware/security-controller');
    var security = new SecurityController();

    var FlowIntervalNodesTransform = require('./controllers/middleware/flow-interval-nodes-transform');
    var flowIntervalNodesTransform = new FlowIntervalNodesTransform();
    app.use(function noCache(req, res, next) {
      res.header("Cache-Control", "private, max-age=0, must-revalidate");
      next();
    });

    app.locals.skynetUrl = config.skynet.host + ':' + config.skynet.port;

    var referrer = require('./controllers/middleware/referrer.js');

    var ChannelAWSAuthController = require('./controllers/channel-aws-auth-controller');
    var channelAWSAuthController = new ChannelAWSAuthController();

    var ChannelGooglePlacesController = require('./controllers/channel-google-places-controller');
    var channelGooglePlacesController = new ChannelGooglePlacesController();

    var ChannelBasicAuthController = require('./controllers/channel-basic-auth-controller');
    var channelBasicAuthController = new ChannelBasicAuthController();

    var ChannelApiKeyController = require('./controllers/channel-api-key-controller');
    var channelApiKeyController = new ChannelApiKeyController();

    var FlowAuthCredentialsController = require('./controllers/flow-auth-credentials-controller');
    var flowAuthCredentialsController = new FlowAuthCredentialsController(meshbluJSON);

    var RefreshTokenController = require('./controllers/refresh-token-controller');
    var refreshTokenController = new RefreshTokenController(meshbluJSON);

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController({meshbluJSON: meshbluJSON});

    var FlowControllerV2 = require('./controllers/flow-controller-v2');
    var flowControllerV2 = new FlowControllerV2({meshbluJSON: meshbluJSON});

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshbluJSON: meshbluJSON});

    var FlowNodeTypeController = require('./controllers/flow-node-type-controller');
    var flowNodeTypeController = new FlowNodeTypeController();

    var GroupController = require('./controllers/group-controller');
    var groupController = new GroupController();

    var GeneralSearchController = require('./controllers/general-search-controller');
    var generalSearchController = new GeneralSearchController(config.elasticSearchUri);

    var MessageSummaryController = require('./controllers/message-summary-controller');
    var messageSummaryController = new MessageSummaryController(config.elasticSearchUri);

    var NodeTypeController = require('./controllers/node-type-controller');
    var nodeTypeController = new NodeTypeController();

    var NodeController = require('./controllers/node-controller');
    var nodeController = new NodeController();

    var SessionController = require('./controllers/session-controller');
    var sessionController = new SessionController();

    var TopicSummaryController = require('./controllers/topic-summary-controller');
    var topicSummaryController = new TopicSummaryController(config.elasticSearchUri);

    // Channel Auth Controllers

    var AppNetController = require('./controllers/app-net-controller');
    var appNetController = new AppNetController();

    var AutomaticController = require('./controllers/automatic-controller');
    var automaticController = new AutomaticController();

    var BitlyController = require('./controllers/bitly-controller');
    var bitlyController = new BitlyController();

    var BoxController = require('./controllers/box-controller');
    var boxController = new BoxController();

    var ClmController = require('./controllers/citrix-lifecycle-management-controller');
    var clmController = new ClmController();

    var DemoFlowController = require('./controllers/demo-flow-controller');
    var demoFlowController = new DemoFlowController({meshbluJSON: meshbluJSON});

    var DropboxController = require('./controllers/dropbox-controller');
    var dropboxController = new DropboxController();

    var EchoSignController = require('./controllers/echosign-controller');
    var echoSignController = new EchoSignController();

    var FacebookController = require('./controllers/facebook-controller');
    var facebookController = new FacebookController();

    var FitbitController = require('./controllers/fitbit-controller');
    var fitbitController = new FitbitController();

    var FlicController = require('./controllers/flic-controller');
    var flicController = new FlicController();

    var FourSquareController = require('./controllers/foursquare-controller');
    var fourSquareController = new FourSquareController();

    var GithubController = require('./controllers/github-controller');
    var githubController = new GithubController();

    var GoogleController = require('./controllers/google-controller');
    var googleController = new GoogleController();

    var GoToAssistController = require('./controllers/gotoassist-controller');
    var goToAssistController = new GoToAssistController();

    var GoToMeetingController = require('./controllers/gotomeeting-controller');
    var goToMeetingController = new GoToMeetingController();

    var GoToMeetingFreeController = require('./controllers/gotomeeting-free-controller');
    var goToMeetingFreeController = new GoToMeetingFreeController();

    var GoToTrainingController = require('./controllers/gototraining-controller');
    var goToTrainingController = new GoToTrainingController();

    var GoToWebinarController = require('./controllers/gotowebinar-controller');
    var goToWebinarController = new GoToWebinarController();

    var InstagramController = require('./controllers/instagram-controller');
    var instagramController = new InstagramController();

    var IntercomController = require('./controllers/intercom-controller');
    var intercomController = new IntercomController();

    var InvitationController = require('./controllers/invitation-controller');
    var invitationController = new InvitationController(config.betaInvites);

    var JawboneController = require('./controllers/jawbone-controller');
    var jawboneController = new JawboneController();

    var LinkedinController = require('./controllers/linked-in-controller');
    var linkedinController = new LinkedinController();

    var LittlebitsController = require('./controllers/littlebits-controller');
    var littlebitsController = new LittlebitsController();

    var NestController = require('./controllers/nest-controller');
    var nestController = new NestController();

    var OctobluController = require('./controllers/octoblu-controller');
    var octobluController = new OctobluController();

    var PodioController = require('./controllers/podio-controller');
    var podioController = new PodioController();

    var QuickBooksContoller = require('./controllers/quickbooks-controller');
    var quickBooksController = new QuickBooksContoller();

    var RdioController = require('./controllers/rdio-controller');
    var rdioController = new RdioController();

    var ReadabilityController = require('./controllers/readability-controller');
    var readabilityController = new ReadabilityController();

    var RedBoothController = require('./controllers/redbooth-controller');
    var redBoothController = new RedBoothController();

    var RightSignatureController = require('./controllers/rightsignature-controller');
    var rightsignatureController = new RightSignatureController();

    var SalesForceController = require('./controllers/salesforce-controller');
    var salesForceController = new SalesForceController();

    var ShareFileController = require('./controllers/sharefile-controller');
    var shareFileController = new ShareFileController();

    var SignupController = require('./controllers/signup-controller');
    var signupController = new SignupController();

    var SlackController = require('./controllers/slack-controller');
    var slackController = new SlackController();

    var SmartsheetController = require('./controllers/smartsheet-controller');
    var smartsheetController = new SmartsheetController();

    var SpotifyController = require('./controllers/spotify-controller');
    var spotifyController = new SpotifyController();

    var SurveyMonkeyController = require('./controllers/survey-monkey-controller');
    var surveyMonkeyController = new SurveyMonkeyController();

    var TemplateController = require('./controllers/template-controller');
    var templateController = new TemplateController({meshbluJSON: meshbluJSON});

    var TeslaController = require('./controllers/tesla-controller');
    var teslaController = new TeslaController();

    var ThingiverseController = require('./controllers/thingiverse-controller');
    var thingiverseController = new ThingiverseController();

    var TravisCIController = require('./controllers/travis-ci-controller');
    var travisCIController = new TravisCIController();

    var TravisCIProController = require('./controllers/travis-ci-pro-controller');
    var travisCIProController = new TravisCIProController();

    var TwitterController = require('./controllers/twitter-controller');
    var twitterController = new TwitterController();

    var UberController = require('./controllers/uber-controller');
    var uberController = new UberController();

    var UserVoiceController = require('./controllers/uservoice-controller');
    var userVoiceController = new UserVoiceController();

    var VimeoController = require('./controllers/vimeo-controller');
    var vimeoController = new VimeoController();

    var WebhookController = require('./controllers/webhook-controller');
    var webhookController = new WebhookController({meshbluJSON: meshbluJSON});

    var WinkController = require('./controllers/wink-controller');
    var winkController = new WinkController();

    var WitaiController = require('./controllers/witai-controller');
    var witaiController = new WitaiController();

    var WithingsController = require('./controllers/withings-controller');
    var withingsController = new WithingsController();

    var WordPressController = require('./controllers/wordpress-controller');
    var wordPressController = new WordPressController();

    var XenMobileController = require('./controllers/xenmobile-controller');
    var xenMobileController = new XenMobileController();

    var DatadogController = require('./controllers/datadog-controller');
    var dataDogController = new DatadogController();

    var XeroController = require('./controllers/xero-controller');
    var xeroController = new XeroController();

    var ChannelPagerdutyController = require('./controllers/channel-pagerduty-controller');
    var channelPagerdutyController = new ChannelPagerdutyController();

    var UserChannelsController = require('./controllers/user-channels-controller');
    var userChannelsController = new UserChannelsController();

    var OperationsController = require('./controllers/operations-controller');
    var operationsController = new OperationsController();

    app.post('/api/webhooks/:id', webhookController.trigger);

    require('./controllers/auth-controller')(app, passport, config);
    require('./controllers/channel')(app);
    require('./controllers/connect')(app, passport, config);
    require('./controllers/cors')(app);
    require('./controllers/elastic')(app);
    require('./controllers/session')(app, passport, config);
    require('./controllers/unlink')(app);
    require('./controllers/user')(app);
    require('./controllers/permissions')(app);
    require('./controllers/designer')(app);
    require('./controllers/invitation')(app, passport, config);

    app.get('/api/intercom/user_hash', intercomController.getUserHash);
    app.post('/api/channel/aws/channel/:id', channelAWSAuthController.create);

    app.post('/api/channel/pagerduty/channel/:id', channelPagerdutyController.create);

    app.post('/api/channel/google-places/channel/:id', channelGooglePlacesController.create);
    app.post('/api/channel/basic/channel/:id', channelBasicAuthController.create);
    app.post('/api/channel/apikey/channel/:id', channelApiKeyController.create);

    app.post('/api/auth/signup', signupController.checkForExistingUser, signupController.createUser);
    app.get('/api/oauth/facebook/signup', signupController.verifyInvitationCode, signupController.storeTesterId, facebookController.authorize);
    app.get('/api/oauth/github/signup', signupController.verifyInvitationCode, signupController.storeTesterId, githubController.authorize);
    app.get('/api/oauth/google/signup', signupController.verifyInvitationCode, signupController.storeTesterId, googleController.authorize);
    app.get('/api/oauth/twitter/signup', signupController.verifyInvitationCode, signupController.storeTesterId, twitterController.authorize);

    app.post('/api/demo_flows', demoFlowController.create);

    app.post('/api/flows', flowController.create);
    app.put('/api/flows/:id', flowController.update);
    app.get('/api/flows/:id', flowController.getFlow);
    app.delete('/api/flows/:id', flowController.delete);
    app.get('/api/flows', flowController.getAllFlows);
    app.get('/api/flows/:limit/paged', flowController.getSomeFlows);

    app.get('/api/v2/flows', flowControllerV2.getFlows);
    app.get('/api/v2/flows/:limit/paged', flowControllerV2.getSomeFlows);

    app.post('/api/flows/:id/instance', flowDeployController.startInstance);
    app.delete('/api/flows/:id/instance', flowDeployController.stopInstance);

    app.get('/api/flow-auth-credentials/:id', flowAuthCredentialsController.show);

    app.post('/api/workers/refresh-token', refreshTokenController.refresh);

    app.get('/api/flow_node_types', flowNodeTypeController.getFlowNodeTypes);

    app.get('/api/groups', groupController.getGroups);
    app.post('/api/groups', groupController.addGroup);
    app.get('/api/groups/operators', groupController.getOperatorsGroup);
    app.get('/api/groups/contain/:uuid', groupController.getGroupsContainingResource);
    app.delete('/api/groups/:uuid', groupController.deleteGroup);
    app.put('/api/groups/:uuid', groupController.updateGroup);
    app.get('/api/groups/:uuid', groupController.getGroupById);

    app.post('/api/invitation/request', invitationController.requestInvite);

    app.get('/api/node_types', nodeTypeController.index);
    app.get('/api/nodes', nodeController.index);

    app.get('/api/session', sessionController.show);

    app.get('/api/oauth/app.net',          appNetController.authorize);
    app.get('/api/oauth/app.net/callback', appNetController.callback, appNetController.redirectToConfigure);

    app.get('/api/oauth/automatic',          automaticController.authorize);
    app.get('/api/oauth/automatic/callback', automaticController.callback, automaticController.redirectToConfigure);

    app.get('/api/oauth/bitly',          bitlyController.authorize);
    app.get('/api/oauth/bitly/callback', bitlyController.callback, bitlyController.redirectToConfigure);

    app.get('/api/oauth/box',          boxController.authorize);
    app.get('/api/oauth/box/callback', boxController.callback, boxController.redirectToConfigure);

    app.get('/api/oauth/doubleclicksearch',          referrer.storeReferrer, googleController.authorize);
    app.get('/api/oauth/doubleclicksearch/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToConfigure);

    app.get('/api/oauth/dropbox',          dropboxController.authorize);
    app.get('/api/oauth/dropbox/callback', dropboxController.callback, dropboxController.redirectToConfigure);

    app.get('/api/oauth/facebook',          referrer.storeReferrer, facebookController.authorize);
    app.get('/api/oauth/facebook/callback', facebookController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, facebookController.redirectToConfigure);

    app.get('/api/oauth/fitbit',          fitbitController.authorize);
    app.get('/api/oauth/fitbit/callback', fitbitController.callback, fitbitController.redirectToConfigure);

    app.get('/api/oauth/flic',          flicController.authorize);
    app.get('/api/oauth/flic/callback', flicController.callback, flicController.redirectToConfigure);

    app.get('/api/oauth/foursquare',          fourSquareController.authorize);
    app.get('/api/oauth/foursquare/callback', fourSquareController.callback, fourSquareController.redirectToConfigure);

    app.get('/api/oauth/github',          referrer.storeReferrer, githubController.authorize);
    app.get('/api/oauth/github/callback', githubController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, githubController.redirectToConfigure);

    app.get('/api/oauth/google',          referrer.storeReferrer, googleController.authorize);
    app.get('/api/oauth/google/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToConfigure);

    app.get('/api/oauth/google-*',          referrer.storeReferrer, googleController.authorize);
    app.get('/api/oauth/google-*/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToConfigure);

    app.get('/api/oauth/goToAssist',          goToAssistController.authorize);
    app.get('/api/oauth/goToAssist/callback', goToAssistController.callback, goToAssistController.redirectToConfigure);

    app.get('/api/oauth/goToMeeting',          goToMeetingController.authorize);
    app.get('/api/oauth/goToMeeting/callback', goToMeetingController.callback, goToMeetingController.redirectToConfigure);

    app.get('/api/oauth/gotomeeting-free', goToMeetingFreeController.authorize, goToMeetingFreeController.redirectToConfigure);

    app.get('/api/oauth/goToTraining',          goToTrainingController.authorize);
    app.get('/api/oauth/goToTraining/callback', goToTrainingController.callback, goToTrainingController.redirectToConfigure);

    app.get('/api/oauth/goToWebinar',          goToWebinarController.authorize);
    app.get('/api/oauth/goToWebinar/callback', goToWebinarController.callback, goToWebinarController.redirectToConfigure);

    app.get('/api/oauth/instagram',          instagramController.authorize);
    app.get('/api/oauth/instagram/callback', instagramController.callback, instagramController.redirectToConfigure);

    app.get('/api/oauth/jawbone',          jawboneController.authorize);
    app.get('/api/oauth/jawbone/callback', jawboneController.callback, jawboneController.redirectToConfigure);

    app.get('/api/oauth/linked-in',          linkedinController.authorize);
    app.get('/api/oauth/linked-in/callback', linkedinController.callback, linkedinController.redirectToConfigure);

    app.post('/api/littlebits/auth', littlebitsController.authorize, littlebitsController.redirectToConfigure);

    app.get('/api/oauth/nest',          nestController.authorize);
    app.get('/api/oauth/nest/callback', nestController.callback, nestController.redirectToConfigure);

    app.get('/api/oauth/octoblu',          octobluController.authorize);
    app.get('/api/oauth/octoblu/callback', octobluController.callback, octobluController.redirectToConfigure);

    app.get('/api/oauth/podio',          podioController.authorize);
    app.get('/api/oauth/podio/callback', podioController.callback, podioController.redirectToConfigure);

    app.get('/api/oauth/quickbooks',          quickBooksController.authorize);
    app.get('/api/oauth/quickbooks/callback', quickBooksController.callback, quickBooksController.redirectToConfigure);

    app.get('/api/oauth/rdio',          rdioController.authorize);
    app.get('/api/oauth/rdio/callback', rdioController.callback, rdioController.redirectToConfigure);

    app.get('/api/oauth/readability',          readabilityController.authorize);
    app.get('/api/oauth/readability/callback', readabilityController.callback, readabilityController.redirectToConfigure);

    app.get('/api/oauth/redbooth',          redBoothController.authorize);
    app.get('/api/oauth/redbooth/callback', redBoothController.callback, redBoothController.redirectToConfigure);

    app.get('/api/oauth/rightsignature',          rightsignatureController.authorize);
    app.get('/api/oauth/rightsignature/callback', rightsignatureController.callback, rightsignatureController.redirectToConfigure);

    app.get('/api/oauth/salesforce',          salesForceController.authorize);
    app.get('/api/oauth/salesforce/callback', salesForceController.callback, salesForceController.redirectToConfigure);

    app.get('/api/oauth/sharefile',          shareFileController.authorize);
    app.get('/api/oauth/sharefile/callback', shareFileController.callback, shareFileController.redirectToConfigure);

    app.get('/api/oauth/slack',          slackController.authorize);
    app.get('/api/oauth/slack/callback', slackController.callback, slackController.redirectToConfigure);

    app.get('/api/oauth/smartsheet',          smartsheetController.authorize);
    app.get('/api/oauth/smartsheet/callback', smartsheetController.callback, smartsheetController.redirectToConfigure);

    app.get('/api/oauth/spotify',          spotifyController.authorize);
    app.get('/api/oauth/spotify/callback', spotifyController.callback, spotifyController.redirectToConfigure);

    app.get('/api/oauth/survey-monkey',          surveyMonkeyController.authorize);
    app.get('/api/oauth/survey-monkey/callback', surveyMonkeyController.callback, surveyMonkeyController.redirectToConfigure);

    app.get('/api/oauth/swarm',          fourSquareController.authorize);
    app.get('/api/oauth/swarm/callback', fourSquareController.callback, fourSquareController.redirectToConfigure);

    app.get('/api/oauth/thingiverse',          thingiverseController.authorize);
    app.get('/api/oauth/thingiverse/callback', thingiverseController.callback, thingiverseController.redirectToConfigure);

    app.get('/api/oauth/twitter',          referrer.storeReferrer, twitterController.authorize);
    app.get('/api/oauth/twitter/callback', twitterController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, twitterController.redirectToConfigure);

    app.get('/api/oauth/uber',          uberController.authorize);
    app.get('/api/oauth/uber/callback', uberController.callback, uberController.redirectToConfigure);

    app.get('/api/oauth/uservoice',          userVoiceController.authorize);
    app.get('/api/oauth/uservoice/callback', userVoiceController.callback, userVoiceController.redirectToConfigure);

    app.get('/api/oauth/vimeo',          vimeoController.authorize);
    app.get('/api/oauth/vimeo/callback', vimeoController.callback, vimeoController.redirectToConfigure);

    app.get('/api/oauth/withings',          withingsController.authorize);
    app.get('/api/oauth/withings/callback', withingsController.callback, withingsController.redirectToConfigure);

    app.get('/api/oauth/wordpress',          wordPressController.authorize);
    app.get('/api/oauth/wordpress/callback', wordPressController.callback, wordPressController.redirectToConfigure);

    app.get('/api/oauth/xero',          xeroController.authorize);
    app.get('/api/oauth/xero/callback', xeroController.callback, xeroController.redirectToConfigure);

    app.get('/api/oauth/youtube',          referrer.storeReferrer, googleController.authorize);
    app.get('/api/oauth/youtube/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToConfigure);

    app.get('/api/echosign/auth', echoSignController.authorize, echoSignController.redirectToConfigure);

    app.post('/api/tesla/auth', teslaController.authorize, teslaController.redirectToConfigure);

    app.get('/api/travis-ci/auth', travisCIController.authorize, travisCIController.redirectToConfigure);
    app.get('/api/travis-ci-pro/auth', travisCIProController.authorize, travisCIProController.redirectToConfigure);

    app.get('/api/datadog/auth', dataDogController.authorize, dataDogController.redirectToConfigure);

    app.post('/api/wink/auth', winkController.authorize, winkController.redirectToConfigure);

    app.post('/api/witai/auth', witaiController.authorize, witaiController.redirectToConfigure);

    app.get('/api/xenmobile/auth', xenMobileController.authorize, xenMobileController.redirectToConfigure);

    app.get('/api/clm/auth', clmController.authorize, clmController.redirectToConfigure);

    app.post('/api/templates',  templateController.create);

    app.get('/api/templates',   templateController.getAllTemplates,
                                templateController.addOwnerNames);

    app.get('/api/templates/public',  templateController.findByPublic,
                                      templateController.addOwnerNames,
                                      templateController.send);

    app.get('/api/templates/public/recent',         templateController.findRecentPublic,
                                                    templateController.addOwnerNames,
                                                    templateController.send);

    app.put('/api/templates/:id/like', templateController.like);

    app.delete('/api/templates/:id/unlike', templateController.unlike);

    app.delete('/api/templates/:id', templateController.delete);

    app.put('/api/templates/:id', templateController.update);

    app.get('/api/templates/:id', templateController.findOne, templateController.addOwnerName);

    app.post('/api/templates/:id/flows', templateController.importTemplate);

    app.post('/api/templates/raw',  templateController.createRaw);

    app.all('/api/templates*', templateController.send);

    app.get('/api/flows/:flowId/templates', templateController.withFlowId);

    app.get('/api/users/:uuid/templates', templateController.withUserUUID);

    app.get('/api/user_channels', userChannelsController.list);
    app.get('/api/operations', operationsController.list)
    app.get('/api/topics/summary', topicSummaryController.show);
    app.get('/api/messages/summary', messageSummaryController.show);
    app.get('/api/general/search', generalSearchController.show);

    app.all(['/api/*', '/angular/*', '/assets/*', '/lib/*', '/pages/*'], function(req, res) {
      res.send(404, req.url);
    });
};
