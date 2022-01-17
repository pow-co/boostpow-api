require('dotenv').config()

//import * as fetch from 'node-fetch'
import * as http from 'superagent'

export const twquery = async (q) => {

  let { body } = await http.post("https://api.twetch.app/v1/graphql")
    .set({
      Authorization: `Bearer ${process.env.TWETCH_PRIVATE_KEY}`
    })
    .send({ query: q })

  /*let res = await fetch("https://api.twetch.app/v1/graphql", {
    method: "post",
    headers: {
      Authorization: `Bearer ${process.env.TWETCH_PRIVATE_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ query: q })
  });
  let jres: any = await res.json();
  return jres.data;
  */

  return body
};



const PostFields = `{
  bContent
  bContentType
  bFilename
  files
  mediaId
  createdAt
  id
  numLikes
  postsByReplyPostId {
    totalCount
  }
  replyPostId
  transaction
  type
  youLikedCalc
  userId
  userByUserId {
    icon
    name
  }
}`;

const PostDetailFields = `{
  ...${PostFields}
  parents{
    nodes{
      ...${PostFields}
    }
  }
}`;

const ReplyFields = `{
  ...${PostDetailFields}
  children {
    nodes {
      ...${PostDetailFields}
    }
  }
}`;

export const userData = `{
    me {
      createdAt
      defaultWallet
      description
      hasAutoTweetFromTwetch
      hasImageUpload
      hasTwetchToTweet
      hasEncrypted
      hideFreeNotifications
      icon
      id
      isAdmin
      isApproved
      isDarkMode
      isOneClick
      lastReadNotifications
      moneyButtonUserId
      name
      nodeId
      numPosts
      onboardedAt
      oneButtonAddress
      profileUrl
      publicKey
      publicKeys: publicKeysByUserId(filter: { revokedAt: { isNull: true } }) {
        nodes {
          id
          walletType
          signingAddress
          identityPublicKey
          encryptedMnemonic
          address
        }
      }
      purchasedAdvancedSearchAt
      purchasedDarkModeAt
      purchasedTwetchToTweetAt
      purchasedChatAt
      referralLinkId
      xpub
      __typename
    }
    currentUserId
  }
  `;

export function FetchUserName(id) {
  return twquery(`
    {
      userById(id: "${id}") {
        name
      }
    }
    `);
}

export function FetchNotifications(offset) {
  //console.log(filter);
  return twquery(`{
    me {
      notificationsByUserId(
        first: 30
        offset: ${offset}
        orderBy: ID_DESC
      ) {
        nodes {
          actorUserId
          createdAt
          description
          id
          nodeId
          postId
          price
          priceSats
          type
          url
          userId
          userByActorUserId {
            icon
            name
          }
        }
        totalCount
      }
    }
  }`);
}

export function FetchSearchResults(filter, order, offset) {
  //console.log(filter);
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {bContent: {includes: "${filter}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchPosts(filter, order, offset) {
  //console.log(filter);
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {mapComment: {includes: "${filter}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}
export function FetchHome(ticker, order, offset) {
  //console.log(filter);
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {or: [{mapComment:{includesInsensitive:"${ticker}"}}]}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}
export function FetchIdeas(filter, order, offset) {
  //console.log(filter);
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {mapComment: {includes: "${filter}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}
export function FetchProjects(filter, order, offset) {
  //console.log(filter);
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {mapComment: {includes: "${filter}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}
export function FetchJobs(ticker, order, offset) {
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {and: {bContent: {startsWith: "/job"}, mapComment: {includesInsensitive: "${ticker}"}}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchUserPosts(userId, order, offset) {
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {userId: {equalTo: "${userId}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchUserData(userId) {
  return twquery(`
  {
    userById(id: "${userId}") {
      description
      earned
      earnedCalc
      earnedSatsCalc
      followerCount
      followingCount
      icon
      id
      name
      postsEarnedCalc
      profileUrl
    }
  }`);
}

export function FetchRepliees(id) {
  return twquery(`{
    postById(id: "${id} ") {
      userId
      userByUserId {
        name
      }
    }
  }`);
}

export async function FetchPostDetail(txId) {
  let result = await twquery(`{
    allPosts(
      condition: {transaction: "${txId}"}
    ) {
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);

  if (result.data.allPosts.edges.length > 0) {

    return result.data.allPosts.edges[0]['node']

  } else {

    return null
  }

}

export function FetchPostReplies(txId, order) {
  return twquery(`
  {
    allPosts(
      condition: { transaction: "${txId}" }
      orderBy: ${order}
    ) {
      totalCount
      pageInfo{
        hasNextPage
        endCursor
      }
      nodes {
        parents {
          edges {
            node
            {
              ...${PostFields}
            }
          }
        }
        children {
          edges {
            node
            {
              ...${PostFields}
            }
          }
        }
      }
    }
  }
  `);
}
