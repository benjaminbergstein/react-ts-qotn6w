import { graphql, buildSchema } from "graphql";
import { v4 as uuidv4 } from "uuid";
import schemaSource from "./schema";
const schema = buildSchema(schemaSource);
const all = async (kv, type) => {
    const listResults = await kv.list({ prefix: `${type}:record:` });
    const results = await Promise.all(listResults.keys.map(async ({ name: key }) => JSON.parse(await kv.get(key))));
    return results;
};
const get = async (kv, type, id) => {
    const data = await kv.get(`${type}:record:${id}`);
    return JSON.parse(data);
};
const put = async (kv, type, { id: providedId = undefined, ...data }) => {
    const id = providedId || uuidv4();
    const record = { ...data, id };
    await kv.put(`${type}:record:${id}`, JSON.stringify(record));
    return record;
};
const _delete = async (kv, type, id) => {
    const data = await get(kv, type, id);
    if (!data)
        throw new Error(`Could not find ${type} to delete`);
    await kv.delete(`${type}:record:${id}`);
    return data;
};
var rootValue = {
    putObject: async ({ input }, { kv }) => put(kv, input.type, input),
    getObject: async ({ id, type }, { kv }) => get(kv, type, id),
    allObjects: async ({ type }, { kv }) => all(kv, type),
    allPlaylist: async (_, { kv }) => all(kv, "playlist"),
    getPlaylist: async ({ playlistId }, { kv }) => get(kv, "playlist", playlistId),
    deletePlaylist: async ({ playlistId }, { kv }) => _delete(kv, "playlist", playlistId),
    createPlaylist: async ({ input }, { kv }) => put(kv, "playlist", input),
};
export async function onRequest(context) {
    try {
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Max-Age": "86400",
        };
        const { request, env, params, waitUntil, next, data, } = context;
        const body = await request.json();
        const res = await graphql({
            schema,
            source: body.query,
            variableValues: body.variables,
            rootValue,
            contextValue: {
                kv: env.ROAMTUNES,
            },
        });
        return new Response(JSON.stringify(res), { headers });
    }
    catch (e) {
        return new Response(JSON.stringify({
            data: null,
            error: {
                message: e?.message,
                fileName: e?.fileName,
                lineNumber: e?.lineNumber,
            },
        }));
    }
}
//# sourceMappingURL=graphql.js.map