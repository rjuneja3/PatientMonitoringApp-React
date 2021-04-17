const users = require('../controllers/users.server.controller');
const dailyTip = require('../controllers/dailyTips.server.controller');

module.exports =function(app){

    app.route('/api/dailyTips')
    .post(
        // users.requiresLogin,
        // users.isSignedIn,
        dailyTip.create);

    app.route('/api/dailyTips').get(dailyTip.list);
    app.route('/api/dailyTips/latest').get(dailyTip.getLatestTip);
    // app.route('/api/dailyTips/users/:patientId').get(dailyTip.read);
    
    // app.route('/api/dailyTips/latest/users/:latestReportPatientId').get(dailyTip.read);

    app.route('/api/dailyTips/:tipId')
    .get(dailyTip.read)
    .put(
        // users.requiresLogin,
        // dailyTip.hasAuthorization,
        dailyTip.update)
        .delete(
            // users.requiresLogin,
            // dailyTip.hasAuthorization,
            dailyTip.delete);

            app.param('tipId',dailyTip.infoByID);
            // app.param('patientId',dailyTip.reportsOfPatient);
            // app.param('latestReportPatientId',dailyTip.latestReportOfPatient);
        
};