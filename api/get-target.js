import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment');

export async function main(event, context) {

    let today = moment().add(-2, 'hours').format('YYYY-MM-DD');
    let thisWeek = moment().add(-7, 'days').add(-2, 'hours').format('YYYY-MM-DD');
    let lastWeek = moment().add(-14, 'days').add(-2, 'hours').format('YYYY-MM-DD');
    let lastMonth = moment().add(-30, 'days').add(-2, 'hours').format('YYYY-MM-DD');

    let targets = [lastMonth, lastWeek, thisWeek, today, today];

    let getQuery = ["target", "consignmentDone"];
    let seriesname = ["Target Value", "Actual Projection"];

    var params;
    var targetValue = [];
    var actualProjection = [];
    var temp = [];

    try {

        for (var e = 0; e < getQuery.length; e++) {

            for (var element = 0; element < targets.length - 1; element++) {

                params = {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                    ExpressionAttributeNames: {
                        '#status': 'status',
                        '#created_date': 'created_date',

                    },
                    ExpressionAttributeValues: {
                        ":status": getQuery[e],
                        ":start": targets[element],
                        ":end": targets[element + 1]

                    },
                    ScanIndexForward: false
                };

                var result = await dynamoDbLib.call("query", params);
                var count = result.Count;
                var num = 0;

                while (result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    result = await dynamoDbLib.call("query", params);
                    count += result.Count;
                }

                if (getQuery[e] === "target") {
                    result.Items.forEach(element => {
                        num = num + element.target_value;
                    });
                    targetValue.push({ value: num });
                    temp.push(result);
                    console.log(targetValue);

                } else {
                    actualProjection.push({ value: count });
                    console.log(actualProjection);
                }

            };

        }

        return success(
            [
                {
                    seriesname: seriesname[0],
                    data: targetValue,
                },
                {
                    seriesname: seriesname[1],
                    data: actualProjection,
                }
            ]
        );

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}