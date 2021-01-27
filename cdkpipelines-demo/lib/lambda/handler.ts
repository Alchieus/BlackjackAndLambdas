import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult
  } from "aws-lambda";
/** the queue and redirect lambda is a simple url parameter parser that does two things
 * 1: parse querystring parameters into a queuemessage to be queued
 *      a: CampaignName
 *      b: LeadType
 *      c: GlobalCustomerId
 *      d: OfferId
 * 2: parse querystring parameter for "redirect" to respond with a status 307 
 */
exports.handler = async ( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
    //TODO generate and Queue the SQSMessage

    //redirect
    if(event.queryStringParameters?.redirect === undefined){
        return {
            statusCode: 307,
            headers:{
                Location: "https://Google.com"
            },
            body:"You are being redirected to a default sight."
        };
    }
    const redirectUrl: string = event.queryStringParameters.redirect;
    return {
        statusCode: 307,
        headers:{
            Location: redirectUrl
        },
        body:"You are being redirected."
    };
}