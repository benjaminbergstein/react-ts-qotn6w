import fetch from "isomorphic-unfetch";

const apiUrl = "https://graphql.fauna.com/graphql";

type Env = {
  FAUNA_SECRET: string;
};

export type QueryArgs<VariablesType = object> = {
  query: string;
  variables?: VariablesType;
  env?: Env;
};

async function graphql<DataType = object, VariablesType = object>({
  query,
  variables = undefined,
}: QueryArgs<VariablesType>): Promise<DataType> {
  console.log(global.config);
  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(variables ? { query, variables } : { query }),
    headers: {
      Authorization: `Bearer ${global.config.fauna.secret}`,
    },
  });
  const data = await res.json();
  return data as DataType;
}

const ALL_PLAYLIST = `
  query {
    allPlaylist {
      data {
        title
      }
    }
  }
`;

const CREATE_PLAYLIST = `mutation CreatePlaylist($title: String!) {
  createPlaylist(data: { title: $title }) {
    title
    _id
  }
}`;

export const all = async () => graphql({ query: ALL_PLAYLIST });
export const createPlaylist = async ({ title }) => {
  return graphql({ query: CREATE_PLAYLIST, variables: { title } });
};

// Imports the Google Cloud client library
// import { Datastore } from "@google-cloud/datastore";
// import { v4 as uuidv4 } from "uuid";

// const credentials = {
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaOoIQSF8Z0GLy\nBEaAR7YTUZdzKE6y/2tCktZc1Yilqk1Jwgt9KUJOX1H/Ihq1i6eguE/oCq/E1y3t\nfKz41JpGBpy4idWobdDtx5WUsr8og3AVCZ8Kuy/dxD69QN+fpzihhkaBTPVkLXbg\nHasNc/R2MxUhJnGmd8s4JzTkAhf50NN/rsOFkH9K/Z8fSo3ZIprPgjAbCWp7BhvT\n2tFKsHQA7CdivYZuwTSUKg6klPhOs+v8MA1pNr/dh1ebk0k1gYigy5/QtOXkzbez\nFd4b52xJcqFUEktBR+GfEXH/mCLWu2t508ddbm75iyKedbuS5+Gpi7dH2ytLLNw9\nQq13XQG9AgMBAAECggEAAb4dtCB0NXGcafPa4mYZfXydpiMSqpXewlHu/MUlwVgj\nfv1mUtQ0JUPHscvrrkLnJzZ0J920j6Ze4oC4jE2/OKpZ6pSPUqefxuP9z79AcAPy\nvxFK+NnzEk5t5FggUxcaACsrmosUUJJ2HLtu4tANHr+L57qfGoTuaBKpPPZ9cjuz\n+PHnnpZgLQHkBh8je4+4CWLx0+CIKsfqwJ+3h0gxMfOgRnEDiRSznfZ5dNpjVHvu\nQIGCjJw+t2fRgS+FyrlgQV47TuEK1OiafhMmzsehw0sjeaGixZDuk0S/1LT+Xwp8\nYCFx1+22qzgGEwHCGL4uI37vRIwKjgWcMUt+b00BLwKBgQDziceSiBIEHEni6Cuf\n1doxKq1/9AWcnjy5hq/YJJmGY2V8OfPYiAtB1eFOzJyH0aywUl+0o3QOk3ygO0wj\n6Ls+guVwqxJVoqDzugt4q55cYuAeZMrZSyCa/ZURCR2YjjW1I1E5PXVAXQPxfE/R\nHqLoMLlvDJo3MHUB5mXAyHAStwKBgQDlZS9+UmYBKTGsKVQwpZZzL7E+tqNmnxY4\n3CtlUX5r/qBZb3cXpiqu8+PWyuj4/zlqPHmqjfA27obl8I2UuZxppLHWBGG3gK2N\nNZhkGW69GCkXP799BNbZZrKy20QN8GZwRFdI0eJHGE+9uvHhHrod7mwdU+6GxLGs\nPwwUdiQLKwKBgQDhCyBwN2zuf3WHSCOHv4WwiU9qPYQyBcb3aY50nN2BYbgV4zeB\nj7VXUNyyhEDhANAi3vuxYJmOHpu7NRBW3mioiyyZwHtgxrcUgYa4K15a4MNZUqpf\nwRyQHGPzKgk/P6pBiDE2Q6RlpY5PSCA5jaXcCapRA8Q923lEGDNOwelOYQKBgB8b\nTIhttgVcR68X36HFIpS2F+vwKlJFKmdFe+D+Xw1X9viJw/WCA/G7gt7inxr8yRVd\n5AW7v6JDUCmoKBrN3Kb6vV7PM00F9wLaDLMuO7UKrK/JZjcWy+epJHxafW0Cd3Gr\n4sYuJ+gKJO4OhrRHTWe3qBOGCSdfTtSTrBiuOI8HAoGAaskG9zPMnQv+rDnKKuKW\nOEjhi3Y5CoH0JV37cup0uzlUvUKREvFwAwJc/eVozckGBAx9/DxTwPLvTxNVX+EH\n4PxzUR3/Qr3K+mt3gkCKk8UidaFWlgqBKLRwGpE9NqX8WYCzgwvMpXoBzS2UCOQt\n9wpYu1EcIwSpW7m3HD45JSQ=\n-----END PRIVATE KEY-----\n",
//   client_email: "datastore@roam-tunes-production.iam.gserviceaccount.com",
// };

// const projectId = "roam-tunes-production";
// const datastore = new Datastore({ credentials, projectId });

// const kind = "Playlist";

// export async function create({ title }) {
//   const id = uuidv4();

//   const taskKey = datastore.key([kind, id]);

//   const playlist = {
//     key: taskKey,
//     data: { id, title },
//   };

//   await datastore.save(playlist);
// }

// export async function all() {
//   const query = datastore.createQuery("Playlist");
//   return await query.run();
// }

// async function main() {
//   await create({ title: "My playlist" });
//   console.log(await all());
// }
// main().then(() => {
//   console.log("done");
// });
