// this file contains error definitions used across the models package.
// should be use by other packages to check for specific model structure related errors.

package models

import "errors"

var (
	ErrInvalidDateFormat = errors.New("invalid date format, expected YYYY-MM-DD")
	// if expired date is before event date, it get set to event date
	// to ensure that the event is still valid on its event date.
	// This is to avoid rejecting events that are still valid on their event date
	// just because the expired date was set incorrectly.
	// Users can always update the event to set a correct expired date later.
	// Therefore, we do not return an error in this case.
	// ErrExpiredDate	     = errors.New("event date cannot be in the past")

	ErrMissingDate	     = errors.New("missing required field: date")
	ErrMissingLink	     = errors.New("missing required field: link")
	ErrMissingLocation   = errors.New("missing required field: location")
	ErrMissingName	     = errors.New("missing required field: name")
)