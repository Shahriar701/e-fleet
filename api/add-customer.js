import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');
const moment = require('moment');

export async function main(event, context) {

    const data = JSON.parse(event.body);

    data.orientation = data.orientation;
    data.name = data.name;
    data.email = data.email;
    data.type = data.type;
    data.phone = data.phone;
    data.created_at = Date.now();
    data.created_date = moment().add(-2, 'hours').format('YYYY-MM-DDThh:mm:ss');
    data.customer_id = data.phone + '_' +abbreviate(data.name, {length: 4}).toLowerCase() + '_' +  data.orientation.toLowerCase();
    data.pk = data.customer_id;
    data.sk = data.type;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "customer_id <> :ci OR phone <> :phone OR email <> :email",
    ExpressionAttributeValues:{
        ":ci": data.customer_id,
        ":phone": data.phone,
        ":email": data.email
    }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success({
      data: params.Item,
      isExecuted: true,
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}
