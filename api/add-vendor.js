import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');

export async function main(event, context) {

    const data = JSON.parse(event.body);
    data.orientation = data.orientation.toLowerCase();
    data.vendor_name = data.vendor_name;
    data.vendor_phn = data.vendor_phn;
    data.created_at = Date.now();
    data.vendor_id = data.vendor_phn+'_'+abbreviate(data.vendor_name, {length: 4}).toLowerCase() + '_' + data.orientation;
    data.pk = data.vendor_id;
    data.sk = data.orientation;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "vendor_id <> :vi ",
    ExpressionAttributeValues:{
        ":vi": data.vendor_id
      }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success({
      data: params.Item,
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}
