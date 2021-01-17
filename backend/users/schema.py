import graphene
from graphene_django import DjangoObjectType
# from .models import User
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from graphql_jwt.utils import jwt_encode, jwt_payload
from django.template.loader import render_to_string
from django.conf import settings

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    existUsername = graphene.Boolean(username=graphene.String(required=True))
    confirm = graphene.Boolean(email=graphene.String(required=True))
    existEmail = graphene.Boolean(email=graphene.String(required=True))
    users = graphene.List(UserType)
    me = graphene.Field(UserType)

    def resolve_confirm(self, info, email):
        user = get_user_model().objects.get(email=email)
        return user.is_confirmed

    def resolve_existEmail(self, info, email):
        try:
            get_user_model().objects.get(email=email)
            return True
        except get_user_model().DoesNotExist:
            return False

    def resolve_existUsername(self, info, username): 
        try:
            get_user_model().objects.get(username=username)
            return True
        except get_user_model().DoesNotExist:
            return False

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
        email = graphene.String(required=True)
   
    def mutate(self, info, username, password, nickname, email):
        user = get_user_model()(username=username, password=password, nickname=nickname, email=email)
        user.set_password(password)
        user.is_confirmed = False
        user.save()
        sendEmail(user)
        
        return CreateUser(user=user)

def sendEmail(user):
    payload = jwt_payload(user)
    token = jwt_encode(payload)
    link = settings.FRONTEND_URL + "/verify-email/" + token
    msg_plain = render_to_string('email.txt', {'username': user.username, 'link': link})
    send_mail(
    'Activate your account for BoardGame',
    msg_plain,
    None,
    ["uclaucsdgame@gmail.com"],
    fail_silently=False,
        )


class ConfirmUser(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        email = graphene.String()
    
    def mutate(self, info, email):
        print("enter here")
        user = get_user_model().objects.get(email=email)
        sendEmail(user)
        return ConfirmUser(success=True)
        # try:
        #     sendEmail(user)
        #     return ConfirmUser(success=True)
        # except:
        #     return ConfirmUser(success=False)



class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String()
        nickname = graphene.String()
        friends = graphene.String()
        email = graphene.String()
        is_confirmed = graphene.Boolean()

        
    
    def mutate(self, info, username=None, password=None, nickname=None, friends=None, email=None, is_confirmed=None):
        user = get_user_model().objects.get(username=username)

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
        if email:
            user.email = email
        if is_confirmed!=None:
            user.is_confirmed = is_confirmed

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
    confirm_user = ConfirmUser.Field()