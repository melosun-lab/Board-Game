import graphene
from graphene_django import DjangoObjectType
from .models import Room
from django.contrib.auth import get_user_model
from django.db.models import Q

class RoomType(DjangoObjectType):
    class Meta:
        model = Room

class Query(graphene.ObjectType):
    rooms = graphene.List(RoomType, search=graphene.String())

    def resolve_rooms(self, info, search=None):
        print("Query rooms!")
        if search: 
            filter = (
                Q(name__icontains=search) |
                Q(game__icontains=search) |
                Q(capacity__icontains=search) |
                Q(members__icontains=search) |
                Q(owner__username__icontains=search)
            )
            return Room.objects.filter(filter)
        return Room.objects.all()

class CreateRoom(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        capacity = graphene.String()
        url = graphene.String()
        name = graphene.String()
        game = graphene.String()

    def mutate(self, info, capacity, url, name, game):
        user = info.context.user

        if user.is_anonymous:
            raise Exception('Log in to create a room.')

        room = Room(capacity=capacity, url = url, owner = user, name = name, game = game)
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

        # if room.owner != user:
        #     raise Exception("Not permitted to update this room.")
        if capacity:
            room.capacity = capacity
        if url:
            room.url = url
        if members:
            room.members.add(user)
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

