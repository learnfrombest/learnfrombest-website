import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({

  User: a
    .model({
      email: a.string().required(),
      role: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["create", "read"]),
    ]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});