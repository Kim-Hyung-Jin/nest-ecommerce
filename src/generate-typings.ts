import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'lodash';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  watch: true,
  skipResolverArgs: true,
});
