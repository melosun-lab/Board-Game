import graphene
from graphene_django import DjangoObjectType
from .models import Room
from django.contrib.auth import get_user_model

class RoomType(DjangoObjectType):
    class Meta:
        model = Room

class Query(graphene.ObjectType):
    rooms = graphene.List(RoomType)

    def resolve_rooms(self, info):
        return Room.objects.all()

class CreateRoom(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        capacity = graphene.String()
        url = graphene.String()
        members = graphene.String()
        name = graphene.String()
        game = graphene.String()

    def mutate(self, info, capacity, url, members, name, game):
        user = info.context.user

        if user.is_anonymous:
            raise Exception('Log in to create a room.')

        room = Room(capacity=capacity, url = url, members = user.username, owner = user, name = name, game = game)
        room.save()
        return CreateRoom(room=room)

class UpdateRoom(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        id = graphene.Int(required = True)
        capacity = graphene.String()
        url = graphene.String()
        members = graphene.String()
        name = graphene.String()
        game = graphene.String()

    def mutate(self, info, id, capacity=None, url=None, members=None, name=None, game=None):
        user =  info.context.user
        room = Room.objects.get(id = id)

        if room.owner != user:
            raise Exception("Not permitted to update this room.")
        if capacity:
            room.capacity = capacity
        if url:
            room.url = url
        if members:
            room.members = members
        if name:
            room.name = name
        if game:
            room.game = game

        room.save()

        return UpdateRoom(room = room)

class DeleteRoom(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required = True)

    def mutate(self, info, id):
        user = info.context.user
        room = Room.objects.get(id = id)

        if room.owner != user:
            raise Exception("Not permitted to delete this room.")

        room.delete()

        return DeleteRoom(id = id)

class Mutation(graphene.ObjectType):
    create_room = CreateRoom.Field()
    update_room = UpdateRoom.Field()
    delete_room = DeleteRoom.Field()