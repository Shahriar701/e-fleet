
function searchBlogByTitle(query: string, itemsPerPage: number, lastEvaluatedKey?: string): Promise<any> {
    const FIXED_ID_FOR_SEARCH_GSI = "1233421345223";
    let params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: "Blog",
      IndexName: "BlogSearch",
      KeyConditionExpression: "fixedIdForSearchGSI = :pkv",
      FilterExpression: "contains(titleInLowerCase, :titleV)",
      ExpressionAttributeValues: {
        ":pkv": FIXED_ID_FOR_SEARCH_GSI,
        ":titleV": query.toLocaleLowerCase()
      }
    };
    params.Limit = itemsPerPage;
    if (lastEvaluatedKey) {
      let keyValues = lastEvaluatedKey.toString().split(",");
      // set ExclusiveStartKey only when server get complete lastEvaluatedKey as sent by it
      if (keyValues.length === 3) {
        params.ExclusiveStartKey = {
          bid: keyValues[0],
          title_bid: keyValues[1],
          fixedIdForSearchGSI: keyValues[2]
        };
      }
    }
    return performPaginatedOperation(params, "query", ["bid", "title_bid", "fixedIdForSearchGSI"]);

  }

  // This is a generic method that can perform pagination on any table and for both scan as well as query operation.
  function performPaginatedOperation(params: AWS.DynamoDB.DocumentClient.QueryInput | AWS.DynamoDB.DocumentClient.ScanInput,
    operationName: string, tableLastEvaluatedKeyFieldNames: Array<string>): Promise<Object> {

    return new Promise((resolve, reject) => {
      const dataWithKey = {
        lastEvaluatedKey: undefined,
        result: []
      };
      // adding 1 extra items due to a corner case bug in DynamoDB, find details below.
      const originalItemPerPageCount = params.Limit;
      params.Limit = params.Limit + 1;
      let remainingItemsCount = 0;
      // DatabaseProvider.getDocumentClient() should give us the dynamoDB DocumentClient object
      // How to get DocumentClient: http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01
      DatabaseProvider.getDocumentClient()[operationName](params, onScan);


      function onScan(err, data) {
        if (err) {
          return reject(err);
        }
        dataWithKey.result = dataWithKey.result.concat(data.Items);
        remainingItemsCount = (originalItemPerPageCount + 1) - dataWithKey.result.length;
        if (remainingItemsCount > 0) {
          if (typeof data.LastEvaluatedKey === "undefined") {
            // pagination done, this is the last page as LastEvaluatedKey is undefined
            return resolve(dataWithKey);
          } else {
            // Continuing pagination for more data
            // as we didnot get our desired itemsPerPage. Remember ScannedCount and Count fields!!
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            params.Limit = remainingItemsCount;
            DatabaseProvider.getDocumentClient()[operationName](params, onScan);
          }
        } else {
          dataWithKey.result = dataWithKey.result.slice(0, originalItemPerPageCount);
          // pagination done, but this is not the last page. making lastEvaluatedKey to
          // send to browser
          dataWithKey.lastEvaluatedKey = prepareLastEvaluatedKeyString(
            dataWithKey.result[originalItemPerPageCount - 1], tableLastEvaluatedKeyFieldNames);
          return resolve(dataWithKey);
        }
      }
    });
  }

  // Preparing lastEvaluatedKey as comma seperated values of lastEvaluatedKey fields
  function prepareLastEvaluatedKeyString(dataObj: Object, tableLastEvaluatedKeyFieldNames: Array<string>) {
    let key = "";
    tableLastEvaluatedKeyFieldNames.forEach((field: string) => {
      key += dataObj[field] + ",";
    });
    if (key !== "") {
      key = key.substr(0, key.length - 1);
    }
    return key;
  }