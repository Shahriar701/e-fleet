import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require("moment");

export async function main(event, context) {

    let today = moment().add(-2, "hours").format('YYYY-MM-DDThh:mm:ss');
    let thisWeek = moment().add(-7, "days").add(-2, "hours").format('YYYY-MM-DDThh:mm:ss');
    let lastMonth = moment().add(-30, "days").add(-2, "hours").format('YYYY-MM-DDThh:mm:ss');

    let targets = [lastMonth, thisWeek, today, today];

    let seriesname = ["Individual", "SME", "Corporate"];
    let series = ["Individual", "SME", "Corporate"];

    var params;
    var individual = [];
    var sme = [];
    var corporate = [];

    try {

        for (var e = 0; e < seriesname.length; e++) {

            for (var element = 0; element < targets.length - 1; element++) {

                params = {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                    ExpressionAttributeNames: {
                        "#status": "status",
                        "#created_date": "created_date",
                        "#type": "type"
                    },
                    ExpressionAttributeValues: {
                        ":status": "consignmentDone",
                        ":start": targets[element],
                        ":end": targets[element + 1],
                        ":type": seriesname[e]
                    },

                    FilterExpression: "begins_with(#type, :type)",
                    ScanIndexForward: false
                };

                var result = await dynamoDbLib.call("query", params);
                var count = result.Count;

                while (result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    result = await dynamoDbLib.call("query", params);
                    count += result.Count;
                }

                if (seriesname[e] === "Individual") {
                    individual.push({ value: count.toString() });

                } else if (seriesname[e] === "SME") {
                    sme.push({ value: count.toString() });

                } else {
                    corporate.push({ value: count.toString() });

                }

                count = null;
                result = null;

            };

        }

        return success({
            data: [
                {
                    seriesname: series[0],
                    data: individual,
                },
                {
                    seriesname: series[1],
                    data: sme
                },
                {
                    seriesname: series[2],
                    data: corporate
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
