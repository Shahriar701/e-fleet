import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TransactItems: [{
      Update: {
        TableName: process.env.tableName,
        Item: data,
        Key: {
          pk: data[0].pk,
          sk: data[0].sk
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": 'status'
        },
        ExpressionAttributeValues: {
          ":status": data[0].status
        },
        ReturnValues: "ALL_NEW"
      }
    },{
      Update: {
        TableName: process.env.tableName,
        Item: data,
        Key: {
          pk: data[1].pk,
          sk: data[1].sk
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": 'status'
        },
        ExpressionAttributeValues: {
          ":status": data[1].status
        },
        ReturnValues: "ALL_NEW"
      }
    }]
  };

  try {
    await dynamoDbLib.call("transactWrite", params);
    return success({
      data: params.TransactItems,
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}
