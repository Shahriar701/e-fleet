// import * as dynamoDbLib from "../libs/dynamodb-lib";
// import { success, failure } from "../libs/response-lib";

// export async function main(event, context) {

<<<<<<< HEAD
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
=======
  try {
    const data = JSON.parse(event.body);
    data.pk = data.order_id;
    data.sk = data.orientation;
    var params;
    params = {
      TransactItems: [{
        Put: {
          TableName: process.env.tableName,
          Item: data,
          order_id: data.order_id,
          created_at: Date.now(),
          orientation: data.orientation,

          ConditionExpression: "order_id <> :oi ",
          ExpressionAttributeValues: {
            ":oi": data.order_id
          }
        }
      }, {
        Update: {
          TableName: process.env.tableName,
          Item: data,
          Key: {
            pk: data.pk,
            sk: data.sk
          },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: {
            "#status": 'status',
            '#pk': 'pk',
            '#sk': 'sk'
          },
          ExpressionAttributeValues: {
            ":status": data.status,
            ":pk": data.pk,
            ":sk": data.sk
          },
          ReturnValues: "ALL_NEW"
        }
      }]
    };
>>>>>>> 05170b4f3dbdd5d3f29f5c1fb9484b0209885828

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

<<<<<<< HEAD
//     await dynamoDbLib.call("transactWrite", params);


//     return success({
//       data: params.TransactItems,
//       isExecuted: true
//     });
//   } catch (e) {
//     return failure({ status: false, error: e });
//   }
// }
=======
    return success({
      data: params,
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}
>>>>>>> 05170b4f3dbdd5d3f29f5c1fb9484b0209885828
