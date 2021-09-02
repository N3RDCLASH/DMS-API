import { Inject } from '@nestjs/common';
import { RequestInjectable } from 'src/injectables/request.injectable';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class AuditingSubscriber implements EntitySubscriberInterface {
  constructor(
    connection: Connection,
    @Inject(RequestInjectable) private requestInjectable: RequestInjectable,
  ) {
    connection.subscribers.push(this);
  }
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    const user = this.requestInjectable.getUser();
    if (event.entity) {
      event.entity.created_by = user.id;
    }
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
  }

  /**
   * Called before entity insertion.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    // event.entity.updated_by =y
    const user = this.requestInjectable.getUser();
    if (event.entity) {
      event.entity.updated_by = user.id;
    }
    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called before entity insertion.
   */
  beforeRemove(event: RemoveEvent<any>) {
    console.log(
      `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
      event.entity,
    );
  }

  //   /**
  //    * Called after entity insertion.
  //    */
  //   afterInsert(event: InsertEvent<any>) {
  //     console.log(`AFTER ENTITY INSERTED: `, event.entity);
  //   }

  //   /**
  //    * Called after entity insertion.
  //    */
  //   afterUpdate(event: UpdateEvent<any>) {
  //     console.log(`AFTER ENTITY UPDATED: `, event.entity);
  //   }

  //   /**
  //    * Called after entity insertion.
  //    */
  //   afterRemove(event: RemoveEvent<any>) {
  //     console.log(
  //       `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
  //       event.entity,
  //     );
  //   }

  //   /**
  //    * Called after entity is loaded.
  //    */
  //   afterLoad(entity: any) {
  //     console.log(`AFTER ENTITY LOADED: `, entity);
  //   }
}
