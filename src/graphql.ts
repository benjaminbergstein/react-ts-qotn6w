import { httpProtocol, apiHost } from "./constants";
import { DocumentNode } from "graphql";

const apiUrl = `${httpProtocol}//${apiHost}/graphql`;

export type QueryArgs<VariablesType = object> = {
  query: DocumentNode;
  variables?: VariablesType;
};

async function graphql<DataType = object, VariablesType = object>({
  query: documentNode,
  variables = undefined,
}: QueryArgs<VariablesType>): Promise<DataType> {
  const query = documentNode.loc.source.body;
  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(variables ? { query, variables } : { query }),
  });
  const data = await res.json();
  return data as DataType;
}

export default graphql;
