import graphene
import users.schema
import rooms.schema

class Query(rooms.schema.Query, users.schema.Query, graphene.ObjectType):
    pass

class Mutation(rooms.schema.Mutation, users.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)