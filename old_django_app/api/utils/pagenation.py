from rest_framework.pagination import (PageNumberPagination,
                                       LimitOffsetPagination)


class TweetListPagenation(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100
