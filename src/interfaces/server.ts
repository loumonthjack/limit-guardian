import { ApolloServer } from "@apollo/server";
import { loadFiles, LoadFilesOptions } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { startStandaloneServer } from '@apollo/server/standalone';
import env from "../env";

async function start() {
  const loadOptions: LoadFilesOptions = {
    globOptions: {
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    },
  };
  const typeDefs = await loadFiles("./**/schema.graphql", loadOptions);
  const graphqlResolvers = await loadFiles(
    "./**/resolvers.ts",
    loadOptions,
  );
  const resolvers = mergeResolvers(graphqlResolvers);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: env.PORT },
  });
  console.log(
    `🚀 Server ready at ${ url}`,
  );
}

export default start;