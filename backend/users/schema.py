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
    me = graphene.Field(UserType)
    
    def resolve_user(self,info, id):
        return get_user_model().objects.get(id=id)

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

class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True)
        username = graphene.String()
        password = graphene.String()
        nickname = graphene.String()
        friends = graphene.String()
    
    def mutate(self, info, id, username=None, password=None, nickname=None, friends=None):
        user = get_user_model().objects.get(id=id)

        if user != info.context.user:
            raise Exception('Not permitted to update this user.')

        if username:
            user.username = username
        if password:
            user.set_password(password)
        if nickname:
            user.nickname = nickname
        if friends:
            user.friends = friends

        user.save()

        return UpdateUser(user=user)

class DeleteUser(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        user = get_user_model().objects.get(id=id)

        if user != info.context.user:
            raise Exception('Not permitted to delete this user.')
        user.delete()

        return DeleteUser(id=id)




class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()