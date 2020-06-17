import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let getQuery = ["consignmentDone", "orderCancelled", "ordersPlaced", "detailsCollected", "orderConfirmed",
        "loadCompleted", "inTransit", "unloadComplete"];

    var params;
    var orderNum;
    var cancelNum;
    var progressNum;

    try {

        for (var e = 0; e < getQuery.length; e++) {

            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',

                },
                ExpressionAttributeValues: {
                    ":status": getQuery[e],
                },
                ScanIndexForward: false
            };

            var result = await dynamoDbLib.call("query", params);
            var count = result.Count;

            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
                count += result.Count;
            }

            if (getQuery[e] === "orderCancelled") {
                cancelNum = count;
            } else if (getQuery[e] === "consignmentDone") {
                orderNum = count;
            } else {
                progressNum = count;
            }

            count = null;

        }

        var total = orderNum + cancelNum + progressNum;

        orderNum = parseFloat(((orderNum / total) * 100)).toFixed(2);
        cancelNum = parseFloat(((cancelNum / total)) * 100).toFixed(2);
        progressNum = parseFloat(((progressNum / total)) * 100).toFixed(2);

        total = null;

        return success({
            data: [
                {
                    "total_completed": orderNum +"%",
                    "total_cancelled": cancelNum +"%",
                    "on_progress": progressNum +"%"
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}