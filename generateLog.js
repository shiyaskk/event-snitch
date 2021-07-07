const _ = require('lodash');

const jwtDecode = require('jwt-decode');


let logObj = {}
let getPrintObj = (message, event , context ) => {
   if (event.headers && event.headers.Authorization) {
       logObj.token = maskString(event.headers.Authorization);
   }
   logObj.function = process.env.AWS_LAMBDA_FUNCTION_NAME;
   if(context.awsRequestId) {
       logObj.aws_request_id = context.awsRequestId;
   }
   if(event.requestContext) {
       logObj.source_ip =event.requestContext.identity.sourceIp;
   }
   logObj.message = message;
   logObj.timestamp = Date.now();
}


exports.info = (message, eventData, event = {}, context = {}) => {
    getPrintObj(message, event , context );
    if (eventData) {
        logObj.event_data = eventData;
    }
    console.log(JSON.stringify(logObj));
    return;
}

exports.error = (message, event = {}, context = {}, error) => {
    getPrintObj(message, event , context )
    if (error) {
        logObj.error_details = `${error}`
    }
}


let maskString = (value = '') => {
    return value.substring(0, 10) + '......' + value.substring(value.length - 10, value.length)
}
