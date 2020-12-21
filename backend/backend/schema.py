import graphene
import users.schema
import rooms.schema
import graphql_jwt

class Query(rooms.schema.Query, users.schema.Query, graphene.ObjectType):
    pass

class Mutation(rooms.schema.Mutation, users.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)