import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment-timezone');
const date = new Date();

export async function main(event, context) {

    let today = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    let yesterday = moment(date).tz("Asia/Dhaka").add(-1, "days").format("YYYY-MM-DDThh:mm:ss");
    let thisWeek = moment(date).tz("Asia/Dhaka").add(-7, "days").format("YYYY-MM-DDThh:mm:ss");
    let lastWeek = moment(date).tz("Asia/Dhaka").add(-14, "days").format("YYYY-MM-DDThh:mm:ss");
    let lastMonth = moment(date).tz("Asia/Dhaka").add(-30, "days").format("YYYY-MM-DDThh:mm:ss");

    let targets = [lastMonth, lastWeek, thisWeek, yesterday, today];

    let getQuery = ["target", "consignmentDone"];
    let seriesname = ["Target Value", "Actual Projection"];

    var params;
    var targetValue = [];
    var actualProjection = [];

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
                    Select: "COUNT",
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
                        num = num + parseInt(element.target_value);
                    });

                    targetValue.push({ value: num.toString() });

                } else {
                    actualProjection.push({ value: count.toString() });
                }

                num = null;
                count = null;
                result = null;

            };

        }

        return success({
            data: [
                {
                    seriesname: seriesname[0],
                    data: targetValue,
                },
                {
                    seriesname: seriesname[1],
                    data: actualProjection,
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}