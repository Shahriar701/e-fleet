import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    var params;

    data.forEach(async element => {
      params = {
        TableName: process.env.tableName,
        Item: element,
        Key: {
          pk: element.pk,
          sk: element.sk
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": 'status'
        },
        ExpressionAttributeValues: {
          ":status": element.status
        },
        ReturnValues: "ALL_NEW"
      };

     await dynamoDbLib.call("update", params);
    });

    // for(var element = 0; element< data.length; element++){
    //     params = {
    //     TableName: process.env.tableName,
    //     Item: element,
    //     Key: {
    //       pk: element.pk,
    //       sk: element.sk
    //     },
    //     UpdateExpression: "SET #status = :status",
    //     ExpressionAttributeNames: {
    //       "#status": 'status'
    //     },
    //     ExpressionAttributeValues: {
    //       ":status": element.status
    //     },
    //     ReturnValues: "ALL_NEW"
    //   };
    //   await dynamoDbLib.call("update", params);
    // }

    await dynamoDbLib.call("update", params);
    return success({
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}