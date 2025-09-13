package store 

import "errors"

var (
	ErrUserNotFound         = errors.New("user does not exist")
	ErrUserAlreadyExist     = errors.New("user already exist")
	ErrIDNotFound		    = errors.New("event ID not found")
	ErrFailedToDeleteEvent  = errors.New("failed to delete event")
	ErrInvalidID		    = errors.New("invalid event ID")
)