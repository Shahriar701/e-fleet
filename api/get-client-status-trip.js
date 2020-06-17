import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let sk = query && query.sk;

    let statusArray = ["ordersPlaced", "detailsCollected", "orderConfirmed", "loadCompleted",
        "inTransit", "unloadComplete", "consignmentDone"];
    let labelArray = ["Orders placed", "Details collected", "Orders confirmed", "Load Completed",
        "In transit", "Upload complete", "Consignment done"];

    var params;
    var consignmentDone;
    var ordersPlaced;
    var detailsCollected;
    var orderConfirmed;
    var loadCompleted;
    var inTransit;
    var unloadComplete;

    try {

        for (var e = 0; e < statusArray.length; e++) {

            params = {
                TableName: process.env.tableName,
                IndexName: "reverse-index",
                KeyConditionExpression: "#sk = :sk",
                ExpressionAttributeNames: {
                    "#sk": "sk",
                    "#status": "status"
                },
                ExpressionAttributeValues: {
                    ":sk": sk,
                    ":status": statusArray[e]
                },
                FilterExpression: "begins_with(#status, :status)",
                ScanIndexForward: false
            };

            var result = await dynamoDbLib.call("query", params);
            var count = result.Count;

            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
                count += result.Count;
            }

            if (statusArray[e] === "consignmentDone") {
                consignmentDone = count.toString();
            } else if (statusArray[e] === "detailsCollected") {
                detailsCollected = count.toString();
            } else if (statusArray[e] === "ordersPlaced") {
                ordersPlaced = count.toString();
            } else if (statusArray[e] === "orderConfirmed") {
                orderConfirmed = count.toString();
            } else if (statusArray[e] === "loadCompleted") {
                loadCompleted = count.toString();
            } else if (statusArray[e] === "inTransit") {
                inTransit = count.toString();
            } else {
                unloadComplete = count.toString();
            }

        }

        return success({
            data: [
                {
                    label: labelArray[0],
                    value: ordersPlaced
                },
                {
                    label: labelArray[1],
                    value: detailsCollected
                },
                {
                    label: labelArray[2],
                    value: orderConfirmed
                },
                {
                    label: labelArray[3],
                    value: loadCompleted
                },
                {
                    label: labelArray[4],
                    value: inTransit
                },
                {
                    label: labelArray[5],
                    value: unloadComplete
                },
                {
                    label: labelArray[6],
                    value: consignmentDone
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}