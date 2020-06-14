import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 100;
  let status = query && query.status ? query.status : 'available';
  let date = query && query.created_date ? query.created_date : "";
  let capacity = query && query.capacity ? query.capacity : "";
  let type = query && query.type ? query.type : "";

  var params;
  try {
    if (!date && !capacity && !type) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ":status": status
        },
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!date && !type) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          '#status': 'status',
          "#capacity": 'capacity',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":capacity": capacity
        },
        FilterExpression: "begins_with(#capacity, :capacity)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!date && !capacity) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          '#status': 'status',
          "#type": 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":type": type
        },
        FilterExpression: "begins_with(#type, :type)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!capacity && !type) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
        ExpressionAttributeNames: {
          '#status': 'status',
          "#created_date": 'created_date',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":created_date": date
        },
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!date) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#capacity': 'capacity',
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':capacity': capacity,
          ':type': type
        },
        FilterExpression: "begins_with(#capacity, :capacity) AND begins_with(#type, :type)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!capacity) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#created_date': 'created_date',
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':created_date': date,
          ':type': type
        },
        FilterExpression: "begins_with(#type, :type)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!type) {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#created_date': 'created_date',
          '#capacity': 'capacity'
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':created_date': date,
          ':capacity': capacity
        },
        FilterExpression: "begins_with(#capacity, :capacity)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else {
      params = {
        TableName: process.env.tableName,
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#created_date': 'created_date',
          '#capacity': 'capacity',
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':created_date': date,
          ':capacity': capacity,
          ':type': type
        },
        FilterExpression: "begins_with(#capacity, :capacity) AND begins_with(#type, :type)",
        Limit: limit,
        ScanIndexForward: true
      };
    }

    const result = await dynamoDbLib.call("query", params);

    return success({
      data: result.Items,
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}

