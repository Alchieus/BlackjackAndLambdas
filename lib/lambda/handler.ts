import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult
  } from "aws-lambda";
/** the publish and redirect lambda is a simple url parameter parser that does two things
 * 1: parse querystring parameters into a topic message to be published.  multiple subscribers could process this message for any number of reasons.
 *      a: CampaignName
 *      b: LeadType
 *      c: GlobalCustomerId
 *      d: OfferId
 * 2: parse querystring parameter for "redirect" to respond with a status 307 
 */
exports.handler = async ( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
    //TODO generate and publish to SNS

    //redirect
    if(event.queryStringParameters?.redirect === undefined){
        return {
            statusCode: 307,
            headers:{
                Location: "https://www.yahoo.com/"
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