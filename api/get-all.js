import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 100;
  let orientation = query && query.orientation ? query.orientation : 'order';
  let name = query && query.name ? query.name : "";
  let phone = query && query.phone ? query.phone : "";
  let email = query && query.email ? query.email : "";

  var params;
  try {
    if (!name && !phone && !email) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        ExpressionAttributeNames: {
          '#orientation': 'orientation'
        },
        ExpressionAttributeValues: {
          ":orientation": orientation
        },
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!name && !email) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          "#phone": 'phone',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ":phone": phone
        },
        FilterExpression: "begins_with(#phone, :phone)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!name && !phone) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          "#email": 'email',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ":email": email
        },
        FilterExpression: "begins_with(#email, :email)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!phone && !email) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#name, :name)",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          "#name": 'name',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ":name": name
        },
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!name) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          '#phone': 'phone',
          '#email': 'email',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ':phone': phone,
          ':email': email
        },
        FilterExpression: "begins_with(#phone, :phone) AND begins_with(#email, :email)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!phone) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#name, :name)",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          '#name': 'name',
          '#email': 'email',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ':name': name,
          ':email': email
        },
        FilterExpression: "begins_with(#email, :email)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else if (!email) {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#name, :name)",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          '#name': 'name',
          '#phone': 'phone'
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ':name': name,
          ':phone': phone
        },
        FilterExpression: "begins_with(#phone, :phone)",
        Limit: limit,
        ScanIndexForward: true
      };
    } else {
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#name, :name)",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          '#name': 'name',
          '#phone': 'phone',
          '#email': 'email',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ':name': name,
          ':phone': phone,
          ':email': email
        },
        FilterExpression: "begins_with(#phone, :phone) AND begins_with(#email, :email)",
        Limit: limit,
        ScanIndexForward: true
      };
    }
    var result = await dynamoDbLib.call("query", params);

    if (result.LastEvaluatedKey) {
      params.ExclusiveStartKey = result.LastEvaluatedKey;
      result = await dynamoDbLib.call("query", params);
    }

    return success({
      data: result.Items,
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}