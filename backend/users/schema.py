import graphene
from graphene_django import DjangoObjectType
# from .models import User
from django.contrib.auth import get_user_model

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    users = graphene.List(UserType)

    def resolve_user(self,info, id):
        return get_user_model().objects.get(id=id)

    def resolve_users(self,info):
        return get_user_model().objects.all()

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        nickname = graphene.String(required=True)
    
    def mutate(self, info, username, password, nickname):
        user = get_user_model()(username=username, password=password, nickname=nickname)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()