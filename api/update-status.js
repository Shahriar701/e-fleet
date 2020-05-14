import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const util = require('./utils');

export async function main(event, context) {
  const data = JSON.parse(event.body);

  let pk = util.getPk(event.headers);
  let sk = util.getSk(event.headers);

  const params = {
    TableName: process.env.tableName,
    Key: {
      pk: pk,
      sk: sk
    },

    UpdateExpression: "SET status = :status",
    ExpressionAttributeValues: {
      ":status": data.status || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
