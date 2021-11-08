import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';

export class GraphQLService implements GqlOptionsFactory {
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      typePaths: ['./**/*.graphql'],
      playground: true,
      debug: true,
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
    };
  }
}