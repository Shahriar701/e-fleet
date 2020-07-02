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
        UpdateExpression: "SET #status = :status, #previous_status = :previous_status, #updated_by = :updated_by",
        ExpressionAttributeNames: {
          "#status": 'status',
          "#previous_status": 'previous_status',
          "#updated_by": 'updated_by'
        },
        ExpressionAttributeValues: {
          ":status": element.status,
          ":updated_by": element.updated_by,
          ":previous_status": element.previous_status,

        },
        ReturnValues: "ALL_NEW"
      };

      await dynamoDbLib.call("update", params);
    });

    await dynamoDbLib.call("update", params);
    return success({
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}