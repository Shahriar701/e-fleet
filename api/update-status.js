import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: data,
    Key: {
      pk: data.pk,
      sk: data.sk
    },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: {
      "#status": 'status'
    },
    ExpressionAttributeValues: {
      ":status": data.status
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({
      data: params.Item,
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}