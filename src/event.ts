
import { Orm, create } from './orm'

import models from './models'

export class Event extends Orm {

  static model = models.Event

}

interface NewEvent {
  key: string;
  value: any;
  namespace?: string;
  error?: boolean;
}

export async function recordEvent(newEvent: NewEvent): Promise<Event> {

  newEvent = Object.assign({
    namspace: null,
    error: false
  }, newEvent)

  const event = await create<Event>(Event, newEvent)

  return event
}

