import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 50;
  let sk = query && query.sk ? query.sk : 'order';
  let pk = query && query.pk ? query.pk : "";
  let status = query && query.status ? query.status : "";

  if (!pk && !status) {
    const params = {
      TableName: process.env.tableName,
      IndexName: "reverse-index",
      KeyConditionExpression: "#sk = :sk",
      ExpressionAttributeNames: {
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ":sk": sk
      },
      Limit: limit,
      ScanIndexForward: true
    };

    try {
      const result = await dynamoDbLib.call("query", params);
      return success({
        data: result.Items,
        isExecuted: true
      });
    } catch (e) {
      return failure({ isExecuted: false, error: e });
    }
  } else if (!pk) {
    const params = {
      TableName: process.env.tableName,
      IndexName: "reverse-index",
      KeyConditionExpression: "#sk = :sk",
      ExpressionAttributeNames: {
        '#sk': 'sk',
        "#status": 'status',

      },
      ExpressionAttributeValues: {
        ":sk": sk,
        ":status": status
      },
      FilterExpression: "begins_with(#status, :status)",
      Limit: limit,
      ScanIndexForward: true
    };

    try {
      const result = await dynamoDbLib.call("query", params);
      return success({
        data: result.Items,
        isExecuted: true
      });
    } catch (e) {
      return failure({ isExecuted: false, error: e });
    }
  } else if (!status) {
    const params = {
      TableName: process.env.tableName,
      IndexName: "reverse-index",
      KeyConditionExpression: "#sk = :sk and begins_with(#pk, :pk)",
      ExpressionAttributeNames: {
        '#sk': 'sk',
        "#pk": 'pk',

      },
      ExpressionAttributeValues: {
        ":sk": sk,
        ":pk": pk
      },
      Limit: limit,
      ScanIndexForward: true
    };

    try {
      const result = await dynamoDbLib.call("query", params);
      return success({
        data: result.Items,
        isExecuted: true
      });
    } catch (e) {
      return failure({ isExecuted: false, error: e });
    }
  } else {
    const params = {
      TableName: process.env.tableName,
      IndexName: "reverse-index",
      KeyConditionExpression: "#sk = :sk and begins_with(#pk, :pk)",
      ExpressionAttributeNames: {
        '#sk': 'sk',
        '#pk': 'pk',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ":sk": sk,
        ':pk': pk,
        ':status': status
      },
      FilterExpression: "begins_with(#status, :status)",
      Limit: limit,
      ScanIndexForward: true
    };
  }

  try {
    const result = await dynamoDbLib.call("query", params);
    return success({
      data: result.Items,
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error : e });
  }
}
