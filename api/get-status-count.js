import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment');

export async function main(event, context) {

    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 5;
    let status = query && query.status ? query.status : 'consignmentDone';
    let today = moment().add(-2, 'hours').format('YYYY-MM-DDThh:mm:ss');
    let thisWeek = moment().add(-7, 'days').format('YYYY-MM-DDThh:mm:ss');
    let thisMonth = moment().add(-30, 'days').add(-2, 'hours').format('YYYY-MM-DDThh:mm:ss');

    try {

        const params = {
            TransactItems: [{
                Get: {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                    ExpressionAttributeNames: {
                        "#status": "status",
                        "#created_date": "created_date",
                        "#customer_type": "customer_type"
                    },
                    ExpressionAttributeValues: {
                        ":status": status,
                        ":start": today,
                        ":end": today,
                        ":customer_type": 'corporate'
                    },
                    FilterExpression: "begins_with(#customer_type, :customer_type)",
                    Limit: limit,
                    ScanIndexForward: false
                }
            }, {
                Get: {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start  AND :end",
                    ExpressionAttributeNames: {
                        '#status': 'status',
                        '#created_date': 'created_date',
                        '#customer_type': 'customer_type'
                    },
                    ExpressionAttributeValues: {
                        ":status": status,
                        ':start ': today,
                        ':end': thisWeek,
                        '#customer_type': 'individual'
                    },
                    FilterExpression: "begins_with(#customer_type, :customer_type)",
                    Limit: limit,
                    ScanIndexForward: false
                }
            },
            {
                Get: {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start  AND :end",
                    ExpressionAttributeNames: {
                        '#status': 'status',
                        '#created_date': 'created_date',
                        '#customer_type': 'customer_type'
                    },
                    ExpressionAttributeValues: {
                        ":status": status,
                        ':start ': today,
                        ':end': thisMonth,
                        '#customer_type': 'sme'
                    },
                    FilterExpression: "begins_with(#customer_type, :customer_type)",
                    Limit: limit,
                    ScanIndexForward: false
                }
            }]
        };

        await dynamoDbLib.call("transactGet", params);


        return success({
            data: params.TransactItems,
            isExecuted: true
        });
    } catch (e) {
        return failure({ status: false, error: e });
    }
}
