import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 100;
  let sk = query && query.sk;
  let pk = query && query.pk ? query.pk : "";

  var params;
  try {
    if (!pk) {
      params = {
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
    } else {
      params = {
        TableName: process.env.tableName,
        IndexName: "reverse-index",
        KeyConditionExpression: "#sk = :sk AND begins_with(#pk, :pk)",
        ExpressionAttributeNames: {
          "#sk": 'sk',
          '#pk': 'pk'
        },
        ExpressionAttributeValues: {
          ":sk": sk,
          ":pk": pk
        },
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