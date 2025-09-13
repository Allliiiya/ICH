package store


type Store interface {
	EventStore() EventStore
	UserStore()  UserStore
}