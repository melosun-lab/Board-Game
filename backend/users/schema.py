import graphene
from graphene_django import DjangoObjectType
# from .models import User
from django.contrib.auth import get_user_model

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
<<<<<<< HEAD
=======
    me = graphene.Field(UserType)
    
    def resolve_user(self,info, id):
        return get_user_model().objects.get(id=id)
>>>>>>> origin/Melo

    def resolve_users(self,info):
        return get_user_model().objects.all()
    
    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return user

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