module.exports = function(app, passport, meshbluJSON){
    // setting env to app.settings.env
    var env = app.settings.env;
    var config = require('../config/auth');
    var meshblu = require('meshblu');
    var SecurityController = require('./controllers/middleware/security-controller');
    var security = new SecurityController();

    app.locals.skynetUrl = config.skynet.host + ':' + config.skynet.port;

    console.log('Connecting to SkyNet...');

    var conn = meshblu.createConnection(meshbluJSON);

    var referrer = require('./controllers/middleware/referrer.js');

    var ChannelAWSAuthController = require('./controllers/channel-aws-auth-controller');
    var channelAWSAuthController = new ChannelAWSAuthController();

    var ChannelCloudDotComController = require('./controllers/channel-clouddotcom-controller');
    var channelCloudDotComController = new ChannelCloudDotComController();

    var ChannelGooglePlacesController = require('./controllers/channel-google-places-controller');
    var channelGooglePlacesController = new ChannelGooglePlacesController();

    var ChannelBasicAuthController = require('./controllers/channel-basic-auth-controller');
    var channelBasicAuthController = new ChannelBasicAuthController();

    var ChannelApiKeyController = require('./controllers/channel-api-key-controller');
    var channelApiKeyController = new ChannelApiKeyController();

    var OctoController = require('./controllers/octo-controller')
    var octoController = new OctoController(conn)

    var FlowAuthCredentialsController = require('./controllers/flow-auth-credentials-controller');
    var flowAuthCredentialsController = new FlowAuthCredentialsController(meshbluJSON);

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController({meshblu: conn});

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshblu: conn});

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

    var DemoFlowController = require('./controllers/demo-flow-controller');
    var demoFlowController = new DemoFlowController({meshblu: conn});

    var DropboxController = require('./controllers/dropbox-controller');
    var dropboxController = new DropboxController();

    var EchoSignController = require('./controllers/echosign-controller');
    var echoSignController = new EchoSignController();

    var FacebookController = require('./controllers/facebook-controller');
    var facebookController = new FacebookController();

    var FitbitController = require('./controllers/fitbit-controller');
    var fitbitController = new FitbitController();

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

    var PaypalController = require('./controllers/paypal-controller');
    var paypalController = new PaypalController();

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
    var templateController = new TemplateController({meshblu: conn});

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
    var webhookController = new WebhookController({meshblu: conn});

    var WinkController = require('./controllers/wink-controller');
    var winkController = new WinkController();

    var WitaiController = require('./controllers/witai-controller');
    var witaiController = new WitaiController();

    var WithingsController = require('./controllers/withings-controller');
    var withingsController = new WithingsController();

    var WordPressController = require('./controllers/wordpress-controller');
    var wordPressController = new WordPressController();

    var XeroController = require('./controllers/xero-controller');
    var xeroController = new XeroController();

    var ZendeskController = require('./controllers/zendesk-controller');
    var zendeskController = new ZendeskController();


    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed', data);
    });

    conn.on('error', function(error){
        console.error(error.msg);
        console.error(error.stack);
    });


    // Attach additional routes
    conn.on('ready', function(data){
        console.log('SkyNet authentication: success');
        try {
            app.post('/api/auth', security.bypassAuth);
            app.all('/api/auth', security.bypassTerms);
            app.all('/api/auth/*', security.bypassAuth, security.bypassTerms);
            app.all('/api/flow-auth-credentials/*', security.bypassTerms);
            app.all('/api/oauth/*', security.bypassAuth, security.bypassTerms);
            app.post('/api/invitation/request', security.bypassAuth, security.bypassTerms);
            app.post('/api/webhooks/:id', security.bypassAuth, webhookController.trigger);
            app.get('/api/invitation/:id/accept', security.bypassAuth, security.bypassTerms);
            app.all('/api/reset', security.bypassAuth, security.bypassTerms);
            app.all('/api/reset/:token', security.bypassAuth, security.bypassTerms);
            app.get('/api/session', security.bypassAuth, security.bypassTerms);

            app.all('/api/*', security.isAuthenticated, security.enforceTerms);

            require('./controllers/auth-controller')(app, passport, config);
            require('./controllers/channel')(app);
            require('./controllers/connect')(app, passport, config);
            require('./controllers/cors')(app);
            require('./controllers/elastic')(app);
            require('./controllers/message')(app, conn);
            require('./controllers/session')(app, passport, config);
            require('./controllers/unlink')(app);
            require('./controllers/user')(app);
            require('./controllers/permissions')(app);
            require('./controllers/designer')(app);
            require('./controllers/invitation')(app, passport, config);

            app.post('/api/auth/aws/channel/:id', channelAWSAuthController.create);
            app.post('/api/auth/clouddotcom/channel/:id', channelCloudDotComController.create);
            app.post('/api/auth/google-places/channel/:id', channelGooglePlacesController.create);
            app.post('/api/auth/basic/channel/:id', channelBasicAuthController.create);
            app.post('/api/auth/apikey/channel/:id', channelApiKeyController.create);

            app.post('/api/auth/signup', signupController.checkForExistingUser, signupController.createUser);
            app.get('/api/oauth/facebook/signup', signupController.verifyInvitationCode, signupController.storeTesterId, facebookController.authorize);
            app.get('/api/oauth/github/signup', signupController.verifyInvitationCode, signupController.storeTesterId, githubController.authorize);
            app.get('/api/oauth/google/signup', signupController.verifyInvitationCode, signupController.storeTesterId, googleController.authorize);
            app.get('/api/oauth/twitter/signup', signupController.verifyInvitationCode, signupController.storeTesterId, twitterController.authorize);

            app.post('/api/octos', octoController.create)
            app.delete('/api/octos/:octoUuid', octoController.delete)

            app.post('/api/demo_flows', demoFlowController.create);

            app.post('/api/flows', flowController.create);
            app.put('/api/flows/:id', flowController.update);
            app.delete('/api/flows/:id', flowController.delete);
            app.get('/api/flows', flowController.getAllFlows);
            app.post('/api/flows/:id/instance', flowDeployController.startInstance);
            app.delete('/api/flows/:id/instance', flowDeployController.stopInstance);
            app.put('/api/flows/:id/instance', flowDeployController.restartInstance);

            app.get('/api/flow-auth-credentials/:id', flowAuthCredentialsController.show);

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
            app.get('/api/oauth/app.net/callback', appNetController.callback, appNetController.redirectToDesigner);

            app.get('/api/oauth/automatic',          automaticController.authorize);
            app.get('/api/oauth/automatic/callback', automaticController.callback, automaticController.redirectToDesigner);

            app.get('/api/oauth/bitly',          bitlyController.authorize);
            app.get('/api/oauth/bitly/callback', bitlyController.callback, bitlyController.redirectToDesigner);

            app.get('/api/oauth/box',          boxController.authorize);
            app.get('/api/oauth/box/callback', boxController.callback, boxController.redirectToDesigner);

            app.get('/api/oauth/doubleclicksearch',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/doubleclicksearch/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/dropbox',          dropboxController.authorize);
            app.get('/api/oauth/dropbox/callback', dropboxController.callback, dropboxController.redirectToDesigner);

            app.get('/api/oauth/facebook',          referrer.storeReferrer, facebookController.authorize);
            app.get('/api/oauth/facebook/callback', facebookController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, facebookController.redirectToDesigner);

            app.get('/api/oauth/fitbit',          fitbitController.authorize);
            app.get('/api/oauth/fitbit/callback', fitbitController.callback, fitbitController.redirectToDesigner);

            app.get('/api/oauth/foursquare',          fourSquareController.authorize);
            app.get('/api/oauth/foursquare/callback', fourSquareController.callback, fourSquareController.redirectToDesigner);

            app.get('/api/oauth/github',          referrer.storeReferrer, githubController.authorize);
            app.get('/api/oauth/github/callback', githubController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, githubController.redirectToDesigner);

            app.get('/api/oauth/google',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/google/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/google-*',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/google-*/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/goToAssist',          goToAssistController.authorize);
            app.get('/api/oauth/goToAssist/callback', goToAssistController.callback, goToAssistController.redirectToDesigner);

            app.get('/api/oauth/goToMeeting',          goToMeetingController.authorize);
            app.get('/api/oauth/goToMeeting/callback', goToMeetingController.callback, goToMeetingController.redirectToDesigner);

            app.get('/api/oauth/gotomeeting-free', goToMeetingFreeController.authorize, goToMeetingFreeController.redirectToDesigner);

            app.get('/api/oauth/goToTraining',          goToTrainingController.authorize);
            app.get('/api/oauth/goToTraining/callback', goToTrainingController.callback, goToTrainingController.redirectToDesigner);

            app.get('/api/oauth/goToWebinar',          goToWebinarController.authorize);
            app.get('/api/oauth/goToWebinar/callback', goToWebinarController.callback, goToWebinarController.redirectToDesigner);

            app.get('/api/oauth/instagram',          instagramController.authorize);
            app.get('/api/oauth/instagram/callback', instagramController.callback, instagramController.redirectToDesigner);

            app.get('/api/oauth/jawbone',          jawboneController.authorize);
            app.get('/api/oauth/jawbone/callback', jawboneController.callback, jawboneController.redirectToDesigner);

            app.get('/api/oauth/linked-in',          linkedinController.authorize);
            app.get('/api/oauth/linked-in/callback', linkedinController.callback, linkedinController.redirectToDesigner);

            app.post('/api/littlebits/auth', littlebitsController.authorize, littlebitsController.redirectToDesigner);

            app.get('/api/oauth/nest',          nestController.authorize);
            app.get('/api/oauth/nest/callback', nestController.callback, nestController.redirectToDesigner);

            app.get('/api/oauth/octoblu',          octobluController.authorize);
            app.get('/api/oauth/octoblu/callback', octobluController.callback, octobluController.redirectToDesigner);

            app.get('/api/oauth/paypal',          referrer.storeReferrer, paypalController.authorize);
            app.get('/api/oauth/paypal/callback', paypalController.callback, paypalController.redirectToDesigner);

            app.get('/api/oauth/podio',          podioController.authorize);
            app.get('/api/oauth/podio/callback', podioController.callback, podioController.redirectToDesigner);

            app.get('/api/oauth/quickbooks',          quickBooksController.authorize);
            app.get('/api/oauth/quickbooks/callback', quickBooksController.callback, quickBooksController.redirectToDesigner);

            app.get('/api/oauth/rdio',          rdioController.authorize);
            app.get('/api/oauth/rdio/callback', rdioController.callback, rdioController.redirectToDesigner);

            app.get('/api/oauth/readability',          readabilityController.authorize);
            app.get('/api/oauth/readability/callback', readabilityController.callback, readabilityController.redirectToDesigner);

            app.get('/api/oauth/redbooth',          redBoothController.authorize);
            app.get('/api/oauth/redbooth/callback', redBoothController.callback, redBoothController.redirectToDesigner);

            app.get('/api/oauth/rightsignature',          rightsignatureController.authorize);
            app.get('/api/oauth/rightsignature/callback', rightsignatureController.callback, rightsignatureController.redirectToDesigner);

            app.get('/api/oauth/salesforce',          salesForceController.authorize);
            app.get('/api/oauth/salesforce/callback', salesForceController.callback, salesForceController.redirectToDesigner);

            app.get('/api/oauth/sharefile',          shareFileController.authorize);
            app.get('/api/oauth/sharefile/callback', shareFileController.callback, shareFileController.redirectToDesigner);

            app.get('/api/oauth/slack',          slackController.authorize);
            app.get('/api/oauth/slack/callback', slackController.callback, slackController.redirectToDesigner);

            app.get('/api/oauth/smartsheet',          smartsheetController.authorize);
            app.get('/api/oauth/smartsheet/callback', smartsheetController.callback, smartsheetController.redirectToDesigner);

            app.get('/api/oauth/spotify',          spotifyController.authorize);
            app.get('/api/oauth/spotify/callback', spotifyController.callback, spotifyController.redirectToDesigner);

            app.get('/api/oauth/survey-monkey',          surveyMonkeyController.authorize);
            app.get('/api/oauth/survey-monkey/callback', surveyMonkeyController.callback, surveyMonkeyController.redirectToDesigner);

            app.get('/api/oauth/swarm',          fourSquareController.authorize);
            app.get('/api/oauth/swarm/callback', fourSquareController.callback, fourSquareController.redirectToDesigner);

            app.get('/api/oauth/thingiverse',          thingiverseController.authorize);
            app.get('/api/oauth/thingiverse/callback', thingiverseController.callback, thingiverseController.redirectToDesigner);

            app.get('/api/oauth/twitter',          referrer.storeReferrer, twitterController.authorize);
            app.get('/api/oauth/twitter/callback', twitterController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, twitterController.redirectToDesigner);

            app.get('/api/oauth/uber',          uberController.authorize);
            app.get('/api/oauth/uber/callback', uberController.callback, uberController.redirectToDesigner);

            app.get('/api/oauth/uservoice',          userVoiceController.authorize);
            app.get('/api/oauth/uservoice/callback', userVoiceController.callback, userVoiceController.redirectToDesigner);

            app.get('/api/oauth/vimeo',          vimeoController.authorize);
            app.get('/api/oauth/vimeo/callback', vimeoController.callback, vimeoController.redirectToDesigner);

            app.get('/api/oauth/withings',          withingsController.authorize);
            app.get('/api/oauth/withings/callback', withingsController.callback, withingsController.redirectToDesigner);

            app.get('/api/oauth/wordpress',          wordPressController.authorize);
            app.get('/api/oauth/wordpress/callback', wordPressController.callback, wordPressController.redirectToDesigner);

            app.get('/api/oauth/xero',          xeroController.authorize);
            app.get('/api/oauth/xero/callback', xeroController.callback, xeroController.redirectToDesigner);

            app.get('/api/oauth/youtube',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/youtube/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/zendesk',          zendeskController.authorize);
            app.get('/api/oauth/zendesk/callback', zendeskController.callback, zendeskController.redirectToDesigner);

            app.get('/api/echosign/auth', echoSignController.authorize, echoSignController.redirectToDesigner);

            app.post('/api/tesla/auth', teslaController.authorize, teslaController.redirectToDesigner);

            app.get('/api/travis-ci/auth', travisCIController.authorize, travisCIController.redirectToDesigner);
            app.get('/api/travis-ci-pro/auth', travisCIProController.authorize, travisCIProController.redirectToDesigner);

            app.post('/api/wink/auth', winkController.authorize, winkController.redirectToDesigner);

            app.post('/api/witai/auth', witaiController.authorize, witaiController.redirectToDesigner);

            app.post('/api/templates', templateController.create);
            app.get('/api/templates', templateController.getAllTemplates);
            app.delete('/api/templates/:id', templateController.delete);
            app.put('/api/templates/:id', templateController.update);
            app.get('/api/templates/:id', templateController.findOne);
            app.post('/api/templates/:id/flows', templateController.importTemplate);
            app.get('/api/flows/:flowId/templates', templateController.withFlowId);
            app.get('/api/users/:uuid/templates', templateController.withUserUUID);
            app.get('/api/templates/public', templateController.findByPublic);
            app.get('/api/topics/summary', topicSummaryController.show);
            app.get('/api/messages/summary', messageSummaryController.show);
            app.get('/api/general/search', generalSearchController.show);

            app.all(['/api/*', '/angular/*', '/assets/*', '/lib/*', '/pages/*'], function(req, res) {
                res.send(404, req.url);
            });

            app.get('/*', function(req, res) {
                res.sendfile('./public/index.html');
            });
        } catch(err) {
            console.log(err.stack);
            throw err;
        }
    }); // end skynet (and everything else)
};
