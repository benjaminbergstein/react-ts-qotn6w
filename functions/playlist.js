import fetch from "isomorphic-unfetch";
const apiUrl = "https://graphql.fauna.com/graphql";
async function graphql({ query, variables = undefined, }) {
    console.log(global.config);
    const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(variables ? { query, variables } : { query }),
        headers: {
            Authorization: `Bearer ${global.config.fauna.secret}`,
        },
    });
    const data = await res.json();
    return data;
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
//# sourceMappingURL=playlist.js.map