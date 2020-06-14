import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');
const moment = require('moment');

export async function main(event, context) {

    const data = JSON.parse(event.body);
    data.orientation = data.orientation;
    data.type = data.type;
    data.name = data.name;
    data.phone = data.phone;
    data.created_at = Date.now();
    data.created_date = moment().add(-2, 'hours').format('YYYY-MM-DD hh:mm:ss');
    data.vendor_id = data.phone + '_' +
            abbreviate(data.name, {length: 4}).toLowerCase() + '_' +
                     data.orientation.toLowerCase();
    data.pk = data.vendor_id;
    data.sk = data.type;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "vendor_id <> :vi OR phone <> :phone",
    ExpressionAttributeValues:{
        ":vi": data.vendor_id,
        ":phone": data.phone
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
