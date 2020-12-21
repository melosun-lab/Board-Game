import graphene

from graphene_django import DjangoObjectType

from .models import Room

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
        room = Room(capacity=capacity, url = url, members = "")
        room.save()
        return CreateRoom(room=room)

class Mutation(graphene.ObjectType):
    create_room = CreateRoom.Field()