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

    def mutate(self, info, capacity, url, members):
        user = info.context.user

        if user.is_anonymous:
            raise Exception('Log in to create a room.')

        room = Room(capacity=capacity, url = url, members = "", owner = user)
        room.save()
        return CreateRoom(room=room)

class UpdateRoom(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        room_id = graphene.Int(required = True)
        capacity = graphene.String()
        url = graphene.String()
        members = graphene.String()

    def mutate(self, info, room_id, capacity, url, members):
        user =  info.context.user
        room = Room.objects.get(id = room_id)

        if room.owner != user:
            raise Exception("Not permitted to update this room.")
        room.capacity = capacity
        room.url = url
        room.members = members

        room.save()

        return UpdateRoom(room = room)

class DeleteRoom(graphene.Mutation):
    room_id = graphene.Int()

    class Arguments:
        room_id = graphene.Int(required = True)

    def mutate(self, info, room_id):
        user = info.context.user
        room = Room.objects.get(id = room_id)

        # if room.owner != user:
        #     raise Exception("Not permitted to delete this room.")

        room.delete()

        return DeleteRoom(room_id = room_id)

class Mutation(graphene.ObjectType):
    create_room = CreateRoom.Field()
    update_room = UpdateRoom.Field()
    delete_room = DeleteRoom.Field()

