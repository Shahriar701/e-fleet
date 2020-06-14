// import * as dynamoDbLib from "../libs/dynamodb-lib";
// import { success, failure } from "../libs/response-lib";

// export async function main(event, context) {

//   try {
//     const data = JSON.parse(event.body);

//     const params = null;
//     params = {
//       TransactItems: [{
//         Put: {
//           TableName: process.env.tableName,
//           order_id: data.order_id,
//           created_at: Date.now(),
//           orientation: data.orientation,
//           pk: data.order_id,
//           sk: data.orientation,

//           ConditionExpression: "order_id <> :oi ",
//           ExpressionAttributeValues: {
//             ":oi": data.order_id
//           }
//         }
//       }, {
//         Update: {
//           TableName: process.env.tableName,
//           Item: element,
//           Key: {
//             pk: element.pk,
//             sk: element.sk
//           },
//           UpdateExpression: "SET #status = :status",
//           ExpressionAttributeNames: {
//             "#status": 'status'
//           },
//           ExpressionAttributeValues: {
//             ":status": element.status
//           },
//           ReturnValues: "ALL_NEW"
//         }
//       }]
//     };

//     await dynamoDbLib.call("transactWrite", params);


//     return success({
//       data: params.TransactItems,
//       isExecuted: true
//     });
//   } catch (e) {
//     return failure({ status: false, error: e });
//   }
// }
