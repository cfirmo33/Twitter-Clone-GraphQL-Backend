import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../schema';
import { setupTest, getContext } from '../../../test/helper';

import User from '../model/User';
import Tweet from '../model/Tweet';

beforeEach(async () => await setupTest());

it('should not allow anonymous user', async () => {
  const query = `
    mutation M {
      TweetEdit(input: {
        id: "Example Id"
        exampleField: "Example field"
      }) {
        exampleFieldToRetrieve
      }
    }
  `;

  const rootValue = {};
  // No user should be passed to context since we are testing an anonymous session
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});

it('should create a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  const query = `
    mutation M {
      TweetEdit(input: {
        id: "Example Id"
        exampleField: "Example field"
      }) {
        exampleFieldToRetrieve
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});
