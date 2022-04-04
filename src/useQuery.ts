import useSWR, { SWRResponse, SWRConfiguration } from "swr";
import { isServer } from "./constants";
import graphql, { QueryArgs } from "./graphql";

function useQuery<DataType = object, VariablesType = object>(
  { query, variables }: QueryArgs<VariablesType>,
  options: SWRConfiguration<DataType> = undefined
): SWRResponse<DataType, object> {
  return useSWR<DataType>(
    isServer
      ? null
      : `${query}:${Object.entries(variables || {})
          .flat()
          .join("/")}`,
    async () => graphql<DataType, VariablesType>({ query, variables })
  );
}

export default useQuery;
