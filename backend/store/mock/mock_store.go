package mock 

import (
	"chinese-heritage-backend/store"
)
type MockStore struct {
	userStore *FakeUserStore
	eventStore *FakeEventStore	
}

func NewMockStore() *MockStore {
	return &MockStore {
		userStore: NewFakeUserStore(),
		eventStore: NewFakeEventStore(),
	}
}

func (s *MockStore) UserStore() store.UserStore {
	return s.userStore
}

func (s *MockStore) EventStore() store.EventStore {
	return s.eventStore
}