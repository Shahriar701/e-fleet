import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 100;
  let status = query && query.status ? query.status : 'available';
  let pk = query && query.pk ? query.pk : "";
  let capacity = query && query.capacity ? query.capacity : "";
  let type = query && query.type ? query.type : "";

  var params;
  try {
    if (!pk && !capacity && !type) {
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
    } else if (!pk && !type) {
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
    } else if (!pk && !capacity) {
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
        KeyConditionExpression: "#status = :status and begins_with(#pk, :pk)",
        ExpressionAttributeNames: {
          '#status': 'status',
          "#pk": 'pk',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":pk": pk
        },
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!pk) {
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
        KeyConditionExpression: "#status = :status and begins_with(#pk, :pk)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#pk': 'pk',
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':pk': pk,
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
        KeyConditionExpression: "#status = :status and begins_with(#pk, :pk)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#pk': 'pk',
          '#capacity': 'capacity'
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':pk': pk,
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
        KeyConditionExpression: "#status = :status and begins_with(#pk, :pk)",
        ExpressionAttributeNames: {
          '#status': 'status',
          '#pk': 'pk',
          '#capacity': 'capacity',
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ":status": status,
          ':pk': pk,
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

