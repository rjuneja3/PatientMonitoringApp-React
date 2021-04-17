const users = require('../controllers/users.server.controller');
const emergencyAlert = require('../controllers/emergencyAlert.server.controller');

module.exports =function(app){

    app.route('/api/emergencyAlerts')
    .post(
        // users.requiresLogin,
        // users.isSignedIn,
        emergencyAlert.create);

    app.route('/api/emergencyAlerts').get(emergencyAlert.list);

    // app.route('/api/emergencyAlert/users/:patientId').get(dailyTip.read);
    
    // app.route('/api/emergencyAlert/latest/users/:latestReportPatientId').get(dailyTip.read);

    app.route('/api/emergencyAlerts/:alertId')
    .get(emergencyAlert.read)
    .put(
        // users.requiresLogin,
        // dailyTip.hasAuthorization,
        emergencyAlert.update)
        .delete(
            // users.requiresLogin,
            // dailyTip.hasAuthorization,
            emergencyAlert.delete);

            app.param('alertId',emergencyAlert.infoByID);
            // app.param('patientId',dailyTip.reportsOfPatient);
            // app.param('latestReportPatientId',dailyTip.latestReportOfPatient);
        
};