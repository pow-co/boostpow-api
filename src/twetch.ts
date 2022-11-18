const { GraphQLClient, gql }  = require("graphql-request");

const graphqlAPI = "https://gw.twetch.app";
//const authToken = process.env.TOKEN_TWETCH_AUTH;
const authToken = "";

const graphqlClient = new GraphQLClient(graphqlAPI, {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const postDetailQuery = async (txid) => {
  console.log(txid)
  let query = `
  query postDetailQuery($txid: String!) {
    allPosts(condition: { transaction: $txid }) {
      edges {
        node {
          bContent
          bContentType
          createdAt
          files
          id
          numBranches
          numLikes
          postsByReplyPostId {
            totalCount
          }
          replyPostId
          transaction
          type
          youBranchedCalc
          youLikedCalc
          userId
          userByUserId {
            icon
            name
          }
        }
      }
    }
  }
  `;

  const result = await graphqlClient.request(query, { txid });
  return result.allPosts.edges[0].node;
};
